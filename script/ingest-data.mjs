import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { pinecone } from '../helpers/pinecone.mjs'
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '../config/pinecone.mjs'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const filePath = './doc/data.docx'

export const injest_data = async () => {
    try {
        const loader = new DocxLoader(filePath);
        const rawDocs = await loader.load();

        /* Split text into chunks */
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await textSplitter.splitDocuments(rawDocs);
        console.log('split docs', docs);

        console.log('creating vector store...');
        /*create and store the embeddings in the vectorStore*/
        const embeddings = new OpenAIEmbeddings();
        const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

        //embed the PDF documents
        await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex: index,
            namespace: PINECONE_NAME_SPACE,
            textKey: 'text',
        });
    } catch (error) {
        console.log('error', error);
        throw new Error('Failed to ingest your data');
    }
};