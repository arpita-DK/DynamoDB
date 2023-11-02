const AWS = require('aws-sdk');
const fs = require('fs');
const Papa = require('papaparse');
AWS.config.update({
    region: 'ap-southeast-1', 
    endpoint: 'http://localhost:4566', 
  });
  
  const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = 'testDatafile'; 
const csvFilePath = 'data.csv'; 

const uploadData = () => {
  const data = fs.readFileSync(csvFilePath, 'utf8');
  Papa.parse(data, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      const items = result.data;

      const params = {
        RequestItems: {
          [tableName]: items.map((item) => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      };

      dynamodb.batchWrite(params, (err, data) => {
        if (err) {
          console.error('Error uploading data:', err);
        } else {
          console.log('Data uploaded successfully:', data);
        }
      });
    },
  });
};

uploadData();
