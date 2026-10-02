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
      {/* Page Hero */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/shaffi888.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-medium tracking-wider text-gold-400 uppercase mb-4">
              About Us
            </span>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl md:text-6xl">
              About {foundationName}
            </h1>
            <p className="mt-6 text-lg text-neutral-200 md:text-xl">
              {getSetting("about_subtitle", "Building stronger communities through education, healthcare, and sustainable development.")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <SectionWrapper className="bg-white">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Card variant="elevated" padding="lg" className="h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50">
                <Target className="h-7 w-7 text-gold-600" />
              </div>
              <h2 className="font-display text-3xl font-bold text-neutral-900">
                Our Mission
              </h2>
            </div>
            <p className="text-lg text-neutral-600 leading-relaxed">{mission}</p>
          </Card>

          <Card variant="elevated" padding="lg" className="h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50">
                <Eye className="h-7 w-7 text-gold-600" />
              </div>
              <h2 className="font-display text-3xl font-bold text-neutral-900">
                Our Vision
              </h2>
            </div>
            <p className="text-lg text-neutral-600 leading-relaxed">{vision}</p>
          </Card>
        </div>
      </SectionWrapper>

      {/* Registration */}
      {registration && (
        <SectionWrapper className="bg-neutral-50">
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              Registration Number: <span className="font-semibold text-neutral-700">{registration}</span>
            </p>
          </div>
        </SectionWrapper>
      )}

      {/* Core Values */}
      <SectionWrapper className="bg-white">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Our Core Values
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            These values guide everything we do and define how we work with communities.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} variant="elevated" className="text-center group">
              <div className="p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-50 group-hover:bg-gold-100 transition-colors">
                  {value.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-neutral-900 group-hover:text-gold-600 transition-colors">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Areas of Focus */}
      <SectionWrapper className="bg-neutral-50">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Our Program Areas
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
            <Card key={area.title} variant="elevated" className="text-center group">
              <div className="p-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 group-hover:bg-gold-100 transition-colors">
                  {area.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-neutral-900 group-hover:text-gold-600 transition-colors">
                  {area.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Impact Stats */}
      <SectionWrapper className="bg-neutral-900 text-white">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl font-bold text-gold-400">{stat.value}</div>
              <p className="mt-2 text-sm text-neutral-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Contact */}
      <SectionWrapper className="bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-center text-neutral-900">
            Visit Us
          </h2>
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