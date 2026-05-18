//deletes a link only if it belongs to the authenticated user
const { GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const dynamodb = require('../../shared/dynamodb');
const { ok, error } = require('../../shared/response');
const { NotFoundError, AuthError } = require('../../shared/errors');

const TABLE = process.env.DYNAMODB_TABLE;

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const linkId = event.pathParameters?.linkId;

    const result = await dynamodb.send(new GetCommand({
      TableName: TABLE,
      Key: { linkId }
    }));

    if (!result.Item) throw new NotFoundError('link not found');
    if (result.Item.userId !== userId) throw new AuthError('forbidden');

    await dynamodb.send(new DeleteCommand({
      TableName: TABLE,
      Key: { linkId }
    }));

    return ok({ message: 'link deleted' });
  } catch (err) {
    return error(err);
  }
};
