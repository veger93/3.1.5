package com.example.task_314.services;

import com.example.task_314.entities.Role;
import com.example.task_314.repositories.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImp implements RoleService {

    private RoleRepository roleRepository;

    public RoleServiceImp(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;

    }
    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }
}
