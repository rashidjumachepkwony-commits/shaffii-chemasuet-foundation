-- 009_seed_settings.sql
-- Seed default site settings for the foundation
-- All values are placeholders to be configured by the administrator

insert into site_settings (key, value, type, group_name, label, description, is_public) values
('foundation_name', 'Shaffii Chemasuet Foundation', 'text', 'foundation', 'Foundation Name', 'The name of the foundation', true),
('foundation_tagline', 'Empowering Communities, Transforming Lives', 'text', 'foundation', 'Foundation Tagline', 'A short tagline for the foundation', true),
('about_subtitle', 'Building stronger communities through education, healthcare, and sustainable development', 'text', 'foundation', 'About Page Subtitle', 'Subtitle text shown on the about page', true),
('mission', 'To improve the quality of life for underserved communities through sustainable development programs in education, healthcare, water access, and economic empowerment.', 'textarea', 'foundation', 'Mission', 'The foundation mission statement', true),
('vision', 'A world where every individual has access to basic necessities, quality education, and opportunities for a dignified life.', 'textarea', 'foundation', 'Vision', 'The foundation vision statement', true),
('foundation_address', 'Nairobi, Kenya', 'text', 'foundation', 'Address', 'Physical address of the foundation', true),
('foundation_phone', '+254 700 000 000', 'text', 'foundation', 'Phone', 'Contact phone number', true),
('foundation_email', 'info@shaffiichemasuet.org', 'email', 'foundation', 'Email', 'Contact email address', true),
('registration_number', 'RC 12345', 'text', 'foundation', 'Registration Number', 'Legal registration number', true),
('social_facebook', 'https://facebook.com/shaffiichemasuet', 'url', 'social', 'Facebook', 'Facebook page URL', true),
('social_twitter', 'https://twitter.com/shaffiichemasuet', 'url', 'social', 'Twitter/X', 'Twitter/X profile URL', true),
('social_instagram', 'https://instagram.com/shaffiichemasuet', 'url', 'social', 'Instagram', 'Instagram profile URL', true),
('social_linkedin', 'https://linkedin.com/company/shaffiichemasuet', 'url', 'social', 'LinkedIn', 'LinkedIn page URL', true),
('social_youtube', 'https://youtube.com/shaffiichemasuet', 'url', 'social', 'YouTube', 'YouTube channel URL', true),
('donation_info', 'Your donation helps us continue our vital work in communities across Kenya. Every contribution, no matter the size, makes a meaningful difference.', 'textarea', 'donations', 'Donation Information', 'Instructions for making donations', true),
('donation_bank', 'Bank: Equity Bank Kenya\nAccount Name: Shaffii Chemasuet Foundation\nAccount Number: 00123456789\nBranch: Nairobi, Kenya', 'textarea', 'donations', 'Bank Transfer Details', 'Bank account information for transfers', true),
('donation_mpesa', 'Till Number: 123456', 'text', 'donations', 'M-Pesa Details', 'M-Pesa till number for mobile payments', true),
('footer_text', 'The Shaffii Chemasuet Foundation is a registered non-profit organization dedicated to sustainable community development and social impact across Kenya.', 'textarea', 'footer', 'Footer Text', 'Text displayed in the website footer', true),
('site_title', 'Shaffii Chemasuet Foundation', 'text', 'appearance', 'Site Title', 'Title shown in browser tab', true),
('site_description', 'Shaffii Chemasuet Foundation - Empowering communities through education, healthcare, and sustainable development', 'text', 'appearance', 'Site Description', 'Meta description for SEO', true),
('email_from_address', 'noreply@shaffiichemasuet.org', 'email', 'email', 'From Email', 'Default sender email address', false),
('email_from_name', 'Shaffii Chemasuet Foundation', 'text', 'email', 'From Name', 'Default sender name', false);
