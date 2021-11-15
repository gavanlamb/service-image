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

data "aws_iam_policy_document" "repair_images_bucket" {
  statement {
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.repair_images.arn}/*"]

    principals {
      type = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.repair_images.iam_arn]
    }
  }

  statement {
    actions = ["s3:ListBucket"]
    resources = [aws_s3_bucket.repair_images.arn]

    principals {
      type = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.repair_images.iam_arn]
    }
  }
}
