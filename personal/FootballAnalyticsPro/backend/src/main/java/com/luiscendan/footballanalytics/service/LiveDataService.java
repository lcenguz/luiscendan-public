package com.luiscendan.footballanalytics.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class LiveDataService {

    private final FootballApiService footballApiService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Fetch and broadcast live matches every 30 seconds
     */
    @Scheduled(fixedRate = 30000) // Every 30 seconds
    public void updateLiveMatches() {
        log.info("Updating live matches...");

        footballApiService.getLiveFixtures()
                .subscribe(
                        response -> {
                            log.info("Live matches updated successfully");
                            // Broadcast to all connected clients
                            messagingTemplate.convertAndSend("/topic/live-matches", response);
                        },
                        error -> log.error("Error fetching live matches: {}", error.getMessage()));
    }

    /**
     * Manually trigger live match update
     */
    public void triggerLiveUpdate() {
        log.info("Manual trigger for live matches update");
        updateLiveMatches();
    }

    /**
     * Broadcast match statistics update
     */
    public void broadcastMatchStatistics(Integer fixtureId) {
        log.info("Broadcasting statistics for fixture: {}", fixtureId);

        footballApiService.getFixtureStatistics(fixtureId)
                .subscribe(
                        response -> {
                            messagingTemplate.convertAndSend("/topic/match-stats/" + fixtureId, response);
                        },
                        error -> log.error("Error fetching match statistics: {}", error.getMessage()));
    }

    /**
     * Broadcast standings update
     */
    public void broadcastStandings(Integer leagueId, Integer season) {
        log.info("Broadcasting standings for league: {}, season: {}", leagueId, season);

        footballApiService.getStandings(leagueId, season)
                .subscribe(
                        response -> {
                            messagingTemplate.convertAndSend("/topic/standings/" + leagueId, response);
                        },
                        error -> log.error("Error fetching standings: {}", error.getMessage()));
    }

    /**
     * Send notification to clients
     */
    public void sendNotification(String message, String type) {
        Map<String, String> notification = Map.of(
                "message", message,
                "type", type,
                "timestamp", String.valueOf(System.currentTimeMillis()));

        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }
}
