import './style.css'
import askQuestion from './App.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Hello Vite!</h1>
    
    <form>
        <input type="text" placeholder="je vraag hier" id="chatfield">
        <button type="submit">Send question</button>
    </form>
    
    <div id="response"></div>
  </div>
`

const form = document.querySelector("form")
form.addEventListener("submit", askQuestion)

