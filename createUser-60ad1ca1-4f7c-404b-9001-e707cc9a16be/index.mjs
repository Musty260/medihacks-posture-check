import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

// AWS.config.update({ region: "eu-west-2" });

export const handler = async (event) => {
    const client = new DynamoDBClient({ apiVersion: "2024-07-10" });

    // console.log(event);
    const { device_name, pwhash } = event; //JSON.parse(event.body);
    // console.log(device_name);
    
    const params = {
        TableName: "devices",
        Item: {
            DeviceName: { S: device_name },
            pwhash: { S: pwhash }
        }
    };
    
    const command = new PutItemCommand(params);
    
    try {
        const data = await client.send(command);
        const response = JSON.stringify({
            statusCode: 200,
            body: device_name
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

