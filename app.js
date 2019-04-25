const express = require('express');
const fetch = require('node-fetch');
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
    data.user.blogs.forEach(function(blog) {
    });
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

            const photo = data
                .filter(item => item.type === "photo")
                .map(photo => {
                    return {
                        pic: photo.photos.map(picture => {
                            return picture.original_size.url
                        }),
                        tags: photo.tags
                    }
                })
            console.log(photo)    
            return photo
        })
        .catch(function(err) {
            // oops
        });
}

io.on('connection', function(socket) {
    socket.on('hashtag', function(data, callback){
        console.log("tagwoord is " + data)
        const keyWord = data;

    getData(keyWord)
        .then(data => {
            console.log("data?"+data[0].pic)
            io.emit('all users', {data: data[0], datapic: data[0].pic, datatag: data[0].tags});
        })
    });

    socket.on('new user', function(username, callback){
            callback(true);
            socket.nickname = username;
            nicknames.push(socket.nickname);
            console.log(nicknames)
            io.emit('usernames', nicknames);

    });

    socket.on('parsedImg', function(data){
        console.log("coming from check" + data)
        console.log("nickname " + socket.nickname)
        io.emit('all images', {url:data, nick: socket.nickname});
    })

    // socket.on('room', function(room, data) {
    //     console.log("room is joined by", socket.nickname)
    //     socket.join(room);
    // });



  socket.on('chat message', function(msg){
    io.emit('chat message', {msg:msg, nick:socket.nickname})    
  });

    socket.on('chatgroup', function(users){
        const usersChat = []
        usersChat.push(users);

        console.log(usersChat)
    });

  socket.on('disconnect', function(msg) {
      if (!socket.nickname) {
          console.log("username is gone")
      } else {
          console.log("username is there")
          const nicknameList = nicknames.slice(nicknames.indexOf(socket.nickname), 1)
          console.log("listnames " + nicknameList)
          console.log(nicknames)
          console.log("logout " + socket.nickname)

            console.log(nicknames)
            var index = nicknames.indexOf(socket.nickname);
            if (index > -1) {
              nicknames.splice(socket.nickname, 1);
          }
            // array = [2, 9]
            console.log(nicknames);

          io.emit('user disconnected', {nick: socket.nickname })
          io.emit('usernames', nicknames)
      }

  })

});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/view/pages/index.html');
});

// http.listen(1400, () => console.log(`Example app listening on port ${port}!`))
http.listen(process.env.PORT || 1400)