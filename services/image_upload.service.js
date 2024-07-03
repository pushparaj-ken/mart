const AWS = require("aws-sdk");
const AllConstants = require("../services/constants");
let uuid = require('uuid');

// Amazon SES configuration
const config = {
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION
};

var s3 = new AWS.S3(config);

exports.upload = (file, fileName, foldername) => {
  return new Promise((resolve, reject) => {
    let epochtimeseconds = uuid.v4();
    fileName = fileName.replace(".", epochtimeseconds + ".");
    let params = {
      Body: file,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${foldername}/${fileName}`
    };

    s3.upload(params, (error, file) => {
      if (error) {
        reject(error);
      }
      resolve(file);
    });
  });
}

exports.uploadimages = (file, fileName, Username, fieldname) => {
  return new Promise((resolve, reject) => {
    let split_fileName1 = fileName.split(".");
    let extension_of_file1 = split_fileName1[1];
    let epochtimeseconds = uuid.v4();
    fileName = `${Username}_${fieldname}_${epochtimeseconds}.${extension_of_file1}`;

    let params = {
      Body: file,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName
    };

    s3.upload(params, (error, file) => {
      if (error) {
        reject(error);
      }
      resolve(file);
    });
  });
}


exports.uploadArray = (files, foldername) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    let totalCount = files.length;

    files.forEach(file => {
      let params = {
        Body: file.buffer,
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${foldername}/${file.originalname}`
      };

      s3.upload(params, (error) => {
        if (error) {
          reject(error);
        }
        count++;
        if (count === totalCount) {
          resolve(true);
        }
      });
    });
  });
}
