package org.example.infrastructure.post;

import org.springframework.data.jpa.repository.JpaRepository;

// Spring Data JPA repository:
// Chi can extends JpaRepository la Spring tu sinh cac query co ban nhu findAll(), findById(), save().
interface SpringDataPostJpaRepository extends JpaRepository<PostJpaEntity, Long> {
}
