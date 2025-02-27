document.addEventListener("DOMContentLoaded", loadTopics);

function addTopic() {
    let topicName = prompt("Enter Topic Name:");
    if (!topicName) return;

    let topics = JSON.parse(localStorage.getItem("topics")) || [];
    topics.push({ name: topicName, subtopics: [] });
    localStorage.setItem("topics", JSON.stringify(topics));

    loadTopics();
}

function addSubtopic(topicIndex) {
    let subtopicName = prompt("Enter Subtopic Name:");
    if (!subtopicName) return;

    let topics = JSON.parse(localStorage.getItem("topics"));
    topics[topicIndex].subtopics.push(subtopicName);
    localStorage.setItem("topics", JSON.stringify(topics));

    loadTopics();
}

function deleteTopic(index) {
    let topics = JSON.parse(localStorage.getItem("topics"));
    topics.splice(index, 1);
    localStorage.setItem("topics", JSON.stringify(topics));

    loadTopics();
}

function loadTopics() {
    let topics = JSON.parse(localStorage.getItem("topics")) || [];
    let container = document.getElementById("topics-container");
    container.innerHTML = "";

    // Randomize topics display
    topics.sort(() => Math.random() - 0.5);

    topics.forEach((topic, index) => {
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<h3>${topic.name}</h3>
            <button onclick="addSubtopic(${index})">+ Add a subtopic</button>
            <button onclick="deleteTopic(${index})">❌ Delete</button>
            <div class="subtopics">${topic.subtopics.map(sub => `<div class="subtopic">${sub}</div>`).join("")}</div>
            <button onclick="recordSpeech(${index})">🎤 Speak</button>
        `;
        container.appendChild(card);
    });

    new Sortable(container, { animation: 150 });
}

function recordSpeech(topicIndex) {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = function(event) {
        let speechText = event.results[0][0].transcript;
        let topics = JSON.parse(localStorage.getItem("topics"));
        topics[topicIndex].subtopics.push(speechText);
        localStorage.setItem("topics", JSON.stringify(topics));
        loadTopics();
    };

    recognition.start();
}
