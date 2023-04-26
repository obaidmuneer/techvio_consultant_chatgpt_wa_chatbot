import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { RetrievalQAChain } from "langchain/chains";
import * as dotenv from 'dotenv'
dotenv.config()

const openAIApiKey = process.env.OPENAI_API_KEY

// console.log(process.env.OPENAI_API_KEY);
const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a helpful AI assistant at Techvio who guide user help customers with filing their taxes. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer:`;

export const makeConvChain = (vectorStore) => {
    // const model = new OpenAI({ temperature: 0, maxTokens: 100, modelName: 'gpt-3.5-turbo' }); // its taking time to genrate respone
    const model = new OpenAI({ openAIApiKey });
    const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever(),
        {
            qaTemplate: QA_PROMPT,
            questionGeneratorTemplate: CONDENSE_PROMPT,
            // returnSourceDocuments: true, //The number of source documents returned is 4 by default      
        }
    );
    return chain
}

export const makeTextChain = (vectorStore) => {
    const model = new OpenAI({ openAIApiKey });
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    return chain
}