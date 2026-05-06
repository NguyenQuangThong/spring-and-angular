package org.example.domain.post;

// Domain model:
// Day la object nghiep vu sach, khong phu thuoc JPA, Spring hay PostgreSQL.
// Neu sau nay doi PostgreSQL sang MongoDB, domain model nay van co the giu nguyen.
public record Post(
        Long id,
        String title,
        String content
) {
}
