# Como publicar o IDI · Dia a Dia

## 🚀 Publicar (Netlify — 2 minutos)

1. Acesse https://app.netlify.com/drop
2. **Arraste a pasta inteira** do projeto (ou o ZIP) na área indicada
3. Aguarde o upload — ela te dá uma URL como `seu-nome-aleatorio.netlify.app`
4. (Opcional) Em **Site settings → Domain management**, adicione seu domínio
   real (ex.: `dia.idisrael.com.br`) e configure o CNAME no registro.br

> ⚠️ O arquivo principal **PRECISA** se chamar `index.html`.
> Já está renomeado neste projeto.

## ➕ Adicionar um artigo novo (do IDI)

Abra `data/articles.json` num editor de texto (VS Code, Sublime,
Bloco de Notas) e cole um objeto novo **antes** do `]` final:

```json
{
  "id": 68,
  "titulo": "Título do artigo",
  "autor": "Nome do autor",
  "data": "2026-05-27",
  "categoria": "Israel e a Igreja",
  "resumo": "Linha de abertura editorial — 1 a 2 frases.",
  "conteudo": "Primeiro parágrafo.\n\nSegundo parágrafo.\n\nTerceiro parágrafo.",
  "fonte_original": "https://link-da-fonte.com"
}
```

**Categorias existentes** (use uma destas para o filtro funcionar):
- `Israel e a Igreja`
- `Profecia e Escatologia`
- `Festas e Calendário Bíblico`
- `Torah e Vida Hebraica`
- `Oração e Intercessão`
- `Formação Interior`
- `Liderança Apostólica`
- `Antissemitismo e Sionismo`

**Formato da data:** AAAA-MM-DD (ex: `2026-05-27`).
Os artigos mais recentes aparecem primeiro automaticamente.

## 🔄 Re-publicar após editar

Depois de salvar o JSON modificado:

- **Netlify Drop:** arraste a pasta inteira de novo em https://app.netlify.com/drop
  (ela cria uma nova versão no mesmo site se você já estiver logado)
- **Hospedagem própria (FTP):** suba só o(s) arquivo(s) alterado(s).

## 📝 Posts BTY e CUFI

Mesma estrutura, mas em arquivos diferentes:
- `data/bty-posts.json` — posts do Ministério BTY
- `data/cufi-posts.json` — artigos da CUFI traduzidos

Use o modelo abaixo (sem `id` nem `conteudo` — esses só linkam para fora):

```json
{
  "titulo": "Título do post",
  "autor": "Nome do autor",
  "data": "2026-05-27",
  "categoria": "Artigos",
  "img": "https://link-direto-da-imagem.jpg",
  "url": "https://link-do-post-original.com",
  "resumo": "Abertura do post — 2 a 3 frases."
}
```

## 💬 Continuar atualizando comigo

Se preferir, me cole aqui o título + texto do artigo novo e eu
adiciono ao JSON correto. É o caminho mais rápido enquanto a
estrutura ainda muda.

---

📞 Suporte: WhatsApp +55 (21) 98699-6277
✉️ PIX (doações): btyeshua@gmail.com
