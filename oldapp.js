const express = require('express');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const DomParser = require('dom-parser');
const domtoimage = require('dom-to-image');
const app = express()
    .set('view engine', 'ejs')
    .set('views', 'view')
    .use(express.static('./src/css'))
    .use(express.static('./src/js'))
    .use(express.static('./src/images'))
// .get('/', index)
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 1400;
const nicknames = [];
const images = [];
let usersObj = []
const tumblr = require('tumblr.js');
const client = tumblr.createClient({
    credentials: {
        consumer_key: 'hFpTEAwAQYaQB9UwzOCQ6Y5iqKgvJVgJw7xeApG6NPTWXvJlun',
        consumer_secret: '07cC4ZW0TAa9jG0JOznTbEh06gNdduJxJiOZMklWXCgCbi36QN',
        token: 'TqcRICAHPRvavfXV2wK4SD5WsOGD9jtmmv1wJGPSvE3td5Av9a',
        token_secret: '1LYcWXijdS2cWl1kzxvcIzNL19T5c1fIpVZI02l0uLnvT3ZqNQ'
    },
    returnPromises: true,

});

// Make the request
client.userInfo(function(err, data) {
    data.user.blogs.forEach(function(blog) {});
});

// client.blogPosts('staff')
//   .then(function(resp) {

//      console.log(resp.posts)
//     resp.posts;
//   })
//   .catch(function(err) {
//     // oops
//   });

// client.blogPosts('mochi', {type: 'photo', tag: ['cute']}, function(err, resp) {
//  console.log(resp.posts)
//   resp.posts; // use them for something
// });




// client.taggedPosts('blue',  function(err, data) {
//     console.log(data)
//     for (let i = 0; i < data.length; ++i) {
//         const post = data[i];

//         if (post.type === 'photo') {
//             // console.log(post.blog.name, post.id, post.tags.join(', '));
//             post.image_permalink
//             console.log(post.image_permalink);
//         }
//     }
// });
// getData('')


function getData(value) {
    return client.taggedPosts(value)
        .then(function(data) {
            // console.log(data[0])
            // console.log(data)
            const photo = data
                .filter(item => item.type === "photo")
                .map(photo => {
                    return {
                        pic: photo.photos.map(picture => {
                            return picture.original_size.url
                        }),
                        tags: photo.tags
                        // glow: ""
                    }
                })
            // console.log(photo)    
            return photo
        })
        .catch(function(err) {
            // oops
        });
}

io.on('connection', function(socket) {
    socket.on('hashtag', function(data, callback) {
        // console.log("tagwoord is " + data)
        const keyWord = data;

        getData(keyWord)
            .then(data => {
                // console.log('data is', data)
                // console.log('data is', data.length)
                const userObj = {
                    data: data[0],
                    datapic: data[0].pic,
                    datatag: data[0].tags,
                    socketId: socket.id,
                    nick: socket.nickname
                }
                usersObj.push(userObj)
                // console.log(usersObj)
                // console.log("data?"+data[0].pic)
                io.emit('all users', usersObj);
                // socket.emit('choose image', data)
            })
    });
    socket.on('make room', (id) => {
        socket.join(socket.id)
        // console.log(io.sockets)
        usersObj = usersObj.map(user => {
            if (user.socketId === socket.id) {
                users = user
                users.room = socket.id
                return user
            }
            return user
        })

        // console.log("object", usersObj)
        io.sockets.connected[id].emit('join the room plz', socket.id)
    })

    socket.on('changed color', function(color){
        console.log(socket.id)
        const updated = usersObj.map(user=>{
                if(user.socketId === socket.id) {
                    user = user
                    user.color = color
                    return user
                }else{
                    return user
                }
            })
        usersObj = updated

        const usersInRoom = usersObj.filter(user => {
            return user.socketId === socket.id
        })

        console.log('object room', updated[0].room)

        // socket.emit('update allUsers', updated)
        io.to(updated[0].room).emit('update mergedImages', {data: updated, color: color})
        console.log(updated)

    })

    socket.on('new user', function(username, callback) {
        callback(true);
        socket.nickname = username;
        nicknames.push(socket.nickname);
        // console.log(nicknames)
        io.emit('usernames', nicknames);

    });

    socket.on('accepted invite', function(socketroom) {
        // console.log('rooom',socketroom)
        socket.join(socketroom)
        usersObj = usersObj.map(user => {
            if (user.socketId === socket.id) {
                users = user
                users.room = socketroom
                return user
            }
            return user
        })
        // console.log('Usersobj' ,usersObj)
        const deleteItems = usersObj.filter(user => socketroom === user.room)
            .map(user => user.socketId)
        // console.log("deleted socket id", deleteItems)
        const usersInRoom = usersObj.filter(user => {
            return user.socketId === socketroom || user.socketId === socket.id
        })


        // const newArrayItems = usersObj.filter(user=>{
        //     return user.socketId === deleteItems
        // })

        // const deleteImagesFromList = usersObj
        //     .filter(user => {
        //         return socketroom !== user.room})
        //     .map(user =>{
        //         return usersInRoom
        //     })

        // usersObj = deleteImagesFromList;   

        // console.log(deleteImagesFromList);    
        // console.log("nieuwe usersobject is",usersObj);    


        // console.log("this users are in room", usersInRoom.socketId)
        io.emit('delete images with this id', deleteItems)
        console.log(usersInRoom)
        io.to(socketroom).emit('joined room', usersInRoom, socket.nickname)
    })

    // socket.on('denied invite', function(socketroom) {
        
    // })

    // socket.on('create', function(room) {
    //     console.log(room + " is joined by " +  socket.nickname)
    //     console.log("nickname is", socket.nickname)
    //     socket.join(room);

    //     console.log(io.sockets.clients('chatroom1'))
    // });

        socket.on('chat message', function(data) {
        console.log('is dit leeg?',usersObj)
        console.log('id is',socket.id)

        const users = usersObj
            .filter(user => {
                // console.log(user.socketId, socket.id)
                return user.socketId === socket.id
            })
            .map(user => {
                // console.log('data is', user)
                return {
                    nick: user.nick
                }
            })
        // console.log(users)

        // console.log(users[0].room)

        // if(data.msg !== ""){

        //     console.log('wat is al deze ',data.data)
        //     console.log("user is", data.nick)
        //     console.log("message is", data.msg)
        io.to(data.data[0].room).emit('chat message', {
            msg: data.msg,
            nick: users[0].nick
        })
        // }




        // console.log('socketid', socket.id)
        // io.to(socketroom).emit('chat message', {msg:msg, nick:socket.nickname, id: socket.id})  
        // io.emit('chat message', {msg:msg, nick:socket.nickname, id: socket.id})    
    });

    socket.on('parsedImg', function(data) {
        // console.log("coming from check" + data)
        // console.log("nickname " + socket.nickname, "sended an image")
        io.emit('all images', {
            url: data,
            nick: socket.nickname
        });
    })

    // socket.on('room', function(room, data) {
    //     console.log("room is joined by", socket.nickname)
    //     socket.join(room);
    // });

    socket.on('chatgroup', function(users) {
        const usersChat = []
        usersChat.push(users);

        // console.log(usersChat)
    });

    socket.on('download image screen', function(){

        makeScreenshot()
    })


    function makeScreenshot(){
        (async () => {
              const browser = await puppeteer.launch();
              const page = await browser.newPage();
              await page.goto('http://localhost:1400/');
              await page.evaluate(() => document.querySelector('#canvascontainer').className);
              await page.screenshot({path: 'example.png'});

              await browser.close();
        })();
    }


    // socket.on('delete id from list', function(idUser){
    //     console.log("issss dit de", idUser)

    //     const newArray = usersObj
    //                     .filter(user=>{
    //                         // console.log(user.socketId, socket.id)
    //                         return user.socketId===idUser}
    //                         )
    //     console.log("what is", newArray)

    //     // usersObj.push(usersInRoom)


    // })

    socket.on('disconnect', function(msg) {
        const newArray = usersObj
            .filter(user => {
                // console.log(user.socketId, socket.id)
                return user.socketId !== socket.id
            })
        usersObj = newArray

        // console.log('Usersobj is=',usersObj)
        io.emit('all users', usersObj)

        if (!socket.nickname) {
            // console.log("username is gone")
        } else {
            // console.log("username is there")
            const nicknameList = nicknames.slice(nicknames.indexOf(socket.nickname), 1)
            // console.log("listnames " + nicknameList)
            // console.log(nicknames)
            // console.log("logout " + socket.nickname)

            // console.log(nicknames)
            var index = nicknames.indexOf(socket.nickname);
            if (index > -1) {
                nicknames.splice(socket.nickname, 1);
            }
            // array = [2, 9]
            console.log(nicknames);

            io.emit('user disconnected', {
                nick: socket.nickname
            })
            io.emit('usernames', nicknames)
        }

    })

});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/view/pages/index.html');
});