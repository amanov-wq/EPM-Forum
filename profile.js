document.addEventListener("DOMContentLoaded", () => {


    const login = localStorage.getItem("login");


    const nickname = document.getElementById("nickname");
    const avatar = document.getElementById("avatar");
    const profileAvatar = document.getElementById("profileAvatar");
    const roleBadge = document.getElementById("roleBadge");


    if (!login) {

        nickname.textContent = "Гость";
        roleBadge.textContent = "Игрок";

        return;

    }



    fetch(`/profile/${login}`)

    .then(res => res.json())

    .then(user => {



        // НИК

        nickname.textContent =
            user.login;



        // АВАТАР

        if(user.avatar){

            avatar.src =
                user.avatar;

            profileAvatar.src =
                user.avatar;

        }



        // СТАТИСТИКА

        document.getElementById("level").textContent =
            user.level || 1;


        document.getElementById("money").textContent =
            user.money || 0;


        document.getElementById("email").textContent =
            user.email || "-";





        // РОЛИ ESTAMON

        const roles = {


            "founder": [
                "Создатель",
                "role-founder"
            ],


            "mode_curator": [
                "Куратор Режима",
                "role-mode-curator"
            ],


            "deputy_curator": [
                "Зам. Куратора",
                "role-deputy-curator"
            ],


            "team_curator": [
                "Куратор Команды Проекта",
                "role-team-curator"
            ],


            "ads_curator": [
                "Куратор по рекламе",
                "role-ads-curator"
            ],


            "senior_moderator": [
                "Ст. Модератор",
                "role-smoder"
            ],


            "moderator": [
                "Модератор",
                "role-moder"
            ],


            "junior_moderator": [
                "Мл. Модератор",
                "role-jmoder"
            ],


            "senior_helper": [
                "Ст. Хелпер",
                "role-shelper"
            ],


            "helper": [
                "Хелпер",
                "role-helper"
            ],


            "junior_helper": [
                "Мл. Хелпер",
                "role-jhelper"
            ],


            "trainee": [
                "Стажёр",
                "role-trainee"
            ],


            "player": [
                "Игрок",
                "role-player"
            ]

        };



        const role =
            roles[user.role] || roles.player;



        roleBadge.textContent =
            role[0];


        roleBadge.classList.add(
            role[1]
        );



    })


    .catch(err => {

        console.error(
            "Ошибка загрузки профиля:",
            err
        );


        nickname.textContent =
            "Ошибка загрузки";

    });



});