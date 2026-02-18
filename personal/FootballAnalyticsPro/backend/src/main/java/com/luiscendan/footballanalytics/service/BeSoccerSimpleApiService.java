package com.luiscendan.footballanalytics.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Servicio simplificado para BeSoccer API
 * Usa la estructura correcta: ?req={endpoint}&format=json&{params}
 */
@Service
@Slf4j
public class BeSoccerSimpleApiService {

    private final WebClient webClient;

    public BeSoccerSimpleApiService(@Value("${api.football.url}") String apiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    // ==================== NIVEL 1: Endpoints Principales ====================

    /**
     * 1. Competiciones - Lista de todas las competiciones
     */
    @Cacheable(value = "competitions", key = "'all'")
    public Mono<Map<String, Object>> getCompetitions() {
        log.info("Fetching all competitions");
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("req", "categories")
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 2. Partidos en vivo
     */
    public Mono<Map<String, Object>> getLiveMatches() {
        log.info("Fetching live matches");
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("req", "live_matches")
                        .queryParam("format", "json")
                        .queryParam("tz", "Europe/Madrid")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 3. Partidos de hoy
     */
    public Mono<Map<String, Object>> getTodayMatches() {
        log.info("Fetching today's matches");
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("req", "today_matches")
                        .queryParam("format", "json")
                        .queryParam("tz", "Europe/Madrid")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 4. Clasificación de una liga
     */
    @Cacheable(value = "standings", key = "#leagueId + '_' + #year")
    public Mono<Map<String, Object>> getStandings(Integer leagueId, Integer year) {
        log.info("Fetching standings for league: {}, year: {}", leagueId, year);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("req", "league_table")
                        .queryParam("id", leagueId)
                        .queryParam("year", year)
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 5. Detalle de competición
     */
    @Cacheable(value = "leagueDetail", key = "#leagueId")
    public Mono<Map<String, Object>> getLeagueDetail(Integer leagueId) {
        log.info("Fetching details for league: {}", leagueId);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("req", "league_detail")
                        .queryParam("id", leagueId)
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 6. Equipos de una liga
     */
    @Cacheable(value = "leagueTeams", key = "#leagueId + '_' + #year")
    public Mono<Map<String, Object>> getLeagueTeams(Integer leagueId, Integer year) {
        log.info("Fetching teams for league: {}, year: {}", leagueId, year);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("req", "league_teams")
                        .queryParam("id", leagueId)
                        .queryParam("year", year)
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    // ==================== NIVEL 2: Equipos y Jugadores ====================

    /**
     * 7. Información de equipo
     */
    @Cacheable(value = "teamInfo", key = "#teamId")
    public Mono<Map<String, Object>> getTeamInfo(Integer teamId) {
        log.info("Fetching info for team: {}", teamId);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("req", "team_info")
                        .queryParam("id", teamId)
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 8. Plantilla de equipo
     */
    @Cacheable(value = "teamSquad", key = "#teamId")
    public Mono<Map<String, Object>> getTeamSquad(Integer teamId) {
        log.info("Fetching squad for team: {}", teamId);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("req", "team_squad")
                        .queryParam("id", teamId)
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 9. Buscar equipos
     */
    @Cacheable(value = "teamSearch", key = "#query")
    public Mono<Map<String, Object>> searchTeams(String query) {
        log.info("Searching teams with query: {}", query);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("req", "team_search")
                        .queryParam("q", query)
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    // ==================== NIVEL 3: Estadísticas Avanzadas ====================

    /**
     * 10. Estadísticas completas de equipo
     */
    @Cacheable(value = "teamCompleteStats", key = "#teamId")
    public Mono<Map<String, Object>> getTeamCompleteStats(Integer teamId) {
        log.info("Fetching complete stats for team: {}", teamId);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("req", "team_complete_stats")
                        .queryParam("id", teamId)
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }
}
