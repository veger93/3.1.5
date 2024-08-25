package com.example.task_314.controller;

import com.example.task_314.entities.User;
import com.example.task_314.services.UserService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("api/user")
public class UserRestController {
    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public User showUser(Principal principal) {
        User newUser = userService.loadUserByUsername(principal.getName());
        return newUser;
    }
}
