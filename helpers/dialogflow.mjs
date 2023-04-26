import { v2beta1 as dialogflow } from '@google-cloud/dialogflow';
import * as dotenv from 'dotenv'
dotenv.config()

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS)
// console.log(CREDENTIALS);
const PROJECT_ID = CREDENTIALS.project_id
const PRIVATE_KEY = CREDENTIALS.private_key.split(String.raw`\n`).join('\n')

const CONFIGURATION = {
    credentials: {
        private_key: PRIVATE_KEY,
        client_email: CREDENTIALS['client_email']
    }
}

export default async function detectIntent(query, userId) {
    const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);
    const sessionPath = sessionClient.projectAgentSessionPath(
        PROJECT_ID,
        userId
    );

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: 'en-US',
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult

    const intent = responses[0]?.queryResult?.intent?.displayName
    const fulfillmentText = result?.fulfillmentText
    const params = result?.parameters
    const context = result?.outputContexts
    const queryText = result?.queryText
    console.log(queryText);


    let message;

    responses[0]?.queryResult?.fulfillmentMessages?.map(eachMessage => {
        if (eachMessage.platform === "PLATFORM_UNSPECIFIED") {
            message = eachMessage?.text?.text[0]
        }
    })
    console.log(message);
    return message
}