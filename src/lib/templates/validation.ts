import { z } from 'zod';

export const getTemplateSchema = () => {
  return z.object({
    title: z.string().min(1),
    description: z.string().min(50).max(150),
    image: z.string().url(),
    category: z.string().min(1),
    // tags: z.array(z.string()),
    isNew: z.boolean().default(true),
    prompt: z.string().min(20),
    fields: z.array(z.number()),
  });
};