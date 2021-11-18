import {
    CloudFrontRequestEvent,
    CloudFrontRequestHandler, 
    CloudFrontRequestResult,
} from "aws-lambda";
import {LambdaContext} from "pino-lambda";
import {
    doesImageExist, generateDestinationKey,
    getBucketNameFromDomainName,
    getHeadData,
    getImageFromS3,
    getSourceBucketName,
    getSourceKeyFromPath,
    uploadImageStreamToS3,
} from "./services/s3";
import {alterImage} from "./services/sharp";
import logger from "./utilities/logger";

export const handler:CloudFrontRequestHandler = async (
    event: CloudFrontRequestEvent, 
    context: LambdaContext): Promise<CloudFrontRequestResult> => {
    logger.withRequest(event, context);
    logger.info(
        {
            event
        },
        "Handling request");
    
    const request = event.Records[0].cf.request;
    const decodedPath = decodeURIComponent(request.uri);
    const path = decodedPath.charAt(0) === "/" ? decodedPath.slice(1,  decodedPath.length) : decodedPath;

    const queryString = new URLSearchParams(request.querystring)
    const width = queryString.has('w') ? parseInt(queryString.get('w') as string) : null;
    const height = queryString.has('h') ? parseInt(queryString.get('h') as string) : null;
    const quality = queryString.has('q') ? parseInt(queryString.get('q') as string) : 100;
    const destinationKey = generateDestinationKey(path, width, height, quality);

    // Change the uri to the key of the altered asset
    request.uri = `/${destinationKey}`
    
    if (request.origin?.s3?.domainName) {
        
        const destinationBucketName = getBucketNameFromDomainName(request.origin?.s3?.domainName);
        const doesExistImageExistInAlteredBucket = await doesImageExist(destinationBucketName, destinationKey);
        
        if (!doesExistImageExistInAlteredBucket) {
            const sourceBucketName = getSourceBucketName(destinationBucketName);
            const sourceKey = getSourceKeyFromPath(path);
            
            const doesExistImageExistInSourceBucket = await doesImageExist(sourceBucketName, sourceKey);
            if(doesExistImageExistInSourceBucket){
                const sourceHeadDataPromise = getHeadData(sourceBucketName, sourceKey);
                const file = getImageFromS3(sourceBucketName, sourceKey);

                const sourceHeadData = await sourceHeadDataPromise;
                const contentType = sourceHeadData.ContentType as string;
                const fileType = sourceHeadData.ContentType?.split("/")[1] as string;
                const contentDisposition = sourceHeadData.ContentDisposition as string;

                const imageUpload = uploadImageStreamToS3(
                    destinationBucketName,
                    destinationKey,
                    contentType,
                    contentDisposition)

                alterImage(
                    file,
                    imageUpload.stream,
                    fileType,
                    height,
                    width,
                    quality);

                await imageUpload.promise;

                return request
            } else {
                return {
                    status: "404",
                    statusDescription: "Not Found"
                }
            }
        }
    }

    return request;
}