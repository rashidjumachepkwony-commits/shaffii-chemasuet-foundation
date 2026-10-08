export interface SupportRequest {
  id: string;
  reference_number: string | null;
  full_name: string;
  id_number: string;
  phone_number: string;
  alternative_phone: string | null;
  email: string | null;
  country: string;
  county: string;
  sub_county: string;
  ward: string;
  location: string;
  current_location: string;
  support_type: string;
  support_description: string;
  urgency: "Emergency" | "Urgent" | "Normal";
  people_needing_support: string | null;
  additional_information: string | null;
  preferred_contact_method: string | null;
  status: "New" | "Under Review" | "Approved" | "InProgress" | "Completed" | "Rejected" | "Closed";
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type SupportRequestInput = Omit<
  SupportRequest,
  "id" | "reference_number" | "status" | "internal_notes" | "created_at" | "updated_at"
>;
