/**
 * Doceria Silva – main.js
 * ─────────────────────────────────────────────────────────────
 * 1.  CMS Data Loader   – busca JSONs e popula o DOM
 * 2.  Custom Cursor
 * 3.  Loader
 * 4.  Scroll-reveal (IntersectionObserver)
 * 5.  Nav scroll state + hamburger menu
 * 6.  Particle system (hero)
 * 7.  Showcase horizontal scroll + dots
 * 8.  Depoimentos drag-scroll
 * 9.  WhatsApp form builder
 * 10. Back-to-top button
 * 11. Misc micro-interactions
 */

'use strict';

/* ── HELPERS ─────────────────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const raf  = (fn) => requestAnimationFrame(fn);
const set  = (id, val, prop = 'textContent') => { const el = document.getElementById(id); if (el && val !== undefined && val !== null) el[prop] = val; };
const setH = (id, val) => set(id, val, 'innerHTML');

/* ── ESTADO GLOBAL ───────────────────────────────────────────── */
let CMS_CONFIG    = null;   // dados/configuracoes.json
let CMS_CARDAPIO  = null;   // dados/cardapio.json (produtos array)

/* ══════════════════════════════════════════════════════════════
   1. CMS DATA LOADER
══════════════════════════════════════════════════════════════ */

async function loadCMSData() {
  const base = '/dados/';
  const files = [
    'configuracoes', 'hero', 'historia',
    'cardapio', 'showcase', 'depoimentos',
    'pedido', 'marquee', 'especiais', 'pedidos-especiais'
  ];

  const results = await Promise.all(
    files.map(f =>
      fetch(base + f + '.json')
        .then(r => r.ok ? r.json() : null)
        .catch(() => null)
    )
  );

  const [config, hero, historia, cardapio, showcase, depoimentos, pedido, marquee, especiais, pedidosEspeciais] = results;

  if (config)      { CMS_CONFIG   = config; renderConfig(config); }
  if (hero)                                 renderHero(hero, config);
  if (historia)                             renderHistoria(historia);
  if (cardapio)    { CMS_CARDAPIO = cardapio; renderCardapio(cardapio); }
  if (showcase)                             renderShowcase(showcase);
  if (depoimentos)                          renderDepoimentos(depoimentos);
  if (pedido)                               renderPedido(pedido, config);
  if (marquee)                              renderMarquee(marquee);
  if (config)                               renderFooter(config);
  if (especiais)                            renderEspeciais(especiais);
  if (pedidosEspeciais)                     renderPedidosEspeciais(pedidosEspeciais, config);

  // Após carregar dados, reinicia interações que dependem dos elementos
  initWhatsApp();
  initCardTilt();
}

/* ── renderConfig ────────────────────────────────────────────── */
function renderConfig(c) {
  // Meta tags SEO dinâmicas
  if (c.nome_empresa) {
    document.title = `${c.nome_empresa} | Docinhos Artesanais`;
    document.querySelector('meta[name="author"]')?.setAttribute('content', c.nome_empresa);
  }
  if (c.descricao_seo) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', c.descricao_seo);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', c.descricao_seo);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', c.descricao_seo);
  }
  if (c.palavras_chave) {
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', c.palavras_chave);
  }
  if (c.url_site) {
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', c.url_site + '/');
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', c.url_site + '/');
  }
  if (c.og_imagem) {
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', c.og_imagem);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', c.og_imagem);
  }
  // Logo nos dois lugares
  if (c.logo) {
    const navLogo    = document.getElementById('siteLogoNav');
    const footerLogo = document.getElementById('siteLogoFooter');
    if (navLogo)    { navLogo.src = c.logo;    navLogo.style.display = 'block'; }
    if (footerLogo) { footerLogo.src = c.logo; footerLogo.style.display = 'block'; }
  }
  // Favicon
  if (c.favicon) {
    const fav = document.querySelector('link[rel="icon"]');
    const apl = document.querySelector('link[rel="apple-touch-icon"]');
    if (fav) fav.href = c.favicon;
    if (apl) apl.href = c.favicon;
  }
  // Cores via CSS custom properties
  if (c.cor_primaria) {
    document.documentElement.style.setProperty('--rose-deep', c.cor_primaria);
  }
  if (c.cor_destaque) {
    document.documentElement.style.setProperty('--accent-pink', c.cor_destaque);
  }
  // WhatsApp footer link
  if (c.whatsapp) {
    const wLink = document.getElementById('linkWhatsappFooter');
    if (wLink) wLink.href = `https://wa.me/${c.whatsapp}`;
    // Atualiza também o botão da seção de pedidos especiais
    const wPE = document.getElementById('btnPedidoEspecial');
    if (wPE) {
      const msg = encodeURIComponent('Olá! Gostaria de fazer uma encomenda especial na Doceria Silva 🍬');
      wPE.href = `https://wa.me/${c.whatsapp}?text=${msg}`;
    }
  }
  // Instagram
  if (c.instagram_url) {
    const ig = document.getElementById('linkInstagram');
    if (ig) { ig.href = c.instagram_url; ig.style.display = ''; }
  }
  // Facebook
  if (c.facebook_url) {
    const fb = document.getElementById('linkFacebook');
    if (fb) { fb.href = c.facebook_url; fb.style.display = ''; }
  }
  // TikTok
  if (c.tiktok_url) {
    const tk = document.getElementById('linkTiktok');
    if (tk) { tk.href = c.tiktok_url; tk.style.display = ''; }
  }
}

/* ── renderHero ──────────────────────────────────────────────── */
function renderHero(h, config) {
  set('heroEyebrow', h.eyebrow);
  set('heroDesc',    h.descricao);
  set('heroBadgeIcone', h.badge_icone);
  set('heroBadgeTexto', h.badge_texto);

  // Título com em italic (sem <br/> após o em — ele já é display:block)
  const tituloEl = document.getElementById('heroTitulo');
  if (tituloEl && h.titulo_linha1 && h.titulo_em && h.titulo_linha3) {
    tituloEl.innerHTML =
      `${h.titulo_linha1}<br/><em id="heroTituloEm">${h.titulo_em}</em>${h.titulo_linha3}`;
  }

  // Botões
  const btnP = document.getElementById('heroBtnPrimario');
  const btnS = document.getElementById('heroBtnSecundario');
  if (btnP) {
    if (h.btn_primario_texto) btnP.textContent = h.btn_primario_texto;
    if (h.btn_primario_href)  btnP.href        = h.btn_primario_href;
  }
  if (btnS) {
    if (h.btn_secundario_texto) btnS.textContent = h.btn_secundario_texto;
    if (h.btn_secundario_href)  btnS.href        = h.btn_secundario_href;
  }

  // Imagem hero
  if (h.imagem) {
    const img = document.getElementById('heroImagem');
    if (img) {
      img.src = h.imagem;
      if (h.imagem_alt) img.alt = h.imagem_alt;
      img.style.display = 'block';
      const ph = img.nextElementSibling;
      if (ph && ph.classList.contains('hero__plate-placeholder')) {
        ph.style.display = 'none';
      }
    }
  }
}

/* ── renderHistoria ──────────────────────────────────────────── */
function renderHistoria(h) {
  set('historiaEyebrow', h.eyebrow);
  set('historiaPara1',   h.paragrafo1);
  set('historiaPara2',   h.paragrafo2);
  set('historiaStat1Num', h.stat1_numero);
  set('historiaStat1Label', h.stat1_label);
  set('historiaStat2Num', h.stat2_numero);
  set('historiaStat2Label', h.stat2_label);
  set('historiaStat3Num', h.stat3_numero);
  set('historiaStat3Label', h.stat3_label);

  // Título com em
  const tituloEl = document.getElementById('historiaTitulo');
  if (tituloEl && h.titulo_linha1 && h.titulo_em) {
    tituloEl.innerHTML =
      `${h.titulo_linha1} <em id="historiaTituloEm">${h.titulo_em}</em>,<br/>${h.titulo_linha2 || 'entregue com carinho.'}`;
  }

  // Imagem
  if (h.imagem) {
    const img = document.getElementById('historiaImagem');
    if (img) {
      img.src = h.imagem;
      if (h.imagem_alt) img.alt = h.imagem_alt;
      img.style.display = 'block';
      const ph = img.nextElementSibling;
      if (ph) ph.style.display = 'none';
    }
  }
}

/* ── renderCardapio ──────────────────────────────────────────── */
function renderCardapio(data) {
  // Textos do header
  set('cardapioEyebrow',  data.eyebrow);
  set('cardapioSubtitulo', data.subtitulo);

  if (data.titulo_linha1 && data.titulo_em) {
    const tEl = document.getElementById('cardapioTitulo');
    if (tEl) tEl.innerHTML = `${data.titulo_linha1}<br/><em>${data.titulo_em}</em>`;
  }

  const grid = document.getElementById('cardapioGrid');
  if (!grid || !Array.isArray(data.produtos)) return;

  const ativos = data.produtos.filter(p => p.ativo !== false);
  grid.innerHTML = ativos.map((p, i) => {
    const delay = ((i + 1) * 0.1).toFixed(1);
    const badgeHTML = p.badge_texto
      ? `<span class="product-card__badge ${p.badge_tipo === 'novo' ? 'product-card__badge--new' : ''}">${p.badge_texto}</span>`
      : '';
    return `
      <article class="product-card reveal-up" style="animation-delay:${delay}s" data-flavor="${p.id || ''}">
        <div class="product-card__media">
          <img src="${p.imagem || ''}" alt="${p.imagem_alt || p.nome}" class="product-card__img"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="product-card__img-ph" style="display:none;">
            <span>${p.icone || '🍬'}</span><p>${p.nome}</p>
          </div>
          <div class="product-card__shine"></div>
          ${badgeHTML}
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${p.nome}</h3>
          <p class="product-card__desc">${p.descricao}</p>
          <div class="product-card__footer">
            <div class="product-card__price">
              <span class="price__label">${p.preco_label || 'Bandeja 4 un.'}</span>
              <span class="price__value">${p.preco || 'Consulte'}</span>
            </div>
            <a href="#pedido" class="btn btn--small btn--primary">Pedir agora</a>
          </div>
        </div>
      </article>`;
  }).join('');

  // Renderiza também o seletor de sabores no pedido
  renderFlavorSelector(ativos);

  // Re-inicializa as animações de reveal para os novos cards
  initReveal();
  initCardTilt();
}

/* ── renderEspeciais ─────────────────────────────────────────── */
function renderEspeciais(data) {
  set('especiaisEyebrow',  data.eyebrow);
  set('especiaisSubtitulo', data.subtitulo);

  if (data.titulo_linha1 && data.titulo_em) {
    const tEl = document.getElementById('especiaisTitulo');
    if (tEl) tEl.innerHTML = `${data.titulo_linha1}<br/><em>${data.titulo_em}</em>`;
  }

  const grid = document.getElementById('especiaisGrid');
  if (!grid || !Array.isArray(data.produtos)) return;

  const ativos = data.produtos.filter(p => p.ativo !== false);
  grid.innerHTML = ativos.map((p, i) => {
    const delay = ((i + 1) * 0.1).toFixed(1);
    const badgeHTML = p.badge_texto
      ? `<span class="product-card__badge ${p.badge_tipo === 'novo' ? 'product-card__badge--new' : ''}">${p.badge_texto}</span>`
      : '';
    return `
      <article class="product-card reveal-up" style="animation-delay:${delay}s" data-flavor="${p.id || ''}">
        <div class="product-card__media">
          <img src="${p.imagem || ''}" alt="${p.imagem_alt || p.nome}" class="product-card__img"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="product-card__img-ph" style="display:none;">
            <span>${p.icone || '🍬'}</span><p>${p.nome}</p>
          </div>
          <div class="product-card__shine"></div>
          ${badgeHTML}
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${p.nome}</h3>
          <p class="product-card__desc">${p.descricao}</p>
          <div class="product-card__footer">
            <div class="product-card__price">
              <span class="price__label">${p.preco_label || 'Sob encomenda'}</span>
              <span class="price__value">${p.preco || 'Consulte'}</span>
            </div>
            <a href="#pedidos-especiais" class="btn btn--small btn--primary">Encomendar</a>
          </div>
        </div>
      </article>`;
  }).join('');

  initReveal();
  initCardTilt();
}

/* ── renderPedidosEspeciais ──────────────────────────────────── */
function renderPedidosEspeciais(data, config) {
  set('peEyebrow', data.eyebrow);
  set('peDesc',    data.descricao);
  set('peBtnTexto', data.btn_texto);
  set('peNota',     data.btn_nota);

  if (data.titulo_linha1 && data.titulo_em) {
    const tEl = document.getElementById('peTitulo');
    if (tEl) tEl.innerHTML = `${data.titulo_linha1}<br/><em>${data.titulo_em}</em>`;
  }

  // Atualiza href do botão de encomenda com o número do config
  const btnWA = document.getElementById('btnPedidoEspecial');
  if (btnWA && config && config.whatsapp) {
    const msg = encodeURIComponent('Olá! Gostaria de fazer uma encomenda especial na Doceria Silva 🍬');
    btnWA.href = `https://wa.me/${config.whatsapp}?text=${msg}`;
  }

  const grid = document.getElementById('pedidosEspeciaisGrid');
  if (!grid || !Array.isArray(data.items)) return;

  const ativos = data.items.filter(item => item.ativo !== false);
  grid.innerHTML = ativos.map((item, i) => {
    const delay = ((i + 1) * 0.1).toFixed(1);
    return `
      <div class="especial-card reveal-up" style="animation-delay:${delay}s">
        <span class="especial-card__icone">${item.icone || '🍬'}</span>
        <h3 class="especial-card__titulo">${item.titulo}</h3>
        <p class="especial-card__desc">${item.descricao}</p>
      </div>`;
  }).join('');

  initReveal();
}

/* ── renderFlavorSelector ────────────────────────────────────── */
function renderFlavorSelector(produtos) {
  const sel = document.getElementById('flavorSelector');
  if (!sel) return;

  sel.innerHTML = produtos.map(p => `
    <label class="flavor-opt" data-flavor="${p.id || ''}">
      <input type="checkbox" name="flavor" value="${p.id || ''}" />
      <span class="flavor-opt__box">
        <span class="flavor-opt__icon">${p.icone || '🍬'}</span>
        <span>${p.nome}</span>
      </span>
    </label>`).join('');
}

/* ── renderShowcase ──────────────────────────────────────────── */
function renderShowcase(data) {
  const track = document.getElementById('showcaseTrack');
  if (!track || !Array.isArray(data.slides)) return;

  track.innerHTML = data.slides.map((s, i) => {
    const num = String(i + 1).padStart(2, '0');
    const tituloHTML = s.titulo_em
      ? `${s.titulo} <em>${s.titulo_em}</em>`
      : s.titulo;
    return `
      <div class="showcase__slide showcase__slide--${i + 1}">
        <div class="showcase__slide-content">
          <span class="showcase__step">${num}</span>
          <h2 class="showcase__title">${tituloHTML}</h2>
          <p>${s.descricao}</p>
        </div>
        <div class="showcase__media">
          <img src="${s.imagem || ''}" alt="${s.imagem_alt || ''}"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="img-ph">
            <span>${s.icone_placeholder || '📸'}</span>
            <p>${s.imagem_alt || 'Foto aqui'}</p>
          </div>
        </div>
      </div>`;
  }).join('');

  // Reinicia showcase após re-render
  initShowcase();
}

/* ── renderDepoimentos ───────────────────────────────────────── */
function renderDepoimentos(data) {
  set('depoEyebrow', data.eyebrow);

  if (data.titulo_linha1 && data.titulo_em) {
    const tEl = document.getElementById('depoTitulo');
    if (tEl) tEl.innerHTML = `${data.titulo_linha1}<br/><em>${data.titulo_em}</em>`;
  }

  const track = document.getElementById('depoimentosTrack');
  if (!track || !Array.isArray(data.items)) return;

  const stars = (nota) => '⭐'.repeat(Math.min(5, Math.max(1, nota || 5)));

  track.innerHTML = data.items.map(d => `
    <div class="depo-card">
      <p class="depo-card__text">"${d.texto}"</p>
      <div class="depo-card__author">
        <div class="depo-card__avatar">${d.inicial || d.autor?.charAt(0) || '?'}</div>
        <div>
          <strong>${d.autor}</strong>
          <span>${stars(d.nota)}</span>
        </div>
      </div>
    </div>`).join('');
}

/* ── renderPedido ────────────────────────────────────────────── */
function renderPedido(p, config) {
  set('pedidoEyebrow',    p.eyebrow);
  set('pedidoDesc',       p.descricao);
  set('pedidoCardTitulo', p.card_titulo);
  set('pedidoBtnTexto',   p.btn_texto);
  set('pedidoNota',       p.nota);

  // Título com em
  const tEl = document.getElementById('pedidoTitulo');
  if (tEl && p.titulo_linha1 && p.titulo_em) {
    tEl.innerHTML =
      `${p.titulo_linha1}<br/><em id="pedidoTituloEm">${p.titulo_em}</em> ${p.titulo_linha2 || 'o seu dia?'}`;
  }

  // Info list
  const infoList = document.getElementById('pedidoInfoList');
  if (infoList) {
    const items = [];
    if (p.info1_icone && p.info1_texto)
      items.push(`<li>${p.info1_icone} ${p.info1_texto} <strong>${p.info1_negrito || ''}</strong></li>`);
    if (p.info2_icone && p.info2_texto)
      items.push(`<li>${p.info2_icone} ${p.info2_texto} <strong>${p.info2_negrito || ''}</strong></li>`);
    if (p.info3_icone && p.info3_texto)
      items.push(`<li>${p.info3_icone} ${p.info3_texto} <strong>${p.info3_negrito || ''}</strong></li>`);
    if (items.length) infoList.innerHTML = items.join('');
  }
}

/* ── renderMarquee ───────────────────────────────────────────── */
function renderMarquee(data) {
  const track = document.getElementById('marqueeTrack');
  if (!track || !Array.isArray(data.items) || !data.items.length) return;

  // Triplicar para efeito infinito suave
  const all = [...data.items, ...data.items, ...data.items];
  track.innerHTML = all.map(txt => `<span>${txt}</span>`).join('');
}

/* ── renderFooter ────────────────────────────────────────────── */
function renderFooter(c) {
  set('footerDesc',        c.rodape_descricao);
  set('footerTextoDir',    c.rodape_texto_direito);
  set('footerNomeEmpresa', c.nome_empresa ? `${c.nome_empresa} – Emily e Vitória` : 'Doceria Silva – Emily e Vitória');
}

/* ══════════════════════════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════════════════════════ */
const initCursor = () => {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  const moveCursor = (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  };

  const followCursor = () => {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    raf(followCursor);
  };

  document.addEventListener('mousemove', moveCursor, { passive: true });
  raf(followCursor);

  const updateHoverEls = () => {
    const hoverEls = $$('a, button, .product-card, .flavor-opt, .depo-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor--hover'));
    });
  };
  updateHoverEls();

  document.addEventListener('mousedown', () => document.body.classList.add('cursor--click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor--click'));
};

/* ══════════════════════════════════════════════════════════════
   3. LOADER
══════════════════════════════════════════════════════════════ */
const initLoader = () => {
  const loader = $('#loader');
  if (!loader) return;

  const MIN_TIME = 1100;
  const start = Date.now();

  const hide = () => {
    const elapsed = Date.now() - start;
    const wait    = Math.max(0, MIN_TIME - elapsed);
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 700);
    }, wait);
  };

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide, { once: true });
  }
};

/* ══════════════════════════════════════════════════════════════
   4. SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
const initReveal = () => {
  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => {
    if (!el.classList.contains('visible')) obs.observe(el);
  });
};

/* ══════════════════════════════════════════════════════════════
   5. NAV – scroll state + hamburger
══════════════════════════════════════════════════════════════ */
const initNav = () => {
  const nav       = $('#nav');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  if (!nav) return;

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      raf(() => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    $$('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
};

/* ══════════════════════════════════════════════════════════════
   6. HERO PARTICLES
══════════════════════════════════════════════════════════════ */
const initParticles = () => {
  const container = $('#particles');
  if (!container) return;

  const EMOJIS = ['🍬', '✨', '❤️', '🍫', '🍪', '⭐', '🎀', '💕'];
  const COLORS = ['#E8849A', '#F5C518', '#FF4F7B', '#C4607A', '#FFD6E0'];
  const COUNT  = window.innerWidth < 768 ? 12 : 22;
  const rand   = (min, max) => Math.random() * (max - min) + min;

  for (let i = 0; i < COUNT; i++) {
    const blob = document.createElement('div');
    blob.classList.add('particle');
    const size = rand(4, 14);
    blob.style.cssText = `
      width:${size}px; height:${size}px;
      left:${rand(0,100)}%; top:${rand(20,90)}%;
      background:${COLORS[Math.floor(rand(0, COLORS.length))]};
      --dur:${rand(5,9)}s; --delay:${rand(0,6)}s; opacity:0;`;
    container.appendChild(blob);

    if (i < 8) {
      const emoji = document.createElement('span');
      emoji.classList.add('particle');
      emoji.textContent = EMOJIS[i % EMOJIS.length];
      emoji.style.cssText = `
        font-size:${rand(14,28)}px;
        left:${rand(0,100)}%; top:${rand(30,85)}%;
        background:none; border-radius:0;
        --dur:${rand(6,10)}s; --delay:${rand(0,8)}s;
        filter:drop-shadow(0 2px 4px rgba(0,0,0,.15));`;
      container.appendChild(emoji);
    }
  }
};

/* ══════════════════════════════════════════════════════════════
   7. SHOWCASE – horizontal scroll + dots
══════════════════════════════════════════════════════════════ */
const initShowcase = () => {
  const wrap  = $('.showcase__sticky-wrap');
  const track = $('#showcaseTrack');
  if (!wrap || !track) return;

  const slides = $$('.showcase__slide', track);
  if (!slides.length) return;

  // Remove dots antigos
  const oldDots = $('.showcase__dots');
  if (oldDots) oldDots.remove();

  const dotsContainer = document.createElement('div');
  dotsContainer.classList.add('showcase__dots');

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('showcase__dot');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => scrollToSlide(i));
    dotsContainer.appendChild(dot);
  });

  wrap.parentElement.insertBefore(dotsContainer, wrap.nextSibling);

  const dots = $$('.showcase__dot', dotsContainer);

  const scrollToSlide = (idx) => {
    const target = slides[idx];
    if (!target) return;
    wrap.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  };

  let scrollTicking = false;
  wrap.addEventListener('scroll', () => {
    if (!scrollTicking) {
      raf(() => {
        const scrollLeft = wrap.scrollLeft;
        let activeIdx = 0;
        slides.forEach((slide, i) => {
          if (slide.offsetLeft <= scrollLeft + wrap.offsetWidth / 2) activeIdx = i;
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  if (window.innerWidth < 1024) {
    let currentSlide = 0;
    const AUTO_INTERVAL = 4500;
    const advance = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      scrollToSlide(currentSlide);
    };
    let autoTimer = setInterval(advance, AUTO_INTERVAL);
    wrap.addEventListener('touchstart', () => clearInterval(autoTimer), { passive: true, once: true });
  }

  wrap.addEventListener('keydown', (e) => {
    const activeIdx = dots.findIndex(d => d.classList.contains('active'));
    if (e.key === 'ArrowRight') scrollToSlide(activeIdx + 1);
    if (e.key === 'ArrowLeft')  scrollToSlide(activeIdx - 1);
  });
};

/* ══════════════════════════════════════════════════════════════
   8. DEPOIMENTOS – drag to scroll
══════════════════════════════════════════════════════════════ */
const initDragScroll = () => {
  const wrap = $('.depoimentos__track-wrap');
  if (!wrap) return;

  let isDown = false, startX, scrollLeft;

  wrap.addEventListener('mousedown', (e) => {
    isDown = true;
    startX     = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
    wrap.style.cursor = 'grabbing';
  });
  wrap.addEventListener('mouseleave', () => { isDown = false; wrap.style.cursor = ''; });
  wrap.addEventListener('mouseup',    () => { isDown = false; wrap.style.cursor = ''; });
  wrap.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - wrap.offsetLeft;
    const walk = (x - startX) * 1.5;
    wrap.scrollLeft = scrollLeft - walk;
  });
};

/* ══════════════════════════════════════════════════════════════
   9. WHATSAPP FORM
══════════════════════════════════════════════════════════════ */
const initWhatsApp = () => {
  const btn = $('#whatsappBtn');
  if (!btn) return;

  const getNumber = () =>
    (CMS_CONFIG && CMS_CONFIG.whatsapp) ? CMS_CONFIG.whatsapp : '5514991832982';

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const WHATSAPP_NUMBER = getNumber();

    // Busca todos os sabores selecionados
    const selected = $$('input[name="flavor"]:checked').map(cb => {
      // Tenta obter nome real do cardápio CMS
      if (CMS_CARDAPIO && Array.isArray(CMS_CARDAPIO.produtos)) {
        const p = CMS_CARDAPIO.produtos.find(x => x.id === cb.value);
        return p ? p.nome : cb.value;
      }
      const LABELS = { ninho: 'Ninho com Nutella', oreo: 'Oreo', churros: 'Churros', brigadeiro: 'Brigadeiro' };
      return LABELS[cb.value] || cb.value;
    });

    const msg = selected.length === 0
      ? 'Olá! Quero fazer um pedido na Doceria Silva! 🍬'
      : `Olá! Quero fazer um pedido na Doceria Silva! 🍬\n\n*Sabor(es) escolhido(s):*\n${
          selected.map(s => `• ${s} (bandeja c/ 4 un.)`).join('\n')
        }\n\nPoderia me passar mais informações? 😊`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      '_blank', 'noopener,noreferrer'
    );
  });

  // Visual feedback no checkbox
  document.addEventListener('change', (e) => {
    const label = e.target.closest('.flavor-opt');
    if (!label) return;
    label.style.transform = 'scale(1.04)';
    setTimeout(() => { label.style.transform = ''; }, 180);
  });
};

/* ══════════════════════════════════════════════════════════════
   10. BACK TO TOP
══════════════════════════════════════════════════════════════ */
const initBackTop = () => {
  const btn = $('#backTop');
  if (!btn) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      raf(() => {
        btn.classList.toggle('visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

/* ══════════════════════════════════════════════════════════════
   11. MISC
══════════════════════════════════════════════════════════════ */

// Ano no footer
const setYear = () => {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
};

// Smooth scroll nos âncoras
const initSmoothLinks = () => {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id     = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
};

// Tilt nos cards de produto (desktop)
const initCardTilt = () => {
  if (window.matchMedia('(hover: none)').matches) return;

  $$('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - .5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - .5) * -12;
      card.style.transform = `translateY(-10px) scale(1.02) rotateY(${x}deg) rotateX(${y}deg)`;
      card.style.transition = 'transform .1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s';
    });
  });
};

// Parallax sutil no hero
const initHeroParallax = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const visual  = $('.hero__visual');
  const content = $('.hero__content');
  if (!visual) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      raf(() => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight * 1.2) {
          visual.style.transform  = `translateY(${scrolled * 0.22}px)`;
          content.style.transform = `translateY(${scrolled * 0.08}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
};

// Pausa do marquee no hover
const initMarquee = () => {
  const track = $('.marquee-track');
  if (!track) return;
  const strip = track.parentElement;
  strip.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  strip.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
};

// Stagger nos cards do cardápio
const initCardStagger = () => {
  const section = $('#cardapio');
  if (!section) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$('.product-card').forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity    = '1';
              card.style.transform  = 'none';
              card.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1)';
            }, i * 100);
          });
          obs.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );

  $$('.product-card').forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(30px)';
  });

  obs.observe(section);
};

// Hint de scroll nos depoimentos
const initDepoimentosScroll = () => {
  const wrap = $('.depoimentos__track-wrap');
  if (!wrap) return;
  let hinted = false;
  setTimeout(() => {
    if (!hinted && wrap.scrollLeft === 0) {
      wrap.scrollTo({ left: 60, behavior: 'smooth' });
      setTimeout(() => wrap.scrollTo({ left: 0, behavior: 'smooth' }), 600);
      hinted = true;
    }
  }, 2500);
};

/* ══════════════════════════════════════════════════════════════
   BOOTSTRAP
══════════════════════════════════════════════════════════════ */
async function init() {
  setYear();
  initLoader();
  initCursor();
  initNav();
  initParticles();
  initDragScroll();
  initBackTop();
  initSmoothLinks();
  initHeroParallax();
  initMarquee();
  initDepoimentosScroll();

  // Carrega dados do CMS (pode demorar, por isso as interações básicas já estão rodando)
  try {
    await loadCMSData();
  } catch (e) {
    console.warn('[CMS] Falha ao carregar dados:', e);
  }

  // Após dados carregados (ou falha), inicializa o que depende do DOM final
  initReveal();
  initShowcase();
  initWhatsApp();
  initCardTilt();
  initCardStagger();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
