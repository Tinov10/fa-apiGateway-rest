import { StackProps } from 'aws-cdk-lib';

export interface IApiGatewayStackProps extends StackProps {
  tags: {
    Developer: string;
    Application: string;
  };
  lambda: {
    name: string;
    description: string;
    memory: number;
    timeout: number;
  };
  api: {
    name: string;
    description: string;
    modelName: string;
    rootResource: string;
  };
  usagePlan: {
    name: string;
    description: string;
    limit: number;
    rateLimit: number;
    burstLimit: number;
  };
  apiKey: {
    name: string;
    description: string;
  };
  validators: {
    bodyValidator: IValidators;
    paramValidator: IValidators;
    bodyAndParamValidator: IValidators;
  };
}

export interface IValidators {
  requestValidatorName: string;
  validateRequestBody: boolean;
  validateRequestParameters: boolean;
}
