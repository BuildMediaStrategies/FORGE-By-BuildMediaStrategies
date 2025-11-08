/*
  # Create drawings table and storage bucket

  1. New Tables
    - `drawings`
      - `id` (uuid, primary key) - Unique identifier for each drawing
      - `user_id` (uuid) - References auth.users, the owner of the drawing
      - `job_id` (uuid, nullable) - Optional reference to a job
      - `file_url` (text) - Full URL to the file in Supabase Storage
      - `file_name` (text) - Original filename
      - `file_size` (bigint) - File size in bytes
      - `created_at` (timestamptz) - When the drawing was uploaded
  
  2. Storage
    - Create public `drawings` bucket for storing drawing files
  
  3. Security
    - Enable RLS on `drawings` table
    - Users can only view their own drawings
    - Users can only insert drawings with their own user_id
    - Users can only update their own drawings
    - Users can only delete their own drawings
    - Storage policies allow authenticated users to upload/view/delete their own files

  4. Important Notes
    - All drawings are scoped by user_id for security
    - Storage bucket is public to allow easy access to uploaded images
    - File size is stored in bytes for tracking storage usage
*/

-- Create drawings table
CREATE TABLE IF NOT EXISTS drawings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id uuid,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for drawings table
CREATE POLICY "Users can view own drawings"
  ON drawings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drawings"
  ON drawings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drawings"
  ON drawings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own drawings"
  ON drawings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for drawings
INSERT INTO storage.buckets (id, name, public)
VALUES ('drawings', 'drawings', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for drawings bucket
CREATE POLICY "Users can upload own drawings"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'drawings' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can view drawings"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'drawings');

CREATE POLICY "Users can delete own drawings"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'drawings' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS drawings_user_id_idx ON drawings(user_id);
CREATE INDEX IF NOT EXISTS drawings_created_at_idx ON drawings(created_at DESC);