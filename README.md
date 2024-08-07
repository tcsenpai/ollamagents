# OllamaAgents

[![asciicast](https://asciinema.org/a/671202.svg)](https://asciinema.org/a/671202)

Click the image for a live demo

OllamaAgents is a TypeScript-based CLI application that provides a Linux command interpreter using the Ollama API. It converts natural language queries into appropriate Linux commands, offering explanations and cautions when necessary.

## Features

- Convert natural language queries to Linux commands
- Generate single or multiple commands as needed
- Provide explanations for generated commands
- Offer cautions for potentially dangerous operations
- Optional command execution
- Colorful and interactive CLI interface

## Prerequisites

- Node.js (version 14 or higher recommended)
- Yarn package manager
- Ollama API endpoint

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ollamagents.git
   cd ollamagents
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Create a `.env` file in the root directory and add your Ollama API URL:
   ```
   OLLAMA_URL=http://your-ollama-api-url
   ```

## Usage

To start the application, run:

`yarn start`


Once started, you can enter natural language queries or commands. The application will interpret your input and provide the corresponding Linux command(s), along with an explanation and any necessary cautions.

To execute a command, prefix your input with '!'. For example:

`!list files in current directory`


This will interpret the command, show you the Linux command(s) it plans to run, and then execute them, displaying the output.

Type 'exit' to quit the application.

## Warning and Disclaimer

**CAUTION:** This application can execute system commands. Be extremely careful when using the execution feature, especially with commands that modify your system or files. Always review the generated commands before execution and ensure you understand their effects.

The authors and contributors of OllamaAgents are not responsible for any damage or data loss caused by the execution of commands through this application. Use at your own risk.

## Development

This project uses TypeScript and is set up with TSX for running TypeScript files directly. The main entry point is `main.ts`.

To modify the system prompt or adjust the behavior of the Ollama API integration, refer to the `OllamaAPI` class in `ollamapi.ts`.

## Dependencies

- tsx: For running TypeScript files directly
- axios: HTTP client for making requests to the Ollama API
- dotenv: For loading environment variables
- readline: For reading input from the user
- terminal-kit: For colorful CLI output

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

tcsenpai <dev@tcsenpai.com>

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check issues page if you want to contribute.

## Acknowledgments

- Ollama for providing the underlying language model capabilities and API
- Claude Sonnet 3.5 and Cursor IDE for providing such a great AI model and IDE
- All the enthusiasts who keep the open-source community alive
