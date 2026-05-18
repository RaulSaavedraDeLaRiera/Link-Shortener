//dynamodb document client singleton
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

module.exports = dynamodb;
