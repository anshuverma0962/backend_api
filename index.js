const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());           // Frontend se request allow karega
app.use(express.json());   // JSON data handle karne ke liye

// NPI Proxy Route
app.get('/api/npi', async (req, res) => {
    const number = req.query.number;

    if (!number || number.length !== 10) {
        return res.status(400).json({ 
            error: "Please provide a valid 10-digit NPI number" 
        });
    }

    try {
        const response = await fetch(
            `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${number}`
        );

        if (!response.ok) {
            throw new Error('NPI API failed');
        }

        const data = await response.json();
        res.json(data);   // Frontend ko data forward kar rahe hain

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Failed to fetch NPI data from registry" 
        });
    }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
});