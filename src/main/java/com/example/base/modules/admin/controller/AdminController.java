package com.example.base.modules.admin.controller;

import com.example.base.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Functions", description = "Administrative endpoints")
public class AdminController {

    @GetMapping("/dashboard")
    public ApiResponse<String> getDashboardStats() {
        return ApiResponse.success("Admin dashboard stats placeholder");
    }
}
