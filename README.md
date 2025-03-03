# 🔮 Occultus

Occultus is a Node.js package that fetches secrets from Google Cloud Secret Manager and stores them in an environment file. This helps in keeping secrets secure while ensuring they are available for your application during development. ⚡

## ✨ Features

- 🔐 Automatically downloads and updates secrets from Google Cloud Secret Manager
- 📄 Stores secrets in an `.env` file for easy access
- 🚀 Prevents unnecessary downloads by checking the secret version
- ⚙️ Configuration stored in `package.json`
- 🛠️ Designed for **development environments only**

## 📥 Installation

Install Occultus as a **dev dependency**:

```sh
npm install occultus --save-dev
```

## ⚙️ Configuration

Add the following configuration in your `package.json` file:

```json
"occultus": {
  "projectId": "your-gcp-project-id",
  "secretName": "your-secret-name",
  "envFile": ".env"
}
```

- **projectId**: Your Google Cloud project ID
- **secretName**: The name of the secret in Secret Manager
- **envFile**: The target file where the secret will be stored

## 🚀 Usage

You can use Occultus programmatically within your Node.js application:

```javascript
import { saveSecretToEnv } from 'occultus';

await saveSecretToEnv();
```

Alternatively, add a script in `package.json` to run it easily:

```json
"scripts": {
  "fetch-secret": "node -e \"import('occultus').then(({ saveSecretToEnv }) => saveSecretToEnv())\""
}
```

Run the script with:

```sh
npm run fetch-secret
```

## 🔄 How It Works

1. 📝 Occultus reads the configuration from `package.json`.
2. 🔑 It fetches the latest version of the secret from Google Cloud Secret Manager.
3. 🛑 If the secret version is the same as the one in the `.env` file, it skips the update.
4. ✅ If the version is different, it updates the `.env` file with the new secret.

## ⚠️ Important

**Occultus is designed for development environments only!** 🚧 Do not use it in production to prevent security risks.

## 🔧 Requirements

- 📌 Node.js 14+
- ☁️ Google Cloud SDK configured with appropriate permissions

## 📜 License

MIT

