import { NextResponse } from 'next/server';
import { getEmails, updateEmailStatus } from '@/lib/services/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');

    const result = await getEmails({ priority, category });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get emails error:', error);
    return NextResponse.json(
      { error: 'Failed to get emails' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Email ID required' },
        { status: 400 }
      );
    }

    const updated = await updateEmailStatus(id, updates);
    return NextResponse.json({ success: true, email: updated });
  } catch (error) {
    console.error('Update email error:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}
