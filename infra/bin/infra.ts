#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/stacks/vpc-stack';
import { LambdaStack } from '../lib/stacks/lambda-stack';
import { Config } from '../config/loader';

const app = new cdk.App({
  context: {
    ns: Config.app.ns,
    stage: Config.app.stage,
  },
});

const vpcStack = new VpcStack(app, `${Config.app.ns}VpcStack`, {
  vpcId: Config.vpc?.id,
  env: {
    account: Config.aws.account,
    region: Config.aws.region,
  },
});

const lambdaStack = new LambdaStack(app, `${Config.app.ns}LambdaStack`, {
  vpc: vpcStack.vpc,
  env: {
    account: Config.aws.account,
    region: Config.aws.region,
  },
});
lambdaStack.addDependency(vpcStack);

const tags = cdk.Tags.of(app);
tags.add('namespace', Config.app.ns);
tags.add('stage', Config.app.stage);

app.synth();
