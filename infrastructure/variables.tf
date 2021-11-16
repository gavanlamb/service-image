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
  application_name = "repair-images-${lower(var.environment)}"
  bucket_name = "repair-altered-images-${lower(var.environment)}-${var.region}"

  authorisation_name = "${local.application_name}-authorisation"
  resizer_name = "${local.application_name}-resizer"
  
  default_tags = {
    Application = "Repair Images"
    Team = "Repair"
    ManagedBy = "Terraform"
    Environment = var.environment
  }
}
