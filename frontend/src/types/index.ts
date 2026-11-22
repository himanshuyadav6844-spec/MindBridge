export type UserRole = 'ROLE_PATIENT' | 'ROLE_DOCTOR' | 'ROLE_ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading?: boolean;
  isDoctorVerified?: boolean;
}

export interface PatientProfile {
  id: string;
  userId: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  consentGiven?: boolean;
  consentTimestamp?: string;
}

export interface DoctorReview {
  id: string;
  appointmentId?: string;
  patientName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  qualification: string;
  specialization: string;
  primarySpecialization?: string;
  yearsOfExperience: number;
  experienceYears?: number;
  licenseNumber: string;
  registrationNumber?: string;
  consultationFee: number;
  bio?: string;
  professionalDescription?: string;
  consultationModes?: string;
  verified: boolean;
  isVerified?: boolean;
  profileImageUrl?: string;
  rating: number;
  totalReviews: number;
  specializations?: string[];
  availableDays?: string[];
}

export interface DoctorAvailability {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  questionText: string;
  questionType: string;
  optionsJson: string;
  displayOrder: number;
}

export interface AssessmentResult {
  assessmentId: string;
  completedAt: string;
  totalScore: number;
  selfReportedMood: number;
  aiInferredMood: number;
  sentimentLabel: string;
  sentimentConfidence: number;
  dominantEmotion: string;
  emotionScoresJson: string;
  riskLevel: 'LOW_CONCERN' | 'MODERATE_CONCERN' | 'SIGNIFICANT_CONCERN' | 'IMMEDIATE_SAFETY_CONCERN';
  riskFactorsJson: string;
  probableConditionsJson: string;
  recommendedWorkflow: 'WORKFLOW_A' | 'WORKFLOW_B' | 'URGENT_SAFETY';
  clinicalDisclaimer: string;
  recommendationsJson: string;
  additionalNotes?: string;
}

export interface MoodEntry {
  id: string;
  moodScore: number;
  emotionLabel: string;
  stressLevel: number;
  sleepQuality: number;
  journalEntry?: string;
  entryDate: string;
  entryTime: string;
}

export interface CbtExercise {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  instructions: string;
  durationMinutes: number;
  exerciseType: string;
  promptTemplateJson?: string;
}

export interface PatientCbtProgress {
  id: string;
  exercise: CbtExercise;
  status: string;
  userResponseData: string;
  reflectionNotes?: string;
  moodBefore?: number;
  moodAfter?: number;
  completedAt?: string;
  createdAt: string;
}

export interface ChatbotConversation {
  id: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderType: 'USER' | 'BOT' | 'SYSTEM';
  messageText: string;
  containsCrisisAlert: boolean;
  suggestedCbtSlug?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization?: string;
  doctorQualification?: string;
  fee?: number;
  consultationFee?: number;
  appointmentDate: string;
  appointmentTime: string;
  consultationType?: string;
  consultationMode?: string;
  status: 'PENDING' | 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  reason?: string;
  reasonForVisit?: string;
  cancellationReason?: string;
  createdAt?: string;
}

export interface ConsultationRecord {
  id: string;
  appointmentId: string;
  diagnosis?: string;
  clinicalNotes: string;
  recommendations?: string;
  prescriptions?: string;
  followUpRecommended?: boolean;
  followUpDate?: string;
  doctorAcknowledged: boolean;
  doctorAcknowledgedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  notificationType?: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export type Notification = NotificationItem;

export interface PatientDashboardData {
  patientId: string;
  fullName: string;
  email: string;
  currentDate: string;
  latestAssessment?: AssessmentResult;
  latestMood?: MoodEntry;
  recentMoodTrends: MoodEntry[];
  completedCbtExercisesCount: number;
  upcomingAppointment?: Appointment;
  totalAssessmentsCount: number;
}

export interface AdminDashboardStats {
  totalPatients: number;
  totalDoctors: number;
  verifiedDoctors: number;
  pendingDoctors: number;
  totalAssessments: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}
