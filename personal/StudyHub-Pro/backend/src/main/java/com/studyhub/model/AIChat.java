package com.studyhub.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_chats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIChat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_message", columnDefinition = "TEXT", nullable = false)
    private String userMessage;
    
    @Column(name = "ai_response", columnDefinition = "TEXT")
    private String aiResponse;
    
    @Column(name = "raw_response", columnDefinition = "TEXT")
    private String rawResponse;
    
    private String provider;
    
    private String subject;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "user_id")
    private Long userId;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
