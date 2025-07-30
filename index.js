const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');  

const app = express();
app.use(cors());               // <--- Allow frontend acces
app.use(express.json());

const client = new Client();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp is ready!');
});

client.initialize();

app.post('/send', async (req, res) => {
  const { number, message } = req.body;
  const chatId = number.includes('@c.us') ? number : `${number}@c.us`;

  try {
    await client.sendMessage(chatId, message);
    res.status(200).send('Message sent!');
  } catch (error) {
    console.error('Send error:', error);
    res.status(500).send('Failed to send message');
  }
});

app.listen(3000, () => console.log('API running on port 3000'));
