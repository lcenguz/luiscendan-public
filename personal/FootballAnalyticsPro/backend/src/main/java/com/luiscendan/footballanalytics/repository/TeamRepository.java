package com.luiscendan.footballanalytics.repository;

import com.luiscendan.footballanalytics.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByApiId(Integer apiId);

    List<Team> findByLeagueId(Long leagueId);

    List<Team> findByCountry(String country);

    Optional<Team> findByName(String name);

    boolean existsByApiId(Integer apiId);
}
