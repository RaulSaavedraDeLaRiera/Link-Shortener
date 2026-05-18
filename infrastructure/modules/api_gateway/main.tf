#http api v2 with built-in cors and cognito jwt authorizer
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
  }
}

resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true
}

#cognito jwt authorizer — api gateway validates the token before reaching lambda
resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id           = aws_apigatewayv2_api.main.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito"

  jwt_configuration {
    audience = [var.cognito_client_id]
    issuer   = "https://cognito-idp.${var.aws_region}.amazonaws.com/${var.cognito_user_pool_id}"
  }
}

#lambda integrations
resource "aws_apigatewayv2_integration" "create_link" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.create_link_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_links" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.get_links_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "delete_link" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.delete_link_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "redirect" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.redirect_invoke_arn
  payload_format_version = "2.0"
}

#routes: protected endpoints require cognito token
resource "aws_apigatewayv2_route" "create_link" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "POST /links"
  target             = "integrations/${aws_apigatewayv2_integration.create_link.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "get_links" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "GET /links"
  target             = "integrations/${aws_apigatewayv2_integration.get_links.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "delete_link" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "DELETE /links/{linkId}"
  target             = "integrations/${aws_apigatewayv2_integration.delete_link.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

#public route — no auth needed to follow a short link
resource "aws_apigatewayv2_route" "redirect" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /{shortCode}"
  target    = "integrations/${aws_apigatewayv2_integration.redirect.id}"
}

#permissions for api gateway to invoke each lambda
resource "aws_lambda_permission" "create_link" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.create_link_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "get_links" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.get_links_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "delete_link" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.delete_link_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "redirect" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.redirect_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

output "base_url" { value = aws_apigatewayv2_stage.main.invoke_url }
