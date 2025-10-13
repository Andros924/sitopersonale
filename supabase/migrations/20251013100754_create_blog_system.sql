/*
  # Create Blog System with Authentication

  1. New Tables
    - `blog_articles`
      - `id` (uuid, primary key)
      - `title` (text, article title)
      - `slug` (text, unique URL-friendly identifier)
      - `excerpt` (text, short description)
      - `content` (text, full article content in HTML)
      - `image_url` (text, URL to article image)
      - `author` (text, author name)
      - `published_date` (date, publication date)
      - `reading_time` (integer, estimated minutes to read)
      - `tags` (text array, article tags)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, reference to auth.users)
      
  2. Security
    - Enable RLS on `blog_articles` table
    - Add policy for public read access to articles
    - Add policy for authenticated users to create articles
    - Add policy for authors to update their own articles
    - Add policy for authenticated users to delete articles
    
  3. Indexes
    - Add index on slug for fast lookups
    - Add index on published_date for sorting
    - Add index on tags for filtering
*/

-- Create blog_articles table
CREATE TABLE IF NOT EXISTS blog_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  author text NOT NULL DEFAULT '',
  published_date date NOT NULL DEFAULT CURRENT_DATE,
  reading_time integer NOT NULL DEFAULT 5,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Public can read all published articles
CREATE POLICY "Anyone can view published articles"
  ON blog_articles
  FOR SELECT
  USING (true);

-- Authenticated users can create articles
CREATE POLICY "Authenticated users can create articles"
  ON blog_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own articles
CREATE POLICY "Users can update own articles"
  ON blog_articles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Authenticated users can delete articles
CREATE POLICY "Authenticated users can delete articles"
  ON blog_articles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_date ON blog_articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_tags ON blog_articles USING gin(tags);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_articles_updated_at
  BEFORE UPDATE ON blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();