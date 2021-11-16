import {CloudFrontRequestEvent, CloudFrontRequestHandler} from "aws-lambda";
import {CloudFrontRequestResult} from "aws-lambda/trigger/cloudfront-request";
import {LambdaContext} from "pino-lambda";

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
    
    // Head request
    
    // Options request
    
    // Auth check request
    
    // Get auth header
    // Make request to repair
    // https://gist.github.com/luketn/cf89a544dc47d0e0722815f081db1570
    
    return request;
}