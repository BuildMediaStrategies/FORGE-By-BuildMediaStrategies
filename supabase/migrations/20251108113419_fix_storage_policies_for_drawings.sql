/*
  # Fix storage policies for drawings bucket

  1. Changes
    - Drop existing storage policies
    - Create proper policies with correct WITH CHECK clauses
    - Allow anonymous/public uploads to drawings bucket
  
  2. Important Notes
    - This is TEMPORARY for development/testing only
    - Allows anyone to upload/view/delete drawings
*/

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow all uploads to drawings" ON storage.objects;
DROP POLICY IF EXISTS "Allow all to view drawings" ON storage.objects;
DROP POLICY IF EXISTS "Allow all to delete drawings" ON storage.objects;

-- Create proper storage policies for testing
CREATE POLICY "Public can upload to drawings"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'drawings');

CREATE POLICY "Public can view drawings"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'drawings');

CREATE POLICY "Public can update drawings"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'drawings')
  WITH CHECK (bucket_id = 'drawings');

CREATE POLICY "Public can delete drawings"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'drawings');