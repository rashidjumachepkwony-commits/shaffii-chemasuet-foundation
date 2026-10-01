import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { Card } from "@/components/ui/Card";
import { useSettings } from "@/contexts/SettingsContext";
import { Target, Eye, MapPin, Phone, Mail } from "lucide-react";

export default function About() {
  const { getSetting } = useSettings();

  const foundationName = getSetting("foundation_name", "Shaffii Chemasuet Foundation");
  const mission = getSetting("mission", "[FOUNDATION MISSION]");
  const vision = getSetting("vision", "[FOUNDATION VISION]");
  const address = getSetting("foundation_address", "[FOUNDATION ADDRESS]");
  const phone = getSetting("foundation_phone", "[FOUNDATION PHONE]");
  const email = getSetting("foundation_email", "[FOUNDATION EMAIL]");
  const registration = getSetting("registration_number", "[FOUNDATION REGISTRATION NUMBER]");

  const values = [
    { title: "Integrity", description: "We operate with transparency and accountability in all our endeavors." },
    { title: "Community", description: "We believe in the power of communities to create lasting change." },
    { title: "Excellence", description: "We strive for excellence in every program and initiative we undertake." },
    { title: "Sustainability", description: "We build programs that create sustainable impact for future generations." },
  ];

  return (
    <>
      <SectionWrapper className="bg-neutral-50" spacing="lg">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
            About {foundationName}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-neutral-600">
            {getSetting("about_subtitle", "Learn about our mission, vision, and commitment to community development.")}
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <Target className="h-8 w-8 text-foundation-700" />
              Our Mission
            </h2>
            <p className="mt-6 text-lg text-neutral-600 leading-relaxed">{mission}</p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <Eye className="h-8 w-8 text-foundation-700" />
              Our Vision
            </h2>
            <p className="mt-6 text-lg text-neutral-600 leading-relaxed">{vision}</p>
          </div>
        </div>
      </SectionWrapper>

      {registration && (
        <SectionWrapper className="bg-neutral-50">
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              Registration Number: <span className="font-semibold text-neutral-700">{registration}</span>
            </p>
          </div>
        </SectionWrapper>
      )}

      <SectionWrapper>
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-neutral-900">
            Our Core Values
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
            These values guide everything we do.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} variant="elevated" className="text-center">
              <div className="p-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-foundation-100">
                  <Target className="h-6 w-6 text-foundation-700" />
                </div>
                <h3 className="font-display text-xl font-bold text-neutral-900">{value.title}</h3>
                <p className="mt-3 text-sm text-neutral-600">{value.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-neutral-50">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-center text-neutral-900">
            Visit Us
          </h2>
          <div className="mt-8 space-y-4 text-center">
            <p className="flex items-center justify-center gap-3 text-neutral-700">
              <MapPin className="h-5 w-5 text-foundation-700" />
              {address}
            </p>
            <p className="flex items-center justify-center gap-3 text-neutral-700">
              <Phone className="h-5 w-5 text-foundation-700" />
              {phone}
            </p>
            <p className="flex items-center justify-center gap-3 text-neutral-700">
              <Mail className="h-5 w-5 text-foundation-700" />
              {email}
            </p>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
