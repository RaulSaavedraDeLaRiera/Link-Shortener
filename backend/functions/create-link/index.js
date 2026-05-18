//creates a short link for the authenticated user
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const dynamodb = require('../../shared/dynamodb');
const { ok, error } = require('../../shared/response');
const { ValidationError } = require('../../shared/errors');

const TABLE = process.env.DYNAMODB_TABLE;
const BASE_URL = process.env.BASE_URL;

//generates a random 6-char alphanumeric id
const generateId = () => Math.random().toString(36).slice(2, 8);

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const { originalUrl } = JSON.parse(event.body || '{}');

    if (!originalUrl?.trim()) throw new ValidationError('originalUrl is required');

    try { new URL(originalUrl); } catch { throw new ValidationError('invalid url format'); }

    const linkId = generateId();
    const createdAt = new Date().toISOString();

    await dynamodb.send(new PutCommand({
      TableName: TABLE,
      Item: { linkId, userId, originalUrl: originalUrl.trim(), clicks: 0, createdAt }
    }));

    return ok({
      linkId,
      shortUrl: `${BASE_URL}/${linkId}`,
      originalUrl: originalUrl.trim(),
      clicks: 0,
      createdAt
    });
  } catch (err) {
    return error(err);
  }
};
