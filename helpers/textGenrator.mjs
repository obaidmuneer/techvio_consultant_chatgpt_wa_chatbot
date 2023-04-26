import { makeTextChain, makeConvChain } from "./makeChain.mjs";
import { pinecone } from './pinecone.mjs'
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '../config/pinecone.mjs'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { injest_data } from "../script/ingest-data.mjs";
// await injest_data()

const vectors = async () => {
    const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
            pineconeIndex,
            textKey: 'text',
            namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
        },
    );
    return vectorStore
}

export const conversationTextGenrator = async (msg) => {
    const vectorStore = await vectors()
    const chain = makeConvChain(vectorStore)
    const res = await chain.call({
        question: msg,
        chat_history: []
    });
    // console.log(res);
    return res.text
}

// const vectorStore = await vectoreStore()
// const chain = makeChain(vectorStore)

export const textGenrator = async (msg) => {
    const loadedVectorStore = await vectors()

    const chain = makeTextChain(loadedVectorStore)
    const res = await chain.call({
        query: msg,
    });
    console.log('open ai', res.text);
    return res.text
};

// await textGenrator('How can I file my taxes')
