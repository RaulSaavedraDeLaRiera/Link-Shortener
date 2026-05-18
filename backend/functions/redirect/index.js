//redirects to the original url and increments the click counter
const { GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const dynamodb = require('../../shared/dynamodb');
const { redirect, error } = require('../../shared/response');
const { NotFoundError } = require('../../shared/errors');

const TABLE = process.env.DYNAMODB_TABLE;

exports.handler = async (event) => {
  try {
    const linkId = event.pathParameters?.shortCode;

    const result = await dynamodb.send(new GetCommand({
      TableName: TABLE,
      Key: { linkId }
    }));

    if (!result.Item) throw new NotFoundError('link not found');

    //fire-and-forget: update clicks and last accessed time without blocking the redirect
    dynamodb.send(new UpdateCommand({
      TableName: TABLE,
      Key: { linkId },
      UpdateExpression: 'SET clicks = clicks + :inc, lastAccessedAt = :now',
      ExpressionAttributeValues: { ':inc': 1, ':now': new Date().toISOString() }
    }));

    return redirect(result.Item.originalUrl);
  } catch (err) {
    return error(err);
  }
};
