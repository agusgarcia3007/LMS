import { AwsClient } from "aws4fetch";

export type Env = {
  S3_ACCESS_KEY: string;
  S3_SECRET_KEY: string;
  S3_BUCKET: string;
  S3_REGION: string;
  S3_ENDPOINT: string;
};

export async function getS3Object(
  key: string,
  env: Env,
  rangeHeader?: string
): Promise<Response> {
  const aws = new AwsClient({
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
    region: env.S3_REGION,
    service: "s3",
  });

  const url = `${env.S3_ENDPOINT}/${env.S3_BUCKET}/${key}`;

  const headers: Record<string, string> = {};
  if (rangeHeader) {
    headers["Range"] = rangeHeader;
  }

  return aws.fetch(url, {
    method: "GET",
    headers,
  });
}
