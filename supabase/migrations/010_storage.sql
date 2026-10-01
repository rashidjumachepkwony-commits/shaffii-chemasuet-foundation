-- 010_storage.sql
-- Storage bucket setup for image and document uploads

-- Create storage buckets
-- Note: Storage buckets are configured in the storage.buckets table

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
('event-images', 'event-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
('project-images', 'project-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
('gallery', 'gallery', true, 20971520, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
('news', 'news', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
('documents', 'documents', false, 20971520, array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']);

-- Storage policies for avatars bucket
create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload avatars to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
    and auth.uid() is not null
  );

create policy "Users can update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for event-images bucket
create policy "Event images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'event-images');

create policy "Admins can upload event images"
  on storage.objects for insert
  with check (
    bucket_id = 'event-images'
    and user_has_permission(auth.uid(), 'events.create')
  );

create policy "Admins can update event images"
  on storage.objects for update
  using (
    bucket_id = 'event-images'
    and user_has_permission(auth.uid(), 'events.update')
  );

create policy "Admins can delete event images"
  on storage.objects for delete
  using (
    bucket_id = 'event-images'
    and user_has_permission(auth.uid(), 'events.delete')
  );

-- Storage policies for project-images bucket
create policy "Project images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Admins can upload project images"
  on storage.objects for insert
  with check (
    bucket_id = 'project-images'
    and user_has_permission(auth.uid(), 'projects.create')
  );

create policy "Admins can update project images"
  on storage.objects for update
  using (
    bucket_id = 'project-images'
    and user_has_permission(auth.uid(), 'projects.update')
  );

create policy "Admins can delete project images"
  on storage.objects for delete
  using (
    bucket_id = 'project-images'
    and user_has_permission(auth.uid(), 'projects.delete')
  );

-- Storage policies for gallery bucket
create policy "Gallery images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Admins can upload gallery images"
  on storage.objects for insert
  with check (
    bucket_id = 'gallery'
    and user_has_permission(auth.uid(), 'gallery.manage')
  );

create policy "Admins can update gallery images"
  on storage.objects for update
  using (
    bucket_id = 'gallery'
    and user_has_permission(auth.uid(), 'gallery.manage')
  );

create policy "Admins can delete gallery images"
  on storage.objects for delete
  using (
    bucket_id = 'gallery'
    and user_has_permission(auth.uid(), 'gallery.manage')
  );

-- Storage policies for news bucket
create policy "News images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'news');

create policy "Admins can upload news images"
  on storage.objects for insert
  with check (
    bucket_id = 'news'
    and user_has_permission(auth.uid(), 'news.create')
  );

create policy "Admins can update news images"
  on storage.objects for update
  using (
    bucket_id = 'news'
    and user_has_permission(auth.uid(), 'news.update')
  );

create policy "Admins can delete news images"
  on storage.objects for delete
  using (
    bucket_id = 'news'
    and user_has_permission(auth.uid(), 'news.delete')
  );

-- Storage policies for documents bucket
create policy "Document metadata is admin-only readable"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and user_is_admin(auth.uid())
  );

create policy "Admins can upload documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and user_has_permission(auth.uid(), 'settings.manage')
  );

create policy "Admins can update documents"
  on storage.objects for update
  using (
    bucket_id = 'documents'
    and user_has_permission(auth.uid(), 'settings.manage')
  );

create policy "Admins can delete documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and user_has_permission(auth.uid(), 'settings.manage')
  );
