package com.mindbridge.modules.notification;

import com.mindbridge.modules.appointment.Appointment;
import com.mindbridge.modules.appointment.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class NotificationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(NotificationScheduler.class);

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    public NotificationScheduler(AppointmentRepository appointmentRepository,
                                 NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
    }

    /**
     * Runs every hour to check for upcoming appointments scheduled for tomorrow
     * and sends automated reminder notifications.
     */
    @Scheduled(cron = "0 0 * * * *")
    public void sendUpcomingAppointmentReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        logger.info("Executing scheduled appointment reminder check for date: {}", tomorrow);

        List<Appointment> allAppointments = appointmentRepository.findAll();
        for (Appointment a : allAppointments) {
            if ("CONFIRMED".equalsIgnoreCase(a.getStatus()) && tomorrow.equals(a.getAppointmentDate())) {
                notificationService.createNotification(
                        a.getPatient().getId(),
                        "Upcoming Consultation Reminder",
                        "Friendly reminder: You have an appointment tomorrow at " + a.getAppointmentTime() + " with " + a.getDoctor().getUser().getFullName() + " (" + a.getConsultationMode() + ").",
                        "APPOINTMENT_REMINDER",
                        "/appointments"
                );
            }
        }
    }
}
