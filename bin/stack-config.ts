import { IApiGatewayStackProps } from './stack-config-types';

export const environmentConfig: IApiGatewayStackProps = {
  tags: {
    Developer: 'Martijn Versteeg',
    Application: 'CdkTsApiGateway',
  },
  lambda: {
    name: 'demo-resolver',
    description: 'Lambda resolver',
    memory: 256,
    timeout: 30,
  },
  api: {
    name: 'demo-rest-api',
    description: 'Rest Api Gateway used for Api Gateway YouTube tutorial',
    modelName: 'DemoModel',
    rootResource: 'v1',
  },
  usagePlan: {
    name: 'demo-usage-plan',
    description: 'Usage plan used for Api Gateway YouTube tutorial',
    limit: 100, // per day
    rateLimit: 20,
    burstLimit: 10,
  },
  apiKey: {
    name: 'demo-api-key',
    description: 'Api Key used for Api Gateway YouTube tutorial',
  },
  validators: {
    bodyValidator: {
      requestValidatorName: 'demo-body-validator',
      validateRequestBody: true,
      validateRequestParameters: false,
    },
    paramValidator: {
      requestValidatorName: 'demo-param-validator',
      validateRequestBody: false,
      validateRequestParameters: true,
    },
    bodyAndParamValidator: {
      requestValidatorName: 'demo-body-and-param-validator',
      validateRequestBody: true,
      validateRequestParameters: true,
    },
  },
};
