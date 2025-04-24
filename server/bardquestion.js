import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const model = new AzureChatOpenAI({temperature: 1});

const embeddings = new AzureOpenAIEmbeddings({
    // temperature: 1,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});

let vectorStore = await FaissStore.load("bardvectordb", embeddings)

async function askQuestion(prompt) {
    const relevantDocs = await vectorStore.similaritySearch(prompt, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");
    console.log(context)

    const response = await model.invoke([
        ["system", "You will get a context and a question, use only the context to answer the question"],
        ["human", `The context is ${context}, the question is ${prompt}`]
    ])
    console.log("-----")
    console.log(response.content)
}

await askQuestion("Who is the hero of this story?")