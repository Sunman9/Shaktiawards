import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedOrigins = new Set([
  'https://shaktiawards.oohms.in',
  'http://localhost:5173',
]);

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') ?? '';
  const cors = {
    'Access-Control-Allow-Origin': allowedOrigins.has(origin) ? origin : 'null',
    'Access-Control-Allow-Headers': 'apikey, authorization, x-client-info, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return Response.json({ message: 'Method not allowed' }, { status: 405, headers: cors });
  if (!allowedOrigins.has(origin)) return Response.json({ message: 'Origin not allowed' }, { status: 403, headers: cors });

  try {
    const keyHeader = req.headers.get('apikey') ?? '';
    const publishableKeys = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') ?? '{}');
    const expectedKey = publishableKeys.default ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    if (!expectedKey || keyHeader !== expectedKey) return Response.json({ message: 'Unauthorized' }, { status: 401, headers: cors });

    const body = await req.json();
    const { type, source, consent, ...payload } = body ?? {};
    if (!['nomination', 'role'].includes(type) || consent !== true) return Response.json({ message: 'Please complete the required consent and fields.' }, { status: 400, headers: cors });
    const required = type === 'nomination' ? ['nominatorName', 'nominatorEmail', 'nomineeName', 'location', 'story', 'category'] : ['name', 'email', 'role'];
    for (const key of required) if (typeof payload[key] !== 'string' || !payload[key].trim()) return Response.json({ message: 'Please complete all required fields.' }, { status: 400, headers: cors });
    if (type === 'nomination' && (payload.story.length < 30 || !payload.nomineeConsent)) return Response.json({ message: 'Please provide more detail and confirm nominee consent.' }, { status: 400, headers: cors });

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) throw new Error('Submission storage is not configured.');
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.from('submissions').insert({ type, payload, source }).select('submission_id').single();
    if (error) throw error;
    return Response.json({ submissionId: data.submission_id }, { status: 201, headers: cors });
  } catch (error) {
    console.error('submission error', error);
    return Response.json({ message: 'We could not securely save your submission. Please try again.' }, { status: 500, headers: cors });
  }
});
