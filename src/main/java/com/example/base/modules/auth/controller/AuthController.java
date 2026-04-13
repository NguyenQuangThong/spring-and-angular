package com.example.base.modules.auth.controller;

import com.example.base.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication")
public class AuthController {

    @PostMapping("/login")
    public ApiResponse<String> login() {
        return ApiResponse.success("Login endpoint placeholder");
    }

    @PostMapping("/register")
    public ApiResponse<String> register() {
        return ApiResponse.success("Register endpoint placeholder");
    }
}
