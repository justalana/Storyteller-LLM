async function askQuestion(e, type = "story") {
    e.preventDefault();
    const answer = document.querySelector("#response");
    answer.innerHTML = ""; // Clear previous result

    const input = type === "story"
        ? document.querySelector("#story-input")
        : document.querySelector("#question-input");

    const prompt = input.value;
    input.value = "";

    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: prompt })
    };

    if (type === "story") {
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
    } else {
        const response = await fetch("http://localhost:8000/bardtext", options);
        const data = await response.json();

        const responsePara = document.createElement("p");
        responsePara.classList.add("bard-answer");
        responsePara.innerText = data.answer;
        answer.appendChild(responsePara);
    }
}

export default askQuestion;