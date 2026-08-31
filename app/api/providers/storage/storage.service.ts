// Copyright (c) 2026-08-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";

export class StorageService {
  private readonly url = process.env.SEAWEEDFS_S3_URL!;
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

  /**
   * Garante que o bucket exista.
   * Se não existir, cria automaticamente.
   */
  async ensureBucket(): Promise<void> {
    try {
      await this.client.send(
        new HeadBucketCommand({
          Bucket: this.bucket,
        }),
      );

      console.log(`Bucket "${this.bucket}" já existe.`);

      return;
    } catch (error: any) {
      const statusCode = error?.$metadata?.httpStatusCode;
      const code = error?.Code;

      if (
        statusCode === 404 ||
        code === "NotFound" ||
        code === "NoSuchBucket"
      ) {
        console.log(`Bucket "${this.bucket}" não existe. Criando...`);

        await this.client.send(
          new CreateBucketCommand({
            Bucket: this.bucket,
          }),
        );

        console.log(`Bucket "${this.bucket}" criado com sucesso.`);

        return;
      }

      console.error(`Erro ao verificar bucket "${this.bucket}":`, error);

      throw error;
    }
  }

  async upload(
    file: Buffer,
    key: string,
    contentType: string,
  ): Promise<PutObjectCommandOutput> {
    await this.ensureBucket();

    console.log("=== UPLOAD S3 ===");
    console.log("URL:", this.url);
    console.log("Bucket:", this.bucket);
    console.log("Key:", key);
    console.log("File size:", file.length);
    console.log("ContentType:", contentType);

    const result = await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      }),
    );

    console.log("=== UPLOAD OK ===");
    console.log(result);

    return result;
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
    } catch (error: any) {
      const statusCode = error?.$metadata?.httpStatusCode;
      const code = error?.Code;

      if (
        statusCode === 404 ||
        code === "NotFound" ||
        code === "NoSuchBucket"
      ) {
        return false;
      }

      console.error(`Erro ao verificar bucket "${this.bucket}":`, error);

      throw error;
    }
  }
}

export const storageSrevice = new StorageService();
