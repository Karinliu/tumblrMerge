 (function() {
     // console.log("log log")
     let contentWrap = document.getElementById("contentWrap");

     let nickForm = document.getElementById("nickForm");
     let nickError = document.getElementById("nickError");
     let nickBox = document.getElementById("nickName");
     let hashtagBox = document.getElementById("hashtagName");
     const socket = io();

     // var socket = io.connect('http://ip:port');

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

     socket.on('usernames', function(username) {
         let html = 'Current users in chat:' + '<br/>';
         for (i = 0; i < username.length; i++) {
             html += '<p>' + "•" + username[i] + '<br>' + '</p>'
         }
         let users = document.getElementById("users");

         users.innerHTML = html;

         // console.log(users)
     });

     socket.on('chat message', function(data) {
         // console.log(data.msg);
         console.log(data);

         const li = document.createElement("li")
         const msgtext = document.createTextNode(data.msg);
         const msgname = document.createTextNode(data.nick);
         li.insertAdjacentHTML('beforeend', data.nick + ": " + data.msg)
         document.querySelector('#messages').appendChild(li);

     });

     socket.on('choose image', function(data){
        console.log(data)

        const filteredData = data
            .map(item=>item.tags)
            .reduce((acc, val) => acc.concat(val), [])
            .filter(onlyUnique);

        filteredData.forEach(tag=>{
            const newElement = `
            <div>
                
                <label for="">${tag}</label>
                <input type="checkbox"  value="${tag}" />
            </div
            `
            document.querySelector('#allTags').insertAdjacentHTML('beforeend', newElement)
        })
        addEventToCheckbox()
        data.forEach(item => {
             // console.log('Creating image')
             let article = document.createElement("article")
             let createImg = document.createElement("img")
             // let createImgPara = document.createElement("p")
                 // createImg.classList.add("transparant")
             const imgtext = document.createTextNode('item.pic');
             // const imgtextPTag = document.createTextNode('User: '+ item.nick);
             createImg.src = item.pic;
             // createImg.id = 'id' + item.socketId

             // createImgPara.appendChild(imgtextPTag)
             // console.log(createImgPara)
             article.appendChild(createImg);
             // article.appendChild(createImgPara);

             allImages.appendChild(article)
        })
        chooseImage()
     })
     const filterValue =[]
     function addEventToCheckbox(){
        console.log('adding events to checkbox')
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox=>{
            // console.log(checkbox)
            checkbox.addEventListener('click',checkValue)
        })
     }
     function checkValue(){
        console.log('click')
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox=>{
            if(checkbox.checked){
                console.log(checkbox.value)
                if(!filterValue.includes(checkbox.value)){
                    filterValue.push(checkbox.value)
                }
                
                filterList()
            }   
        })
     }
     // function filterList(){
     //    filterValue.forEach(value => 
     //        )
     //    // console.log(filterValue)
     // }
//Helper function
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

          function chooseImage(){
        const chosenimg = document.querySelectorAll('#allImages article img')

        chosenimg.forEach(img =>{
            img.addEventListener('click', function(data){
                console.log(this.src)
            })
            socket.emit(    )
        })
        }

     socket.on('all users', function(data) {
         // console.log(data)
         let allImages = document.getElementById("allImages");
         allImages.innerHTML = ""
         data.forEach(item => {
             // console.log('Creating image')
             let article = document.createElement("article")
             let createImg = document.createElement("img")
             let createImgPara = document.createElement("p")
                 // createImg.classList.add("transparant")
             const imgtext = document.createTextNode(item.datapic);
             const imgtextPTag = document.createTextNode('User: '+ item.nick);
             createImg.src = item.datapic;
             createImg.id = 'id' + item.socketId

             createImgPara.appendChild(imgtextPTag)
             console.log(createImgPara)
             article.appendChild(createImg);
             article.appendChild(createImgPara);

             allImages.appendChild(article)
             const hashtagImg = document.querySelector(".transparant")

             let users = document.getElementById("users");


             // socket.emit('parsedImg', hashtagImg.src)

             const hashtagImages = document.querySelector('.myHashtagImg');
         })
         addEventForRoom()

         // console.log
     });

     function addEventForRoom() {
         const allImages = document.querySelectorAll("#allImages article img")
         allImages.forEach((img) => {
             img.addEventListener('click', createRoom)
         })
     }

     function createRoom() {
         socket.emit('make room', this.id.slice(2))
             // console.log(this)
     }

     socket.on('join the room plz', (id) => {
         // console.log('can you join the room', id)
         const newElement = `
        <div class='invite' id=${id}>
            <button>yes</button>
            <button>no</button>
        </div>
        `         
        console.log(document.querySelectorAll('.invite > .containerBtn button'))

         document.body.insertAdjacentHTML('beforeend', newElement)
         document.querySelectorAll('.invite button').forEach(button => {
             // console.log(button)
             button.addEventListener('click', acceptOrDeny)
         })
     })

     function acceptOrDeny() {
         console.log(this.textContent)
         if (this.textContent === 'yes') {
             // console.log('acccepted')
             socket.emit('accepted invite', this.parentElement.id)
         } else {
            const invite = document.querySelector('.invite')
            invite.parentNode.removeChild(invite);
             console.log('denied')
         }
     }

     socket.on('joined room', (data) => {

         form.addEventListener("submit", function(e) {
             e.preventDefault();

             const msg = document.querySelector('#m').value;
             socket.emit('chat message', {
                 msg: msg,
                 data: data
             });
             const typedword = document.querySelector('#m').value = "";
             return false;
         });


         // console.log("wat is joined room the data", data)

         allUsers.classList.add('hidden');
         contentWrap.classList.remove('hidden');

         // console.log(data)
         // contentWrap.id = data;


         //Sidebar
         data.forEach(element => {
             const groupRoomUsers = document.getElementById("usersRoom")
             const usersInChat = `<p>• ${element.nick} </p>`

             groupRoomUsers.insertAdjacentHTML('beforeend', usersInChat)
                 // console.log("are this", usersInChat)
         })



         let inviteContainer = document.querySelector('.invite');

         if (inviteContainer !== null) {
             // If class exist
             inviteContainer.classList.add('hidden');
             // console.log()
             mergeImages(data);
         } else {
             mergeImages(data)
         }
     })

     function mergeImages(data) {
         // console.log("mergerd")
         // console.log(data)

         const mySection = document.querySelector(".element1")
         let newNodeImg = document.createElement("img");
         const myImgText = document.createTextNode(data[0].datapic);
         newNodeImg.src = data[0].datapic
         newNodeImg.id = 'id'+data[0].socketId

         // console.log(myImgText)

         mySection.appendChild(newNodeImg)


         const otherSection = document.querySelector(".element2")
         let newNodeImg2 = document.createElement("img");
         const myImgText2 = document.createTextNode(data[1].datapic);
         newNodeImg2.src = data[1].datapic
         newNodeImg2.id = 'id'+data[1].socketId

         // console.log(myImgText2)

         otherSection.appendChild(newNodeImg2);

         // Merge images to canvas
         const imageObj1 = new Image();
         const imageObj2 = new Image();
         let clone1 = newNodeImg.cloneNode(true);
         let clone2 = newNodeImg2.cloneNode(true);

         imageObj1.src = clone1.src
         clone1.crossOrigin="anonymous";
         imageObj2.src = clone2.src
         clone2.crossOrigin="anonymous";


         var canvas = document.getElementById('canvascontainer');
         // var context = canvas.getContext('2d');

         canvas.appendChild(clone1)
         canvas.appendChild(clone2)
         // canvas.width = imageObj1.width;
         // canvas.height = imageObj1.height;

         // context.globalAlpha = 1.0;
         // context.drawImage(imageObj1, 0, 0);
         // context.globalAlpha = 0.5; //Remove if pngs have alpha
         // context.drawImage(imageObj2, 0, 0);

         // canvas.toDataUrl('image/jpeg')
         socket.emit('download image screen one', clone1.src)
         socket.emit('download image screen two', clone2.src)

     }

     const buttonFilter = document.getElementById('chooseColor')
     chooseColor.addEventListener('submit', chooseColorFilter)

     function chooseColorFilter(e){
        e.preventDefault()
        console.log(document.getElementById('chooseColor'))

        const inputRadio = document.querySelectorAll('#chooseColor input')

        inputRadio.forEach(radio=>{
            if(radio.checked){
                console.log(radio.value)
                const mergedImageContainer = document.getElementById('canvascontainer')
                mergedImageContainer.classList = ""
                mergedImageContainer.classList.add(radio.value)

                socket.emit('changed color', radio.value)
            }
        })
       console.log(inputRadio)
     }


     socket.on('update mergedImages', function(data) {
        console.log(data)
            // console.log(colorUpdate)
            // document.getElementById('canvascontainer').innerHTML=""
            // const color = colorUpdate.forEach(color =>{
            //     console.log(color.datapic[0])
            //     return color.datapic[0]

            // })

            // const allImages = document.querySelectorAll('img').forEach(img =>{
            //         if(img.src === color){
            //             console.log("correct", color)
            //         }
            //     })
        const mySection = document.querySelector(".element1")
         let newNodeImg = document.createElement("img");
         const myImgText = document.createTextNode(data.data[0].datapic);
         newNodeImg.src = data.data[0].datapic
         newNodeImg.id = 'id'+data.data[0].socketId
         mySection.innerHTML = ""
         mySection.classList = ""
         mySection.classList.add(data.data[0].color, 'element1')

         // console.log(myImgText)
         mySection.appendChild(newNodeImg)


         const otherSection = document.querySelector(".element2")
         let newNodeImg2 = document.createElement("img");
         const myImgText2 = document.createTextNode(data.data[1].datapic);
         newNodeImg2.src = data.data[1].datapic
         newNodeImg2.id = 'id'+data.data[1].socketId
         otherSection.innerHTML = ""
         otherSection.classList = ""
        otherSection.classList.add(data.data[1].color, 'element2')

         // console.log(myImgText2)

         otherSection.appendChild(newNodeImg2);

         // Merge images to canvas
         const imageObj1 = new Image();
         const imageObj2 = new Image();
         let clone1 = newNodeImg.cloneNode(true);
         let clone2 = newNodeImg2.cloneNode(true);

         imageObj1.src = clone1.src
         clone1.crossOrigin="anonymous";
         imageObj2.src = clone2.src
         clone2.crossOrigin="anonymous";


         let  canvas = document.getElementById('canvascontainer');
         canvas.innerHTML =""
         canvas.classList = ""
         // data.forEach(item =>{
            canvas.classList.add(data.color)
         // })

         canvas.appendChild(clone1)
         canvas.appendChild(clone2)

                                    
        })




     function screenshot(){
       // html2canvas(document.getElementById('canvascontainer'), { allowTaint: true })
       // .then(function(canvas) {
       //  canvas.classList.add('canvasDownload')
       //  document.body.appendChild(canvas);

       //  canvas.toDataURL('images/jpeg')
       // });

       socket.emit('download image screen')
      }

     // function report() {
     //    const canvas = document.getElementById("myCanvas");
     //    canvas.toDataUrl('image/jpeg')
        // canvas.toBlob(function(blob) {
        //     saveAs(blob, "pretty image.png");

        //     console.log(blob)
        //      canvas.toDataUrl('image/jpeg', 1.0)
        //      console.log(canvas)
            // socket.emit('download image screen')
        // });
        // var c = document.getElementById("myCanvas");
        // var dom = document.getElementById("dom");
        // var ctx = c.getContext("2d");

        // // var imgData = ctx.getImageData(10, 10, 50, 50);
        // //   dom.putImageData(imgData, 10, 70);

        // // var canvas = document.createElement("canvas");
        // // var ctx = canvas.getContext("2d");
        // var img = new Image();
        // img.crossOrigin = "anonymous";
        // img.onload = function() {
        //   dom.width = img.width;
        //   dom.height = img.height;
        //   ctx.drawImage(img, 0, 0);
        //   originalImageData = ctx.canvas.toDataURL();
        // }
        // img.src = 'picture.jpeg';

     // }


     socket.on('delete images with this id', function(data) {
         // console.log(data)

         data.forEach(data => {
             // console.log('id'+data)

             // console.log(data)

             const overviewAllImages = document.querySelectorAll("#allImages article img");

             overviewAllImages.forEach((id) => {
                 // console.log("hoeveel goed?", id.id === data)
                 if (id.id === 'id' + data) {
                     // console.log('founded');
                     id.classList.add('isUsed')

                     // console.log(this)
                     // console.log(data)
                 } else {

                 }
             })
         })
     })

     // socket.on('all images', function(data) {
     //     let article = document.createElement("article")
     //     let img = document.getElementById("allImages");
     //     let image = document.createElement("img")
     //     image.classList.add("myHashtagImg")
     //     image.src = data.url

     //     article.appendChild(image)
     //     img.appendChild(article)

     //     const hashtagclass = document.querySelectorAll(".myHashtagImg")

     //     hashtagclass.forEach(item => {
     //         item.addEventListener('click', function() {
     //             // const room ="example"
     //             // socket.emit('room', room);

     //             let otherPerson = document.querySelector(".element2");
     //             let newNode = document.createElement("img");
     //             newNode.classList.add("hashtagImage")
     //             newNode.src = this.src

     //             const myPerson = document.querySelector(".element1")
     //             let myHashtagImg = document.querySelector(".transparant");
     //             let newNodeImg = document.createElement("img");
     //             newNodeImg.classList.add("hashtagImage");
     //             newNodeImg.src = myHashtagImg.src;


     //             otherPerson.appendChild(newNode);
     //             myPerson.appendChild(newNodeImg);

     //             console.log(this, "this is clicked")


     //            const users = []
     //            socket.emit('chatgroup', data.nick)

     //             // let usernames = 'Current users in chat:' + '<br/>';
     //             //     usernames += '<p>' + "•" + data.nick + '<br>' + '</p>'

     //             // let users = document.querySelector("#contentWrap #users");

     //             // users.innerHTML = usernames;
     //            console.log(data.nick, "joined this room")

     //                socket.emit('subscribe', 'conversation_id');

     //                socket.emit('send message', {
     //                    room: 'conversation_id',
     //                    message: "Some message"
     //                });

     //                socket.on('conversation private post', function(data) {
     //                    //display data.message
     //                });
     //         })
     //     })
     // })

     // socket.on('chat message', function() {});
     socket.on('user disconnected', function(data) {
         console.log(data.nick, "is gone")

         if (data === undefined) {
             console.log(data.nick, "Doe niks")
         } else {
             let messagesUser = document.querySelector('#users p');

             console.log(messagesUser)
             messagesUser.innerHTML = "";
             console.log(data.nick, "user is weg");
         }
     });
 }());