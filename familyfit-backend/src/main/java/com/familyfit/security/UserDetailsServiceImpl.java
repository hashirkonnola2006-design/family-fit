package com.familyfit.security;

import com.familyfit.entity.Family;
import com.familyfit.repository.FamilyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Loads a {@link Family} by email as the Spring Security UserDetails principal.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final FamilyRepository familyRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Family family = familyRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Family not found with email: " + email));

        return User.builder()
                .username(family.getEmail())
                .password(family.getPasswordHash())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + family.getPlan().name())))
                .build();
    }
}
