import OpenAi from 'openai';

const openai = new OpenAi({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const MAX_TOKENS = 1000;

export function sendPrompt(prompt: string, max_tokens: number = MAX_TOKENS) {
  return openai.chat.completions
    .create({
      model: 'gpt-3.5-turbo-0613',
      max_tokens: Math.min(max_tokens, MAX_TOKENS),
      messages: [
        {
          role: 'system',
          content:
            'answer only in markdown format, include no commentary, use rich text headers and text different text styles, break lines often',
        },
        {
          role: 'system',
          content:
            'RULES: follow copywriting and SEO principles and avoid plagiarism',
        },
        {
          role: 'system',
          content:
            // 'WRITING STYLE: Use casual, friendly language. Allow imperfect grammar and informal tone, as in natural speech. Inject personal perspective with "you/we" words to draw the reader in. Evoke emotion and subjectivity through vivid phrases. End with a short, punchy call to action. Overall aim for the authentic imperfection, emotion and conversational expressiveness that characterizes genuine humanity.',
            'WRITING STYLE: When crafting your response, adopt an informal, conversational tone resembling how a real person would describe this tool to a Use simple, punchy vocabulary not complex terms - imagine explaining this to someone casually rather than formally. Structure your thoughts into short, lively sentences with imperfect grammar and disjointed phrasing, avoiding robotic perfection. Inject perspective using words like "you", "we", "our" and "your" to make it feel first-hand, drawing the reader into the experience. Use emotional words and phrases that evoke feelings, reactions and images in the reader\'s mind rather than sterile objectivity. End with a succinct yet urgent call-to-action for the reader meant to compel and energize them. Overall create expressiveness, subjectivity and authentic humanity through your word choices, phrasing, pacing, perspective and use of emotion. Strive to emulate how a real person might passionately but informally share excitement over this tool and its possibilities in conversation with a friend.',
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
