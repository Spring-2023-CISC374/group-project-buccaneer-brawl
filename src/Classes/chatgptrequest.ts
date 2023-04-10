

import Phaser from 'phaser';
import axios, { AxiosError } from 'axios';

import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
    apiKey: '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',
  });

  
const openai = new OpenAIApi(configuration);
const conversationContext = [];
const currentMessages = [];


export const generateResponse = async (prompt: string) => {
    try {
      const modelId = "gpt-3.5-turbo";
      const promptText = `${prompt}\n\nResponse:`;
      const currentMessages = [];
  
      // Restore the previous context
      for (const [inputText, responseText] of conversationContext) {
        currentMessages.push({ role: "user", content: inputText });
        currentMessages.push({ role: "assistant", content: responseText });
      }
  
      // Stores the new message
      currentMessages.push({ role: "user", content: promptText });
  
      const result = await openai.createChatCompletion({
        model: modelId,
        messages: currentMessages,
      });
  
      const responseText = result.data.choices.shift().message.content;
      conversationContext.push([promptText, responseText]);
  
      return responseText;
    } catch (err) {
      console.error(err);
      throw new Error("Internal server error");
    }
  };





