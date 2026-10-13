import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return Response.json({ message: 'Method not allowed' }, { status: 405, headers: cors });
  try {
    const body = await req.json();
    const { type, source, consent, ...payload } = body ?? {};
    if (!['nomination', 'role'].includes(type) || consent !== true) return Response.json({ message: 'Please complete the required consent and fields.' }, { status: 400, headers: cors });
    const required = type === 'nomination' ? ['nominatorName', 'nominatorEmail', 'nomineeName', 'location', 'story', 'category'] : ['name', 'email', 'role'];
    for (const key of required) if (typeof payload[key] !== 'string' || !payload[key].trim()) return Response.json({ message: 'Please complete all required fields.' }, { status: 400, headers: cors });
    if (type === 'nomination' && (payload.story.length < 30 || !payload.nomineeConsent)) return Response.json({ message: 'Please provide more detail and confirm nominee consent.' }, { status: 400, headers: cors });
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data, error } = await supabase.from('submissions').insert({ type, payload, source }).select('submission_id').single();
    if (error) throw error;
    return Response.json({ submissionId: data.submission_id }, { status: 201, headers: cors });
  } catch (error) {
    console.error('submission error', error);
    return Response.json({ message: 'We could not securely save your submission. Please try again.' }, { status: 500, headers: cors });
  }
});
