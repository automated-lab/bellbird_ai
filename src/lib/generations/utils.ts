import Handlebars from 'handlebars';

export const renderPromptWithVariables = (
  templatePrompt: string,
  values: Record<string, string | string[]>,
) => {
  const template = Handlebars.compile(templatePrompt);

  console.log(values, template, template(values));

  return template(values);
};
