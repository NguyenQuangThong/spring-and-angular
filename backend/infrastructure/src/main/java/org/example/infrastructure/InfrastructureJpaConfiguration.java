package org.example.infrastructure;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

// Infrastructure configuration:
// Vi main app nam o package org.example.application, Spring Data JPA khong tu biet
// phai scan repository/entity trong org.example.infrastructure. Cau hinh nay khai bao ro vung scan.
@Configuration
@EntityScan("org.example.infrastructure")
@EnableJpaRepositories("org.example.infrastructure")
public class InfrastructureJpaConfiguration {
}
