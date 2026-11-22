package com.mindbridge.modules.doctor;

import com.mindbridge.common.ResourceNotFoundException;
import com.mindbridge.modules.doctor.dto.DoctorDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorProfileRepository doctorProfileRepository;
    private final DoctorAvailabilityRepository availabilityRepository;

    public DoctorService(DoctorProfileRepository doctorProfileRepository,
                         DoctorAvailabilityRepository availabilityRepository) {
        this.doctorProfileRepository = doctorProfileRepository;
        this.availabilityRepository = availabilityRepository;
    }

    @Transactional(readOnly = true)
    public List<DoctorDto> searchDoctors(String specialization, String mode) {
        List<DoctorProfile> profiles = doctorProfileRepository.findByIsVerifiedTrue();
        if (specialization != null && !specialization.isBlank()) {
            String specLower = specialization.toLowerCase().trim();
            profiles = profiles.stream()
                    .filter(d -> d.getPrimarySpecialization() != null && d.getPrimarySpecialization().toLowerCase().contains(specLower))
                    .collect(Collectors.toList());
        }
        if (mode != null && !mode.isBlank()) {
            String modeLower = mode.toLowerCase().trim();
            profiles = profiles.stream()
                    .filter(d -> d.getConsultationModes() != null && d.getConsultationModes().toLowerCase().contains(modeLower))
                    .collect(Collectors.toList());
        }
        return profiles.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DoctorDto getDoctorById(UUID id) {
        DoctorProfile profile = doctorProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found with id: " + id));
        return mapToDto(profile);
    }

    @Transactional(readOnly = true)
    public DoctorDto getDoctorByUserId(UUID userId) {
        DoctorProfile profile = doctorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + userId));
        return mapToDto(profile);
    }

    @Transactional(readOnly = true)
    public List<DoctorAvailability> getDoctorAvailability(UUID doctorId) {
        return availabilityRepository.findByDoctorIdAndIsActiveTrue(doctorId);
    }

    public DoctorDto mapToDto(DoctorProfile profile) {
        DoctorDto dto = new DoctorDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setFullName(profile.getUser().getFullName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setPhoneNumber(profile.getUser().getPhoneNumber());
        dto.setQualification(profile.getQualification());
        dto.setPrimarySpecialization(profile.getPrimarySpecialization());
        dto.setExperienceYears(profile.getExperienceYears());
        dto.setLicenseNumber(profile.getLicenseNumber());
        dto.setConsultationFee(profile.getConsultationFee());
        dto.setProfessionalDescription(profile.getProfessionalDescription());
        dto.setConsultationModes(profile.getConsultationModes());
        dto.setVerified(profile.isVerified());
        dto.setProfileImageUrl(profile.getProfileImageUrl());
        dto.setRating(profile.getRating());
        dto.setTotalReviews(profile.getTotalReviews());

        List<DoctorAvailability> availabilities = availabilityRepository.findByDoctorIdAndIsActiveTrue(profile.getId());
        List<String> days = availabilities.stream().map(DoctorAvailability::getDayOfWeek).distinct().collect(Collectors.toList());
        dto.setAvailableDays(days);

        return dto;
    }
}
