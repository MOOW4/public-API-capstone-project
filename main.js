import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { getCurrentSeason } from "./utils/currentSeason.js";


const app = express();
const port = 3000;
let API_URL = "https://api.jikan.moe/v4/top/anime?";
let animeData;
let filter = "";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


function getNames(arr) {
    //! FOR SOME GODFORSAKEN REASON THIS DECLARATION CRASHES THE SITE IF IT'S INITIALIZED TO ""
    //? IT TURNS OUT IT THE "/" ROUT HAS TO BE RUN AS WELL SO animeData IS CREATED AGAIN
    let names_str = ""; 
    arr.forEach((item) => {
        names_str += item.name;
        names_str += ", ";
    });
    names_str =  names_str.slice(0, -2);
    //console.log(names_str); 
    return names_str;
};

app.get("/", async (req, res) => {
    console.log(API_URL);
    try{
        const result = await axios.get(API_URL);
        animeData = result.data.data; //? first .data comes from axios, the other comes from JSON structure
        //console.log(animeData[0]);
		//console.log(getCurrentSeason());
        res.render("index.ejs", {season: getCurrentSeason(),
            animeData: animeData,
            filter: filter
        });
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

app.get("/anime/:mal_id", (req, res) => {
    //console.log(req.params.mal_id);
    animeData.forEach((anime) => {
        if(anime.mal_id == req.params.mal_id){
            let producers_str = getNames(anime.producers);
            let studios_str = getNames(anime.studios);
            let genres_str = getNames(anime.genres);
            let demographics_str = getNames(anime.demographics);
            res.render("info_page.ejs", {season: getCurrentSeason(),
                anime: anime,
                producers: producers_str,
                studios: studios_str,
                genres: genres_str,
                demographics: demographics_str
            });
        }
    });
});

app.post("/submit", (req, res) => {
    API_URL = "https://api.jikan.moe/v4/top/anime?";

    if(req.body.type != ""){
        //let type = `type=${req.body.type}`;
        API_URL += `type=${req.body.type}&`;
    }
    if(req.body.filter != ""){
        //let type = `type=${req.body.filter}`;
        API_URL += `filter=${req.body.filter}&`;
        filter = req.body.filter;
    }
    if(req.body.ageRating != ""){
        //let ageRating = `type=${req.body.ageRating}`;
        API_URL += `rating=${req.body.ageRating}&`;
    }
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});