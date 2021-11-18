data "aws_iam_policy_document" "assume_role_policy_doc" {
  statement {
    sid = "AllowAwsToAssumeRole"
    effect = "Allow"

    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "edgelambda.amazonaws.com",
        "lambda.amazonaws.com",
      ]
    }
  }
}

data "aws_iam_policy_document" "altered_image_bucket" {
  statement {
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.altered_image_bucket.arn}/*"]

    principals {
      type = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.repair_images.iam_arn]
    }
  }

  statement {
    actions = ["s3:ListBucket"]
    resources = [aws_s3_bucket.altered_image_bucket.arn]

    principals {
      type = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.repair_images.iam_arn]
    }
  }
}

data "aws_s3_bucket" "image_bucket" {
  bucket = var.image_bucket_name
}
