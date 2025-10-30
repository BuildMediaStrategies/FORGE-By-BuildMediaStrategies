/*
  # ScaffoldPM Database Schema
  
  ## Overview
  Complete database schema for the ScaffoldPM scaffolding project management application.
  This migration creates all necessary tables, relationships, and security policies.
  
  ## New Tables
  
  ### `users`
  - `id` (uuid, primary key) - Unique user identifier, links to auth.users
  - `email` (text, unique, not null) - User email address
  - `name` (text, not null) - Full name of the user
  - `role` (text, not null) - User role: Admin, Manager, Supervisor, or Crew
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `jobs`
  - `id` (text, primary key) - Job ID (e.g., JOB-001)
  - `client_name` (text, not null) - Name of the client
  - `site_address` (text, not null) - Physical location of the project
  - `description` (text) - Detailed project description
  - `start_date` (date, not null) - Project start date
  - `end_date` (date) - Planned completion date
  - `status` (text, not null) - Current status: Planning, In Progress, On Hold, Completed
  - `created_by` (uuid) - References users.id
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `work_orders`
  - `id` (text, primary key) - Work order ID (e.g., WO-001)
  - `job_id` (text, not null) - References jobs.id
  - `type` (text, not null) - Order type: Installation, Inspection, Maintenance, Dismantling
  - `assigned_to` (text, not null) - Team or person assigned
  - `priority` (text, not null) - Priority level: Low, Medium, High, Critical
  - `due_date` (date, not null) - Deadline for completion
  - `status` (text, not null) - Current status: Pending, In Progress, Completed, Cancelled
  - `notes` (text) - Additional notes or instructions
  - `created_by` (uuid) - References users.id
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access data they have permission to view based on their role
  - Authenticated users can read all data (for MVP)
  - Only authenticated users can create/update/delete records
  
  ## Important Notes
  - Uses auth.uid() for user identification
  - All timestamps default to now()
  - Foreign keys ensure data integrity
  - Indexes added for performance on frequently queried columns
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('Admin', 'Manager', 'Supervisor', 'Crew')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id text PRIMARY KEY,
  client_name text NOT NULL,
  site_address text NOT NULL,
  description text DEFAULT '',
  start_date date NOT NULL,
  end_date date,
  status text NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'On Hold', 'Completed')),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create work_orders table
CREATE TABLE IF NOT EXISTS work_orders (
  id text PRIMARY KEY,
  job_id text NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('Installation', 'Inspection', 'Maintenance', 'Dismantling')),
  assigned_to text NOT NULL,
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
  notes text DEFAULT '',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_work_orders_job_id ON work_orders(job_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_due_date ON work_orders(due_date);
CREATE INDEX IF NOT EXISTS idx_work_orders_priority ON work_orders(priority);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all user profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for jobs table
CREATE POLICY "Authenticated users can view all jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for work_orders table
CREATE POLICY "Authenticated users can view all work orders"
  ON work_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create work orders"
  ON work_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update work orders"
  ON work_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete work orders"
  ON work_orders FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_work_orders_updated_at ON work_orders;
CREATE TRIGGER update_work_orders_updated_at
  BEFORE UPDATE ON work_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate next job ID
CREATE OR REPLACE FUNCTION generate_job_id()
RETURNS text AS $$
DECLARE
  next_num integer;
  new_id text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 5) AS integer)), 0) + 1
  INTO next_num
  FROM jobs
  WHERE id ~ '^JOB-[0-9]+$';
  
  new_id := 'JOB-' || LPAD(next_num::text, 3, '0');
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate next work order ID
CREATE OR REPLACE FUNCTION generate_work_order_id()
RETURNS text AS $$
DECLARE
  next_num integer;
  new_id text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS integer)), 0) + 1
  INTO next_num
  FROM work_orders
  WHERE id ~ '^WO-[0-9]+$';
  
  new_id := 'WO-' || LPAD(next_num::text, 3, '0');
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;