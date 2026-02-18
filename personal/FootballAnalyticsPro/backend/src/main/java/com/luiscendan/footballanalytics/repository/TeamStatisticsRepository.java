package com.luiscendan.footballanalytics.repository;

import com.luiscendan.footballanalytics.model.TeamStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamStatisticsRepository extends JpaRepository<TeamStatistics, Long> {

    Optional<TeamStatistics> findByTeamIdAndLeagueIdAndSeason(Long teamId, Long leagueId, Integer season);

    List<TeamStatistics> findByLeagueIdAndSeason(Long leagueId, Integer season);

    List<TeamStatistics> findByTeamIdAndSeason(Long teamId, Integer season);

    @Query("SELECT ts FROM TeamStatistics ts WHERE ts.league.id = :leagueId AND ts.season = :season ORDER BY ts.points DESC, ts.goalDifference DESC")
    List<TeamStatistics> findStandingsByLeagueAndSeason(@Param("leagueId") Long leagueId,
            @Param("season") Integer season);

    boolean existsByTeamIdAndLeagueIdAndSeason(Long teamId, Long leagueId, Integer season);
}
