async function askQuestion(e, type = "story", genre = "") {
    e.preventDefault();
    const storyBox = document.querySelector("#story-response");
    const questionBox = document.querySelector("#question-response");

    if (type === "story") {
        storyBox.innerHTML = "";

        const input = document.querySelector("#story-input");
        const prompt = input.value;
        input.value = "";

        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: prompt, genre })
        };

        const response = await fetch("http://localhost:8000/question", options);
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = "";

        let currentPara = document.createElement("p");
        currentPara.classList.add("story-part");
        storyBox.appendChild(currentPara);

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
        questionBox.innerHTML = "";

        const input = document.querySelector("#question-input");
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

        const response = await fetch("http://localhost:8000/bardtext", options);
        const data = await response.json();

        const responsePara = document.createElement("p");
        responsePara.classList.add("bard-answer");
        responsePara.innerText = data.answer;
        questionBox.appendChild(responsePara);
    }
}


export default askQuestion;
