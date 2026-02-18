package com.luiscendan.footballanalytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "team_statistics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne
    @JoinColumn(name = "league_id", nullable = false)
    private League league;

    @Column(nullable = false)
    private Integer season;

    // General Statistics
    private Integer matchesPlayed;
    private Integer wins;
    private Integer draws;
    private Integer losses;
    private Integer goalsFor;
    private Integer goalsAgainst;
    private Integer goalDifference;
    private Integer points;
    private Integer position; // League position

    // Home Statistics
    private Integer homeMatchesPlayed;
    private Integer homeWins;
    private Integer homeDraws;
    private Integer homeLosses;
    private Integer homeGoalsFor;
    private Integer homeGoalsAgainst;

    // Away Statistics
    private Integer awayMatchesPlayed;
    private Integer awayWins;
    private Integer awayDraws;
    private Integer awayLosses;
    private Integer awayGoalsFor;
    private Integer awayGoalsAgainst;

    // Advanced Statistics
    private Integer totalShots;
    private Integer shotsOnTarget;
    private Integer shotsOffTarget;
    private Integer totalCorners;
    private Integer totalOffsides;
    private Integer totalFouls;
    private Integer yellowCards;
    private Integer redCards;
    private Double averagePossession; // Percentage
    private Double averagePassAccuracy; // Percentage

    // Form (last 5 matches)
    private String form; // e.g., "WWDLW"

    // Streaks
    private Integer currentWinStreak;
    private Integer currentDrawStreak;
    private Integer currentLossStreak;
    private Integer currentUnbeatenStreak;

    // Clean Sheets
    private Integer cleanSheets;
    private Integer failedToScore;

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
}
