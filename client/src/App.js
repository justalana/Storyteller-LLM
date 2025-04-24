async function askQuestion(e) {
    e.preventDefault();
    const chatfield = document.querySelector("#chatfield");
    const answer = document.querySelector("#response");

    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: chatfield.value })
    };

    const response = await fetch("http://localhost:8000/question", options);
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = "";

    let currentPara = document.createElement("p");
    currentPara.classList.add("story-part");
    answer.appendChild(currentPara);

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let words = buffer.split(/\s+/);
        buffer = words.pop();

        for (let word of words) {
            currentPara.innerText += " " + word;
        }
    }

    if (buffer) {
        currentPara.innerText += " " + buffer;
    }
}


export default askQuestion;
