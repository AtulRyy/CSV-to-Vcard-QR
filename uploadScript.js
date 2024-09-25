const express = require('express')
const app = express()
const multer = require('multer')
const QRCode = require('qrcode');
const vCardParser = require('vcard-parser');
const mongoose = require('mongoose')
const fs = require('fs')
const csv = require('csv-parser')

const upload = multer();
const csvFile = './BNI.csv'

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
            firstName: data['firstName'.trim()],
            lastName: data['lastName'.trim()],
            email: data['email'.trim()],
            cellno: data['cellno'.trim()],
            address: data['address'.trim()],
            website: data['website'.trim()],
            title: data['title'.trim()],
            org: data['org'.trim()],
            city: data['city'.trim()],
            state: data['state'.trim()],
            country: data['country'.trim()],
            pinCode: data['pinCode'.trim()]
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