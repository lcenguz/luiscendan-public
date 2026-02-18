// ===================================
// AI CONFIGURATION - SERVERLESS
// Direct API connections (no backend needed)
// ===================================

class AIConfig {
    constructor() {
        this.providers = {
            gemini: {
                name: 'Google Gemini',
                apiKey: localStorage.getItem('gemini_api_key') || '',
                endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
                free: true
            },
            openai: {
                name: 'OpenAI GPT-4',
                apiKey: localStorage.getItem('openai_api_key') || '',
                endpoint: 'https://api.openai.com/v1/chat/completions',
                free: false
            },
            claude: {
                name: 'Anthropic Claude',
                apiKey: localStorage.getItem('claude_api_key') || '',
                endpoint: 'https://api.anthropic.com/v1/messages',
                free: false
            }
        };

        this.currentProvider = localStorage.getItem('ai_provider') || 'gemini';
    }

    // Save API key
    saveApiKey(provider, apiKey) {
        localStorage.setItem(`${provider}_api_key`, apiKey);
        this.providers[provider].apiKey = apiKey;
    }

    // Set current provider
    setProvider(provider) {
        if (this.providers[provider]) {
            this.currentProvider = provider;
            localStorage.setItem('ai_provider', provider);
            return true;
        }
        return false;
    }

    // Check if AI is configured
    isConfigured() {
        const provider = this.providers[this.currentProvider];
        return provider && provider.apiKey && provider.apiKey.length > 0;
    }

    // Send message to AI
    async sendMessage(userMessage, context = {}) {
        if (!this.isConfigured()) {
            throw new Error('AI no configurada. Ve a Configuración para añadir tu API key.');
        }

        const provider = this.providers[this.currentProvider];

        try {
            switch (this.currentProvider) {
                case 'gemini':
                    return await this.sendToGemini(userMessage, context, provider);
                case 'openai':
                    return await this.sendToOpenAI(userMessage, context, provider);
                case 'claude':
                    return await this.sendToClaude(userMessage, context, provider);
                default:
                    throw new Error('Proveedor no soportado');
            }
        } catch (error) {
            console.error('Error al enviar mensaje a IA:', error);
            throw error;
        }
    }

    // Google Gemini API
    async sendToGemini(message, context, provider) {
        const url = `${provider.endpoint}?key=${provider.apiKey}`;

        const systemPrompt = context.subject
            ? `Eres un tutor experto en ${context.subject}. Ayuda al estudiante de forma clara y educativa.`
            : 'Eres un asistente de estudio inteligente. Ayuda al estudiante con sus preguntas.';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nPregunta del estudiante: ${message}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Error al conectar con Gemini');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // OpenAI API
    async sendToOpenAI(message, context, provider) {
        const systemPrompt = context.subject
            ? `Eres un tutor experto en ${context.subject}. Ayuda al estudiante de forma clara y educativa.`
            : 'Eres un asistente de estudio inteligente. Ayuda al estudiante con sus preguntas.';

        const response = await fetch(provider.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${provider.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 2048
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Error al conectar con OpenAI');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Anthropic Claude API
    async sendToClaude(message, context, provider) {
        const systemPrompt = context.subject
            ? `Eres un tutor experto en ${context.subject}. Ayuda al estudiante de forma clara y educativa.`
            : 'Eres un asistente de estudio inteligente. Ayuda al estudiante con sus preguntas.';

        const response = await fetch(provider.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': provider.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 2048,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: message }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Error al conectar con Claude');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    // Analyze document (for PDF, images, etc.)
    async analyzeDocument(file, question = '') {
        if (!this.isConfigured()) {
            throw new Error('AI no configurada. Ve a Configuración para añadir tu API key.');
        }

        // For now, return a placeholder
        // You would need to implement file reading and encoding here
        return `Análisis de documento "${file.name}" estará disponible próximamente. Por ahora, puedes hacer preguntas sobre el contenido manualmente.`;
    }

    // Generate summary
    async generateSummary(text) {
        const prompt = `Por favor, genera un resumen conciso y bien estructurado del siguiente texto:\n\n${text}`;
        return await this.sendMessage(prompt);
    }

    // Generate flashcards
    async generateFlashcards(text) {
        const prompt = `Genera 5 flashcards (pregunta y respuesta) basadas en el siguiente contenido:\n\n${text}\n\nFormato: Q: [pregunta]\nA: [respuesta]`;
        return await this.sendMessage(prompt);
    }

    // Generate quiz
    async generateQuiz(text) {
        const prompt = `Genera un quiz de 5 preguntas de opción múltiple basado en el siguiente contenido:\n\n${text}\n\nFormato: 1. [pregunta]\na) [opción]\nb) [opción]\nc) [opción]\nd) [opción]\nRespuesta correcta: [letra]`;
        return await this.sendMessage(prompt);
    }

    // Humanize AI response
    humanizeResponse(aiResponse) {
        // Add natural language variations
        const variations = [
            { from: 'Por supuesto', to: '¡Claro!' },
            { from: 'Ciertamente', to: 'Sí, exacto' },
            { from: 'En efecto', to: 'Así es' },
            { from: 'De acuerdo', to: 'Perfecto' }
        ];

        let humanized = aiResponse;
        variations.forEach(v => {
            humanized = humanized.replace(new RegExp(v.from, 'g'), v.to);
        });

        return humanized;
    }
}

// Export for use in app.js
window.AIConfig = AIConfig;
