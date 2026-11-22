package com.mindbridge.modules.admin.dto;

public class AdminDashboardStatsDto {
    private long totalPatients;
    private long totalDoctors;
    private long verifiedDoctors;
    private long pendingDoctors;
    private long totalAssessments;
    private long totalAppointments;
    private long completedAppointments;
    private long cancelledAppointments;

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }

    public long getVerifiedDoctors() { return verifiedDoctors; }
    public void setVerifiedDoctors(long verifiedDoctors) { this.verifiedDoctors = verifiedDoctors; }

    public long getPendingDoctors() { return pendingDoctors; }
    public void setPendingDoctors(long pendingDoctors) { this.pendingDoctors = pendingDoctors; }

    public long getTotalAssessments() { return totalAssessments; }
    public void setTotalAssessments(long totalAssessments) { this.totalAssessments = totalAssessments; }

    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }

    public long getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(long completedAppointments) { this.completedAppointments = completedAppointments; }

    public long getCancelledAppointments() { return cancelledAppointments; }
    public void setCancelledAppointments(long cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; }
}
