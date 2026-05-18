export default async () => {
  return new Response(JSON.stringify({
    hasClientId: !!process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    hasClientSecret: !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    hasSecret: !!process.env.KEYSTATIC_SECRET,
    nodeEnv: process.env.NODE_ENV,
    envKeys: Object.keys(process.env).filter(k => k.includes('KEYSTATIC')),
  }), { headers: { 'content-type': 'application/json' } });
};