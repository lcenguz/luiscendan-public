package com.luiscendan.footballanalytics.controller;

import com.luiscendan.footballanalytics.service.BeSoccerApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Controlador para endpoints de Nivel 2 de BeSoccer API
 * Equipos, Jugadores y Detalles Avanzados
 */
@RestController
@RequestMapping("/api/v1/level2")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class Level2Controller {

    private final BeSoccerApiService apiService;

    // ==================== COMPETICIONES AVANZADAS ====================

    @GetMapping("/competitions/{id}/transfers")
    public Mono<Map<String, Object>> getTransfers(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/competitions/{}/transfers", id);
        return apiService.getTransfers(id);
    }

    @GetMapping("/competitions/{id}/summary")
    public Mono<Map<String, Object>> getCompetitionSummary(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/competitions/{}/summary", id);
        return apiService.getCompetitionSummary(id);
    }

    @GetMapping("/competitions/{id}/referees")
    public Mono<Map<String, Object>> getReferees(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/competitions/{}/referees", id);
        return apiService.getReferees(id);
    }

    @GetMapping("/competitions/{id}/betting")
    public Mono<Map<String, Object>> getBettingInfo(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/competitions/{}/betting", id);
        return apiService.getBettingInfo(id);
    }

    @GetMapping("/competitions/{id}/pairings")
    public Mono<Map<String, Object>> getPairings(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/competitions/{}/pairings", id);
        return apiService.getPairings(id);
    }

    @GetMapping("/competitions/{id}/statistics")
    public Mono<Map<String, Object>> getCompetitionStatistics(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/competitions/{}/statistics", id);
        return apiService.getCompetitionStatistics(id);
    }

    // ==================== EQUIPOS ====================

    @GetMapping("/teams/{id}")
    public Mono<Map<String, Object>> getTeamDetail(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/teams/{}", id);
        return apiService.getTeamDetail(id);
    }

    @GetMapping("/teams/search")
    public Mono<Map<String, Object>> searchTeams(@RequestParam String q) {
        log.info("GET /api/v1/level2/teams/search?q={}", q);
        return apiService.searchTeams(q);
    }

    @GetMapping("/teams/{id}/main-competition")
    public Mono<Map<String, Object>> getTeamMainCompetition(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/teams/{}/main-competition", id);
        return apiService.getTeamMainCompetition(id);
    }

    @GetMapping("/teams/{id}/info")
    public Mono<Map<String, Object>> getTeamInfo(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/teams/{}/info", id);
        return apiService.getTeamInfo(id);
    }

    @GetMapping("/teams/{id}/squad")
    public Mono<Map<String, Object>> getTeamSquad(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/teams/{}/squad", id);
        return apiService.getTeamSquad(id);
    }

    @GetMapping("/teams/{teamId}/competitions/{competitionId}/squad")
    public Mono<Map<String, Object>> getTeamSquadByCompetition(
            @PathVariable Integer teamId,
            @PathVariable Integer competitionId) {
        log.info("GET /api/v1/level2/teams/{}/competitions/{}/squad", teamId, competitionId);
        return apiService.getTeamSquadByCompetition(teamId, competitionId);
    }

    @GetMapping("/teams/{id}/matches")
    public Mono<Map<String, Object>> getTeamMatches(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/teams/{}/matches", id);
        return apiService.getTeamMatches(id);
    }

    // ==================== JUGADORES ====================

    @GetMapping("/players/{id}/current-team")
    public Mono<Map<String, Object>> getPlayerCurrentTeam(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/players/{}/current-team", id);
        return apiService.getPlayerCurrentTeam(id);
    }

    @GetMapping("/players/{id}/transfers")
    public Mono<Map<String, Object>> getPlayerTransferHistory(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/players/{}/transfers", id);
        return apiService.getPlayerTransferHistory(id);
    }

    // ==================== PARTIDOS AVANZADOS ====================

    @GetMapping("/matches/{id}/live")
    public Mono<Map<String, Object>> getMatchLiveCommentary(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/matches/{}/live", id);
        return apiService.getMatchLiveCommentary(id);
    }

    @GetMapping("/matches/{id}/lineups")
    public Mono<Map<String, Object>> getMatchLineups(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/matches/{}/lineups", id);
        return apiService.getMatchLineups(id);
    }

    @GetMapping("/matches/monthly")
    public Mono<Map<String, Object>> getMonthlyMatches(
            @RequestParam Integer year,
            @RequestParam Integer month) {
        log.info("GET /api/v1/level2/matches/monthly?year={}&month={}", year, month);
        return apiService.getMonthlyMatches(year, month);
    }

    @GetMapping("/matches/{id}")
    public Mono<Map<String, Object>> getMatchDetail(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/matches/{}", id);
        return apiService.getMatchDetail(id);
    }

    @GetMapping("/matches/{id}/broadcast")
    public Mono<Map<String, Object>> getMatchBroadcast(@PathVariable Integer id) {
        log.info("GET /api/v1/level2/matches/{}/broadcast", id);
        return apiService.getMatchBroadcast(id);
    }

    @GetMapping("/matches/daily-enhanced")
    public Mono<Map<String, Object>> getDailyMatchesEnhanced() {
        log.info("GET /api/v1/level2/matches/daily-enhanced");
        return apiService.getDailyMatchesEnhanced();
    }

    // ==================== OTROS ====================

    @GetMapping("/agenda")
    public Mono<Map<String, Object>> getSportsAgenda() {
        log.info("GET /api/v1/level2/agenda");
        return apiService.getSportsAgenda();
    }
}
