const topics = [
    {
        title: "Добро пожаловать на форум Estamon RP",
        author: "Администрация",
        text: "Это первый официальный раздел форума."
    }
];

function loadTopics(){
    const box = document.getElementById("topics");

    if(!box) return;

    box.innerHTML = "";

    topics.forEach(topic=>{
        box.innerHTML += `
        <div class="topic">
            <h3>${topic.title}</h3>
            <p>${topic.text}</p>
            <small>Автор: ${topic.author}</small>
        </div>
        `;
    });
}

loadTopics();