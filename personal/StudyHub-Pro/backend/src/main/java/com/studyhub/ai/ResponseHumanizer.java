package com.studyhub.ai;

import org.springframework.stereotype.Component;
import java.util.*;
import java.util.regex.Pattern;

/**
 * ResponseHumanizer - Sistema de humanización de respuestas de IA
 * 
 * Transforma respuestas técnicas y robóticas de IA en respuestas naturales,
 * empáticas y personalizadas para estudiantes.
 */
@Component
public class ResponseHumanizer {
    
    private static final List<String> GREETINGS = Arrays.asList(
        "¡Buena pregunta! 😊",
        "¡Claro que sí! 👍",
        "¡Perfecto!",
        "¡Excelente pregunta!",
        "Me alegra que preguntes esto 😊",
        "¡Genial que quieras aprender esto!"
    );
    
    private static final List<String> ENCOURAGEMENTS = Arrays.asList(
        "¡Vas muy bien! 💪",
        "¡Sigue así!",
        "¡Estás haciendo un gran trabajo!",
        "¡Lo estás entendiendo perfectamente!",
        "¡Excelente progreso!"
    );
    
    private static final List<String> CLOSINGS = Arrays.asList(
        "¿Quieres que te explique algo más?",
        "¿Te quedó claro? Si no, pregúntame sin problema 😊",
        "¿Necesitas más ejemplos?",
        "¿Quieres practicar con más ejercicios?",
        "Si tienes dudas, aquí estoy para ayudarte 🙌"
    );
    
    private static final Map<String, String> EMOJI_MAP = Map.of(
        "matemáticas", "📐",
        "física", "⚛️",
        "química", "🧪",
        "programación", "💻",
        "historia", "📚",
        "biología", "🧬",
        "literatura", "📖",
        "idiomas", "🗣️"
    );
    
    private final Random random = new Random();
    
    /**
     * Humaniza una respuesta de IA aplicando múltiples transformaciones
     */
    public String humanize(String aiResponse, HumanizationContext context) {
        if (aiResponse == null || aiResponse.trim().isEmpty()) {
            return "Lo siento, no pude procesar tu pregunta. ¿Podrías reformularla? 😊";
        }
        
        StringBuilder humanized = new StringBuilder();
        
        // 1. Añadir saludo personalizado
        if (context.isFirstInteraction() || random.nextDouble() < 0.3) {
            humanized.append(getRandomElement(GREETINGS)).append(" ");
        }
        
        // 2. Añadir contexto del estudiante si está disponible
        if (context.getSubject() != null && !context.getSubject().isEmpty()) {
            String emoji = EMOJI_MAP.getOrDefault(context.getSubject().toLowerCase(), "📝");
            humanized.append(emoji).append(" ");
        }
        
        // 3. Procesar el contenido principal
        String processedContent = processMainContent(aiResponse, context);
        humanized.append(processedContent);
        
        // 4. Añadir ejemplos si es apropiado
        if (context.needsExamples() && !containsExamples(aiResponse)) {
            humanized.append("\n\n").append(generateExamplePrompt(context));
        }
        
        // 5. Añadir ánimo si el estudiante está luchando
        if (context.getDifficultyLevel() > 7 || context.getAttemptCount() > 2) {
            humanized.append("\n\n").append(getRandomElement(ENCOURAGEMENTS));
            humanized.append(" No te preocupes si no sale a la primera, es completamente normal. ");
        }
        
        // 6. Añadir cierre interactivo
        if (random.nextDouble() < 0.6) {
            humanized.append("\n\n").append(getRandomElement(CLOSINGS));
        }
        
        return humanized.toString();
    }
    
    /**
     * Procesa el contenido principal de la respuesta
     */
    private String processMainContent(String content, HumanizationContext context) {
        String processed = content;
        
        // Eliminar frases robóticas comunes
        processed = removeRoboticPhrases(processed);
        
        // Añadir conectores naturales
        processed = addNaturalConnectors(processed);
        
        // Simplificar lenguaje técnico si el nivel es básico
        if (context.getStudentLevel() != null && context.getStudentLevel().equals("básico")) {
            processed = simplifyTechnicalLanguage(processed);
        }
        
        // Añadir énfasis y emociones
        processed = addEmphasisAndEmotions(processed);
        
        // Formatear mejor las explicaciones
        processed = improveFormatting(processed);
        
        return processed;
    }
    
    /**
     * Elimina frases robóticas típicas de IA
     */
    private String removeRoboticPhrases(String text) {
        String[] roboticPhrases = {
            "Como modelo de lenguaje,",
            "Como IA,",
            "Basándome en mi entrenamiento,",
            "Según mis datos,",
            "Es importante mencionar que",
            "Cabe destacar que"
        };
        
        String result = text;
        for (String phrase : roboticPhrases) {
            result = result.replaceAll("(?i)" + Pattern.quote(phrase), "");
        }
        
        return result.trim();
    }
    
    /**
     * Añade conectores naturales para mejorar el flujo
     */
    private String addNaturalConnectors(String text) {
        String result = text;
        
        // Añadir conectores entre párrafos
        result = result.replaceAll("\n\n", "\n\nAhora bien, ");
        
        // Añadir transiciones suaves
        if (result.contains("Por lo tanto")) {
            result = result.replace("Por lo tanto", "Entonces");
        }
        
        if (result.contains("En consecuencia")) {
            result = result.replace("En consecuencia", "Así que");
        }
        
        return result;
    }
    
    /**
     * Simplifica lenguaje técnico para estudiantes de nivel básico
     */
    private String simplifyTechnicalLanguage(String text) {
        Map<String, String> simplifications = Map.of(
            "algoritmo", "método paso a paso",
            "implementar", "hacer",
            "optimizar", "mejorar",
            "iteración", "repetición",
            "parámetro", "valor que le pasamos",
            "instancia", "ejemplo",
            "compilar", "convertir el código"
        );
        
        String result = text;
        for (Map.Entry<String, String> entry : simplifications.entrySet()) {
            result = result.replaceAll("(?i)\\b" + entry.getKey() + "\\b", entry.getValue());
        }
        
        return result;
    }
    
    /**
     * Añade énfasis y emociones apropiadas
     */
    private String addEmphasisAndEmotions(String text) {
        String result = text;
        
        // Añadir énfasis en puntos clave
        if (result.contains("importante")) {
            result = result.replace("importante", "**muy importante**");
        }
        
        // Añadir emojis contextuales
        if (result.contains("correcto") || result.contains("bien")) {
            result = result.replaceFirst("correcto|bien", "$0 ✅");
        }
        
        if (result.contains("error") || result.contains("incorrecto")) {
            result = result.replaceFirst("error|incorrecto", "$0 ⚠️");
        }
        
        return result;
    }
    
    /**
     * Mejora el formato de la respuesta
     */
    private String improveFormatting(String text) {
        String result = text;
        
        // Asegurar espaciado apropiado
        result = result.replaceAll("\\n{3,}", "\n\n");
        
        // Añadir saltos de línea antes de listas
        result = result.replaceAll("([.!?])\\s*([1-9]\\.|•|-)", "$1\n\n$2");
        
        return result.trim();
    }
    
    /**
     * Genera un prompt para ofrecer ejemplos
     */
    private String generateExamplePrompt(HumanizationContext context) {
        List<String> prompts = Arrays.asList(
            "¿Te gustaría que te muestre un ejemplo práctico?",
            "Déjame mostrarte un ejemplo para que quede más claro:",
            "Vamos a verlo con un ejemplo concreto:",
            "Para que lo entiendas mejor, te pongo un ejemplo:"
        );
        
        return getRandomElement(prompts);
    }
    
    /**
     * Verifica si la respuesta ya contiene ejemplos
     */
    private boolean containsExamples(String text) {
        return text.toLowerCase().contains("ejemplo") ||
               text.toLowerCase().contains("por ejemplo") ||
               text.contains("```") ||
               Pattern.compile("\\d+\\.\\s").matcher(text).find();
    }
    
    /**
     * Detecta el tono emocional del estudiante y ajusta la respuesta
     */
    public String adjustToneBasedOnEmotion(String response, StudentEmotion emotion) {
        switch (emotion) {
            case FRUSTRATED:
                return "Entiendo que puede ser frustrante 😔. " + response + 
                       "\n\nRecuerda: todos pasamos por esto. ¡Tú puedes! 💪";
                       
            case CONFUSED:
                return "Veo que hay confusión. Déjame explicarlo de otra manera:\n\n" + 
                       response + "\n\n¿Así está más claro? 🤔";
                       
            case EXCITED:
                return "¡Me encanta tu entusiasmo! 🎉\n\n" + response;
                       
            case TIRED:
                return "Sé que puede ser cansado estudiar tanto. " + response + 
                       "\n\nRecuerda tomar descansos cuando lo necesites 😊";
                       
            default:
                return response;
        }
    }
    
    /**
     * Personaliza la respuesta según el historial del estudiante
     */
    public String personalizeWithHistory(String response, StudentHistory history) {
        StringBuilder personalized = new StringBuilder(response);
        
        // Referenciar temas previos si es relevante
        if (history.hasRelatedTopics()) {
            personalized.append("\n\n💡 **Conexión con lo que ya sabes**: ");
            personalized.append("Esto se relaciona con ").append(history.getLastRelatedTopic());
            personalized.append(" que vimos antes. ¿Lo recuerdas?");
        }
        
        // Celebrar progreso
        if (history.getConsecutiveCorrectAnswers() >= 3) {
            personalized.insert(0, "¡Wow! Llevas " + history.getConsecutiveCorrectAnswers() + 
                              " respuestas correctas seguidas. ¡Impresionante! 🌟\n\n");
        }
        
        return personalized.toString();
    }
    
    /**
     * Obtiene un elemento aleatorio de una lista
     */
    private <T> T getRandomElement(List<T> list) {
        return list.get(random.nextInt(list.size()));
    }
    
    // ===== CLASES AUXILIARES =====
    
    public enum StudentEmotion {
        NEUTRAL, FRUSTRATED, CONFUSED, EXCITED, TIRED, ANXIOUS
    }
    
    public static class HumanizationContext {
        private boolean firstInteraction;
        private String subject;
        private String studentLevel;
        private int difficultyLevel;
        private int attemptCount;
        private boolean needsExamples;
        
        // Getters y Setters
        public boolean isFirstInteraction() { return firstInteraction; }
        public void setFirstInteraction(boolean firstInteraction) { this.firstInteraction = firstInteraction; }
        
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        
        public String getStudentLevel() { return studentLevel; }
        public void setStudentLevel(String studentLevel) { this.studentLevel = studentLevel; }
        
        public int getDifficultyLevel() { return difficultyLevel; }
        public void setDifficultyLevel(int difficultyLevel) { this.difficultyLevel = difficultyLevel; }
        
        public int getAttemptCount() { return attemptCount; }
        public void setAttemptCount(int attemptCount) { this.attemptCount = attemptCount; }
        
        public boolean needsExamples() { return needsExamples; }
        public void setNeedsExamples(boolean needsExamples) { this.needsExamples = needsExamples; }
    }
    
    public static class StudentHistory {
        private List<String> relatedTopics;
        private int consecutiveCorrectAnswers;
        
        public StudentHistory() {
            this.relatedTopics = new ArrayList<>();
            this.consecutiveCorrectAnswers = 0;
        }
        
        public boolean hasRelatedTopics() {
            return !relatedTopics.isEmpty();
        }
        
        public String getLastRelatedTopic() {
            return relatedTopics.isEmpty() ? "" : relatedTopics.get(relatedTopics.size() - 1);
        }
        
        public int getConsecutiveCorrectAnswers() {
            return consecutiveCorrectAnswers;
        }
        
        public void setConsecutiveCorrectAnswers(int count) {
            this.consecutiveCorrectAnswers = count;
        }
        
        public void addRelatedTopic(String topic) {
            this.relatedTopics.add(topic);
        }
    }
}
