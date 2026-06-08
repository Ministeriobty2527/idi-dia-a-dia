// IDI Dia a Dia — Editorial blog
const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ─── DATA ──────────────────────────────────────────────────────────────
const ARTICLES = JSON.parse(document.getElementById('articles-data').textContent);
const BTY_POSTS = JSON.parse(document.getElementById('bty-data').textContent);
const CUFI_POSTS = JSON.parse(document.getElementById('cufi-data').textContent);
const CATEGORIES = [...new Set(ARTICLES.map((a) => a.categoria))].sort();
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const MESES_FULL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

// Sort by date desc
ARTICLES.sort((a, b) => b.data.localeCompare(a.data));

// ─── UTILS ─────────────────────────────────────────────────────────────
const fmtDate = (iso, full = false) => {
  const [y, m, d] = iso.split('-');
  if (full) return `${+d} de ${MESES_FULL[+m - 1]} de ${y}`;
  return `${+d} ${MESES[+m - 1]} ${y}`;
};
const readingTime = (text) => Math.max(1, Math.round(text.split(/\s+/).length / 200));

// Editorial dropcap helper
const Dropcap = ({ children }) => {
  const text = String(children).trim();
  if (!text) return <p>{children}</p>;
  return (
    <p className="article-p first-p">
      <span className="dropcap">{text.charAt(0)}</span>
      {text.slice(1)}
    </p>);

};

// ─── HEADER ────────────────────────────────────────────────────────────
function Header({ darkMode, setDarkMode, onJumpTo, currentCat, onOpenPrayer }) {
  const now = new Date();
  const dateStr = `${now.getDate()} de ${MESES_FULL[now.getMonth()]} de ${now.getFullYear()}`.toUpperCase();
  return (
    <header className="masthead" data-screen-label="Masthead">
      <div className="topbar">
        <div className="topbar-inner">
          <span className="topbar-l">{dateStr}</span>
          <span className="topbar-c">Edição&nbsp;Nº&nbsp;{String(ARTICLES.length).padStart(3, '0')} · Vol. iii</span>
          <span className="topbar-r">
            <button className="mode-btn" onClick={() => setDarkMode(!darkMode)} aria-label="Alternar modo">
              {darkMode ? '◑ claro' : '◐ escuro'}
            </button>
          </span>
        </div>
      </div>

      <div className="brand">
        <div className="brand-rule" />
        <div className="brand-row">
          <span className="brand-side brand-side-l">
            <img src="assets/idi-logo.png" alt="IDI" className="brand-logo-img" />
            <span className="brand-side-txt">
              Igrejas em Defesa de Israel
              <span className="brand-flags">
                <span className="flag" title="Brasil">🇧🇷</span>
                <span className="flag" title="Portugal">🇵🇹</span>
                <span className="flag" title="Estados Unidos">🇺🇸</span>
                <span className="flag" title="Galileia · Israel">🇮🇱</span>
              </span>
            </span>
          </span>
          <h1 className="brand-title">
            <span className="brand-i">I</span>
            <span className="brand-D">D</span>
            <span className="brand-i">I</span>
            <span className="brand-amp">·</span>
            <em className="brand-italic">Dia a Dia</em>
          </h1>
          <span className="brand-side brand-side-r">
            <a className="brand-editor" href="https://www.instagram.com/ludsocial/" target="_blank" rel="noopener">
              <img src="assets/ludwig-perfil.png" alt="Ludwig Goulart" className="brand-editor-photo" />
              <span className="brand-editor-info">
                <span className="brand-editor-name">Ludwig Goulart</span>
                <span className="brand-editor-role">diretor executivo & editor</span>
                <span className="brand-editor-ig"><span className="editor-ig-ic">⌾</span> @ludsocial</span>
              </span>
            </a>
            <span className="brand-side-net">IDI Israel · BTY Brasil · Manifesto de Israel · The Love &amp; Justice Project Kansas City</span>
          </span>
        </div>
        <div className="brand-rule brand-rule-thick" />
        <div className="brand-rule" />
      </div>

      <ManifestoBar onOpenPrayer={onOpenPrayer} />

      <nav className="nav-rail">
        <a onClick={() => onJumpTo('todos')} className={currentCat === 'todos' ? 'active' : ''}>Início</a>
        <a onClick={() => onJumpTo('Israel e a Igreja')}>Israel & a Igreja</a>
        <a onClick={() => onJumpTo('Profecia e Escatologia')}>Profecia</a>
        <a onClick={() => onJumpTo('Festas e Calendário Bíblico')}>Festas</a>
        <a onClick={() => onJumpTo('Torah e Vida Hebraica')}>Torah</a>
        <a onClick={() => document.getElementById('oracao')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Oração</a>
        <a onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Sobre</a>
        <a onClick={() => document.getElementById('bty')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>BTY</a>
        <a onClick={() => document.getElementById('cufi')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>CUFI</a>
        <a onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Vídeos</a>
        <a onClick={() => document.getElementById('coordenacao')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Coordenação</a>
        <a onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Contato</a>
        <a onClick={() => document.getElementById('apoie')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Apoie</a>
        <a className="nav-arc" onClick={() => onJumpTo('arquivo')}>↓ Arquivo</a>
      </nav>
    </header>);

}

// ─── HERO FEATURE ──────────────────────────────────────────────────────
function HeroFeature({ article, onOpen }) {
  if (!article) return null;
  const rt = readingTime(article.conteudo);
  return (
    <section className="hero" data-screen-label="Hero">
      <div className="hero-grid">
        <div className="hero-meta">
          <span className="kicker">Edição em destaque · {article.categoria}</span>
          <div className="rule rule-short" />
          <p className="hero-date">{fmtDate(article.data, true)}</p>
          <p className="hero-rt">leitura · {rt}&nbsp;min</p>
        </div>

        <div className="hero-body">
          <h2 className="hero-title" onClick={() => onOpen(article)}>
            {article.titulo}
          </h2>
          {article.imagem && (
            <figure className="hero-cover" onClick={() => onOpen(article)}>
              <img src={article.imagem} alt={article.titulo} loading="lazy" />
            </figure>
          )}
          <p className="hero-deck">{article.resumo}</p>
          <div className="hero-foot">
            <span className="byline">
              <span className="byline-name">Curadoria IDI · BTY</span>
            </span>
            <button className="cta" onClick={() => onOpen(article)}>
              Ler matéria <span className="cta-arrow">→</span>
            </button>
          </div>
        </div>

        <aside className="hero-pull">
          <div className="pull-mark">“</div>
          <p className="pull-text">
            {(article.resumo || article.conteudo).split('.').slice(0, 1).join('.')}.
          </p>
          <div className="rule rule-short" />
          <span className="pull-attr">— Curadoria IDI · BTY</span>
        </aside>
      </div>
    </section>);

}

// ─── FILTER RAIL ───────────────────────────────────────────────────────
function FilterRail({ filter, setFilter, query, setQuery, total }) {
  return (
    <div className="filter-rail" data-screen-label="Filter rail">
      <div className="filter-rail-inner">
        <div className="filter-cats">
          <button
            className={`f-pill ${filter === 'todos' ? 'active' : ''}`}
            onClick={() => setFilter('todos')}>
            
            Todos <span className="f-count">{ARTICLES.length}</span>
          </button>
          {CATEGORIES.map((c) => {
            const n = ARTICLES.filter((a) => a.categoria === c).length;
            return (
              <button
                key={c}
                className={`f-pill ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}>
                
                {c} <span className="f-count">{n}</span>
              </button>);

          })}
        </div>

        <div className="filter-search">
          <span className="fs-ico">⌕</span>
          <input
            type="text"
            placeholder="Buscar título, autor, palavra…"
            value={query}
            onChange={(e) => setQuery(e.target.value)} />
          
          {query &&
          <button className="fs-clear" onClick={() => setQuery('')}>×</button>
          }
        </div>
      </div>
      {(filter !== 'todos' || query) &&
      <div className="filter-result">
          <em>{total}</em> {total === 1 ? 'artigo' : 'artigos'}
          {filter !== 'todos' && <> em <strong>{filter}</strong></>}
          {query && <> contendo “<strong>{query}</strong>”</>}
        </div>
      }
    </div>);

}

// ─── SECONDARY GRID (3 features) ───────────────────────────────────────
function SecondaryGrid({ articles, onOpen }) {
  if (!articles.length) return null;
  return (
    <section className="sec-grid" data-screen-label="Secondary features">
      <header className="sec-head">
        <span className="kicker">Também nesta edição</span>
        <div className="rule" />
      </header>
      <div className="sec-grid-inner">
        {articles.map((a, i) =>
        <article
          key={a.id}
          className={`sec-card ${i === 0 ? 'sec-card-lead' : ''}`}
          onClick={() => onOpen(a)}>
          
            <div className="sec-card-top">
              <span className="sec-cat">{a.categoria}</span>
              <span className="sec-date">{fmtDate(a.data)}</span>
            </div>
            <h3 className="sec-title">{a.titulo}</h3>
            <p className="sec-deck">{a.resumo}</p>
            <p className="sec-author">Curadoria IDI · BTY</p>
          </article>
        )}
      </div>
    </section>);

}

// ─── ARTICLE LIST (rule-separated) ─────────────────────────────────────
function ArticleList({ articles, onOpen, sectionTitle }) {
  if (!articles.length) {
    return (
      <div className="empty">
        <p className="empty-mark">∅</p>
        <p>Nenhum artigo encontrado com esse filtro.</p>
      </div>);

  }
  return (
    <section className="article-list" data-screen-label="Article list">
      {sectionTitle &&
      <header className="list-head">
          <span className="kicker">{sectionTitle}</span>
          <div className="rule" />
        </header>
      }
      {articles.map((a, i) =>
      <article key={a.id} className={`list-item ${a.imagem ? 'has-thumb' : ''}`} onClick={() => onOpen(a)}>
          <div className="list-num">{String(i + 1).padStart(2, '0')}</div>
          <div className="list-body">
            <div className="list-meta">
              <span className="list-cat">{a.categoria}</span>
              <span className="list-sep">·</span>
              <span className="list-date">{fmtDate(a.data)}</span>
              <span className="list-sep">·</span>
              <span className="list-rt">{readingTime(a.conteudo)} min</span>
            </div>
            <h3 className="list-title">{a.titulo}</h3>
            <p className="list-deck">{a.resumo}</p>
            <p className="list-author"><em>Curadoria IDI · BTY</em></p>
          </div>
          {a.imagem &&
          <div className="list-thumb">
              <img src={a.imagem} alt={a.titulo} loading="lazy" />
            </div>
          }
          <div className="list-go">→</div>
        </article>
      )}
    </section>);

}

// ─── SIDEBAR ───────────────────────────────────────────────────────────
function Sidebar({ onOpen, filter, setFilter }) {
  const years = useMemo(() => {
    const counts = {};
    ARTICLES.forEach((a) => {
      const y = a.data.slice(0, 4);
      counts[y] = (counts[y] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[0].localeCompare(a[0]));
  }, []);
  const topCats = useMemo(() => {
    const counts = {};
    ARTICLES.forEach((a) => {counts[a.categoria] = (counts[a.categoria] || 0) + 1;});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, []);
  const mostRecent = ARTICLES.slice(0, 4);

  return (
    <aside className="sidebar" data-screen-label="Sidebar">
      <div className="widget">
        <h4 className="w-title">Lidos<br /><em>recentemente</em></h4>
        <ol className="w-list">
          {mostRecent.map((a, i) =>
          <li key={a.id} onClick={() => onOpen(a)}>
              <span className="w-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="w-it-title">{a.titulo}</p>
                <p className="w-it-meta">{fmtDate(a.data)}</p>
              </div>
            </li>
          )}
        </ol>
      </div>

      <div className="widget" id="arquivo">
        <h4 className="w-title">Arquivo<br /><em>por ano</em></h4>
        <ul className="w-arc">
          {years.map(([y, n]) =>
          <li key={y}>
              <span>{y}</span>
              <span className="dots" />
              <em>{n}</em>
            </li>
          )}
        </ul>
      </div>

      <div className="widget">
        <h4 className="w-title">Temas<br /><em>mais lidos</em></h4>
        <ul className="w-auth">
          {topCats.map(([name, n]) =>
          <li key={name} onClick={() => setFilter(name)} style={{ cursor: 'pointer' }}>
              <span>{name}</span>
              <em>{n} {n === 1 ? 'texto' : 'textos'}</em>
            </li>
          )}
        </ul>
      </div>

      <div className="widget widget-quote">
        <p className="qmark">“</p>
        <p className="quote">
          Porque não me envergonho do evangelho de Cristo, pois é o poder
          de Deus para a salvação de todo aquele que crê;
          <em>primeiro do judeu, e também do grego.</em>
        </p>
        <span className="quote-attr">Romanos 1:16</span>
      </div>
    </aside>);

}

// ─── TOP RIBBON (thin · just the motto, no CTAs) ───────────────────────
function TopRibbon({ onOpenPrayer }) {
  const [open, setOpen] = useState(false);
  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'he', label: 'עברית' },
    { code: 'fr', label: 'Français' },
    { code: 'it', label: 'Italiano' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ru', label: 'Русский' },
    { code: 'uk', label: 'Українська' },
    { code: 'zh-CN', label: '中文' }
  ];
  const translateTo = (code) => {
    setOpen(false);

    // 1. Try the embedded Google Translate widget (fastest, in-page)
    const sel = document.querySelector('.goog-te-combo');
    if (sel) {
      sel.value = code;
      sel.dispatchEvent(new Event('change'));
      return;
    }

    // 2. Cookie + reload fallback (requires GT script to be loaded)
    const setC = (v, domain) => {
      document.cookie = `googtrans=${v}; path=/; domain=${domain || location.hostname}`;
    };
    setC(`/pt/${code}`);
    setC(`/pt/${code}`, '.' + location.hostname);
    location.reload();
  };
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  return (
    <div className="top-ribbon top-ribbon-thin" data-screen-label="Top ribbon">
      <div className="tr-inner">
        <span className="tr-motto">
          <span className="tr-motto-i">✶</span>
          <em>Israel</em> e <em>Missões&nbsp;Urbanas</em>
        </span>
        <div className="tr-translate" onClick={(e) => e.stopPropagation()}>
          <button className="tr-translate-btn" onClick={() => setOpen(o => !o)}>
            <span className="tr-globe">🌐</span>
            <span className="tr-translate-label">Translate</span>
            <span className="tr-caret">{open ? '▴' : '▾'}</span>
          </button>
          {open && (
            <div className="tr-menu">
              <p className="tr-menu-head">Traduzir esta página</p>
              {LANGS.map(l => (
                <button key={l.code} className="tr-menu-item" onClick={() => translateTo(l.code)}>
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>);

}

// ─── MANIFESTO BAR (below brand title, editorial style) ────────────────
function ManifestoBar({ onOpenPrayer }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle('mb-pinned', !entry.isIntersecting);
      },
      { rootMargin: '-1px 0px 0px 0px', threshold: 0 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div className="manifesto-bar" data-screen-label="Manifesto bar" ref={ref}>
        <div className="mb-inner">
          <div className="mb-left">
            <span className="mb-tag">
              <span className="mb-tag-dot" /> Edição 2026
            </span>
          </div>

          <div className="mb-center">
            <p className="mb-statement">
              Um arquivo vivo de <em>fé</em>, <em>intercessão</em> e <em>justiça</em> —
              sustentado por quem crê que <em>Israel</em> e as <em>missões urbanas</em>
              são o mesmo chamado.
            </p>
          </div>

          <div className="mb-right">
            <button className="mb-action mb-action-pray" onClick={onOpenPrayer}>
              <span className="mb-action-ic">✶</span>
              <span className="mb-action-txt">
                <span className="mb-action-l1">Coloque seu</span>
                <span className="mb-action-l2">pedido de oração</span>
              </span>
              <span className="mb-action-arr">→</span>
            </button>
            <a
              className="mb-action mb-action-give"
              href="#apoie"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('apoie')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}>
              
              <span className="mb-action-ic">♡</span>
              <span className="mb-action-txt">
                <span className="mb-action-l1">Apoie a obra</span>
                <span className="mb-action-l2">livros · vídeos · pobres</span>
              </span>
              <span className="mb-action-arr">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating version — appears when original scrolled out */}
      <div className="manifesto-floating" data-screen-label="Manifesto floating">
        <div className="mf-inner">
          <a className="mf-brand" href="#" onClick={(e) => {e.preventDefault();window.scrollTo({ top: 0, behavior: 'smooth' });}}>
            <img src="assets/idi-logo.png" alt="" className="mf-logo" />
            <span className="mf-name">
              <strong>IDI</strong>
              <em>Dia a Dia</em>
            </span>
          </a>

          <span className="mf-motto">
            <span className="mb-tag-dot" />
            <em>Israel</em> e <em>Missões Urbanas</em>
          </span>

          <div className="mf-actions">
            <button className="mb-action mb-action-pray mb-action-compact" onClick={onOpenPrayer}>
              <span className="mb-action-ic">✶</span>
              <span className="mb-action-l2">Pedido de oração</span>
            </button>
            <a
              className="mb-action mb-action-give mb-action-compact"
              href="#apoie"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('apoie')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}>
              
              <span className="mb-action-ic">♡</span>
              <span className="mb-action-l2">Apoie</span>
              <span className="mb-action-arr">→</span>
            </a>
          </div>
        </div>
      </div>
    </>);

}

// ─── TOP RIBBON OLD (REMOVED) ──────────────────────────────────────────

// ─── PRAYER MODAL (lightbox) ───────────────────────────────────────────
const PRAYER_KEY_FOR_MODAL = 'idi_prayers_v1';

function PrayerModal({ onClose, onSubmitted }) {
  const [form, setForm] = useState({ nome: '', cidade: '', pedido: '', anon: false });
  const [step, setStep] = useState('form'); // form | candle
  const [savedItem, setSavedItem] = useState(null);

  useEffect(() => {
    const onKey = (e) => {if (e.key === 'Escape') onClose();};
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.pedido.trim()) return;
    const nome = form.anon ? 'Anônimo' : form.nome.trim() || 'Anônimo';
    const item = {
      id: Date.now(),
      nome,
      cidade: form.cidade.trim() || '—',
      pedido: form.pedido.trim(),
      data: Date.now()
    };
    // Save to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem(PRAYER_KEY_FOR_MODAL) || '[]');
      stored.unshift(item);
      localStorage.setItem(PRAYER_KEY_FOR_MODAL, JSON.stringify(stored));
    } catch (_) {}
    setSavedItem(item);
    setStep('candle');
    if (onSubmitted) onSubmitted(item);
  };

  return (
    <div className="overlay overlay-prayer" onClick={(e) => {if (e.target.classList.contains('overlay')) onClose();}}>
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="reader-close pm-close" onClick={onClose} aria-label="Fechar">
          <span>fechar</span>
          <span className="rc-x">×</span>
        </button>

        {step === 'form' ?
        <div className="pm-form-wrap">
            <header className="pm-head">
              <span className="kicker pt-kicker">
                <span className="pt-dot" /> Muro de oração · livro vivo
              </span>
              <h2 className="pm-title">
                Escreva seu <em>pedido</em>.
              </h2>
              <p className="pm-deck">
                Quando você envia, acendemos uma vela simbólica no livro —
                e intercessores do IDI no Brasil, na América Latina e em Israel
                leem com respeito. <em>Quem ora, ora pelos outros também</em>.
              </p>
            </header>

            <form className="prayer-form pm-form" onSubmit={submit}>
              <div className="pf-row-2">
                <label className="pf-field">
                  <span>Seu nome</span>
                  <input
                  type="text"
                  placeholder={form.anon ? 'Anônimo' : 'Como gostaria de assinar?'}
                  value={form.nome}
                  disabled={form.anon}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                
                </label>
                <label className="pf-field">
                  <span>Cidade · país</span>
                  <input
                  type="text"
                  placeholder="Ex.: Rio de Janeiro · BR"
                  value={form.cidade}
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
                
                </label>
              </div>

              <label className="pf-field">
                <span>Seu pedido de oração</span>
                <textarea
                rows="5"
                placeholder="Escreva sua oração, intenção ou agradecimento. Será lido com respeito."
                value={form.pedido}
                onChange={(e) => setForm({ ...form, pedido: e.target.value })}
                required
                autoFocus />
              
              </label>

              <label className="pf-check">
                <input
                type="checkbox"
                checked={form.anon}
                onChange={(e) => setForm({ ...form, anon: e.target.checked })} />
              
                <span>Quero assinar como <em>Anônimo</em></span>
              </label>

              <button type="submit" className="cta cta-big pm-submit">
                Acender a vela <span className="cta-arrow">→</span>
              </button>
            </form>
          </div> :

        <div className="pm-candle-wrap">
            <Candle />
            <h2 className="pm-candle-title">
              Sua vela está <em>acesa</em>.
            </h2>
            <p className="pm-candle-deck">
              O pedido de <strong>{savedItem.nome}</strong>
              {savedItem.cidade !== '—' && <> em <strong>{savedItem.cidade}</strong></>} foi
              registrado no livro vivo de oração.
              <br />
              <em>"Vede que vossa oração suba como incenso." — Sl 141:2</em>
            </p>
            <div className="pm-candle-actions">
              <button
              className="cta cta-ghost"
              onClick={() => {onClose();setTimeout(() => document.getElementById('oracao')?.scrollIntoView({ behavior: 'smooth' }), 100);}}>
              
                Ver o livro de pedidos <span className="cta-arrow">↓</span>
              </button>
              <button className="pm-close-2" onClick={onClose}>
                fechar
              </button>
            </div>
          </div>
        }
      </div>
    </div>);

}

// ─── CANDLE SVG (animated) ─────────────────────────────────────────────
function Candle() {
  return (
    <div className="candle" role="img" aria-label="Vela acesa">
      <div className="candle-halo" />
      <svg className="candle-svg" viewBox="0 0 120 220" xmlns="http://www.w3.org/2000/svg">
        {/* Plate */}
        <ellipse cx="60" cy="208" rx="46" ry="6" fill="rgba(20,18,12,0.18)" />
        <ellipse cx="60" cy="206" rx="42" ry="5" fill="oklch(0.55 0.12 50)" />
        <ellipse cx="60" cy="204" rx="42" ry="4" fill="oklch(0.62 0.10 60)" />
        {/* Body */}
        <rect x="42" y="80" width="36" height="125" rx="3" fill="url(#waxGrad)" />
        <rect x="42" y="80" width="6" height="125" rx="3" fill="oklch(0.86 0.06 80)" opacity="0.7" />
        <rect x="74" y="80" width="3" height="125" rx="1.5" fill="rgba(20,18,12,0.15)" />
        {/* Top of candle (drip) */}
        <ellipse cx="60" cy="80" rx="18" ry="4" fill="oklch(0.88 0.07 75)" />
        <path d="M 50 80 Q 52 92 49 100 Q 47 96 50 80 Z" fill="oklch(0.78 0.08 75)" opacity="0.5" />
        {/* Wick */}
        <rect x="59" y="62" width="2" height="20" rx="1" fill="#3a2410" />
        {/* Flame */}
        <g className="candle-flame">
          <path
            className="flame-outer"
            d="M 60 28 C 78 40 80 60 60 66 C 40 60 42 40 60 28 Z"
            fill="url(#flameGrad)" />
          
          <path
            className="flame-inner"
            d="M 60 38 C 70 45 71 58 60 62 C 49 58 50 45 60 38 Z"
            fill="oklch(0.88 0.16 80)" />
          
          <ellipse cx="60" cy="56" rx="3" ry="6" fill="oklch(0.45 0.18 280)" opacity="0.6" />
        </g>
        <defs>
          <linearGradient id="waxGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.94 0.05 80)" />
            <stop offset="100%" stopColor="oklch(0.84 0.07 70)" />
          </linearGradient>
          <radialGradient id="flameGrad" cx="0.5" cy="0.7">
            <stop offset="0%" stopColor="oklch(0.92 0.18 80)" />
            <stop offset="60%" stopColor="oklch(0.72 0.18 55)" />
            <stop offset="100%" stopColor="oklch(0.45 0.18 30 / 0.3)" />
          </radialGradient>
        </defs>
      </svg>
    </div>);

}

// ─── IDI HIGHLIGHT STRIP (colorful banner above hero) ──────────────────
function IDIHighlight() {
  const total = ARTICLES.length;
  const cats = [...new Set(ARTICLES.map((a) => a.categoria))].length;
  return (
    <section className="idi-highlight" data-screen-label="IDI highlight">
      <div className="idi-highlight-inner">
        <div className="idi-hl-marquee" aria-hidden="true">
          <div className="idi-hl-track">
            {[...Array(2)].map((_, k) =>
            <span key={k} className="idi-hl-row">
                <span>Israel & a Igreja</span>
                <em>·</em>
                <span>Profecia</span>
                <em>·</em>
                <span>Festas Bíblicas</span>
                <em>·</em>
                <span>Torah</span>
                <em>·</em>
                <span>Intercessão</span>
                <em>·</em>
                <span>Formação Interior</span>
                <em>·</em>
                <span>Liderança Apostólica</span>
                <em>·</em>
                <span>Antissemitismo & Sionismo</span>
                <em>·</em>
              </span>
            )}
          </div>
        </div>

        <div className="idi-hl-card">
          <div className="idi-hl-l">
            <span className="idi-hl-kicker">
              <span className="idi-hl-dot" /> Edição diária · vol. iii
            </span>
            <h2 className="idi-hl-title">
              O <em>arquivo IDI</em><br />
              em português.
            </h2>
            <p className="idi-hl-deck">
              <strong>{total}</strong> reflexões traduzidas e curadas para
              o corpo de Yeshua em língua portuguesa, organizadas em
              <strong> {cats} temas</strong> — leitura para cada manhã,
              cada semana, cada estação.
            </p>
          </div>

          <ul className="idi-hl-stats">
            <li>
              <span className="idi-hl-num">{total}</span>
              <span className="idi-hl-lbl">reflexões</span>
            </li>
            <li>
              <span className="idi-hl-num">{cats}</span>
              <span className="idi-hl-lbl">temas</span>
            </li>
            <li>
              <span className="idi-hl-num">7+</span>
              <span className="idi-hl-lbl">anos de arquivo</span>
            </li>
          </ul>
        </div>
      </div>
    </section>);

}

// ─── PRAYER TEASER (colorful CTA banner) ───────────────────────────────
function PrayerTeaser() {
  const [prayers, setPrayers] = useState([]);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('idi_prayers_v1') || '[]');
      setPrayers(stored.slice(0, 8));
    } catch (_) {
      setPrayers([]);
    }
  }, []);

  const fallback = [
  { nome: 'Família Albuquerque', cidade: 'Recife · PE' },
  { nome: 'Rebeca M.', cidade: 'Belo Horizonte · MG' },
  { nome: 'Anônimo', cidade: 'Buenos Aires · AR' },
  { nome: 'Pr. Daniel Castro', cidade: 'Bogotá · CO' }];

  const list = prayers.length ? prayers : fallback;

  const scrollToPrayer = (e) => {
    e.preventDefault();
    document.getElementById('oracao')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="prayer-teaser" data-screen-label="Prayer teaser">
      <div className="pt-blob pt-blob-1" aria-hidden="true" />
      <div className="pt-blob pt-blob-2" aria-hidden="true" />
      <div className="pt-blob pt-blob-3" aria-hidden="true" />

      <div className="pt-inner">
        <div className="pt-left">
          <span className="kicker pt-kicker">
            <span className="pt-dot" /> Muro de oração · livro vivo
          </span>
          <h2 className="pt-title">
            Antes de seguir,<br />
            <em>pare</em> e <em>ore</em>.
          </h2>
          <p className="pt-deck">
            O IDI mantém um livro vivo de intercessão — pedidos de irmãos
            no Brasil, na América Latina e em Israel. Adicione o seu;
            interceda por outros. <em>Quem ora, ora pelos outros também</em>.
          </p>

          <div className="pt-actions">
            <a className="cta cta-big pt-cta" href="#oracao" onClick={scrollToPrayer}>
              Escrever meu pedido <span className="cta-arrow">→</span>
            </a>
            <a className="pt-cta-2" href="#oracao" onClick={scrollToPrayer}>
              ler o livro
            </a>
          </div>
        </div>

        <div className="pt-right">
          <div className="pt-book">
            <header className="pt-book-head">
              <span className="pt-book-kicker">Pedidos recentes</span>
              <span className="pt-book-live">
                <span className="pt-pulse" /> vivo
              </span>
            </header>

            <ul className="pt-names">
              {list.slice(0, 4).map((p, i) =>
              <li key={i} className="pt-name-item" style={{ animationDelay: `${i * 0.12}s` }}>
                  <span className="pt-name-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="pt-name-body">
                    <p className="pt-name">{p.nome}</p>
                    <p className="pt-name-city">{p.cidade}</p>
                  </div>
                  <span className="pt-name-mark">✶</span>
                </li>
              )}
            </ul>

            <a className="pt-book-foot" href="#oracao" onClick={scrollToPrayer}>
              <span>+ outros pedidos no livro completo</span>
              <span className="pt-book-arr">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>);

}

// ─── CUFI BLOG SECTION ─────────────────────────────────────────────────
function CUFISection() {
  const [catFilter, setCatFilter] = useState('todos');
  const cats = [...new Set(CUFI_POSTS.map((p) => p.categoria))];
  const posts = CUFI_POSTS.filter((p) => catFilter === 'todos' || p.categoria === catFilter);

  return (
    <section className="cufi-section" id="cufi" data-screen-label="CUFI">
      <div className="cufi-bg" aria-hidden="true">
        <span className="cufi-blob cufi-blob-1" />
        <span className="cufi-blob cufi-blob-2" />
      </div>
      <div className="cufi-inner">
        <header className="bty-head">
          <div className="bty-head-l">
            <span className="kicker kicker-light">Direto da CUFI · Christians United for Israel</span>
            <h2 className="section-title section-title-light">
              <em>Cristãos</em> em defesa<br />
              de <em>Israel</em>.
            </h2>
            <p className="bty-deck bty-deck-light">
              Artigos da maior organização cristã pró-Israel do mundo,
              traduzidos para o português pela coordenação do <em>IDI Brasil</em>.
              Análise política, ensino bíblico e enfrentamento direto da
              teologia da substituição e do antissemitismo contemporâneo.
            </p>
          </div>
          <div className="bty-head-r">
            <p className="bty-filter-label bty-filter-label-light">por tema</p>
            <div className="bty-filter">
              <button
                className={`f-pill f-pill-dark ${catFilter === 'todos' ? 'active' : ''}`}
                onClick={() => setCatFilter('todos')}>
                
                Todos <span className="f-count">{CUFI_POSTS.length}</span>
              </button>
              {cats.map((c) =>
              <button
                key={c}
                className={`f-pill f-pill-dark ${catFilter === c ? 'active' : ''}`}
                onClick={() => setCatFilter(c)}>
                
                  {c} <span className="f-count">{CUFI_POSTS.filter((p) => p.categoria === c).length}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="cufi-grid">
          {posts.map((p, i) =>
          <a key={i} className="cufi-card" href={p.url} target="_blank" rel="noopener">
              <div className="cufi-card-img">
                <img src={p.img} alt={p.titulo} loading="lazy" />
                <span className="cufi-card-cat">{p.categoria}</span>
              </div>
              <div className="cufi-card-body">
                <p className="cufi-card-date">{fmtDate(p.data)}</p>
                <h3 className="cufi-card-title">{p.titulo}</h3>
                <p className="cufi-card-deck">{p.resumo}</p>
                <p className="cufi-card-foot">
                  <span><em>{p.autor}</em></span>
                  <span className="cufi-card-go">ler ↗</span>
                </p>
              </div>
            </a>
          )}
        </div>

        <div className="cufi-footer-cta">
          <a className="cta cta-on-dark" href="https://www.cufi.org" target="_blank" rel="noopener">
            Visitar CUFI.org <span className="cta-arrow">↗</span>
          </a>
        </div>
      </div>
    </section>);

}

// ─── PRAYER WALL ───────────────────────────────────────────────────────
const PRAYER_KEY = 'idi_prayers_v1';

function PrayerWall() {
  const [prayers, setPrayers] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(PRAYER_KEY) || '[]');
      if (stored.length) return stored;
    } catch (_) {}
    // Seed with a few example prayers (so the book never looks empty)
    return [
    { id: 1, nome: 'Família Albuquerque', cidade: 'Recife · PE', pedido: 'Pela cura da minha mãe Maria, que está internada. Que o Eterno levante seu corpo e console nossos corações.', data: Date.now() - 1000 * 60 * 60 * 24 * 3 },
    { id: 2, nome: 'Rebeca M.', cidade: 'Belo Horizonte · MG', pedido: 'Por sabedoria nas escolhas vocacionais e pela paz da nação de Israel — shalom Yerushalayim.', data: Date.now() - 1000 * 60 * 60 * 24 * 7 },
    { id: 3, nome: 'Anônimo', cidade: 'Buenos Aires · AR', pedido: 'Pela conversão de meu marido e pela unidade da minha casa. Que Yeshua reine entre nós.', data: Date.now() - 1000 * 60 * 60 * 24 * 12 },
    { id: 4, nome: 'Pr. Daniel Castro', cidade: 'Bogotá · CO', pedido: 'Pela igreja latino-americana — que entenda seu chamado de servir a Israel nas nações.', data: Date.now() - 1000 * 60 * 60 * 24 * 18 }];

  });

  const [form, setForm] = useState({ nome: '', cidade: '', pedido: '', anon: false });
  const [submitted, setSubmitted] = useState(false);
  const [intercessions, setIntercessions] = useState(() => {
    try {return JSON.parse(localStorage.getItem(PRAYER_KEY + '_intercessions') || '{}');} catch (_) {return {};}
  });

  useEffect(() => {
    localStorage.setItem(PRAYER_KEY, JSON.stringify(prayers));
  }, [prayers]);
  useEffect(() => {
    localStorage.setItem(PRAYER_KEY + '_intercessions', JSON.stringify(intercessions));
  }, [intercessions]);

  const fmtRelative = (ts) => {
    const diff = Date.now() - ts;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'hoje';
    if (days === 1) return 'ontem';
    if (days < 7) return `há ${days} dias`;
    if (days < 30) return `há ${Math.floor(days / 7)} semanas`;
    return `há ${Math.floor(days / 30)} meses`;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.pedido.trim()) return;
    const nome = form.anon ? 'Anônimo' : form.nome.trim() || 'Anônimo';
    const item = {
      id: Date.now(),
      nome,
      cidade: form.cidade.trim() || '—',
      pedido: form.pedido.trim(),
      data: Date.now()
    };
    setPrayers([item, ...prayers]);
    setForm({ nome: '', cidade: '', pedido: '', anon: false });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  const intercede = (id) => {
    setIntercessions({ ...intercessions, [id]: (intercessions[id] || 0) + 1 });
  };

  return (
    <section className="prayer-section" id="oracao" data-screen-label="Prayer wall">
      <div className="prayer-inner">
        <header className="prayer-head">
          <span className="kicker">Muro de oração · livro de pedidos</span>
          <h2 className="section-title">
            Um <em>livro vivo</em><br />
            de intercessão.
          </h2>
          <p className="prayer-deck">
            Compartilhe o que precisa colocar diante do Eterno. Sua oração
            será lida e tocada por intercessores conectados ao IDI no Brasil
            e na América Latina. <em>Quem ora, ora pelos outros também</em>.
          </p>
        </header>

        <div className="prayer-grid">
          <form className="prayer-form" onSubmit={submit}>
            <header className="pf-head">
              <span className="kicker">Escrever um pedido</span>
              <p className="pf-counter">
                <em>{prayers.length}</em> pedidos no livro
              </p>
            </header>

            <div className="pf-row pf-row-2">
              <label className="pf-field">
                <span>Seu nome</span>
                <input
                  type="text"
                  placeholder={form.anon ? 'Anônimo' : 'Como gostaria de assinar?'}
                  value={form.nome}
                  disabled={form.anon}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                
              </label>
              <label className="pf-field">
                <span>Cidade / país</span>
                <input
                  type="text"
                  placeholder="Ex.: Rio de Janeiro · BR"
                  value={form.cidade}
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
                
              </label>
            </div>

            <label className="pf-field">
              <span>Seu pedido de oração</span>
              <textarea
                rows="5"
                placeholder="Escreva sua oração, intenção ou agradecimento. Será lido com respeito."
                value={form.pedido}
                onChange={(e) => setForm({ ...form, pedido: e.target.value })}
                required />
              
            </label>

            <label className="pf-check">
              <input
                type="checkbox"
                checked={form.anon}
                onChange={(e) => setForm({ ...form, anon: e.target.checked })} />
              
              <span>Quero assinar como <em>Anônimo</em></span>
            </label>

            <button type="submit" className="cta cta-big">
              Colocar no livro <span className="cta-arrow">→</span>
            </button>

            {submitted &&
            <div className="pf-thanks">
                <span className="pft-mark">✓</span>
                <span>Seu pedido foi registrado. <em>Shalom</em>.</span>
              </div>
            }
          </form>

          <div className="prayer-book" id="livro">
            <header className="pb-head">
              <span className="kicker">O livro</span>
              <p className="pb-subtitle">
                Pedidos registrados — <em>os mais recentes primeiro</em>
              </p>
            </header>

            <ol className="pb-list">
              {prayers.map((p, i) =>
              <li key={p.id} className="pb-item">
                  <div className="pb-num">{String(i + 1).padStart(3, '0')}</div>
                  <div className="pb-body">
                    <header className="pb-item-head">
                      <h4 className="pb-name">{p.nome}</h4>
                      <span className="pb-when">{fmtRelative(p.data)}</span>
                    </header>
                    <p className="pb-city">{p.cidade}</p>
                    <p className="pb-text">{p.pedido}</p>
                    <button
                    className={`pb-intercede ${intercessions[p.id] ? 'done' : ''}`}
                    onClick={() => intercede(p.id)}
                    title="Marcar que orei por este pedido">
                    
                      <span className="pb-int-ic">✶</span>
                      <span>
                        {intercessions[p.id] ?
                      `Você intercedeu ${intercessions[p.id]}× — Amen` :
                      'Orei por este pedido'}
                      </span>
                    </button>
                  </div>
                </li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </section>);

}

// ─── CONTACT / CONGREGAÇÃO ─────────────────────────────────────────────
function ContactSection() {
  const [pixCopied, setPixCopied] = useState(false);
  const copyPix = () => {
    navigator.clipboard?.writeText('btyeshua@gmail.com');
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };
  return (
    <section className="contact-section" id="contato" data-screen-label="Contact">
      <div className="contact-inner">
        <header className="contact-head">
          <span className="kicker">Fale conosco · congregação conectada</span>
          <h2 className="section-title">
            A congregação do <em>IDI Brasil</em><br />
            é o <em>Ministério BTY</em>.
          </h2>
          <p className="contact-deck">
            O Ministério BTY no Rio de Janeiro é a congregação conectada
            ao IDI no Brasil. Estamos aqui presencialmente, online e a um
            WhatsApp de distância. <em>Venha conhecer, orar, e somar.</em>
          </p>
        </header>

        <div className="contact-grid">
          <article className="contact-card contact-card-whats">
            <span className="cc-ic">✆</span>
            <p className="cc-label">WhatsApp · Brasil</p>
            <p className="cc-value">+55 (21) 98699-6277</p>
            <a
              className="cc-cta"
              href="https://wa.me/5521986996277?text=Shalom!%20Vim%20pelo%20IDI%20Dia%20a%20Dia."
              target="_blank"
              rel="noopener">
              
              Falar agora <span className="cta-arrow">↗</span>
            </a>
          </article>

          <article className="contact-card contact-card-pix">
            <span className="cc-ic">◇</span>
            <p className="cc-label">PIX · doações</p>
            <p className="cc-value cc-pix-key">btyeshua@gmail.com</p>
            <button className="cc-cta" onClick={copyPix}>
              {pixCopied ? 'Chave copiada ✓' : 'Copiar chave PIX'}
            </button>
          </article>

          <article className="contact-card contact-card-cong">
            <span className="cc-ic">⌂</span>
            <p className="cc-label">Congregação · Rio de Janeiro</p>
            <p className="cc-value cc-cong">Ministério BTY</p>
            <p className="cc-addr">R. São Luiz Gonzaga, 1115<br />Benfica · Rio de Janeiro</p>
            <a className="cc-cta" href="https://ministeriobty.com.br" target="_blank" rel="noopener">
              ministeriobty.com.br <span className="cta-arrow">↗</span>
            </a>
          </article>
        </div>

        <div className="contact-channels">
          <header className="cc-channels-head">
            <span className="kicker">Canais & redes sociais</span>
            <div className="rule" />
          </header>
          <div className="contact-channels-grid">
            <a className="ch-card" href="https://www.facebook.com/ministeriobty" target="_blank" rel="noopener">
              <span className="ch-ic">f</span>
              <div>
                <p className="ch-label">Facebook</p>
                <p className="ch-handle">@ministeriobty</p>
              </div>
              <span className="ch-arr">↗</span>
            </a>
            <a className="ch-card" href="https://instagram.com/ministeriobty" target="_blank" rel="noopener">
              <span className="ch-ic">⌾</span>
              <div>
                <p className="ch-label">Instagram</p>
                <p className="ch-handle">@ministeriobty</p>
              </div>
              <span className="ch-arr">↗</span>
            </a>
            <a className="ch-card" href="https://www.youtube.com/ministeriobtytv" target="_blank" rel="noopener">
              <span className="ch-ic">▶</span>
              <div>
                <p className="ch-label">YouTube</p>
                <p className="ch-handle">ministeriobtytv</p>
              </div>
              <span className="ch-arr">↗</span>
            </a>
            <a className="ch-card" href="https://open.spotify.com/show/7nSlW3tZ9u7gZt0TCEt3wR" target="_blank" rel="noopener">
              <span className="ch-ic">♪</span>
              <div>
                <p className="ch-label">Spotify</p>
                <p className="ch-handle">Podcast BTY</p>
              </div>
              <span className="ch-arr">↗</span>
            </a>
            <a className="ch-card" href="https://soundcloud.com/ministeriobty" target="_blank" rel="noopener">
              <span className="ch-ic">~</span>
              <div>
                <p className="ch-label">Soundcloud</p>
                <p className="ch-handle">ministeriobty</p>
              </div>
              <span className="ch-arr">↗</span>
            </a>
            <a className="ch-card" href="https://chat.whatsapp.com/E0fsTN1ZUQyL44s2MqI8kZ" target="_blank" rel="noopener">
              <span className="ch-ic">⌾</span>
              <div>
                <p className="ch-label">Grupo Davar</p>
                <p className="ch-handle">WhatsApp · discipulado</p>
              </div>
              <span className="ch-arr">↗</span>
            </a>
            <a className="ch-card" href="https://www.skool.com/bty" target="_blank" rel="noopener">
              <span className="ch-ic">⊕</span>
              <div>
                <p className="ch-label">Skool BTY</p>
                <p className="ch-handle">comunidade & cursos</p>
              </div>
              <span className="ch-arr">↗</span>
            </a>
            <a className="ch-card" href="https://idisrael.com.br" target="_blank" rel="noopener">
              <span className="ch-ic">★</span>
              <div>
                <p className="ch-label">IDI Israel</p>
                <p className="ch-handle">idisrael.com.br</p>
              </div>
              <span className="ch-arr">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>);

}

// ─── BTY BLOG SECTION ──────────────────────────────────────────────────
function BTYSection() {
  const [authorFilter, setAuthorFilter] = useState('todos');
  const authors = [...new Set(BTY_POSTS.map((p) => p.autor))];
  const posts = BTY_POSTS.filter((p) => authorFilter === 'todos' || p.autor === authorFilter);
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <section className="bty-section" id="bty" data-screen-label="BTY blog">
      <div className="bty-inner">
        <header className="bty-head">
          <div className="bty-head-l">
            <span className="kicker">Direto do BTY · ministeriobty.com.br</span>
            <h2 className="section-title">
              <em>Artigos</em> do<br />
              Ministério&nbsp;BTY.
            </h2>
            <p className="bty-deck">
              Reflexões publicadas no blog do Ministério BTY no Rio de Janeiro
              — parashiot semanais, davar diário e artigos de fundo escritos
              por <em>Ludwig Goulart</em>, <em>Marco Goersch</em> e a equipe BTY.
            </p>
          </div>
          <div className="bty-head-r">
            <p className="bty-filter-label">por autor</p>
            <div className="bty-filter">
              <button
                className={`f-pill ${authorFilter === 'todos' ? 'active' : ''}`}
                onClick={() => setAuthorFilter('todos')}>
                
                Todos <span className="f-count">{BTY_POSTS.length}</span>
              </button>
              {authors.map((a) =>
              <button
                key={a}
                className={`f-pill ${authorFilter === a ? 'active' : ''}`}
                onClick={() => setAuthorFilter(a)}>
                
                  {a} <span className="f-count">{BTY_POSTS.filter((p) => p.autor === a).length}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {featured &&
        <a className="bty-featured" href={featured.url} target="_blank" rel="noopener">
            <div className="bty-feat-img">
              <img src={featured.img} alt={featured.titulo} loading="lazy" />
              <span className="bty-feat-badge">em destaque</span>
            </div>
            <div className="bty-feat-text">
              <div className="bty-feat-meta">
                <span className="bty-cat">{featured.categoria}</span>
                <span className="bty-sep">·</span>
                <span>{fmtDate(featured.data)}</span>
              </div>
              <h3 className="bty-feat-title">{featured.titulo}</h3>
              <p className="bty-feat-deck">{featured.resumo}</p>
              <div className="bty-feat-foot">
                <span className="byline">
                  <span className="byline-name">{featured.autor}</span>
                </span>
                <span className="bty-feat-cta">
                  Ler no BTY <span className="cta-arrow">↗</span>
                </span>
              </div>
            </div>
          </a>
        }

        <div className="bty-grid">
          {rest.map((p, i) =>
          <a key={i} className="bty-card" href={p.url} target="_blank" rel="noopener">
              <div className="bty-card-img">
                <img src={p.img} alt={p.titulo} loading="lazy" />
              </div>
              <div className="bty-card-meta">
                <span className="bty-cat">{p.categoria}</span>
                <span className="bty-sep">·</span>
                <span>{fmtDate(p.data)}</span>
              </div>
              <h4 className="bty-card-title">{p.titulo}</h4>
              <p className="bty-card-deck">{p.resumo}</p>
              <p className="bty-card-author">
                <em>{p.autor}</em>
                <span className="bty-card-arr">↗</span>
              </p>
            </a>
          )}
        </div>

        <div className="bty-footer-cta">
          <div className="rule" />
          <a className="cta cta-ghost" href="https://www.ministeriobty.com.br/blog" target="_blank" rel="noopener">
            Ver todos os artigos no BTY <span className="cta-arrow">↗</span>
          </a>
        </div>
      </div>
    </section>);

}

// ─── COORDINATION (Ludwig) + LATAM BRIDGE (Chaim) ──────────────────────
function CoordinationSection() {
  return (
    <section className="coord" id="coordenacao" data-screen-label="Coordination">
      <div className="coord-inner">
        <header className="coord-head">
          <span className="kicker">A coordenação</span>
          <div className="rule" />
          <h2 className="section-title">
            Uma ponte entre <em>Israel</em>,<br />
            o <em>Brasil</em> e a <em>América Latina</em>.
          </h2>
        </header>

        <div className="coord-grid">
          <article className="coord-card coord-card-main">
            <div className="coord-photo">
              <img src="assets/ludwig.jpg" alt="Ludwig Araunui Goulart" />
              <span className="coord-photo-cap">Ludwig Araunui Goulart · 2024</span>
            </div>
            <div className="coord-text">
              <p className="kicker kicker-accent">Coordenador · Brasil</p>
              <h3 className="coord-name">Ludwig Araunui Goulart</h3>
              <p className="coord-bio">
                Coordenador do <em>IDI Dia a Dia</em> no Brasil e curador da
                tradução do arquivo IDI/BTY para a língua portuguesa. Há
                mais de duas décadas envolvido com missões urbanas, formação
                de líderes e o chamado profético ao povo de Israel, articula
                a ponte entre o ministério em Jerusalém e a igreja de Yeshua
                no Brasil e na América Latina.
              </p>
              <p className="coord-bio">
                Sua leitura editorial parte de uma convicção: a igreja
                latina precisa redescobrir suas raízes hebraicas para
                encontrar a própria identidade — <em>e</em> sua vocação
                de servir a Israel nas nações.
              </p>
              <div className="coord-foot">
                <span className="byline">
                  <span className="byline-pre">contato</span>
                  <span className="byline-name">via IDI&nbsp;Brasil</span>
                </span>
                <a className="cta cta-ghost" href="https://idisrael.com.br" target="_blank" rel="noopener">
                  IDI Israel <span className="cta-arrow">↗</span>
                </a>
              </div>
            </div>
          </article>

          <article className="coord-card coord-card-yakov">
            <div className="yakov-photo">
              <image-slot id="yakov-photo" shape="rect" placeholder="solte aqui uma foto de Yakov Stein"></image-slot>
              <span className="coord-photo-cap">
                Yakov Stein · Manifesto de Israel
              </span>
            </div>
            <p className="kicker kicker-accent">Diretor Geral · Israel</p>
            <h3 className="coord-name coord-name-sm">Yakov Stein</h3>
            <p className="coord-bio">
              Diretor Geral do <em>Manifesto de Israel</em>, Yakov Stein
              é a referência em Jerusalém para a obra do IDI no
              hemisfério sul. Ao lado de Ludwig, articula a formação
              de líderes, conferências e o diálogo profético entre
              Israel e a Igreja em língua portuguesa —
              <em>uma aliança viva entre o país de Yeshua e o corpo nas nações.</em>
            </p>
          </article>
        </div>

        <div className="coord-grid coord-grid-secondary">
          <article className="coord-card coord-card-aside">
            <div className="latam-photo">
              <img src="assets/yakov-ludwig.jpg" alt="Chaim Malespín com Ludwig Goulart" className="chaim-photo-img" />
              <span className="coord-photo-cap">Chaim Malespín com Ludwig Goulart</span>
            </div>
            <p className="kicker kicker-accent">Aliyah Return Center · Israel</p>
            <h3 className="coord-name coord-name-sm">Chaim Malespín</h3>
            <p className="coord-bio">
              Defensor apaixonado de Israel, Chaim é dedicado a compartilhar
              a verdade sobre a história, a cultura e as lutas atuais do
              povo de Israel. Diretor do <em>Aliyah Return Center</em> na
              Galileia, é a ligação viva entre o povo hispano-falante,
              o Brasil e a obra em Jerusalém — articulando, junto a
              Ludwig, encontros que conectam a igreja latino-americana
              à obra profética que se dá em Israel.
            </p>
          </article>

          <article className="coord-card coord-card-network">
            <p className="kicker kicker-accent">A rede conectada</p>
            <h3 className="coord-name coord-name-sm">Onde nos encontrar</h3>
            <ul className="latam-network latam-network-big">
              <li>
                <a href="https://idisrael.com.br" target="_blank" rel="noopener">
                  <strong>idisrael.com.br</strong>
                  <em>congregação conectada · Brasil</em>
                  <span className="netarr">↗</span>
                </a>
              </li>
              <li>
                <a href="https://idisrael.com.br/artigos" target="_blank" rel="noopener">
                  <strong>idisrael.com.br/artigos</strong>
                  <em>biblioteca de artigos publicados</em>
                  <span className="netarr">↗</span>
                </a>
              </li>
              <li>
                <a href="https://ministeriobty.com.br" target="_blank" rel="noopener">
                  <strong>ministeriobty.com.br</strong>
                  <em>BTY · Brasil</em>
                  <span className="netarr">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.skool.com/bty" target="_blank" rel="noopener">
                  <strong>skool.com/bty</strong>
                  <em>Skool da BTY · comunidade & cursos</em>
                  <span className="netarr">↗</span>
                </a>
              </li>
            </ul>
          </article>
        </div>

        <div className="coord-photos">
          <header className="sec-head">
            <span className="kicker">No campo · Brasil</span>
            <div className="rule" />
          </header>
          <div className="coord-photos-grid">
            <figure className="cp-fig cp-fig-wide">
              <image-slot id="dir-br-1" shape="rect" placeholder="foto do diretor no Brasil (paisagem)"></image-slot>
              <figcaption>Encontro IDI · diretor no Brasil</figcaption>
            </figure>
            <figure className="cp-fig">
              <image-slot id="dir-br-2" shape="rect" placeholder="foto · encontro de líderes"></image-slot>
              <figcaption>Encontro de líderes</figcaption>
            </figure>
            <figure className="cp-fig">
              <image-slot id="dir-br-3" shape="rect" placeholder="foto · conferência BTY"></image-slot>
              <figcaption>Conferência BTY</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>);

}

// ─── VIDEOS (YouTube embeds) ───────────────────────────────────────────
const VIDEOS = [
{
  title: 'IDI Israel — Mensagens & Conferências',
  chan: 'idisrael.com.br',
  embed: 'https://www.youtube.com/embed/videoseries?list=PLrAXtmRdnEQyKgGq7M-cWWPwYbN5Lqg6t',
  fallback: 'https://www.youtube.com/results?search_query=idi+igrejas+em+defesa+de+israel',
  site: 'https://idisrael.com.br'
},
{
  title: 'Ministério BTY — Ensinos',
  chan: 'ministeriobty.com.br',
  embed: 'https://www.youtube.com/embed/videoseries?list=PLBTYMinisterioBTY',
  fallback: 'https://www.youtube.com/results?search_query=ministeriobty',
  site: 'https://ministeriobty.com.br'
},
{
  title: 'BTY Skool — Comunidade & Cursos',
  chan: 'skool.com/bty',
  embed: 'https://www.youtube.com/embed/videoseries?list=PLBTYSkoolComunidade',
  fallback: 'https://www.skool.com/bty',
  site: 'https://www.skool.com/bty'
},
{
  title: 'Yakov Stein — Manifesto de Israel',
  chan: 'Manifesto de Israel',
  embed: 'https://www.youtube.com/embed/videoseries?list=PLYakovSteinManifesto',
  fallback: 'https://www.youtube.com/results?search_query=yakov+stein+manifesto+israel',
  site: 'https://idisrael.com.br'
}];


function VideosSection() {
  const [active, setActive] = useState(0);
  const v = VIDEOS[active];
  return (
    <section className="videos" id="videos" data-screen-label="Videos">
      <div className="videos-inner">
        <header className="sec-head">
          <span className="kicker">No vídeo · canais conectados</span>
          <div className="rule" />
        </header>
        <h2 className="section-title">
          Da <em>Galileia</em> ao Brasil — <br />assista as mensagens.
        </h2>

        <div className="videos-grid">
          <div className="video-stage">
            <div className="video-frame">
              <iframe
                src={v.embed}
                title={v.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </div>
            <div className="video-stage-foot">
              <div>
                <p className="kicker kicker-accent">{v.chan}</p>
                <h4 className="video-stage-title">{v.title}</h4>
              </div>
              <a className="cta cta-ghost" href={v.fallback} target="_blank" rel="noopener">
                Ver no YouTube <span className="cta-arrow">↗</span>
              </a>
            </div>
          </div>

          <ol className="video-list">
            {VIDEOS.map((vv, i) =>
            <li
              key={i}
              className={i === active ? 'active' : ''}
              onClick={() => setActive(i)}>
              
                <span className="vl-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="vl-title">{vv.title}</p>
                  <p className="vl-chan">{vv.chan}</p>
                </div>
                <span className="vl-go">▶</span>
              </li>
            )}
          </ol>
        </div>
      </div>
    </section>);

}

// ─── ABOUT THE MINISTRY (since 2000) ───────────────────────────────────
function AboutMinistry() {
  return (
    <section className="about" id="sobre" data-screen-label="About">
      <div className="about-inner">
        <div className="about-l">
          <span className="kicker">Sobre o ministério</span>
          <div className="rule rule-short" />
          <p className="about-since">
            <em>desde</em>
            <span className="about-year">2000</span>
          </p>
        </div>

        <div className="about-c">
          <h2 className="about-title">
            Há mais de <em>duas décadas</em>,<br />
            servindo a <em>plenitude</em> da<br />
            Igreja e de <em>Israel</em>.
          </h2>
          <div className="about-body">
            <p>
              <span className="dropcap">O</span>
              IDI nasceu como uma resposta de fiéis convictos de que
              <em> a Igreja e Israel</em> não são duas histórias paralelas —
              são <em>o mesmo plano de redenção</em>, costurado por Yeshua
              no Espírito. Desde o ano <strong>2000</strong>, este ministério
              tem se dedicado a uma missão simples e profunda: levar o
              entendimento da <em>plenitude</em> da Igreja e de Israel
              ao corpo de Cristo em língua portuguesa.
            </p>
            <p>
              Somos pessoas comuns — pastores, intercessores, professores,
              tradutores, mães, jovens — que decidiram entregar tempo,
              recursos e a própria vida para que essa mensagem
              chegue até onde precisa chegar. Conferências, livros,
              vídeos, encontros nas favelas do Rio, intercâmbios com
              Jerusalém, discipulado de líderes — tudo brota do mesmo
              chamado: <em>Israel e missões urbanas</em>.
            </p>
            <p>
              Em mais de <strong>vinte e cinco anos</strong> de trabalho
              voluntário, nunca tivemos um patrocinador grande, uma
              fundação, uma máquina. Tivemos sempre <em>pessoas</em> —
              irmãos que cuidaram, intercessores que oraram, doadores
              fiéis que sustentaram. <em>É assim que continuamos.</em>
            </p>
          </div>

          <ul className="about-pillars">
            <li>
              <span className="ap-num">01</span>
              <div>
                <h4>Israel</h4>
                <p>Estudo, intercessão e ponte profética com o povo da aliança.</p>
              </div>
            </li>
            <li>
              <span className="ap-num">02</span>
              <div>
                <h4>Missões Urbanas</h4>
                <p>Trabalho permanente nas favelas do Rio e em comunidades pobres.</p>
              </div>
            </li>
            <li>
              <span className="ap-num">03</span>
              <div>
                <h4>Formação</h4>
                <p>Livros, vídeos, conteúdo escrito e discipulado de líderes.</p>
              </div>
            </li>
            <li>
              <span className="ap-num">04</span>
              <div>
                <h4>América Latina</h4>
                <p>Ponte com o povo hispano-falante e congregações irmãs.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="about-r">
          <div className="about-quote">
            <span className="aq-mark">“</span>
            <p className="aq-text">
              Porque, se a sua rejeição é a reconciliação do mundo, qual
              será a sua admissão, <em>senão a vida dentre os mortos?</em>
            </p>
            <p className="aq-attr">Romanos 11:15</p>
          </div>

          <div className="about-stats">
            <div className="as-item">
              <span className="as-num">26+</span>
              <span className="as-lbl">anos de obra</span>
            </div>
            <div className="as-item">
              <span className="as-num">∞</span>
              <span className="as-lbl">voluntária · sem fins lucrativos</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ─── DONATE OPTIONS (PIX copy + WhatsApp + bank) ───────────────────────
function DonateOptions({ amount, fmt }) {
  const PIX_KEY = 'btyeshua@gmail.com';
  const WHATS = '5521986996277';
  const [copied, setCopied] = useState(false);
  const [showPix, setShowPix] = useState(false);

  // Log a donation intention so Ludwig can follow up (table: doacoes).
  // Pre-fills nome/email from the visitor gate if available.
  const logIntent = async (metodo) => {
    let visitante = {};
    try { visitante = JSON.parse(localStorage.getItem(GATE_KEY) || '{}'); } catch (_) {}
    let local = [];
    try { local = JSON.parse(localStorage.getItem('idi_visitantes_local') || '[]'); } catch (_) {}
    const last = local[local.length - 1] || {};
    const row = {
      nome: last.nome || visitante.nome || '',
      email: last.email || '',
      whatsapp: last.whatsapp || '',
      valor: amount,
      metodo,
      status: 'intencao',
      criado_em: new Date().toISOString()
    };
    try {
      if (window.IDI_SB) {
        const { error } = await window.IDI_SB.from('doacoes').insert([row]);
        if (error) console.warn('doacoes insert:', error.message);
      }
    } catch (e) { console.warn('doacao log falhou:', e); }
  };

  const revealPix = () => { setShowPix(true); logIntent('pix'); };

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (_) {
      // Fallback: select the text
      const el = document.getElementById('pix-key-display');
      if (el) {
        const r = document.createRange();
        r.selectNode(el);
        getSelection().removeAllRanges();
        getSelection().addRange(r);
      }
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Olá! Gostaria de apoiar o IDI · Dia a Dia com ${fmt(amount)}. Como faço?`
  );

  return (
    <div className="donate-block">
      <div className="donate-grid">
        {/* PIX — primary */}
        <div className={`donate-card donate-pix ${showPix ? 'open' : ''}`}>
          <div className="donate-head">
            <span className="donate-ic">◇</span>
            <div>
              <p className="donate-label">PIX · instantâneo</p>
              <p className="donate-sub">a forma mais simples · mesma chave para todo Brasil</p>
            </div>
          </div>

          {!showPix ?
          <button className="cta cta-big donate-main" onClick={revealPix}>
              Doar {fmt(amount)} via PIX <span className="cta-arrow">→</span>
            </button> :

          <div className="pix-reveal">
              <p className="pix-instr">
                Copie a chave abaixo e cole no PIX do seu banco.
                <br />
                <em>O valor é definido por você no app do banco.</em>
              </p>
              <div className="pix-box">
                <span className="pix-box-label">CHAVE PIX (e-mail)</span>
                <code id="pix-key-display" className="pix-key">{PIX_KEY}</code>
                <button className="pix-copy" onClick={copyPix}>
                  {copied ?
                <><span className="pix-check">✓</span> Copiado</> :

                <>📋 Copiar chave</>
                }
                </button>
              </div>
              <p className="pix-titular">
                <span>Titular:</span> <strong>Ministério BTY Yeshua</strong>
              </p>
            </div>
          }
        </div>

        {/* WhatsApp · personal contact */}
        <a
          className="donate-card donate-wa"
          href={`https://wa.me/${WHATS}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener"
          onClick={() => logIntent('whatsapp')}>
          
          <div className="donate-head">
            <span className="donate-ic donate-ic-wa">💬</span>
            <div>
              <p className="donate-label">WhatsApp · fale com a gente</p>
              <p className="donate-sub">cartão · transferência · doação mensal</p>
            </div>
          </div>
          <span className="donate-link">
            +55 (21) 98699-6277 <span className="cta-arrow">↗</span>
          </span>
        </a>
      </div>
    </div>);

}

// ─── FUNDRAISING ───────────────────────────────────────────────────────
function FundraisingSection() {
  const [goal, setGoal] = useState(1500000);
  const [raised, setRaised] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [donate, setDonate] = useState(150);
  const pct = goal > 0 ? Math.min(100, raised / goal * 100) : 0;
  const fmt = (n) => 'R$ ' + Number(n || 0).toLocaleString('pt-BR');

  // Read the LIVE campaign total from Supabase (table: campanha, row id=1).
  // Ludwig updates "arrecadado" as PIX donations come in — the bar reflects
  // the real number. Falls back gracefully if the table isn't there yet.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (window.IDI_SB) {
          const { data, error } = await window.IDI_SB
            .from('campanha').select('*').eq('id', 1).maybeSingle();
          if (!error && data && alive) {
            if (typeof data.meta === 'number') setGoal(data.meta);
            if (typeof data.arrecadado === 'number') setRaised(data.arrecadado);
          }
        }
      } catch (e) {
        console.warn('campanha indisponível:', e);
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section className="fundraising" id="apoie" data-screen-label="Fundraising">
      <div className="fund-inner">
        <header className="fund-head">
          <span className="kicker">Campanha 2026 · apoie a base</span>
          <div className="rule" />
          <h2 className="section-title">
            Encontros, conferências e a <em>base de amor e justiça</em>.
          </h2>
          <p className="fund-deck">
            Estamos levantando <strong>{fmt(goal)}</strong> para desenvolver
            a área de encontros do IDI Brasil — conferências regulares,
            formação de líderes, e o trabalho permanente da Base de
            Amor e Justiça que une o ministério em Israel ao corpo de
            Yeshua na América Latina.
          </p>
        </header>

        <div className="fund-card">
          <div className="fund-numbers">
            <div className="fund-raised">
              <p className="fund-label">arrecadado até hoje</p>
              <p className="fund-amount">{loaded ? fmt(raised) : '···'}</p>
            </div>
            <div className="fund-divider" />
            <div className="fund-goal">
              <p className="fund-label">meta da campanha</p>
              <p className="fund-amount fund-amount-goal">{fmt(goal)}</p>
            </div>
            <div className="fund-divider" />
            <div className="fund-pct">
              <p className="fund-label">conquistado</p>
              <p className="fund-amount fund-amount-pct">{pct.toFixed(1)}<span>%</span></p>
            </div>
          </div>

          <div className="fund-bar-wrap">
            <div className="fund-bar">
              <div className="fund-bar-fill" style={{ width: `${pct}%` }}>
                <span className="fund-bar-marker" />
              </div>
              {[25, 50, 75].map((t) =>
              <span key={t} className="fund-bar-tick" style={{ left: `${t}%` }}>
                  <span className="ftick-l">{t}%</span>
                </span>
              )}
            </div>
            <div className="fund-bar-foot">
              <span>R$ 0</span>
              <span>{fmt(goal / 2)}</span>
              <span>{fmt(goal)}</span>
            </div>
          </div>

          <div className="fund-buckets">
            <div className="fund-bucket">
              <h4>Encontros</h4>
              <p>4 conferências regionais/ano · Sul, SP, NE, Brasília</p>
            </div>
            <div className="fund-bucket">
              <h4>Formação</h4>
              <p>Trilhas de discipulado e cursos pela rede IDI · BTY</p>
            </div>
            <div className="fund-bucket">
              <h4>Base de Amor e Justiça</h4>
              <p>Sede de oração, hospedagem, intercâmbio com Israel</p>
            </div>
          </div>

          <div className="fund-donate">
            <p className="kicker">Doe agora</p>
            <div className="fund-presets">
              {[50, 100, 150, 300, 500, 1000].map((v) =>
              <button
                key={v}
                className={`fund-preset ${donate === v ? 'active' : ''}`}
                onClick={() => setDonate(v)}>
                
                  R$ {v}
                </button>
              )}
              <div className="fund-custom">
                <span>R$</span>
                <input
                  type="number"
                  min="10"
                  value={donate}
                  onChange={(e) => setDonate(Math.max(10, +e.target.value || 0))} />
                
              </div>
            </div>

            <DonateOptions amount={donate} fmt={fmt} />

            <p className="fund-fine">
              recibo enviado por email · ministério sem fins lucrativos · CNPJ disponível sob pedido
            </p>
          </div>
        </div>
      </div>
    </section>);

}

// ─── NEWSLETTER ────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done | err
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {setState('err');return;}
    setState('sending');
    setTimeout(() => setState('done'), 800);
  };
  return (
    <section className="newsletter" data-screen-label="Newsletter">
      <div className="news-inner">
        <div className="news-l">
          <span className="kicker">Boletim semanal</span>
          <h3 className="news-title">
            Receba a <em>palavra</em> de cada manhã.
          </h3>
          <p className="news-deck">
            Uma reflexão por semana, na sua caixa. Sem ruído.
            Sem propaganda. Apenas a Escritura, lida no contexto
            do movimento messiânico em Israel e nas nações.
          </p>
        </div>
        <form className="news-r" onSubmit={submit}>
          {state === 'done' ?
          <div className="news-done">
              <p className="news-done-mark">✓</p>
              <p>Cadastro confirmado. Em paz, <em>shalom</em>.</p>
            </div> :

          <>
              <label>seu endereço de email</label>
              <div className="news-input">
                <input
                type="email"
                value={email}
                placeholder="ex.: maria@exemplo.com"
                onChange={(e) => {setEmail(e.target.value);setState('idle');}} />
              
                <button type="submit" disabled={state === 'sending'}>
                  {state === 'sending' ? '…' : 'Inscrever'}
                </button>
              </div>
              {state === 'err' && <p className="news-err">— informe um email válido.</p>}
              <p className="news-fine">
                ao se inscrever você concorda em receber um email semanal.
                cancele quando quiser.
              </p>
            </>
          }
        </form>
      </div>
    </section>);

}

// ─── SHARE BAR ─────────────────────────────────────────────────────────
function ShareBar({ article }) {
  const [copied, setCopied] = useState(false);

  // Build a deep link to this post. /p/<slug> is served by a Netlify
  // edge function that gives WhatsApp/Facebook the post's OWN image.
  const base = window.location.origin;
  const id = encodeURIComponent(article.slug || article.id);
  const link = `${base}/p/${id}`;
  const text = `${article.titulo} — IDI · Dia a Dia`;

  const targets = [
    {
      name: 'WhatsApp',
      cls: 'sh-wa',
      icon: '🟢',
      url: `https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`
    },
    {
      name: 'Facebook',
      cls: 'sh-fb',
      icon: 'f',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`
    },
    {
      name: 'X',
      cls: 'sh-x',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`
    },
    {
      name: 'Telegram',
      cls: 'sh-tg',
      icon: '✈',
      url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`
    },
    {
      name: 'Email',
      cls: 'sh-em',
      icon: '✉',
      url: `mailto:?subject=${encodeURIComponent(article.titulo)}&body=${encodeURIComponent(text + '\n\n' + link)}`
    }
  ];

  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: article.titulo, text, url: link }); } catch (_) {}
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {}
  };

  return (
    <div className="sharebar">
      <span className="sharebar-label">Compartilhe esta reflexão</span>
      <div className="sharebar-row">
        {targets.map(t => (
          <a
            key={t.name}
            className={`sh-btn ${t.cls}`}
            href={t.url}
            target="_blank"
            rel="noopener"
            aria-label={`Compartilhar no ${t.name}`}
            title={t.name}
          >
            <span className="sh-ic">{t.icon}</span>
          </a>
        ))}
        <button className={`sh-btn sh-copy ${copied ? 'copied' : ''}`} onClick={copyLink} title="Copiar link">
          <span className="sh-ic">{copied ? '✓' : '🔗'}</span>
        </button>
        {typeof navigator !== 'undefined' && navigator.share && (
          <button className="sh-btn sh-more" onClick={nativeShare} title="Mais opções">
            <span className="sh-ic">⋯</span>
          </button>
        )}
      </div>
      {copied && <span className="sharebar-copied">Link copiado!</span>}
    </div>
  );
}

// ─── ARTICLE MODAL ─────────────────────────────────────────────────────
function ArticleModal({ article, onClose, onOpen }) {
  const [progress, setProgress] = useState(0);
  const [audioState, setAudioState] = useState('paused'); // paused | playing
  const [audioPos, setAudioPos] = useState(0); // 0-1
  const contentRef = useRef(null);
  const audioRef = useRef(null);

  // Reading progress
  useEffect(() => {
    const el = document.querySelector('.modal-scroll');
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    el.addEventListener('scroll', onScroll);
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [article]);

  // Real audio narration via the browser's Speech Synthesis (pt-BR)
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const fullText = `${article.titulo}. ${article.resumo ? article.resumo + '. ' : ''}${article.conteudo}`;

  useEffect(() => {
    if (!ttsSupported) return;
    if (audioState !== 'playing') return;

    // If paused mid-way, resume instead of restarting
    if (window.speechSynthesis.paused && window.speechSynthesis.speaking) {
      window.speechSynthesis.resume();
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(fullText);
    utter.lang = 'pt-BR';
    utter.rate = 0.96;
    utter.pitch = 1;

    // Prefer a Portuguese voice if available
    const voices = synth.getVoices();
    const ptVoice = voices.find((v) => /pt[-_]?BR/i.test(v.lang)) || voices.find((v) => /^pt/i.test(v.lang));
    if (ptVoice) utter.voice = ptVoice;

    const totalChars = fullText.length || 1;
    utter.onboundary = (e) => {
      if (typeof e.charIndex === 'number') {
        setAudioPos(Math.min(1, e.charIndex / totalChars));
      }
    };
    utter.onend = () => {setAudioState('paused');setAudioPos(0);};
    utter.onerror = () => {setAudioState('paused');};

    synth.speak(utter);

    // Chrome bug workaround: long narrations auto-stop after ~15s.
    // Nudging pause/resume keeps it going.
    const keepAlive = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearInterval(keepAlive);
      }
    }, 10000);

    return () => clearInterval(keepAlive);
  }, [audioState, article.id, ttsSupported]);

  // Toggle play / pause
  const toggleAudio = () => {
    if (!ttsSupported) {
      alert('Seu navegador não suporta narração por voz.');
      return;
    }
    const synth = window.speechSynthesis;
    if (audioState === 'playing') {
      synth.pause();
      setAudioState('paused');
    } else {
      setAudioState('playing');
    }
  };

  // Stop narration when the article changes or the modal unmounts
  useEffect(() => {
    return () => {if (ttsSupported) window.speechSynthesis.cancel();};
  }, []);

  // Reset when article changes
  useEffect(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setAudioPos(0);
    setAudioState('paused');
    const el = document.querySelector('.modal-scroll');
    if (el) el.scrollTop = 0;
  }, [article.id]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {if (e.key === 'Escape') onClose();};
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const paragraphs = article.conteudo.split('\n\n').map((p) => p.trim()).filter(Boolean);
  const rt = readingTime(article.conteudo);

  // Related articles: same category, exclude this one
  const related = ARTICLES.filter((a) => a.categoria === article.categoria && a.id !== article.id).slice(0, 3);

  const totalAudioSec = rt * 60;
  const curSec = Math.floor(audioPos * totalAudioSec);
  const fmtSec = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="overlay" onClick={(e) => {if (e.target.classList.contains('overlay')) onClose();}}>
      <div className="reader" onClick={(e) => e.stopPropagation()}>
        <div className="reader-progress" style={{ transform: `scaleX(${progress})` }} />

        <button className="reader-close" onClick={onClose} aria-label="Fechar">
          <span>fechar</span>
          <span className="rc-x">×</span>
        </button>

        <div className="modal-scroll">
          <div className="reader-content">
            <div className="reader-top">
              <p className="rt-kicker">{article.categoria}</p>
              <div className="rule rule-short" />
              <h1 className="rt-title">{article.titulo}</h1>
              <p className="rt-deck">{article.resumo}</p>
              <div className="rt-meta">
                <span><em>{article.autor}</em></span>
                <span className="rt-sep">·</span>
                <span>{fmtDate(article.data, true)}</span>
                <span className="rt-sep">·</span>
                <span>{rt} min de leitura</span>
              </div>
            </div>

            {article.imagem && (
              <figure className="reader-cover">
                <img src={article.imagem} alt={article.titulo} loading="lazy" />
              </figure>
            )}

            <div className="audio-player">
              <button className="ap-play" onClick={toggleAudio}>
                {audioState === 'playing' ? '❚❚' : '▶'}
              </button>
              <div className="ap-meta">
                <p className="ap-label">{audioState === 'playing' ? 'narrando…' : 'ouça este artigo · narração'}</p>
                <div className="ap-bar">
                  <div className="ap-bar-fill" style={{ width: `${audioPos * 100}%` }} />
                </div>
                <div className="ap-times">
                  <span>{fmtSec(curSec)}</span>
                  <span>{fmtSec(totalAudioSec)}</span>
                </div>
              </div>
            </div>

            {article.video_url && (
              <div className="reader-video">
                <span className="kicker">Vídeo · assista</span>
                {article.video_url.includes('youtube.com/embed') ? (
                  <div className="reader-video-frame">
                    <iframe
                      src={article.video_url}
                      title={article.titulo}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    src={article.video_url}
                    controls
                    className="reader-video-native"
                    preload="metadata"
                  />
                )}
              </div>
            )}

            <div className="article-body" ref={contentRef}>
              {paragraphs.map((p, i) =>
              i === 0 ?
              <Dropcap key={i}>{p}</Dropcap> :
              <p key={i} className="article-p">{p}</p>
              )}
            </div>

            <ShareBar article={article} />

            {article.fonte_original && (
            <div className="reader-source">
              <span className="kicker">Fonte original</span>
              <a href={article.fonte_original} target="_blank" rel="noopener">
                {article.fonte_original}
              </a>
              <p className="reader-curator">
                <em>curadoria & tradução ao português</em> ·
                <strong> Ludwig Araunui Goulart</strong> — IDI Brasil
              </p>
            </div>
            )}

            {related.length > 0 &&
            <div className="reader-related">
                <header className="related-head">
                  <span className="kicker">Continue em <em>{article.categoria}</em></span>
                  <div className="rule" />
                </header>
                <div className="related-grid">
                  {related.map((a) =>
                <article key={a.id} className="related-card" onClick={() => onOpen(a)}>
                      <p className="rc-date">{fmtDate(a.data)}</p>
                      <h4 className="rc-title">{a.titulo}</h4>
                      <p className="rc-author">Curadoria IDI · BTY</p>
                      <span className="rc-go">ler →</span>
                    </article>
                )}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}

// ─── FOOTER ────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="colophon" data-screen-label="Colophon">
      <div className="col-inner">
        <div className="col-brand">
          <h4 className="col-logo"><em>IDI</em> · Dia&nbsp;a&nbsp;Dia</h4>
          <p className="col-desc">
            Reflexões traduzidas e curadas para o corpo de Yeshua em
            língua portuguesa, da obra do IDI Israel e do Manifesto
            de Israel para a igreja no Brasil e na América Latina.
            Um trabalho voluntário, sem fins lucrativos.
          </p>
        </div>

        <div className="col-links">
          <h5>Edição</h5>
          <ul>
            <li><a href="#">Editorial</a></li>
            <li><a href="#">Curadoria</a></li>
            <li><a href="#">Tradução</a></li>
            <li><a href="#">Política editorial</a></li>
          </ul>
        </div>

        <div className="col-links">
          <h5>Fontes</h5>
          <ul>
            <li><a href="https://idisrael.com.br" target="_blank">IDI Israel ↗</a></li>
            <li><a href="https://idisrael.com.br/artigos" target="_blank">Artigos IDI ↗</a></li>
            <li><a href="https://ministeriobty.com.br" target="_blank">BTY Brasil ↗</a></li>
            <li><a href="https://www.skool.com/bty" target="_blank">Skool BTY ↗</a></li>
          </ul>
        </div>

        <div className="col-links">
          <h5>Contato</h5>
          <ul>
            <li><a href="https://wa.me/5521986996277" target="_blank">WhatsApp ↗</a></li>
            <li><a href="#" onClick={(e) => {e.preventDefault();navigator.clipboard?.writeText('btyeshua@gmail.com');}}>PIX: btyeshua@gmail.com</a></li>
            <li><a href="https://ministeriobty.com.br" target="_blank">Congregação · BTY ↗</a></li>
            <li><a href="#oracao">Pedido de oração</a></li>
          </ul>
        </div>
      </div>

      <div className="col-bottom">
        <p>© {new Date().getFullYear()} IDI · Igrejas em Defesa de Israel</p>
        <p>conteúdo traduzido com crédito às fontes originais · uso permitido para fins não-comerciais · <a href="editor.html" style={{color:'inherit',textDecoration:'underline',textUnderlineOffset:'2px'}}>editor</a></p>
        <p className="col-verse"><em>Atos 1:8</em></p>
      </div>
    </footer>);

}

// ─── VISITOR GATE (splash · capture lead before entering) ──────────────
const GATE_KEY = 'idi_visitante_v2';

const PAISES = [
  'Brasil', 'Portugal', 'Estados Unidos', 'Argentina', 'Angola',
  'Moçambique', 'Israel', 'Paraguai', 'Uruguai', 'Chile', 'Colômbia',
  'México', 'Peru', 'Bolívia', 'Espanha', 'Reino Unido', 'Canadá',
  'Alemanha', 'França', 'Itália', 'Japão', 'Outro'
];

function VisitorGate({ onEnter }) {
  const [form, setForm] = useState({
    nome: '', email: '', whatsapp: '', pais: 'Brasil', cidade: ''
  });
  const [state, setState] = useState('idle'); // idle | sending | error
  const [errMsg, setErrMsg] = useState('');
  const [show, setShow] = useState(true);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    if (!form.nome.trim()) { setErrMsg('Por favor, informe seu nome.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      setErrMsg('Por favor, informe um e-mail válido.'); return;
    }
    if (form.whatsapp.replace(/\D/g, '').length < 8) {
      setErrMsg('Por favor, informe um WhatsApp válido (com DDD/país).'); return;
    }

    setState('sending');
    const lead = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      pais: form.pais,
      cidade: form.cidade.trim(),
      origem: 'splash',
      criado_em: new Date().toISOString()
    };

    // Save to Supabase (table: visitantes). Falls back to localStorage-only
    // if the table doesn't exist yet, so the gate never blocks entry.
    try {
      if (window.IDI_SB) {
        const { error } = await window.IDI_SB.from('visitantes').insert([lead]);
        if (error) console.warn('visitantes insert:', error.message);
      }
    } catch (err) {
      console.warn('Gate save falhou:', err);
    }

    try {
      const all = JSON.parse(localStorage.getItem('idi_visitantes_local') || '[]');
      all.push(lead);
      localStorage.setItem('idi_visitantes_local', JSON.stringify(all));
    } catch (_) {}

    localStorage.setItem(GATE_KEY, JSON.stringify({ nome: lead.nome, at: Date.now() }));

    // Exit animation, then reveal the site
    setShow(false);
    setTimeout(() => onEnter(lead), 620);
  };

  // Skip / close — enter without filling the form.
  const skip = () => {
    try { localStorage.setItem(GATE_KEY, JSON.stringify({ nome: '', skipped: true, at: Date.now() })); } catch (_) {}
    setShow(false);
    setTimeout(() => onEnter(null), 620);
  };

  return (
    <div className={`gate ${show ? '' : 'gate-leaving'}`} data-screen-label="Visitor gate">
      <button className="gate-skip" onClick={skip} aria-label="Pular e entrar no site">
        pular <span className="gate-skip-x">×</span>
      </button>
      <div className="gate-bg" aria-hidden="true">
        <div className="gate-blob gate-blob-1" />
        <div className="gate-blob gate-blob-2" />
        <div className="gate-blob gate-blob-3" />
      </div>

      <div className="gate-inner">
        <div className="gate-left">
          <div className="gate-brand">
            <img src="assets/idi-logo.png" alt="IDI" className="gate-logo" />
            <span className="gate-motto">✶ Israel e Missões Urbanas</span>
          </div>
          <h1 className="gate-title">
            <span className="gate-i">I</span><span className="gate-d">D</span><span className="gate-i">I</span>
            <span className="gate-amp">·</span>
            <em>Dia a Dia</em>
          </h1>
          <p className="gate-deck">
            Um arquivo vivo de reflexões diárias sobre <em>Israel</em>,
            <em> Yeshua</em> e a plenitude da <em>Igreja</em>. Antes de
            entrar, conte quem você é — queremos caminhar com você,
            orar por você e manter você por perto.
          </p>
          <ul className="gate-points">
            <li><span className="gp-mark">✦</span> Reflexões traduzidas e curadas todos os dias</li>
            <li><span className="gp-mark">✦</span> Muro de oração, vídeos e formação</li>
            <li><span className="gp-mark">✦</span> Uma comunidade entre o Brasil, a América Latina e Israel</li>
          </ul>
        </div>

        <div className="gate-right">
          <form className="gate-form" onSubmit={submit}>
            <header className="gf-head">
              <span className="kicker">Bem-vindo · entre para ler</span>
              <h2 className="gf-title">Seu acesso ao <em>arquivo</em>.</h2>
              <p className="gf-sub">Leva 20 segundos. Seus dados ficam só conosco.</p>
            </header>

            <label className="gf-field">
              <span>Nome completo *</span>
              <input type="text" value={form.nome} onChange={set('nome')}
                placeholder="Como podemos te chamar?" autoFocus />
            </label>

            <label className="gf-field">
              <span>E-mail *</span>
              <input type="email" value={form.email} onChange={set('email')}
                placeholder="seu@email.com" />
            </label>

            <label className="gf-field">
              <span>WhatsApp (com código do país) *</span>
              <input type="tel" value={form.whatsapp} onChange={set('whatsapp')}
                placeholder="+55 21 98699-6277" />
            </label>

            <div className="gf-row-2">
              <label className="gf-field">
                <span>País</span>
                <div className="gf-select-wrap">
                  <select value={form.pais} onChange={set('pais')}>
                    {PAISES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </label>
              <label className="gf-field">
                <span>Cidade</span>
                <input type="text" value={form.cidade} onChange={set('cidade')}
                  placeholder="Sua cidade" />
              </label>
            </div>

            {errMsg && <p className="gf-err">— {errMsg}</p>}

            <button type="submit" className="gf-submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Entrando…' : <>Entrar no site <span className="cta-arrow">→</span></>}
            </button>

            <p className="gf-fine">
              Ao entrar, você concorda em receber comunicações do IDI · Dia a Dia.
              Cancele quando quiser.
            </p>

            <button type="button" className="gf-skip-link" onClick={skip}>
              entrar sem cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────
function App() {
  const [filter, setFilter] = useState('todos');
  const [query, setQuery] = useState('');
  const [openArticle, setOpenArticle] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [prayerModalOpen, setPrayerModalOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(() => {
    try {
      // Skip the gate if this visitor already registered, or wants a shared post
      if (new URLSearchParams(location.search).get('post')) return false;
      return !localStorage.getItem(GATE_KEY);
    } catch (_) { return true; }
  });

  useEffect(() => {
    document.body.style.overflow = gateOpen ? 'hidden' : '';
  }, [gateOpen]);

  const [tweaks, setTweaks] = useTweaks ? useTweaks({
    "paperTone": "warm",
    "density": "comfortable",
    "accent": "oxblood"
  }) : [{}, () => {}];

  // Body theme classes
  useEffect(() => {
    const cls = document.body.classList;
    cls.toggle('dark', darkMode);
    cls.toggle('paper-warm', tweaks.paperTone === 'warm' && !darkMode);
    cls.toggle('paper-cool', tweaks.paperTone === 'cool' && !darkMode);
    cls.toggle('paper-cream', tweaks.paperTone === 'cream' && !darkMode);
    cls.toggle('compact', tweaks.density === 'compact');
    cls.toggle('accent-oxblood', tweaks.accent === 'oxblood');
    cls.toggle('accent-olive', tweaks.accent === 'olive');
    cls.toggle('accent-ink', tweaks.accent === 'ink');
  }, [darkMode, tweaks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      const okCat = filter === 'todos' || a.categoria === filter;
      const okQ = !q ||
      a.titulo.toLowerCase().includes(q) ||
      a.autor.toLowerCase().includes(q) ||
      a.resumo.toLowerCase().includes(q) ||
      a.categoria.toLowerCase().includes(q) ||
      a.conteudo.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [filter, query]);

  const hero = filtered[0];
  const secondary = filtered.slice(1, 4);
  const rest = filtered.slice(4);

  const onOpen = useCallback((a) => {
    setOpenArticle(a);
    document.body.style.overflow = 'hidden';
  }, []);
  const onClose = useCallback(() => {
    setOpenArticle(null);
    document.body.style.overflow = '';
    // Clean the deep-link from the URL without reloading
    if (window.history && (window.location.search.includes('post=') || /^\/p\//.test(window.location.pathname))) {
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Deep-link: open a post if URL has ?post=slug OR path /p/<slug>
  useEffect(() => {
    let target = new URLSearchParams(window.location.search).get('post');
    if (!target) {
      const m = window.location.pathname.match(/^\/p\/(.+?)\/?$/);
      if (m) target = decodeURIComponent(m[1]);
    }
    if (!target) return;
    const found = ARTICLES.find(a => String(a.slug) === target || String(a.id) === target);
    if (found) {
      setOpenArticle(found);
      document.body.style.overflow = 'hidden';
    }
  }, []);
  const onJumpTo = useCallback((target) => {
    if (target === 'todos') {setFilter('todos');window.scrollTo({ top: 0, behavior: 'smooth' });} else
    if (target === 'arquivo') {
      document.getElementById('arquivo')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } else {
      setFilter(target);
      setTimeout(() => {
        document.querySelector('.filter-rail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }
  }, []);

  return (
    <>
      {gateOpen && <VisitorGate onEnter={() => setGateOpen(false)} />}
      <TopRibbon onOpenPrayer={() => {setPrayerModalOpen(true);document.body.style.overflow = 'hidden';}} />
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onJumpTo={onJumpTo}
        currentCat={filter}
        onOpenPrayer={() => {setPrayerModalOpen(true);document.body.style.overflow = 'hidden';}} />
      

      {hero && filter === 'todos' && !query &&
      <>
          <IDIHighlight />
          <HeroFeature article={hero} onOpen={onOpen} />
        </>
      }

      <FilterRail filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} total={filtered.length} />

      <div className="main-grid">
        <div className="main-col">
          {filter === 'todos' && !query && secondary.length > 0 &&
          <SecondaryGrid articles={secondary} onOpen={onOpen} />
          }

          <ArticleList
            articles={filter === 'todos' && !query ? rest : filtered}
            onOpen={onOpen}
            sectionTitle={
            filter === 'todos' && !query ?
            'Arquivo' :
            filter === 'todos' ? 'Resultados da busca' : filter
            } />
          
        </div>

        <Sidebar onOpen={onOpen} filter={filter} setFilter={setFilter} />
      </div>

      <Newsletter />
      <AboutMinistry />
      <PrayerTeaser />
      <PrayerWall />
      <BTYSection />
      <CUFISection />
      <VideosSection />
      <CoordinationSection />
      <ContactSection />
      <FundraisingSection />
      <Footer />

      {openArticle &&
      <ArticleModal article={openArticle} onClose={onClose} onOpen={(a) => {onClose();setTimeout(() => onOpen(a), 50);}} />
      }

      {prayerModalOpen &&
      <PrayerModal
        onClose={() => {setPrayerModalOpen(false);document.body.style.overflow = '';}} />

      }

      {typeof TweaksPanel !== 'undefined' &&
      <TweaksPanel>
          <TweakSection title="Papel">
            <TweakRadio
            t={tweaks} setT={setTweaks} k="paperTone"
            options={[
            { value: 'warm', label: 'Quente' },
            { value: 'cool', label: 'Fria' },
            { value: 'cream', label: 'Creme' }]
            } />
          
          </TweakSection>
          <TweakSection title="Densidade">
            <TweakRadio
            t={tweaks} setT={setTweaks} k="density"
            options={[
            { value: 'comfortable', label: 'Confortável' },
            { value: 'compact', label: 'Compacta' }]
            } />
          
          </TweakSection>
          <TweakSection title="Acento">
            <TweakRadio
            t={tweaks} setT={setTweaks} k="accent"
            options={[
            { value: 'oxblood', label: 'Sangue' },
            { value: 'olive', label: 'Oliva' },
            { value: 'ink', label: 'Tinta' }]
            } />
          
          </TweakSection>
        </TweaksPanel>
      }
    </>);

}

// ─── BOOTSTRAP: merge Supabase posts with embedded archive, then render ──
async function boot() {
  try {
    const cfg = window.IDI_SUPABASE;
    if (cfg && window.supabase && cfg.url && cfg.anonKey) {
      const sb = window.supabase.createClient(cfg.url, cfg.anonKey);
      window.IDI_SB = sb; // global client reused by gate / fundraising / donations
      const { data, error } = await sb
        .from('posts')
        .select('*')
        .order('data', { ascending: false });
      if (!error && Array.isArray(data) && data.length) {
        const existingIds = new Set(ARTICLES.map(a => String(a.id)));
        const fresh = data
          .filter(p => !existingIds.has(String(p.id)))
          .map(p => ({
            id: p.id || String(p.pk),
            slug: p.slug || '',
            titulo: p.titulo || '',
            titulo_original: p.titulo_original || '',
            autor: p.autor || 'Curadoria IDI · BTY',
            data: p.data,
            categoria: p.categoria,
            resumo: p.resumo || '',
            conteudo: p.conteudo || '',
            fonte_original: p.fonte_original || '',
            imagem: p.imagem || '',
            video_url: p.video_url || '',
            destaque: !!p.destaque
          }));
        ARTICLES.push(...fresh);
        ARTICLES.sort((a, b) => b.data.localeCompare(a.data));
      }
    }
  } catch (e) {
    console.warn('Supabase indisponível — usando arquivo local.', e);
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
boot();