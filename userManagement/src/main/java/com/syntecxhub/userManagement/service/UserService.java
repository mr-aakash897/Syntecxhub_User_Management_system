package com.syntecxhub.userManagement.service;

import com.syntecxhub.userManagement.dto.UserRequestDto;
import com.syntecxhub.userManagement.dto.UserResponseDto;
import java.util.List;

public interface UserService {
    UserResponseDto registerUser(UserRequestDto request);
    List<UserResponseDto> getAllUsers();
    UserResponseDto getUserById(String id);
    UserResponseDto updateUser(String id, UserRequestDto request);
    void deleteUser(String id);
}