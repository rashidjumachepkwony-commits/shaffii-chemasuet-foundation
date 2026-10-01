import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/components/ui/Toast";
import { useSettings as useSettingsData } from "@/contexts/SettingsContext";
import { Banknote, Smartphone, Shield } from "lucide-react";

const donationAmounts = [250, 500, 1000, 2500, 5000];

export default function Donate() {
  const { getSetting } = useSettings();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const donationInfo = getSetting("donation_info", "[DONATION INFORMATION]");
  const donationStatus = getSetting("donation_status", "PLACEHOLDER");

  const paymentMethods = [
    {
      name: "Bank Transfer",
      description: getSetting("donation_bank", "[BANK ACCOUNT DETAILS]"),
      icon: Banknote,
      available: true,
    },
    {
      name: "M-Pesa",
      description: getSetting("donation_mpesa", "[M-PESA DETAILS]"),
      icon: Smartphone,
      available: false,
    },
    {
      name: "Card Payments",
      description: "Card payments are being set up and will be available soon.",
      icon: Shield,
      available: false,
    },
  ];

  return (
    <SectionWrapper spacing="lg">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
            Support Our Mission
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Your generous contribution helps us sustain and expand our community programs.
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">
            Make a Donation
          </h2>

          <div className="mb-6">
            <p className="text-sm font-medium text-neutral-700 mb-3">
              Select an amount (KES)
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {donationAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`
                    rounded-xl border-2 px-4 py-3 text-center text-sm font-medium
                    transition-all
                    ${
                      selectedAmount === amount
                        ? "border-gold-500 bg-gold-50 text-neutral-900"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                    }
                  `}
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
              className="mt-2 text-sm text-foundation-700 hover:underline"
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
              className="mt-3 w-full rounded-xl border border-neutral-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-foundation-500"
            />
          </div>

          {(selectedAmount || customAmount) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Payment Instructions
              </h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className={`flex items-start gap-4 rounded-xl border p-4 ${
                      method.available
                        ? "border-neutral-200"
                        : "border-neutral-200 bg-neutral-50 opacity-60"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foundation-100">
                      <method.icon className="h-5 w-5 text-foundation-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">
                        {method.name}
                      </h4>
                      <p className="text-sm text-neutral-600 mt-1">
                        {method.description}
                      </p>
                      {!method.available && (
                        <span className="inline-block mt-1 text-xs text-amber-600 font-medium">
                          Coming soon
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-neutral-50 p-4">
                <p className="text-sm text-neutral-600">
                  <strong>Thank you for your interest in supporting us.</strong>
                  {donationInfo && (
                    <span className="block mt-1">{donationInfo}</span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-neutral-200 pt-6">
            <p className="flex items-center gap-2 text-sm text-neutral-500">
              <Shield className="h-4 w-4" />
              Donations are processed securely. Payment integration is being set up.
            </p>
          </div>
        </Card>
      </div>
    </SectionWrapper>
  );
}
