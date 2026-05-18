//returns all links belonging to the authenticated user
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');
const dynamodb = require('../../shared/dynamodb');
const { ok, error } = require('../../shared/response');

const TABLE = process.env.DYNAMODB_TABLE;

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;

    const result = await dynamodb.send(new QueryCommand({
      TableName: TABLE,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId },
      ScanIndexForward: false
    }));

    return ok({ links: result.Items || [] });
  } catch (err) {
    return error(err);
  }
};
