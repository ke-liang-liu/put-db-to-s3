#!/usr/bin/env node

const yargs = require("yargs");
var mysql = require('mysql');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const options = yargs
 .usage("Usage: -n <name>")
 .option("n", { alias: "name", describe: "Your name", type: "string", demandOption: true })
 .option("s", { alias: "search", describe: "Search term", type: "string" })
 .argv;

const greeting = `Hello, ${options.name}!`;
console.log(greeting);

if (options.search) {
 console.log(`Searching for jokes about ${options.search}...`)
} else {
 console.log("Here's a random joke for you:");
}

// mysql
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "13.239.35.250",
  user: "remote",
  password: "remote-admin",
  database: "tde_shop_2021_04_15_2"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT base_grand_total, entity_id, base_shipping_amount FROM sales_order", function (err, result, fields) {
    if (err) throw err;
    output2Csv(result);
  });
});

// output to csv file function;
const output2Csv = (result) => {
	let finalArr = result;
    
    // header for csv file
    let object = result[0];
    let header = [];
    for (let property in object) {
        header.push({ id: `${property}`, title: `${property}` });
    }

    const csvWriter = createCsvWriter({
        path: "data.csv",
        header: header,
    });
    csvWriter
        .writeRecords(finalArr)
        .then(() => console.log(finalArr.length + " records were written to file successfully."));

};

