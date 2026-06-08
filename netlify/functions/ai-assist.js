// Netlify serverless function — proxy for Anthropic Claude API
// Deploy: add ANTHROPIC_API_KEY in Netlify → Site configuration → Environment variables
// Editor calls POST /.netlify/functions/ai-assist with { prompt, apiKey (optional) }

const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  // API key: first from Netlify env var, then from request body (user-supplied key)
  const apiKey = process.env.ANTHROPIC_API_KEY || body.apiKey || '';
  if (!apiKey || !apiKey.startsWith('sk-')) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY não configurada. Adicione nas variáveis de ambiente da Netlify ou cole no painel do assistente.' })
    };
  }

  const { prompt } = body;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Prompt vazio.' })
    };
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1800,
        messages: [{ role: 'user', content: prompt.trim() }]
      })
    });

    if (!res.ok) {
      const err = await res.text();
      return {
        statusCode: res.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Erro da API Anthropic: ' + err })
      };
    }

    const data = await res.json();
    const text = (data?.content?.[0]?.text || '').trim();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ text })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Erro interno: ' + (e.message || 'tente novamente') })
    };
  }
};

exports.handler = handler;
