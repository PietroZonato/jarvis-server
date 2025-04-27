const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/jarvis', async (req, res) => {
  const intentName = req.body.request?.intent?.name;

  if (intentName === 'ConversazioneIntent') {
    const userMessage = req.body.request.intent.slots.messaggio.value;

    try {
      const aiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }]
      }, {
        headers: {
          'Authorization': `Bearer LA_TUA_API_KEY`, // <-- inserisci la tua API key qui
          'Content-Type': 'application/json'
        }
      });

      const aiReply = aiResponse.data.choices[0].message.content;

      res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: aiReply
          },
          shouldEndSession: false
        }
      });

    } catch (error) {
      console.error(error.message);
      res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Mi dispiace, non riesco a rispondere ora."
          },
          shouldEndSession: false
        }
      });
    }
  } else {
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Ciao, sono JARVIS. Di cosa vuoi parlare?"
        },
        shouldEndSession: false
      }
    });
  }
});

app.get('/', (req, res) => {
  res.send('JARVIS server online.');
});

app.listen(port, () => {
  console.log(`Server JARVIS avviato sulla porta ${port}`);
});
