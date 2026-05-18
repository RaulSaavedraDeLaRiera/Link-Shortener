output "api_url" {
  description = "api gateway base url — use as base_url variable on second apply"
  value       = module.api_gateway.base_url
}

output "cloudfront_url" {
  description = "frontend cloudfront distribution url"
  value       = module.frontend.cloudfront_url
}

output "cognito_user_pool_id" {
  description = "cognito user pool id — needed for frontend env vars"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "cognito app client id — needed for frontend env vars"
  value       = module.cognito.client_id
}
