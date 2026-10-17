package com.codereel.repository;

import com.codereel.model.Snippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SnippetRepository extends JpaRepository<Snippet, String> {
    Optional<Snippet> findByShareToken(String shareToken);
}
