const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime');

const region = process.env.CLOUD_REGION;
const keyId = process.env.CLOUD_KEY_ID;
const secret = process.env.CLOUD_SECRET;

if (!region || !keyId || !secret) {
  console.warn('WARNING: Cloud AI credentials not configured.');
}

const clientConfig = { region: region || 'us-east-1' };
if (keyId && secret) {
  clientConfig.credentials = { accessKeyId: keyId, secretAccessKey: secret };
}

const aiClient = new BedrockRuntimeClient(clientConfig);
module.exports = { aiClient };
