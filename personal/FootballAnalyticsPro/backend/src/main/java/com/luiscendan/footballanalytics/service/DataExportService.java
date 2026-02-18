package com.luiscendan.footballanalytics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Servicio para exportar datos a CSV para Power BI
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DataExportService {

    private final MockFootballDataService mockService;

    /**
     * Exporta competiciones a CSV
     */
    public String exportCompetitionsToCSV(String outputPath) throws IOException {
        log.info("Exporting competitions to CSV");

        Map<String, Object> response = mockService.getCompetitions().block();
        List<Map<String, Object>> competitions = (List<Map<String, Object>>) response.get("data");

        String filename = outputPath + "/competitions_" + getTimestamp() + ".csv";

        try (FileWriter writer = new FileWriter(filename)) {
            // Header
            writer.append("ID,Name,Country,Code,Season,Type\n");

            // Data
            for (Map<String, Object> comp : competitions) {
                writer.append(String.valueOf(comp.get("id"))).append(",");
                writer.append(escapeCsv(String.valueOf(comp.get("name")))).append(",");
                writer.append(escapeCsv(String.valueOf(comp.get("country")))).append(",");
                writer.append(String.valueOf(comp.get("code"))).append(",");
                writer.append(String.valueOf(comp.get("season"))).append(",");
                writer.append(String.valueOf(comp.get("type"))).append("\n");
            }
        }

        log.info("Exported {} competitions to {}", competitions.size(), filename);
        return filename;
    }

    /**
     * Exporta partidos en vivo a CSV
     */
    public String exportLiveMatchesToCSV(String outputPath) throws IOException {
        log.info("Exporting live matches to CSV");

        Map<String, Object> response = mockService.getLiveMatches().block();
        List<Map<String, Object>> matches = (List<Map<String, Object>>) response.get("data");

        String filename = outputPath + "/live_matches_" + getTimestamp() + ".csv";

        try (FileWriter writer = new FileWriter(filename)) {
            // Header
            writer.append("ID,HomeTeam,AwayTeam,HomeGoals,AwayGoals,Minute,Status,League\n");

            // Data
            for (Map<String, Object> match : matches) {
                writer.append(String.valueOf(match.get("id"))).append(",");
                writer.append(escapeCsv(String.valueOf(match.get("homeTeam")))).append(",");
                writer.append(escapeCsv(String.valueOf(match.get("awayTeam")))).append(",");
                writer.append(String.valueOf(match.get("homeGoals"))).append(",");
                writer.append(String.valueOf(match.get("awayGoals"))).append(",");
                writer.append(String.valueOf(match.get("minute"))).append(",");
                writer.append(String.valueOf(match.get("status"))).append(",");
                writer.append(escapeCsv(String.valueOf(match.get("league")))).append("\n");
            }
        }

        log.info("Exported {} live matches to {}", matches.size(), filename);
        return filename;
    }

    /**
     * Exporta partidos de hoy a CSV
     */
    public String exportTodayMatchesToCSV(String outputPath) throws IOException {
        log.info("Exporting today's matches to CSV");

        Map<String, Object> response = mockService.getTodayMatches().block();
        List<Map<String, Object>> matches = (List<Map<String, Object>>) response.get("data");

        String filename = outputPath + "/today_matches_" + getTimestamp() + ".csv";

        try (FileWriter writer = new FileWriter(filename)) {
            // Header
            writer.append("ID,HomeTeam,AwayTeam,Time,Status,League\n");

            // Data
            for (Map<String, Object> match : matches) {
                writer.append(String.valueOf(match.get("id"))).append(",");
                writer.append(escapeCsv(String.valueOf(match.get("homeTeam")))).append(",");
                writer.append(escapeCsv(String.valueOf(match.get("awayTeam")))).append(",");
                writer.append(String.valueOf(match.get("time"))).append(",");
                writer.append(String.valueOf(match.get("status"))).append(",");
                writer.append(escapeCsv(String.valueOf(match.get("league")))).append("\n");
            }
        }

        log.info("Exported {} today's matches to {}", matches.size(), filename);
        return filename;
    }

    /**
     * Exporta clasificación a CSV
     */
    public String exportStandingsToCSV(String outputPath, Integer leagueId, Integer year) throws IOException {
        log.info("Exporting standings for league {} year {} to CSV", leagueId, year);

        Map<String, Object> response = mockService.getStandings(leagueId, year).block();
        List<Map<String, Object>> standings = (List<Map<String, Object>>) response.get("data");

        String filename = outputPath + "/standings_" + leagueId + "_" + year + "_" + getTimestamp() + ".csv";

        try (FileWriter writer = new FileWriter(filename)) {
            // Header
            writer.append("Position,Team,Played,Won,Drawn,Lost,GoalsFor,GoalsAgainst,GoalDifference,Points\n");

            // Data
            for (Map<String, Object> standing : standings) {
                writer.append(String.valueOf(standing.get("position"))).append(",");
                writer.append(escapeCsv(String.valueOf(standing.get("team")))).append(",");
                writer.append(String.valueOf(standing.get("played"))).append(",");
                writer.append(String.valueOf(standing.get("won"))).append(",");
                writer.append(String.valueOf(standing.get("drawn"))).append(",");
                writer.append(String.valueOf(standing.get("lost"))).append(",");
                writer.append(String.valueOf(standing.get("goalsFor"))).append(",");
                writer.append(String.valueOf(standing.get("goalsAgainst"))).append(",");
                writer.append(String.valueOf(standing.get("goalDifference"))).append(",");
                writer.append(String.valueOf(standing.get("points"))).append("\n");
            }
        }

        log.info("Exported {} standings to {}", standings.size(), filename);
        return filename;
    }

    /**
     * Exporta plantilla de equipo a CSV
     */
    public String exportTeamSquadToCSV(String outputPath, Integer teamId) throws IOException {
        log.info("Exporting squad for team {} to CSV", teamId);

        Map<String, Object> response = mockService.getTeamSquad(teamId).block();
        List<Map<String, Object>> players = (List<Map<String, Object>>) response.get("data");

        String filename = outputPath + "/squad_" + teamId + "_" + getTimestamp() + ".csv";

        try (FileWriter writer = new FileWriter(filename)) {
            // Header
            writer.append("Number,Name,Position,Age,Nationality\n");

            // Data
            for (Map<String, Object> player : players) {
                writer.append(String.valueOf(player.get("number"))).append(",");
                writer.append(escapeCsv(String.valueOf(player.get("name")))).append(",");
                writer.append(String.valueOf(player.get("position"))).append(",");
                writer.append(String.valueOf(player.get("age"))).append(",");
                writer.append(escapeCsv(String.valueOf(player.get("nationality")))).append("\n");
            }
        }

        log.info("Exported {} players to {}", players.size(), filename);
        return filename;
    }

    /**
     * Exporta estadísticas de equipo a CSV
     */
    public String exportTeamStatsToCSV(String outputPath, Integer teamId) throws IOException {
        log.info("Exporting stats for team {} to CSV", teamId);

        Map<String, Object> response = mockService.getTeamCompleteStats(teamId).block();
        Map<String, Object> stats = (Map<String, Object>) response.get("data");

        String filename = outputPath + "/team_stats_" + teamId + "_" + getTimestamp() + ".csv";

        try (FileWriter writer = new FileWriter(filename)) {
            // Header
            writer.append("Metric,Value\n");

            // Data
            for (Map.Entry<String, Object> entry : stats.entrySet()) {
                writer.append(escapeCsv(entry.getKey())).append(",");
                writer.append(String.valueOf(entry.getValue())).append("\n");
            }
        }

        log.info("Exported team stats to {}", filename);
        return filename;
    }

    /**
     * Exporta TODOS los datos a CSV
     */
    public Map<String, String> exportAllDataToCSV(String outputPath) throws IOException {
        log.info("Exporting ALL data to CSV");

        Map<String, String> exportedFiles = new HashMap<>();

        exportedFiles.put("competitions", exportCompetitionsToCSV(outputPath));
        exportedFiles.put("liveMatches", exportLiveMatchesToCSV(outputPath));
        exportedFiles.put("todayMatches", exportTodayMatchesToCSV(outputPath));
        exportedFiles.put("standings", exportStandingsToCSV(outputPath, 140, 2024));
        exportedFiles.put("squad", exportTeamSquadToCSV(outputPath, 486));
        exportedFiles.put("stats", exportTeamStatsToCSV(outputPath, 486));

        log.info("Exported {} files", exportedFiles.size());
        return exportedFiles;
    }

    // Helper methods

    private String getTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
    }

    private String escapeCsv(String value) {
        if (value == null)
            return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
