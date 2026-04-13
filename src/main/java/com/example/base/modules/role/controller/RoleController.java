package com.example.base.modules.role.controller;

import com.example.base.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@Tag(name = "Role Management", description = "Endpoints for managing roles and permissions")
public class RoleController {

    @GetMapping
    public ApiResponse<List<String>> getAllRoles() {
        return ApiResponse.success(List.of("ROLE_USER", "ROLE_ADMIN"));
    }
}
