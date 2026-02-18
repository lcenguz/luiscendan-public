package com.luiscendan.footballanalytics.controller;

import com.luiscendan.footballanalytics.service.FootballApiService;
import com.luiscendan.footballanalytics.service.LiveDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class MatchController {

    private final FootballApiService footballApiService;
    private final LiveDataService liveDataService;

    /**
     * Get live matches
     */
    @GetMapping("/live")
    public Mono<Map<String, Object>> getLiveMatches() {
        log.info("GET /api/matches/live");
        return footballApiService.getLiveFixtures();
    }

    /**
     * Get matches by date
     */
    @GetMapping("/date/{date}")
    public Mono<Map<String, Object>> getMatchesByDate(@PathVariable String date) {
        log.info("GET /api/matches/date/{}", date);
        return footballApiService.getFixturesByDate(date);
    }

    /**
     * Get matches by league
     */
    @GetMapping("/league/{leagueId}/season/{season}")
    public Mono<Map<String, Object>> getMatchesByLeague(
            @PathVariable Integer leagueId,
            @PathVariable Integer season) {
        log.info("GET /api/matches/league/{}/season/{}", leagueId, season);
        return footballApiService.getFixturesByLeague(leagueId, season);
    }

    /**
     * Get match statistics
     */
    @GetMapping("/{fixtureId}/statistics")
    public Mono<Map<String, Object>> getMatchStatistics(@PathVariable Integer fixtureId) {
        log.info("GET /api/matches/{}/statistics", fixtureId);
        return footballApiService.getFixtureStatistics(fixtureId);
    }

    /**
     * Get head to head
     */
    @GetMapping("/h2h/{team1Id}/{team2Id}")
    public Mono<Map<String, Object>> getHeadToHead(
            @PathVariable Integer team1Id,
            @PathVariable Integer team2Id) {
        log.info("GET /api/matches/h2h/{}/{}", team1Id, team2Id);
        return footballApiService.getHeadToHead(team1Id, team2Id);
    }

    /**
     * Trigger live update manually
     */
    @PostMapping("/live/refresh")
    public ResponseEntity<Map<String, String>> refreshLiveMatches() {
        log.info("POST /api/matches/live/refresh");
        liveDataService.triggerLiveUpdate();
        return ResponseEntity.ok(Map.of("message", "Live matches refresh triggered"));
    }
}
