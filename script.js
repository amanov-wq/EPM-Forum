// ===============================
// ESTAMON SIDE MENU
// ===============================

function toggleMenu() {

    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    menu.classList.toggle("active");
    overlay.classList.toggle("active");

}


// Закрытие по клавише Esc

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        document.getElementById("sideMenu").classList.remove("active");
        document.getElementById("menuOverlay").classList.remove("active");

    }

});