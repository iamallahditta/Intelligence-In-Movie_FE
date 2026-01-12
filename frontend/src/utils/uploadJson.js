// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// import { v4 as uuidv4 } from 'uuid';

// export class JsonUploader {
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

//   async uploadJson(data, prefix = 'transcripts') {
//     const jsonId = uuidv4();
//     const key = `${prefix}/${jsonId}.json`;

//     try {
//       const command = new PutObjectCommand({
//         Bucket: this.bucket,
//         Key: key,
//         Body: JSON.stringify(data),
//         ContentType: 'application/json'
//       });

//       await this.s3Client.send(command);

//       return {
//         id: jsonId,
//         url: `https://s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${this.bucket}/${key}`
//       };
//     } catch (error) {
//       console.error('Error uploading JSON:', error);
//       throw error;
//     }
//   }
// } 



import axios from 'axios';

export async function uploadJsonFile(data) {
  try {
    // Wrap the data and stringify the whole thing
    const jsonString = JSON.stringify({ transcripts: data });

    console.log('Uploading this JSON string:', jsonString);

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/api/upload-json`, jsonString, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { result } = response.data;
    console.log('Uploaded JSON URL:', result.url);
    return result;
  } catch (error) {
    console.error('Error uploading JSON:', error);
    throw error;
  }
}



