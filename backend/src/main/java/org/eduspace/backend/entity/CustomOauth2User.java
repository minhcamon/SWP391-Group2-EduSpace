package org.eduspace.backend.entity;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Data
@Builder
@RequiredArgsConstructor
public class CustomOauth2User implements OAuth2User {
    private final User user;
    private final Map<String, Object> attributes;

    public static CustomOauth2User create(User user, Map<String, Object> attributes) {
        return new CustomOauth2User(user, attributes);
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getName() {
        return user.getEmail();
    }
}
