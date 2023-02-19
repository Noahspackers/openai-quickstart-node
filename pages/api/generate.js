import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const item = req.body.item || '';
  if (item.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Item",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(item),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(item) {
  const capitalizedItem =
    item[0].toUpperCase() + item.slice(1).toLowerCase();
  return `Suggest three Items for your outfit.

Item: Hemd
Names: Blau kariertes Hemd, weißes Hemd, rotes Hemd
Item: Jacke
Names: Bomberjacke, Mantel, Winterjacke
Item: ${capitalizedItem}
Names:`;
}
