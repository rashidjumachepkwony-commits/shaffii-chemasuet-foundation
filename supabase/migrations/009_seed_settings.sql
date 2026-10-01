-- 009_seed_settings.sql
-- Seed default site settings for the foundation
-- All values are placeholders to be configured by the administrator

insert into site_settings (key, value, type, group_name, label, description, is_public) values
('foundation_name', 'Shaffii Chemasuet Foundation', 'text', 'foundation', 'Foundation Name', 'The name of the foundation', true),
('foundation_tagline', '[Foundation Tagline]', 'text', 'foundation', 'Foundation Tagline', 'A short tagline for the foundation', true),
('about_subtitle', '[About Page Subtitle]', 'text', 'foundation', 'About Page Subtitle', 'Subtitle text shown on the about page', true),
('mission', '[FOUNDATION MISSION]', 'textarea', 'foundation', 'Mission', 'The foundation mission statement', true),
('vision', '[FOUNDATION VISION]', 'textarea', 'foundation', 'Vision', 'The foundation vision statement', true),
('foundation_address', '[FOUNDATION ADDRESS]', 'text', 'foundation', 'Address', 'Physical address of the foundation', true),
('foundation_phone', '[FOUNDATION PHONE]', 'text', 'foundation', 'Phone', 'Contact phone number', true),
('foundation_email', '[FOUNDATION EMAIL]', 'email', 'foundation', 'Email', 'Contact email address', true),
('registration_number', '[FOUNDATION REGISTRATION NUMBER]', 'text', 'foundation', 'Registration Number', 'Legal registration number', true),
('social_facebook', '#', 'url', 'social', 'Facebook', 'Facebook page URL', true),
('social_twitter', '#', 'url', 'social', 'Twitter/X', 'Twitter/X profile URL', true),
('social_instagram', '#', 'url', 'social', 'Instagram', 'Instagram profile URL', true),
('social_linkedin', '#', 'url', 'social', 'LinkedIn', 'LinkedIn page URL', true),
('social_youtube', '#', 'url', 'social', 'YouTube', 'YouTube channel URL', true),
('donation_info', '[DONATION INFORMATION]', 'textarea', 'donations', 'Donation Information', 'Instructions for making donations', true),
('donation_bank', '[BANK ACCOUNT DETAILS]', 'textarea', 'donations', 'Bank Transfer Details', 'Bank account information for transfers', true),
('donation_mpesa', '[M-PESA TILL NUMBER]', 'text', 'donations', 'M-Pesa Details', 'M-Pesa till number for mobile payments', true),
('footer_text', 'The Shaffii Chemasuet Foundation is dedicated to community development and social impact.', 'textarea', 'footer', 'Footer Text', 'Text displayed in the website footer', true),
('site_title', 'Shaffii Chemasuet Foundation', 'text', 'appearance', 'Site Title', 'Title shown in browser tab', true),
('site_description', 'Shaffii Chemasuet Foundation - Building stronger communities together', 'text', 'appearance', 'Site Description', 'Meta description for SEO', true),
('email_from_address', 'noreply@foundation.example', 'email', 'email', 'From Email', 'Default sender email address', false),
('email_from_name', 'Shaffii Chemasuet Foundation', 'text', 'email', 'From Name', 'Default sender name', false);
