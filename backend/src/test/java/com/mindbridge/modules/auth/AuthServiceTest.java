package com.mindbridge.modules.auth;

import com.mindbridge.modules.auth.dto.AuthResponse;
import com.mindbridge.modules.auth.dto.LoginRequest;
import com.mindbridge.modules.auth.dto.RegisterPatientRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testPatientRegistrationAndLogin() {
        String testEmail = "test.patient." + UUID.randomUUID() + "@example.com";
        RegisterPatientRequest reg = new RegisterPatientRequest();
        reg.setFullName("Aarav Patel");
        reg.setEmail(testEmail);
        reg.setPassword("Password123!");
        reg.setDateOfBirth(LocalDate.of(1995, 5, 20));
        reg.setGender("Male");
        reg.setPhoneNumber("+91-9876500001");
        reg.setPrivacyPolicyConsent(true);

        AuthResponse regResponse = authService.registerPatient(reg);
        assertNotNull(regResponse);
        assertNotNull(regResponse.getToken());
        assertEquals("ROLE_PATIENT", regResponse.getRole());
        assertEquals(testEmail, regResponse.getEmail());

        // Test Login
        LoginRequest login = new LoginRequest();
        login.setEmail(testEmail);
        login.setPassword("Password123!");
        AuthResponse loginResponse = authService.login(login);
        assertNotNull(loginResponse);
        assertNotNull(loginResponse.getToken());
        assertEquals(testEmail, loginResponse.getEmail());
    }
}
