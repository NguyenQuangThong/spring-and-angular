package org.example.infrastructure.post;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Infrastructure entity:
// Class nay map voi table PostgreSQL. JPA annotation chi nen nam o infrastructure,
// de domain khong bi dinh chat vao database/framework.
@Entity
@Table(name = "posts")
@NoArgsConstructor
@Getter
public class PostJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String content;

    public PostJpaEntity(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
