import {CloudFrontResponseHandler, CloudFrontResponseResult} from "aws-lambda";
import {CloudFrontResponseEvent} from "aws-lambda/trigger/cloudfront-response";
import {LambdaContext} from "pino-lambda";
import {URLSearchParams} from "url";
import {getImageFromS3, getImageTags} from "./services/s3";
import {alterImage} from "./services/sharp";
import {basename, extname} from "path";
import logger from "./utilities/logger";

export const handler:CloudFrontResponseHandler = async (
    event: CloudFrontResponseEvent, 
    context: LambdaContext): Promise<CloudFrontResponseResult> => {
    logger.withRequest(event, context);
    logger.info(
        {
            event
        },
        "Handling response");
    
    const request = event.Records[0].cf.request;
    const response = event.Records[0].cf.response;
    
    if (response.status === "200"){
        const bucketName = request.origin?.s3?.domainName.split('.')[0] as string;
        
        const key = request.uri.charAt(0) === "/" ? request.uri.slice(1,  request.uri.length) : request.uri;
        const fileExtension = extname(key).replace(".", "");
        
        const queryString = new URLSearchParams(request.querystring)
        const height = queryString.has('h') ? parseInt(queryString.get('h') as string) : null;
        const width = queryString.has('w') ? parseInt(queryString.get('w') as string) : null;
        const quality = queryString.has('q') ? parseInt(queryString.get('q') as string) : null;
        
        try {
            const imageTags = await getImageTags(bucketName, key);
            const fileName = imageTags.TagSet.some(t => t.Key === "ImageName") ? imageTags.TagSet.filter(t => t.Key === "ImageName")[0].Value : basename(key);
            
            // if (fileName) {
            //     response.headers["content-disposition"] = [{
            //         key: "Content-Disposition",
            //         value: `inline; filename=\"${fileName}\"`
            //     }];
            // }
            //
            if (height !== null || width !== null || quality !== null) {
                const image = await getImageFromS3(bucketName, key);
                const imageBuffer = await alterImage(image.Body as Buffer, height, width, quality, fileExtension);
                response.headers["content-length"][0].value = imageBuffer.length.toString();
                
                return {
                    status: response.status,
                    statusDescription: response.statusDescription,
                    headers: response.headers,
                    bodyEncoding: "base64",
                    body: imageBuffer.toString("base64")
                } as CloudFrontResponseResult
            }
            
        } catch (error){
            logger.error(
                {
                    error,
                    event
                },
                "Error encountered while altering image, returning original"
            )
        }
    } else {
        logger.error(
            {
                event
            },
            "S3 request wasn't successful, returning S3 response to CloudFront"
        )
    }
    
    return response;
}