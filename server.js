const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");


const app = express();

const PORT = process.env.PORT || 3000;


console.log("SERVER DIR:", __dirname);
console.log("FILES:", fs.readdirSync(__dirname));


// =================
// SETTINGS
// =================

app.use(cors());

app.use(express.json());


// сайт находится на уровень выше папки server

app.use(express.static(__dirname));



// =================
// JSON FILES
// =================


const usersFile = path.join(__dirname,"users.json");
const topicsFile = path.join(__dirname,"topics.json");
const newsFile = path.join(__dirname,"news.json");
const reviewsFile = path.join(__dirname,"reviews.json");
const purchasesFile = path.join(__dirname,"purchases.json");
const permissionsFile = path.join(__dirname,"permissions.json");
const donateFile = path.join(__dirname,"donate.json");





// =================
// CREATE FILES
// =================


[
    usersFile,
    topicsFile,
    newsFile,
    reviewsFile,
    purchasesFile,
    permissionsFile,
    donateFile

].forEach(file=>{


    if(!fs.existsSync(file)){


        fs.writeFileSync(
            file,
            "[]",
            "utf8"
        );


    }


});





// =================
// JSON FUNCTIONS
// =================


function readJSON(file){


    try{


        return JSON.parse(
            fs.readFileSync(
                file,
                "utf8"
            )
        );


    }catch(e){


        return [];


    }


}





function saveJSON(file,data){


    fs.writeFileSync(

        file,

        JSON.stringify(
            data,
            null,
            4
        ),

        "utf8"

    );


}





function getUsers(){
    return readJSON(usersFile);
}


function saveUsers(data){
    saveJSON(usersFile,data);
}



function getTopics(){
    return readJSON(topicsFile);
}


function saveTopics(data){
    saveJSON(topicsFile,data);
}



function getNews(){
    return readJSON(newsFile);
}


function saveNews(data){
    saveJSON(newsFile,data);
}



function getReviews(){
    return readJSON(reviewsFile);
}


function saveReviews(data){
    saveJSON(reviewsFile,data);
}



function getPurchases(){
    return readJSON(purchasesFile);
}


function savePurchases(data){
    saveJSON(purchasesFile,data);
}



function getPermissions(){
    return readJSON(permissionsFile);
}





// =================
// ROLES
// =================


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





function canManage(role){


    return staffRoles.includes(role);


}
// =================
// HOME
// =================


app.get("/",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "index.html"
        )
    );

});





// =================
// REGISTER
// =================


app.post("/register",(req,res)=>{


    const {
        login,
        email,
        password

    } = req.body;



    if(!login || !email || !password){


        return res.json({

            success:false,

            message:"Заполните все поля"

        });


    }





    let users = getUsers();




    let exists = users.find(u=>

        u.login.toLowerCase()
        ===
        login.toLowerCase()

    );





    if(exists){


        return res.json({

            success:false,

            message:"Пользователь уже существует"

        });


    }





    let user = {


        login,

        email,

        password,


        role:"Пользователь",


        level:1,


        money:0,


        avatar:"images/default-avatar.png",


        messages:0,


        topics:0,


        likes:0,


        date:
        new Date()
        .toLocaleDateString("ru-RU")


    };





    users.push(user);


    saveUsers(users);




    res.json({

        success:true,

        message:"Регистрация успешна"

    });



});








// =================
// LOGIN
// =================


app.post("/login",(req,res)=>{


    let users=getUsers();




    let user = users.find(u=>


        u.login.toLowerCase()
        ===
        req.body.login.toLowerCase()


        &&


        u.password
        ===
        req.body.password



    );






    if(!user){


        return res.json({

            success:false,

            message:"Неверный логин или пароль"

        });


    }






    res.json({

        success:true,

        user:user

    });



});








// =================
// PROFILE
// =================


app.get("/profile/:login",(req,res)=>{

app.get("/:page", (req,res)=>{

    let file = path.join(
        __dirname,
        "..",
        req.params.page
    );


    res.sendFile(file);

});


    let users=getUsers();




    let user = users.find(u=>


        u.login.toLowerCase()
        ===
        req.params.login.toLowerCase()


    );





    if(!user){


        return res.status(404).json({

            success:false,

            message:"Пользователь не найден"

        });


    }





    res.json(user);



});









// =================
// CHANGE AVATAR
// =================


app.post("/profile/avatar",(req,res)=>{


    let users=getUsers();




    let user = users.find(u=>

        u.login
        ===
        req.body.login

    );





    if(!user){


        return res.json({

            success:false,

            message:"Пользователь не найден"

        });


    }





    user.avatar=req.body.avatar;



    saveUsers(users);




    res.json({

        success:true,

        message:"Аватар изменён"

    });



});
// =================
// FORUM TOPICS
// =================


// список тем

app.get("/api/topics",(req,res)=>{


    let topics=getTopics();


    topics.sort((a,b)=>{


        return (b.pinned ? 1 : 0)
        -
        (a.pinned ? 1 : 0);


    });



    res.json(topics);


});







// =================
// CREATE TOPIC RIGHTS
// =================


function canCreateTopic(role,section){



    let publicSections=[


        "Общение",

        "Жалобы",

        "Баг-репорты",

        "Отзывы"


    ];





    if(publicSections.includes(section)){


        return true;


    }





    if(canManage(role)){


        return true;


    }




    return false;


}








// =================
// CREATE TOPIC
// =================


app.post("/api/topics",(req,res)=>{


    let users=getUsers();



    let user=users.find(u=>

        u.login===req.query.author

    );





    if(!user){


        return res.json({

            success:false,

            message:"Пользователь не найден"

        });


    }





    if(!canCreateTopic(
        user.role,
        req.body.section
    )){


        return res.json({

            success:false,

            message:"Нет прав создавать темы"

        });


    }





    let topics=getTopics();




    let topic={


        id:Date.now(),


        title:req.body.title,


        text:req.body.text,


        section:req.body.section,


        author:user.login,


        role:user.role,


        date:
        new Date()
        .toLocaleString("ru-RU"),



        answers:[],


        pinned:false,


        closed:false



    };





    topics.push(topic);



    saveTopics(topics);




    user.topics =
    (user.topics || 0)+1;



    saveUsers(users);





    res.json({

        success:true,

        message:"Тема создана"

    });



});









// =================
// OPEN TOPIC
// =================


app.get("/api/topics/:id",(req,res)=>{


    let topics=getTopics();



    let topic=topics.find(t=>

        t.id==req.params.id

    );





    if(!topic){


        return res.status(404).json({

            success:false,

            message:"Тема не найдена"

        });


    }





    res.json(topic);



});









// =================
// ANSWER TOPIC
// =================


app.post("/api/topics/:id/answer",(req,res)=>{


    let topics=getTopics();



    let topic=topics.find(t=>

        t.id==req.params.id

    );





    if(!topic){


        return res.json({

            success:false,

            message:"Тема не найдена"

        });


    }





    if(topic.closed){


        return res.json({

            success:false,

            message:"Тема закрыта"

        });


    }





    topic.answers.push({


        author:req.query.author,


        text:req.body.text,


        date:
        new Date()
        .toLocaleString("ru-RU")


    });





    saveTopics(topics);





    res.json({

        success:true,

        message:"Ответ добавлен"

    });



});









// =================
// DELETE TOPIC
// =================


app.delete("/api/topics/:id",(req,res)=>{


    let users=getUsers();



    let user=users.find(u=>

        u.login===req.query.author

    );





    if(!user || !canManage(user.role)){


        return res.json({

            success:false,

            message:"Нет прав"

        });


    }





    let topics=getTopics();




    topics =
    topics.filter(t=>

        t.id!=req.params.id

    );





    saveTopics(topics);





    res.json({

        success:true,

        message:"Тема удалена"

    });



});









// =================
// PIN TOPIC
// =================


app.post("/api/topics/:id/pin",(req,res)=>{


    let users=getUsers();



    let user=users.find(u=>

        u.login===req.query.author

    );





    if(!user || !canManage(user.role)){


        return res.json({

            success:false,

            message:"Нет прав"

        });


    }





    let topics=getTopics();



    let topic=topics.find(t=>

        t.id==req.params.id

    );





    if(topic){


        topic.pinned=true;


        saveTopics(topics);


    }





    res.json({

        success:true

    });



});









// =================
// CLOSE TOPIC
// =================


app.post("/api/topics/:id/close",(req,res)=>{


    let users=getUsers();



    let user=users.find(u=>

        u.login===req.query.author

    );





    if(!user || !canManage(user.role)){


        return res.json({

            success:false,

            message:"Нет прав"

        });


    }





    let topics=getTopics();



    let topic=topics.find(t=>

        t.id==req.params.id

    );





    if(topic){


        topic.closed=true;


        saveTopics(topics);


    }





    res.json({

        success:true

    });



});
// =================
// REVIEWS
// =================


app.get("/reviews",(req,res)=>{


    res.json(
        getReviews()
    );


});





app.post("/reviews",(req,res)=>{


    let reviews=getReviews();



    if(!req.query.author || !req.body.text){


        return res.json({

            success:false,

            message:"Заполните поля"

        });


    }





    reviews.push({


        id:Date.now(),


        author:req.query.author,


        text:req.body.text,


        rating:req.body.rating || 5,


        date:
        new Date()
        .toLocaleString("ru-RU")


    });





    saveReviews(reviews);





    res.json({

        success:true,

        message:"Отзыв добавлен"

    });



});









// =================
// NEWS
// =================


app.get("/news",(req,res)=>{


    res.json(
        getNews()
    );


});






app.post("/news",(req,res)=>{


    let users=getUsers();



    let user=users.find(u=>

        u.login===req.query.author

    );





    if(!user || !canManage(user.role)){


        return res.json({

            success:false,

            message:"Нет прав"

        });


    }





    let news=getNews();



    news.push({


        id:Date.now(),


        title:req.body.title,


        text:req.body.text,


        author:user.login,


        date:
        new Date()
        .toLocaleString("ru-RU")


    });





    saveNews(news);





    res.json({

        success:true,

        message:"Новость создана"

    });



});









// =================
// DONATE PRODUCTS
// =================


app.get("/donate/products",(req,res)=>{


    let products =
    readJSON(donateFile);



    res.json(products);



});








// =================
// CREATE DONATE ORDER
// =================


app.post("/donate/create-payment",(req,res)=>{


    let purchases=getPurchases();





    let order={


        id:Date.now(),


        nickname:req.body.nickname,


        email:req.body.email,


        product:req.body.product,


        price:req.body.price,


        payment:req.body.payment,


        status:"Ожидает оплаты",


        date:
        new Date()
        .toLocaleString("ru-RU")


    };





    purchases.push(order);



    savePurchases(purchases);





    res.json({

        success:true,

        message:"Заказ создан",

        order:order

    });



});









// =================
// ADMIN CHECK
// =================


app.get("/check-admin/:login",(req,res)=>{


    let users=getUsers();



    let user=users.find(u=>

        u.login.toLowerCase()
        ===
        req.params.login.toLowerCase()

    );





    if(!user){


        return res.json({

            allowed:false

        });


    }





    res.json({

        allowed:
        canManage(user.role)

    });



});









// =================
// ADMIN USERS
// =================


app.get("/admin/users",(req,res)=>{


    res.json(
        getUsers()
    );


});







// изменить роль

app.post("/admin/role",(req,res)=>{


    let users=getUsers();



    let user=users.find(u=>

        u.login===req.body.login

    );





    if(!user){


        return res.json({

            success:false,

            message:"Пользователь не найден"

        });


    }





    user.role=req.body.role;



    saveUsers(users);





    res.json({

        success:true,

        message:"Роль изменена"

    });



});









// =================
// ADMIN PURCHASES
// =================


app.get("/admin/purchases",(req,res)=>{


    res.json(
        getPurchases()
    );


});







app.post("/admin/purchase/status",(req,res)=>{


    let purchases=getPurchases();



    let purchase=purchases.find(p=>

        p.id==req.body.id

    );





    if(!purchase){


        return res.json({

            success:false,

            message:"Покупка не найдена"

        });


    }





    purchase.status=req.body.status;



    savePurchases(purchases);





    res.json({

        success:true,

        message:"Статус изменён"

    });



});
// =================
// MINECRAFT SERVER INFO
// =================

const { status } = require("minecraft-server-util");


app.get("/server-info", async (req,res)=>{


    try{


        let server = await status(

            "EstamonHost.ru",

            25565

        );



        res.json({


            online:true,


            players:

            server.players.online
            +
            "/"
            +
            server.players.max,



            version:

            server.version.name
            .replace(/§./g,""),



            motd:

            server.motd.clean


        });



    }catch(error){



        res.json({


            online:false,


            players:"0/0",


            version:"Offline",


            motd:"Сервер выключен"


        });



    }



});









// =================
// MILLIDA READY
// =================
//
// Тут позже подключим API Millida
//
// после оплаты:
//
// 1. Получаем ник игрока
// 2. Получаем купленный донат
// 3. Отправляем команду:
//
// pex user NICK group set GROUP
//
// или через RCON
//
// =================




function createDonateCommand(
    nickname,
    group
){


    if(!nickname || !group){

        return null;

    }



    return `pex user ${nickname} group set ${group}`;


}






app.post("/donate/give",(req,res)=>{


    let command =
    createDonateCommand(

        req.body.nickname,

        req.body.group

    );





    if(!command){


        return res.json({

            success:false,

            message:"Ошибка данных"

        });


    }





    res.json({

        success:true,

        command:command

    });



});









// =================
// START SERVER
// =================


app.listen(PORT, ()=>{

    console.log(
        "ESTAMON server started"
    );

});