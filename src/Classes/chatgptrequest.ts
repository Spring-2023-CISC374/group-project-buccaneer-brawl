

import Phaser from 'phaser';
import axios, { AxiosError } from 'axios';
import chatGPTKey from '../secrets/secretkeys';

import { OpenAIApi, Configuration, ChatCompletionResponseMessageRoleEnum } from "openai";

const configuration = new Configuration({
    apiKey: chatGPTKey,
  });

  
const openai = new OpenAIApi(configuration);
const conversationContext: string[][] = [];
const currentMessages = [];


export const generateResponse = async (prompt: string) => {
    try {
      const modelId = "gpt-3.5-turbo";
      const promptText = `${prompt}\n\nResponse:`;
      const currentMessages = [];
  
      // Restore the previous context
      for (const [inputText, responseText] of conversationContext) {
        currentMessages.push({ role: ChatCompletionResponseMessageRoleEnum.User, content: inputText });
        currentMessages.push({ role: ChatCompletionResponseMessageRoleEnum.Assistant, content: responseText });
      }
  
      // Stores the new message
      currentMessages.push({ role: ChatCompletionResponseMessageRoleEnum.User, content: promptText });
  
      const result = await openai.createChatCompletion({
        model: modelId,
        messages: currentMessages,
      });
  
      const responseText = result.data.choices.shift()?.message?.content;

      if(responseText !== undefined) {
        conversationContext.push([promptText, responseText]);
      }

  
      return responseText;
    } catch (err) {
      console.error(err);
      throw new Error("Internal server error");
    }
  };





