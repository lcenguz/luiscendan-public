package com.studyhub.repository;

import com.studyhub.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserIdOrderByDueDateAsc(Long userId);
    List<Task> findByUserIdAndCompletedOrderByDueDateAsc(Long userId, boolean completed);
    List<Task> findByUserIdAndPriorityOrderByDueDateAsc(Long userId, Task.Priority priority);
    List<Task> findByUserIdAndDueDateBetweenOrderByDueDateAsc(
        Long userId, LocalDateTime start, LocalDateTime end
    );
}
