package com.luiscendan.footballanalytics.repository;

import com.luiscendan.footballanalytics.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    Optional<Match> findByApiId(Integer apiId);

    List<Match> findByStatus(Match.MatchStatus status);

    List<Match> findByLeagueIdAndSeason(Long leagueId, Integer season);

    @Query("SELECT m FROM Match m WHERE m.homeTeam.id = :teamId OR m.awayTeam.id = :teamId")
    List<Match> findByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT m FROM Match m WHERE (m.homeTeam.id = :teamId OR m.awayTeam.id = :teamId) AND m.season = :season")
    List<Match> findByTeamIdAndSeason(@Param("teamId") Long teamId, @Param("season") Integer season);

    @Query("SELECT m FROM Match m WHERE m.matchDate BETWEEN :startDate AND :endDate")
    List<Match> findByMatchDateBetween(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT m FROM Match m WHERE m.status = 'LIVE' OR m.status = 'HALFTIME'")
    List<Match> findLiveMatches();

    @Query("SELECT m FROM Match m WHERE m.league.id = :leagueId AND m.season = :season ORDER BY m.matchDate DESC")
    List<Match> findRecentMatchesByLeague(@Param("leagueId") Long leagueId, @Param("season") Integer season);

    boolean existsByApiId(Integer apiId);
}
