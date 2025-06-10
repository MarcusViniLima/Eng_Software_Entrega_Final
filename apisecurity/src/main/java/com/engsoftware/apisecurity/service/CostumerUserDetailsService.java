package com.engsoftware.apisecurity.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.engsoftware.apisecurity.models.UserModel;
import com.engsoftware.apisecurity.repositories.UserRepository;

@Service
public class CostumerUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User " + username + " not found."));

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getAcessLevels().name())
                .build();
    }

}
