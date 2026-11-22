package com.mindbridge.modules.auth;

import com.mindbridge.common.BadRequestException;
import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.auth.dto.*;
import com.mindbridge.modules.doctor.DoctorProfile;
import com.mindbridge.modules.doctor.DoctorProfileRepository;
import com.mindbridge.modules.patient.PatientProfile;
import com.mindbridge.modules.patient.PatientProfileRepository;
import com.mindbridge.security.JwtTokenProvider;
import com.mindbridge.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PatientProfileRepository patientProfileRepository,
                       DoctorProfileRepository doctorProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse registerPatient(RegisterPatientRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                UserRole.ROLE_PATIENT,
                request.getPhoneNumber()
        );
        User savedUser = userRepository.save(user);

        PatientProfile profile = new PatientProfile(
                savedUser,
                request.getDateOfBirth(),
                request.getGender(),
                request.isPrivacyPolicyConsent()
        );
        patientProfileRepository.save(profile);

        String token = tokenProvider.generateTokenForUser(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole().name()
        );

        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole().name(), true);
    }

    @Transactional
    public AuthResponse registerDoctor(RegisterDoctorRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }
        if (doctorProfileRepository.findByLicenseNumber(request.getLicenseNumber().trim()).isPresent()) {
            throw new BadRequestException("Medical license number is already registered.");
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                UserRole.ROLE_DOCTOR,
                request.getPhoneNumber()
        );
        User savedUser = userRepository.save(user);

        DoctorProfile profile = new DoctorProfile(
                savedUser,
                request.getQualification().trim(),
                request.getPrimarySpecialization().trim(),
                request.getExperienceYears(),
                request.getLicenseNumber().trim(),
                request.getConsultationFee(),
                request.getProfessionalDescription()
        );
        // Doctors start unverified until admin review
        profile.setVerified(false);
        doctorProfileRepository.save(profile);

        String token = tokenProvider.generateTokenForUser(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole().name()
        );

        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole().name(), false);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        boolean isDocVerified = true;
        if (principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DOCTOR"))) {
            isDocVerified = doctorProfileRepository.findByUserId(principal.getId())
                    .map(DoctorProfile::isVerified)
                    .orElse(false);
        }

        String role = principal.getAuthorities().iterator().next().getAuthority();
        return new AuthResponse(jwt, principal.getId(), principal.getUsername(), principal.getFullName(), role, isDocVerified);
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + request.getEmail()));

        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordExpiry(Instant.now().plus(1, ChronoUnit.HOURS));
        userRepository.save(user);

        return resetToken;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token."));

        if (user.getResetPasswordExpiry() == null || user.getResetPasswordExpiry().isBefore(Instant.now())) {
            throw new BadRequestException("Password reset token has expired.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        userRepository.save(user);
    }
}
