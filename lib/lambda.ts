import { Duration, Stack } from 'aws-cdk-lib';
import { Function, AssetCode, Runtime } from 'aws-cdk-lib/aws-lambda';

interface ILambdaProps {
  functionName: string;
  description: string;
  memorySize: number;
  timeout: number;
}

export const Lambda = (scope: Stack, props: ILambdaProps) => {
  return new Function(scope, props.functionName, {
    memorySize: props.memorySize,

    timeout: Duration.seconds(props.timeout),
    handler: 'index.handler',
    runtime: Runtime.NODEJS_18_X,
    functionName: props.functionName,

    description: props.description,
    code: new AssetCode('dist/src'),
  });
};
