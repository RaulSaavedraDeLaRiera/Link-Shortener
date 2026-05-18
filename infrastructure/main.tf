terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "dynamodb" {
  source       = "./modules/dynamodb"
  project_name = var.project_name
}

module "cognito" {
  source       = "./modules/cognito"
  project_name = var.project_name
}

module "lambda" {
  source         = "./modules/lambda"
  project_name   = var.project_name
  dynamodb_table = module.dynamodb.table_name
  dynamodb_arn   = module.dynamodb.table_arn
  base_url       = var.base_url
}

module "api_gateway" {
  source                 = "./modules/api_gateway"
  project_name           = var.project_name
  cognito_user_pool_id   = module.cognito.user_pool_id
  cognito_client_id      = module.cognito.client_id
  aws_region             = var.aws_region
  create_link_invoke_arn = module.lambda.create_link_invoke_arn
  get_links_invoke_arn   = module.lambda.get_links_invoke_arn
  delete_link_invoke_arn = module.lambda.delete_link_invoke_arn
  redirect_invoke_arn    = module.lambda.redirect_invoke_arn
  create_link_name       = module.lambda.create_link_name
  get_links_name         = module.lambda.get_links_name
  delete_link_name       = module.lambda.delete_link_name
  redirect_name          = module.lambda.redirect_name
}

module "frontend" {
  source       = "./modules/frontend"
  project_name = var.project_name
}
