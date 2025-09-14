-- Database schema for AI Project
-- Run this SQL in your Neon database to create the required tables

-- Create the creations table
CREATE TABLE IF NOT EXISTS creations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'article',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_creations_user_id ON creations(user_id);

-- Create an index on type for filtering
CREATE INDEX IF NOT EXISTS idx_creations_type ON creations(type);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_creations_created_at ON creations(created_at);

