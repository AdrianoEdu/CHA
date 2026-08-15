// Copyright (c) 2026-08-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export class StorageService {
  private readonly url = process.env.SEAWEEDFS_URL!;
  private readonly bucket = process.env.SEAWEEDFS_BUCKET ?? "contabilidade";

  private readonly client = new S3Client({
    endpoint: this.url,
    region: "us-east-1",
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.SEAWEEDFS_ACCESS_KEY ?? "admin",
      secretAccessKey: process.env.SEAWEEDFS_SECRET_KEY ?? "admin",
    },
  });

  async isOnline(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.url.replace(/\/$/, "")}/cluster/status`,
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  async upload(file: Buffer, key: string, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      }),
    );
  }

  async download(key: string) {
    return this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async bucketExists(): Promise<boolean> {
    try {
      await this.client.send(
        new HeadBucketCommand({
          Bucket: this.bucket,
        }),
      );

      return true;
    } catch {
      return false;
    }
  }
}

export const storageSrevice = new StorageService();
