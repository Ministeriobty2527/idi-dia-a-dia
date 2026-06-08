// Netlify Edge Function — per-post share pages
// Serves /p/<slug> with the correct Open Graph tags (post's own image)
// so WhatsApp/Facebook/X show the right thumbnail. Real visitors are
// redirected to the single-page app at /?post=<slug>.

const SUPA_URL = "https://zusjppxhhbulooriiazx.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1c2pwcHhoaGJ1bG9vcmlpYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTY4MjMsImV4cCI6MjA5NTYzMjgyM30.OFagwmqUQlJMMKzD5CiczTdDdXvj943bJGGTl9ryoFw";

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async (request, context) => {
  const url = new URL(request.url);
  const origin = url.origin;
  const slug = decodeURIComponent(
    url.pathname.replace(/^\/p\//, "").replace(/\/+$/, "")
  );

  // Is this a social-media / search crawler? (they must NOT be redirected —
  // they need to read the Open Graph tags on this page itself)
  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  const isBot = /facebookexternalhit|facebot|whatsapp|twitterbot|telegrambot|linkedinbot|slackbot|slack-imgproxy|discordbot|googlebot|bingbot|pinterest|redditbot|embedly|quora|outbrain|vkshare|skypeuripreview|nuzzel|bitlybot|flipboard|tumblr|googleimageproxy|applebot|yandex|ia_archiver|developers\.google\.com/i.test(ua);

  let post = null;
  if (slug) {
    try {
      const r = await fetch(
        `${SUPA_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}&select=titulo,resumo,imagem,categoria,autor,data,slug,id&limit=1`,
        { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
      );
      const arr = await r.json();
      if (Array.isArray(arr) && arr.length) post = arr[0];
      if (!post) {
        const r2 = await fetch(
          `${SUPA_URL}/rest/v1/posts?id=eq.${encodeURIComponent(slug)}&select=titulo,resumo,imagem,categoria,autor,data,slug,id&limit=1`,
          { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
        );
        const arr2 = await r2.json();
        if (Array.isArray(arr2) && arr2.length) post = arr2[0];
      }
    } catch (e) {
      // ignore — fall back to defaults
    }
  }

  const title = post ? post.titulo : "IDI · Dia a Dia";
  const desc = post
    ? (post.resumo || "Reflexões diárias sobre Israel, Yeshua e a Igreja.")
    : "Reflexões diárias sobre Israel, Yeshua e a Igreja.";
  const image = post && post.imagem
    ? post.imagem
    : `${origin}/assets/og-image.png`;
  const appUrl = `${origin}/?post=${encodeURIComponent(post ? (post.slug || post.id) : slug)}`;
  const pageUrl = `${origin}/p/${encodeURIComponent(slug)}`;

  // Real visitors → straight to the app (no preview needed).
  if (!isBot) {
    return Response.redirect(appUrl, 302);
  }

  // Crawlers → serve a tiny page whose ONLY job is to carry the OG tags
  // with THIS post's image. No redirect, so the crawler reads them.
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)} — IDI · Dia a Dia</title>
<meta name="description" content="${esc(desc)}" />
<link rel="icon" type="image/png" href="${origin}/favicon.png" />

<meta property="og:type" content="article" />
<meta property="og:site_name" content="IDI · Dia a Dia" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:image" content="${esc(image)}" />
<meta property="og:image:secure_url" content="${esc(image)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${esc(pageUrl)}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(desc)}" />
<meta name="twitter:image" content="${esc(image)}" />
</head>
<body>
  <h1>${esc(title)}</h1>
  <p>${esc(desc)}</p>
  <p><a href="${esc(appUrl)}">Ler no site IDI · Dia a Dia</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300"
    }
  });
};
