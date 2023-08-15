import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL_TOP = "https://api.jikan.moe/v4/top/anime?type=tv&filter=airing";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    /* res.render("index.ejs"); */
    try{
        const result = await axios.get(API_URL_TOP);
        console.log(result.data.data[0]); //! WTF IS THIS
        //console.log(result.pegination.last_visible_page);
        res.render("index.ejs");
    } catch (error){
        res.render("index.ejs");/*  */
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});