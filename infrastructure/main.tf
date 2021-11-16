// Distribution
/// CDN
resource "aws_cloudfront_distribution" "image_distribution" {
  comment = "Distribution for images"
  
  enabled = true
  price_class = "PriceClass_All"
  
  origin {
    domain_name = aws_s3_bucket.repair_resized_images.bucket_regional_domain_name
    origin_id = aws_s3_bucket.repair_resized_images.id
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.repair_images.cloudfront_access_identity_path
    }
  }
  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["AU"]
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  
  default_cache_behavior {
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods = ["GET", "HEAD"]

    target_origin_id = aws_s3_bucket.repair_resized_images.id
    default_ttl = 3888000
    min_ttl = 3888000
    max_ttl = 5184000
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }
    lambda_function_association {
      event_type = "viewer-request"
      lambda_arn = aws_lambda_function.authorisation.qualified_arn
    }
    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = aws_lambda_function.resizer.qualified_arn
    }
  }
}

resource "aws_cloudfront_origin_access_identity" "repair_images" {
  comment = local.application_name
}



/// S3 bucket
resource "aws_s3_bucket" "repair_resized_images" {
  bucket = local.bucket_name
  acl = "private"
}
resource "aws_s3_bucket_public_access_block" "repair_resized_images" {
  bucket = aws_s3_bucket.repair_resized_images.id

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "repair_resized_images" {
  bucket = aws_s3_bucket.repair_resized_images.id
  policy = data.aws_iam_policy_document.repair_images_bucket.json
}



// Authorisation
/// Lambda
resource "aws_lambda_function" "authorisation" {
  provider = aws.us-east-1
  
  function_name = local.authorisation_name
  description = "Authorisation lambda for Cloudfront"

  runtime = "nodejs14.x"
  handler = "lambda.handler"
  publish = true
  role = aws_iam_role.authorisation.arn

  filename = var.authorisation_filename

  architectures = ["x86_64"]
  
  timeout = 5
}

/// Log group
resource "aws_cloudwatch_log_group" "authorisation" {  
  name = "/aws/lambda/us-east-1.${local.authorisation_name}"
  retention_in_days = 14
}

/// IAM
resource "aws_iam_role" "authorisation" {
  provider = aws.us-east-1
  
  name = local.authorisation_name
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy_doc.json
}
resource "aws_iam_role_policy_attachment" "authorisation_cloudwatch" {
  provider = aws.us-east-1
  
  role = aws_iam_role.authorisation.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}



// Resizer
/// Lambda
resource "aws_lambda_function" "resizer" {
  provider = aws.us-east-1

  function_name = local.resizer_name
  description = "Image resizer lambda for Cloudfront"

  runtime = "nodejs14.x"
  handler = "lambda.handler"
  publish = true
  role = aws_iam_role.resizer.arn
  
  memory_size = 2048

  filename = var.resizer_filename

  architectures = ["x86_64"]
  timeout = 30
}

/// Log group
resource "aws_cloudwatch_log_group" "resizer" {
  name = "/aws/lambda/us-east-1.${local.resizer_name}"
  retention_in_days = 14
}

/// IAM
resource "aws_iam_role" "resizer" {
  provider = aws.us-east-1

  name = local.resizer_name
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy_doc.json
}
resource "aws_iam_role_policy_attachment" "resizer_cloudwatch" {
  provider = aws.us-east-1

  role = aws_iam_role.resizer.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_role_policy_attachment" "resizer_s3" {
  provider = aws.us-east-1

  role = aws_iam_role.resizer.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}
