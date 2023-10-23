# CDK StaticIP Lambda Example

ref: [Generate a static outbound IP address using a Lambda function, Amazon VPC, and a serverless architecture](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/generate-a-static-outbound-ip-address-using-a-lambda-function-amazon-vpc-and-a-serverless-architecture.html)

# Prerequisites

- git
- awscli
- Nodejs 16.x
- AWS Account and locally configured AWS credential

# Installation

## Setup awscli

```bash
$ aws configure --profile demo
AWS Access Key ID [****************NCHZ]:
AWS Secret Access Key [****************AwoB]:
Default region name [ap-northeast-2]:
Default output format [json]:
```

## Install dependencies

```bash
$ cd infra
$ npm i -g aws-cdk@2.101.0
$ npm i
```

## Configuration

open [**infra/config/dev.toml**](/infra/config/dev.toml) and modify if necessary.

```toml
[aws]
account="YOUR_ACCOUNT_ID"
```

if you want to import existing VPC add below to toml. no vpc id is provided, it will create a new VPC for you.

```toml
[vpc]
id="VPC_ID"
```

and copy `config/dev.toml` file to project root as `.toml`

```bash
$ cd infra
$ cp config/dev.toml .toml
```

## Deploy for dev

if you never run bootstrap on the account, bootstrap it.

```bash
$ cdk bootstrap --profile demo
```

deploy infrastructure

```bash
$ cdk deploy "*" --require-approval never --profile demo
```

# Run Test

visit [Lambda AWS Console](https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/functions/StaticIPOutboundDevLambdaFunction?tab=testing) and move to `Test` tab.

test the function with follwing body. (derived by **API Gateway AWS Proxy template**)

```json
{
  "body": "{\"url\": \"https://httpbin.org/get\"}",
  "resource": "/{proxy+}",
  "path": "/path/to/resource",
  "httpMethod": "POST",
  "isBase64Encoded": false,
  "queryStringParameters": {
    "foo": "bar"
  },
  "multiValueQueryStringParameters": {
    "foo": ["bar"]
  },
  "pathParameters": {
    "proxy": "/path/to/resource"
  },
  "stageVariables": {
    "baz": "qux"
  },
  "headers": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, sdch",
    "Accept-Language": "en-US,en;q=0.8",
    "Cache-Control": "max-age=0",
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Desktop-Viewer": "true",
    "CloudFront-Is-Mobile-Viewer": "false",
    "CloudFront-Is-SmartTV-Viewer": "false",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Viewer-Country": "US",
    "Host": "1234567890.execute-api.us-east-1.amazonaws.com",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Custom User Agent String",
    "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
    "X-Amz-Cf-Id": "cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA==",
    "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https"
  },
  "multiValueHeaders": {
    "Accept": [
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    ],
    "Accept-Encoding": ["gzip, deflate, sdch"],
    "Accept-Language": ["en-US,en;q=0.8"],
    "Cache-Control": ["max-age=0"],
    "CloudFront-Forwarded-Proto": ["https"],
    "CloudFront-Is-Desktop-Viewer": ["true"],
    "CloudFront-Is-Mobile-Viewer": ["false"],
    "CloudFront-Is-SmartTV-Viewer": ["false"],
    "CloudFront-Is-Tablet-Viewer": ["false"],
    "CloudFront-Viewer-Country": ["US"],
    "Host": ["0123456789.execute-api.us-east-1.amazonaws.com"],
    "Upgrade-Insecure-Requests": ["1"],
    "User-Agent": ["Custom User Agent String"],
    "Via": ["1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)"],
    "X-Amz-Cf-Id": ["cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA=="],
    "X-Forwarded-For": ["127.0.0.1, 127.0.0.2"],
    "X-Forwarded-Port": ["443"],
    "X-Forwarded-Proto": ["https"]
  },
  "requestContext": {
    "accountId": "123456789012",
    "resourceId": "123456",
    "stage": "prod",
    "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
    "requestTime": "09/Apr/2015:12:34:56 +0000",
    "requestTimeEpoch": 1428582896000,
    "identity": {
      "cognitoIdentityPoolId": null,
      "accountId": null,
      "cognitoIdentityId": null,
      "caller": null,
      "accessKey": null,
      "sourceIp": "127.0.0.1",
      "cognitoAuthenticationType": null,
      "cognitoAuthenticationProvider": null,
      "userArn": null,
      "userAgent": "Custom User Agent String",
      "user": null
    },
    "path": "/prod/path/to/resource",
    "resourcePath": "/{proxy+}",
    "httpMethod": "POST",
    "apiId": "1234567890",
    "protocol": "HTTP/1.1"
  }
}
```

result details contains the ip of your NAT Gateway in `origin` field.

```json
"{\"args\":{},\"headers\":{\"Accept\":\"application/json, text/plain, */*\",\"Accept-Encoding\":\"gzip, compress, deflate, br\",\"Content-Type\":\"application/json; charset=UTF-8\",\"Host\":\"httpbin.org\",\"User-Agent\":\"axios/1.2.2\",\"X-Amzn-Trace-Id\":\"Root=1-65361268-6f73002c21b4a5ca15c3162f\"},\"origin\":\"13.xxx.xx.xxx\",\"url\":\"https://httpbin.org/get\"}"
```
