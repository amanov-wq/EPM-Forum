function openTopic(){

document
.getElementById("topicWindow")
.style.display="flex";

}



function closeTopic(){

document
.getElementById("topicWindow")
.style.display="none";

}






function openSections(){

document
.getElementById("sectionList")
.classList.toggle("show");


}




function chooseSection(value,text){


document
.getElementById("topicSection")
.value=value;



document
.getElementById("selectedSection")
.innerHTML=text;



document
.getElementById("sectionList")
.classList.remove("show");


}







function createTopic(){



let title =
document.getElementById("topicTitle").value;



let section =
document.getElementById("topicSection").value;



let text =
document.getElementById("topicText").value;




if(!title || !section || !text){


alert("Заполните все поля");


return;


}





fetch("http://localhost:3000/topics",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({


title:title,


section:section,


text:text,


author:"Игрок"


})


})


.then(res=>res.json())


.then(data=>{


alert("Тема создана");


closeTopic();


loadTopics();


});



}









function loadTopics(){


fetch("http://localhost:3000/topics")


.then(res=>res.json())


.then(topics=>{



let box =
document.getElementById("topicsList");



box.innerHTML="";



if(topics.length===0){


box.innerHTML="<p>Тем пока нет</p>";


return;


}





box.innerHTML += `

<div class="forum-card topic-item"
onclick="openTopic(${t.id})">

<h2>📌 ${t.title}</h2>

<p>

Раздел: ${t.section}
<br>
Автор: ${t.author}
<br>
Дата: ${t.date}

</p>

</div>

`;





});



});



}




loadTopics();
function formatText(type){


let area = document.getElementById("topicText");


let start = area.selectionStart;

let end = area.selectionEnd;


let text = area.value.substring(start,end);



if(type==="bold"){


text = "<b>"+text+"</b>";


}



if(type==="italic"){


text="<i>"+text+"</i>";


}



if(type==="list"){


text="\n• "+text;


}



area.value =
area.value.substring(0,start)
+
text
+
area.value.substring(end);



updatePreview();


}





document
.getElementById("topicText")
.addEventListener(
"input",
updatePreview
);





function updatePreview(){


let text =
document.getElementById("topicText").value;


document.getElementById("topicPreview").innerHTML =
text || "Здесь появится текст темы...";


}
function openTopic(id){

window.location.href =
`topic.html?id=${id}`;

}