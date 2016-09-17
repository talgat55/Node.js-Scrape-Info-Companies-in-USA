import async from "async";
import request from "request";
import __ from "underscore";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";
//import arraycites from "./config/cities.json";
import arraycites from "./config/cities2.json";
import config from "./config/config.json";
import js2xmlparser from "js2xmlparser";
let cuudir = path.parse(__dirname);
import parser from 'xml2json';


let arrayquery = [
    /* "Doctors",
     "Medical Clinics",
     "Psychologists",
     "Dentists",
     "Chiropractors",
     "Nursing Homes",
     "Pharmacies",*/
    "Attorneys"
];



let extractEmails = text => {

    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

// array cities
async.each(arraycites, function(itemsity, callback) {
    // console.log(itemsity.city);
    let splitcity = itemsity.city;
    let namecity = splitcity.split(',');
    //console.log(namecity[0]);
    // array query 
    async.each(arrayquery, function(itemquery, callback) {

        let keyword = namecity[0] + " " + itemquery;
        //   console.log(keyword)



        request("https://yandex.com/search/xml?l10n=en&user=searchworld55&key=03.418207106:4fe989710022395f5d03a505194f2f73&query=" + keyword, function(error, response, body) {
                var json = parser.toJson(body);
                let objectjson = JSON.parse(json);
                let linkeach = objectjson.yandexsearch.response.results.grouping.group[0].doc.url;
                //console.log(objectjson.yandexsearch.response.results.grouping.group[0].doc.url)
                // console.log(typeof linkeach);

                //console.log(item);
                request(linkeach, function(error, response, body) {
                    if (!error && response.statusCode == 200) {

                        let $ = cheerio.load(body);
                        let titlesite = $("title").text();

                        // console.log(titlesite);


                        // find emails 
                        let arrayemails = __.values(extractEmails(body));

                        let uniqemails = __.uniq(arrayemails);
                        //console.log(uniqemails);
                        let data = {
                            "title": titlesite,
                            "url": linkeach,
                            "uremails": [
                                uniqemails
                            ],
                            "search": keyword

                        };

                        fs.writeFileSync("output.json", data)

                    }
                })




            }) // end request


    }, function(err) {
        // if any of the file processing produced an error, err would equal that error
        if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('A file failed to process');
        } else {
            console.log(' QUERY All files have been processed successfully');
        }
    });


}, function(err) {
    // if any of the file processing produced an error, err would equal that error
    if (err) {
        // One of the iterations produced an error.
        // All processing will now stop.
        console.log('A file failed to process');
    } else {
        console.log('ARRAYCITY All files have been processed successfully');
    }
});
console.log(redydata);
//let xmlobject = js2xmlparser("root", data);