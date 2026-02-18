package com.studyhub.repository;

import com.studyhub.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Note> findByUserIdAndSubjectOrderByCreatedAtDesc(Long userId, String subject);
    List<Note> findByUserIdAndTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
        Long userId, String titleKeyword, String contentKeyword
    );
}
