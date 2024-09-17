const express = require('express'); // loads up the express module
const fetch = require('node-fetch'); // to make HTTP requests
const cors = require('cors'); // to enable CORS
const bodyParser = require('body-parser'); // to parse JSON bodies
const app = express(); // sets instance to app

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

const OPENAI_API_KEY = 'API KEY GOES HERE'; // Replace with your OpenAI API key

app.post('/api', async (req, res) => {
    try {
        const { prompt, selectedValues } = req.body;

        let chatPrompt = 'Your job is to read and effectively summarize terms and conditions or terms of use documents that are given to you. Pay special attention to ' + selectedValues.join(', ') + '. Your answer should be simply worded and on multiple different lines in a bullet point format. ';

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
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
});

app.listen(4000, () => { // sets the server to run on port 4000
    console.log('Server running on port 4000');
});
