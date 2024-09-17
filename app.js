const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Add logging to understand if the app is starting
console.log('Starting the server...');

// Use middlewares
app.use(cors());
app.use(bodyParser.json());

// Check if the OpenAI API key is set
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("ERROR: Missing OpenAI API key in environment variables");
    process.exit(1); // Exit the process with status 1 if the API key is missing
}

// API route
app.post('/api', async (req, res) => {
    try {
        const { prompt, selectedValues } = req.body;

        let chatPrompt = `Your job is to read and effectively summarize terms and conditions or terms of use documents that are given to you. Pay special attention to ${selectedValues.join(', ')}. Your answer should be simply worded and on multiple different lines in a bullet point format.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: chatPrompt },
                    { role: "user", content: prompt }
                ],
                max_tokens: 200
            })
        });

        const data = await response.json();

        if (response.ok) {
            res.json(data);
        } else {
            res.status(response.status).json(data);
        }
    } catch (error) {
        console.error('Error in API call:', error);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
});

// Use the PORT provided by Render
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
