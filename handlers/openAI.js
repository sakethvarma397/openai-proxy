import OpenAI from "openai";
import { defaultPrompt } from "../prompts/presentation.js";
import dotenv from "dotenv";
import { Buffer } from "buffer";
import axios from "axios";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export const getSummary = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).send({ data: {} });
      return;
    }

    const data = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Prompt: ${prompt}\n ${defaultPrompt}` },
      ],
    });
    const summary = data.choices[0].message.content;
    res.status(200).send({ data: summary });
  } catch (e) {
    res.status(400).send({ data: e });
  }
};

export const getSummaryWithImages = async (req, res) => {
  try {
    const { summary } = req.body;

    if (!summary.slides) {
      res.status(400).send({ data: summary });
      return;
    }

    const slidesWithURLs = await Promise.all(
      summary.slides.map(async (slide) => {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: slide.title,
          n: 1,
          size: "1024x1024",
        });
        return { ...slide, url: response.data[0].url };
      })
    );

    const slidesWithImages = await Promise.all(
      slidesWithURLs.map(async (slide) => {
        const response = await axios.get(slide.url, {
          responseType: "arraybuffer",
        });
        const imageBuffer = Buffer.from(response.data, "binary");
        const base64Image = imageBuffer.toString("base64");
        const image = `data:${response.headers["content-type"]};base64,${base64Image}`;
        return { ...slide, url: image };
      })
    );

    res.status(200).send({ data: { ...summary, slides: slidesWithImages } });
  } catch (e) {
    res.status(400).send({ data: e });
  }
};
