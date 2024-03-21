import OpenAi from 'openai';

const openai = new OpenAi({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const MAX_TOKENS = 1000;

export function sendPrompt(prompt: string, max_tokens: number = MAX_TOKENS) {
  return openai.chat.completions
    .create({
      model: process.env.OPEN_AI_MODEL ?? 'gpt-3.5-turbo-0125',
      max_tokens: Math.min(max_tokens, MAX_TOKENS),
      messages: [
        {
          role: 'system',
          content:
            'answer only in markdown format, include no commentary, use rich text headers and text different text styles, break lines often',
        },
        {
          content: prompt,
          role: 'user',
        },
      ],
    })
    .then((res) => ({
      data: res,
      error: null,
    }))
    .catch((error) => ({
      data: null,
      error: error,
    }));
}
