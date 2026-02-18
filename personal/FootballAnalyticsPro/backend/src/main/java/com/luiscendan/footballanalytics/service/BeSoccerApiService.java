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
 * Servicio completo para integración con BeSoccer API
 * Incluye TODOS los niveles (1, 2 y 3) con todos los endpoints disponibles
 */
@Service
@Slf4j
public class BeSoccerApiService {

    private final WebClient webClient;

    public BeSoccerApiService(@Value("${api.football.url}") String apiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    // ==================== NIVEL 1: Competiciones y Partidos Básicos
    // ====================

    /**
     * 1. Competiciones - Lista de competiciones disponibles
     */
    @Cacheable(value = "competitions", key = "'all'")
    public Mono<Map<String, Object>> getCompetitions() {
        log.info("Fetching all competitions");
        return webClient.get()
                .uri("/competitions")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 2. Estado competición - Estado actual/jornada de una competición
     */
    @Cacheable(value = "competitionStatus", key = "#competitionId")
    public Mono<Map<String, Object>> getCompetitionStatus(Integer competitionId) {
        log.info("Fetching status for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/status", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 3. Detalle competición - Detalles básicos de una competición
     */
    @Cacheable(value = "competitionDetail", key = "#competitionId")
    public Mono<Map<String, Object>> getCompetitionDetail(Integer competitionId) {
        log.info("Fetching details for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 4. Competiciones por continente
     */
    @Cacheable(value = "competitionsByContinent", key = "#continent")
    public Mono<Map<String, Object>> getCompetitionsByContinent(String continent) {
        log.info("Fetching competitions for continent: {}", continent);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/competitions/continent")
                        .queryParam("continent", continent)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 5. Competiciones top - Competiciones más importantes
     */
    @Cacheable(value = "topCompetitions", key = "'top'")
    public Mono<Map<String, Object>> getTopCompetitions() {
        log.info("Fetching top competitions");
        return webClient.get()
                .uri("/competitions/top")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 6. Detalle completo competición - Detalles completos incluyendo jornadas y
     * clasificación
     */
    @Cacheable(value = "competitionFullDetail", key = "#competitionId")
    public Mono<Map<String, Object>> getCompetitionFullDetail(Integer competitionId) {
        log.info("Fetching full details for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/full", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 7. Clasificación - Tabla de clasificación de una competición
     */
    @Cacheable(value = "standings", key = "#competitionId")
    public Mono<Map<String, Object>> getStandings(Integer competitionId) {
        log.info("Fetching standings for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/standings", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 8. Detalle fases competición - Información de fases específicas
     */
    @Cacheable(value = "competitionPhases", key = "#competitionId + '_' + #phaseId")
    public Mono<Map<String, Object>> getCompetitionPhases(Integer competitionId, Integer phaseId) {
        log.info("Fetching phases for competition: {}, phase: {}", competitionId, phaseId);
        return webClient.get()
                .uri("/competitions/{id}/phases/{phaseId}", competitionId, phaseId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 9. Temporadas - Temporadas históricas disponibles
     */
    @Cacheable(value = "seasons", key = "#competitionId")
    public Mono<Map<String, Object>> getSeasons(Integer competitionId) {
        log.info("Fetching seasons for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/seasons", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 10. Equipos - Lista de equipos en una competición
     */
    @Cacheable(value = "competitionTeams", key = "#competitionId")
    public Mono<Map<String, Object>> getCompetitionTeams(Integer competitionId) {
        log.info("Fetching teams for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/teams", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 11. Partidos en directo - Marcador en tiempo real
     */
    public Mono<Map<String, Object>> getLiveMatches() {
        log.info("Fetching live matches");
        return webClient.get()
                .uri("/matches/live")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 12. Partidos del día - Todos los partidos de hoy
     */
    public Mono<Map<String, Object>> getTodayMatches() {
        log.info("Fetching today's matches");
        return webClient.get()
                .uri("/matches/today")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 13. Partidos por jornada - Partidos de una jornada específica
     */
    @Cacheable(value = "matchesByRound", key = "#competitionId + '_' + #round")
    public Mono<Map<String, Object>> getMatchesByRound(Integer competitionId, Integer round) {
        log.info("Fetching matches for competition: {}, round: {}", competitionId, round);
        return webClient.get()
                .uri("/competitions/{id}/rounds/{round}/matches", competitionId, round)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 14. Cuadro partidos - Información de brackets/eliminatorias
     */
    @Cacheable(value = "bracket", key = "#competitionId")
    public Mono<Map<String, Object>> getBracket(Integer competitionId) {
        log.info("Fetching bracket for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/bracket", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 15. Horarios modificados - Horarios recientemente actualizados
     */
    public Mono<Map<String, Object>> getModifiedSchedules() {
        log.info("Fetching modified schedules");
        return webClient.get()
                .uri("/matches/modified-schedules")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    // ==================== NIVEL 2: Equipos, Jugadores y Detalles Avanzados
    // ====================

    /**
     * 16. Fichajes - Transferencias recientes
     */
    @Cacheable(value = "transfers", key = "#competitionId")
    public Mono<Map<String, Object>> getTransfers(Integer competitionId) {
        log.info("Fetching transfers for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/transfers", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 17. Resumen de competición - Resumen estadístico
     */
    @Cacheable(value = "competitionSummary", key = "#competitionId")
    public Mono<Map<String, Object>> getCompetitionSummary(Integer competitionId) {
        log.info("Fetching summary for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/summary", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 18. Árbitros competición - Árbitros asignados
     */
    @Cacheable(value = "referees", key = "#competitionId")
    public Mono<Map<String, Object>> getReferees(Integer competitionId) {
        log.info("Fetching referees for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/referees", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 19. Quiniela / Quinigol - Información de apuestas
     */
    @Cacheable(value = "betting", key = "#competitionId")
    public Mono<Map<String, Object>> getBettingInfo(Integer competitionId) {
        log.info("Fetching betting info for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/betting", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 20. Cruces - Emparejamientos y brackets
     */
    @Cacheable(value = "pairings", key = "#competitionId")
    public Mono<Map<String, Object>> getPairings(Integer competitionId) {
        log.info("Fetching pairings for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/pairings", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 21. Detalle equipo - Perfil básico del equipo
     */
    @Cacheable(value = "teamDetail", key = "#teamId")
    public Mono<Map<String, Object>> getTeamDetail(Integer teamId) {
        log.info("Fetching details for team: {}", teamId);
        return webClient.get()
                .uri("/teams/{id}", teamId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 22. Obtener equipos - Búsqueda de equipos
     */
    @Cacheable(value = "searchTeams", key = "#query")
    public Mono<Map<String, Object>> searchTeams(String query) {
        log.info("Searching teams with query: {}", query);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/teams/search")
                        .queryParam("q", query)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 23. Competición troncal del equipo - Liga principal del equipo
     */
    @Cacheable(value = "teamMainCompetition", key = "#teamId")
    public Mono<Map<String, Object>> getTeamMainCompetition(Integer teamId) {
        log.info("Fetching main competition for team: {}", teamId);
        return webClient.get()
                .uri("/teams/{id}/main-competition", teamId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 24. Información de equipo - Estadísticas detalladas, estadio e historia
     */
    @Cacheable(value = "teamInfo", key = "#teamId")
    public Mono<Map<String, Object>> getTeamInfo(Integer teamId) {
        log.info("Fetching info for team: {}", teamId);
        return webClient.get()
                .uri("/teams/{id}/info", teamId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 25. Plantilla de equipo - Lista actual de jugadores
     */
    @Cacheable(value = "teamSquad", key = "#teamId")
    public Mono<Map<String, Object>> getTeamSquad(Integer teamId) {
        log.info("Fetching squad for team: {}", teamId);
        return webClient.get()
                .uri("/teams/{id}/squad", teamId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 26. Plantilla por competición - Plantilla filtrada por torneo
     */
    @Cacheable(value = "teamSquadByCompetition", key = "#teamId + '_' + #competitionId")
    public Mono<Map<String, Object>> getTeamSquadByCompetition(Integer teamId, Integer competitionId) {
        log.info("Fetching squad for team: {} in competition: {}", teamId, competitionId);
        return webClient.get()
                .uri("/teams/{teamId}/competitions/{competitionId}/squad", teamId, competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 27. Obtener equipo jugador - Equipo actual de un jugador
     */
    @Cacheable(value = "playerCurrentTeam", key = "#playerId")
    public Mono<Map<String, Object>> getPlayerCurrentTeam(Integer playerId) {
        log.info("Fetching current team for player: {}", playerId);
        return webClient.get()
                .uri("/players/{id}/current-team", playerId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 28. Fichajes jugador completo - Historial completo de transferencias
     */
    @Cacheable(value = "playerTransferHistory", key = "#playerId")
    public Mono<Map<String, Object>> getPlayerTransferHistory(Integer playerId) {
        log.info("Fetching transfer history for player: {}", playerId);
        return webClient.get()
                .uri("/players/{id}/transfers", playerId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 29. Estadísticas competición - Goleadores, tarjetas, etc.
     */
    @Cacheable(value = "competitionStats", key = "#competitionId")
    public Mono<Map<String, Object>> getCompetitionStatistics(Integer competitionId) {
        log.info("Fetching statistics for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/statistics", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 30. Directo de partido - Comentario evento por evento en tiempo real
     */
    public Mono<Map<String, Object>> getMatchLiveCommentary(Integer matchId) {
        log.info("Fetching live commentary for match: {}", matchId);
        return webClient.get()
                .uri("/matches/{id}/live", matchId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 31. Alineaciones de partido - Alineaciones confirmadas
     */
    @Cacheable(value = "matchLineups", key = "#matchId")
    public Mono<Map<String, Object>> getMatchLineups(Integer matchId) {
        log.info("Fetching lineups for match: {}", matchId);
        return webClient.get()
                .uri("/matches/{id}/lineups", matchId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 32. Partidos del mes - Calendario mensual completo
     */
    @Cacheable(value = "monthlyMatches", key = "#year + '_' + #month")
    public Mono<Map<String, Object>> getMonthlyMatches(Integer year, Integer month) {
        log.info("Fetching matches for year: {}, month: {}", year, month);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/matches/monthly")
                        .queryParam("year", year)
                        .queryParam("month", month)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 33. Detalle de partido - Información estática del partido
     */
    @Cacheable(value = "matchDetail", key = "#matchId")
    public Mono<Map<String, Object>> getMatchDetail(Integer matchId) {
        log.info("Fetching details for match: {}", matchId);
        return webClient.get()
                .uri("/matches/{id}", matchId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 34. Partidos por equipo - Historial completo de partidos
     */
    @Cacheable(value = "teamMatches", key = "#teamId")
    public Mono<Map<String, Object>> getTeamMatches(Integer teamId) {
        log.info("Fetching matches for team: {}", teamId);
        return webClient.get()
                .uri("/teams/{id}/matches", teamId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 35. TV y partidos - Información de transmisión
     */
    @Cacheable(value = "matchBroadcast", key = "#matchId")
    public Mono<Map<String, Object>> getMatchBroadcast(Integer matchId) {
        log.info("Fetching broadcast info for match: {}", matchId);
        return webClient.get()
                .uri("/matches/{id}/broadcast", matchId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 36. Agenda - Agenda deportiva general
     */
    public Mono<Map<String, Object>> getSportsAgenda() {
        log.info("Fetching sports agenda");
        return webClient.get()
                .uri("/agenda")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 37. Consultar partidos del día - Consulta mejorada de partidos diarios
     */
    public Mono<Map<String, Object>> getDailyMatchesEnhanced() {
        log.info("Fetching enhanced daily matches");
        return webClient.get()
                .uri("/matches/daily-enhanced")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    // ==================== NIVEL 3: Estadísticas Especializadas e Históricos
    // ====================

    /**
     * 38. Estadísticas de equipo en partido - Estadísticas granulares por partido
     */
    @Cacheable(value = "teamMatchStats", key = "#teamId + '_' + #matchId")
    public Mono<Map<String, Object>> getTeamMatchStatistics(Integer teamId, Integer matchId) {
        log.info("Fetching match statistics for team: {} in match: {}", teamId, matchId);
        return webClient.get()
                .uri("/teams/{teamId}/matches/{matchId}/statistics", teamId, matchId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 39. Estadísticas de equipo en temporadas - Métricas históricas por temporada
     */
    @Cacheable(value = "teamSeasonStats", key = "#teamId + '_' + #season")
    public Mono<Map<String, Object>> getTeamSeasonStatistics(Integer teamId, Integer season) {
        log.info("Fetching season statistics for team: {}, season: {}", teamId, season);
        return webClient.get()
                .uri("/teams/{teamId}/seasons/{season}/statistics", teamId, season)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 40. Estadísticas avanzadas de equipo - Datos analíticos profundos
     */
    @Cacheable(value = "teamAdvancedStats", key = "#teamId")
    public Mono<Map<String, Object>> getTeamAdvancedStatistics(Integer teamId) {
        log.info("Fetching advanced statistics for team: {}", teamId);
        return webClient.get()
                .uri("/teams/{id}/advanced-statistics", teamId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 41. Comparador de jugadores - Comparación analítica entre jugadores
     */
    @Cacheable(value = "playerComparison", key = "#player1Id + '_' + #player2Id")
    public Mono<Map<String, Object>> comparePlayer(Integer player1Id, Integer player2Id) {
        log.info("Comparing players: {} vs {}", player1Id, player2Id);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/players/compare")
                        .queryParam("player1", player1Id)
                        .queryParam("player2", player2Id)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 42. Histórico de jugadores en equipo - Todos los jugadores que han jugado en
     * un equipo
     */
    @Cacheable(value = "teamPlayerHistory", key = "#teamId")
    public Mono<Map<String, Object>> getTeamPlayerHistory(Integer teamId) {
        log.info("Fetching player history for team: {}", teamId);
        return webClient.get()
                .uri("/teams/{id}/player-history", teamId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 43. Información detallada jugador - Perfil profundo del jugador
     */
    @Cacheable(value = "playerDetailedInfo", key = "#playerId")
    public Mono<Map<String, Object>> getPlayerDetailedInfo(Integer playerId) {
        log.info("Fetching detailed info for player: {}", playerId);
        return webClient.get()
                .uri("/players/{id}/detailed", playerId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 44. Información lesiones jugador - Estado médico e historial de lesiones
     */
    @Cacheable(value = "playerInjuries", key = "#playerId")
    public Mono<Map<String, Object>> getPlayerInjuries(Integer playerId) {
        log.info("Fetching injury info for player: {}", playerId);
        return webClient.get()
                .uri("/players/{id}/injuries", playerId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 45. Detalle partidos jugador - Rendimiento individual en partidos específicos
     */
    @Cacheable(value = "playerMatchDetails", key = "#playerId + '_' + #matchId")
    public Mono<Map<String, Object>> getPlayerMatchDetails(Integer playerId, Integer matchId) {
        log.info("Fetching match details for player: {} in match: {}", playerId, matchId);
        return webClient.get()
                .uri("/players/{playerId}/matches/{matchId}", playerId, matchId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 46. Partidos jugador en temporada - Todas las apariciones en una temporada
     */
    @Cacheable(value = "playerSeasonMatches", key = "#playerId + '_' + #season")
    public Mono<Map<String, Object>> getPlayerSeasonMatches(Integer playerId, Integer season) {
        log.info("Fetching season matches for player: {}, season: {}", playerId, season);
        return webClient.get()
                .uri("/players/{playerId}/seasons/{season}/matches", playerId, season)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 47. Palmarés del jugador extendido - Lista detallada de trofeos y honores
     */
    @Cacheable(value = "playerTrophies", key = "#playerId")
    public Mono<Map<String, Object>> getPlayerTrophies(Integer playerId) {
        log.info("Fetching trophies for player: {}", playerId);
        return webClient.get()
                .uri("/players/{id}/trophies", playerId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 48. Temporadas del jugador - Historial de carrera por temporada
     */
    @Cacheable(value = "playerSeasons", key = "#playerId")
    public Mono<Map<String, Object>> getPlayerSeasons(Integer playerId) {
        log.info("Fetching seasons for player: {}", playerId);
        return webClient.get()
                .uri("/players/{id}/seasons", playerId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 49. Información equipos jugador - Todos los clubes representados
     */
    @Cacheable(value = "playerTeams", key = "#playerId")
    public Mono<Map<String, Object>> getPlayerTeams(Integer playerId) {
        log.info("Fetching teams for player: {}", playerId);
        return webClient.get()
                .uri("/players/{id}/teams", playerId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 50. Trayectoria del jugador - Progresión de carrera
     */
    @Cacheable(value = "playerCareer", key = "#playerId")
    public Mono<Map<String, Object>> getPlayerCareer(Integer playerId) {
        log.info("Fetching career for player: {}", playerId);
        return webClient.get()
                .uri("/players/{id}/career", playerId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 51. Estado del jugador - Elegibilidad y estado de actividad
     */
    @Cacheable(value = "playerStatus", key = "#playerId")
    public Mono<Map<String, Object>> getPlayerStatus(Integer playerId) {
        log.info("Fetching status for player: {}", playerId);
        return webClient.get()
                .uri("/players/{id}/status", playerId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 52. Fichajes por competición - Datos detallados del mercado de fichajes
     */
    @Cacheable(value = "competitionTransfers", key = "#competitionId")
    public Mono<Map<String, Object>> getCompetitionTransfers(Integer competitionId) {
        log.info("Fetching transfers for competition: {}", competitionId);
        return webClient.get()
                .uri("/competitions/{id}/transfers-detailed", competitionId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 53. Detalle de partido histórico - Datos de partidos de décadas pasadas
     */
    @Cacheable(value = "historicalMatch", key = "#matchId")
    public Mono<Map<String, Object>> getHistoricalMatch(Integer matchId) {
        log.info("Fetching historical match: {}", matchId);
        return webClient.get()
                .uri("/matches/{id}/historical", matchId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 54. Historial equipos - Registros históricos a largo plazo
     */
    @Cacheable(value = "teamHistory", key = "#teamId")
    public Mono<Map<String, Object>> getTeamHistory(Integer teamId) {
        log.info("Fetching history for team: {}", teamId);
        return webClient.get()
                .uri("/teams/{id}/history", teamId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }

    /**
     * 55. Trayectoria entrenador - Historial de carrera de entrenadores
     */
    @Cacheable(value = "coachCareer", key = "#coachId")
    public Mono<Map<String, Object>> getCoachCareer(Integer coachId) {
        log.info("Fetching career for coach: {}", coachId);
        return webClient.get()
                .uri("/coaches/{id}/career", coachId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                });
    }
}
