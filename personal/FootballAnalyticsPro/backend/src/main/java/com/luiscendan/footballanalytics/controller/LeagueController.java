package com.luiscendan.footballanalytics.controller;

import com.luiscendan.footballanalytics.service.FootballApiService;
import com.luiscendan.footballanalytics.service.LiveDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/leagues")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class LeagueController {

    private final FootballApiService footballApiService;
    private final LiveDataService liveDataService;

    /**
     * Get all leagues for a season
     */
    @GetMapping("/season/{season}")
    public Mono<Map<String, Object>> getLeagues(@PathVariable Integer season) {
        log.info("GET /api/leagues/season/{}", season);
        return footballApiService.getLeagues(season);
    }

    /**
     * Get league standings
     */
    @GetMapping("/{leagueId}/standings/season/{season}")
    public Mono<Map<String, Object>> getStandings(
            @PathVariable Integer leagueId,
            @PathVariable Integer season) {
        log.info("GET /api/leagues/{}/standings/season/{}", leagueId, season);
        return footballApiService.getStandings(leagueId, season);
    }

    /**
     * Trigger standings update via WebSocket
     */
    @PostMapping("/{leagueId}/standings/season/{season}/refresh")
    public Map<String, String> refreshStandings(
            @PathVariable Integer leagueId,
            @PathVariable Integer season) {
        log.info("POST /api/leagues/{}/standings/season/{}/refresh", leagueId, season);
        liveDataService.broadcastStandings(leagueId, season);
        return Map.of("message", "Standings refresh triggered");
    }
}
