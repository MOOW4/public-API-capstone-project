import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { getCurrentSeason } from "./utils/currentSeason.js";


const app = express();
const port = 3000;
const API_URL_TOP = "https://api.jikan.moe/v4/top/anime?type=tv&filter=airing";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    /* res.render("index.ejs"); */
    try{
        const result = await axios.get(API_URL_TOP);
        const animeData = result.data.data; //? first .data comes from axios, the other comes from JSON structure
        console.log(animeData[0]);
		//console.log(getCurrentSeason());
        res.render("index.ejs", {season: getCurrentSeason()});
    } catch (error){
        if (error.response) {
            //* The error has a response property, so we can access the data
            res.render("index.ejs", { error: JSON.stringify(error.response.data) });
        } else {
            //! The error does not have a response property (e.g., network error)
            res.render("index.ejs", { error: JSON.stringify(error.message) });
        }
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});