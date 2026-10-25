import {
  SiteSettings,
  AdmissionApplication,
  Membership,
  PaymentTransaction,
  DiscountCoupon,
  SpecialOffer,
  GymProgram,
  GalleryMedia,
  SystemNotification,
  AuditLogEntry,
  MembershipPlan,
  UserProfile,
} from "./types";
import { generateCustomId, addMonthsSafely } from "./utils";

// Official initial business data
export const INITIAL_SETTINGS: SiteSettings = {
  gymName: "Safdarbad Gym Khan’a",
  tagline: "STRENGTH • DISCIPLINE • FITNESS",
  address: "City Safdarabad, Main Bazar, Fatima Center, Top Floor.",
  phone: "+92 305 9422464",
  whatsapp: "+92 305 9422464",
  email: "sfdgymkhana@gmail.com",
  standardAdmissionFee: 3000,
  standardMonthlyFee: 2500,
  heroHeadline: "BUILD YOUR STRENGTH. TRANSFORM YOURSELF.",
  heroSupportingText: "Your fitness journey starts here. Train harder, stay consistent, and become a stronger version of yourself at Safdarbad Gym Khan’a.",
  aboutHeading: "MORE THAN A GYM. YOUR FITNESS JOURNEY.",
  aboutText: "Located at the heart of Safdarabad in Fatima Center, Safdarbad Gym Khan’a provides a dedicated, energetic environment tailored for muscle building, functional strength, and overall athletic discipline. Equipped with top-grade free weights, power cages, and workout stations, we empower every member to achieve their true physical potential.",
  instagramUrl: "", // Blank until owner configures
  tiktokUrl: "",    // Blank until owner configures
  facebookUrl: "",
  openingHours: "Mon - Sat: 6:00 AM - 11:00 PM | Sunday: Closed",
};

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    planId: "PLAN-MONTHLY",
    name: "Standard Monthly Membership",
    description: "Full access to free weights, strength machines, cardio area, and locker facilities.",
    durationMonths: 1,
    basePrice: 2500,
    isActive: true,
    features: [
      "New Admission Fee: PKR 3,000 (One-Time)",
      "Monthly Membership: PKR 2,500 / Month",
      "Unlimited Gym Access (6 AM - 11 PM)",
      "Full Free Weights & Machine Access",
      "Locker & Changing Room Facilities",
      "Complimentary Fitness Guidance",
    ],
  },
  {
    planId: "PLAN-QUARTERLY",
    name: "3-Month Commitment Plan",
    description: "Ideal for committed lifters aiming for steady, measurable muscle and endurance growth.",
    durationMonths: 3,
    basePrice: 7000, // Saves 500
    isActive: true,
    features: [
      "All Monthly Membership Benefits",
      "Save PKR 500 compared to monthly",
      "Personal Workout Routine Check",
      "Priority Access during Peak Hours",
    ],
  },
];

export const INITIAL_PROGRAMS: GymProgram[] = [
  {
    programId: "PROG-1",
    name: "Strength & Powerlifting",
    description: "Focus on barbell squats, deadlifts, bench presses, and progressive overload to build raw foundational power.",
    category: "Strength Training",
    duration: "Ongoing",
    imageUrl: "/images/gym-interior-2.jpg",
    isPublished: true,
    displayOrder: 1,
  },
  {
    programId: "PROG-2",
    name: "Hypertrophy & Bodybuilding",
    description: "Targeted isolated muscle workouts using premium dumbbells, cable towers, and hammer machines.",
    category: "Weight Training",
    duration: "Ongoing",
    imageUrl: "/images/gym-workout.jpg",
    isPublished: true,
    displayOrder: 2,
  },
  {
    programId: "PROG-3",
    name: "Fat Loss & Functional Fitness",
    description: "High intensity circuit training designed to shred body fat, improve stamina, and build cardiovascular endurance.",
    category: "General Fitness",
    duration: "Ongoing",
    imageUrl: "/images/gym-equipment.jpg",
    isPublished: true,
    displayOrder: 3,
  },
  {
    programId: "PROG-4",
    name: "Personal Coaching & Guidance",
    description: "One-on-one form correction, goal tracking, and personalized exercise structuring for guaranteed progress.",
    category: "Personal Training",
    duration: "Tailored",
    imageUrl: "/images/gym-interior-4.jpg",
    isPublished: true,
    displayOrder: 4,
  },
];

export const INITIAL_GALLERY: GalleryMedia[] = [
  {
    imageId: "IMG-1",
    imageUrl: "/images/gym-interior-1.jpg",
    caption: "Spacious dumbbell and workout bench arena with ambient orange glow.",
    category: "Interior",
    displayOrder: 1,
    isFeatured: true,
    isPublished: true,
  },
  {
    imageId: "IMG-2",
    imageUrl: "/images/gym-workout.jpg",
    caption: "Heavy dumbbell curl zone designed for maximum arm focus.",
    category: "Workout",
    displayOrder: 2,
    isFeatured: true,
    isPublished: true,
  },
  {
    imageId: "IMG-3",
    imageUrl: "/images/gym-interior-2.jpg",
    caption: "Multi-functional cable crossover and power rack station.",
    category: "Equipment",
    displayOrder: 3,
    isFeatured: true,
    isPublished: true,
  },
  {
    imageId: "IMG-4",
    imageUrl: "/images/gym-equipment.jpg",
    caption: "Dumbbell rack station ranging from beginner to heavy lifting.",
    category: "Equipment",
    displayOrder: 4,
    isFeatured: true,
    isPublished: true,
  },
  {
    imageId: "IMG-5",
    imageUrl: "/images/gym-interior-3.jpg",
    caption: "Precision workout mirrors and heavy barbell platforms.",
    category: "Interior",
    displayOrder: 5,
    isFeatured: true,
    isPublished: true,
  },
  {
    imageId: "IMG-6",
    imageUrl: "/images/gym-interior-4.jpg",
    caption: "Wide floor layout ensuring complete freedom of movement during heavy sets.",
    category: "Atmosphere",
    displayOrder: 6,
    isFeatured: true,
    isPublished: true,
  },
];

export const INITIAL_DISCOUNTS: DiscountCoupon[] = [
  {
    discountId: "DISC-NEW20",
    name: "New Member Welcome",
    description: "Special 20% discount on first month admission for online applicants.",
    discountType: "percentage",
    discountValue: 20,
    couponCode: "WELCOME20",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageLimit: 100,
    usedCount: 14,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    discountId: "DISC-RAMADAN",
    name: "Seasonal PKR 500 Off",
    description: "Flat PKR 500 discount for direct seasonal enrollment.",
    discountType: "fixed",
    discountValue: 500,
    couponCode: "FIT500",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageLimit: 50,
    usedCount: 8,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

export const INITIAL_OFFERS: SpecialOffer[] = [
  {
    offerId: "OFFER-1",
    title: "New Year / Seasonal Fitness Kickoff",
    description: "Use coupon WELCOME20 to get 20% off your first month membership! Pay only PKR 2,000 instead of PKR 2,500.",
    imageUrl: "/images/gym-workout.jpg",
    discountId: "DISC-NEW20",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    isPublished: true,
    isFeatured: true,
    badge: "Most Popular",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// Seed membership and admission applications to illustrate live functionality
export const INITIAL_APPLICATIONS: AdmissionApplication[] = [
  {
    applicationId: "APP-10021",
    userId: "USR-001",
    fullName: "Muhammad Hamza",
    email: "hamza.fitness@gmail.com",
    phone: "+92 301 7894561",
    requestedPlanId: "PLAN-MONTHLY",
    requestedPlanName: "Standard Monthly Membership",
    requestedStartDate: "2026-10-25",
    requestedMonth: "October 2026",
    couponCode: "WELCOME20",
    discountApplied: 500,
    originalPrice: 2500,
    finalPrice: 2000,
    applicationStatus: "Approved",
    paymentStatus: "Paid",
    notes: "Paid in full at gym reception. Issued card #101.",
    reviewedBy: "Admin",
    reviewedAt: "2026-10-24T10:00:00Z",
    createdAt: "2026-10-24T09:15:00Z",
  },
  {
    applicationId: "APP-10022",
    userId: "USR-002",
    fullName: "Ali Raza Khan",
    email: "ali.raza.safdarabad@gmail.com",
    phone: "+92 304 5511223",
    requestedPlanId: "PLAN-MONTHLY",
    requestedPlanName: "Standard Monthly Membership",
    requestedStartDate: "2026-10-26",
    requestedMonth: "October 2026",
    originalPrice: 2500,
    finalPrice: 2500,
    applicationStatus: "Pending Review",
    paymentStatus: "Unpaid",
    notes: "Applied via website. Awaiting desk confirmation.",
    createdAt: "2026-10-24T16:20:00Z",
  },
];

export const INITIAL_MEMBERSHIPS: Membership[] = [
  {
    membershipId: "MEM-801",
    userId: "USR-001",
    customerName: "Muhammad Hamza",
    customerEmail: "hamza.fitness@gmail.com",
    customerPhone: "+92 301 7894561",
    planId: "PLAN-MONTHLY",
    planName: "Standard Monthly Membership",
    startDate: "2026-10-25",
    endDate: addMonthsSafely("2026-10-25", 1),
    originalPrice: 2500,
    discountAmount: 500,
    finalPrice: 2000,
    amountPaid: 2000,
    balanceDue: 0,
    membershipStatus: "Active",
    paymentStatus: "Paid",
    createdAt: "2026-10-24T10:00:00Z",
  },
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    paymentId: "PAY-501",
    userId: "USR-001",
    customerName: "Muhammad Hamza",
    membershipId: "MEM-801",
    receiptNumber: "RCP-2026-001",
    paymentDate: "2026-10-24",
    paymentMethod: "Cash",
    originalAmount: 2500,
    discountAmount: 500,
    finalAmountPayable: 2000,
    amountReceived: 2000,
    remainingBalance: 0,
    status: "Paid",
    referenceNumber: "CASH-REC-101",
    internalNote: "Paid cash at counter for 1 month membership.",
    recordedBy: "Administrator",
    createdAt: "2026-10-24T10:05:00Z",
  },
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    notificationId: "NOTIF-1",
    recipientId: "all",
    title: "Welcome to Safdarbad Gym Khan’a!",
    message: "Our brand new digital portal is now live. Check your admission and payment details anytime.",
    type: "announcement",
    isRead: false,
    createdAt: "2026-10-24T18:00:00Z",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    logId: "LOG-001",
    actorUid: "admin-system",
    actorName: "System Initialization",
    action: "SYSTEM_BOOT",
    entityType: "security",
    entityId: "SYS",
    timestamp: "2026-10-24T18:00:00Z",
    reason: "Initial setup of Safdarbad Gym Khan’a platform.",
    changeSummary: "Initialized database tables, standard fee PKR 2,500, and media gallery.",
  },
];

// In-Memory / LocalStorage Layer for instantaneous client responsiveness
const STORAGE_KEYS = {
  SETTINGS: "sgk_site_settings",
  APPLICATIONS: "sgk_applications",
  MEMBERSHIPS: "sgk_memberships",
  PAYMENTS: "sgk_payments",
  DISCOUNTS: "sgk_discounts",
  OFFERS: "sgk_offers",
  PROGRAMS: "sgk_programs",
  GALLERY: "sgk_gallery",
  NOTIFICATIONS: "sgk_notifications",
  AUDIT_LOGS: "sgk_audit_logs",
};

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Failed to persist to localStorage", err);
  }
}

export const GymStore = {
  getSettings(): SiteSettings {
    return getItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  saveSettings(settings: SiteSettings, actor: string = "Admin"): void {
    setItem(STORAGE_KEYS.SETTINGS, settings);
    GymStore.logAction(actor, "UPDATE_SETTINGS", "content", "siteSettings", "Updated gym information or monthly fee", `Monthly fee set to PKR ${settings.standardMonthlyFee}`);
  },

  getApplications(): AdmissionApplication[] {
    return getItem(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },
  submitApplication(app: Omit<AdmissionApplication, "applicationId" | "applicationStatus" | "paymentStatus" | "createdAt">): AdmissionApplication {
    const apps = GymStore.getApplications();
    const newApp: AdmissionApplication = {
      ...app,
      applicationId: generateCustomId("APP"),
      applicationStatus: "Pending Review",
      paymentStatus: "Unpaid",
      createdAt: new Date().toISOString(),
    };
    apps.unshift(newApp);
    setItem(STORAGE_KEYS.APPLICATIONS, apps);
    GymStore.logAction(app.fullName, "SUBMIT_APPLICATION", "admission", newApp.applicationId, "New admission submitted online", `Requested ${newApp.requestedPlanName}`);
    GymStore.createNotification("all", "New Admission Application", `${app.fullName} has submitted an admission application (#${newApp.applicationId}).`, "admission");
    return newApp;
  },
  updateApplication(appId: string, updates: Partial<AdmissionApplication>, actor: string = "Admin"): void {
    const apps = GymStore.getApplications();
    const idx = apps.findIndex((a) => a.applicationId === appId);
    if (idx !== -1) {
      apps[idx] = { ...apps[idx], ...updates, updatedAt: new Date().toISOString() };
      setItem(STORAGE_KEYS.APPLICATIONS, apps);
      GymStore.logAction(actor, "UPDATE_APPLICATION", "admission", appId, "Application status modified", `Status: ${updates.applicationStatus || "modified"}`);
    }
  },

  getMemberships(): Membership[] {
    return getItem(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  },
  createMembership(mem: Omit<Membership, "membershipId" | "createdAt">, actor: string = "Admin"): Membership {
    const mems = GymStore.getMemberships();
    const newMem: Membership = {
      ...mem,
      membershipId: generateCustomId("MEM"),
      createdAt: new Date().toISOString(),
    };
    mems.unshift(newMem);
    setItem(STORAGE_KEYS.MEMBERSHIPS, mems);
    GymStore.logAction(actor, "ACTIVATE_MEMBERSHIP", "membership", newMem.membershipId, "Membership activated", `Member: ${newMem.customerName}, valid until ${newMem.endDate}`);
    return newMem;
  },
  updateMembership(memId: string, updates: Partial<Membership>, actor: string = "Admin"): void {
    const mems = GymStore.getMemberships();
    const idx = mems.findIndex((m) => m.membershipId === memId);
    if (idx !== -1) {
      mems[idx] = { ...mems[idx], ...updates, updatedAt: new Date().toISOString() };
      setItem(STORAGE_KEYS.MEMBERSHIPS, mems);
      GymStore.logAction(actor, "UPDATE_MEMBERSHIP", "membership", memId, "Membership details modified", JSON.stringify(updates));
    }
  },
  deleteMembership(memId: string, actor: string = "Admin"): void {
    const mems = GymStore.getMemberships();
    const member = mems.find((m) => m.membershipId === memId);
    const updated = mems.filter((m) => m.membershipId !== memId);
    setItem(STORAGE_KEYS.MEMBERSHIPS, updated);
    GymStore.logAction(
      actor,
      "DELETE_MEMBER",
      "membership",
      memId,
      "Member permanently removed from admin panel",
      member ? `${member.customerName} (${member.customerPhone})` : memId
    );
    GymStore.createNotification(
      "all",
      "Member Removed",
      `${member?.customerName || "Member"} (#${memId}) was permanently removed by ${actor}.`,
      "membership"
    );
  },
  deleteApplication(appId: string, actor: string = "Admin"): void {
    const apps = GymStore.getApplications();
    const app = apps.find((a) => a.applicationId === appId);
    const updated = apps.filter((a) => a.applicationId !== appId);
    setItem(STORAGE_KEYS.APPLICATIONS, updated);
    GymStore.logAction(actor, "DELETE_APPLICATION", "admission", appId, "Admission application deleted", app?.fullName || appId);
  },

  getPayments(): PaymentTransaction[] {
    return getItem(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  },
  recordPayment(paymentData: Omit<PaymentTransaction, "paymentId" | "receiptNumber" | "createdAt">, actor: string = "Admin"): PaymentTransaction {
    const payments = GymStore.getPayments();
    const receiptNumber = `RCP-${new Date().getFullYear()}-${String(payments.length + 1).padStart(3, "0")}`;
    const newPayment: PaymentTransaction = {
      ...paymentData,
      paymentId: generateCustomId("PAY"),
      receiptNumber,
      createdAt: new Date().toISOString(),
    };
    payments.unshift(newPayment);
    setItem(STORAGE_KEYS.PAYMENTS, payments);

    // Update the corresponding membership balance & payment status
    if (paymentData.membershipId) {
      const mems = GymStore.getMemberships();
      const memIdx = mems.findIndex((m) => m.membershipId === paymentData.membershipId);
      if (memIdx !== -1) {
        const currentPaid = mems[memIdx].amountPaid + paymentData.amountReceived;
        const newBalance = Math.max(0, mems[memIdx].finalPrice - currentPaid);
        const newPaymentStatus = newBalance === 0 ? "Paid" : "Partially Paid";
        mems[memIdx] = {
          ...mems[memIdx],
          amountPaid: currentPaid,
          balanceDue: newBalance,
          paymentStatus: newPaymentStatus,
          updatedAt: new Date().toISOString(),
        };
        setItem(STORAGE_KEYS.MEMBERSHIPS, mems);
      }
    }

    GymStore.logAction(actor, "RECORD_PAYMENT", "payment", newPayment.paymentId, `Recorded payment of PKR ${newPayment.amountReceived}`, `Receipt: ${receiptNumber}, Method: ${newPayment.paymentMethod}`);
    return newPayment;
  },

  getDiscounts(): DiscountCoupon[] {
    return getItem(STORAGE_KEYS.DISCOUNTS, INITIAL_DISCOUNTS);
  },
  saveDiscount(discount: DiscountCoupon, actor: string = "Admin"): void {
    const list = GymStore.getDiscounts();
    const idx = list.findIndex((d) => d.discountId === discount.discountId);
    if (idx !== -1) {
      list[idx] = discount;
    } else {
      list.unshift(discount);
    }
    setItem(STORAGE_KEYS.DISCOUNTS, list);
    GymStore.logAction(actor, "SAVE_DISCOUNT", "discount", discount.discountId, "Created or edited discount coupon", discount.name);
  },
  toggleDiscount(discountId: string, actor: string = "Admin"): void {
    const list = GymStore.getDiscounts();
    const item = list.find((d) => d.discountId === discountId);
    if (item) {
      item.isActive = !item.isActive;
      setItem(STORAGE_KEYS.DISCOUNTS, list);
      GymStore.logAction(actor, "TOGGLE_DISCOUNT", "discount", discountId, `Toggled discount active status to ${item.isActive}`, item.name);
    }
  },

  getOffers(): SpecialOffer[] {
    return getItem(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
  },
  saveOffer(offer: SpecialOffer, actor: string = "Admin"): void {
    const list = GymStore.getOffers();
    const idx = list.findIndex((o) => o.offerId === offer.offerId);
    if (idx !== -1) {
      list[idx] = offer;
    } else {
      list.unshift(offer);
    }
    setItem(STORAGE_KEYS.OFFERS, list);
    GymStore.logAction(actor, "SAVE_OFFER", "offer", offer.offerId, "Saved special marketing offer", offer.title);
  },

  getPrograms(): GymProgram[] {
    return getItem(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
  },
  savePrograms(programs: GymProgram[]): void {
    setItem(STORAGE_KEYS.PROGRAMS, programs);
  },

  getGallery(): GalleryMedia[] {
    return getItem(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  },
  saveGallery(gallery: GalleryMedia[]): void {
    setItem(STORAGE_KEYS.GALLERY, gallery);
  },

  getNotifications(): SystemNotification[] {
    return getItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  createNotification(recipientId: string, title: string, message: string, type: SystemNotification["type"]): void {
    const list = GymStore.getNotifications();
    const notif: SystemNotification = {
      notificationId: generateCustomId("NOTIF"),
      recipientId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(notif);
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },
  markNotificationRead(id: string): void {
    const list = GymStore.getNotifications();
    const item = list.find((n) => n.notificationId === id);
    if (item) {
      item.isRead = true;
      setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  },

  getAuditLogs(): AuditLogEntry[] {
    return getItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  logAction(actorName: string, action: string, entityType: AuditLogEntry["entityType"], entityId: string, reason: string, changeSummary: string): void {
    const logs = GymStore.getAuditLogs();
    const entry: AuditLogEntry = {
      logId: generateCustomId("LOG"),
      actorUid: "admin-current",
      actorName,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      reason,
      changeSummary,
    };
    logs.unshift(entry);
    setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  },

  getAdminCredentials(): { username: string; passwordHash: string } {
    return getItem("sgk_admin_credentials", {
      username: "safdarbad_admin",
      passwordHash: "SfdGym#2026!Pk",
    });
  },
  saveAdminCredentials(username: string, passwordHash: string, actor: string = "Admin"): void {
    setItem("sgk_admin_credentials", { username, passwordHash });
    GymStore.logAction(actor, "UPDATE_SECURITY", "security", "ADMIN_ACCOUNT", "Changed administrator login credentials", `Username set to ${username}`);
  },
};
