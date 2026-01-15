import { NextResponse } from 'next/server';
import { client } from '@/lib/client';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
    }

    // Escreve o novo subscritor diretamente no Sanity
    await client.create({
      _type: 'subscritor',
      email: email,
      dataInscricao: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Subscrição concluída' }, { status: 200 });
  } catch (error) {
    console.error('Erro na Newsletter:', error);
    return NextResponse.json({ error: 'Erro ao salvar e-mail' }, { status: 500 });
  }
}