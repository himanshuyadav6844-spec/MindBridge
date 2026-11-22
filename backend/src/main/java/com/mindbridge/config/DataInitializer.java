package com.mindbridge.config;

import com.mindbridge.modules.auth.User;
import com.mindbridge.modules.auth.UserRepository;
import com.mindbridge.modules.auth.UserRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.bootstrap-email:admin@mindbridge.local}")
    private String adminEmail;

    @Value("${app.admin.bootstrap-name:MindBridge Administrator}")
    private String adminName;

    @Value("${app.admin.bootstrap-password:AdminSecurePassword2026!}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User(
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    adminName,
                    UserRole.ROLE_ADMIN,
                    "+91-0000000000"
            );
            userRepository.save(admin);
            logger.info("Admin bootstrap account initialized: {}", adminEmail);
        } else {
            logger.info("Admin account already present: {}", adminEmail);
        }
    }
}
