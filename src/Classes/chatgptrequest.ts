

import Phaser from 'phaser';
import axios, { AxiosError } from 'axios';
import chatGPTKey from '../secrets/secretkeys';

import { OpenAIApi, Configuration, ChatCompletionResponseMessageRoleEnum } from "openai";


const prefixPrompt = "Translate my message into a new list from the list of options below, it can be any length. Here is the list: [walk_forward, walk_back, jump_forward, kick, punch, uppercut, crhook, roundhouse, random]. Here is my message: "
const suffixPrompt = ". If you cannot translate it then just pick the random option";

const configuration = new Configuration({
    apiKey: chatGPTKey,
  });

  
const openai = new OpenAIApi(configuration);
const conversationContext: string[][] = [];
const currentMessages = [];


export const generateResponse = async (prompt: string) => {
    try {
      const modelId = "gpt-3.5-turbo";
      const promptText = `${prefixPrompt + prompt + suffixPrompt}\n\nResponse:`;
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





