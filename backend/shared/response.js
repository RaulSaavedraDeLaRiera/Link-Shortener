//api gateway response helpers with cors headers
const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS'
};

const ok = (body) => ({
  statusCode: 200,
  headers: HEADERS,
  body: JSON.stringify(body)
});

const created = (body) => ({
  statusCode: 201,
  headers: HEADERS,
  body: JSON.stringify(body)
});

const redirect = (url) => ({
  statusCode: 301,
  headers: { ...HEADERS, Location: url },
  body: ''
});

const error = (err) => ({
  statusCode: err.statusCode || 500,
  headers: HEADERS,
  body: JSON.stringify({ message: err.message || 'internal server error' })
});

module.exports = { ok, created, redirect, error };
