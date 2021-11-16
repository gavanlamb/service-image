const memorySize = process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE as string;
const region = process.env.AWS_REGION as string;
const runtime = process.env.AWS_EXECUTION_ENV as string;
const lambdaFunctionVersion = process.env.AWS_LAMBDA_FUNCTION_VERSION as string;

import { name, version } from '../../package.json';

import pino from 'pino-lambda';

const parentLogger = pino();

const logger = parentLogger.child({
    name,
    version,
    memorySize,
    region,
    runtime,
    lambdaFunctionVersion,
});
logger.level = "info";
logger.useLevelLabels = true;

export default logger;
