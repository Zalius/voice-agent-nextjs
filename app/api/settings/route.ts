import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { InterviewSettings } from '@/lib/db';

// GET - همیشه اولین ردیف
export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        c.id,
        c.name,
        c.description,
        s.*
      FROM companies c
      JOIN interview_settings s ON c.id = s.company_id
      ORDER BY c.id ASC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No settings found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } finally {
    client.release();
  }
}

// POST - همیشه آپدیت اولین ردیف
export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const data = await req.json();
    
    await client.query('BEGIN');

    // آپدیت شرکت اول
    await client.query(
      `UPDATE companies 
       SET name = $1, description = $2 
       WHERE id = 1`,
      [data.name, data.description]
    );

    // آپدیت تنظیمات اول
    await client.query(
      `UPDATE interview_settings 
       SET interview_field = $1, interview_type = $2, voice_type = $3,
           language = $4, include_name = $5, include_hr = $6, 
           include_tech = $7, strictness_level = $8
       WHERE company_id = 1`,
      [
        data.interview_field,
        data.interview_type,
        data.voice_type,
        data.language,
        data.include_name,
        data.include_hr,
        data.include_tech,
        data.strictness_level,
      ]
    );

    await client.query('COMMIT');
    return NextResponse.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  } finally {
    client.release();
  }
}
