const AWS = require("aws-sdk");
const fs = require("fs");
const Papa = require("papaparse");

AWS.config.update({
  region: "ap-southeast-1",
  endpoint: "http://localhost:4566",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = "updateTable4";
const csvFilePath = "data.csv";

const uploadDataWithPutItem = async () => {
  const data = fs.readFileSync(csvFilePath, "utf8");
  Papa.parse(data, {
    header: true,
    skipEmptyLines: true,
    complete: async (result) => {
      const items = result.data;

      const transformedItems = items.map((item) => {
        return {
          Email: item["Email"],
          eligibility_date: item["EligibilityDate"],
          eligibility_status: item["EligibilityStatus"],
          first_name: item["FirstName"],
          last_name: item["LastName"],
          partner_id: item["PartnerId"],
        };
      });

      await Promise.all(
        transformedItems.map(async (item) => {
          const params = {
            TableName: tableName,
            Item: item,
          };

          try {
            const result = await dynamodb.put(params).promise();
            console.log("Data uploaded successfully:", result);
          } catch (err) {
            console.error("Error uploading data:", err);
          }
        })
      );
    },
  });
};

uploadDataWithPutItem();
