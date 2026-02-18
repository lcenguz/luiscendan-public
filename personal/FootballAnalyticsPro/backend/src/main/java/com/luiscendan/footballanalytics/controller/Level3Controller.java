package com.luiscendan.footballanalytics.controller;

import com.luiscendan.footballanalytics.service.BeSoccerApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Controlador para endpoints de Nivel 3 de BeSoccer API
 * Estadísticas Especializadas e Históricos
 */
@RestController
@RequestMapping("/api/v1/level3")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class Level3Controller {

    private final BeSoccerApiService apiService;

    // ==================== ESTADÍSTICAS DE EQUIPOS ====================

    @GetMapping("/teams/{teamId}/matches/{matchId}/statistics")
    public Mono<Map<String, Object>> getTeamMatchStatistics(
            @PathVariable Integer teamId,
            @PathVariable Integer matchId) {
        log.info("GET /api/v1/level3/teams/{}/matches/{}/statistics", teamId, matchId);
        return apiService.getTeamMatchStatistics(teamId, matchId);
    }

    @GetMapping("/teams/{teamId}/seasons/{season}/statistics")
    public Mono<Map<String, Object>> getTeamSeasonStatistics(
            @PathVariable Integer teamId,
            @PathVariable Integer season) {
        log.info("GET /api/v1/level3/teams/{}/seasons/{}/statistics", teamId, season);
        return apiService.getTeamSeasonStatistics(teamId, season);
    }

    @GetMapping("/teams/{id}/advanced-statistics")
    public Mono<Map<String, Object>> getTeamAdvancedStatistics(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/teams/{}/advanced-statistics", id);
        return apiService.getTeamAdvancedStatistics(id);
    }

    @GetMapping("/teams/{id}/player-history")
    public Mono<Map<String, Object>> getTeamPlayerHistory(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/teams/{}/player-history", id);
        return apiService.getTeamPlayerHistory(id);
    }

    @GetMapping("/teams/{id}/history")
    public Mono<Map<String, Object>> getTeamHistory(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/teams/{}/history", id);
        return apiService.getTeamHistory(id);
    }

    // ==================== JUGADORES AVANZADO ====================

    @GetMapping("/players/compare")
    public Mono<Map<String, Object>> comparePlayers(
            @RequestParam Integer player1,
            @RequestParam Integer player2) {
        log.info("GET /api/v1/level3/players/compare?player1={}&player2={}", player1, player2);
        return apiService.comparePlayer(player1, player2);
    }

    @GetMapping("/players/{id}/detailed")
    public Mono<Map<String, Object>> getPlayerDetailedInfo(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/players/{}/detailed", id);
        return apiService.getPlayerDetailedInfo(id);
    }

    @GetMapping("/players/{id}/injuries")
    public Mono<Map<String, Object>> getPlayerInjuries(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/players/{}/injuries", id);
        return apiService.getPlayerInjuries(id);
    }

    @GetMapping("/players/{playerId}/matches/{matchId}")
    public Mono<Map<String, Object>> getPlayerMatchDetails(
            @PathVariable Integer playerId,
            @PathVariable Integer matchId) {
        log.info("GET /api/v1/level3/players/{}/matches/{}", playerId, matchId);
        return apiService.getPlayerMatchDetails(playerId, matchId);
    }

    @GetMapping("/players/{playerId}/seasons/{season}/matches")
    public Mono<Map<String, Object>> getPlayerSeasonMatches(
            @PathVariable Integer playerId,
            @PathVariable Integer season) {
        log.info("GET /api/v1/level3/players/{}/seasons/{}/matches", playerId, season);
        return apiService.getPlayerSeasonMatches(playerId, season);
    }

    @GetMapping("/players/{id}/trophies")
    public Mono<Map<String, Object>> getPlayerTrophies(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/players/{}/trophies", id);
        return apiService.getPlayerTrophies(id);
    }

    @GetMapping("/players/{id}/seasons")
    public Mono<Map<String, Object>> getPlayerSeasons(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/players/{}/seasons", id);
        return apiService.getPlayerSeasons(id);
    }

    @GetMapping("/players/{id}/teams")
    public Mono<Map<String, Object>> getPlayerTeams(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/players/{}/teams", id);
        return apiService.getPlayerTeams(id);
    }

    @GetMapping("/players/{id}/career")
    public Mono<Map<String, Object>> getPlayerCareer(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/players/{}/career", id);
        return apiService.getPlayerCareer(id);
    }

    @GetMapping("/players/{id}/status")
    public Mono<Map<String, Object>> getPlayerStatus(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/players/{}/status", id);
        return apiService.getPlayerStatus(id);
    }

    // ==================== COMPETICIONES Y FICHAJES ====================

    @GetMapping("/competitions/{id}/transfers-detailed")
    public Mono<Map<String, Object>> getCompetitionTransfers(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/competitions/{}/transfers-detailed", id);
        return apiService.getCompetitionTransfers(id);
    }

    // ==================== PARTIDOS HISTÓRICOS ====================

    @GetMapping("/matches/{id}/historical")
    public Mono<Map<String, Object>> getHistoricalMatch(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/matches/{}/historical", id);
        return apiService.getHistoricalMatch(id);
    }

    // ==================== ENTRENADORES ====================

    @GetMapping("/coaches/{id}/career")
    public Mono<Map<String, Object>> getCoachCareer(@PathVariable Integer id) {
        log.info("GET /api/v1/level3/coaches/{}/career", id);
        return apiService.getCoachCareer(id);
    }
}
