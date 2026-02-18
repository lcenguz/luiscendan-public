package com.studyhub.controller;

import com.studyhub.model.Task;
import com.studyhub.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * TaskController - Endpoints REST para gestión de tareas
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    
    @Autowired
    private TaskRepository taskRepository;
    
    /**
     * GET /api/tasks - Obtener todas las tareas
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTasks(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String priority) {
        
        Long userId = 1L;
        
        List<Task> tasks;
        
        if (completed != null) {
            tasks = taskRepository.findByUserIdAndCompletedOrderByDueDateAsc(userId, completed);
        } else if (priority != null) {
            Task.Priority priorityEnum = Task.Priority.valueOf(priority.toUpperCase());
            tasks = taskRepository.findByUserIdAndPriorityOrderByDueDateAsc(userId, priorityEnum);
        } else {
            tasks = taskRepository.findByUserIdOrderByDueDateAsc(userId);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("tasks", tasks);
        response.put("total", tasks.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/tasks/{id} - Obtener tarea específica
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTaskById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        return taskRepository.findById(id)
            .map(task -> {
                response.put("success", true);
                response.put("task", task);
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> {
                response.put("success", false);
                response.put("error", "Tarea no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            });
    }
    
    /**
     * POST /api/tasks - Crear nueva tarea
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTask(@RequestBody Task task) {
        Long userId = 1L;
        task.setUserId(userId);
        
        Task savedTask = taskRepository.save(task);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("task", savedTask);
        response.put("message", "Tarea creada exitosamente");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * PUT /api/tasks/{id} - Actualizar tarea
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTask(
            @PathVariable Long id,
            @RequestBody Task taskDetails) {
        
        Map<String, Object> response = new HashMap<>();
        
        return taskRepository.findById(id)
            .map(task -> {
                task.setTitle(taskDetails.getTitle());
                task.setDescription(taskDetails.getDescription());
                task.setDueDate(taskDetails.getDueDate());
                task.setPriority(taskDetails.getPriority());
                task.setCompleted(taskDetails.isCompleted());
                
                Task updatedTask = taskRepository.save(task);
                
                response.put("success", true);
                response.put("task", updatedTask);
                response.put("message", "Tarea actualizada exitosamente");
                
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> {
                response.put("success", false);
                response.put("error", "Tarea no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            });
    }
    
    /**
     * PATCH /api/tasks/{id}/toggle - Marcar/desmarcar tarea como completada
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Map<String, Object>> toggleTask(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        return taskRepository.findById(id)
            .map(task -> {
                task.setCompleted(!task.isCompleted());
                Task updatedTask = taskRepository.save(task);
                
                response.put("success", true);
                response.put("task", updatedTask);
                response.put("message", task.isCompleted() ? "Tarea completada" : "Tarea marcada como pendiente");
                
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> {
                response.put("success", false);
                response.put("error", "Tarea no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            });
    }
    
    /**
     * DELETE /api/tasks/{id} - Eliminar tarea
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTask(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        if (!taskRepository.existsById(id)) {
            response.put("success", false);
            response.put("error", "Tarea no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        taskRepository.deleteById(id);
        
        response.put("success", true);
        response.put("message", "Tarea eliminada exitosamente");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/tasks/upcoming - Obtener tareas próximas (próximos 7 días)
     */
    @GetMapping("/upcoming")
    public ResponseEntity<Map<String, Object>> getUpcomingTasks() {
        Long userId = 1L;
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekFromNow = now.plusDays(7);
        
        List<Task> tasks = taskRepository.findByUserIdAndDueDateBetweenOrderByDueDateAsc(
            userId, now, weekFromNow
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("tasks", tasks);
        response.put("total", tasks.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/tasks/stats - Estadísticas de tareas
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTaskStats() {
        Long userId = 1L;
        
        List<Task> allTasks = taskRepository.findByUserIdOrderByDueDateAsc(userId);
        
        long totalTasks = allTasks.size();
        long completedTasks = allTasks.stream().filter(Task::isCompleted).count();
        long pendingTasks = totalTasks - completedTasks;
        long highPriorityTasks = allTasks.stream()
            .filter(t -> !t.isCompleted() && t.getPriority() == Task.Priority.HIGH)
            .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", totalTasks);
        stats.put("completed", completedTasks);
        stats.put("pending", pendingTasks);
        stats.put("highPriority", highPriorityTasks);
        stats.put("completionRate", totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("stats", stats);
        
        return ResponseEntity.ok(response);
    }
}
