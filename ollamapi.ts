import axios from 'axios';
import { exec } from 'child_process';

/**
 * Represents a message in the chat conversation.
 */
interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

/**
 * Represents the parsed response from the Ollama API.
 */
interface ParsedResponse {
    commands: string[];
    explanation: string;
    caution: string | null;
    error?: string;
    execution_results?: { command: string, output: string }[];
}

/**
 * OllamaAPI class for interacting with the Ollama API and executing Linux commands.
 */
export class OllamaAPI {
    private baseURL: string;
    private model: string;
    private systemPrompt: string;

    /**
     * Creates an instance of OllamaAPI.
     * @param {string} ollamaURL - The base URL for the Ollama API.
     * @param {string} [model='llama2'] - The model to use for chat completions.
     */
    constructor(ollamaURL: string, model: string = 'llama2') {
        this.baseURL = ollamaURL;
        this.model = model;
        this.systemPrompt = `You are a Linux command interpreter. Your task is to convert natural language queries or commands into appropriate Linux commands. Always respond with a valid JSON object containing the following keys:
1. 'commands': An array of strings, each representing a Linux command to execute. If multiple commands are needed, list them in the order they should be executed.
2. 'explanation': A brief explanation of what the command(s) do (string).
3. 'caution': Any warnings or cautions about using the command(s), if applicable (string or null).

Guidelines:
- Provide a single command when possible, but use multiple commands or command chains (using pipes | or && ) when necessary to achieve the desired result.
- If suggesting multiple commands, explain how they work together.
- Always use existing and working Linux commands.
- If you cannot interpret the input or if it's not applicable to Linux, return a JSON object with an 'error' key explaining the issue.

Important: Do not include any text outside of the JSON structure in your response. Do not use markdown formatting, code block delimiters, or any other syntax that is not part of the JSON object. The response should be a raw JSON object that can be directly parsed by JSON.parse() in JavaScript.
The response should start with '{' and end with '}' without any additional characters before or after.`;
    }

    /**
     * Sends a chat request to the Ollama API and optionally executes the returned commands.
     * @param {string} prompt - The user's input prompt.
     * @param {boolean} [executeCommands=false] - Whether to execute the returned commands.
     * @returns {Promise<ParsedResponse>} The parsed response from the API.
     */
    async chat(prompt: string, executeCommands: boolean = false): Promise<ParsedResponse> {
        try {
            const messages: Message[] = [
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: prompt }
            ];
            const response = await axios.post(`${this.baseURL}/api/chat`, {
                model: this.model,
                messages: messages,
                stream: false
            });
            const assistantResponse = response.data.message.content;
            const parsedResponse = this.parseResponse(assistantResponse);

            if (executeCommands && parsedResponse.commands.length > 0) {
                try {
                    parsedResponse.execution_results = await this.executeCommands(parsedResponse.commands);
                } catch (execError) {
                    parsedResponse.error = (execError as Error).message;
                }
            }

            return parsedResponse;
        } catch (error) {
            console.error('Error in chat:', error);
            throw error;
        }
    }

    /**
     * Parses the response from the Ollama API.
     * @param {string} response - The raw response from the API.
     * @returns {ParsedResponse} The parsed response object.
     * @private
     */
    private parseResponse(response: string): ParsedResponse {
        try {
            // Remove markdown code block delimiters if present
            const cleanedResponse = response.replace(/^```json\s*|\s*```$/g, '').trim();

            const parsedResponse = JSON.parse(cleanedResponse);
            return {
                commands: parsedResponse.commands || [],
                explanation: parsedResponse.explanation || '',
                caution: parsedResponse.caution || null,
                error: parsedResponse.error
            };
        } catch (error) {
            console.error('Error parsing response:', error);
            return {
                commands: [],
                explanation: '',
                caution: null,
                error: 'Failed to parse the response from the AI model.'
            };
        }
    }

    /**
 * Executes the given Linux commands separately.
 * @param {string[]} commands - An array of Linux commands to execute.
 * @returns {Promise<{command: string, output: string}[]>} An array of objects containing each command and its output.
 * @private
 */
    private async executeCommands(commands: string[]): Promise<{ command: string, output: string }[]> {
        const results = [];
        for (const command of commands) {
            try {
                const output = await new Promise<string>((resolve, reject) => {
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            reject(`Error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            reject(`Error: ${stderr}`);
                            return;
                        }
                        resolve(stdout);
                    });
                });
                results.push({ command, output });
            } catch (error) {
                results.push({ command, output: `Error: ${error}` });
            }
        }
        return results;
    }
}