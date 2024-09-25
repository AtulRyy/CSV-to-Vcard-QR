const express = require('express')
const app = express()
const multer = require('multer')
const QRCode = require('qrcode');
const vCardParser = require('vcard-parser');
const mongoose = require('mongoose')
const fs = require('fs')
const csv = require('csv-parser')

const upload = multer();
const csvFile = './test.csv'

const applicant=require('./models/userModel')

// 7swjI6MT6QFuIDPO
const mongooseString = 'mongodb+srv://atulreny911:7swjI6MT6QFuIDPO@bedazzlers.h7f5t.mongodb.net/?retryWrites=true&w=majority&appName=bedazzlers'


mongoose.connect(mongooseString).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const results = []
fs.createReadStream(csvFile)
    .pipe(csv({mapHeaders: ({ header }) => header.trim()}))  // Parse the CSV file
    .on('data', (data) => {

        // console.log(data);


        // Push the parsed data to results
        results.push({
            name: data['name'],
            email: data['email'],
            cellno: data['cellno'],
            workno: data['workno'],
            address: data['address'],
            website: data['website'],
            title: data['title'],
            org: data['org']
        });


    })
    .on('end', () => {
        console.log(results);


        // Insert parsed data into MongoDB
        applicant.insertMany(results)
            .then(() => {
                console.log('CSV data successfully uploaded to MongoDB');
                // Close the connection after upload
            })
            .catch(err => {
                console.error('Error inserting data into MongoDB:', err);
            });
    });



app.listen(3000, () => {
    console.log("Sever is now listening on port 3000");

})