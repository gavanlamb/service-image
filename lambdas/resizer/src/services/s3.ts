import {PromiseResult} from 'aws-sdk/lib/request';
import logger from '../utilities/logger';
import * as aws from 'aws-sdk';
const s3 = new aws.S3();

const getImageFromS3 = (
    bucketName: string,
    key: string): Promise<PromiseResult<aws.S3.GetObjectOutput, aws.AWSError>> => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    logger.info(
        {
            key,
            bucketName,
        },
        'Getting image %s from %s bucket',
        key,
        bucketName
    );

    return s3
        .getObject(params)
        .promise();
};

const getImageTags = (
    bucketName: string,
    key: string): Promise<PromiseResult<aws.S3.GetObjectTaggingOutput, aws.AWSError>> => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    logger.info(
        {
            key,
            bucketName,
        },
        'Getting image tags %s from %s bucket',
        key,
        bucketName
    );

    return s3
        .getObjectTagging(params)
        .promise();
};

export { getImageFromS3, getImageTags };