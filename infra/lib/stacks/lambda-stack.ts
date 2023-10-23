import * as path from 'path';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface IProps extends StackProps {
  vpc: ec2.IVpc;
}

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const ns = this.node.tryGetContext('ns') as string;

    const securityGroup = new ec2.SecurityGroup(this, `LambdaSecurityGroup`, {
      vpc: props.vpc,
      description: `${ns}LambdaSecurityGroup`,
    });
    securityGroup.connections.allowInternally(
      ec2.Port.allTraffic(),
      'Allow internal'
    );

    new lambdaNodejs.NodejsFunction(this, 'LambdaFunction', {
      vpc: props.vpc,
      vpcSubnets: {
        subnets: [props.vpc.privateSubnets[0]],
      },
      securityGroups: [securityGroup],
      functionName: `${ns}LambdaFunction`,
      entry: path.resolve(__dirname, '..', 'functions', 'invoke-url.ts'),
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
    });
  }
}
