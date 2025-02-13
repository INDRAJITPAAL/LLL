const Groq = require('groq-sdk');
const express = require('express');
const path = require('path');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const groq = new Groq({
  apiKey: process.env.GROQ_KEY
});


app.get('/', async (req, res) => {
  res.render("AI.respond.ejs", { data: null });
});


app.post('/send', async (req, res) => {
  const userInput = req.body.userInput;
  console.log(userInput);
  try {

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: userInput, // Use the user's input
        },
      ],
      model: 'llama-3.3-70b-versatile', // Specify the model
    });

    // Extract the response content
    const response = chatCompletion.choices[0]?.message?.content || 'No response from the API';
    res.render('AI.respond.ejs', { data: response });
  } catch (error) {
    console.error('Error fetching data from Groq API:', error);
    res.render('AI.respond.ejs', { data: 'Error fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





