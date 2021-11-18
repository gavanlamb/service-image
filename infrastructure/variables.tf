variable "environment" {
  type = string
}

variable "region" {
  type = string
}

variable "authorisation_filename" {
  type = string
}
variable "resizer_filename" {
  type = string
}

variable "image_bucket_name" {
  type = string
}

locals {
  application_name = "expensely-images-${lower(var.environment)}"
  altered_image_bucket_name = "expensely-altered-images-${lower(var.environment)}-${var.region}"

  authorisation_name = "${local.application_name}-authorisation"
  resizer_name = "${local.application_name}-resizer"
  
  default_tags = {
    Application = "Expensely Images"
    Team = "Core"
    ManagedBy = "Terraform"
    Environment = var.environment
  }
}
