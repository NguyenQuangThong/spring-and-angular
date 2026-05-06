package org.example.api.post;

import org.example.domain.post.Post;

// API DTO:
// Response object la format tra ve cho frontend. Tach DTO khoi domain giup minh doi API
// ma khong lam domain model bi phinh to theo nhu cau hien thi.
public record PostResponse(
        Long id,
        String title,
        String content
) {

    static PostResponse from(Post post) {
        return new PostResponse(
                post.id(),
                post.title(),
                post.content()
        );
    }
}
