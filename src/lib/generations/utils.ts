export const renderPromptWithVariables = (
  templatePrompt: string,
  values: Record<string, string | string[]>,
) => {
  let prompt = templatePrompt;

  Object.entries(values).forEach(([key, value]) => {
    console.log(key, value);
    prompt = templatePrompt.replaceAll(
      `{{${key}}}`,
      Array.isArray(value) ? value.join(', ') : value,
    );
  });

  console.log(prompt, values);

  return prompt;
};
