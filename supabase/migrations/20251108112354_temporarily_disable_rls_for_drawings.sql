/*
  # Temporarily disable RLS for drawings table

  1. Changes
    - Disable RLS on drawings table to allow unauthenticated access
    - Disable RLS on storage.objects for drawings bucket
  
  2. Important Notes
    - This is TEMPORARY for development/testing only
    - Will re-enable proper authentication later
    - DO NOT use in production
*/

-- Temporarily disable RLS on drawings table
ALTER TABLE drawings DISABLE ROW LEVEL SECURITY;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload own drawings" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view drawings" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own drawings" ON storage.objects;

-- Create permissive storage policies for testing
CREATE POLICY "Allow all uploads to drawings"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'drawings');

CREATE POLICY "Allow all to view drawings"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'drawings');

CREATE POLICY "Allow all to delete drawings"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'drawings');