package org.example.application.post;

import org.example.domain.post.Post;
import org.example.domain.post.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// Application service:
// Day la noi dieu phoi use case. Hien tai logic con don gian nen chi goi repository,
// nhung sau nay ban dat validation, permission, transaction, mapping use-case o day.
@Service
public class PostQueryService implements GetPostsUseCase {

    private final PostRepository postRepository;

    public PostQueryService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public List<Post> getPosts() {
        return postRepository.findAll();
    }
}
