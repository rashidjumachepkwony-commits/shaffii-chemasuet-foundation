-- 012_seed_foundation_content.sql
-- Seed projects, news articles, events, and gallery items for initial launch

-- ============================================================
-- PROJECTS (8 starter projects: 3 IN_PROGRESS, 5 PLANNED)
-- ============================================================

insert into projects (title, slug, summary, description, featured_image, status, start_date, end_date, location) values
  ('Water Well Construction in Marsabit',
   'water-well-marsabit',
   'Installing a borehole water system to provide clean drinking water to a remote community.',
   'The Shafie Chemasuet Foundation is constructing a borehole water system in Marsabit County to provide reliable access to clean drinking water. This project will serve approximately 500 households and includes the installation of a solar-powered pump, storage tank, and distribution points.',
   '/images/shaffi3.jpg',
   'IN_PROGRESS',
   '2026-01-15',
   '2026-06-30',
   'Marsabit County, Kenya'),

  ('School Library Development',
   'school-library-development',
   'Building and stocking a library at a primary school in Nairobi.',
   'We are partnering with a local primary school in Nairobi to build and stock a modern library. The library will contain 2,000+ textbooks and learning materials, providing students with a quiet study space and access to educational resources.',
   '/images/shaffi4.jpg',
   'IN_PROGRESS',
   '2026-02-01',
   '2026-08-15',
   'Nairobi, Kenya'),

  ('Mobile Health Clinic Initiative',
   'mobile-health-clinic',
   'Deploying mobile health units to provide healthcare services in rural areas.',
   'Our mobile health clinic initiative brings basic healthcare services directly to underserved rural communities. The program provides routine check-ups, vaccinations, health education, and basic medical supplies.',
   '/images/shaffi6.jpg',
   'IN_PROGRESS',
   '2026-03-01',
   '2026-12-01',
   'Various locations, Kenya'),

  ('Community Garden Project',
   'community-garden-project',
   'Establishing sustainable vegetable gardens to promote food security.',
   'PLANNED project to establish community gardens in 5 villages, teaching sustainable farming practices and promoting food security. Each garden will include drip irrigation systems and local seed varieties.',
   '/images/shaffi77.jpg',
   'PLANNED',
   '2026-09-01',
   '2027-03-01',
   'Narok County, Kenya'),

  ('Digital Literacy Program',
   'digital-literacy-program',
   'Providing computers and internet access to rural schools.',
   'PLANNED initiative to equip 3 rural schools with computer labs and internet connectivity. The program includes teacher training and student workshops on digital skills.',
   '/images/shaffi888.jpg',
   'PLANNED',
   '2026-10-01',
   '2027-06-01',
   'Kakamega County, Kenya'),

  ('Sanitation Infrastructure Improvement',
   'sanitation-improvement',
   'Constructing eco-friendly sanitation facilities in public schools.',
   'PLANNED project to install eco-friendly toilets and handwashing stations in 10 public schools, improving health outcomes for over 2,000 students.',
   '/images/shaffi999.jpg',
   'PLANNED',
   '2026-11-01',
   '2027-05-01',
   'Kisumu County, Kenya'),

  ('Maternal Health Support Program',
   'maternal-health-support',
   'Providing prenatal care and safe delivery services.',
   'PLANNED program to establish maternal health centers in 3 rural health clinics, providing prenatal care, safe delivery services, and postnatal support.',
   '/images/shaffie.jpg',
   'PLANNED',
   '2027-01-01',
   '2028-01-01',
   'Turkana County, Kenya'),

  ('Skills Training Center',
   'skills-training-center',
   'Building a vocational training center for youth.',
   'PLANNED construction of a vocational training center offering courses in carpentry, tailoring, electronics, and culinary arts to empower youth with employable skills.',
   '/images/shaffiklop.jpg',
   'PLANNED',
   '2027-03-01',
   '2028-09-01',
   'Eldoret, Kenya');

-- ============================================================
-- NEWS ARTICLES (8 published news articles)
-- ============================================================

insert into news (title, slug, excerpt, content, featured_image, category, author, published_date, status) values
  ('Foundation Partners with Local Schools to Launch Digital Literacy Program',
   'digital-literacy-partnership',
   'We are excited to announce our partnership with 3 primary schools in Kakamega County to launch a comprehensive digital literacy program.',
   'The Shafie Chemasuet Foundation has partnered with three primary schools in Kakamega County to launch a digital literacy program aimed at bridging the technology gap in rural education. The program will provide over 500 students with their first exposure to computers and digital skills.

"Access to technology is no longer a luxury but a necessity in today''s world," said the Foundation''s Program Director. "This partnership ensures that rural students have the same opportunities as their urban counterparts."

The program includes the donation of 50 computers, internet connectivity, and training for 10 teachers. Classes began in September 2026 and will run for 12 months.',
   '/images/shaffiuda.jpg',
   'Education',
   'Foundation Team',
   '2026-09-15 10:00:00',
   'PUBLISHED'),

  ('Water Well Project Reaches 50% Completion Milestone',
   'water-well-milestone',
   'Our Marsabit water well project has reached the halfway mark, bringing clean water closer to 500 families.',
   'The Foundation''s water well construction project in Marsabit County has successfully reached the 50% completion milestone. The project, which began in January 2026, is on track for completion by June 2026.

The borehole drilling is complete, and construction of the water storage tank and distribution system is underway. Once finished, the solar-powered water system will provide clean drinking water to approximately 500 households in the community.

"We are grateful for the community''s patience and cooperation throughout this project," said the Project Manager. "This is a transformative development for the community."',
   '/images/shaffi33.jpg',
   'Community',
   'Foundation Team',
   '2026-05-01 09:00:00',
   'PUBLISHED'),

  ('Annual Fundraising Gala Raises Ksh 2.5 Million',
   'fundraising-gala-success',
   'Our annual gala dinner exceeded its fundraising goal, securing funds for three new projects.',
   'The Shafie Chemasuet Foundation''s annual fundraising gala, held in August 2026, successfully raised Ksh 2.5 million—exceeding our goal of Ksh 2 million.

The funds raised will support three new initiatives: the Community Garden Project, the Skills Training Center, and expanded maternal health services in Turkana County.

"We are deeply grateful to all our donors, sponsors, and supporters who made this evening possible," said the Foundation''s Executive Director. "Your generosity will directly impact thousands of lives."

The event brought together 200 community leaders, business owners, and philanthropists for an evening of inspiration and giving.',
   '/images/shaffill.jpg',
   'Fundraising',
   'Foundation Team',
   '2026-08-20 18:00:00',
   'PUBLISHED'),

  ('Mobile Health Clinic Serves Over 1,000 Patients in First Quarter',
   'mobile-clinic-update',
   'Our mobile health unit has treated over 1,000 patients across rural communities in just three months.',
   'In its first quarter of operation, the Foundation''s Mobile Health Clinic Initiative has successfully served over 1,000 patients across rural communities in Narok and Kajiado counties.

The mobile unit provides routine health check-ups, vaccinations, basic medications, and health education. The program has treated common conditions including malaria, respiratory infections, and minor injuries, while also screening for chronic conditions like hypertension and diabetes.

"We have seen firsthand the impact of bringing healthcare directly to communities," said the Lead Nurse. "Many patients would not have sought care without this service due to distance and transportation costs."',
   '/images/shaffivb.jpg',
   'Health',
   'Dr. Amina Hassan',
   '2026-07-10 12:00:00',
   'PUBLISHED'),

  ('New School Library Opens in Nairobi Partnership',
   'new-library-opens',
   'The library project at Nairobi Primary School is complete and now serving 400 students daily.',
   'We are proud to announce the completion of our school library project at Nairobi Primary School. The new library contains over 2,000 books and learning materials, including textbooks, reference materials, and digital resources.

The library was officially opened on March 15, 2026, with a ceremony attended by school administrators, students, and Foundation representatives. Since opening, the library has served over 400 students daily, contributing to improved academic performance.

"This library is a dream come true for our students," said the School Principal. "We are grateful for the Foundation''s generous support."',
   '/images/shaffillll.jpg',
   'Education',
   'Foundation Team',
   '2026-03-20 14:00:00',
   'PUBLISHED'),

  ('Celebrating International Women''s Day with Community Leaders',
   'womens-day-celebration',
   'We joined women leaders across Kenya to celebrate International Women''s Day 2026.',
   'On March 8, 2026, the Shafie Chemasuet Foundation joined community leaders across Kenya to celebrate International Women''s Day. Our CEO participated in a panel discussion on women''s economic empowerment, alongside other prominent female leaders.

The event, held at Kenyatta University, brought together over 300 women from various sectors including education, business, healthcare, and community organizing. Discussions focused on creating more opportunities for women in leadership and entrepreneurship.

"The future of our communities depends on empowering all our members," said our CEO. "Women''s contributions to society are invaluable and deserve recognition and support."'
   '/images/shaffikkk.jpg',
   'Community',
   'Foundation Team',
   '2026-03-09 11:00:00',
   'PUBLISHED'),

  ('Foundation Receives Recognition for Community Impact',
   'foundation-recognition',
   'The Foundation was awarded the Community Impact Excellence Award by the Kenya NGO Council.',
   'We are honored to announce that the Shafie Chemasuet Foundation has received the Community Impact Excellence Award from the Kenya NGO Council for our outstanding contributions to community development in 2025.

The award recognizes our work across education, healthcare, and water access projects that have directly benefited over 10,000 people. The ceremony was held at the United Nations Offices at Nairobi (UNON).

"This award belongs to every member of our community who has supported our mission," said our Executive Director. "We will continue working to create lasting positive change."

This recognition reinforces our commitment to excellence in community development and motivates us to expand our impact in the coming years."
   '/images/shaffikkkkk.jpg',
   'Community',
   'Foundation Team',
   '2026-02-10 16:00:00',
   'PUBLISHED'),

  ('Volunteer Spotlight: Mary Kamau''s Journey with Our Foundation',
   'volunteer-spotlight-mary',
   'Meet Mary Kamau, a dedicated volunteer who has been with us for three years.',
   'Mary Kamau first joined the Shafie Chemasuet Foundation as a volunteer in 2023, assisting with our school feeding program. Over the past three years, she has become a cornerstone of our community outreach efforts.

Mary coordinates our weekly food distribution drives, mentors new volunteers, and leads our literacy tutoring sessions. Her dedication and passion have inspired many others to get involved.

"I started volunteering because I wanted to give back to my community," Mary shares. "Seeing the impact of our work on children and families has been incredibly rewarding. Every moment is worth it when I see a child''s eyes light up after learning to read."

Mary''s story is a reminder that each of us has the power to create positive change in our communities. Thank you, Mary!'
   '/images/shaffivvv.jpg',
   'Volunteer',
   'Foundation Team',
   '2026-06-05 08:00:00',
   'PUBLISHED');

-- ============================================================
-- EVENTS (6 events: 4 PUBLISHED, 2 PLANNED)
-- ============================================================

insert into events (title, slug, short_description, full_description, featured_image, category_id, event_date, start_time, end_time, venue, location, organizer, contact_information, registration_deadline, capacity, registration_enabled, published, status) values
  ('Monthly Community Feeding Program',
   'monthly-community-feeding',
   'Weekly community meals serving nutritious food to families in need.',
   'Join us for our monthly community feeding program where volunteers serve nutritious meals to families in need. This ongoing initiative operates every weekend and serves approximately 150 families per event.

All ingredients are sourced locally, and meals are prepared by trained volunteers following nutritional guidelines. We welcome new volunteers to help with cooking, serving, and distribution.

This event is held at our community center in Kibera, Nairobi.',
   '/images/shaffi 2.jpg',
   (select id from event_categories where slug = 'community'),
   '2026-10-10',
   '10:00:00',
   '14:00:00',
   'Shafie Chemasuet Foundation Community Center',
   'Kibera, Nairobi, Kenya',
   'Shafie Chemasuet Foundation',
   'events@shafiechemasuet.org',
   '2026-10-09',
   200,
   true,
   true,
   'PUBLISHED'),

  ('Digital Skills Workshop for Youth',
   'digital-skills-workshop',
   'A hands-on computer training session for young people aged 15-25.',
   'This intensive digital skills workshop is designed for youth aged 15-25 who want to gain essential computer skills. The 3-day workshop covers computer basics, internet safety, email usage, and introductory programming concepts.

Participants will receive a certificate of completion and access to our online learning platform for continued education. Laptops will be provided, but participants are encouraged to bring their own devices if available.

The workshop is led by experienced instructors from our partner organization, TechBridge Kenya.',
   '/images/shaffifffff.jpg',
   (select id from event_categories where slug = 'education'),
   '2026-10-25',
   '09:00:00',
   '16:00:00',
   'Nairobi Technical Training Institute',
   'Nairobi, Kenya',
   'TechBridge Kenya',
   'info@techbridgekenya.org',
   '2026-10-20',
   50,
   true,
   true,
   'PUBLISHED'),

  ('Health Screening Day',
   'health-screening-day',
   'Free health check-ups and screenings for the community.',
   'Our quarterly health screening day provides free basic health check-ups to community members. Services include blood pressure screening, diabetes testing, BMI measurement, vision tests, and consultation with healthcare professionals.

All screenings are conducted by certified medical professionals from local health facilities. Results and recommendations are provided on the spot. No appointment is necessary—walk-ins are welcome.

This event is part of our broader Mobile Health Clinic Initiative and is completely free of charge.',
   '/images/shaffi000.jpg',
   (select id from event_categories where slug = 'health'),
   '2026-11-15',
   '08:00:00',
   '17:00:00',
   'Mathare Community Health Center',
   'Mathare, Nairobi, Kenya',
   'Dr. Samuel Ochieng',
   'health@shafiechemasuet.org',
   '2026-11-10',
   300,
   true,
   true,
   'PUBLISHED'),

  ('Tree Planting Initiative',
   'tree-planting-initiative',
   'Community tree planting to promote environmental sustainability.',
   'Join us for a day of environmental action as we plant indigenous trees in degraded areas of Kakamega Forest. This initiative aims to restore local ecosystems and combat climate change effects.

Participants will learn about native tree species, proper planting techniques, and ongoing care. Gloves, shovels, and seedlings will be provided. Light lunch and refreshments will be served.

This event is suitable for all ages and fitness levels. Children under 12 must be accompanied by an adult.',
   '/images/shaffiand.jpg',
   (select id from event_categories where slug = 'community'),
   '2026-12-05',
   '08:30:00',
   '12:30:00',
   'Kakamega Forest Reserve',
   'Kakamega County, Kenya',
   'Dr. Jane Mwangi, Environmental Officer',
   'events@shafiechemasuet.org',
   '2026-12-01',
   100,
   true,
   true,
   'PUBLISHED'),

  ('Skills Training Center Inauguration',
   'skills-center-inauguration',
   'Official opening ceremony for our new vocational training center.',
   'We are thrilled to announce the opening of our state-of-the-art Skills Training Center in Eldoret. The center will offer vocational training in carpentry, tailoring, electronics repair, and culinary arts.

The inauguration ceremony will feature keynote speeches from local government officials, a ribbon-cutting ceremony, and tours of the facilities. This event is by invitation only, with representatives from local communities, educational institutions, and government agencies.',
   '/images/shaffiklop.jpg',
   (select id from event_categories where slug = 'education'),
   '2027-03-15',
   '10:00:00',
   '16:00:00',
   'Shaffii Chemasuet Skills Training Center',
   'Eldoret, Kenya',
   'Shafie Chemasuet Foundation',
   'events@shafiechemasuet.org',
   '2027-03-10',
   150,
   false,
   false,
   'PLANNED'),

  ('Annual General Meeting 2027',
   'agm-2027',
   'Our yearly stakeholder meeting to review impact and plan for the future.',
   'The Shafie Chemasuet Foundation''s Annual General Meeting brings together our community partners, donors, volunteers, and stakeholders to review the year''s achievements and plan for future initiatives.

The meeting will include a presentation of our annual report, financial statements, and impact metrics. There will be a Q&A session and networking opportunity. All stakeholders and community members are welcome to attend.

Light refreshments will be provided.',
   '/images/shaffillll.jpg',
   (select id from event_categories where slug = 'community'),
   '2027-04-20',
   '14:00:00',
   '18:00:00',
   'Kenyatta University Conference Center',
   'Nairobi, Kenya',
   'Board of Trustees',
   'info@shafiechemasuet.org',
   '2027-04-15',
   250,
   false,
   false,
   'PLANNED');

-- ============================================================
-- GALLERY ITEMS (image collection from various projects/events)
-- ============================================================

insert into gallery_items (image_url, thumbnail_url, caption, category, alt_text, sort_order) values
  ('/images/shaffi3.jpg', '/images/shaffi3.jpg', 'Borehole construction in progress at Marsabit water project', 'Projects', 'Workers installing water pipes at construction site', 1),
  ('/images/shaffi4.jpg', '/images/shaffi4.jpg', 'Children reading in the new school library', 'Education', 'Students using library books', 2),
  ('/images/shaffi6.jpg', '/images/shaffi6.jpg', 'Mobile health clinic in action', 'Health', 'Nurse checking patient blood pressure', 3),
  ('/images/shaffi77.jpg', '/images/shaffi77.jpg', 'Community garden preparation', 'Community', 'Volunteers preparing soil for planting', 4),
  ('/images/shaffi888.jpg', '/images/shaffi888.jpg', 'Students learning computer skills', 'Education', 'Youth in computer lab', 5),
  ('/images/shaffi999.jpg', '/images/shaffi999.jpg', 'Sanitation facility construction', 'Projects', 'Workers building eco-friendly toilets', 6),
  ('/images/shaffie.jpg', '/images/shaffie.jpg', 'Maternal health workshop', 'Health', 'Pregnant women attending health session', 7),
  ('/images/shaffiklop.jpg', '/images/shaffiklop.jpg', 'Skills training center construction', 'Projects', 'Building under construction', 8),
  ('/images/shaffill.jpg', '/images/shaffill.jpg', 'Annual fundraising gala attendees', 'Community', 'People at dinner event', 9),
  ('/images/shaffillll.jpg', '/images/shaffillll.jpg', 'Community volunteers in action', 'Volunteer', 'Volunteers serving meals', 10),
  ('/images/shaffivb.jpg', '/images/shaffivb.jpg', 'Health screening event', 'Health', 'Doctor examining patient', 11),
  ('/images/shaffivvv.jpg', '/images/shaffivvv.jpg', 'Volunteer recognition ceremony', 'Volunteer', 'Group photo with certificates', 12);