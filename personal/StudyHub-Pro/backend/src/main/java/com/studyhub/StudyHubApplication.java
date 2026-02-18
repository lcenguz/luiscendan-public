package com.studyhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * StudyHubApplication - Aplicación principal de Spring Boot
 * 
 * StudyHub Pro - Tu asistente personal de estudio con IA
 */
@SpringBootApplication
public class StudyHubApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(StudyHubApplication.class, args);
        
        System.out.println("\n" + "=".repeat(60));
        System.out.println("📚 StudyHub Pro Backend - INICIADO");
        System.out.println("=".repeat(60));
        System.out.println("🚀 API REST disponible en: http://localhost:8080");
        System.out.println("📖 Documentación: http://localhost:8080/api");
        System.out.println("🤖 IA con humanizador activado");
        System.out.println("=".repeat(60) + "\n");
    }
}
