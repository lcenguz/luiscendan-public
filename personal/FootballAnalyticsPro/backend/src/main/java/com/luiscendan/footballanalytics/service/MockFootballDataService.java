package com.luiscendan.footballanalytics.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Servicio con datos de prueba (MOCK) para desarrollo
 * No requiere API externa - Perfecto para GitHub
 */
@Service
@Slf4j
public class MockFootballDataService {

    /**
     * Datos mock de competiciones
     */
    public Mono<Map<String, Object>> getCompetitions() {
        log.info("Returning MOCK competitions data");

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> competitions = new ArrayList<>();

        // La Liga
        competitions.add(createCompetition(140, "La Liga", "Spain", "ES", 2024));

        // Premier League
        competitions.add(createCompetition(39, "Premier League", "England", "GB", 2024));

        // Serie A
        competitions.add(createCompetition(135, "Serie A", "Italy", "IT", 2024));

        // Bundesliga
        competitions.add(createCompetition(78, "Bundesliga", "Germany", "DE", 2024));

        // Ligue 1
        competitions.add(createCompetition(61, "Ligue 1", "France", "FR", 2024));

        // Champions League
        competitions.add(createCompetition(2, "UEFA Champions League", "Europe", "EU", 2024));

        response.put("status", "success");
        response.put("data", competitions);
        response.put("count", competitions.size());

        return Mono.just(response);
    }

    /**
     * Datos mock de partidos en vivo
     */
    public Mono<Map<String, Object>> getLiveMatches() {
        log.info("Returning MOCK live matches data");

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> matches = new ArrayList<>();

        // Partido 1: Real Madrid vs Barcelona
        matches.add(createLiveMatch(
                1001,
                "Real Madrid", "Barcelona",
                2, 1,
                "45+2", "HALFTIME",
                "La Liga"));

        // Partido 2: Manchester City vs Liverpool
        matches.add(createLiveMatch(
                1002,
                "Manchester City", "Liverpool",
                1, 1,
                "67", "LIVE",
                "Premier League"));

        response.put("status", "success");
        response.put("data", matches);
        response.put("count", matches.size());
        response.put("timestamp", LocalDateTime.now().toString());

        return Mono.just(response);
    }

    /**
     * Datos mock de partidos de hoy
     */
    public Mono<Map<String, Object>> getTodayMatches() {
        log.info("Returning MOCK today matches data");

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> matches = new ArrayList<>();

        // Partidos programados
        matches.add(createScheduledMatch(2001, "Atletico Madrid", "Sevilla", "18:00", "La Liga"));
        matches.add(createScheduledMatch(2002, "Chelsea", "Arsenal", "20:30", "Premier League"));
        matches.add(createScheduledMatch(2003, "Bayern Munich", "Borussia Dortmund", "19:30", "Bundesliga"));
        matches.add(createScheduledMatch(2004, "Inter Milan", "AC Milan", "21:00", "Serie A"));
        matches.add(createScheduledMatch(2005, "PSG", "Marseille", "20:00", "Ligue 1"));

        response.put("status", "success");
        response.put("data", matches);
        response.put("count", matches.size());
        response.put("date", LocalDateTime.now().toLocalDate().toString());

        return Mono.just(response);
    }

    /**
     * Datos mock de clasificación
     */
    public Mono<Map<String, Object>> getStandings(Integer leagueId, Integer year) {
        log.info("Returning MOCK standings for league: {}, year: {}", leagueId, year);

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> standings = new ArrayList<>();

        String leagueName = getLeagueName(leagueId);

        // Top 5 equipos
        standings.add(createStanding(1, "Real Madrid", 20, 15, 3, 2, 45, 15, 48));
        standings.add(createStanding(2, "Barcelona", 20, 14, 4, 2, 42, 18, 46));
        standings.add(createStanding(3, "Atletico Madrid", 20, 13, 5, 2, 38, 16, 44));
        standings.add(createStanding(4, "Athletic Bilbao", 20, 11, 6, 3, 32, 20, 39));
        standings.add(createStanding(5, "Real Sociedad", 20, 10, 7, 3, 30, 22, 37));

        response.put("status", "success");
        response.put("league", leagueName);
        response.put("season", year);
        response.put("data", standings);

        return Mono.just(response);
    }

    /**
     * Datos mock de información de equipo
     */
    public Mono<Map<String, Object>> getTeamInfo(Integer teamId) {
        log.info("Returning MOCK team info for: {}", teamId);

        Map<String, Object> team = new HashMap<>();
        team.put("id", teamId);
        team.put("name", "Real Madrid");
        team.put("country", "Spain");
        team.put("founded", 1902);
        team.put("stadium", "Santiago Bernabéu");
        team.put("capacity", 81044);
        team.put("city", "Madrid");
        team.put("coach", "Carlo Ancelotti");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", team);

        return Mono.just(response);
    }

    /**
     * Datos mock de plantilla
     */
    public Mono<Map<String, Object>> getTeamSquad(Integer teamId) {
        log.info("Returning MOCK squad for team: {}", teamId);

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> players = new ArrayList<>();

        // Porteros
        players.add(createPlayer(1, "Thibaut Courtois", "Goalkeeper", 31, "Belgium"));
        players.add(createPlayer(13, "Andriy Lunin", "Goalkeeper", 24, "Ukraine"));

        // Defensas
        players.add(createPlayer(2, "Dani Carvajal", "Defender", 31, "Spain"));
        players.add(createPlayer(3, "Éder Militão", "Defender", 25, "Brazil"));
        players.add(createPlayer(4, "David Alaba", "Defender", 31, "Austria"));
        players.add(createPlayer(6, "Nacho Fernández", "Defender", 33, "Spain"));

        // Centrocampistas
        players.add(createPlayer(8, "Toni Kroos", "Midfielder", 33, "Germany"));
        players.add(createPlayer(10, "Luka Modrić", "Midfielder", 38, "Croatia"));
        players.add(createPlayer(15, "Federico Valverde", "Midfielder", 25, "Uruguay"));
        players.add(createPlayer(5, "Jude Bellingham", "Midfielder", 20, "England"));

        // Delanteros
        players.add(createPlayer(9, "Karim Benzema", "Forward", 36, "France"));
        players.add(createPlayer(7, "Vinícius Júnior", "Forward", 23, "Brazil"));
        players.add(createPlayer(11, "Rodrygo", "Forward", 23, "Brazil"));

        response.put("status", "success");
        response.put("team", "Real Madrid");
        response.put("data", players);
        response.put("count", players.size());

        return Mono.just(response);
    }

    /**
     * Datos mock de estadísticas completas
     */
    public Mono<Map<String, Object>> getTeamCompleteStats(Integer teamId) {
        log.info("Returning MOCK complete stats for team: {}", teamId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("teamId", teamId);
        stats.put("teamName", "Real Madrid");
        stats.put("matchesPlayed", 20);
        stats.put("wins", 15);
        stats.put("draws", 3);
        stats.put("losses", 2);
        stats.put("goalsFor", 45);
        stats.put("goalsAgainst", 15);
        stats.put("goalDifference", 30);
        stats.put("points", 48);
        stats.put("form", "WWDWW");
        stats.put("cleanSheets", 12);
        stats.put("avgPossession", 58.5);
        stats.put("avgShotsPerGame", 15.2);
        stats.put("avgPassAccuracy", 87.3);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", stats);

        return Mono.just(response);
    }

    // ==================== Helper Methods ====================

    private Map<String, Object> createCompetition(int id, String name, String country, String code, int season) {
        Map<String, Object> comp = new HashMap<>();
        comp.put("id", id);
        comp.put("name", name);
        comp.put("country", country);
        comp.put("code", code);
        comp.put("season", season);
        comp.put("type", "League");
        return comp;
    }

    private Map<String, Object> createLiveMatch(int id, String home, String away,
            int homeGoals, int awayGoals,
            String minute, String status, String league) {
        Map<String, Object> match = new HashMap<>();
        match.put("id", id);
        match.put("homeTeam", home);
        match.put("awayTeam", away);
        match.put("homeGoals", homeGoals);
        match.put("awayGoals", awayGoals);
        match.put("minute", minute);
        match.put("status", status);
        match.put("league", league);
        return match;
    }

    private Map<String, Object> createScheduledMatch(int id, String home, String away, String time, String league) {
        Map<String, Object> match = new HashMap<>();
        match.put("id", id);
        match.put("homeTeam", home);
        match.put("awayTeam", away);
        match.put("time", time);
        match.put("status", "SCHEDULED");
        match.put("league", league);
        return match;
    }

    private Map<String, Object> createStanding(int position, String team, int played,
            int won, int drawn, int lost,
            int goalsFor, int goalsAgainst, int points) {
        Map<String, Object> standing = new HashMap<>();
        standing.put("position", position);
        standing.put("team", team);
        standing.put("played", played);
        standing.put("won", won);
        standing.put("drawn", drawn);
        standing.put("lost", lost);
        standing.put("goalsFor", goalsFor);
        standing.put("goalsAgainst", goalsAgainst);
        standing.put("goalDifference", goalsFor - goalsAgainst);
        standing.put("points", points);
        return standing;
    }

    private Map<String, Object> createPlayer(int number, String name, String position, int age, String nationality) {
        Map<String, Object> player = new HashMap<>();
        player.put("number", number);
        player.put("name", name);
        player.put("position", position);
        player.put("age", age);
        player.put("nationality", nationality);
        return player;
    }

    private String getLeagueName(Integer leagueId) {
        Map<Integer, String> leagues = Map.of(
                140, "La Liga",
                39, "Premier League",
                135, "Serie A",
                78, "Bundesliga",
                61, "Ligue 1",
                2, "Champions League");
        return leagues.getOrDefault(leagueId, "Unknown League");
    }
}
