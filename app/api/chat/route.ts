import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { 
      messages, 
      systemInstruction, 
      model = 'gpt-4o', 
      temperature = 0.7  
    } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400 });
    }

    const defaultSystem = `You are Luxo, a highly intelligent, elegant, and helpful AI assistant. 
    You communicate clearly and concisely. You support both English and Persian fluently.
    Format responses using Markdown.`;

    const result = streamText({
      model: openai(model),
      messages: await convertToModelMessages(messages),
      system: systemInstruction || defaultSystem,
      temperature: Number(temperature),
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error('Error in OpenAI API Route:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}