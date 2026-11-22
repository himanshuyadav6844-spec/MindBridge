package com.mindbridge.modules.cbt;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CbtExerciseRepository extends JpaRepository<CbtExercise, UUID> {
    List<CbtExercise> findByIsActiveTrue();
    Optional<CbtExercise> findBySlug(String slug);
}
