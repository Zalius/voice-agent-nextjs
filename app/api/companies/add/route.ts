import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const {
      company_id,
      company_name,
      interview_field,
      conversation_flow,
      include_hr,
      include_technical,
      voice,
      language,
      strictness_level,
    } = body;

    // اعتبارسنجی
    if (!company_id || !company_name || !interview_field) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // 1. اضافه کردن شرکت
    await client.query(
      `INSERT INTO companies (company_id, company_name, created_at)
       VALUES ($1, $2, NOW())`,
      [company_id, company_name]
    );

    // 2. اضافه کردن تنظیمات
    await client.query(
      `INSERT INTO interview_settings (
        company_id,
        interview_field,
        conversation_flow,
        include_hr,
        include_technical,
        voice,
        language,
        strictness_level,
        created_at,
        updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [
        company_id,
        interview_field,
        conversation_flow || 'greeting,company_introduction,candidate_introduction,hr_interview,technical_interview,candidate_questions,closing',
        include_hr !== false,
        include_technical !== false,
        voice || 'shimmer',
        language || 'english',
        strictness_level || 'medium',
      ]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Company added successfully',
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error adding company:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Company ID already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add company' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
