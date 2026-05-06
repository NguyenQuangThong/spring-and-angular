package org.example.application;

import org.example.application.post.PostQueryService;
import org.example.domain.post.Post;
import org.example.domain.post.PostRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ApplicationTests {

    @Test
    void getPostsReturnsPostsFromRepository() {
        PostRepository repository = () -> List.of(new Post(1L, "Title", "Content"));
        PostQueryService service = new PostQueryService(repository);

        assertThat(service.getPosts()).hasSize(1);
    }
}
