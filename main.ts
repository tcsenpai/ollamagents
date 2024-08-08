// Import required modules and classes
import { OllamaAPI } from './ollamapi';
import dotenv from 'dotenv';
import readline from 'readline';
import * as term from 'terminal-kit';

// Load environment variables
dotenv.config();

// Initialize OllamaAPI with the URL from environment variables
const ollama_url = process.env.OLLAMA_URL as string;
const ollama = new OllamaAPI(ollama_url, 'llama3.1');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function createSpinner() {
  const spinnerFrames = ['|', '/', '-', '\\'];
  let currentFrame = 0;
  let spinnerInterval: NodeJS.Timeout;

  return {
    start: () => {
      process.stdout.write('Processing your request... ');
      spinnerInterval = setInterval(() => {
        process.stdout.write(`\r${spinnerFrames[currentFrame]} Processing your request...`);
        currentFrame = (currentFrame + 1) % spinnerFrames.length;
      }, 100);
    },
    stop: () => {
      clearInterval(spinnerInterval);
      process.stdout.write('\r\x1b[K');
    }
  };
}

async function main() {
  // Display welcome message
  term.terminal.bold.cyan('Welcome to the Linux Command Assistant. Type \'exit\' to quit.\n\n');

  while (true) {
    // Prompt user for input
    term.terminal.green('Enter your command or question: \n');
    term.terminal.bold("Remember to prefix your command with '!' to execute commands.\n");
    const input = await new Promise<string>(resolve => rl.question('', resolve));

    // Check if user wants to exit
    if (input.toLowerCase() === 'exit') {
      term.terminal.yellow('Goodbye!\n');
      rl.close();
      process.exit(0);
    }

    try {
      // Check if the command should be executed
      const executeCommand = input.startsWith('!');
      const cleanInput = executeCommand ? input.slice(1) : input;
      
      // Create and start the spinner
      const spinner = createSpinner();
      spinner.start();

      // Send request to OllamaAPI
      const response = await ollama.chat(cleanInput, executeCommand);

      // Stop the spinner
      spinner.stop();

      if (response.error) {
        // Display error if any
        term.terminal.red('Error: ').white(response.error + '\n');
      } else {
        // Display commands
        term.terminal.bold.blue('Command(s):\n\n');
        response.commands.forEach((cmd: string) => {
          term.terminal.white(`${cmd}\n`);
        });
        term.terminal('\n');

        // Display explanation
        term.terminal.bold.magenta('Explanation: ').white(response.explanation + '\n');

        // Display caution if any
        if (response.caution) {
          term.terminal.bold.yellow('Caution: ').white(response.caution + '\n');
        }

        // Display execution output or error if command was executed
        if (executeCommand) {
          if (response.execution_results) {
            term.terminal.bold.green('Execution Results:\n');
            response.execution_results.forEach(result => {
              term.terminal.bold.blue(`Command: ${result.command}\n`);
              term.terminal.white(`Output:\n${result.output}\n\n`);
            });
          }
          if (response.error) {
            term.terminal.bold.red('Execution Error:\n').white(response.error + '\n');
          }
        }
      }
    } catch (error) {
      // Display any unexpected errors
      term.terminal.red('An error occurred: ').white((error as Error).message + '\n');
    }

    term.terminal('\n'); // Add a blank line for readability
  }
}

// Start the application
main();