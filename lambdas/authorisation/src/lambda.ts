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
    
    // Options request
    
    // Head & Get 
    /// Get auth header
    /// Request info from repair - this also does auth check
    //// if 200
    ///// proceed
    //// else if 401
    ///// return status code
    //// else if 400
    ///// return status code
    
    // https://gist.github.com/luketn/cf89a544dc47d0e0722815f081db1570
    
    return request;
}