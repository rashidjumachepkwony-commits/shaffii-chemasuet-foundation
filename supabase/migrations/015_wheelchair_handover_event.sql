insert into events (title, slug, short_description, full_description, featured_image, category_id, event_date, start_time, end_time, venue, location, organizer, contact_information, registration_deadline, capacity, registration_enabled, published, status) values
  ('Wheelchair Handover Ceremony',
   'wheelchair-handover-anguurai-east',
   'Shafie Chemasuet Junior (incoming Ang''urai East MCA) handover of wheelchairs to disabled persons in Ang''urai East Ward.',
   'Join us for a special wheelchair handover ceremony organized by Shafie Chemasuet Junior, the incoming Member of County Assembly for Ang''urai East Ward. The event will see the distribution of wheelchairs to persons with disabilities in the Ang''urai East community.

This initiative aims to improve mobility and accessibility for residents with physical disabilities, enabling greater participation in community life and access to education, healthcare, and economic opportunities.

The ceremony will feature a welcome address by Shafie Chemasuet Junior, testimonies from wheelchair recipients, and the official handover of mobility aids. Community leaders, families, and local residents are invited to attend and show their support.

Light refreshments will be served. Attendees are requested to register in advance as seating is limited.

Venue: Ang''urai East Ward Community Center, Busia County
Date: 30th October 2026
Time: 10:00 AM

Registration requires full name, phone number, ID number, and county/sub-county/ward/location details for verification purposes.',
   '/images/shaffi3.jpg',
   (select id from event_categories where slug = 'community'),
   '2026-10-30',
   '10:00:00',
   '14:00:00',
   'Ang''urai East Ward Community Center',
   'Ang''urai East Ward, Busia County, Kenya',
   'Shafie Chemasuet Junior (Incoming MCA, Ang''urai East)',
   'events@shafiechemasuet.org',
   '2026-10-29',
   500,
   true,
   true,
   'PUBLISHED');
