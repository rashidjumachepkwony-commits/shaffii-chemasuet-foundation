import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { Card } from "@/components/ui/Card";
import { useSettings } from "@/contexts/SettingsContext";
import { Target, Eye, MapPin, Phone, Mail, Users, Heart, Leaf, GraduationCap, Shield } from "lucide-react";

export default function About() {
  const { getSetting } = useSettings();

  const foundationName = getSetting("foundation_name", "Shaffii Chemasuet Foundation");
  const mission = getSetting("mission", "We empower communities through education, healthcare, and sustainable development.");
  const vision = getSetting("vision", "A Kenya where every person has the opportunity to learn, grow, and build a dignified future.");
  const address = getSetting("foundation_address", "Nairobi, Kenya");
  const phone = getSetting("foundation_phone", "+254 769 020 852");
  const email = getSetting("foundation_email", "info@shaffiichemasuetfoundation.org");
  const registration = getSetting("registration_number", "RC 12345");

  const values = [
    {
      title: "Integrity",
      description: "We operate with transparency and accountability in all our endeavors.",
      icon: <Shield className="h-6 w-6 text-gold-500" />,
    },
    {
      title: "Community",
      description: "We believe in the power of communities to create lasting change.",
      icon: <Users className="h-6 w-6 text-gold-500" />,
    },
    {
      title: "Excellence",
      description: "We strive for excellence in every program and initiative we undertake.",
      icon: <Target className="h-6 w-6 text-gold-500" />,
    },
    {
      title: "Sustainability",
      description: "We build programs that create sustainable impact for future generations.",
      icon: <Leaf className="h-6 w-6 text-gold-500" />,
    },
  ];

  const stats = [
    { label: "Communities Served", value: "50+" },
    { label: "Programs Active", value: "8" },
    { label: "Volunteers", value: "200+" },
    { label: "Years of Service", value: "5" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-neutral-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/shaffi888.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-900/65 to-foundation-900/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="relative z-10 section-shell py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="section-label border-gold-300/40 bg-white/5 text-gold-200">
              About Us
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              About {foundationName}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-neutral-200 md:text-xl">
              {getSetting("about_subtitle", "Building stronger communities through education, healthcare, and sustainable development.")}
            </p>
          </div>
        </div>
      </section>

      <SectionWrapper className="bg-[radial-gradient(circle_at_top,_rgba(232,117,36,0.08),_transparent_55%)]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card variant="elevated" padding="lg" className="soft-card border-transparent bg-gradient-to-br from-white to-foundation-50/60 h-full">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-600 shadow-sm">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl font-bold text-neutral-900">Our Mission</h2>
            </div>
            <p className="text-lg leading-relaxed text-neutral-600">{mission}</p>
          </Card>

          <Card variant="elevated" padding="lg" className="soft-card border-transparent bg-gradient-to-br from-white to-neutral-50 h-full">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foundation-100 text-foundation-700 shadow-sm">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl font-bold text-neutral-900">Our Vision</h2>
            </div>
            <p className="text-lg leading-relaxed text-neutral-600">{vision}</p>
          </Card>
        </div>
      </SectionWrapper>

      {registration && (
        <SectionWrapper className="bg-neutral-50">
          <div className="rounded-3xl border border-foundation-200 bg-white px-6 py-5 text-center shadow-[0_18px_40px_rgba(23,33,27,0.04)]">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Registration Number
            </p>
            <p className="mt-2 text-xl font-semibold text-neutral-800">{registration}</p>
          </div>
        </SectionWrapper>
      )}

      <SectionWrapper className="bg-white">
        <div className="mb-16 text-center">
          <span className="section-label">Our Values</span>
          <h2 className="mt-5 font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Values that guide every step
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            These values guide everything we do and define how we work with communities.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} variant="elevated" className="group text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-50 transition-colors group-hover:bg-gold-100">
                  {value.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-neutral-900 transition-colors group-hover:text-gold-600">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{value.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-neutral-50">
        <div className="mb-16 text-center">
          <span className="section-label">Program Areas</span>
          <h2 className="mt-5 font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Where we focus our work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            We work across multiple pillars to create meaningful, lasting impact.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Youth Empowerment", icon: <GraduationCap className="h-6 w-6 text-gold-500" /> },
            { title: "Women & Girls", icon: <Heart className="h-6 w-6 text-gold-500" /> },
            { title: "Education & Mentorship", icon: <GraduationCap className="h-6 w-6 text-gold-500" /> },
            { title: "Digital Skills", icon: <Shield className="h-6 w-6 text-gold-500" /> },
          ].map((area) => (
            <Card key={area.title} variant="elevated" className="group text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="p-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-50 transition-colors group-hover:bg-gold-100">
                  {area.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-neutral-900 transition-colors group-hover:text-gold-600">
                  {area.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-neutral-900 text-white">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
              <div className="font-display text-4xl font-bold text-gold-400">{stat.value}</div>
              <p className="mt-2 text-sm text-neutral-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-neutral-200 bg-gradient-to-br from-foundation-50 via-white to-neutral-50 p-8 md:p-10 shadow-[0_24px_60px_rgba(23,33,27,0.06)]">
          <h2 className="font-display text-3xl font-bold text-center text-neutral-900">Visit Us</h2>
          <div className="mt-8 space-y-4 text-center">
            <p className="flex items-center justify-center gap-3 text-neutral-700">
              <MapPin className="h-5 w-5 text-gold-500" />
              {address}
            </p>
            <p className="flex items-center justify-center gap-3 text-neutral-700">
              <Phone className="h-5 w-5 text-gold-500" />
              {phone}
            </p>
            <p className="flex items-center justify-center gap-3 text-neutral-700">
              <Mail className="h-5 w-5 text-gold-500" />
              {email}
            </p>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}