variable "project_name" {}

resource "aws_dynamodb_table" "links" {
  name         = "${var.project_name}-links"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "linkId"

  attribute {
    name = "linkId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  #gsi to query all links for a user
  global_secondary_index {
    name            = "userId-index"
    hash_key        = "userId"
    projection_type = "ALL"
  }

  tags = {
    Project = var.project_name
  }
}

output "table_name" { value = aws_dynamodb_table.links.name }
output "table_arn"  { value = aws_dynamodb_table.links.arn }
