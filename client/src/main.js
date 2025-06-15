import './style.css'
import askQuestion from './App.js'

document.querySelector('#app').innerHTML = `
    <div>
    <h1>Summon a Tale</h1>
<p>Speak, and the Bard shall weave your words into a tale of wonder...</p>

<form id="story-form">
    <input type="text" placeholder="Start or continue the story..." id="story-input">
        <button type="submit">Tell the Bard</button>
</form>

<form id="question-form" style="margin-top: 20px;">
    <input type="text" placeholder="Ask the Bard about the story..." id="question-input">
        <button type="submit">Ask the Bard</button>
</form>

<div id="response"></div>
</div>
`;

const storyForm = document.querySelector("#story-form");
storyForm.addEventListener("submit", (e) => askQuestion(e, "story"));

const questionForm = document.querySelector("#question-form");
questionForm.addEventListener("submit", (e) => askQuestion(e, "bard"));

