const express=require('express')
const app=express()
const multer=require('multer')
const QRCode=require('qrcode');
const vCardParser=require('vcard-parser');
const mongoose=require('mongoose')
const path=require('path')
const User=require('./models/userModel')
const dotenv=require('dotenv')
dotenv.config();
const upload=multer();
const mongooseString = 'mongodb+srv://atulreny911:7swjI6MT6QFuIDPO@bedazzlers.h7f5t.mongodb.net/?retryWrites=true&w=majority&appName=bedazzlers'

const downloadAll=require('./routes/downloadZip')
app.use(downloadAll)

mongoose.connect(mongooseString).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const csvFile='./test.csv'

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')))
// Set the views directory (optional, default is "views")
app.set('views', path.join(__dirname, 'views'));

app.get('/',async(req,res)=>{
    try{
        const Users=await User.find();
        const qrCodes=[];

        for(const user of Users)
        {
            const vcard=createVCard(user.firstName,
                user.lastName,
                user.org,
                user.title,
                user.cellno,
                user.email,
                user.website,
                user.address,
                user.city,
                user.state,
                user.pinCode,
                user.country);
            // console.log(vcard);
            
            try {
                const qrCodeDataUrl = await QRCode.toDataURL(vcard);
                qrCodes.push({ name: user.firstName + " " + user.lastName, org: user.org, qrCode: qrCodeDataUrl });
                // console.log(qrCodeDataUrl);
                
            } catch (error) {
                console.error("Error generating QR code:", error);
            }
            
        }
        res.render('index.ejs',{qrCodes});
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
})
app.get('/dev',(req,res)=>{
    res.render('index.ejs')
})





app.listen(process.env.port,'0.0.0.0',()=>{
    console.log("Sever is now listening on port "+process.env.port);
    
})



function createVCard(firstName,lastName,org,title,cellno,email,website,address,city,state,pinCode,country) {
    return`BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName}
FN:${firstName} ${lastName}
ORG:${org || 'N/A'}
TITLE:${title || 'N/A'}
TEL;TYPE=CELL:${cellno}
EMAIL:${email}
URL:${website || ''}
ADR;TYPE=WORK:;;${address};${city};${state};${pinCode};${country}
END:VCARD`;
}

