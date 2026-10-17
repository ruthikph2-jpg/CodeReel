package com.codereel.service;

import com.codereel.model.Snippet;
import com.codereel.repository.SnippetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SnippetService {

    private final SnippetRepository snippetRepository;
    private final SecureRandom random = new SecureRandom();

    public List<Snippet> getAllSnippets() {
        return snippetRepository.findAll();
    }

    public Snippet getById(String id) {
        return snippetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Snippet not found: " + id));
    }

    public Snippet getByShareToken(String token) {
        return snippetRepository.findByShareToken(token)
                .orElseThrow(() -> new RuntimeException("Shared snippet not found"));
    }

    public Snippet create(Snippet snippet) {
        snippet.setId(UUID.randomUUID().toString());
        return snippetRepository.save(snippet);
    }

    public Snippet update(String id, Snippet updates) {
        Snippet existing = getById(id);
        if (updates.getTitle() != null)   existing.setTitle(updates.getTitle());
        if (updates.getCode() != null)    existing.setCode(updates.getCode());
        existing.setPublic(updates.isPublic());
        return snippetRepository.save(existing);
    }

    public void delete(String id) {
        snippetRepository.deleteById(id);
    }

    public record ShareResult(String shareToken, String shareUrl) {}

    public ShareResult share(String id, String baseUrl) {
        Snippet snippet = getById(id);
        if (snippet.getShareToken() == null) {
            byte[] bytes = new byte[32];
            random.nextBytes(bytes);
            String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            snippet.setShareToken(token);
            snippet.setPublic(true);
            snippetRepository.save(snippet);
        }
        String shareUrl = baseUrl + "/share/" + snippet.getShareToken();
        return new ShareResult(snippet.getShareToken(), shareUrl);
    }
}
