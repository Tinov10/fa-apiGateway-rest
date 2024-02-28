#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayRestStack } from '../lib/faruk-api_gateway-rest-stack';
import { environmentConfig } from './stack-config';

const app = new cdk.App();
new ApiGatewayRestStack(app, 'ApiGatewayRestStack', environmentConfig);
