import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/components/ui/Toast";
import { Banknote, Smartphone, Shield, Heart } from "lucide-react";

const donationAmounts = [250, 500, 1000, 2500, 5000, 10000];

export default function Donate() {
  const { getSetting } = useSettings();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const donationInfo = getSetting("donation_info", "Your support can help create opportunities for education, skills development, youth empowerment, women and girls initiatives, community outreach, older-person support and other community-focused programs.");
  const donationBank = getSetting("donation_bank", "Official bank details will be provided by the Foundation administrator.");
  const donationMpesa = getSetting("donation_mpesa", "Official M-Pesa details will be provided by the Foundation administrator.");

  return (
    <SectionWrapper spacing="lg">
      <div className="mx-auto max-w-4xl">
        <section className="relative overflow-hidden rounded-[2rem] bg-neutral-900 px-5 py-12 text-white shadow-[0_30px_80px_rgba(23,33,27,0.12)] md:px-8 md:py-16">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60" style={{ backgroundImage: "url('/images/shaffi6.jpg')" }} aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/80 to-foundation-900/55" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-600 shadow-lg shadow-gold-500/20">
              <Heart className="h-8 w-8" />
            </div>
            <span className="section-label border-gold-300/30 bg-white/5 text-gold-200">Partner With Us</span>
            <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
              Support Our Mission
            </h1>
            <p className="mt-4 text-lg text-neutral-200 md:text-xl">
              Your generosity sustains education, health, mentorship, and community
              resilience across Kenya — helping turn need into opportunity.
            </p>
          </div>
        </section>

        <Card variant="elevated" padding="lg" className="mt-10 bg-gradient-to-br from-white to-foundation-50/70">
          <h2 className="mb-6 font-display text-2xl font-bold text-neutral-900">
            Make a Donation
          </h2>

          <div className="mb-8">
            <p className="mb-4 text-sm font-medium text-neutral-700">Choose a giving amount (KES)</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {donationAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`rounded-xl border-2 px-4 py-3 text-center text-sm font-medium transition-all ${
                    selectedAmount === amount
                      ? "border-gold-500 bg-gold-50 text-neutral-900 shadow-md"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  KSh {amount.toLocaleString()}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedAmount(null);
                setCustomAmount("");
              }}
              className="mt-3 text-sm text-gold-600 transition-colors hover:text-gold-700 hover:underline"
            >
              Or enter a custom amount
            </button>

            <input
              type="number"
              min="1"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="mt-3 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          {(selectedAmount || customAmount) && (
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">Payment Instructions</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100">
                    <Banknote className="h-5 w-5 text-gold-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">Bank Transfer</h4>
                    <p className="mt-1 text-sm text-neutral-600">{donationBank}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100">
                    <Smartphone className="h-5 w-5 text-gold-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">M-Pesa</h4>
                    <p className="mt-1 text-sm text-neutral-600">{donationMpesa}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 opacity-80">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-200">
                    <Shield className="h-5 w-5 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">Card Payments</h4>
                    <p className="mt-1 text-sm text-neutral-600">
                      Secure digital card giving is being prepared for launch and will be
                      available soon.
                    </p>
                    <span className="mt-1 inline-block text-xs font-medium text-amber-600">Coming soon</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-neutral-50 p-4">
                <p className="text-sm leading-relaxed text-neutral-600">
                  <strong className="font-semibold text-neutral-900">Thank you for standing with us.</strong>
                  {donationInfo && <span className="mt-2 block">{donationInfo}</span>}
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-neutral-200 pt-6">
            <p className="flex items-center gap-2 text-sm text-neutral-500">
              <Shield className="h-4 w-4" />
              Every contribution is handled with care, transparency, and accountability.
            </p>
          </div>
        </Card>
      </div>
    </SectionWrapper>
  );
}