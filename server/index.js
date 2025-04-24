import express from 'express';
import cors from 'cors';
import {AzureChatOpenAI, AzureOpenAIEmbeddings} from "@langchain/openai";
import {AIMessage, HumanMessage, SystemMessage} from "@langchain/core/messages";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { tool } from "@langchain/core/tools";

function multiplyFunction({a,b}) {
    return a * b;
}

const multiply = tool(multiplyFunction, {
    name: "multiply",
    description: "this is a tool that can multiply two numbers, use this when the user asks to multiply two numbers",
    schema: {
        type: "object",
        properties: {
            a: {type: "number"},
            b: {type: "number"},
        }
    }
})

const model = new AzureChatOpenAI({
    temperature: 1,
}).bindTools([multiply]);

const messages = [
    new SystemMessage("You are a bard who will weave an amazing story out of prompts, whenever a new prompt is given you build on the existing story that you made before.")
];
const tools = [multiply];
const toolsByName = Object.fromEntries(tools.map(tool => [tool.name, tool]));


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

async function sendPrompt(prompt) {

    messages.push(new HumanMessage(prompt));
    let result = await model.invoke(messages);
    messages.push(new AIMessage(result.content));

    // console.log(result)

    for (const toolCall of result.tool_calls) {
        const selectedTool = toolsByName[toolCall.name];
        console.log("now trying to call " + toolCall.name);
        const toolMessage = await selectedTool.invoke(toolCall);
        messages.push(toolMessage);
    }

    if(result.tool_calls > 0) {
        result = await model.invoke(messages)
    }

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