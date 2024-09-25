const express=require('express')
const app=express()
const multer=require('multer')
const QRCode=require('qrcode');
const vCardParser=require('vcard-parser');
const mongoose=require('mongoose')
const path=require('path')
const User=require('./models/userModel')

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
            const vcard=createVCard(user);
            const qrCodeDataUrl= await QRCode.toDataURL(vcard);
            qrCodes.push({ name: user.name,org:user.org, qrCode: qrCodeDataUrl });
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





app.listen(3000,()=>{
    console.log("Sever is now listening on port 3000");
    
})



function createVCard({ name, email, cellno, workno, address, website, title, org }) {
    return `BEGIN:VCARD
VERSION:3.0
FN:${name}
EMAIL:${email}
TEL;TYPE=CELL:${cellno}
TEL;TYPE=WORK:${workno}
ADR:${address}
URL:${website}
TITLE:${title}
ORG:${org}
END:VCARD`;
}