"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import { GymStore } from "@/lib/store";
import {
  SiteSettings,
  MembershipPlan,
  GymProgram,
  GalleryMedia,
  SpecialOffer,
} from "@/lib/types";
import { formatPKR } from "@/lib/utils";
import {
  Dumbbell,
  Flame,
  Shield,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Tag,
  Play,
  Video,
} from "lucide-react";

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings>(GymStore.getSettings());
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [programs, setPrograms] = useState<GymProgram[]>([]);
  const [gallery, setGallery] = useState<GalleryMedia[]>([]);
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryMedia | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    const refreshData = () => {
      const currentSettings = GymStore.getSettings();
      setSettings(currentSettings);
      setPlans(currentSettings ? [
        {
          planId: "PLAN-MONTHLY",
          name: "Standard Monthly Membership",
          description: "Full access to all weight training facilities, dumbbells, barbells, and gym machines.",
          durationMonths: 1,
          basePrice: currentSettings.standardMonthlyFee || 2500,
          isActive: true,
          features: [
            `One-Time Admission Fee (New Members Only): ${formatPKR(currentSettings.standardAdmissionFee || 3000)}`,
            `Standard Monthly Charge: ${formatPKR(currentSettings.standardMonthlyFee || 2500)} / Month`,
            "Unlimited Daily Gym Access (6 AM - 11 PM)",
            "Full Access to Dumbbells & Power Cages",
            "Chest, Back, Leg & Shoulder Machines",
            "Changing Room & Locker Storage",
            "Beginner Lifting Guidance",
          ],
        },
      ] : []);
      setPrograms(GymStore.getPrograms());
      setGallery(GymStore.getGallery());
      setOffers(GymStore.getOffers().filter((o) => o.isPublished));
    };

    refreshData();
    return GymStore.subscribe(refreshData);
  }, []);

  const filteredGallery =
    activeCategory === "All"
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-[#101010] text-white min-h-screen">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Image or Video with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          {settings?.heroMediaType === "video" && settings?.heroMediaUrl ? (
            <video
              src={settings.heroMediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-40"
            />
          ) : (
            <Image
              src={settings?.heroMediaUrl || "/images/gym-interior-1.jpg"}
              alt="Safdarbad Gym Khan'a Interior"
              fill
              priority
              className="object-cover opacity-35 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/70 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(16,16,16,0.85)_100%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A1A]/90 border border-[#FF6B00]/40 shadow-lg mb-6 backdrop-blur-md max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-sm font-semibold tracking-wider text-[#FFC857] uppercase text-center truncate">
              Safdarabad&apos;s Premier Strength & Fitness Club
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight uppercase leading-tight sm:leading-none drop-shadow-md break-words max-w-full">
            {settings.heroHeadline}
          </h1>

          {/* Subheading */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed">
            {settings.heroSupportingText}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/admission"
              className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e05e00] hover:to-[#ff6b00] rounded-lg shadow-xl shadow-[#FF6B00]/30 hover:shadow-2xl hover:shadow-[#FF6B00]/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Join The Gym</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#facilities"
              className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-200 hover:text-white bg-[#1A1A1A]/80 hover:bg-[#252525] border border-zinc-700/80 rounded-lg backdrop-blur-sm transition-all"
            >
              Explore Our Gym
            </a>
          </div>

          {/* Compact Info Strip */}
          <div className="mt-12 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#141414]/90 border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-md text-left">
            <div className="flex items-center gap-3 p-2 border-b sm:border-b-0 sm:border-r border-zinc-800/80">
              <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Standard Membership</span>
                <span className="text-base font-bold text-white font-heading">
                  {formatPKR(settings.standardMonthlyFee)} <span className="text-xs font-normal text-zinc-400">/ month</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 border-b sm:border-b-0 sm:border-r border-zinc-800/80">
              <div className="w-10 h-10 rounded-lg bg-[#FFC857]/15 border border-[#FFC857]/30 flex items-center justify-center text-[#FFC857] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Prime Location</span>
                <span className="text-xs font-medium text-zinc-200 line-clamp-1">
                  Fatima Center, Top Floor, Main Bazar
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Direct Contact & WhatsApp</span>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-400 hover:underline"
                >
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-20 bg-[#141414] border-t border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Side */}
            <div className="relative group">
              <div className="relative h-[420px] rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl">
                {settings?.aboutMediaType === "video" && settings?.aboutMediaUrl ? (
                  <video
                    src={settings.aboutMediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={settings?.aboutMediaUrl || "/images/gym-workout.jpg"}
                    alt="Workout Training at Safdarbad Gym Khan'a"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-block px-3 py-1 bg-[#FF6B00] text-black font-heading font-bold text-xs uppercase tracking-wider rounded mb-2">
                    Discipline First
                  </div>
                  <h4 className="font-heading text-xl font-bold text-white">
                    Built By Lifters For Lifters
                  </h4>
                </div>
              </div>
              {/* Accompanying Floating Card */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#1F1F1F] border border-zinc-700 p-4 rounded-xl shadow-2xl max-w-xs hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#FF6B00]/20 text-[#FF6B00]">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">Atmosphere</span>
                    <span className="font-heading font-bold text-sm text-white">Zero Distractions. Pure Focus.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6B00] uppercase tracking-widest">
                <Flame className="w-4 h-4" />
                <span>Our Heritage & Purpose</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                {settings.aboutHeading}
              </h2>
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                {settings.aboutText}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-heading font-semibold text-white text-sm">Spacious Floor</h5>
                    <p className="text-xs text-zinc-400">Fatima Center top floor provides wide airflow and natural daylight.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-heading font-semibold text-white text-sm">Full Weight Array</h5>
                    <p className="text-xs text-zinc-400">Complete dumbbell sets, Olympic barbells, and sturdy bench setups.</p>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/admission"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#FFC857] hover:text-[#FF6B00] transition-colors"
                >
                  <span>Submit an online admission application</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FACILITIES & PROGRAMS SECTION */}
      <section id="facilities" className="py-20 bg-[#101010]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest">
              Equipped For Peak Performance
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
              Facilities & Training Areas
            </h2>
            <p className="text-zinc-400 text-sm">
              Discover dedicated training zones engineered to support progressive overload, bodybuilding, and athletic conditioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((prog) => (
              <div
                key={prog.programId}
                className="group relative bg-[#181818] border border-zinc-800 hover:border-[#FF6B00]/60 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={prog.imageUrl}
                    alt={prog.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/70 text-[#FFC857] border border-zinc-700 rounded backdrop-blur-sm">
                    {prog.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#FF6B00] transition-colors">
                    {prog.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {prog.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MEMBERSHIP PRICING SECTION */}
      <section id="plans" className="py-20 bg-[#151515] border-t border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest">
              Simple & Transparent Pricing
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
              Membership Plans
            </h2>
            <p className="text-zinc-400 text-sm">
              No hidden fees, no complicated contracts. Straightforward access to Safdarabad&apos;s leading training environment.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.planId}
                className="relative bg-[#1C1C1C] border-2 border-[#FF6B00] rounded-2xl p-8 sm:p-10 shadow-2xl shadow-[#FF6B00]/10"
              >
                {/* Popular Ribbon */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
                  Most Popular Plan
                </div>

                <div className="text-center space-y-2 pb-6 border-b border-zinc-800">
                  <h3 className="font-heading text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">{plan.description}</p>
                  <div className="pt-4 flex items-baseline justify-center gap-2">
                    <span className="font-heading text-4xl sm:text-5xl font-extrabold text-[#FF6B00]">
                      {formatPKR(plan.basePrice)}
                    </span>
                    <span className="text-sm text-zinc-400 font-medium">/ month</span>
                  </div>

                  {/* Clean, small subtle badge for admission fee */}
                  <div className="inline-flex flex-wrap items-center justify-center gap-1.5 mt-2.5 px-3.5 py-1.5 bg-zinc-900/90 border border-zinc-700/80 rounded-full text-xs text-zinc-300 shadow-sm">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                    <span className="text-zinc-400 font-medium">If you are new:</span>
                    <span>Admission fee</span>
                    <strong className="text-white font-bold">{formatPKR(settings?.standardAdmissionFee || 3000)}</strong>
                    <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 font-medium uppercase tracking-wider">
                      One-Time
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="py-6 space-y-3">
                  <span className="text-xs font-semibold text-[#FFC857] uppercase tracking-wider block">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Offer notice if available */}
                {offers.length > 0 && (
                  <div className="mb-6 p-3 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg text-xs text-zinc-300 flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0" />
                    <span>
                      Apply coupon <strong className="text-white">WELCOME20</strong> during online admission for an eligible discount!
                    </span>
                  </div>
                )}

                <Link
                  href="/admission"
                  className="w-full py-4 text-center font-heading text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e05e00] hover:to-[#ff6b00] rounded-xl shadow-lg shadow-[#FF6B00]/30 block transition-all transform hover:-translate-y-0.5"
                >
                  Apply For Admission Online
                </Link>

                <p className="text-center text-[11px] text-zinc-500 mt-3">
                  Instant submission • Pay offline at desk or bank transfer
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SPECIAL OFFERS SECTION */}
      {offers.length > 0 && (
        <section id="offers" className="py-16 bg-[#101010]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
              <span className="text-xs font-bold text-[#FFC857] uppercase tracking-widest">
                Promotions & Savings
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
                Active Special Offers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {offers.map((offer) => (
                <div
                  key={offer.offerId}
                  className="bg-[#181818] border border-zinc-800 hover:border-[#FF6B00]/50 p-6 rounded-xl flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/40 rounded">
                        {offer.badge || "Special Offer"}
                      </span>
                      <span className="text-xs text-zinc-500">Valid until {offer.endDate}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white">{offer.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{offer.description}</p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/admission"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] hover:underline"
                    >
                      <span>Claim this offer in Admission</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. PHOTO GALLERY SECTION */}
      <section id="gallery" className="py-20 bg-[#141414] border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest block mb-1">
                Inside Safdarbad Gym Khan’a
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
                Facility & Workout Gallery
              </h2>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {["All", "Interior", "Equipment", "Workout"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    activeCategory === cat
                      ? "bg-[#FF6B00] text-white"
                      : "bg-[#1E1E1E] text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGallery.map((item) => (
              <div
                key={item.imageId}
                onClick={() => setSelectedImage(item)}
                className="group relative h-64 rounded-xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-[#FF6B00] transition-all duration-300 shadow-lg"
              >
                {item.mediaType === "video" || item.imageUrl.startsWith("data:video") || item.imageUrl.endsWith(".mp4") ? (
                  <video
                    src={item.imageUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Image
                    src={item.imageUrl}
                    alt={item.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {(item.mediaType === "video" || item.imageUrl.startsWith("data:video") || item.imageUrl.endsWith(".mp4")) && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-[#FF6B00] border border-[#FF6B00]/40">
                    <Play className="w-3.5 h-3.5 fill-[#FF6B00]" />
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-bold text-[#FFC857] uppercase tracking-widest block">
                    {item.category}
                  </span>
                  <p className="text-xs text-white font-medium line-clamp-1">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT & LOCATION SECTION */}
      <section id="contact" className="py-20 bg-[#101010] border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest">
                Visit Us or Reach Out
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
                Get In Touch
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Whether you want to inspect the facility in person or ask questions regarding registration and workout plans, our reception is always ready to welcome you.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 p-4 bg-[#181818] border border-zinc-800 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-heading font-semibold text-white text-sm">Gym Address</h5>
                    <p className="text-xs text-zinc-300 mt-0.5">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#181818] border border-zinc-800 rounded-xl">
                  <Phone className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-heading font-semibold text-white text-sm">Direct Phone</h5>
                    <a href={`tel:${settings.phone}`} className="text-xs text-zinc-300 hover:text-white block mt-0.5">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#181818] border border-zinc-800 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-heading font-semibold text-white text-sm">Instant WhatsApp</h5>
                    <a
                      href="https://wa.me/923059422464"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline block mt-0.5 font-medium"
                    >
                      {settings.whatsapp} (Click to open chat)
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/923059422464"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message on WhatsApp</span>
                </a>
                <a
                  href={`tel:${settings.phone}`}
                  className="px-6 py-3 bg-[#222222] hover:bg-[#2c2c2c] text-white border border-zinc-700 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Reception</span>
                </a>
              </div>
            </div>

            {/* Quick Inquiry / Location Map Visual Card */}
            <div className="bg-[#181818] border border-zinc-800 p-8 rounded-2xl flex flex-col justify-between space-y-6 shadow-2xl">
              <div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">Location Information</h3>
                <p className="text-xs text-zinc-400">
                  Safdarabad city center location ensures easy access from all major markets and residential areas.
                </p>
                <div className="mt-6 relative h-64 rounded-xl overflow-hidden border border-zinc-700">
                  <Image
                    src="/images/gym-interior-3.jpg"
                    alt="Safdarbad Gym Khan'a Location"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center">
                    <MapPin className="w-10 h-10 text-[#FF6B00] mb-2 animate-bounce" />
                    <span className="font-heading font-bold text-lg text-white">FATIMA CENTER</span>
                    <span className="text-xs text-[#FFC857] font-semibold">TOP FLOOR • MAIN BAZAR</span>
                    <span className="text-[11px] text-zinc-300 mt-1">City Safdarabad</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#121212] rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-2">
                <div className="flex justify-between">
                  <span>Operating Schedule:</span>
                  <span className="text-white font-medium">Mon - Sat: 6:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="text-amber-400 font-medium">Maintenance & Rest</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        image={selectedImage}
        allImages={filteredGallery}
        onClose={() => setSelectedImage(null)}
        onSelect={(img) => setSelectedImage(img)}
      />

      <Footer />
    </div>
  );
}
