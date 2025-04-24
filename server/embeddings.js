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

// async function askQuestion(prompt) {
//     const relevantDocs = await vectorStore.similaritySearch(prompt, 3);
//     const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");
//     console.log(context)
//
//     const response = await model.invoke([
//         ["system", "You will get a context and a question, use only the context to answer the question"],
//         ["human", `The context is ${context}, the question is ${prompt}`]
//     ])
//     console.log("-----")
//     console.log(response.content)
// }

await createVectorstore()
// await askQuestion("Who is the hero of this story?")