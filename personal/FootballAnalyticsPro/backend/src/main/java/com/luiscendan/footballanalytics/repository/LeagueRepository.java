package com.luiscendan.footballanalytics.repository;

import com.luiscendan.footballanalytics.model.League;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeagueRepository extends JpaRepository<League, Long> {

    Optional<League> findByApiId(Integer apiId);

    List<League> findBySeason(Integer season);

    List<League> findByCountry(String country);

    List<League> findBySeasonAndCountry(Integer season, String country);

    boolean existsByApiId(Integer apiId);
}
