package org.example.domain.post;

import java.util.List;

// Domain port:
// Domain chi noi "toi can doc Post", khong quan tam doc tu PostgreSQL, API ngoai hay file.
// Infrastructure se implement interface nay.
public interface PostRepository {

    List<Post> findAll();
}
