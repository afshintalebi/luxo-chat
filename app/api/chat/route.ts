import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText,  } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    // Validate that messages exist
    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400 });
    }

    // Call the OpenAI API using the Vercel AI SDK
    // By default, this uses the OPENAI_API_KEY environment variable from .env.local
    const result = streamText({
      // We use 'gpt-4o' because it's the fastest and supports multi-modal (images/vision)
      model: openai('gpt-4o'),
      
      // Pass the entire conversation history to maintain context (Memory)
      messages: await convertToModelMessages(messages),

      // Optional: Add a system message to define the AI's persona
      system: `You are Luxo, a highly intelligent, elegant, and helpful AI assistant. 
      You communicate clearly and concisely. 
      You support both English and Persian (Farsi) languages fluently.
      If the user speaks Persian, reply in Persian. If English, reply in English.
      Format your responses using Markdown when providing code snippets, lists, or tables.`,
      
      // Optional: Set the temperature for creativity (0.0 = strict, 1.0 = highly creative)
      temperature: 0.7,
    });

    // Respond with the stream
    return result.toUIMessageStreamResponse();

  } catch (error) {
    // Log the error securely on the server
    console.error('Error in OpenAI API Route:', error);
    
    // Return a generic error to the client to avoid leaking sensitive info
    return new Response('An error occurred while processing your request.', { 
      status: 500 
    });
  }
}