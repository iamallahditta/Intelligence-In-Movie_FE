// import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

// export class S3Deleter {
//   constructor() {
//     this.s3Client = new S3Client({
//       region: process.env.REACT_APP_AWS_REGION,
//       credentials: {
//         accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
//       }
//     });
//     this.bucket = process.env.REACT_APP_AWS_BUCKET_NAME;
//   }

//   async deleteFile(key) {
//     try {
//       const command = new DeleteObjectCommand({
//         Bucket: this.bucket,
//         Key: key
//       });

//       await this.s3Client.send(command);
//       return true;
//     } catch (error) {
//       console.error('Error deleting file from S3:', error);
//       throw error;
//     }
//   }
// } 



