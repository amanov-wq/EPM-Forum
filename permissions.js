const staffRoles = [

"Мл.Хелпер",
"Хелпер",
"Ст.Хелпер",
"Мл.Модератор",
"Модератор",
"Ст.Модератор",
"Куратор по рекламе",
"Куратор по команде проекта",
"Зам Куратор",
"Куратор режима",
"Создатель"

];


function isStaff(){

let user = JSON.parse(
localStorage.getItem("user")
);


if(!user) return false;


return staffRoles.includes(user.role);

}



function getUser(){

return JSON.parse(
localStorage.getItem("user")
);

}