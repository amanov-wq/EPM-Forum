const params = new URLSearchParams(window.location.search);
const topicId = params.get("id");

// Загрузка темы
async function loadTopic() {

    const response = await fetch(`/topics/${topicId}`);
    const topic = await response.json();

    document.getElementById("topicTitle").textContent = topic.title;
    document.getElementById("topicSection").textContent =
        "Раздел: " + topic.section;

    document.getElementById("authorLogin").textContent =
        topic.author;

    document.getElementById("authorRole").textContent =
        "Игрок";

    document.getElementById("topicDate").textContent =
        topic.date;

    document.getElementById("topicText").innerHTML =
        topic.text.replace(/\n/g,"<br>");

    const replies = document.getElementById("replyList");

    replies.innerHTML = "";

    if(topic.answers.length===0){

        replies.innerHTML="<p>Ответов пока нет.</p>";
        return;

    }

    topic.answers.forEach(reply=>{

        replies.innerHTML+=`

        <div class="forum-card">

            <h3>${reply.author}</h3>

            <small>${reply.date}</small>

            <p>${reply.text}</p>

        </div>

        `;

    });

}

// Отправка ответа
async function sendReply(){

    const text =
        document.getElementById("replyText").value;

    if(text.trim()===""){
        return;
    }

    const author =
        localStorage.getItem("login") || "Гость";

    await fetch(`/topics/${topicId}/answer`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            author,
            text

        })

    });

    document.getElementById("replyText").value="";

    loadTopic();

}

loadTopic();