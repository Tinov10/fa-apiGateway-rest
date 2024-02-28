import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IApiGatewayStackProps } from '../bin/stack-config-types';

import {
  LambdaIntegration,
  RestApi,
  Cors,
  JsonSchemaType,
  Model,
  Period,
} from 'aws-cdk-lib/aws-apigateway';

import { createValidator } from '../utils/createValidator';
import { Lambda } from './lambda';

export class ApiGatewayRestStack extends Stack {
  constructor(scope: Construct, id: string, props: IApiGatewayStackProps) {
    super(scope, id, props);

    // 1) create a single lambda with multiple endpoint!!! --> 8
    const lambda = Lambda(this, {
      functionName: props.lambda.name,
      description: props.lambda.description,
      memorySize: props.lambda.memory,
      timeout: props.lambda.timeout,
    });

    // 2) create lambda integration
    const lambdaIntegration = new LambdaIntegration(lambda);

    // 3) create the actual api
    const api = new RestApi(this, 'RestAPI', {
      restApiName: props.api.name,
      description: props.api.description,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
      },
    });

    // create validators with function
    const bodyValidator = createValidator(this, {
      api,
      input: props.validators.bodyValidator,
    });

    const paramValidator = createValidator(this, {
      api,
      input: props.validators.paramValidator,
    });

    const bodyAndParamValidator = createValidator(this, {
      api,
      input: props.validators.bodyAndParamValidator,
    });

    // 5) create model for the body validator
    const model = new Model(this, 'Model', {
      modelName: props.api.modelName,
      schema: {
        type: JsonSchemaType.OBJECT,
        required: ['name'],
        properties: {
          name: { type: JsonSchemaType.STRING },
        },
      },
      restApi: api,
    });

    // create resources / routes

    // rootResource
    const rootResource = api.root.addResource(props.api.rootResource); //v1

    // /v1/open
    const openResource = rootResource.addResource('open');

    // /v1/secure
    const secureResource = rootResource.addResource('secure');

    // /v1/secure/id
    const paramResource = secureResource.addResource('{param}');

    // add methods to resource

    // /v1/open --> 4
    ['GET', 'POST', 'PATCH', 'DELETE'].map((method) => {
      // ora
      openResource.addMethod(method, lambdaIntegration, {
        operationName: `${method} Open Resource`,
      });
    });

    // add method to resource
    // /v1/secure --> 1
    ['POST'].map((method) => {
      secureResource.addMethod(method, lambdaIntegration, {
        // resource.addMethod
        operationName: `${method} Secure Resource`,
        // validators
        requestValidator: bodyValidator,
        requestModels: { 'application/json': model },
        // requestParameters: { 'method.request.path.param': true }, //
        //
        apiKeyRequired: true,
      });
    });

    // add method to resource
    // /v1/secure/id --> 2
    ['GET', 'DELETE'].map((method) => {
      //
      paramResource.addMethod(method, lambdaIntegration, {
        // resource.addMethod
        operationName: `${method} Secure Resource`,
        // validators
        requestValidator: paramValidator,
        // requestModels: { 'application/json': model }, //
        requestParameters: { 'method.request.path.param': true },
        // authorization
        apiKeyRequired: true,
      });
    });

    // add method to route
    // /v1/secure/id --> 1
    ['PATCH'].map((method) => {
      // resource.addMethod
      paramResource.addMethod(method, lambdaIntegration, {
        // ora
        operationName: `${method} Secure Resource`,
        // validation
        requestValidator: bodyAndParamValidator,
        requestModels: { 'application/json': model },
        requestParameters: { 'method.request.path.param': true },
        // authorization
        apiKeyRequired: true,
      });
    });

    // create apiKey
    const apiKey = api.addApiKey('ApiKey', {
      apiKeyName: props.apiKey.name,
      description: props.apiKey.description,
    });

    const usagePlan = api.addUsagePlan('UsagePlan', {
      name: props.usagePlan.name,
      description: props.usagePlan.description,
      apiStages: [
        {
          api: api,
          stage: api.deploymentStage,
        },
      ],
      quota: {
        limit: props.usagePlan.limit,
        period: Period.DAY,
      },
      throttle: {
        rateLimit: props.usagePlan.rateLimit,
        burstLimit: props.usagePlan.burstLimit,
      },
    });

    usagePlan.addApiKey(apiKey);
  }
}
