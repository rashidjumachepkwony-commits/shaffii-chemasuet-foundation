-- 009_seed_settings.sql
-- Seed default site settings for the foundation
-- All values are placeholders to be configured by the administrator

insert into site_settings (key, value, type, group_name, label, description, is_public) values
('foundation_name', 'Shaffii Chemasuet Foundation', 'text', 'foundation', 'Foundation Name', 'The name of the foundation', true),
('foundation_tagline', 'Empowering People. Strengthening Communities. Creating Opportunities.', 'text', 'foundation', 'Foundation Tagline', 'A short tagline for the foundation', true),
('about_subtitle', 'Building stronger communities through education, healthcare, and sustainable development', 'text', 'foundation', 'About Page Subtitle', 'Subtitle text shown on the about page', true),
('mission', 'To empower children, young people, women, men and older members of our communities by creating opportunities for education, skills development, livelihoods, mentorship and meaningful participation in community development.', 'textarea', 'foundation', 'Mission', 'The foundation mission statement', true),
('vision', 'A community where every person has the opportunity to learn, grow, participate and build a dignified and sustainable future.', 'textarea', 'foundation', 'Vision', 'The foundation vision statement', true),
('foundation_address', 'Nairobi, Kenya', 'text', 'foundation', 'Address', 'Physical address of the foundation', true),
('foundation_phone', '+254 769 020 852', 'text', 'foundation', 'Phone', 'Contact phone number', true),
('foundation_email', 'info@shaffiichemasuetfoundation.org', 'email', 'foundation', 'Email', 'Contact email address', true),
('registration_number', 'RC 12345', 'text', 'foundation', 'Registration Number', 'Legal registration number', true),
('social_facebook', 'https://facebook.com/shaffiichemasuet', 'url', 'social', 'Facebook', 'Facebook page URL', true),
('social_twitter', 'https://twitter.com/shaffiichemasuet', 'url', 'social', 'Twitter/X', 'Twitter/X profile URL', true),
('social_instagram', 'https://instagram.com/shaffiichemasuet', 'url', 'social', 'Instagram', 'Instagram profile URL', true),
('social_linkedin', 'https://linkedin.com/company/shaffiichemasuet', 'url', 'social', 'LinkedIn', 'LinkedIn page URL', true),
('social_youtube', 'https://youtube.com/shaffiichemasuet', 'url', 'social', 'YouTube', 'YouTube channel URL', true),
('donation_info', 'Your support can help create opportunities for education, skills development, youth empowerment, women and girls initiatives, community outreach, older-person support and other community-focused programs.', 'textarea', 'donations', 'Donation Information', 'Instructions for making donations', true),
('donation_bank', 'Official bank details will be provided by the Foundation administrator.', 'textarea', 'donations', 'Bank Transfer Details', 'Bank account information for transfers', true),
('donation_mpesa', 'Official M-Pesa details will be provided by the Foundation administrator.', 'text', 'donations', 'M-Pesa Details', 'M-Pesa till number for mobile payments', true),
('footer_text', 'The Shaffii Chemasuet Foundation is a registered non-profit organization dedicated to sustainable community development and social impact across Kenya.', 'textarea', 'footer', 'Footer Text', 'Text displayed in the website footer', true),
('site_title', 'Shaffii Chemasuet Foundation | Empowering People, Strengthening Communities', 'text', 'appearance', 'Site Title', 'Title shown in browser tab', true),
('site_description', 'Shaffii Chemasuet Foundation focuses on community empowerment, education, skills development, youth opportunities, women and girls, livelihoods, inclusion and sustainable community development.', 'text', 'appearance', 'Site Description', 'Meta description for SEO', true),
('email_from_address', 'noreply@shaffiichemasuetfoundation.org', 'email', 'email', 'From Email', 'Default sender email address', false),
('email_from_name', 'Shaffii Chemasuet Foundation', 'text', 'email', 'From Name', 'Default sender name', false);