// Netlify serverless function — proxy for Anthropic Claude API
// Set ANTHROPIC_API_KEY in Netlify → Site configuration → Environment variables

exports.handler = async (event) => {
  // CORS preflight
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY não configurada. Adicione nas variáveis de ambiente da Netlify (Site configuration → Environment variables).' })
    };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'JSON inválido' }) }; }

  const { prompt } = body;
  if (!prompt || !prompt.trim()) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Prompt vazio' }) };
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
      return { statusCode: res.status, headers, body: JSON.stringify({ error: 'Anthropic API: ' + err }) };
    }

    const data = await res.json();
    const text = (data?.content?.[0]?.text || '').trim();
    return { statusCode: 200, headers, body: JSON.stringify({ text }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Erro: ' + (e.message || 'tente novamente') }) };
  }
};
