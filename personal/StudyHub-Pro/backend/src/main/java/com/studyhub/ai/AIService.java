package com.studyhub.ai;

import com.studyhub.ai.ResponseHumanizer.HumanizationContext;
import com.studyhub.ai.ResponseHumanizer.StudentEmotion;
import com.studyhub.ai.ResponseHumanizer.StudentHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

/**
 * AIService - Servicio principal de integración con IA
 * 
 * Soporta múltiples proveedores: OpenAI, Google Gemini, Anthropic Claude
 * Incluye humanización automática de respuestas
 */
@Service
public class AIService {
    
    @Autowired
    private ResponseHumanizer humanizer;
    
    @Value("${ai.provider:openai}")
    private String defaultProvider;
    
    @Value("${ai.openai.api-key:}")
    private String openaiApiKey;
    
    @Value("${ai.gemini.api-key:}")
    private String geminiApiKey;
    
    @Value("${ai.claude.api-key:}")
    private String claudeApiKey;
    
    private final WebClient webClient;
    
    public AIService() {
        this.webClient = WebClient.builder().build();
    }
    
    /**
     * Procesa una consulta del estudiante y devuelve respuesta humanizada
     */
    public Mono<AIResponse> processQuery(AIRequest request) {
        // 1. Validar que hay API key configurada
        if (!hasApiKey(request.getProvider())) {
            return Mono.just(createErrorResponse(
                "No hay API key configurada para " + request.getProvider() + 
                ". Por favor configúrala en Ajustes."
            ));
        }
        
        // 2. Llamar al proveedor de IA correspondiente
        Mono<String> rawResponse;
        switch (request.getProvider().toLowerCase()) {
            case "openai":
                rawResponse = callOpenAI(request);
                break;
            case "gemini":
                rawResponse = callGemini(request);
                break;
            case "claude":
                rawResponse = callClaude(request);
                break;
            default:
                return Mono.just(createErrorResponse("Proveedor de IA no soportado: " + request.getProvider()));
        }
        
        // 3. Humanizar la respuesta
        return rawResponse.map(raw -> {
            HumanizationContext context = buildContext(request);
            String humanized = humanizer.humanize(raw, context);
            
            // Ajustar tono según emoción detectada
            if (request.getEmotion() != null) {
                humanized = humanizer.adjustToneBasedOnEmotion(humanized, request.getEmotion());
            }
            
            // Personalizar con historial
            if (request.getStudentHistory() != null) {
                humanized = humanizer.personalizeWithHistory(humanized, request.getStudentHistory());
            }
            
            return new AIResponse(humanized, raw, request.getProvider());
        });
    }
    
    /**
     * Llama a OpenAI GPT-4
     */
    private Mono<String> callOpenAI(AIRequest request) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4");
        requestBody.put("messages", new Object[]{
            Map.of("role", "system", "content", buildSystemPrompt(request)),
            Map.of("role", "user", "content", request.getQuery())
        });
        requestBody.put("temperature", 0.7);
        requestBody.put("max_tokens", 1000);
        
        return webClient.post()
            .uri("https://api.openai.com/v1/chat/completions")
            .header("Authorization", "Bearer " + openaiApiKey)
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map.class)
            .map(response -> {
                Map<String, Object> choices = ((java.util.List<Map<String, Object>>) response.get("choices")).get(0);
                Map<String, Object> message = (Map<String, Object>) choices.get("message");
                return (String) message.get("content");
            })
            .onErrorResume(e -> Mono.just("Error al comunicarse con OpenAI: " + e.getMessage()));
    }
    
    /**
     * Llama a Google Gemini
     */
    private Mono<String> callGemini(AIRequest request) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", new Object[]{
            Map.of("parts", new Object[]{
                Map.of("text", buildSystemPrompt(request) + "\n\n" + request.getQuery())
            })
        });
        
        return webClient.post()
            .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiApiKey)
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map.class)
            .map(response -> {
                java.util.List<Map<String, Object>> candidates = 
                    (java.util.List<Map<String, Object>>) response.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                java.util.List<Map<String, Object>> parts = 
                    (java.util.List<Map<String, Object>>) content.get("parts");
                return (String) parts.get(0).get("text");
            })
            .onErrorResume(e -> Mono.just("Error al comunicarse con Gemini: " + e.getMessage()));
    }
    
    /**
     * Llama a Anthropic Claude
     */
    private Mono<String> callClaude(AIRequest request) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "claude-3-sonnet-20240229");
        requestBody.put("max_tokens", 1000);
        requestBody.put("messages", new Object[]{
            Map.of("role", "user", "content", buildSystemPrompt(request) + "\n\n" + request.getQuery())
        });
        
        return webClient.post()
            .uri("https://api.anthropic.com/v1/messages")
            .header("x-api-key", claudeApiKey)
            .header("anthropic-version", "2023-06-01")
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map.class)
            .map(response -> {
                java.util.List<Map<String, Object>> content = 
                    (java.util.List<Map<String, Object>>) response.get("content");
                return (String) content.get(0).get("text");
            })
            .onErrorResume(e -> Mono.just("Error al comunicarse con Claude: " + e.getMessage()));
    }
    
    /**
     * Construye el prompt del sistema según el contexto
     */
    private String buildSystemPrompt(AIRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Eres un tutor personal experto y empático para estudiantes. ");
        prompt.append("Tu objetivo es ayudar a aprender de forma efectiva y motivadora. ");
        
        if (request.getSubject() != null) {
            prompt.append("El tema actual es: ").append(request.getSubject()).append(". ");
        }
        
        if (request.getStudentLevel() != null) {
            prompt.append("El nivel del estudiante es: ").append(request.getStudentLevel()).append(". ");
            if (request.getStudentLevel().equals("básico")) {
                prompt.append("Explica de forma simple y con ejemplos prácticos. ");
            }
        }
        
        if (request.getTaskType() != null) {
            switch (request.getTaskType()) {
                case "exercise":
                    prompt.append("Ayuda a resolver el ejercicio paso a paso, explicando cada paso. ");
                    break;
                case "summary":
                    prompt.append("Crea un resumen claro y conciso del material. ");
                    break;
                case "flashcards":
                    prompt.append("Genera flashcards en formato pregunta-respuesta. ");
                    break;
                case "quiz":
                    prompt.append("Crea preguntas de opción múltiple con explicaciones. ");
                    break;
            }
        }
        
        prompt.append("Sé claro, motivador y usa ejemplos cuando sea apropiado.");
        
        return prompt.toString();
    }
    
    /**
     * Construye el contexto de humanización
     */
    private HumanizationContext buildContext(AIRequest request) {
        HumanizationContext context = new HumanizationContext();
        context.setFirstInteraction(request.isFirstInteraction());
        context.setSubject(request.getSubject());
        context.setStudentLevel(request.getStudentLevel());
        context.setDifficultyLevel(request.getDifficultyLevel());
        context.setAttemptCount(request.getAttemptCount());
        context.setNeedsExamples(request.needsExamples());
        return context;
    }
    
    /**
     * Verifica si hay API key para el proveedor
     */
    private boolean hasApiKey(String provider) {
        switch (provider.toLowerCase()) {
            case "openai":
                return openaiApiKey != null && !openaiApiKey.isEmpty();
            case "gemini":
                return geminiApiKey != null && !geminiApiKey.isEmpty();
            case "claude":
                return claudeApiKey != null && !claudeApiKey.isEmpty();
            default:
                return false;
        }
    }
    
    /**
     * Crea una respuesta de error
     */
    private AIResponse createErrorResponse(String message) {
        return new AIResponse(message, message, "error");
    }
    
    // ===== CLASES DE DATOS =====
    
    public static class AIRequest {
        private String query;
        private String provider = "openai";
        private String subject;
        private String studentLevel;
        private String taskType;
        private int difficultyLevel = 5;
        private int attemptCount = 1;
        private boolean firstInteraction = false;
        private boolean needsExamples = false;
        private StudentEmotion emotion;
        private StudentHistory studentHistory;
        
        // Getters y Setters
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        
        public String getStudentLevel() { return studentLevel; }
        public void setStudentLevel(String studentLevel) { this.studentLevel = studentLevel; }
        
        public String getTaskType() { return taskType; }
        public void setTaskType(String taskType) { this.taskType = taskType; }
        
        public int getDifficultyLevel() { return difficultyLevel; }
        public void setDifficultyLevel(int difficultyLevel) { this.difficultyLevel = difficultyLevel; }
        
        public int getAttemptCount() { return attemptCount; }
        public void setAttemptCount(int attemptCount) { this.attemptCount = attemptCount; }
        
        public boolean isFirstInteraction() { return firstInteraction; }
        public void setFirstInteraction(boolean firstInteraction) { this.firstInteraction = firstInteraction; }
        
        public boolean needsExamples() { return needsExamples; }
        public void setNeedsExamples(boolean needsExamples) { this.needsExamples = needsExamples; }
        
        public StudentEmotion getEmotion() { return emotion; }
        public void setEmotion(StudentEmotion emotion) { this.emotion = emotion; }
        
        public StudentHistory getStudentHistory() { return studentHistory; }
        public void setStudentHistory(StudentHistory studentHistory) { this.studentHistory = studentHistory; }
    }
    
    public static class AIResponse {
        private String humanizedResponse;
        private String rawResponse;
        private String provider;
        private long timestamp;
        
        public AIResponse(String humanizedResponse, String rawResponse, String provider) {
            this.humanizedResponse = humanizedResponse;
            this.rawResponse = rawResponse;
            this.provider = provider;
            this.timestamp = System.currentTimeMillis();
        }
        
        // Getters
        public String getHumanizedResponse() { return humanizedResponse; }
        public String getRawResponse() { return rawResponse; }
        public String getProvider() { return provider; }
        public long getTimestamp() { return timestamp; }
    }
}
