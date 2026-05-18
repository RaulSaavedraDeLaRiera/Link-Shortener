class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ValidationError extends AppError {
  constructor(message) { super(message, 400); }
}

class AuthError extends AppError {
  constructor(message = 'Unauthorized') { super(message, 401); }
}

class NotFoundError extends AppError {
  constructor(message = 'Not found') { super(message, 404); }
}

module.exports = { AppError, ValidationError, AuthError, NotFoundError };
