package org.example.application.post;

import org.example.domain.post.Post;

import java.util.List;

// Application input port / use case:
// API layer chi nen biet no can "lay danh sach post", khong can biet repository nao dang duoc dung.
public interface GetPostsUseCase {

    List<Post> getPosts();
}
