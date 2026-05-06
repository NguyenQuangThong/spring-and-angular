package org.example.infrastructure.post;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Demo seed data:
// Khi app start va bang posts dang rong, them vai dong mau de GET /api/posts co data de xem.
@Component
class PostDataSeeder implements CommandLineRunner {

    private final SpringDataPostJpaRepository postRepository;

    PostDataSeeder(SpringDataPostJpaRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public void run(String... args) {
        if (postRepository.count() > 0) {
            return;
        }

        postRepository.save(new PostJpaEntity(
                "Hoc Angular lifecycle",
                "Lifecycle hook giup ban biet component dang duoc tao, render hay bi huy."
        ));
        postRepository.save(new PostJpaEntity(
                "Ket noi Spring Boot voi PostgreSQL",
                "Infrastructure chua JPA entity, repository adapter va database-specific code."
        ));
    }
}
