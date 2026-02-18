package com.luiscendan.footballanalytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer apiId; // ID from API-Football

    @ManyToOne
    @JoinColumn(name = "league_id", nullable = false)
    private League league;

    @Column(nullable = false)
    private Integer season;

    @Column(nullable = false)
    private LocalDateTime matchDate;

    @ManyToOne
    @JoinColumn(name = "home_team_id", nullable = false)
    private Team homeTeam;

    @ManyToOne
    @JoinColumn(name = "away_team_id", nullable = false)
    private Team awayTeam;

    private Integer homeGoals;

    private Integer awayGoals;

    private Integer homeGoalsHalftime;

    private Integer awayGoalsHalftime;

    @Enumerated(EnumType.STRING)
    private MatchStatus status; // SCHEDULED, LIVE, FINISHED, POSTPONED, CANCELLED

    private String referee;

    private String venue;

    private String venueCity;

    private Integer round; // Matchday/Round number

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum MatchStatus {
        SCHEDULED,
        LIVE,
        HALFTIME,
        FINISHED,
        POSTPONED,
        CANCELLED,
        SUSPENDED
    }
}
