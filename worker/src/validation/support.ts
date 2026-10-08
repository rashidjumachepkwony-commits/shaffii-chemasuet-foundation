import { z } from 'zod';

export const supportRequestSchema = z.object({
  full_name: z.string().min(2, 'Please enter your full name'),
  id_number: z.string().min(5, 'Please enter a valid ID number'),
  phone_number: z.string().min(8, 'Please enter a valid phone number'),
  alternative_phone: z.string().optional(),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  country: z.string().min(2, 'Please select your country'),
  county: z.string().min(1, 'Please select your county'),
  sub_county: z.string().min(1, 'Please enter your sub-county'),
  ward: z.string().min(1, 'Please enter your ward'),
  location: z.string().min(1, 'Please enter your location'),
  current_location: z.string().min(2, 'Please describe your current physical location'),
  support_type: z.string().min(1, 'Please select the type of support needed'),
  support_description: z.string().min(10, 'Please provide more details about the support needed'),
  urgency: z.enum(['Emergency', 'Urgent', 'Normal'], { required_error: 'Please select urgency level' }),
  people_needing_support: z.string().optional(),
  additional_information: z.string().optional(),
  preferred_contact_method: z.string().optional(),
});

export type SupportRequestInput = z.infer<typeof supportRequestSchema>;

