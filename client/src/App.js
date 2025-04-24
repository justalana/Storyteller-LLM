async function askQuestion(e) {
    e.preventDefault();
    const chatfield = document.querySelector("#chatfield");
    const answer = document.querySelector("#response")

    answer.innerText = "";

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

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, {stream: true});
        let words = buffer.split(/\s+/);
        buffer = words.pop();
        for (let word of words) {
            // console.log(word);
            answer.innerText += " " + word
        }
    }
    if (buffer) {
        console.log(buffer)
        answer.innerText += " " + buffer;
    }
}

export default askQuestion;
