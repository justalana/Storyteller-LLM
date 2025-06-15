import './style.css'
import askQuestion from './App.js'

document.querySelector('#app').innerHTML = `
    <div>
    <h1>Summon a Tale</h1>
<p>Speak a prompt and the bard will weave a tale.</p>

<form id="story-form">
    <input type="text" placeholder="Start or continue the story..." id="story-input">
        <button type="submit">Tell the Bard</button>
</form>

<p>Ask a question about the story of a bard</p>
<form id="question-form" style="margin-top: 20px;">
    <input type="text" placeholder="Ask the Bard about the story..." id="question-input">
        <button type="submit">Ask the Bard</button>
</form>

<div id="response"></div>
</div>
`

const storyForm = document.querySelector("#story-form");
storyForm.addEventListener("submit", (e) => askQuestion(e, "story"));

const questionForm = document.querySelector("#question-form");
questionForm.addEventListener("submit", (e) => askQuestion(e, "bard"));

