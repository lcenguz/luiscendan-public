package com.luiscendan.footballanalytics.repository;

import com.luiscendan.footballanalytics.model.MatchStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchStatisticsRepository extends JpaRepository<MatchStatistics, Long> {

    Optional<MatchStatistics> findByMatchId(Long matchId);

    boolean existsByMatchId(Long matchId);
}
