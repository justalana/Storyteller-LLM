import './style.css';
import askQuestion from './App.js';

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="left-panel">
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

      <div id="story-response" class="response-box"></div>
    </div>

    <div class="right-panel">
      <p>Ask a question about this tale:</p>

      <div class="embedded-story">
        <h3>The Ballad of Silence and Song</h3>
        <p><strong>In the kingdom of Eltheria</strong>, where the winds themselves sang in harmony with the rivers and trees, there lived a bard named <em>Cael</em>. He was beloved in every village and court, known for weaving songs so vivid that listeners could see the stars he sang of, smell the roses of long-lost summers, and weep for kings they’d never known.</p>
        <p>But Cael's gift did not come from talent alone. His muse, <strong>Liora</strong>—a sprightly, half-fey woman with laughter like chimes in the wind—had danced into his life one midsummer night. She whispered inspiration into his dreams and hummed melodies into his waking mind. With her beside him, Cael composed the music that stirred hearts and stilled time.</p>
        <p>For ten years, they wandered together—<em>song and spirit</em>. Then, as fleeting as a dream upon waking, Liora was gone.</p>
        <p>No one knew where she went, or why. Some said the fey realm had called her back. Others claimed she tired of the mortal world. Cael searched every glade, grove, and ruin. He offered songs to the stars, traded silence with the seers, and even begged the Queen of Air and Darkness for a glimpse of Liora’s path. But the wind answered only in echoes.</p>
        <p>Without her, his lute grew quiet. Words turned sour on his tongue. The songs he tried to write felt hollow, like they belonged to someone else. Crowds still gathered to see him, but left with furrowed brows and forced applause. And so Cael vanished from the world of courts and candles, retreating into a forest where silence reigned.</p>
        <hr />
        <p><strong>Seasons passed.</strong></p>
        <p>One rain-drenched afternoon, as Cael sat beneath the twisting branches of an old ash tree, a soft humming broke through the patter of rain. It was clumsy, off-key, and full of stumbles—but it was earnest. Curious despite himself, Cael followed the sound and came upon a girl—no older than thirteen—sitting cross-legged in the mud, holding a broken flute and trying her best to summon a song from it.</p>
        <p>She startled when she saw him, but didn’t run. “It’s a terrible sound, isn’t it?” she said.</p>
        <p><em>Cael chuckled for the first time in years.</em> “Terrible,” he agreed. “But brave.”</p>
        <p>The girl’s name was <strong>Mira</strong>. Her village had been burned in a border skirmish, her family scattered. She had wandered until she found the forest, hoping stories of old bards who lived among trees were more than just stories.</p>
        <p>“I heard you used to make people cry with your music,” she said one night by the fire. “I want to learn to do that too. Not the crying part. Just the… feeling part.”</p>
        <p>Cael didn’t answer at first. But that night, when the fire dimmed, he reached for his lute again.</p>
        <hr />
        <p>He began teaching Mira. She was no prodigy. Her fingers fumbled, her voice cracked, and she often mixed up verses. But her questions rekindled something in Cael. <em>Why this chord? Why that story?</em> She wasn’t a muse—she was a mirror. She showed him what he had lost, yes, but also what could still be found.</p>
        <p>Their music grew slowly, like moss on stone. Where once Cael had drawn power from fae whispers and starlit trysts, now he drew it from raw humanity—from Mira’s laughter, her stumbles, her stubborn belief that even broken things could sing again.</p>
        <p>In time, Cael returned to the world. Not as the shining minstrel of legend, but as a teacher, a mentor, and—eventually—a performer once more. His songs were different now: heavier, perhaps, but truer. And beside him, always, was Mira, learning, singing, growing.</p>
        <p>He never saw Liora again. But sometimes, when the wind brushed through the trees just so, he thought he heard her laugh. Not in mourning, but in approval.</p>
        <p class="ending"><em>For muses come and go like seasons—but the song? The song goes on.</em></p>
      </div>


      <form id="question-form">
        <input type="text" placeholder="Ask the Bard..." id="question-input">
        <button type="submit">Ask the Bard</button>
      </form>

      <div id="question-response" class="response-box"></div>
    </div>
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
