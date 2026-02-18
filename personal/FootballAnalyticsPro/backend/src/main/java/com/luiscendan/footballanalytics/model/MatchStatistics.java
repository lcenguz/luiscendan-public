package com.luiscendan.footballanalytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_statistics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    // Home Team Statistics
    private Integer homeShotsOnGoal;
    private Integer homeShotsOffGoal;
    private Integer homeTotalShots;
    private Integer homeBlockedShots;
    private Integer homeShotsInsideBox;
    private Integer homeShotsOutsideBox;
    private Integer homeFouls;
    private Integer homeCornerKicks;
    private Integer homeOffsides;
    private Integer homeBallPossession; // Percentage
    private Integer homeYellowCards;
    private Integer homeRedCards;
    private Integer homeGoalkeeperSaves;
    private Integer homeTotalPasses;
    private Integer homePassesAccurate;
    private Integer homePassAccuracy; // Percentage

    // Away Team Statistics
    private Integer awayShotsOnGoal;
    private Integer awayShotsOffGoal;
    private Integer awayTotalShots;
    private Integer awayBlockedShots;
    private Integer awayShotsInsideBox;
    private Integer awayShotsOutsideBox;
    private Integer awayFouls;
    private Integer awayCornerKicks;
    private Integer awayOffsides;
    private Integer awayBallPossession; // Percentage
    private Integer awayYellowCards;
    private Integer awayRedCards;
    private Integer awayGoalkeeperSaves;
    private Integer awayTotalPasses;
    private Integer awayPassesAccurate;
    private Integer awayPassAccuracy; // Percentage

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
