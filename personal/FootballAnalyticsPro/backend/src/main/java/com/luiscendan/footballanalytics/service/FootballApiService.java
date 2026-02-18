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

@Service
@Slf4j
public class FootballApiService {

        private final WebClient webClient;

        @Value("${api.football.key}")
        private String apiKey;

        @Value("${api.football.host}")
        private String apiHost;

        public FootballApiService(@Value("${api.football.url}") String apiUrl) {
                this.webClient = WebClient.builder()
                                .baseUrl(apiUrl)
                                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                                .build();
        }

        /**
         * Get all available leagues
         */
        @Cacheable(value = "leagues", key = "#season")
        public Mono<Map<String, Object>> getLeagues(Integer season) {
                log.info("Fetching leagues for season: {}", season);
                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/leagues")
                                                .queryParam("season", season)
                                                .build())
                                .header("x-rapidapi-key", apiKey)
                                .header("x-rapidapi-host", apiHost)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                                });
        }

        /**
         * Get live fixtures
         */
        public Mono<Map<String, Object>> getLiveFixtures() {
                log.info("Fetching live fixtures");
                return webClient.get()
                                .uri("/fixtures?live=all")
                                .header("x-rapidapi-key", apiKey)
                                .header("x-rapidapi-host", apiHost)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                                });
        }

        /**
         * Get fixtures by date
         */
        @Cacheable(value = "fixtures", key = "#date")
        public Mono<Map<String, Object>> getFixturesByDate(String date) {
                log.info("Fetching fixtures for date: {}", date);
                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/fixtures")
                                                .queryParam("date", date)
                                                .build())
                                .header("x-rapidapi-key", apiKey)
                                .header("x-rapidapi-host", apiHost)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                                });
        }

        /**
         * Get fixtures by league and season
         */
        @Cacheable(value = "leagueFixtures", key = "#leagueId + '_' + #season")
        public Mono<Map<String, Object>> getFixturesByLeague(Integer leagueId, Integer season) {
                log.info("Fetching fixtures for league: {} and season: {}", leagueId, season);
                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/fixtures")
                                                .queryParam("league", leagueId)
                                                .queryParam("season", season)
                                                .build())
                                .header("x-rapidapi-key", apiKey)
                                .header("x-rapidapi-host", apiHost)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                                });
        }

        /**
         * Get fixture statistics
         */
        @Cacheable(value = "fixtureStats", key = "#fixtureId")
        public Mono<Map<String, Object>> getFixtureStatistics(Integer fixtureId) {
                log.info("Fetching statistics for fixture: {}", fixtureId);
                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/fixtures/statistics")
                                                .queryParam("fixture", fixtureId)
                                                .build())
                                .header("x-rapidapi-key", apiKey)
                                .header("x-rapidapi-host", apiHost)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                                });
        }

        /**
         * Get team statistics
         */
        @Cacheable(value = "teamStats", key = "#teamId + '_' + #leagueId + '_' + #season")
        public Mono<Map<String, Object>> getTeamStatistics(Integer teamId, Integer leagueId, Integer season) {
                log.info("Fetching statistics for team: {}, league: {}, season: {}", teamId, leagueId, season);
                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/teams/statistics")
                                                .queryParam("team", teamId)
                                                .queryParam("league", leagueId)
                                                .queryParam("season", season)
                                                .build())
                                .header("x-rapidapi-key", apiKey)
                                .header("x-rapidapi-host", apiHost)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                                });
        }

        /**
         * Get league standings
         */
        @Cacheable(value = "standings", key = "#leagueId + '_' + #season")
        public Mono<Map<String, Object>> getStandings(Integer leagueId, Integer season) {
                log.info("Fetching standings for league: {} and season: {}", leagueId, season);
                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/standings")
                                                .queryParam("league", leagueId)
                                                .queryParam("season", season)
                                                .build())
                                .header("x-rapidapi-key", apiKey)
                                .header("x-rapidapi-host", apiHost)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                                });
        }

        /**
         * Get team information
         */
        @Cacheable(value = "teams", key = "#teamId")
        public Mono<Map<String, Object>> getTeam(Integer teamId) {
                log.info("Fetching team information for: {}", teamId);
                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/teams")
                                                .queryParam("id", teamId)
                                                .build())
                                .header("x-rapidapi-key", apiKey)
                                .header("x-rapidapi-host", apiHost)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                                });
        }

        /**
         * Get teams by league
         */
        @Cacheable(value = "leagueTeams", key = "#leagueId + '_' + #season")
        public Mono<Map<String, Object>> getTeamsByLeague(Integer leagueId, Integer season) {
                log.info("Fetching teams for league: {} and season: {}", leagueId, season);
                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/teams")
                                                .queryParam("league", leagueId)
                                                .queryParam("season", season)
                                                .build())
                                .header("x-rapidapi-key", apiKey)
                                .header("x-rapidapi-host", apiHost)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                                });
        }

        /**
         * Get head to head matches
         */
        @Cacheable(value = "h2h", key = "#team1Id + '_' + #team2Id")
        public Mono<Map<String, Object>> getHeadToHead(Integer team1Id, Integer team2Id) {
                log.info("Fetching head to head for teams: {} vs {}", team1Id, team2Id);
                return webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/fixtures/headtohead")
                                                .queryParam("h2h", team1Id + "-" + team2Id)
                                                .build())
                                .header("x-rapidapi-key", apiKey)
                                .header("x-rapidapi-host", apiHost)
                                .retrieve()
                                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                                });
        }
}
