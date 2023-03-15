require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const { getInformation } = require("./controllers/InformationController");

app.post("/api/", getInformation);


const API_ENDPOINT = 'https://baatighar.com/openai_chatgpt/products/dataset';
const API_KEY = 'wO8oenVz5Qbg9GNqGel2OcBNbbA';

app.get('/data', async (req, res) => {
  try {
    const response = await axios.get(API_ENDPOINT, {
      headers: {
        'X-Authorization': API_KEY
      }
    });
    const data = response.data;
    res.send((data));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting data from API');
  }
});




const port = process.env.PORT || 4500;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});

module.exports = {};
