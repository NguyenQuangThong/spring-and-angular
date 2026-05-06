package org.example.infrastructure.post;

import org.example.domain.post.Post;
import org.example.domain.post.PostRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Adapter:
// Noi domain port PostRepository voi cong cu that la Spring Data JPA.
// API/Domain khong can biet PostJpaEntity ton tai.
@Repository
public class PostRepositoryAdapter implements PostRepository {

    private final SpringDataPostJpaRepository jpaRepository;

    public PostRepositoryAdapter(SpringDataPostJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Post> findAll() {
        return jpaRepository.findAll()
                .stream()
                .map(this::toDomain)
                .toList();
    }

    private Post toDomain(PostJpaEntity entity) {
        return new Post(
                entity.getId(),
                entity.getTitle(),
                entity.getContent()
        );
    }
}
