package com.codereel.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "snippets")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Snippet {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    @Column(nullable = false, length = 20)
    private String language;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    @Column(name = "share_token", unique = true, length = 64)
    private String shareToken;

    @Column(name = "author_name", length = 100)
    private String author;

    @Column(name = "user_id", length = 36)
    private String userId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
    }
}
