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
    
    // if(request.method === "OPTIONS"){
    //     const headers: CloudFrontHeaders = {}
    //    
    //     setHeader(headers, "Access-Control-Allow-Origin", getHeader(request.headers, "origin", "*"));
    //     setHeader(headers, "Access-Control-Allow-Headers", getHeader(request.headers, "access-control-allow-headers", "*"));
    //     setHeader(headers, "Access-Control-Allow-Methods", getHeader(request.headers, "access-control-allow-methods", "GET, HEAD, OPTIONS"));
    //     setHeader(headers, "Access-Control-Allow-Credentials", String(true));
    //    
    //     return {
    //         status: "200",
    //         statusDescription: "Ok",
    //         headers
    //     }
    // }
    //
    // const token = getAuthToken(request.headers);
    // if(token === null) {
    //     return {
    //         status: "401",
    //         statusDescription: "Unauthorised",
    //         headers: {}
    //     }
    // }
    //
    // const pathSegments = request.uri.split("/")
    // const response = await getImageInformation(pathSegments[1], pathSegments[2], token);
    // if (response.status !== 200){
    //     return {
    //         status: response.status.toString(),
    //         statusDescription: response.statusDescription,
    //         headers: {}
    //     }
    // }
    
    return request;
}