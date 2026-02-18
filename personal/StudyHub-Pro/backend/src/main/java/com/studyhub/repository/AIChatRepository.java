package com.studyhub.repository;

import com.studyhub.model.AIChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AIChatRepository extends JpaRepository<AIChat, Long> {
    List<AIChat> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<AIChat> findByUserIdAndSubjectOrderByCreatedAtDesc(Long userId, String subject);
    List<AIChat> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
        Long userId, LocalDateTime start, LocalDateTime end
    );
    long countByUserIdAndCreatedAtAfter(Long userId, LocalDateTime after);
}
