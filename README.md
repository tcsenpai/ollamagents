# OllamaAgents

OllamaAgents is a TypeScript-based CLI application that provides a Linux command interpreter using the Ollama API. It converts natural language queries into appropriate Linux commands, offering explanations and cautions when necessary.

## Features

- Convert natural language queries to Linux commands
- Provide explanations for generated commands
- Offer cautions for potentially dangerous operations
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

```
yarn start
```


Once started, you can enter natural language queries or commands. The application will interpret your input and provide the corresponding Linux command, along with an explanation and any necessary cautions.

Type 'exit' to quit the application.

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

- Ollama for providing the underlying language model capabilities
- The TypeScript and Node.js communities for their excellent tools and libraries