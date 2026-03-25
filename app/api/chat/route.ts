import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText,  } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400 });
    }

    const result = streamText({
      model: openai('gpt-4o'),
      messages: await convertToModelMessages(messages),
      temperature: 0.7,
      system: `You are Luxo, a highly intelligent, elegant, and helpful AI assistant. 
      You communicate clearly and concisely. 
      You support both English and Persian (Farsi) languages fluently.
      If the user speaks Persian, reply in Persian. If English, reply in English.
      Format your responses using Markdown when providing code snippets, lists, or tables.`,
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error('Error in OpenAI API Route:', error);
    
    return new Response('An error occurred while processing your request.', { 
      status: 500 
    });
  }
}