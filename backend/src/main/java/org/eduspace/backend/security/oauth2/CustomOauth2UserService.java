package org.eduspace.backend.security.oauth2;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.AuthProvider;
import org.eduspace.backend.enums.Role;
import org.eduspace.backend.enums.UserStatus;
import org.eduspace.backend.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOauth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());

        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            throw new IllegalArgumentException("Email not found from OAuth2 provider");
        }

        String name = oAuth2User.getAttribute("name");
        String pUrl = oAuth2User.getAttribute("picture");

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            user = User.builder()
                    .email(email)
                    .fullName(name != null ? name : "Unknown")
                    // Generating a dummy username based on email prefix
                    .username(email.split("@")[0] + "_" + provider.name())
                    .password("")
                    .avatarUrl(pUrl)
                    .role(Role.LEARNER)
                    .status(UserStatus.ACTIVE)
                    .authProvider(provider)
                    .createdAt(LocalDateTime.now())
                    .build();
            user = userRepository.save(user);
        }

        return CustomOauth2User.create(user, oAuth2User.getAttributes());
    }
}
