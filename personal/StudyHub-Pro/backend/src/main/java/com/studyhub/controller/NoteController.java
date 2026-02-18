package com.studyhub.controller;

import com.studyhub.model.Note;
import com.studyhub.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * NoteController - Endpoints REST para gestión de notas
 */
@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {
    
    @Autowired
    private NoteRepository noteRepository;
    
    /**
     * GET /api/notes - Obtener todas las notas del usuario
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllNotes(
            @RequestParam(required = false) String subject) {
        
        Long userId = 1L; // En producción vendría del JWT
        
        List<Note> notes;
        if (subject != null && !subject.isEmpty()) {
            notes = noteRepository.findByUserIdAndSubjectOrderByCreatedAtDesc(userId, subject);
        } else {
            notes = noteRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("notes", notes);
        response.put("total", notes.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/notes/{id} - Obtener una nota específica
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getNoteById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        return noteRepository.findById(id)
            .map(note -> {
                response.put("success", true);
                response.put("note", note);
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> {
                response.put("success", false);
                response.put("error", "Nota no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            });
    }
    
    /**
     * POST /api/notes - Crear nueva nota
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createNote(@RequestBody Note note) {
        Long userId = 1L;
        note.setUserId(userId);
        
        Note savedNote = noteRepository.save(note);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("note", savedNote);
        response.put("message", "Nota creada exitosamente");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * PUT /api/notes/{id} - Actualizar nota existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateNote(
            @PathVariable Long id,
            @RequestBody Note noteDetails) {
        
        Map<String, Object> response = new HashMap<>();
        
        return noteRepository.findById(id)
            .map(note -> {
                note.setTitle(noteDetails.getTitle());
                note.setContent(noteDetails.getContent());
                note.setSubject(noteDetails.getSubject());
                
                Note updatedNote = noteRepository.save(note);
                
                response.put("success", true);
                response.put("note", updatedNote);
                response.put("message", "Nota actualizada exitosamente");
                
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> {
                response.put("success", false);
                response.put("error", "Nota no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            });
    }
    
    /**
     * DELETE /api/notes/{id} - Eliminar nota
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNote(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        if (!noteRepository.existsById(id)) {
            response.put("success", false);
            response.put("error", "Nota no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        noteRepository.deleteById(id);
        
        response.put("success", true);
        response.put("message", "Nota eliminada exitosamente");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/notes/search - Buscar notas
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchNotes(@RequestParam String query) {
        Long userId = 1L;
        
        List<Note> notes = noteRepository
            .findByUserIdAndTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                userId, query, query
            );
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("notes", notes);
        response.put("total", notes.size());
        response.put("query", query);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/notes/subjects - Obtener lista de asignaturas
     */
    @GetMapping("/subjects")
    public ResponseEntity<Map<String, Object>> getSubjects() {
        Long userId = 1L;
        
        List<Note> notes = noteRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        // Extraer asignaturas únicas
        List<String> subjects = notes.stream()
            .map(Note::getSubject)
            .filter(s -> s != null && !s.isEmpty())
            .distinct()
            .toList();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("subjects", subjects);
        
        return ResponseEntity.ok(response);
    }
}
