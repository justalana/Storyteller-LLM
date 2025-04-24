import './style.css'
import askQuestion from './App.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Summon a Tale</h1>
    <p>Speak, and the Bard shall weave your words into a tale of wonder...</p>
    
    <form>
        <input type="text" placeholder="Prompt" id="chatfield">
        <button type="submit">Give prompt to the bard</button>
    </form>
    
    <div id="response"></div>
  </div>
`

const form = document.querySelector("form")
form.addEventListener("submit", askQuestion)

