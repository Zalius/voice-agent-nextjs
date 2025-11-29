import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'interview_platform',
  user: process.env.DB_USER || 'livekit_user',
  password: process.env.DB_PASSWORD || 'your_password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;

// تایپ‌های صحیح بر اساس schema واقعی
export interface InterviewSettings {
  id: number;
  company_id: string;
  company_name?: string; // از join می‌آید
  interview_field: string;
  conversation_flow: string;
  include_hr: boolean;
  include_technical: boolean;
  voice: string;
  language: string;
  strictness_level: string;
  created_at: Date;
  updated_at: Date;
}

export interface Company {
  company_id: string;
  company_name: string;
  created_at: Date;
}
