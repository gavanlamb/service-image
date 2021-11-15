import {CloudFrontRequestEvent, CloudFrontRequestHandler} from "aws-lambda";
import {CloudFrontRequestResult} from "aws-lambda/trigger/cloudfront-request";
import {LambdaContext} from "pino-lambda";

import logger from "./utilities/logger";

export const handler:CloudFrontRequestHandler = async (
    event: CloudFrontRequestEvent, 
    context: LambdaContext): Promise<CloudFrontRequestResult> => {
    logger.withRequest(event, context);
    
    const request = event.Records[0].cf.request;
    logger.debug(
        {
            request
        },
        "Handling request");
    
    return request;
}