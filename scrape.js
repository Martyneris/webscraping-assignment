const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const stringify = require('csv-stringify');

// creating arrays for later variable storage
let htmls = []; 
let urls = [];
let mergedFlights = [];

// looping urls for every day of October, each with incremented day put into the url
for (let i = 1; i <= 31; i++) {
    urls.push(`https://www.norwegian.com/uk/ipc/availability/avaday?A_City=RIX&AdultCount=1&ChildCount=0&CurrencyCode=GBP&D_City=OSLALL&D_Day=${i}&D_Month=201810&D_SelectedDay=${i}&IncludeTransit=true&InfantCount=0&R_Day=11&R_Month=201809&TripType=1&mode=ab`)
};

// creating a function that will loop over all urls
async function loopRequests() {
    for (let x = 0; x < urls.length; x++) {
        let current = urls[x];
        await GetHtmls(current);
        console.log(`this is the ${x+1} page load`)
    }
};

// creating a callback function that will take in an url as an argument, extract html from it and put it into an array for later use
async function GetHtmls(current) {

    request(current, await function (error, response, html) {
        if (!error && response.statusCode == 200) {
            htmls.push(html)
        }
    })
};

// run loop function
loopRequests();


// setTimeout is used to make sure that all of the data is received and ready for proceeding
setTimeout(() => {
    for (let y = 0; y < htmls.length; y++) {

        let $ = cheerio.load(htmls[y]);

        // empty arrays declared for later storage
        let flightsArr1 = [];
        let flightsArr2 = [];

        // each flight's information is contained in two parent elements - .rowinfo1 and .rowinfo2, so its neccessary to extract data separately
        // and later combine it into one object which will represent a single flight.
        $('.rowinfo1').each((i, el) => {

            // temporary empty object for data storage
            let flightjson1 = {};

            // extracting required info according to their CSS selectors
            const deptime = $(el)
                .find('.depdest')
                .text();

            const arrtime = $(el)
                .find('.arrdest')
                .text();

            const duration = $(el)
                .find('.duration')
                .text();

            const lowestprice = $(el)
                .find('.standardlowfare')
                .text();

            const depDay = 'October ' + (y + 1)

            flightjson1.deptime = 'departing at ' + deptime;
            flightjson1.arrtime = 'arriving at ' + arrtime;
            flightjson1.duration = duration;
            flightjson1.lowestprice = 'flight price is ' + lowestprice + ' EUR';
            flightjson1.depDay = depDay;

            // push half of an object into a container array
            flightsArr1.push(flightjson1)

        });

        $('.rowinfo2').each((i, el) => {

            // temporary empty object for data storage
            let flightjson2 = {};

            // extracting required info according to their CSS selectors
            const depAirport = $(el)
                .find('.depdest')
                .text();

            const arrAirport = $(el)
                .find('.arrdest')
                .text();

            flightjson2.depAirport = depAirport;
            flightjson2.arrAirport = arrAirport;

            // push another half of an object into a container array
            flightsArr2.push(flightjson2)

        });

        // looping over the length of received data array and pairing the flights halves with their relevant ones to make a full direct flight object
        for (let i = 0; i < flightsArr1.length; i++) {
            let merged = { ...flightsArr1[i], ...flightsArr2[i] }
            if (merged.duration === 'Direct') { // checking if the flight is direct
                mergedFlights.push(merged) // pushing every direct flight into an array for later usage
                console.log('direct flight pushed to array')
            }
        };
    }

}, 25000);

// printing all direct flights array to a .csv file after a timeout, to make sure that all data is processed 
setTimeout(() => {
    stringify(mergedFlights, (err, output) => {
        if (err) throw err;
        fs.writeFile('directFlights.csv', output, (err) => {
            if (err) throw err;
            console.log('directFlights.csv saved.');
        });
    });
}, 30000);


