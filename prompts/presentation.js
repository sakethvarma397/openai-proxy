// This will be prepended to every prompt sent to the chatgpt API.
// Based on the requirements we can add more prompts, or create dynamic prompts, or load context/prompts from files
export const defaultPrompt =
  "Based on the above presentation prompt, generate content as JSON for the slides." +
  "Give a title for presentation, and objects with 'title' and 'content' for each slide." +
  "The content of the slide should be multiple lines as an array, and the title should be based on the content." +
  "Generate a minimum of three slides. Otherwise generate the number of slides given in the prompt";
