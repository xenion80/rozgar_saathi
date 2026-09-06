package com.general_auth.user.controller;

import com.general_auth.common.response.ApiResponse;
import com.general_auth.user.dto.request.ModifyUserDetailRequest;
import com.general_auth.user.dto.response.UserResponse;
import com.general_auth.user.entity.User;
import com.general_auth.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")@RequiredArgsConstructor
public class UserController {
    private final ModelMapper modelMapper;
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me(Authentication authentication){
        User user=(User) authentication.getPrincipal();
        UserResponse response=modelMapper.map(user,UserResponse.class);
        return ResponseEntity.ok(
                ApiResponse.success("User information",response)
        );
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> modifyMe(Authentication authentication,@RequestBody ModifyUserDetailRequest request){
        UserResponse response=userService.modify(authentication,request);
        return ResponseEntity.ok(
                ApiResponse.success("User details modified ",response)
        );
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<String>> deleteMe(Authentication authentication){
        userService.deleteUser(authentication);
        return ResponseEntity.ok(
                ApiResponse.success("The user has been deleted",null)
        );
    }
}
