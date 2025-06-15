import './style.css';
import askQuestion from './App.js';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Summon a Tale</h1>
    <p>Choose a genre and give your opening prompt.</p>

    <div id="genre-buttons">
      <button data-genre="Fantasy">Fantasy</button>
      <button data-genre="Horror">Horror</button>
      <button data-genre="Sci-Fi">Sci-Fi</button>
      <button data-genre="Mystery">Mystery</button>
    </div>

    <form id="story-form">
      <input type="text" placeholder="Enter your story prompt..." id="story-input" disabled>
      <button type="submit" disabled>Tell the Bard</button>
    </form>

    <p>Ask a question about the story:</p>
    <form id="question-form" style="margin-top: 20px;">
      <input type="text" placeholder="Ask the Bard..." id="question-input">
      <button type="submit">Ask the Bard</button>
    </form>

    <div id="response"></div>
  </div>
`;

// Enable story input after genre is selected
let selectedGenre = "";
const genreButtons = document.querySelectorAll("#genre-buttons button");
const storyInput = document.querySelector("#story-input");
const storySubmit = document.querySelector("#story-form button");

genreButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedGenre = button.dataset.genre;
        storyInput.disabled = false;
        storySubmit.disabled = false;
        storyInput.placeholder = `Enter a ${selectedGenre.toLowerCase()} story prompt...`;

        // Optional: highlight selected button
        genreButtons.forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
    });
});

const storyForm = document.querySelector("#story-form");
storyForm.addEventListener("submit", (e) => askQuestion(e, "story", selectedGenre));

const questionForm = document.querySelector("#question-form");
questionForm.addEventListener("submit", (e) => askQuestion(e, "bard"));
