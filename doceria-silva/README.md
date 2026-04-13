# 🍬 Doceria Silva — Guia de Implantação

Site premium da Doceria Silva com painel administrativo via Decap CMS + Netlify.

---

## 📁 Estrutura de Pastas

```
doceria-silva/
├── index.html                  ← Página principal (pública)
├── robots.txt                  ← SEO: controle de indexação
├── sitemap.xml                 ← SEO: mapa do site para o Google
├── netlify.toml                ← Configurações de cache e headers
├── _redirects                  ← Regras de redirecionamento Netlify
│
├── assets/
│   ├── css/
│   │   └── style.css           ← Todos os estilos do site
│   ├── js/
│   │   └── main.js             ← JavaScript do site + carregador CMS
│   └── images/
│       └── uploads/            ← Imagens enviadas pelo painel CMS
│           └── .gitkeep
│
├── dados/                      ← JSONs editados pelo painel CMS
│   ├── configuracoes.json      ← Nome, WhatsApp, Instagram, cores, SEO
│   ├── hero.json               ← Seção inicial (banner principal)
│   ├── historia.json           ← Seção "Nossa História"
│   ├── cardapio.json           ← Lista de produtos (cardápio)
│   ├── showcase.json           ← Slides imersivos
│   ├── depoimentos.json        ← Avaliações de clientes
│   ├── pedido.json             ← Seção "Fazer Pedido"
│   └── marquee.json            ← Faixa deslizante de textos
│
└── admin/
    ├── index.html              ← Painel do Decap CMS
    ├── config.yml              ← Configuração do CMS (collections)
    └── preview.css             ← CSS do preview ao vivo do painel
```

---

## 🚀 Passo a Passo: Subir no GitHub e Netlify

### 1. Nomeando as imagens antes de subir

Nomeie seus arquivos de imagem **exatamente assim** (minúsculas, sem espaços, sem acentos):

| Imagem | Nome do arquivo |
|--------|----------------|
| Logo da empresa | `logo.png` |
| Favicon (ícone da aba) | `favicon.png` |
| Imagem principal (hero) | `hero-plate.png` |
| Foto da Emily e Vitória | `historia.jpg` |
| Foto do Ninho com Nutella | `ninho-nutella.jpg` |
| Foto do Oreo | `oreo.jpg` |
| Foto do Churros | `churros.jpg` |
| Foto do Brigadeiro | `brigadeiro.jpg` |
| Foto dos ingredientes | `ingredientes.jpg` |
| Foto do processo | `processo.jpg` |
| Foto da embalagem | `embalagem.jpg` |
| Imagem para WhatsApp/redes | `og-imagem.jpg` |

Coloque todos em `assets/images/uploads/`.

---

### 2. Criar repositório no GitHub

1. Acesse [github.com](https://github.com) → **New repository**
2. Nome sugerido: `doceria-silva`
3. Visibilidade: **Public** (necessário para o Netlify free tier)
4. Clique em **Create repository**
5. Faça upload de todos os arquivos desta pasta

---

### 3. Conectar ao Netlify

1. Acesse [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Escolha **GitHub** e selecione o repositório `doceria-silva`
3. Configurações de build:
   - **Build command:** *(deixe em branco)*
   - **Publish directory:** `.` (ponto — pasta raiz)
4. Clique em **Deploy site**

---

### 4. Ativar Netlify Identity

1. No painel do site no Netlify → aba **Identity**
2. Clique em **Enable Identity**
3. Em **Registration**: mude para **Invite only** (somente convite — evita cadastros indesejados)
4. Em **Git Gateway**: clique em **Enable Git Gateway**

---

### 5. Convidar as proprietárias como admin

1. Na aba **Identity** → **Invite users**
2. Digite o e-mail de Emily e de Vitória
3. Elas receberão um e-mail com link para criar senha
4. Ao clicar no link e criar a senha → são redirecionadas automaticamente para `/admin/`

---

### 6. Configurar domínio (Registro.br)

1. No Netlify → **Domain settings** → **Add custom domain**
2. Digite o domínio: `doceriasilva.com.br`
3. O Netlify mostrará os **nameservers** (ex: `dns1.p06.nsone.net`)
4. No painel do **Registro.br** → selecione o domínio → **Alterar servidores DNS**
5. Substitua pelos nameservers do Netlify
6. Aguarde propagação (até 24h)
7. Após propagar, ative **HTTPS** no Netlify (botão "Verify DNS" → "Provision SSL")

---

## 📝 Como usar o painel administrativo

**Acesso:** `https://seudominio.com.br/admin/`

### O que pode ser alterado:

| Seção no painel | O que muda no site |
|----------------|-------------------|
| ⚙️ Configurações Gerais | Nome, WhatsApp, Instagram, cores, SEO, logo, favicon |
| 🏠 Seção Inicial (Hero) | Título, descrição, imagem principal, botões |
| 📖 Nossa História | Textos, estatísticas, foto das proprietárias |
| 🍬 Cardápio | Adicionar/remover/editar produtos, fotos, preços, badges |
| 🎬 Seção Imersiva | Adicionar/remover slides com foto e texto |
| 💬 Depoimentos | Adicionar/remover avaliações de clientes |
| 🛒 Fazer Pedido | Textos e informações da seção de pedido |
| 📢 Faixa Deslizante | Textos que aparecem na faixa animada |

### Workflow de edição:
1. Acesse `/admin/` → faça login
2. Escolha a seção no menu lateral
3. Edite os campos (o preview ao vivo aparece à direita)
4. Clique em **Publish** (ou **Save draft** para rascunho)
5. O Netlify detecta a mudança no GitHub e **publica automaticamente em ~30 segundos**

---

## 🔍 SEO — O que já está configurado

- ✅ Meta description e keywords
- ✅ Open Graph (WhatsApp, Facebook, LinkedIn)
- ✅ Twitter Card
- ✅ Schema.org JSON-LD (Bakery/LocalBusiness)
- ✅ Canonical URL
- ✅ sitemap.xml (enviar ao Google Search Console)
- ✅ robots.txt
- ✅ Cache headers otimizados
- ✅ Alt texts nas imagens

### Submeter ao Google Search Console:
1. Acesse [search.google.com/search-console](https://search.google.com/search-console)
2. Adicione o domínio e verifique via Netlify DNS
3. Vá em **Sitemaps** → adicione: `https://seudominio.com.br/sitemap.xml`

---

## ⚠️ Checklist final antes de lançar

- [ ] Trocar `5511999999999` pelo WhatsApp real (em `dados/configuracoes.json` ou via painel)
- [ ] Substituir `https://doceriasilva.com.br` pela URL real em `dados/configuracoes.json` e `sitemap.xml`
- [ ] Adicionar todas as imagens em `assets/images/uploads/` com os nomes corretos
- [ ] Subir no GitHub
- [ ] Configurar Netlify (Identity + Git Gateway)
- [ ] Convidar usuárias admin por e-mail
- [ ] Apontar domínio Registro.br para Netlify
- [ ] Ativar HTTPS no Netlify
- [ ] Submeter sitemap no Google Search Console
- [ ] Testar painel `/admin/` no celular e no computador
- [ ] Testar botão do WhatsApp com número real

---

*Desenvolvido com stack: HTML + CSS + JavaScript Vanilla + Decap CMS + Netlify*
