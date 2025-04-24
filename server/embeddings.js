import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const model = new AzureChatOpenAI({temperature: 1});

const embeddings = new AzureOpenAIEmbeddings({
    temperature: 1,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});

let vectorStore = await FaissStore.load("bardvectordb", embeddings)

async function createVectorstore() {
    const loader = new TextLoader("./public/bard.txt");
    const docs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 250, chunkOverlap: 50 });
    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log(`Document split into ${splitDocs.length} chunks.`);
    vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
    await vectorStore.save("bardvectordb")
    console.log("Vector store created!")
}

await createVectorstore()