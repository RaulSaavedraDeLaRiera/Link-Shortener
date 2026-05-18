#packages the entire backend directory as a zip for lambda deployment
data "archive_file" "backend" {
  type        = "zip"
  source_dir  = "${path.root}/../backend"
  output_path = "${path.root}/lambda-package.zip"
  excludes    = ["node_modules", ".env"]
}

#shared iam role for all lambda functions
resource "aws_iam_role" "lambda" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "dynamodb" {
  name = "${var.project_name}-lambda-dynamodb"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query"
      ]
      Resource = [var.dynamodb_arn, "${var.dynamodb_arn}/index/*"]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

locals {
  common_env = {
    DYNAMODB_TABLE = var.dynamodb_table
    BASE_URL       = var.base_url
  }
  runtime = "nodejs20.x"
  zip     = data.archive_file.backend.output_path
  hash    = data.archive_file.backend.output_base64sha256
  role    = aws_iam_role.lambda.arn
}

resource "aws_lambda_function" "create_link" {
  function_name    = "${var.project_name}-create-link"
  role             = local.role
  handler          = "functions/create-link/index.handler"
  runtime          = local.runtime
  filename         = local.zip
  source_code_hash = local.hash
  environment { variables = local.common_env }
}

resource "aws_lambda_function" "redirect" {
  function_name    = "${var.project_name}-redirect"
  role             = local.role
  handler          = "functions/redirect/index.handler"
  runtime          = local.runtime
  filename         = local.zip
  source_code_hash = local.hash
  environment { variables = local.common_env }
}

resource "aws_lambda_function" "get_links" {
  function_name    = "${var.project_name}-get-links"
  role             = local.role
  handler          = "functions/get-links/index.handler"
  runtime          = local.runtime
  filename         = local.zip
  source_code_hash = local.hash
  environment { variables = local.common_env }
}

resource "aws_lambda_function" "delete_link" {
  function_name    = "${var.project_name}-delete-link"
  role             = local.role
  handler          = "functions/delete-link/index.handler"
  runtime          = local.runtime
  filename         = local.zip
  source_code_hash = local.hash
  environment { variables = local.common_env }
}

output "create_link_invoke_arn" { value = aws_lambda_function.create_link.invoke_arn }
output "redirect_invoke_arn"    { value = aws_lambda_function.redirect.invoke_arn }
output "get_links_invoke_arn"   { value = aws_lambda_function.get_links.invoke_arn }
output "delete_link_invoke_arn" { value = aws_lambda_function.delete_link.invoke_arn }
output "create_link_name"       { value = aws_lambda_function.create_link.function_name }
output "redirect_name"          { value = aws_lambda_function.redirect.function_name }
output "get_links_name"         { value = aws_lambda_function.get_links.function_name }
output "delete_link_name"       { value = aws_lambda_function.delete_link.function_name }
