import { Stack } from 'aws-cdk-lib';
import { RequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IValidators } from '../bin/stack-config-types';

interface IValidatorProps {
  api: RestApi;
  input: IValidators;
}

// export interface IValidators {
//   requestValidatorName: string;
//   validateRequestBody: boolean;
//   validateRequestParameters: boolean;
// }

export const createValidator = (
  scope: Stack,
  props: IValidatorProps
): RequestValidator => {
  return new RequestValidator(scope, props.input.requestValidatorName, {
    restApi: props.api,
    requestValidatorName: props.input.requestValidatorName, // 'XXXX'
    validateRequestBody: props.input.validateRequestBody, // true / false
    validateRequestParameters: props.input.validateRequestParameters, // true / false
  });
};
