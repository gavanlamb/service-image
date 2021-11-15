variable "environment" {
  type = string
}

variable "region" {
  type = string
}

variable "authorisation_filename" {
  type = string
}

variable "image_bucket_name" {
  type = string
}

locals {
  application_name = "repair-images-${lower(var.environment)}"
  bucket_name = "repair-images-${lower(var.environment)}-${var.region}"

  authorisation_name = "${local.application_name}-authorisation"
  
  default_tags = {
    Application = "Repair Images"
    Team = "Repair"
    ManagedBy = "Terraform"
    Environment = var.environment
  }
}
