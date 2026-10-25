export type UserRole = 'customer' | 'admin';
export type AccountStatus = 'active' | 'suspended' | 'pending';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt?: string;
}

export type ApplicationStatus = 'Pending Review' | 'Approved' | 'Rejected';
export type PaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Refunded' | 'Cancelled';
export type MembershipStatus = 'Pending Approval' | 'Active' | 'Expiring Soon' | 'Expired' | 'Suspended' | 'Cancelled';

export interface AdmissionApplication {
  applicationId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  requestedPlanId: string;
  requestedPlanName: string;
  requestedStartDate: string;
  requestedMonth: string;
  photoUrl?: string;
  isNewAdmission?: boolean;
  admissionFee?: number;
  monthlyFee?: number;
  couponCode?: string;
  discountApplied?: number;
  finalPrice: number;
  originalPrice: number;
  applicationStatus: ApplicationStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MembershipPlan {
  planId: string;
  name: string;
  description: string;
  durationMonths: number;
  basePrice: number;
  isActive: boolean;
  features?: string[];
}

export interface Membership {
  membershipId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planId: string;
  planName: string;
  photoUrl?: string;
  admissionFee?: number;
  monthlyFee?: number;
  startDate: string;
  endDate: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  amountPaid: number;
  balanceDue: number;
  membershipStatus: MembershipStatus;
  paymentStatus: PaymentStatus;
  renewalOf?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentTransaction {
  paymentId: string;
  userId: string;
  customerName: string;
  membershipId: string;
  receiptNumber: string;
  paymentDate: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'EasyPaisa' | 'JazzCash' | 'Other';
  originalAmount: number;
  discountAmount: number;
  finalAmountPayable: number;
  amountReceived: number;
  remainingBalance: number;
  status: PaymentStatus;
  referenceNumber?: string;
  internalNote?: string;
  recordedBy: string;
  createdAt: string;
}

export interface DiscountCoupon {
  discountId: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  couponCode?: string;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface SpecialOffer {
  offerId: string;
  title: string;
  description: string;
  imageUrl?: string;
  discountId?: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  isFeatured: boolean;
  badge?: string;
  createdAt: string;
}

export interface GymProgram {
  programId: string;
  name: string;
  description: string;
  category: 'Strength Training' | 'Weight Training' | 'General Fitness' | 'Personal Training' | 'Guidance';
  duration: string;
  imageUrl: string;
  isPublished: boolean;
  displayOrder: number;
}

export interface GalleryMedia {
  imageId: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  caption: string;
  category: 'Interior' | 'Equipment' | 'Workout' | 'Atmosphere';
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
}

export interface SystemNotification {
  notificationId: string;
  recipientId: string; // 'all' or specific userId
  title: string;
  message: string;
  type: 'admission' | 'payment' | 'membership' | 'announcement' | 'alert';
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  logId: string;
  actorUid: string;
  actorName: string;
  action: string;
  entityType: 'member' | 'admission' | 'payment' | 'membership' | 'discount' | 'offer' | 'content' | 'security';
  entityId: string;
  timestamp: string;
  reason?: string;
  changeSummary: string;
}

export interface SiteSettings {
  gymName: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  standardAdmissionFee: number;
  standardMonthlyFee: number;
  heroHeadline: string;
  heroSupportingText: string;
  heroMediaType?: 'image' | 'video';
  heroMediaUrl?: string;
  aboutHeading: string;
  aboutText: string;
  aboutMediaType?: 'image' | 'video';
  aboutMediaUrl?: string;
  logoUrl?: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  openingHours?: string;
}
