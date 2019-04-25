 (function() {
     // console.log("log log")
     let contentWrap = document.getElementById("contentWrap");

     let nickForm = document.getElementById("nickForm");
     let nickError = document.getElementById("nickError");
     let nickBox = document.getElementById("nickName");
     let hashtagBox = document.getElementById("hashtagName");
     const socket = io();

     nickForm.addEventListener("submit", function(e) {
         e.preventDefault();
         socket.emit('new user', nickBox.value, function(username) {
             if (username) {
                 nickWrap.classList.add('hidden');
                 allUsers.classList.remove('hidden');
             } else {
                 nickError.innerHTML = "Username is taken"
             }
         });
         nickBox.value = "";

         socket.emit('hashtag', hashtagBox.value)
     });

    const form = document.querySelector('.message');
    const inputValue = document.querySelector('#m');

     form.addEventListener("submit", function(e) {
        e.preventDefault();

         socket.emit('chat message', document.querySelector('#m').value);
         const typedword = document.querySelector('#m').value = "";
         return false;
     });



     socket.on('usernames', function(username) {
         let html = 'Current users in chat:' + '<br/>';
         for (i = 0; i < username.length; i++) {
             html += '<p>' + "•" + username[i] + '<br>' + '</p>'
         }
         let users = document.getElementById("users");

         users.innerHTML = html;

         console.log(users)
     });

     socket.on('chat message', function(data) {
         console.log(data.msg);
         console.log(data.nick);
         const li = document.createElement("li")
         const msgtext = document.createTextNode(data.msg);
         const msgname = document.createTextNode(data.nick);
         li.insertAdjacentHTML('beforeend', data.nick + ": " + data.msg)
         document.querySelector('#messages').appendChild(li);


         // let img = document.getElementById("img1");
         // const imgtext = document.createTextNode(data.datapic);
         // console.log(imgtext)
         // img.src = data.datapic;

     });

     socket.on('all users', function(data) {
        console.log(data)
        console.log(data.nick)
         let img = document.getElementById("allImages");
         let article = document.createElement("article")
         let createImg = document.createElement("img")
         createImg.classList.add("transparant")
         const imgtext = document.createTextNode(data.datapic);
         createImg.src = data.datapic;

         const sendImg = article.appendChild(createImg);

         img.appendChild(article)
         const hashtagImg = document.querySelector(".transparant")

         let users = document.getElementById("users");


         socket.emit('parsedImg', hashtagImg.src)

         const hashtagImages = document.querySelector('.myHashtagImg');
         console.log

     });

     socket.on('all images', function(data) {
        console.log(data.url)
        console.log(data.nick)
         let article = document.createElement("article")
         let img = document.getElementById("allImages");
         let image = document.createElement("img")
         image.classList.add("myHashtagImg")
         image.src = data.url

         article.appendChild(image)
         img.appendChild(article)

         const hashtagclass = document.querySelectorAll(".myHashtagImg")

         hashtagclass.forEach(item => {
             item.addEventListener('click', function() {
                 // const room ="example"
                 // socket.emit('room', room);

                 let otherPerson = document.querySelector(".element2");
                 let newNode = document.createElement("img");
                 newNode.classList.add("hashtagImage")
                 newNode.src = this.src

                 const myPerson = document.querySelector(".element1")
                 let myHashtagImg = document.querySelector(".transparant");
                 let newNodeImg = document.createElement("img");
                 newNodeImg.classList.add("hashtagImage");
                 newNodeImg.src = myHashtagImg.src;


                 otherPerson.appendChild(newNode);
                 myPerson.appendChild(newNodeImg);

                 console.log(this, "this is clicked")
                 allUsers.classList.add('hidden');
                 contentWrap.classList.remove('hidden');

                 const imageObj1 = new Image();
                 const imageObj2 = new Image();
                 let clone1 = newNodeImg.cloneNode(true);
                 let clone2 = newNode.cloneNode(true);

                 imageObj1.src = clone1.src
                 imageObj2.src = clone2.src
                 console.log(clone2.src)


                var canvas = document.getElementById('myCanvas');
                var context = canvas.getContext('2d');

                canvas.width = imageObj1.width;
                canvas.height = imageObj1.height;
                // canvas.width = imageObj2.width;
                // canvas.height = imageObj2.height;

                context.globalAlpha = 1.0;
                context.drawImage(imageObj1, 0, 0);
                context.globalAlpha = 0.5; //Remove if pngs have alpha
                context.drawImage(imageObj2, 0, 0);

                const users = []
                socket.emit('chatgroup', data.nick)

                 // let usernames = 'Current users in chat:' + '<br/>';
                 //     usernames += '<p>' + "•" + data.nick + '<br>' + '</p>'

                 // let users = document.querySelector("#contentWrap #users");

                 // users.innerHTML = usernames;
                console.log(data.nick, "joined this room")
             })
         })
     })

     var room = "example";

         // socket.on('chat message', function() {});
    socket.on('user disconnected', function (data) {
        console.log(data.nick, "is gone")

        if(data === undefined){
            console.log(data.nick, "Doe niks")
        }else{
            let messagesUser = document.querySelector('#users p');

            console.log(messagesUser)
            messagesUser.innerHTML = "";
            console.log(data.nick,"user is weg");
        }
    });
 }());