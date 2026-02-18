package com.luiscendan.footballanalytics.controller;

import com.luiscendan.footballanalytics.service.FootballApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TeamController {

    private final FootballApiService footballApiService;

    /**
     * Get team information
     */
    @GetMapping("/{teamId}")
    public Mono<Map<String, Object>> getTeam(@PathVariable Integer teamId) {
        log.info("GET /api/teams/{}", teamId);
        return footballApiService.getTeam(teamId);
    }

    /**
     * Get teams by league
     */
    @GetMapping("/league/{leagueId}/season/{season}")
    public Mono<Map<String, Object>> getTeamsByLeague(
            @PathVariable Integer leagueId,
            @PathVariable Integer season) {
        log.info("GET /api/teams/league/{}/season/{}", leagueId, season);
        return footballApiService.getTeamsByLeague(leagueId, season);
    }

    /**
     * Get team statistics
     */
    @GetMapping("/{teamId}/statistics")
    public Mono<Map<String, Object>> getTeamStatistics(
            @PathVariable Integer teamId,
            @RequestParam Integer leagueId,
            @RequestParam Integer season) {
        log.info("GET /api/teams/{}/statistics?leagueId={}&season={}", teamId, leagueId, season);
        return footballApiService.getTeamStatistics(teamId, leagueId, season);
    }
}
