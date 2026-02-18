package com.luiscendan.footballanalytics.controller;

import com.luiscendan.footballanalytics.service.DataExportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

/**
 * Controlador para exportar datos a CSV para Power BI
 */
@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ExportController {

    private final DataExportService exportService;

    // Ruta por defecto para exportar (puedes cambiarla)
    private static final String DEFAULT_EXPORT_PATH = "D:/PowerBI_Data";

    /**
     * Exporta competiciones a CSV
     */
    @GetMapping("/competitions")
    public ResponseEntity<Map<String, String>> exportCompetitions(
            @RequestParam(defaultValue = DEFAULT_EXPORT_PATH) String path) {
        try {
            String filename = exportService.exportCompetitionsToCSV(path);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Competitions exported successfully",
                    "file", filename));
        } catch (IOException e) {
            log.error("Error exporting competitions", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()));
        }
    }

    /**
     * Exporta partidos en vivo a CSV
     */
    @GetMapping("/live")
    public ResponseEntity<Map<String, String>> exportLiveMatches(
            @RequestParam(defaultValue = DEFAULT_EXPORT_PATH) String path) {
        try {
            String filename = exportService.exportLiveMatchesToCSV(path);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Live matches exported successfully",
                    "file", filename));
        } catch (IOException e) {
            log.error("Error exporting live matches", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()));
        }
    }

    /**
     * Exporta partidos de hoy a CSV
     */
    @GetMapping("/today")
    public ResponseEntity<Map<String, String>> exportTodayMatches(
            @RequestParam(defaultValue = DEFAULT_EXPORT_PATH) String path) {
        try {
            String filename = exportService.exportTodayMatchesToCSV(path);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Today's matches exported successfully",
                    "file", filename));
        } catch (IOException e) {
            log.error("Error exporting today's matches", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()));
        }
    }

    /**
     * Exporta clasificación a CSV
     */
    @GetMapping("/standings/{leagueId}/{year}")
    public ResponseEntity<Map<String, String>> exportStandings(
            @PathVariable Integer leagueId,
            @PathVariable Integer year,
            @RequestParam(defaultValue = DEFAULT_EXPORT_PATH) String path) {
        try {
            String filename = exportService.exportStandingsToCSV(path, leagueId, year);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Standings exported successfully",
                    "file", filename));
        } catch (IOException e) {
            log.error("Error exporting standings", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()));
        }
    }

    /**
     * Exporta plantilla de equipo a CSV
     */
    @GetMapping("/squad/{teamId}")
    public ResponseEntity<Map<String, String>> exportSquad(
            @PathVariable Integer teamId,
            @RequestParam(defaultValue = DEFAULT_EXPORT_PATH) String path) {
        try {
            String filename = exportService.exportTeamSquadToCSV(path, teamId);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Squad exported successfully",
                    "file", filename));
        } catch (IOException e) {
            log.error("Error exporting squad", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()));
        }
    }

    /**
     * Exporta estadísticas de equipo a CSV
     */
    @GetMapping("/stats/{teamId}")
    public ResponseEntity<Map<String, String>> exportStats(
            @PathVariable Integer teamId,
            @RequestParam(defaultValue = DEFAULT_EXPORT_PATH) String path) {
        try {
            String filename = exportService.exportTeamStatsToCSV(path, teamId);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Stats exported successfully",
                    "file", filename));
        } catch (IOException e) {
            log.error("Error exporting stats", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()));
        }
    }

    /**
     * Exporta TODOS los datos a CSV
     */
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> exportAll(
            @RequestParam(defaultValue = DEFAULT_EXPORT_PATH) String path) {
        try {
            Map<String, String> files = exportService.exportAllDataToCSV(path);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "All data exported successfully",
                    "files", files));
        } catch (IOException e) {
            log.error("Error exporting all data", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()));
        }
    }
}
