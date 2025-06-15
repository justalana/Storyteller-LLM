import express from 'express';
import cors from 'cors';
import {AzureChatOpenAI, AzureOpenAIEmbeddings} from "@langchain/openai";
import {AIMessage, HumanMessage, SystemMessage} from "@langchain/core/messages";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const model = new AzureChatOpenAI({
    temperature: 1,
});

const messages = [
    new SystemMessage("You are a bard who loves to tell a story. Together with the user you will write a story. When the user gives you a prompt you tell a part of the story. When the user gives another prompt you will continue the existing story using the new prompt. Because the story can continue forever your snippets don't have an ending. Until the user tells you to make up an ending")
];

const embeddings = new AzureOpenAIEmbeddings({
    // temperature: 1,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});

let vectorStore = await FaissStore.load("bardvectordb", embeddings)

const app = express();
app.use(cors());
app.use(express.json());

async function sendPrompt(prompt) {
    messages.push(new HumanMessage(prompt));
    let result = await model.invoke(messages);
    messages.push(new AIMessage(result.content));

    return result.content;
}

async function askQuestion(prompt) {
    const relevantDocs = await vectorStore.similaritySearch(prompt, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    const response = await model.invoke([
        ["system", "You will get a context and a question, use only the context to answer the question. You are also a bard that finds this story inspirational"],
        ["human", `The context is ${context}, the question is ${prompt}`]
    ])
    return response
}

app.get('/', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

app.post("/question", async (req, res) => {
    const { question, genre } = req.body;

    const messages = [
        new SystemMessage(`You are a bard who tells stories in the style of ${genre || "a fantasy tale"}. Start a story based on the user's prompt.`),
        new HumanMessage(question)
    ];

    const stream = await model.stream(messages);
    res.setHeader('Content-Type', 'text/plain');
    for await (const chunk of stream) {
        res.write(chunk.content);
    }
    res.end();
});


app.post('/bardtext', async (req, res) => {
    const prompt = req.body.question;
    let result = await askQuestion(prompt);

    res.json({
        answer: result.content
    })
})

app.listen(process.env.EXPRESS_PORT, () => console.log(`Server running on ${process.env.EXPRESS_PORT}`));