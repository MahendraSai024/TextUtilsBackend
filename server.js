const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const path = require('path')
const bodyParser = require("body-parser");
dotenv.config();

const app = express();
app.use(bodyParser.json());

/*
app.use('/static', express.static(path.join(__dirname, 'build')))
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '/build', '/index.html'));
});
*/

const port = process.env.PORT || 3000;

app.use(cors());

const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
  apiKey: process.env.apiKey,
});
const openai = new OpenAIApi(config);


// set up the ChatGPT endpoint
app.post("/api/data", async (req, res) => {
  // get the prompt from the request
  const { prompt } = req.body;
  console.log("Chatgpt API: ", prompt);
  try {
    if (prompt === null) {
      throw new Error("Uh oh, no Prompt was provided");
    }
    // trigger OpenAi completion
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
    });
    const completion = response.data.choices[0].text;
    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (error) {
    console.log(error);

    res.status(204).json({
      success: false,
      message: "Internal Error >.<",
    });

    // res.send("Internal Error >.<");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
