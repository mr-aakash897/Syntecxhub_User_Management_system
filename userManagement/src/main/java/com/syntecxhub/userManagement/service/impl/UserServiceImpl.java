package com.syntecxhub.userManagement.service.impl;

import com.syntecxhub.userManagement.dto.UserRequestDto;
import com.syntecxhub.userManagement.dto.UserResponseDto;
import com.syntecxhub.userManagement.exception.ResourceNotFoundException;
import com.syntecxhub.userManagement.model.User;
import com.syntecxhub.userManagement.repository.UserRepository;
import com.syntecxhub.userManagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto registerUser(UserRequestDto request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if(request.getRoles() == null || request.getRoles().isEmpty()) {
            user.setRoles(new HashSet<>(List.of("ROLE_USER")));
        } else {
            user.setRoles(request.getRoles());
        }

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public UserResponseDto getUserById(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToResponse(user);
    }

    @Override
    public UserResponseDto updateUser(String id, UserRequestDto request) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        if(request.getPassword() != null) user.setPassword(passwordEncoder.encode(request.getPassword()));

        return mapToResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(String id) {
        if(!userRepository.existsById(id)) throw new ResourceNotFoundException("User not found");
        userRepository.deleteById(id);
    }

    private UserResponseDto mapToResponse(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(user.getRoles())
                .build();
    }
}