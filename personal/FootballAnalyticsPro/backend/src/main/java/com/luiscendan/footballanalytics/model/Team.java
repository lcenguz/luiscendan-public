package com.luiscendan.footballanalytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer apiId; // ID from API-Football

    @Column(nullable = false)
    private String name;

    private String code; // e.g., "RMA", "BAR"

    private String country;

    private Integer founded;

    private Boolean national;

    private String logo;

    @ManyToOne
    @JoinColumn(name = "league_id")
    private League league;

    private String venue; // Stadium name

    private String venueAddress;

    private String venueCity;

    private Integer venueCapacity;

    private String venueSurface;

    private String venueImage;

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
