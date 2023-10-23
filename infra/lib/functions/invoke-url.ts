import axios from 'axios';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEventV2) => {
  console.log(event);

  const { url } = JSON.parse(event.body!);
  console.log(`invoke url : GET ${url}`);

  try {
    const resp = await axios.get(url, {
      headers: {
        'User-Agent': 'axios/1.2.2',
        Host: 'httpbin.org',
        'Accept-Encoding': 'gzip, compress, deflate, br',
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    console.log(`resp: ${resp.data}`);
    return JSON.stringify(resp.data);
  } catch (e) {
    console.error('failed to invoke url: ', e);
    return 'failed to invoke url';
  }
};
