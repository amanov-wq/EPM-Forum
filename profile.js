// ============================
// EPM PROFILE JS
// ============================


document.addEventListener("DOMContentLoaded", () => {



const userProfile = document.getElementById("userProfile");
const guestProfile = document.getElementById("guestProfile");



let user = JSON.parse(localStorage.getItem("user"));




// ============================
// ПРОВЕРКА ВХОДА
// ============================


if(!user){


    if(guestProfile)
        guestProfile.style.display = "block";


    if(userProfile)
        userProfile.style.display = "none";


    return;


}




// ============================
// ПОКАЗ ПРОФИЛЯ
// ============================


if(guestProfile)
    guestProfile.style.display = "none";


if(userProfile)
    userProfile.style.display = "block";





// ============================
// ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
// ============================



let nickname =
user.nickname ||
user.username ||
"Игрок";



let role =
user.role ||
"Пользователь";





let nick =
document.getElementById("profileNickname");


let roleBlock =
document.getElementById("profileRole");




if(nick)
    nick.textContent = nickname;



if(roleBlock)
    roleBlock.textContent = role;







// ============================
// АДМИНКА
// ============================



let adminButton =
document.getElementById("adminButton");



if(
role === "Создатель" ||
role === "Админ" ||
role === "Куратор"
){


    if(adminButton)
        adminButton.style.display="inline-flex";


}

else{


    if(adminButton)
        adminButton.style.display="none";


}








// ============================
// АВАТАР
// ============================


let avatar =
document.getElementById("userAvatar");



if(
user.avatar &&
avatar
){

    avatar.src=user.avatar;

}







// ============================
// СМЕНА АВАТАРА
// ============================


let avatarInput =
document.getElementById("avatarInput");



if(avatarInput){



avatarInput.addEventListener(
"change",
function(){



let file =
this.files[0];



if(!file)
return;




let reader =
new FileReader();



reader.onload=function(e){



avatar.src=e.target.result;



user.avatar=e.target.result;


localStorage.setItem(
"user",
JSON.stringify(user)
);



};



reader.readAsDataURL(file);



});


}








});






// ============================
// ВЫХОД
// ============================


function logout(){


localStorage.removeItem("user");


location.href="login.html";


}