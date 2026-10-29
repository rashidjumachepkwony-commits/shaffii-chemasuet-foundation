const { z } = require('zod');

const kenyaCounties = ["Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos","Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a","Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"];
const eventAgeGroupValues = ["under_13","ages_13_17","ages_18_24","ages_25_59","ages_60_plus","mixed_ages"];
const eventActivityValues = ["learning_workshops","youth_mentorship","sports_wellness","community_service","business_livelihoods","digital_skills","environment","arts_culture","health_wellbeing","intergenerational_activities","open_to_any_activity","other"];

const eventRegistrationSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').min(7, 'Please enter a valid phone number').max(20),
  organization: z.string().max(100).optional(),
  age_group: z.string().refine((value) => eventAgeGroupValues.some((option) => option === value), 'Please choose'),
  activity_interest: z.string().refine((value) => eventActivityValues.some((option) => option === value), 'Please choose'),
  activity_other: z.string().max(100).optional(),
  county: z.string().refine((value) => kenyaCounties.some((option) => option === value), 'Please choose'),
  locality: z.string().max(120).optional(),
  sub_county: z.string().max(120).optional(),
  ward: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  sub_location: z.string().max(120).optional(),
  id_number: z.string().max(50).optional(),
  attendee_count: z.number().min(1).max(20),
  notes: z.string().max(500).optional(),
});

// Test with all default values
const defaults = {
  full_name: "", email: "", phone: "", organization: "",
  age_group: "", activity_interest: "", activity_other: "",
  county: "Busia", locality: "", sub_county: "", ward: "", location: "",
  sub_location: "", id_number: "", attendee_count: 1, notes: ""
};

console.log("=== Default (empty) values ===");
const r1 = eventRegistrationSchema.safeParse(defaults);
console.log("Valid:", r1.success);
if (!r1.success) r1.error.errors.forEach(e => console.log(" -", e.path.join("."), ":", e.message));

// Test with filled values
const filled = { ...defaults, full_name: "Jane Doe", email: "jane@example.com", phone: "+254700000001", age_group: "ages_25_59", activity_interest: "community_service" };
console.log("\n=== Filled values ===");
const r2 = eventRegistrationSchema.safeParse(filled);
console.log("Valid:", r2.success);
if (!r2.success) r2.error.errors.forEach(e => console.log(" -", e.path.join("."), ":", e.message));

// Test empty string optional fields
console.log("\n=== Empty string for optional fields ===");
const r3 = eventRegistrationSchema.safeParse({ ...filled, sub_county: "", ward: "", location: "" });
console.log("Valid:", r3.success);
