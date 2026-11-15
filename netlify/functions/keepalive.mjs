// Runs once a day on Netlify and sends one small read request to Supabase,
// so the free project is never paused for inactivity.
const SB = 'https://ttqaswutuhswrjyocbcv.supabase.co';
const KEY = 'sb_publishable_LxYBkR8o93P7tgUpu7dAMQ_bo3BCq1c';

export default async () => {
  try {
    const r = await fetch(SB + '/rest/v1/listings?select=id&limit=1', { headers: { apikey: KEY } });
    console.log('keepalive status', r.status);
  } catch (e) {
    console.log('keepalive failed', String(e));
  }
};

export const config = { schedule: '@daily' };
