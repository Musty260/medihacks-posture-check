import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

// AWS.config.update({ region: "eu-west-2" });

export const handler = async (event) => {
    const client = new DynamoDBClient({ apiVersion: "2024-07-10" });

    // console.log(event);
    const { device_name, pwhash } = event; //JSON.parse(event.body);
    // console.log(device_name);
    
    const device_params = {
      TableName: "devices",
      Key: {
        DeviceName: { S: device_name }
      }
    };
    
    console.log(device_params);
    
    const judgement_params = {
        TableName: "judgements",
        FilterExpression: "DeviceName = :devicename",
        ExpressionAttributeValues: {
          ":devicename": { S: device_name }
        }
    };
    
    const device_command = new GetItemCommand(device_params);
    const judgement_command = new ScanCommand(judgement_params)
    
    try {
        const device_data = await client.send(device_command);
        console.log(unmarshall(device_data["Item"]));
        if (pwhash !== unmarshall(device_data["Item"])["pwhash"]) {
          throw Error("Hashes do not match");
        }
        const judgement_data = await client.send(judgement_command);
        console.log(judgement_data);
        const response = JSON.stringify({
            statusCode: 200,
            body: judgement_data["Items"].map(x => unmarshall(x))
        });
        return response;
    } catch (err) {
        console.log(err);
        const response = JSON.stringify({
            statusCode: 400,
            body: err.message
        });
        return response;
    }

};

