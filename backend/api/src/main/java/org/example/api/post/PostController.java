package org.example.api.post;

import org.example.application.post.GetPostsUseCase;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// API layer:
// Controller nhan HTTP request, goi application use case, roi map data sang response DTO.
// Controller khong goi repository truc tiep de tranh tron HTTP concern voi persistence concern.
@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:4200")
public class PostController {

    private final GetPostsUseCase getPostsUseCase;

    public PostController(GetPostsUseCase getPostsUseCase) {
        this.getPostsUseCase = getPostsUseCase;
    }

    @GetMapping
    public List<PostResponse> getPosts() {
        return getPostsUseCase.getPosts()
                .stream()
                .map(PostResponse::from)
                .toList();
    }
}
