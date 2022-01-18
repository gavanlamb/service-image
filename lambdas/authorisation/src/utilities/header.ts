import {CloudFrontHeaders} from "aws-lambda";

const getHeader = (headers: CloudFrontHeaders, name: string, defaultValue: string ): string => {
    let header = headers[name.toLowerCase()];
    if (!header || header.length == 0) {
        return defaultValue;
    } else {
        return header[0].value;
    }
};

const setHeader = (headers: CloudFrontHeaders, name: string, value: string) => {
    headers[name.toLowerCase()] = [{key: name, value: value}];
};

const getAuthToken = (headers: CloudFrontHeaders): string | null => {
    const authHeaderValue = getHeader(headers, "authorization", "");
    if(authHeaderValue === "" || !authHeaderValue.startsWith("Bearer ")){
        return null;
    }
    
    return authHeaderValue.substring(7);
}

export {getHeader, setHeader, getAuthToken}
