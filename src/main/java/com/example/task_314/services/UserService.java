package com.example.task_314.services;

import com.example.task_314.entities.User;

import java.util.List;

public interface UserService {

    void save(User user);
    void deleteUser(Long id);
    List<User> getAllUsers();
    User loadUserByUsername(String username);
    User getUserById(Long id);
}
