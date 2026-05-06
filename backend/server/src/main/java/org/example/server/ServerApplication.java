package org.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Server module:
// Module nay chi lam nhiem vu khoi dong app va gom cac module api/application/infrastructure lai.
// Tach server rieng giup application module khong bi phu thuoc nguoc vao api/infrastructure.
@SpringBootApplication(scanBasePackages = "org.example")
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

}
