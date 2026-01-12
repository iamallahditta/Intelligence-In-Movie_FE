// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// import { v4 as uuidv4 } from 'uuid';

// export class ImageUploader {
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

//   async uploadImage(file) {
//     let imageId = uuidv4();
//     imageId = `$${imageId}${getFileExtension(file.name)}`
//     const key = `images/${imageId}`;

//     try {
//       const command = new PutObjectCommand({
//         Bucket: this.bucket,
//         Key: key,
//         Body: file,
//         ContentType: file.type
//       });

//       await this.s3Client.send(command);

//       return {
//         id: imageId,
//         url: `https://s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${this.bucket}/${key}`
//       };
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       throw error;
//     }
//   }
// }

// function getFileExtension(filename) {
//   return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 1);
// } 


