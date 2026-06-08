# Publicar com GitHub + Netlify automático (Opção B)

Isto faz **cada post mostrar sua própria imagem** ao ser compartilhado,
e você nunca mais precisa arrastar ZIP — o site se atualiza sozinho.

A configuração abaixo é feita **uma única vez**. Depois, é só publicar
posts pelo editor (que já é automático).

---

## PARTE 1 — Subir os arquivos para o GitHub

1. Entre em https://github.com e faça login.
2. Clique no **+** (canto superior direito) → **New repository**.
3. Em **Repository name**, escreva: `idiblog`
4. Deixe como **Public** (ou Private, tanto faz).
5. **NÃO** marque "Add a README".
6. Clique em **Create repository**.
7. Na página seguinte, clique no link **"uploading an existing file"**
   (fica no meio da tela, na frase "…or upload an existing file").
8. **Arraste para a área** TODOS os arquivos e pastas do projeto
   (o conteúdo do ZIP que você baixou) — incluindo as pastas
   `assets`, `data`, `netlify` e os arquivos `index.html`,
   `netlify.toml`, `_redirects`, etc.
9. Espere o upload terminar e clique em **Commit changes** (botão verde).

> ⚠️ Importante: a pasta `netlify/edge-functions/share.js` PRECISA subir
> com essa estrutura de pastas. Ao arrastar a pasta `netlify` inteira,
> o GitHub mantém a estrutura automaticamente.

---

## PARTE 2 — Conectar a Netlify ao GitHub

Você já tem o site `idiblog.org` na Netlify. Vamos ligá-lo ao GitHub:

1. Entre em https://app.netlify.com e abra o seu site (idiblog).
2. Vá em **Site configuration** → **Build & deploy** →
   **Continuous deployment**.
3. Em **Build settings**, clique em **Link repository** (ou
   "Link site to Git").
4. Escolha **GitHub**, autorize, e selecione o repositório `idiblog`.
5. Nas configurações de build:
   - **Branch to deploy:** `main`
   - **Build command:** deixe **VAZIO**
   - **Publish directory:** `.` (um ponto) ou deixe vazio
6. Clique em **Deploy site**.

A Netlify vai publicar e, desta vez, **vai rodar a função de borda**
(porque agora é deploy via Git, não arrastar-e-soltar).

---

## PARTE 3 — Testar

1. Espere o deploy terminar (~1 min, fica verde "Published").
2. Cole o link de um post **que tenha imagem** em
   https://developers.facebook.com/tools/debug
3. Clique em **Scrape Again** → deve aparecer a **imagem do post**.

---

## Daqui pra frente

- **Publicar post:** use o editor normalmente (idiblog.org/editor.html).
  Os posts vão pro banco e aparecem na hora — sem mexer no GitHub.
- **Mudar o site (visual, textos):** me peça as alterações; eu te passo
  os arquivos novos, você os substitui no GitHub (Upload files de novo)
  e a Netlify republica sozinha.

---

📞 Dúvida? WhatsApp +55 (21) 98699-6277
