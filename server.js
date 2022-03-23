const express = require('express');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const app = express();
app.use(express.json());

const API_KEY = process.env.WHEREBY_API_KEY;

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

app.get('/', (req, res) => {
  res.send('Server working 🔥');
});

app.post('/create-meeting', async (req, res) => {
  const meeting_duration_in_hr = req.body.duration || 1;
  try {
    const response = await fetch('https://api.whereby.dev/v1/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endDate: new Date().addHours(meeting_duration_in_hr),
        fields: ['hostRoomUrl'],
      }),
    });
    const responseData = await response.json();
    // console.log('Room URL:', responseData.roomUrl);
    // console.log('Host room URL:', responseData.hostRoomUrl);
    return res.status(200).json({ meeting_data: responseData });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => `Server running on port port 🔥`);
