const user = JSON.parse(
localStorage.getItem("user")
);


if(user){


console.log("Пользователь вошёл:", user.login);



}