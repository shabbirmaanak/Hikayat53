import 'dotenv/config';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

/**
 * Cloudflare R2 Audio Ingestion Script
 *
 * Requirements in .env.local:
 *   R2_ACCOUNT_ID="your_account_id"
 *   R2_ACCESS_KEY_ID="your_access_key"
 *   R2_SECRET_ACCESS_KEY="your_secret_key"
 *   R2_BUCKET_NAME="hikayat-audio"
 *
 * Usage:
 *   npx tsx scripts/upload-r2.ts [optional-local-folder-or-file]
 */

async function main() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'hikayat-audio';

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error('Missing Cloudflare R2 credentials in environment variables.');
    console.log('Please ensure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY are configured.');
    process.exit(1);
  }

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

  console.log(`Connecting to Cloudflare R2 Endpoint: ${endpoint}`);
  const s3 = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const targetPath = process.argv[2] || path.join(process.cwd(), 'public', 'audio');

  if (!fs.existsSync(targetPath)) {
    console.log(`Directory ${targetPath} does not exist. Creating directory...`);
    fs.mkdirSync(targetPath, { recursive: true });
    console.log(`Place your .mp3 narration files in ${targetPath} and re-run this script.`);
    return;
  }

  const stat = fs.statSync(targetPath);
  const filesToUpload: string[] = [];

  if (stat.isDirectory()) {
    const files = fs.readdirSync(targetPath);
    for (const file of files) {
      if (file.endsWith('.mp3') || file.endsWith('.m4a') || file.endsWith('.wav')) {
        filesToUpload.push(path.join(targetPath, file));
      }
    }
  } else {
    filesToUpload.push(targetPath);
  }

  if (filesToUpload.length === 0) {
    console.log(`No audio files found in ${targetPath}.`);
    return;
  }

  console.log(`Found ${filesToUpload.length} audio file(s) to upload to R2 bucket: "${bucketName}"\n`);

  for (const filePath of filesToUpload) {
    const fileName = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);
    const fileStat = fs.statSync(filePath);

    console.log(`Uploading: ${fileName} (${(fileStat.size / (1024 * 1024)).toFixed(2)} MB)...`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
      ContentType: 'audio/mpeg',
      CacheControl: 'public, max-age=31536000, immutable',
    });

    try {
      await s3.send(command);
      console.log(`✓ Successfully uploaded ${fileName} to R2!`);
    } catch (err) {
      console.error(`✗ Failed uploading ${fileName}:`, err);
    }
  }

  console.log('\n--- Ingestion complete. Verify files via Cloudflare Dashboard or Public R2 URL ---');
}

main().catch((err) => {
  console.error('Unhandled error in R2 upload:', err);
  process.exit(1);
});
