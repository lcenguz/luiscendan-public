package com.luiscendan.footballanalytics.controller;

import com.luiscendan.footballanalytics.service.MockFootballDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Controlador con datos MOCK para desarrollo
 * No requiere API externa - Perfecto para GitHub
 */
@RestController
@RequestMapping("/api/mock")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TestController {

    private final MockFootballDataService mockService;

    @GetMapping("/competitions")
    public Mono<Map<String, Object>> getCompetitions() {
        log.info("GET /api/mock/competitions");
        return mockService.getCompetitions();
    }

    @GetMapping("/live")
    public Mono<Map<String, Object>> getLiveMatches() {
        log.info("GET /api/mock/live");
        return mockService.getLiveMatches();
    }

    @GetMapping("/today")
    public Mono<Map<String, Object>> getTodayMatches() {
        log.info("GET /api/mock/today");
        return mockService.getTodayMatches();
    }

    @GetMapping("/standings/{leagueId}/{year}")
    public Mono<Map<String, Object>> getStandings(
            @PathVariable Integer leagueId,
            @PathVariable Integer year) {
        log.info("GET /api/mock/standings/{}/{}", leagueId, year);
        return mockService.getStandings(leagueId, year);
    }

    @GetMapping("/team/{id}")
    public Mono<Map<String, Object>> getTeamInfo(@PathVariable Integer id) {
        log.info("GET /api/mock/team/{}", id);
        return mockService.getTeamInfo(id);
    }

    @GetMapping("/squad/{id}")
    public Mono<Map<String, Object>> getTeamSquad(@PathVariable Integer id) {
        log.info("GET /api/mock/squad/{}", id);
        return mockService.getTeamSquad(id);
    }

    @GetMapping("/stats/{id}")
    public Mono<Map<String, Object>> getTeamStats(@PathVariable Integer id) {
        log.info("GET /api/mock/stats/{}", id);
        return mockService.getTeamCompleteStats(id);
    }
}
