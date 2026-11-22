package com.mindbridge.modules.doctor;

import com.mindbridge.modules.auth.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "doctor_profiles")
public class DoctorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String qualification;

    @Column(name = "primary_specialization", nullable = false)
    private String primarySpecialization;

    @Column(name = "experience_years", nullable = false)
    private int experienceYears = 0;

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @Column(name = "consultation_fee", nullable = false)
    private BigDecimal consultationFee = BigDecimal.valueOf(1000.00);

    @Column(name = "professional_description", columnDefinition = "TEXT")
    private String professionalDescription;

    @Column(name = "consultation_modes", nullable = false)
    private String consultationModes = "VIDEO,AUDIO,IN_PERSON";

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "verified_by")
    private UUID verifiedBy;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.valueOf(5.0);

    @Column(name = "total_reviews", nullable = false)
    private int totalReviews = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public DoctorProfile() {}

    public DoctorProfile(User user, String qualification, String primarySpecialization,
                         int experienceYears, String licenseNumber, BigDecimal consultationFee,
                         String professionalDescription) {
        this.user = user;
        this.qualification = qualification;
        this.primarySpecialization = primarySpecialization;
        this.experienceYears = experienceYears;
        this.licenseNumber = licenseNumber;
        this.consultationFee = consultationFee != null ? consultationFee : BigDecimal.valueOf(1000.00);
        this.professionalDescription = professionalDescription;
        this.isVerified = false;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getPrimarySpecialization() { return primarySpecialization; }
    public void setPrimarySpecialization(String primarySpecialization) { this.primarySpecialization = primarySpecialization; }

    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public BigDecimal getConsultationFee() { return consultationFee; }
    public void setConsultationFee(BigDecimal consultationFee) { this.consultationFee = consultationFee; }

    public String getProfessionalDescription() { return professionalDescription; }
    public void setProfessionalDescription(String professionalDescription) { this.professionalDescription = professionalDescription; }

    public String getConsultationModes() { return consultationModes; }
    public void setConsultationModes(String consultationModes) { this.consultationModes = consultationModes; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }

    public UUID getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(UUID verifiedBy) { this.verifiedBy = verifiedBy; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int totalReviews) { this.totalReviews = totalReviews; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
