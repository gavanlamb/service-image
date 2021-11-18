import {PromiseResult} from 'aws-sdk/lib/request';
import logger from '../utilities/logger';
import {AWSError, S3} from 'aws-sdk';
import {PassThrough, Readable} from "stream";
const s3 = new S3();

const getImageFromS3 = (
    bucketName: string,
    key: string): Readable => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    logger.info(
        {
            key,
            bucketName,
        },
        'Getting image %s from %s bucket as a stream',
        key,
        bucketName
    );

    return s3
        .getObject(params)
        .createReadStream();
};

const doesImageExist = async (
    bucketName: string,
    key: string): Promise<boolean> => {
    
    try {
         await getHeadData(bucketName, key);
         return true;
    } catch (error) {
        return false;
    }
};

const uploadImageStreamToS3 = (
    bucketName: string,
    key: string,
    contentType: string,
    contentDisposition: string): { stream: PassThrough; promise: Promise<S3.ManagedUpload.SendData> } => {
    logger.info(
        {
            key,
            bucketName,
        },
        'Uploading %s from %s bucket',
        key,
        bucketName
    );

    const pass = new PassThrough();
    const promise = s3.upload({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
        ContentDisposition: contentDisposition,
        Body: pass}).promise()

    return {
        stream: pass,
        promise
    }
};

const getHeadData = (
    bucketName: string,
    key: string):Promise<PromiseResult<S3.HeadObjectOutput, AWSError>> => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    logger.info(
        {
            key,
            bucketName,
        },
        'Getting head data for %s from %s bucket',
        key,
        bucketName
    );

    return s3
        .headObject(params)
        .promise();
}

const generateDestinationKey = (
    path: string,
    width: number | null,
    height: number | null,
    quality: number): string => {
    const segments = path.split("/")
    return `${segments[0]}/${width ?? "MAX"}*${height ?? "MAX"}*${quality}/${segments[1]}`;
}

const getSourceKeyFromPath = (
    path: string): string => {
    const splitPath = path.split("/");
    
    return `${splitPath[0]}/${splitPath[1]}`;
}

const getBucketNameFromDomainName = (
    domainName: string): string => domainName.split('.')[0] as string;

const getSourceBucketName = (
    destinationBucketName: string): string => {
    // TODO update with all cases. Edge lambdas do not support environment variables 💩 
    return destinationBucketName.replace("-altered", "");
}

export { doesImageExist, uploadImageStreamToS3, getImageFromS3, getHeadData, generateDestinationKey, getBucketNameFromDomainName, getSourceKeyFromPath, getSourceBucketName };