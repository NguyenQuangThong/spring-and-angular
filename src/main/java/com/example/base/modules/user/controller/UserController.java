package com.example.base.modules.user.controller;

import com.example.base.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Management", description = "Endpoints for managing users")
public class UserController {

    @GetMapping("/me")
    public ApiResponse<String> getCurrentUser() {
        return ApiResponse.success("Current user profile placeholder");
    }
}
