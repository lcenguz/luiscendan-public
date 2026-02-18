package com.luiscendan.footballanalytics.controller;

import com.luiscendan.footballanalytics.service.BeSoccerApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Controlador para endpoints de Nivel 1 de BeSoccer API
 * Competiciones y Partidos Básicos
 */
@RestController
@RequestMapping("/api/v1/level1")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class Level1Controller {

    private final BeSoccerApiService apiService;

    // ==================== COMPETICIONES ====================

    @GetMapping("/competitions")
    public Mono<Map<String, Object>> getCompetitions() {
        log.info("GET /api/v1/level1/competitions");
        return apiService.getCompetitions();
    }

    @GetMapping("/competitions/{id}/status")
    public Mono<Map<String, Object>> getCompetitionStatus(@PathVariable Integer id) {
        log.info("GET /api/v1/level1/competitions/{}/status", id);
        return apiService.getCompetitionStatus(id);
    }

    @GetMapping("/competitions/{id}")
    public Mono<Map<String, Object>> getCompetitionDetail(@PathVariable Integer id) {
        log.info("GET /api/v1/level1/competitions/{}", id);
        return apiService.getCompetitionDetail(id);
    }

    @GetMapping("/competitions/continent/{continent}")
    public Mono<Map<String, Object>> getCompetitionsByContinent(@PathVariable String continent) {
        log.info("GET /api/v1/level1/competitions/continent/{}", continent);
        return apiService.getCompetitionsByContinent(continent);
    }

    @GetMapping("/competitions/top")
    public Mono<Map<String, Object>> getTopCompetitions() {
        log.info("GET /api/v1/level1/competitions/top");
        return apiService.getTopCompetitions();
    }

    @GetMapping("/competitions/{id}/full")
    public Mono<Map<String, Object>> getCompetitionFullDetail(@PathVariable Integer id) {
        log.info("GET /api/v1/level1/competitions/{}/full", id);
        return apiService.getCompetitionFullDetail(id);
    }

    @GetMapping("/competitions/{id}/standings")
    public Mono<Map<String, Object>> getStandings(@PathVariable Integer id) {
        log.info("GET /api/v1/level1/competitions/{}/standings", id);
        return apiService.getStandings(id);
    }

    @GetMapping("/competitions/{id}/phases/{phaseId}")
    public Mono<Map<String, Object>> getCompetitionPhases(
            @PathVariable Integer id,
            @PathVariable Integer phaseId) {
        log.info("GET /api/v1/level1/competitions/{}/phases/{}", id, phaseId);
        return apiService.getCompetitionPhases(id, phaseId);
    }

    @GetMapping("/competitions/{id}/seasons")
    public Mono<Map<String, Object>> getSeasons(@PathVariable Integer id) {
        log.info("GET /api/v1/level1/competitions/{}/seasons", id);
        return apiService.getSeasons(id);
    }

    @GetMapping("/competitions/{id}/teams")
    public Mono<Map<String, Object>> getCompetitionTeams(@PathVariable Integer id) {
        log.info("GET /api/v1/level1/competitions/{}/teams", id);
        return apiService.getCompetitionTeams(id);
    }

    @GetMapping("/competitions/{id}/bracket")
    public Mono<Map<String, Object>> getBracket(@PathVariable Integer id) {
        log.info("GET /api/v1/level1/competitions/{}/bracket", id);
        return apiService.getBracket(id);
    }

    // ==================== PARTIDOS ====================

    @GetMapping("/matches/live")
    public Mono<Map<String, Object>> getLiveMatches() {
        log.info("GET /api/v1/level1/matches/live");
        return apiService.getLiveMatches();
    }

    @GetMapping("/matches/today")
    public Mono<Map<String, Object>> getTodayMatches() {
        log.info("GET /api/v1/level1/matches/today");
        return apiService.getTodayMatches();
    }

    @GetMapping("/competitions/{id}/rounds/{round}/matches")
    public Mono<Map<String, Object>> getMatchesByRound(
            @PathVariable Integer id,
            @PathVariable Integer round) {
        log.info("GET /api/v1/level1/competitions/{}/rounds/{}/matches", id, round);
        return apiService.getMatchesByRound(id, round);
    }

    @GetMapping("/matches/modified-schedules")
    public Mono<Map<String, Object>> getModifiedSchedules() {
        log.info("GET /api/v1/level1/matches/modified-schedules");
        return apiService.getModifiedSchedules();
    }
}
