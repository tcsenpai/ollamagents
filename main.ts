import { OllamaAPI } from './ollamapi';
import dotenv from 'dotenv';
import readline from 'readline';
import * as term from 'terminal-kit';

dotenv.config();

const ollama_url = process.env.OLLAMA_URL as string;
const systemPrompt = `You are a Linux command interpreter. Your task is to convert natural language queries or commands into appropriate Linux commands. Always respond with a valid JSON object containing the following keys:
1. 'command': The Linux command to execute (string). Double check the command to ensure it's correct and works.
2. 'explanation': A brief explanation of what the command does (string).
3. 'caution': Any warnings or cautions about using the command, if applicable (string or null).

Only provide existing and working Linux commands. If you cannot interpret the input or if it's not applicable to Linux, return a JSON object with an 'error' key explaining the issue. Do not include any text outside of the JSON structure in your response.

The produced JSON should be valid JSON that can be parsed by JSON.parse() in JavaScript, so it cannot contain \` or headers like \`\`\`json.`;
const ollama = new OllamaAPI(ollama_url, 'llama3.1', systemPrompt);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  term.terminal.bold.cyan('Welcome to the Linux Command Assistant. Type \'exit\' to quit.\n\n');

  while (true) {
    term.terminal.green('Enter your command or question: \n');
    const input = await new Promise<string>(resolve => rl.question('', resolve));
    term.terminal('\n');

    if (input.toLowerCase() === 'exit') {
      term.terminal.yellow('Goodbye!\n');
      rl.close();
      process.exit(0);
    }


    const response = await ollama.chat(input);
    try {
      const parsedResponse = JSON.parse(response);

      if (parsedResponse.error) {
        term.terminal.red('Error: ').white(parsedResponse.error + '\n');
      } else {
        term.terminal.bold.blue('Command: ').white(parsedResponse.command + '\n');
        term.terminal.bold.magenta('Explanation: ').white(parsedResponse.explanation + '\n');
        if (parsedResponse.caution) {
          term.terminal.bold.yellow('Caution: ').white(parsedResponse.caution + '\n');
        }
      }
    } catch (error) {
      term.terminal.red('An error occurred: ').white((error as Error).message + '\n');
      term.terminal.red('Response: ').white(response + '\n');
    }

    term.terminal('\n'); // Add a blank line for readability
  }
}

main();