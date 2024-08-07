import axios from 'axios';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export class OllamaAPI {
    private baseURL: string;
    private model: string;
    private memory: Message[] = [];
    private systemPrompt: string;

    constructor(ollamaURL: string, model: string = 'llama2', systemPrompt: string = '') {
        this.baseURL = ollamaURL;
        this.model = model;
        this.systemPrompt = systemPrompt;
        if (systemPrompt) {
            this.memory.push({ role: 'system', content: systemPrompt });
        }
    }

    async chat(prompt: string): Promise<string> {
        try {
            //this.memory.push({ role: 'user', content: prompt });
            let systemAndPrompt: Message[] = []
            systemAndPrompt.push({ role: 'system', content: this.systemPrompt })
            systemAndPrompt.push({ role: 'user', content: prompt })
            const response = await axios.post(`${this.baseURL}/api/chat`, {
                model: this.model,
                messages: systemAndPrompt,
                stream: false
            });
            const assistantResponse = response.data.message.content;
            //this.memory.push({ role: 'assistant', content: assistantResponse });
            return assistantResponse;
        } catch (error) {
            console.error('Error in chat:', error);
            throw error;
        }
    }

    async complete(prompt: string): Promise<string> {
        try {
            const fullPrompt = this.memory.map(m => `${m.role}: ${m.content}`).join('\n') + `\nuser: ${prompt}\nassistant:`;
            const response = await axios.post(`${this.baseURL}/api/generate`, {
                model: this.model,
                prompt: fullPrompt,
                stream: false
            });
            const assistantResponse = response.data.response;
            //this.memory.push({ role: 'user', content: prompt });
            //this.memory.push({ role: 'assistant', content: assistantResponse });
            return assistantResponse;
        } catch (error) {
            console.error('Error in complete:', error);
            throw error;
        }
    }

    clearMemory() {
        this.memory = this.systemPrompt ? [{ role: 'system', content: this.systemPrompt }] : [];
    }

    setSystemPrompt(prompt: string) {
        this.systemPrompt = prompt;
        this.clearMemory();
    }
}