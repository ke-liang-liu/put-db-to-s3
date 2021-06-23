#!/usr/bin/env node
const yargs = require("yargs");
var mysql = require('mysql');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require('fs');
// need to create empty data.csv first. Path to and name of object. For example '../myFiles/index.js'.
const file = "data.csv";
const fileStream = fs.createReadStream(file);

var AWS = require("aws-sdk");
var s3 = new AWS.S3();

const options = yargs
 .usage("Usage: -n <name>")
 .option("u", { alias: "time", describe: "Universal start time", type: "string", demandOption: true })
 .option("t", { alias: "table", describe: "Table name", type: "string", demandOption: true })
 .argv;

console.log(`Table is: ${options.table}`);
console.log(`Universal start time is: ${options.time}`);

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
  const sql = `SELECT base_grand_total, entity_id, base_shipping_amount,created_at FROM ${options.table} where created_at > "${options.time}"`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    output2Csv(result);
  });
});

// output to csv file and upload to s3
const output2Csv = (result) => {
	let finalArr = result;
    
    // header for csv file
    let object = result[0];
    let header = [];
    for (let property in object) {
        header.push({ id: `${property}`, title: `${property}` });
    }

    const csvWriter = createCsvWriter({
        path: file,
        header: header,
    });
    csvWriter
        .writeRecords(finalArr)
        .then(() => {
          console.log(finalArr.length + " records were written to file successfully.")
          // upload to S3
          var params = {Bucket: 'dev1-exported-logs', Key: `dataKey${options.time}.csv`, Body: fileStream};
          s3.upload(params, function(err, data) {
            console.log(err, data);
          });
        });
};



