const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-southeast-1",
  endpoint: "http://localhost:4566",
});

const dynamodb = new AWS.DynamoDB();
const params = {
  TableName: "updateTable4",
  KeySchema: [{ AttributeName: "Email", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "Email", AttributeType: "S" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table created successfully:", data);
  }
});
