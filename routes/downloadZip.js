const express = require('express');
const JSZip = require('jszip');
const QRCode = require('qrcode');
const router = express.Router();
const User = require('../models/userModel'); // Make sure this path points to your user model

// Function to create vCard (you should replace this with your actual function)
function createVCard(user) {
    // Example vCard creation logic
    return `
    BEGIN:VCARD
    VERSION:3.0
    N:${user.name}
    TEL;TYPE=WORK,VOICE:${user.workno}
    TEL;TYPE=CELL:${user.cellno}
    EMAIL:${user.email}
    ORG:${user.org}
    TITLE:${user.title}
    END:VCARD
    `;
}

// Route to generate the ZIP file with all QR codes
router.get('/download-all-qr', async (req, res) => {
    try {
        const users = await User.find(); // Fetch users from MongoDB
        const zip = new JSZip();

        // Loop through each user to generate vCard and QR code
        for (const user of users) {
            const vCard = createVCard(user); // Generate vCard
            const qrCodeDataUrl = await QRCode.toDataURL(vCard); // Generate QR code
            const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");

            // Add the QR code as a file to the ZIP (convert base64 to binary)
            zip.file(`${user.name}_QRCode.png`, base64Data, { base64: true });
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
