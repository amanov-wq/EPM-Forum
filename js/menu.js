const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");


if(menuBtn && sideMenu){

    menuBtn.addEventListener("click", () => {

        sideMenu.classList.toggle("active");

    });


    document.addEventListener("click", (event)=>{

        if(
            !sideMenu.contains(event.target) &&
            !menuBtn.contains(event.target)
        ){

            sideMenu.classList.remove("active");

        }

    });

}