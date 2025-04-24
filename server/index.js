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

const systemMessages = {
    "dark romance": "You are a bard weaving a dark romance story, filled with emotional tension, danger, and passion. The mood should be intense and mysterious, with a sense of forbidden love or tragic fate.",
    "cozy fantasy": "You are a bard telling a cozy fantasy tale filled with warmth, charm, and magic. The world is peaceful, the characters kind, and there is an overall sense of comfort and joy.",
    "adventure": "You are a bard telling an exciting adventure story, filled with quests, danger, and heroism. The world is vast, and the characters are brave and bold.",
    "mystery": "You are a bard telling a mystery story, filled with suspense, intrigue, and plot twists. The characters are detectives or adventurers seeking answers in a world of uncertainty.",
    "epic fantasy": "You are a bard telling an epic fantasy tale, filled with grand battles, mythical creatures, and heroic deeds. The world is vast, and the stakes are high.",
    "comedy": "You are a bard telling a comedic story, filled with humor, wit, and lighthearted moments. The characters may find themselves in funny, awkward, or unexpected situations."
};


const embeddings = new AzureOpenAIEmbeddings({
    // temperature: 1,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});

let vectorStore = await FaissStore.load("bardvectordb", embeddings)

const app = express();
app.use(cors());
app.use(express.json());

async function createJoke() {
    const result = await model.invoke("Tell me a javascript joke")
    return result.content;
}

async function sendPrompt(prompt, tone) {
    const toneMessage = systemMessages[tone] || systemMessages["cozy fantasy"];  // Default to cozy fantasy if no tone is selected

    messages.push(new SystemMessage(toneMessage));
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

app.post('/joke', async(req, res) => {
    let joke = await createJoke();
    res.json({ message: joke });
});

app.post('/question', async (req, res) => {
    const prompt = req.body.question;
    let result = await sendPrompt(prompt);

    const stream = await model.stream(result)

    for await (const chunk of stream) {
        res.write(chunk.content);
    }
    res.end();
})

app.post('/bardtext', async (req, res) => {
    const prompt = req.body.question;
    let result = await askQuestion(prompt);

    res.json({
        answer: result.content
    })
})

app.listen(process.env.EXPRESS_PORT, () => console.log(`Server running on ${process.env.EXPRESS_PORT}`));