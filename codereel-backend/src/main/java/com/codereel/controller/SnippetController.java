package com.codereel.controller;

import com.codereel.model.Snippet;
import com.codereel.service.SnippetService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/snippets")
@RequiredArgsConstructor
public class SnippetController {

    private final SnippetService snippetService;

    @GetMapping
    public List<Snippet> getAll() {
        return snippetService.getAllSnippets();
    }

    @GetMapping("/{id}")
    public Snippet getById(@PathVariable String id) {
        return snippetService.getById(id);
    }

    @GetMapping("/shared/{token}")
    public Snippet getShared(@PathVariable String token) {
        return snippetService.getByShareToken(token);
    }

    @PostMapping
    public ResponseEntity<Snippet> create(@RequestBody Snippet snippet) {
        return ResponseEntity.ok(snippetService.create(snippet));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Snippet> update(@PathVariable String id, @RequestBody Snippet snippet) {
        return ResponseEntity.ok(snippetService.update(id, snippet));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        snippetService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<Map<String, String>> share(
            @PathVariable String id,
            HttpServletRequest request
    ) {
        String baseUrl = request.getScheme() + "://" + request.getServerName()
                + (request.getServerPort() != 80 && request.getServerPort() != 443
                   ? ":" + request.getServerPort() : "");
        SnippetService.ShareResult result = snippetService.share(id, baseUrl);
        return ResponseEntity.ok(Map.of(
                "shareToken", result.shareToken(),
                "shareUrl", result.shareUrl()
        ));
    }
}
