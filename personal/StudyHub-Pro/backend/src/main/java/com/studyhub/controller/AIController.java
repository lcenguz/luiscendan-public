package com.studyhub.controller;

import com.studyhub.ai.AIService;
import com.studyhub.ai.AIService.AIRequest;
import com.studyhub.ai.AIService.AIResponse;
import com.studyhub.model.AIChat;
import com.studyhub.repository.AIChatRepository;
import com.studyhub.service.FileProcessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AIController - Endpoints REST para funcionalidades de IA
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {
    
    @Autowired
    private AIService aiService;
    
    @Autowired
    private AIChatRepository chatRepository;
    
    @Autowired
    private FileProcessorService fileProcessor;
    
    /**
     * POST /api/ai/chat - Enviar mensaje a la IA
     */
    @PostMapping("/chat")
    public Mono<ResponseEntity<Map<String, Object>>> chat(@RequestBody AIRequest request) {
        // Por defecto, usar userId = 1 (en producción vendría del token JWT)
        Long userId = 1L;
        
        return aiService.processQuery(request)
            .map(aiResponse -> {
                // Guardar en base de datos
                AIChat chat = new AIChat();
                chat.setUserId(userId);
                chat.setUserMessage(request.getQuery());
                chat.setAiResponse(aiResponse.getHumanizedResponse());
                chat.setRawResponse(aiResponse.getRawResponse());
                chat.setProvider(aiResponse.getProvider());
                chat.setSubject(request.getSubject());
                chatRepository.save(chat);
                
                // Preparar respuesta
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", aiResponse.getHumanizedResponse());
                response.put("provider", aiResponse.getProvider());
                response.put("timestamp", aiResponse.getTimestamp());
                
                return ResponseEntity.ok(response);
            })
            .onErrorResume(e -> {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", e.getMessage());
                return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error));
            });
    }
    
    /**
     * GET /api/ai/history - Obtener historial de conversaciones
     */
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getHistory(
            @RequestParam(required = false) String subject,
            @RequestParam(defaultValue = "50") int limit) {
        
        Long userId = 1L;
        
        List<AIChat> chats;
        if (subject != null && !subject.isEmpty()) {
            chats = chatRepository.findByUserIdAndSubjectOrderByCreatedAtDesc(userId, subject);
        } else {
            chats = chatRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        
        // Limitar resultados
        if (chats.size() > limit) {
            chats = chats.subList(0, limit);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("chats", chats);
        response.put("total", chats.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /api/ai/upload - Subir archivo para procesamiento
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String subject) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validar archivo
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("error", "El archivo está vacío");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (!fileProcessor.isSupportedFileType(file.getOriginalFilename())) {
                response.put("success", false);
                response.put("error", "Tipo de archivo no soportado");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Procesar archivo
            String extractedText = fileProcessor.processFile(file);
            FileProcessorService.FileInfo fileInfo = fileProcessor.getFileInfo(file);
            
            response.put("success", true);
            response.put("fileName", fileInfo.getFileName());
            response.put("fileSize", fileInfo.getFileSizeFormatted());
            response.put("fileType", fileInfo.getFileType());
            response.put("extractedText", extractedText);
            response.put("message", "Archivo procesado correctamente. Ahora puedes hacerle preguntas sobre su contenido.");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("error", "Error al procesar el archivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * POST /api/ai/generate-summary - Generar resumen de texto
     */
    @PostMapping("/generate-summary")
    public Mono<ResponseEntity<Map<String, Object>>> generateSummary(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        String subject = request.get("subject");
        
        if (text == null || text.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "No se proporcionó texto para resumir");
            return Mono.just(ResponseEntity.badRequest().body(error));
        }
        
        AIRequest aiRequest = new AIRequest();
        aiRequest.setQuery("Por favor, genera un resumen claro y conciso del siguiente texto:\n\n" + text);
        aiRequest.setTaskType("summary");
        aiRequest.setSubject(subject);
        
        return aiService.processQuery(aiRequest)
            .map(aiResponse -> {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("summary", aiResponse.getHumanizedResponse());
                return ResponseEntity.ok(response);
            });
    }
    
    /**
     * POST /api/ai/generate-flashcards - Generar flashcards
     */
    @PostMapping("/generate-flashcards")
    public Mono<ResponseEntity<Map<String, Object>>> generateFlashcards(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        String subject = request.get("subject");
        
        AIRequest aiRequest = new AIRequest();
        aiRequest.setQuery("Genera 10 flashcards (pregunta-respuesta) basadas en el siguiente contenido:\n\n" + text);
        aiRequest.setTaskType("flashcards");
        aiRequest.setSubject(subject);
        
        return aiService.processQuery(aiRequest)
            .map(aiResponse -> {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("flashcards", aiResponse.getHumanizedResponse());
                return ResponseEntity.ok(response);
            });
    }
    
    /**
     * POST /api/ai/generate-quiz - Generar quiz
     */
    @PostMapping("/generate-quiz")
    public Mono<ResponseEntity<Map<String, Object>>> generateQuiz(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        String subject = request.get("subject");
        
        AIRequest aiRequest = new AIRequest();
        aiRequest.setQuery("Genera un quiz de 5 preguntas de opción múltiple basado en:\n\n" + text);
        aiRequest.setTaskType("quiz");
        aiRequest.setSubject(subject);
        
        return aiService.processQuery(aiRequest)
            .map(aiResponse -> {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("quiz", aiResponse.getHumanizedResponse());
                return ResponseEntity.ok(response);
            });
    }
    
    /**
     * GET /api/ai/stats - Estadísticas de uso de IA
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Long userId = 1L;
        
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime weekAgo = today.minusDays(7);
        
        long todayCount = chatRepository.countByUserIdAndCreatedAtAfter(userId, today);
        long weekCount = chatRepository.countByUserIdAndCreatedAtAfter(userId, weekAgo);
        long totalCount = chatRepository.countByUserIdAndCreatedAtAfter(userId, LocalDateTime.MIN);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("today", todayCount);
        stats.put("thisWeek", weekCount);
        stats.put("total", totalCount);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("stats", stats);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * DELETE /api/ai/history/{id} - Eliminar conversación
     */
    @DeleteMapping("/history/{id}")
    public ResponseEntity<Map<String, Object>> deleteChat(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        if (!chatRepository.existsById(id)) {
            response.put("success", false);
            response.put("error", "Conversación no encontrada");
            return ResponseEntity.notFound().build();
        }
        
        chatRepository.deleteById(id);
        response.put("success", true);
        response.put("message", "Conversación eliminada");
        
        return ResponseEntity.ok(response);
    }
}
