// const Unsplash = require('unsplash-js').default;
// const express = require('express');
// const puppeteer = require('puppeteer');
// const fetch = require('node-fetch');
// const app = express()
//     .set('view engine', 'ejs')
//     .set('views', 'view')
//     .use(express.static('./src/css'))
//     .use(express.static('./src/js'))
//     .use(express.static('./src/images'))
//     .get('/', index)

// const port = 1400;
 
// const unsplash = new Unsplash({
//   applicationId: "1d8b68a16a721465840ebcc7850e052ce3876955e6f9151980ad1481a0fc56f7",
//   secret: "27375a0d54efcff0f8b7cbcfe185721c646fafba004ae692c4f55ab27e78d746"
// });

// const authenticationUrl = unsplash.auth.getAuthenticationUrl([
//   "public",
//   "read_user",
//   "write_user",
//   "read_photos",
//   "write_photos"
// ]);


// const client_id ="1d8b68a16a721465840ebcc7850e052ce3876955e6f9151980ad1481a0fc56f7"
// const query = 'woods';

// function makeCall(){

//   fetch(`https://api.unsplash.com/search/photos?client_id=${client_id}&query=${query}`,{method:'get'}).
// 		then(res=>res.json())
// 		.then(res=>console.log("boommer",res))
// 		.catch(res=>console.log("error",res))

// 		}
// makeCall();


// function index(req, res, data) {
// 	location.assign(authenticationUrl);
//     res.render('./pages/index')
// }


function getImage(url){

    fetch("https://tumbler-of-cats.tumblr.com/image/184278406533")
  .then(response => response.text())
  .then(text => {
    const parser = new DomParser();
    const htmlDocument = parser.parseFromString(text, "text/html");
    // document.querySelector("div").appendChild(section);

    // console.log(htmlDocument)
    // console.log(section)
  })
    // fetch('https://tumbler-of-cats.tumblr.com/image/184278406533')
    // .then(function(response) {
    //     // When the page is loaded convert it to text
    //     return response.text()
    // })
    // .then(function(html) {
    //     // Initialize the DOM parser
    //     const parser = new DomParser();

    //     const htmlDocument = parser.parseFromString(html, "text/html");
    //     const section = htmlDocument.documentElement.querySelector("section");
    //     // document.querySelector("div").appendChild(section);
    //     console.log(htmlDocument);
    //     console.log(section);
    // })
    // .catch(function(err) {  
    //     console.log('Failed to fetch page: ', err);  
    // });

// async function getImage(url){
//     const browser = await puppeteer.launch({devtools: true});
//     const page = await browser.newPage();
//     await page.goto('https://tumbler-of-cats.tumblr.com/image/184278406533');

//     await page.click('.yes')
//     await page.waitForNavigation({ waitUntil: 'networkidle0' })
//     await page.waitFor(3000)
//     const image = await page.evaluate(()=>{return document.querySelector('body')})
//     console.log(image)
//     // try {
//     //     // const shizzle = await page.evaluate((test) => {
//     //     //     console.log(test);
//     //     //     const image = document.querySelector('body');
//     //     //     console.log(image)
//     //     //     return image
//     //     // })
//     //     // console.log(shizzle)
//     //     const data = await fetch('http://cutecornflakes.tumblr.com/image/184269993801');
//     //     console.log(JSON.parse(data));
//     // } catch (err) {
//     //     err
//     // }

//  // await browser.close();

}
// getImage()


// app.listen(1400, () => console.log(`Example app listening on port ${port}!`))