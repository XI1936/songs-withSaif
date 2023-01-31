const puppeteer = require("puppeteer");
const express = require("express"); 
const app = express();

//body Parser
app.use(express.json());

const { SONGS, SONGS_URL } = require("./constants");

const PORT = process.env.PORT || 9001;
app.post("/song", async (req, res) => {
  const ids = req.body.ids;
  const finalData = [];
try{
 for(let id of ids){
    console.log(id);
    const data = await openNewPage(`https://saavn.me/songs?id=${id}`);
    finalData.push(data);
    if(finalData.length==ids.length){
      console.log(finalData);
      res.status(200).send(JSON.stringify(finalData));
    }
  };
  }
  catch{
    res.status(500).send("Some error occurred");
  }
});
app.listen(PORT, () => {
  console.log("app listening at PORT", PORT);
});

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

/*******************************************
 ***************get Data for Each song******/

async function openNewPage(url) {
  var browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  await page.goto(url);
  await delay(5000);
  const Songdata = await page.evaluate(() => {
    return JSON.parse(document.querySelectorAll("pre")[0].innerHTML);
  });
  return Songdata;
}
