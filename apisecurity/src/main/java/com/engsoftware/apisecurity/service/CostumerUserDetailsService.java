package com.engsoftware.apisecurity.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.engsoftware.apisecurity.models.UserModel;
import com.engsoftware.apisecurity.models.enums.AcessLevels;
import com.engsoftware.apisecurity.repositories.UserRepository;

@Service
public class CostumerUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User " + username + " not found."));
        if (user != null){
            return createUsers(user.getEmail(), user.getPassword(), user.getAcessLevels());
        }
        throw new UsernameNotFoundException("User not found with email: " + username);
    }

    private UserModel createUsers(String email, String password, AcessLevels role) {
        UserModel user = new UserModel();
        user.setEmail(email);
        user.setPassword(password);
        user.setAcessLevels(role);
        return user;
    }

}
