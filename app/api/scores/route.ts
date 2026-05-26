import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('mole_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Supabase GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const { name, score } = await request.json();

    if (!name || score === undefined) {
      return NextResponse.json({ error: 'Name and score are required' }, { status: 400 });
    }

    const trimmedName = name.trim();

    // 1. 기존 사용자가 있는지 확인 (이름으로 조회)
    const { data: existingRecords, error: fetchError } = await supabase
      .from('mole_scores')
      .select('*')
      .eq('name', trimmedName)
      .limit(1);

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (existingRecords && existingRecords.length > 0) {
      const existingRecord = existingRecords[0];
      
      // 2. 기존 기록이 있을 때: 새 점수가 기존 최고 점수보다 높을 때만 업데이트
      if (score > existingRecord.score) {
        const { error: updateError } = await supabase
          .from('mole_scores')
          .update({ score: score })
          .eq('id', existingRecord.id);

        if (updateError) {
          console.error('Supabase update error:', updateError);
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'High score updated' });
      }
      return NextResponse.json({ message: 'Existing score is higher or equal' });
    } else {
      // 3. 기존 기록이 없을 때: 새로 생성
      const { error: insertError } = await supabase
        .from('mole_scores')
        .insert([{ name: trimmedName, score: score }]);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      return NextResponse.json({ message: 'New score saved' });
    }
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
