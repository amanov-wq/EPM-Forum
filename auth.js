// ===============================
// ESTAMON AUTH
// ===============================


function getUser(){


    let user = localStorage.getItem("user");


    if(user){


        try{


            return JSON.parse(user);


        }catch(e){


            localStorage.removeItem("user");


            return null;


        }


    }


    return null;


}







function requireAuth(){


    let user = getUser();



    if(!user){


        alert(
            "Сначала зарегистрируйтесь или войдите в аккаунт"
        );


        window.location.href="login.html";


        return false;


    }



    return true;


}








function logout(){


    localStorage.removeItem("user");


    localStorage.removeItem("estamonUser");


    window.location.href="login.html";


}