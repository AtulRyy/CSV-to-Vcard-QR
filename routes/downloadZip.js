const express = require('express');
const JSZip = require('jszip');
const QRCode = require('qrcode');
const router = express.Router();
const User = require('../models/userModel'); // Make sure this path points to your user model

// Function to create vCard (you should replace this with your actual function)
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


// Route to generate the ZIP file with all QR codes
router.get('/download-all-qr', async (req, res) => {
    try {
        const users = await User.find(); // Fetch users from MongoDB
        const zip = new JSZip();

        // Loop through each user to generate vCard and QR code
        for (const user of users) {
            const vCard = createVCard(user.firstName,
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
                user.country); // Generate vCard
            const qrCodeDataUrl = await QRCode.toDataURL(vCard); // Generate QR code
            const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");

            // Add the QR code as a file to the ZIP (convert base64 to binary)
            zip.file(`${user.firstName+"_"+user.lastName}_QRCode.png`, base64Data, { base64: true });
        }

        // Generate the ZIP file
        const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

        // Set headers and send the ZIP file to the client
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="all_qr_codes.zip"'
        });

        res.send(zipContent);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
