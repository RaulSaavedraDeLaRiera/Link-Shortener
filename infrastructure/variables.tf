variable "aws_region" {
  description = "aws region for all resources"
  type        = string
  default     = "eu-west-1"
}

variable "project_name" {
  description = "prefix used for all resource names"
  type        = string
  default     = "link-shortener"
}

variable "environment" {
  description = "deployment environment"
  type        = string
  default     = "prod"
}

# set this after first terraform apply using the api_url output value
variable "base_url" {
  description = "api gateway base url used to build short link urls"
  type        = string
  default     = ""
}
