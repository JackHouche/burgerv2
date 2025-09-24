import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  return session;
}

export async function requireAdminAuth(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof Response) {
    return session;
  }

  if (session.user.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }

  return session;
}
