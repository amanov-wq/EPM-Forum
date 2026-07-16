// ===============================
// ESTAMON AUTH
// ===============================


document.addEventListener("DOMContentLoaded",()=>{


let user = localStorage.getItem("estamonUser");

let page = location.pathname.split("/").pop();


// страницы, куда можно без аккаунта

let allowed = [
"register.html",
"login.html"
];



// если аккаунта нет

if(!user){


    if(!allowed.includes(page)){


        location.href="register.html";


    }


}



});