import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import fs from 'fs';
import path from 'path';

async function fetchSecret(projectId, secretName) {
    const client = new SecretManagerServiceClient();
    const secretPath = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    try {
        const [version] = await client.accessSecretVersion({ name: secretPath });
        return {
            value: version.payload.data.toString(),
            version: version.name.split('/').pop(),
        };
    } catch (error) {
        console.error(`Error fetching secret ${secretName}:`, error);
        throw error;
    }
}

export async function saveSecretToEnv() {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    if (typeof window !== 'undefined') {
        console.warn('Occultus should not be used in a browser or Edge environment.');
        return;
    }

    if (!fs.existsSync(packageJsonPath)) {
        console.error('package.json not found in project root.');
        return
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const config = packageJson['occultus'];

    if (!config || !config.projectId || !config.secretName || !config.envFile) {
        console.error('Missing configuration in package.json. Expected "occultus": { "projectId": "your-project-id", "secretName": "your-secret-name", "envFile": ".env" }');
        return
    }

    const envFilePath = path.resolve(process.cwd(), config.envFile);
    let currentEnvContent = '';
    if (fs.existsSync(envFilePath)) {
        currentEnvContent = fs.readFileSync(envFilePath, 'utf8');
        const match = currentEnvContent.match(/^SECRET_VERSION=(\d+)$/m);
        const currentVersion = match ? match[1] : null;

        const { value, version } = await fetchSecret(config.projectId, config.secretName);
        if (currentVersion === version) {
            console.log(`Secret is already up-to-date (version ${version}). Skipping download.`);
            return;
        }

        fs.writeFileSync(envFilePath, `SECRET_VERSION=${version}\n${value}`);
        console.log(`Secret updated to version ${version} and written to ${config.envFile}`);
    } else {
        const { value, version } = await fetchSecret(config.projectId, config.secretName);
        fs.writeFileSync(envFilePath, `SECRET_VERSION=${version}\n${value}`);
        console.log(`Secret written to ${config.envFile} with version ${version}`);
    }
}
