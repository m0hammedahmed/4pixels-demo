import React, { useEffect, useMemo, useState } from 'react';
import './style.css';
import { DashboardPage, OrdersPage, ChatPage, SalesPage as SalesNew, CustomersPage as CustNew, CartsPage as CartsNew, MarketingPage, SmsPage as SmsNew, OffersPage, RetentionPage as RetNew, LoyaltyPage as LoyNew, PlanPage, SettingsPage as SetNew } from './pages';
import { PublicSite } from './public';
import { ORDERS as DORD } from './demoData';
import { Lang, makeT } from './i18n';
import {
  ORDERS, Order, CHATS, Conversation, AUTOMATIONS, TEMPLATES, SHIPMENTS,
  REVENUE_30D, RETENTION_COHORTS, SMS_CAMPAIGNS, PLANS, LANDING_FEATURES,
} from './data';

/* ---------- icons ---------- */
const paths: Record<string, string> = {
  overview: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  orders: 'M7 4V2h10v2h5v16H2V4h5zm2 0h6V3.5H9V4zM4 8v10h16V8H4z',
  chats: 'M4 2h16a2 2 0 012 2v12a2 2 0 01-2 2H8l-6 4V4a2 2 0 012-2z',
  automations: 'M12 2a7 7 0 017 7c0 2.4-1.2 4.2-2.6 5.7-.9 1-1.4 1.6-1.4 2.3h-6c0-.7-.5-1.3-1.4-2.3C6.2 13.2 5 11.4 5 9a7 7 0 017-7zM9 19h6v1a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1z',
  templates: 'M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm2 4h12v2H6V7zm0 4h12v2H6v-2zm0 4h8v2H6v-2z',
  loyalty: 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z',
  sms: 'M2 4h20v12h-9l-5 4v-4H2V4zm3 4v2h14V8H5zm0 4v2h9v-2H5z',
  retention: 'M3 3v18h18v-2H5V3H3zm6 14v-6h2v6H9zm4 0V7h2v10h-2zm4 0v-4h2v4h-2z',
  delivery: 'M3 4h11v10H3V4zm12 3h4l3 3v4h-7V7zM6 20a2 2 0 100-4 2 2 0 000 4zm11 0a2 2 0 100-4 2 2 0 000 4z',
  settings: 'M12 8a4 4 0 100 8 4 4 0 000-8zm9 4a7 7 0 01-.1 1.2l2 1.6-2 3.4-2.4-1a7 7 0 01-2 1.2L16 21H8l-.5-2.6a7 7 0 01-2-1.2l-2.4 1-2-3.4 2-1.6a7 7 0 010-2.4l-2-1.6 2-3.4 2.4 1a7 7 0 012-1.2L8 3h8l.5 2.6a7 7 0 012 1.2l2.4-1 2 3.4-2 1.6A7 7 0 0121 12z',
  bell: 'M12 22a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 22zm7-6v-5a7 7 0 00-5-6.7V4a2 2 0 00-4 0v.3A7 7 0 005 11v5l-2 2v1h18v-1l-2-2z',
  x: 'M6 6l12 12M18 6L6 18',
  check: 'M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.4L9 16.2z',
  menu: 'M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z',
  send: 'M2 21l21-9L2 3v7l15 2-15 2v7z',
  whatsapp: 'M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.3A10 10 0 1012 2zm0 2a8 8 0 110 16 8 8 0 01-4-.9l-.3-.2-2.8.7.7-2.7-.2-.3A8 8 0 0112 4zm-3 3.5c-.2 0-.5.1-.7.3-.6.6-1 1.5-.7 2.6.4 1.3 1.3 2.8 2.7 4 1.6 1.5 3 2.1 4.3 2.3 1 .2 1.9-.2 2.4-.8.2-.3.4-.8.4-1.2v-.7l-2.3-1.1-.6.3-.8.8c-.9-.4-2.2-1.3-2.9-2.5l.7-.8.3-.6-1.2-2.3-.7-.3z',
  instagram: 'M12 2c3 0 3.4 0 4.6.1 3.1.1 4.8 1.7 4.9 4.9.1 1.2.1 1.6.1 4.6s0 3.4-.1 4.6c-.1 3.1-1.7 4.8-4.9 4.9-1.2.1-1.6.1-4.6.1s-3.4 0-4.6-.1c-3.1-.1-4.8-1.7-4.9-4.9C2.4 15.4 2.4 15 2.4 12s0-3.4.1-4.6C2.6 4.3 4.2 2.7 7.3 2.6 8.6 2.5 9 2.5 12 2.5zm0 4.9a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm5.9-9.5a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z',
  messenger: 'M12 2a10 10 0 00-9.9 11.4c.2 2 .9 3.8 2 5.3V22l3.4-1.9c1.4.4 2.9.6 4.5.6A10 10 0 0012 2zm-4 11l3.5-4 3 3 3.5-3-4 5.5-3-3L7 16l-1-1.5L7 13z',
  shopify: 'M14 2l5 2-1 18-7 2-8-3V5l6-1 4-2zM9 8c-1.5.3-3 .9-3 2 0 2 4 2.4 4 4.5 0 1.5-1.3 2.5-3 2.5-1 0-2-.4-2.5-.8l.5-1.6c.5.3 1.2.6 1.8.6.7 0 1-.4 1-.9 0-1.4-3.6-1.4-3.6-4.2 0-2 1.7-3.1 3.8-3.3L9 8z',
  inbox: 'M3 3h18v18H3V3zm2 2v8h4a3 3 0 006 0h4V5H5z',
  profit: 'M3 3v18h18v-2H5V3H3zm4 12l4-5 3 3 5-7 1.5 1.2-6.5 9.2-3-3-3 3.6L7 15z',
  cart: 'M7 18a2 2 0 102 2 2 2 0 00-2-2zm10 0a2 2 0 102 2 2 2 0 00-2-2zM3 2h3l2.6 12.4a1 1 0 001 .6h8.8a1 1 0 001-.8L21 6H6.2',
  auto: 'M12 2l1.8 4.6L18 8l-4.2 1.4L12 14l-1.8-4.6L6 8l4.2-1.4L12 2zm7 9l.9 2.3 2.1.7-2.1.7L19 17l-.9-2.3-2.1-.7 2.1-.7L19 11zM5 13l1.2 3 3 1-3 1-1.2 3-1.2-3-3-1 3-1L5 13z',
  back: 'M15 4l-8 8 8 8 1.5-1.5L10 12l6.5-6.5L15 4z',
};

export function I({ n, size = 20 }: { n: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={n === 'x' || n === 'check' ? 2 : 0} strokeLinecap="round" strokeLinejoin="round">
      {n === 'x' ? <path d={paths.x} /> : n === 'check' ? <path d={paths.check} /> : <path d={paths[n] || ''} fill="currentColor" stroke="none" />}
    </svg>
  );
}

const fmt = (n: number) => n.toLocaleString('en-US');

/* ---------- notifications data ---------- */
const INITIAL_NOTIFS = [
  { id: 'n1', icon: 'orders', color: 'gold', en: 'New order PX-4821 from Mariam Adel, 1,950 EGP.', ar: 'أوردر جديد PX-4821 من مريم عادل، 1,950 جنيه.', time: '11:42' },
  { id: 'n2', icon: 'templates', color: 'red', en: 'Template flash_sale_v1 was rejected by Meta. Edit and resubmit.', ar: 'تمبليت flash_sale_v1 اترفض من Meta. عدّله وابعته تاني.', time: '09:15' },
  { id: 'n3', icon: 'delivery', color: 'blue', en: 'Shipment BST-88213 is out for delivery in Mansoura.', ar: 'شحنة BST-88213 خرجت للتسليم في المنصورة.', time: '08:40' },
];

const ORDER_STATUS_CHIP: Record<Order['status'], string> = {
  new: 'gold', confirmed: 'blue', shipped: 'purple', delivered: 'green', cancelled: 'red',
};
const SHIP_STATE_CHIP: Record<string, string> = { inTransit: 'blue', outFor: 'gold', delivered: 'green', failed: 'red' };

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const t = useMemo(() => makeT(lang), [lang]);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const ALIAS: Record<string, string> = { marketing: 'templates', offers: 'automations', 'smart-offers': 'automations', plan: 'billing', chat: 'chats' };
  const initial0 = (typeof location !== 'undefined' && location.hash.replace('#', '')) || 'home';
  const initial = ALIAS[initial0] || initial0;
  const [page, setPage] = useState<string>(initial === 'landing' ? 'home' : initial);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ m: string; undo?: () => void } | null>(null);
  const showToast = (m: string, undo?: () => void) => { setToast({ m, undo }); window.setTimeout(() => setToast(null), undo ? 5000 : 2200); };

  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [notifOpen, setNotifOpen] = useState(false);

  const PUB = ['home', 'about', 'features', 'pricing', 'projects', 'contact'];
  const [connected, setConnected] = useState(initial !== 'home' && !PUB.includes(initial) && initial !== 'login' && initial !== 'connect');
  useEffect(() => { const names: Record<string, string> = { home: 'Home', about: 'About', features: 'Features', pricing: 'Pricing', projects: 'Projects', contact: 'Contact', login: 'Sign in', connect: 'Connect your store', dashboard: 'Dashboard', overview: 'Dashboard', orders: 'Orders', chats: 'Chat', sales: 'Shopify Sales', customers: 'Customers', carts: 'Abandoned Carts', templates: 'Marketing', sms: 'SMS', automations: 'Smart Offers', retention: 'Retention', loyalty: 'Loyalty & Rewards', billing: 'Plan & Billing', settings: 'Settings' }; document.title = (names[page] || 'Page not found') + ' | 4Pixels'; }, [page]);
  const go = (p: string) => {
    if (p === 'dashboard' && !connected) p = 'connect';
    if (p === 'landing') p = 'home';
    if (ALIAS[p]) p = ALIAS[p];
    setPage(p); setMenuOpen(false); window.scrollTo(0, 0);
    if (typeof history !== 'undefined') history.replaceState(null, '', '#' + p);
  };

  return (
    <div dir={dir} className={dir === 'rtl' ? 'rtl-root' : ''}>
      {PUB.includes(page) ? (
        <PublicSite lang={lang} setLang={setLang} go={go} page={page} />
      ) : page === 'login' ? (
        <AuthPage mode="login" lang={lang} setLang={setLang} go={go} onDone={(signup) => go(connected && !signup ? 'dashboard' : 'connect')} />
      ) : page === 'connect' ? (
        <ConnectPage lang={lang} setLang={setLang} go={go} onDone={() => { setConnected(true); go('dashboard'); }} />
      ) : (
        <Shell
          t={t} lang={lang} setLang={setLang} page={page} go={go}
          menuOpen={menuOpen} setMenuOpen={setMenuOpen}
          notifs={notifs} setNotifs={setNotifs}
          notifOpen={notifOpen} setNotifOpen={setNotifOpen}
          showToast={showToast}
        />
      )}
      {toast && <div className="toast">{toast.m}{toast.undo && <button className="toast-undo" onClick={() => { toast.undo!(); setToast(null); }}>Undo</button>}</div>}
    </div>
  );
}

/* ================= LANDING ================= */
function Landing({ t, lang, setLang, go }: { t: (k: string) => string; lang: Lang; setLang: (l: Lang) => void; go: (p: string) => void }) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="brand"><span className="brand-mark">4P</span>4Pixels</div>
        <div className="actions">
          <button className="lang-btn" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>{t('common.language')}</button>
          <button className="btn btn-primary btn-sm" onClick={() => go('login')}>{t('land.ctaDemo')}</button>
        </div>
      </nav>

      <header className="hero">
        <div>
          <span className="hero-badge"><span className="dot" />{t('land.badge')}</span>
          <h1>{t('land.heroTitle')}</h1>
          <p className="sub">{t('land.heroSub')}</p>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={() => go('login')}>{t('land.ctaStart')}</button>
            <button className="btn btn-ghost" onClick={() => go('login')}>{t('land.ctaDemo')}</button>
          </div>
        </div>
        <div className="hero-media hero-mock">
          <div className="hm-top">
            <span className="hm-dot" /><span className="hm-dot" /><span className="hm-dot" />
            <span className="hm-title">4Pixels · {t('dash.title')}</span>
          </div>
          <div className="hm-body">
            <div className="hm-kpis">
              <div className="hm-kpi"><span>{t('dash.revenue')}</span><strong>273,900 {t('common.egp')}</strong></div>
              <div className="hm-kpi"><span>{t('dash.orders')}</span><strong>1,180</strong></div>
              <div className="hm-kpi"><span>{t('dash.recovered')}</span><strong>87</strong></div>
            </div>
            <svg viewBox="0 0 300 90" className="hm-chart" aria-hidden="true">
              <defs>
                <linearGradient id="hgA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M4 70 L28 62 L52 66 L76 50 L100 54 L124 40 L148 46 L172 34 L196 38 L220 24 L244 30 L268 16 L296 10 L296 86 L4 86 Z" fill="url(#hgA)" />
              <path d="M4 70 L28 62 L52 66 L76 50 L100 54 L124 40 L148 46 L172 34 L196 38 L220 24 L244 30 L268 16 L296 10" fill="none" stroke="#0ea5e9" strokeWidth="2.4" strokeLinejoin="round" />
            </svg>
            <div className="hm-row"><span className="hm-id">PX-4821</span><span>Mariam Adel</span><span className="hm-ok">1,950 {t('common.egp')}</span></div>
            <div className="hm-row"><span className="hm-id">PX-4820</span><span>Ahmed Samy</span><span className="hm-ok">700 {t('common.egp')}</span></div>
            <div className="hm-row"><span className="hm-id">PX-4819</span><span>Nour Hassan</span><span className="hm-ok">2,400 {t('common.egp')}</span></div>
          </div>
        </div>
      </header>

      <section className="section">
        <h2>{t('land.featTitle')}</h2>
        <p className="sub">{t('land.featSub')}</p>
        <div className="feat-grid">
          {LANDING_FEATURES.map((f, i) => (
            <div className="feat-card" key={i}>
              <div className="feat-icon"><I n={f.icon} /></div>
              <h3>{f.title[lang]}</h3>
              <p>{f.desc[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>{t('land.pricingTitle')}</h2>
        <p className="sub">{t('land.pricingSub')}</p>
        <div className="price-grid">
          {PLANS.map((p, i) => (
            <div className={`price-card${p.popular ? ' popular' : ''}`} key={i}>
              {p.popular && <span className="popular-tag">{t('land.mostPopular')}</span>}
              <h3>{p.name[lang]}</h3>
              <div className="amount">{fmt(p.price)} <small>{t('common.egp')}{t('land.perMonth')}</small></div>
              <ul>{p.features[lang].map((f, j) => <li key={j}>{f}</li>)}</ul>
              <button className={`btn ${p.popular ? 'btn-primary' : 'btn-ghost'}`} onClick={() => go('login')}>{t('land.choose')}</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <span>4Pixels</span>
        <span>{t('land.footer')}</span>
      </footer>
    </div>
  );
}

/* ================= SHELL ================= */
function Shell(props: {
  t: (k: string) => string; lang: Lang; setLang: (l: Lang) => void;
  page: string; go: (p: string) => void;
  menuOpen: boolean; setMenuOpen: (b: boolean) => void;
  notifs: typeof INITIAL_NOTIFS; setNotifs: (n: typeof INITIAL_NOTIFS) => void;
  notifOpen: boolean; setNotifOpen: (b: boolean) => void;
  showToast: (m: string, undo?: () => void) => void;
}) {
  const [pal, setPal] = useState(false);
  const [pq, setPq] = useState('');
  useEffect(() => { const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal(p => !p); setPq(''); } else if (e.key === 'Escape') setPal(false); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);
  const { t, lang, setLang, page, go, menuOpen, setMenuOpen, notifs, setNotifs, notifOpen, setNotifOpen, showToast } = props;
  const GROUPS: { g: string; items: { k: string; page: string; icon: string; badge?: string }[] }[] = [
    { g: 'workspace', items: [
      { k: 'chat', page: 'chats', icon: 'chats', badge: '3' },
      { k: 'dashboard', page: 'overview', icon: 'overview' },
      { k: 'sales', page: 'sales', icon: 'shopify', badge: 'EXACT' },
      { k: 'orders', page: 'orders', icon: 'orders' },
      { k: 'customers', page: 'customers', icon: 'inbox' },
    ] },
    { g: 'growth', items: [
      { k: 'carts', page: 'carts', icon: 'cart' },
      { k: 'marketing', page: 'templates', icon: 'templates' },
      { k: 'sms', page: 'sms', icon: 'sms' },
      { k: 'offers', page: 'automations', icon: 'auto' },
      { k: 'retention', page: 'retention', icon: 'retention' },
      { k: 'loyaltyR', page: 'loyalty', icon: 'loyalty' },
    ] },
    { g: 'account', items: [
      { k: 'billing', page: 'billing', icon: 'profit' },
      { k: 'settings', page: 'settings', icon: 'settings' },
    ] },
  ];
  const pageKey = page === 'dashboard' ? 'overview' : page;
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); const id = window.setTimeout(() => setLoading(false), 260); return () => window.clearTimeout(id); }, [pageKey]);
  const KNOWN = ['overview', 'orders', 'chats', 'sales', 'customers', 'carts', 'templates', 'sms', 'automations', 'retention', 'loyalty', 'billing', 'settings', 'delivery'];

  return (
    <div className="shell">
      <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
        <div className="brand"><span className="brand-mark">4P</span><span>4Pixels<small>CRM &amp; E-COMMERCE</small></span></div>
        <div className="ws-card"><span>demo@store.com</span><span className="ws-pill">USER</span></div>
        <div className="side-scroll">
          {GROUPS.map(gr => (
            <div key={gr.g}>
              <div className="side-group">{t(`nav.g.${gr.g}`)}</div>
              {gr.items.map(it => (
                <button key={it.k} className={`side-link${pageKey === it.page ? ' active' : ''}`} onClick={() => go(it.page)}>
                  <span className="side-ic"><I n={it.icon} size={17} /></span>{t(`nav.${it.k}`)}
                  {it.badge && <span className={it.badge === 'EXACT' ? 'exact-pill' : 'nav-badge'}>{it.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="side-foot">
          <button className="logout-btn" onClick={() => { setConnected(false); go('login'); }}><I n="back" size={18} />{t('nav.logout')}</button>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu"><I n="menu" /></button>
          <div className="searchbox">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--muted-2)', flex: 'none' }}><path d="M10 2a8 8 0 105.3 14l5.3 5.4 1.5-1.5-5.4-5.3A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"/></svg>
            <input readOnly placeholder={t('top.search')} onClick={() => { setPal(true); setPq(''); }} onFocus={() => { setPal(true); setPq(''); }} /><kbd className="kbd">Ctrl K</kbd>
          </div>
          <button className="trial-pill trial-btn" onClick={() => go('billing')}>{t('top.trial')}<span className="tbar"><i style={{ width: '20%' }} /></span></button>
          <div className="top-actions">
            <button className="lang-btn" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>{t('common.language')}</button>
            <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)} aria-label="notifications">
              <I n="bell" size={18} />
              {notifs.length > 0 && <span className="badge-dot">{notifs.length}</span>}
            </button>
            <div className="avatar">M</div>
          </div>
        </div>

        {pal && (() => {
          const pages = GROUPS.flatMap(g => g.items).map(it => ({ label: t(`nav.${it.k}`), go: it.page, kind: 'Page' }));
          const cust = CUSTOMERS_DEMO.map(c => ({ label: `${c.n} · ${c.p}`, go: 'customers', kind: 'Customer' }));
          const ords = DORD.slice(0, 40).map(o => ({ label: `#${o.id} · ${o.name}`, go: 'orders', kind: 'Order' }));
          const all = [...pages, ...cust, ...ords];
          const ql = pq.toLowerCase();
          const res = (ql ? all.filter(x => x.label.toLowerCase().includes(ql)) : pages).slice(0, 8);
          return (
            <div className="pal-back" onClick={() => setPal(false)}>
              <div className="pal" onClick={e => e.stopPropagation()}>
                <input autoFocus className="pal-in" placeholder="Search pages, orders, customers..." value={pq} onChange={e => setPq(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && res[0]) { go(res[0].go); setPal(false); } }} />
                <div className="pal-list">
                  {res.map((r, i) => <button key={i} className="pal-row" onClick={() => { go(r.go); setPal(false); }}><span>{r.label}</span><small>{r.kind}</small></button>)}
                  {res.length === 0 && <div className="muted small" style={{ padding: 14 }}>No results</div>}
                </div>
                <div className="pal-foot muted small">Enter to open · Esc to close</div>
              </div>
            </div>
          );
        })()}
        {notifOpen && (
          <div className="notif-pop">
            <div className="notif-head">
              <strong>{t('notif.title')}</strong>
              {notifs.length > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={() => setNotifs([])}>{t('notif.dismissAll')}</button>
              )}
            </div>
            {notifs.length === 0 ? (
              <div className="notif-empty">{t('notif.empty')}</div>
            ) : notifs.map(n => (
              <div className="notif-item" key={n.id}>
                <div className={`ic chip ${n.color}`} style={{ padding: 0 }}><I n={n.icon} size={16} /></div>
                <div className="tx">{lang === 'ar' ? n.ar : n.en}<div className="t">{n.time}</div></div>
                <button className="notif-x" title={t('notif.dismiss')} onClick={() => setNotifs(notifs.filter(x => x.id !== n.id))}><I n="x" size={14} /></button>
              </div>
            ))}
          </div>
        )}

        <div className={`content${pageKey === 'chats' ? ' content-wide' : ''}`} onClick={() => { if (notifOpen) setNotifOpen(false); }}>
          {loading && KNOWN.includes(pageKey) && <div className="skel"><i style={{ width: '38%' }} /><div className="skel-row"><i /><i /><i /></div><i style={{ height: 180 }} /><i style={{ height: 120 }} /></div>}
          {!loading && !KNOWN.includes(pageKey) && <div className="card card-pad nf"><h1>404</h1><p className="muted">This page does not exist.</p><button className="btn btn-primary" onClick={() => go('dashboard')}>Back to dashboard</button></div>}
          {!loading && pageKey === 'overview' && <DashboardPage lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'orders' && <OrdersPage lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'chats' && <ChatPage lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'sales' && <SalesNew lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'customers' && <CustNew lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'carts' && <CartsNew lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'templates' && <MarketingPage lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'sms' && <SmsNew lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'automations' && <OffersPage lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'retention' && <RetNew lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'loyalty' && <LoyNew lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'billing' && <PlanPage lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'settings' && <SetNew lang={lang} showToast={showToast} go={go} />}
          {!loading && pageKey === 'delivery' && <DeliveryPage t={t} />}
        </div>
      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard({ t, lang, go }: { t: (k: string) => string; lang: Lang; go: (p: string) => void }) {
  const [steps, setSteps] = useState([true, true, false]);
  const kpis = [
    { label: t('dash.revenue'), value: `${fmt(273900)} ${t('common.egp')}`, delta: '+18.2%', up: true },
    { label: t('dash.orders'), value: '1,180', delta: '+9.4%', up: true },
    { label: t('dash.netProfit'), value: `${fmt(96400)} ${t('common.egp')}`, delta: '+12.1%', up: true },
    { label: t('dash.recovered'), value: '87', delta: '+31.0%', up: true },
  ];

  const max = Math.max(...REVENUE_30D);
  const W = 760, H = 200, P = 8;
  const pts = REVENUE_30D.map((v, i) => [P + (i * (W - 2 * P)) / (REVENUE_30D.length - 1), H - P - (v / max) * (H - 2 * P)] as const);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${(W - P).toFixed(1)},${H - P} L${P},${H - P} Z`;

  const checklist = [
    { label: t('dash.checklist.shopify'), done: steps[0] },
    { label: t('dash.checklist.whatsapp'), done: steps[1] },
    { label: t('dash.checklist.automation'), done: steps[2] },
  ];

  return (
    <div className="grid">
      <div className="page-head">
        <h1>{t('dash.title')}</h1>
        <p>{t('dash.subtitle')}</p>
      </div>

      <div className="grid kpi-grid">
        {kpis.map((k, i) => (
          <div className="card kpi" key={i}>
            <div className="label">{k.label}</div>
            <div className="value mono">{k.value}</div>
            <span className={`delta ${k.up ? 'up' : 'down'}`}>{k.delta} {t('dash.vsLast')}</span>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card chart-box">
          <p className="card-title">{t('dash.revByDay')}</p>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t('dash.revByDay')}>
            <defs>
              <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map(f => (
              <line key={f} x1={P} x2={W - P} y1={H * f} y2={H * f} stroke="#e2e8f0" strokeWidth="1" />
            ))}
            <path d={area} fill="url(#gA)" />
            <path d={line} fill="none" stroke="#0ea5e9" strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="card card-pad">
          <p className="card-title">{t('dash.checklist.title')}</p>
          <p className="muted small" style={{ marginTop: -8, marginBottom: 14 }}>{t('dash.checklist.sub')}</p>
          <div className="checklist">
            {checklist.map((c, i) => (
              <div className={`check-item${c.done ? ' done' : ''}`} key={i}>
                <div className="ic"><I n={c.done ? 'check' : 'auto'} size={16} /></div>
                <div className="txt">{c.label}</div>
                {c.done
                  ? <span className="chip green">{t('dash.checklist.done')}</span>
                  : <button className="btn btn-primary btn-sm" onClick={() => setSteps(steps.map((s, j) => (j === i ? true : s)))}>{t('dash.checklist.start')}</button>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 6 }}>
          <p className="card-title" style={{ margin: 0 }}>{t('dash.recentOrders')}</p>
          <button className="btn btn-ghost btn-sm" onClick={() => go('orders')}>{t('dash.viewAll')}</button>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>ID</th><th>{t('orders.customer')}</th><th>{t('orders.total')}</th><th>{t('orders.profit')}</th><th>{t('orders.status')}</th></tr>
            </thead>
            <tbody>
              {ORDERS.slice(0, 5).map(o => (
                <tr key={o.id} className="row-click" onClick={() => go('orders')}>
                  <td className="mono">{o.id}</td>
                  <td>{o.customer}</td>
                  <td className="mono">{fmt(o.total)} {t('common.egp')}</td>
                  <td className="mono" style={{ color: o.status === 'cancelled' ? 'var(--muted-2)' : 'var(--green)' }}>
                    {o.status === 'cancelled' ? '-' : `${fmt(o.total - o.cost - o.shipping - o.fees)} ${t('common.egp')}`}
                  </td>
                  <td><span className={`chip ${ORDER_STATUS_CHIP[o.status]}`}>{t(`orders.${o.status}`)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= ORDERS ================= */
function OrdersPageOld({ t, showToast }: { t: (k: string) => string; showToast: (m: string) => void }) {
  const [filter, setFilter] = useState<string>('all');
  const [sel, setSel] = useState<Order | null>(null);
  const [sentIds, setSentIds] = useState<string[]>([]);
  const list = ORDERS.filter(o => filter === 'all' || o.status === filter);

  return (
    <div>
      <div className="page-head">
        <h1>{t('orders.title')}</h1>
      </div>
      <div className="tabs">
        {['all', 'new', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
          <button key={s} className={`tab${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>{t(`orders.${s}`)}</button>
        ))}
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th><th>{t('orders.customer')}</th><th>{t('orders.items')}</th>
                <th>{t('orders.total')}</th><th>{t('orders.profit')}</th><th>{t('orders.status')}</th><th>{t('orders.date')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map(o => (
                <tr key={o.id} className="row-click" onClick={() => setSel(o)}>
                  <td className="mono">{o.id}</td>
                  <td>{o.customer}<div className="muted small">{o.governorate}</div></td>
                  <td className="muted small">{o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</td>
                  <td className="mono">{fmt(o.total)}</td>
                  <td className="mono" style={{ color: o.status === 'cancelled' ? 'var(--muted-2)' : 'var(--green)' }}>
                    {o.status === 'cancelled' ? '-' : fmt(o.total - o.cost - o.shipping - o.fees)}
                  </td>
                  <td><span className={`chip ${ORDER_STATUS_CHIP[o.status]}`}>{t(`orders.${o.status}`)}</span></td>
                  <td className="muted small" dir="ltr">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sel && (
        <>
          <div className="drawer-back" onClick={() => setSel(null)} />
          <div className="drawer">
            <div className="drawer-head">
              <h2>{t('orders.detail')} <span className="mono muted">{sel.id}</span></h2>
              <button className="icon-btn" onClick={() => setSel(null)} aria-label={t('orders.close')}><I n="x" size={16} /></button>
            </div>
            <div className="drawer-body">
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{sel.customer}</div>
                <div className="muted small"><span dir="ltr">{sel.phone}</span> · {sel.governorate}</div>
                <div style={{ marginTop: 8 }}><span className={`chip ${ORDER_STATUS_CHIP[sel.status]}`}>{t(`orders.${sel.status}`)}</span></div>
              </div>
              <div className="card card-pad" style={{ background: 'var(--panel-2)' }}>
                {sel.items.map((i, idx) => (
                  <div className="item-row" key={idx}>
                    <span>{i.name} x{i.qty}</span>
                    <span className="mono">{fmt(i.price * i.qty)} {t('common.egp')}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="kv"><span className="k">{t('orders.cost')}</span><span className="mono">{fmt(sel.cost)} {t('common.egp')}</span></div>
                <div className="kv"><span className="k">{t('orders.shipping')}</span><span className="mono">{fmt(sel.shipping)} {t('common.egp')}</span></div>
                <div className="kv"><span className="k">{t('orders.fees')}</span><span className="mono">{fmt(sel.fees)} {t('common.egp')}</span></div>
                <div className="kv total"><span>{t('orders.total')}</span><span className="mono">{fmt(sel.total)} {t('common.egp')}</span></div>
                <div className="kv profit"><span>{t('orders.profit')}</span><span className="mono">{fmt(sel.total - sel.cost - sel.shipping - sel.fees)} {t('common.egp')}</span></div>
              </div>
              <button
                className="btn btn-primary"
                disabled={sentIds.includes(sel.id)}
                onClick={() => { setSentIds([...sentIds, sel.id]); showToast(t('orders.sent')); }}
              >
                <I n="whatsapp" size={16} />
                {sentIds.includes(sel.id) ? t('orders.sent') : t('orders.sendWA')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= CHATS ================= */
function ChatsPage({ t }: { t: (k: string) => string }) {
  const [chats, setChats] = useState<Conversation[]>(CHATS);
  const [selId, setSelId] = useState('c1');
  const [draft, setDraft] = useState('');
  const [chanFilter, setChanFilter] = useState('all');
  const sel = chats.find(c => c.id === selId)!;
  const list = chats.filter(c => chanFilter === 'all' || c.channel === chanFilter);

  const send = () => {
    if (!draft.trim()) return;
    setChats(chats.map(c => c.id === selId
      ? { ...c, messages: [...c.messages, { from: 'me', text: draft.trim(), time: 'now' }], last: draft.trim(), unread: 0 }
      : c));
    setDraft('');
  };

  const chanIcon: Record<string, string> = { whatsapp: 'whatsapp', instagram: 'instagram', messenger: 'messenger' };

  return (
    <div>
      <div className="page-head"><h1>{t('chats.title')}</h1></div>
      <div className="tabs">
        <button className={`tab${chanFilter === 'all' ? ' active' : ''}`} onClick={() => setChanFilter('all')}>{t('chats.all')}</button>
        {(['whatsapp', 'instagram', 'messenger'] as const).map(c => (
          <button key={c} className={`tab${chanFilter === c ? ' active' : ''}`} onClick={() => setChanFilter(c)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><I n={chanIcon[c]} size={14} />{c[0].toUpperCase() + c.slice(1)}</span>
          </button>
        ))}
      </div>
      <div className="chat-layout">
        <div className="conv-list">
          {list.map(c => (
            <div key={c.id} className={`conv-item${c.id === selId ? ' active' : ''}`} onClick={() => { setSelId(c.id); setChats(chats.map(x => x.id === c.id ? { ...x, unread: 0 } : x)); }}>
              <div className="conv-avatar">{c.name[0].toUpperCase()}</div>
              <div className="conv-meta">
                <div className="conv-top"><span className="conv-name">{c.name}</span><span className="conv-time">{c.time}</span></div>
                <div className="conv-last" dir="auto">{c.last}</div>
                <div className="conv-bottom">
                  <span className="chan-chip"><I n={chanIcon[c.channel]} size={12} />{c.channel}</span>
                  {c.unread > 0 && <span className="unread-badge">{c.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="thread">
          <div className="thread-head">
            <div className="conv-avatar" style={{ width: 36, height: 36 }}>{sel.name[0].toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <div className="name">{sel.name}</div>
              <div className="st">{t('chats.online')} · {sel.channel}{sel.assigned ? ` · ${t('chats.assignTo')}: ${sel.assigned}` : ''}</div>
            </div>
            <span className={`chip blue`}><I n={chanIcon[sel.channel]} size={12} />{sel.channel}</span>
          </div>
          <div className="msgs">
            {sel.messages.map((m, i) => (
              <div key={i} className={`msg ${m.from === 'me' ? 'me' : 'customer'}`}>
                {m.text}
                <div className="mt">{m.from === 'me' ? `${t('chats.you')} · ` : ''}{m.time}</div>
              </div>
            ))}
          </div>
          <div className="composer">
            <input
              value={draft}
              placeholder={t('chats.typeMsg')}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send(); }}
            />
            <button className="btn btn-primary" onClick={send}><I n="send" size={16} />{t('chats.send')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= AUTOMATIONS ================= */
function AutomationsPage({ t, lang }: { t: (k: string) => string; lang: Lang }) {
  const [overrides, setOverrides] = useState<Record<string, 'active' | 'paused'>>({});
  const stateOf = (a: typeof AUTOMATIONS[number]) => overrides[a.id] ?? a.state;

  return (
    <div>
      <div className="page-head">
        <h1>{t('auto.title')}</h1>
        <p>{t('auto.sub')}</p>
      </div>
      <div className="auto-grid">
        {AUTOMATIONS.map(a => {
          const st = stateOf(a);
          return (
            <div className="card auto-card" key={a.id}>
              <div className="auto-top">
                <h3>{a.name[lang]}</h3>
                <button
                  className={`switch${st === 'active' ? ' on' : ''}`}
                  disabled={st === 'needsTemplate'}
                  title={st === 'needsTemplate' ? t('auto.needsTemplate') : st === 'active' ? t('auto.off') : t('auto.on')}
                  onClick={() => setOverrides({ ...overrides, [a.id]: st === 'active' ? 'paused' : 'active' })}
                />
              </div>
              <p className="auto-desc">{a.desc[lang]}</p>
              <div>
                {st === 'active' && <span className="chip green">{t('auto.active')}</span>}
                {st === 'paused' && <span className="chip grey">{t('auto.paused')}</span>}
                {st === 'needsTemplate' && <span className="chip gold">{t('auto.needsTemplate')}</span>}
              </div>
              {(a.sent30 > 0 || a.recovered30) && (
                <div className="auto-stats">
                  {a.sent30 > 0 && <div className="auto-stat"><div className="v mono">{fmt(a.sent30)}</div><div className="l">{t('auto.sent30')}</div></div>}
                  {a.recovered30 ? <div className="auto-stat"><div className="v mono">{fmt(a.recovered30)}</div><div className="l">{t('auto.recovered30')}</div></div> : null}
                </div>
              )}
              <div className="auto-preview"><span className="lbl">{t('auto.preview')}</span>{a.preview}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= TEMPLATES ================= */
function TemplatesPage({ t, showToast }: { t: (k: string) => string; showToast: (m: string) => void }) {
  const [synced, setSynced] = useState(false);
  const chipFor = { approved: 'green', pending: 'gold', rejected: 'red' } as const;
  return (
    <div>
      <div className="page-head">
        <h1>{t('tpl.title')}</h1>
        <p>{t('tpl.sub')}</p>
      </div>
      <div className="tpl-head-row">
        <div>
          <span className="chip green">{t('tpl.synced')}</span>
          {synced && <span className="sync-ok" style={{ marginInlineStart: 10 }}>{t('tpl.syncedOk')}</span>}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => { setSynced(true); showToast(t('tpl.syncedOk')); }}>{t('tpl.resync')}</button>
      </div>
      <div className="tpl-grid">
        {TEMPLATES.map(tp => (
          <div className="card tpl-card" key={tp.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span className="nm">{tp.name}</span>
              <span className={`chip ${chipFor[tp.state]}`}>{t(`tpl.${tp.state}`)}</span>
            </div>
            <span className="cat">{tp.category}</span>
            {tp.state === 'rejected' && (
              <div className="tpl-reason"><strong>{t('tpl.rejectedWhy')}:</strong> {tp.reason}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= LOYALTY ================= */
function LoyaltyPage({ t }: { t: (k: string) => string }) {
  const tiers = [
    { name: 'Bronze', pts: '0 - 499', members: 640, color: 'gold', w: 62 },
    { name: 'Silver', pts: '500 - 1,499', members: 290, color: 'grey', w: 28 },
    { name: 'Gold', pts: '1,500+', members: 102, color: 'purple', w: 10 },
  ];
  return (
    <div>
      <div className="page-head"><h1>{t('loy.title')}</h1></div>
      <div className="stat-row">
        <div className="card kpi"><div className="label">{t('loy.members')}</div><div className="value mono">1,032</div></div>
        <div className="card kpi"><div className="label">{t('loy.pointsIssued')}</div><div className="value mono">148,200</div></div>
        <div className="card kpi"><div className="label">{t('loy.redeemed')}</div><div className="value mono">214</div></div>
      </div>
      <div className="two-col">
        <div className="card card-pad">
          <p className="card-title">{t('loy.tiers')}</p>
          {tiers.map((tr, i) => (
            <div className="tier-row" key={i}>
              <div className={`tier-badge chip ${tr.color}`} style={{ padding: 0 }}><I n="loyalty" size={18} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{tr.name} <span className="muted small">({tr.pts})</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${tr.w}%` }} /></div>
              </div>
              <span className="mono">{tr.members}</span>
            </div>
          ))}
        </div>
        <div className="card card-pad">
          <p className="card-title">{t('loy.howItWorks')}</p>
          <div className="kv"><span className="k">1 EGP spent</span><span className="mono">1 pt</span></div>
          <div className="kv"><span className="k">Review submitted</span><span className="mono">50 pts</span></div>
          <div className="kv"><span className="k">Referral order</span><span className="mono">200 pts</span></div>
          <div className="kv"><span className="k">100 pts =</span><span className="mono">10 EGP off</span></div>
        </div>
      </div>
    </div>
  );
}

/* ================= SMS ================= */
function SmsPage({ t, showToast }: { t: (k: string) => string; showToast: (m: string) => void }) {
  return (
    <div>
      <div className="page-head"><h1>{t('sms.title')}</h1></div>
      <div className="card wallet-hero" style={{ marginBottom: 18 }}>
        <div>
          <div className="muted small">{t('sms.balance')}</div>
          <div className="bal mono">2,340 <small>{t('common.egp')} · 1.50 {t('common.egp')} {t('sms.perMsg')}</small></div>
        </div>
        <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
          <button className="btn btn-primary" onClick={() => showToast(t('sms.topupHow'))}>{t('sms.topup')}</button>
          <span className="muted small" style={{ maxWidth: 280 }}>{t('sms.topupHow')}</span>
        </div>
      </div>
      <div className="card">
        <div className="card-pad" style={{ paddingBottom: 6 }}><p className="card-title" style={{ margin: 0 }}>{t('sms.campaigns')}</p></div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>{t('sms.campaigns')}</th><th>{t('chats.send')}</th><th>{t('sms.delivered')}</th><th>{t('orders.date')}</th></tr></thead>
            <tbody>
              {SMS_CAMPAIGNS.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td className="mono">{fmt(c.sent)}</td>
                  <td><span className="chip green mono">{fmt(c.delivered)}</span></td>
                  <td className="muted small">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= RETENTION ================= */
function RetentionPage({ t }: { t: (k: string) => string }) {
  const heat = (v: number) => {
    if (v <= 0) return { background: '#eef2f7', color: 'var(--muted-2)' };
    const a = Math.min(0.85, 0.15 + v / 40);
    return { background: `rgba(2, 132, 199, ${a})`, color: a > 0.5 ? '#ffffff' : 'var(--text)' };
  };
  return (
    <div>
      <div className="page-head">
        <h1>{t('ret.title')}</h1>
        <p>{t('ret.sub')}</p>
      </div>
      <div className="stat-row">
        <div className="card kpi"><div className="label">{t('ret.repeatRate')}</div><div className="value mono">27.4%</div><span className="delta up">+2.1%</span></div>
        <div className="card kpi"><div className="label">{t('ret.avgSecond')}</div><div className="value mono">23</div></div>
        <div className="card kpi"><div className="label">{t('dash.recovered')}</div><div className="value mono">38,600</div><span className="delta up">+31.0%</span></div>
      </div>
      <div className="card card-pad">
        <div className="table-wrap">
          <table className="cohort">
            <thead><tr><th></th><th>M1</th><th>M2</th><th>M3</th><th>M4</th></tr></thead>
            <tbody>
              {RETENTION_COHORTS.map(c => (
                <tr key={c.month}>
                  <td>{c.month} <span className="muted small mono">({c.size})</span></td>
                  {[c.m1, c.m2, c.m3, c.m4].map((v, i) => (
                    <td key={i}><span className="heat" style={{ ...heat(v), padding: '6px 12px', display: 'inline-block', minWidth: 48 }}>{v > 0 ? `${v}%` : '-'}</span></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= DELIVERY ================= */
function DeliveryPage({ t }: { t: (k: string) => string }) {
  return (
    <div>
      <div className="page-head"><h1>{t('del.title')}</h1></div>
      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>{t('orders.detail')}</th><th>{t('orders.customer')}</th><th>{t('del.tracking')}</th><th>{t('orders.status')}</th></tr></thead>
            <tbody>
              {SHIPMENTS.map(s => (
                <tr key={s.id}>
                  <td className="mono">{s.orderId}</td>
                  <td>{s.customer}<div className="muted small">{s.governorate}</div></td>
                  <td className="mono muted">{s.tracking}</td>
                  <td><span className={`chip ${SHIP_STATE_CHIP[s.state]}`}>{t(`del.${s.state}`)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= SETTINGS ================= */
function SettingsPage({ t, lang, showToast }: { t: (k: string) => string; lang: Lang; showToast: (m: string) => void }) {
  const [storeName, setStoreName] = useState('Cairo Streetwear');
  const team = [
    { name: 'Mohammed Ahmed', role: t('set.owner'), av: 'M' },
    { name: 'Mona', role: t('set.agent'), av: 'Mo' },
    { name: 'Kareem', role: t('set.agent'), av: 'K' },
  ];
  return (
    <div>
      <div className="page-head"><h1>{t('set.title')}</h1></div>
      <div className="set-grid">
        <div className="card set-block">
          <p className="card-title">{t('set.store')}</p>
          <div className="field"><label>Store name</label><input value={storeName} onChange={e => setStoreName(e.target.value)} /></div>
          <div className="field"><label>Shopify store</label><input value="cairo-streetwear.myshopify.com" readOnly /></div>
          <div className="set-row"><span className="k">Shopify</span><span className="chip green"><I n="check" size={12} />{t('set.connected')}</span></div>
          <div style={{ marginTop: 16 }}><button className="btn btn-primary" onClick={() => showToast(t('set.saved'))}>{t('set.save')}</button></div>
        </div>
        <div className="card set-block">
          <p className="card-title">{t('set.whatsapp')}</p>
          <div className="set-row"><span>01066184859</span><span className="chip green"><I n="whatsapp" size={12} />{t('set.officialApi')}</span></div>
          <div className="set-row"><span>01001234567</span><span className="chip green"><I n="whatsapp" size={12} />{t('set.officialApi')}</span></div>
        </div>
        <div className="card set-block">
          <p className="card-title">{t('set.team')} <span className="muted small">(3/5 {t('set.seats')})</span></p>
          {team.map((m, i) => (
            <div className="team-row" key={i}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{m.av}</div>
              <span className="nm">{m.name}</span>
              <span className={`chip ${i === 0 ? 'gold' : 'grey'}`}>{m.role}</span>
            </div>
          ))}
        </div>
        <div className="card set-block">
          <p className="card-title">{t('set.billing')}</p>
          <div className="set-row"><span className="k">{t('set.plan')}</span><span style={{ fontWeight: 700 }}>{PLANS[1].name[lang]} · {fmt(PLANS[1].price)} {t('common.egp')}{t('land.perMonth')}</span></div>
          <div className="set-row"><span className="k">{t('set.nextPayment')}</span><span className="mono">2026-12-24</span></div>
          <div className="set-row"><span className="k">{t('set.payMethod')}</span><span>InstaPay · 01066184859</span></div>
        </div>
      </div>
    </div>
  );
}


/* ================= AUTH + CONNECT ================= */
function AuthShell({ lang, setLang, go, children }: { lang: Lang; setLang: (l: Lang) => void; go: (p: string) => void; children: React.ReactNode }) {
  return (
    <div className="auth-page">
      <div className="auth-top">
        <button className="brand" onClick={() => go('landing')}><span className="brand-mark">4P</span><span>4Pixels<small>CRM &amp; E-COMMERCE</small></span></button>
        <button className="lang-btn" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>{lang === 'en' ? 'عربي' : 'EN'}</button>
      </div>
      {children}
    </div>
  );
}

function AuthPage({ lang, setLang, go, onDone }: { mode: string; lang: Lang; setLang: (l: Lang) => void; go: (p: string) => void; onDone: (signup?: boolean) => void }) {
  const ar = lang === 'ar';
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('demo@store.com');
  const [pw, setPw] = useState('demo-password');
  return (
    <AuthShell lang={lang} setLang={setLang} go={go}>
      <div className="auth-card">
        <div className="seg">
          <button className={tab === 'login' ? 'on' : ''} onClick={() => setTab('login')}>{ar ? 'تسجيل دخول' : 'Login'}</button>
          <button className={tab === 'signup' ? 'on' : ''} onClick={() => setTab('signup')}>{ar ? 'إنشاء حساب' : 'Create account'}</button>
        </div>
        <p className="eyebrow">WORKSPACE ACCESS</p>
        <h1>{tab === 'login' ? (ar ? 'أهلاً بيك تاني' : 'Welcome back') : (ar ? 'ابدأ تجربتك المجانية' : 'Start your free trial')}</h1>
        <p className="muted">{tab === 'login' ? (ar ? 'اكتب الإيميل والباسورد وادخل على الـ CRM.' : 'Enter your email and password to go straight into the CRM.') : (ar ? 'حساب جديد في أقل من دقيقة، وبعدها تربط Shopify.' : 'A new account in under a minute, then connect Shopify.')}</p>
        <div className="field"><label>{ar ? 'الإيميل' : 'Email address'}</label><input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@store.com" /></div>
        <div className="field"><label>{ar ? 'الباسورد' : 'Password'}</label><input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter your password" /></div>
        <button className="btn btn-primary btn-block" onClick={() => onDone(tab === 'signup')}>{tab === 'login' ? (ar ? 'دخول' : 'Sign in') : (ar ? 'إنشاء الحساب' : 'Create account')}</button>
        <p className="small muted" style={{ marginTop: 14 }}>{ar ? 'ده ديمو: أي بيانات تدخل بيها شغالة.' : 'This is a demo: any details will work.'}</p>
      </div>
    </AuthShell>
  );
}

function ConnectPage({ lang, setLang, go, onDone }: { lang: Lang; setLang: (l: Lang) => void; go: (p: string) => void; onDone: () => void }) {
  const ar = lang === 'ar';
  const [step, setStep] = useState<'shopify' | 'wa'>('shopify');
  const [domain, setDomain] = useState('cairo-streetwear.myshopify.com');
  const [phase, setPhase] = useState<'idle' | 'auth' | 'sync'>('idle');
  const [pct, setPct] = useState(0);
  const [mode, setMode] = useState<'coex' | 'new'>('coex');
  const [num, setNum] = useState('+20 100 555 0199');
  const [wph, setWph] = useState<'idle' | 'qr' | 'verify' | 'ok'>('idle');
  const start = () => {
    setPhase('auth');
    window.setTimeout(() => {
      setPhase('sync');
      let p = 0;
      const iv = window.setInterval(() => { p += 12; setPct(Math.min(p, 100)); if (p >= 100) { window.clearInterval(iv); window.setTimeout(() => setStep('wa'), 400); } }, 220);
    }, 1100);
  };
  const startWa = () => {
    setWph(mode === 'coex' ? 'qr' : 'verify');
    if (mode === 'new') window.setTimeout(() => setWph('ok'), 1500);
  };
  const scanned = () => { setWph('verify'); window.setTimeout(() => setWph('ok'), 1500); };
  const cur = step === 'shopify' ? 1 : 2;
  const steps = [ar ? 'إنشاء الحساب' : 'Account', 'Shopify', 'WhatsApp', ar ? 'لوحة التحكم' : 'Dashboard'];
  return (
    <AuthShell lang={lang} setLang={setLang} go={go}>
      <div className="auth-card">
        <div className="stepper">{steps.map((s, i) => <div key={s} className={`st${i < cur ? ' done' : ''}${i === cur ? ' cur' : ''}`}><span>{i < cur ? '✓' : i + 1}</span>{s}</div>)}</div>
        {step === 'shopify' ? (<>
          <p className="eyebrow">{ar ? 'الخطوة 2 من 3' : 'STEP 2 OF 3'}</p>
          <h1>{ar ? 'اربط متجر Shopify' : 'Connect your Shopify store'}</h1>
          <p className="muted">{ar ? 'هنسحب الأوردرات والعملاء والمنتجات تلقائياً، وكل أوردر جديد بيظهر لحظياً.' : 'We sync orders, customers and products automatically, and new orders appear in real time.'}</p>
          <div className="field"><label>{ar ? 'دومين المتجر' : 'Store domain'}</label><input value={domain} onChange={e => setDomain(e.target.value)} disabled={phase !== 'idle'} /></div>
          {phase === 'idle' && <button className="btn btn-primary btn-block" onClick={start}><I n="shopify" size={16} />{ar ? 'اربط Shopify' : 'Connect Shopify'}</button>}
          {phase === 'auth' && <div className="sync-box"><div className="spin" />{ar ? 'بنفتح صلاحيات Shopify...' : 'Authorizing with Shopify...'}</div>}
          {phase === 'sync' && <div className="sync-box col"><div>{ar ? 'بنسحب الأوردرات والعملاء...' : 'Syncing orders and customers...'} <b>{Math.round(pct * 3.12)} {ar ? 'أوردر' : 'orders'} · {Math.round(pct * 1.48)} {ar ? 'عميل' : 'customers'}</b></div><div className="bar-track"><div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 100, transition: 'width .2s' }} /></div></div>}
          <p className="trust"><I n="check" size={13} />{ar ? 'قراءة فقط على أوردراتك. مبنبعتش أي رسالة من غير موافقتك.' : 'Read-only access to your orders. We never message customers without your approval.'}</p>
          <button className="link-btn" onClick={() => setStep('wa')}>{ar ? 'تخطي دلوقتي' : 'Skip for now'}</button>
        </>) : (<>
          <p className="eyebrow">{ar ? 'الخطوة 3 من 3' : 'STEP 3 OF 3'}</p>
          <h1>{ar ? 'اربط واتساب بزنس' : 'Connect WhatsApp Business'}</h1>
          <p className="muted">{ar ? 'اختار إزاي عايز تربط الرقم اللي عملاءك بيكلموك عليه.' : 'Choose how to link the number your customers already message.'}</p>
          {wph === 'idle' && (<>
            <div className="opt-list">
              <button className={`opt${mode === 'coex' ? ' on' : ''}`} onClick={() => setMode('coex')}><b>{ar ? 'استخدم رقمك الحالي (Coexistence)' : 'Use your current number (Coexistence)'}<span className="chip green">{ar ? 'مُوصى' : 'Recommended'}</span></b><small>{ar ? 'تكمل على تطبيق واتساب بزنس في موبايلك، والـ CRM يشتغل جنبه على نفس الرقم.' : 'Keep using the WhatsApp Business app on your phone. 4Pixels works alongside it on the same number.'}</small></button>
              <button className={`opt${mode === 'new' ? ' on' : ''}`} onClick={() => setMode('new')}><b>{ar ? 'رقم جديد (Cloud API)' : 'A new number (Cloud API)'}</b><small>{ar ? 'رقم مخصص للـ CRM فقط، مش بيشتغل على التطبيق.' : 'A number used only by the CRM. It will not work in the phone app.'}</small></button>
            </div>
            <div className="field"><label>{ar ? 'رقم الواتساب' : 'WhatsApp number'}</label><input value={num} onChange={e => setNum(e.target.value)} /></div>
            <button className="btn btn-primary btn-block" onClick={startWa}>{ar ? 'ابدأ الربط' : 'Continue'}</button>
          </>)}
          {wph === 'qr' && (<div className="sync-box col" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div className="qr" aria-hidden>{Array.from({ length: 225 }).map((_, i) => { const r = Math.floor(i / 15), c = i % 15; const f = (r < 5 && c < 5) || (r < 5 && c > 9) || (r > 9 && c < 5); const ring = (x: number, y: number) => x === 0 || y === 0 || x === 4 || y === 4 || (x === 2 && y === 2); const fx = c > 9 ? c - 10 : c, fy = r > 9 ? r - 10 : r; const on = f ? ring(fx, fy) : ((((r + 3) * 2654435761) ^ ((c + 5) * 40503) ^ (r * c * 97)) >>> 3) % 2 === 0; return <i key={i} className={on ? 'k' : ''} />; })}</div>
            <div>{ar ? 'افتح واتساب بزنس على موبايلك ← الإعدادات ← الأجهزة المرتبطة ← امسح الكود.' : 'On your phone open WhatsApp Business, then Settings, Linked devices, and scan this code.'}</div>
            <button className="btn btn-primary" onClick={scanned}>{ar ? 'مسحت الكود' : 'I scanned it'}</button>
          </div>)}
          {wph === 'verify' && <div className="sync-box"><div className="spin" />{ar ? 'بنتأكد من الربط ومزامنة المحادثات...' : 'Verifying and syncing your chats...'}</div>}
          {wph === 'ok' && (<>
            <div className="sync-box" style={{ color: '#047857' }}><I n="check" size={16} />{ar ? 'الرقم' : 'Number'} {num} {ar ? 'اتربط بنجاح' : 'is connected'}</div>
            <button className="btn btn-primary btn-block" onClick={onDone}>{ar ? 'افتح لوحة التحكم' : 'Go to dashboard'}</button>
          </>)}
          <p className="trust"><I n="check" size={13} />{ar ? 'رسايلك بتفضل على رقمك، ومحادثاتك الحالية مش بتتمسح.' : 'Your chats stay on your number. Nothing is deleted or sent without your approval.'}</p>
          {wph !== 'ok' && <button className="link-btn" onClick={onDone}>{ar ? 'تخطي دلوقتي' : 'Skip for now'}</button>}
        </>)}
      </div>
    </AuthShell>
  );
}

/* ================= EXTRA PAGES ================= */
const CUSTOMERS_DEMO = [
  { n: 'Mariam Adel', p: '+20 100 555 0141', o: 6, v: 3840 },
  { n: 'Ahmed Samy', p: '+20 111 555 0172', o: 4, v: 2610 },
  { n: 'Salma Nabil', p: '+20 122 555 0188', o: 3, v: 1950 },
  { n: 'Karim Fouad', p: '+20 101 555 0123', o: 2, v: 1290 },
  { n: 'Nour Hassan', p: '+20 109 555 0165', o: 1, v: 640 },
];
function PageHead({ title, sub }: { title: string; sub?: string }) {
  return <div className="page-head"><h1>{title}</h1>{sub && <p className="muted small" style={{ margin: '4px 0 0' }}>{sub}</p>}</div>;
}
function SalesPage({ lang }: { lang: Lang }) {
  const ar = lang === 'ar';
  const kpis = [[ar ? 'إجمالي المبيعات' : 'Total sales', '184,250 EGP'], [ar ? 'الأوردرات' : 'Orders', '612'], [ar ? 'متوسط الأوردر' : 'Avg. order', '301 EGP'], [ar ? 'مبيعات اليوم' : 'Today', '6,420 EGP']];
  return (
    <div>
      <PageHead title={ar ? 'مبيعات Shopify' : 'Shopify Sales'} sub={ar ? 'أرقام مطابقة تماماً لـ Shopify' : 'Figures matched exactly to Shopify'} />
      <div className="kpi-grid">{kpis.map(([k, v]) => <div className="card kpi" key={k}><div className="muted small">{k}</div><div className="kpi-v">{v}</div></div>)}</div>
    </div>
  );
}
function CustomersPage({ lang }: { lang: Lang }) {
  const ar = lang === 'ar';
  return (
    <div>
      <PageHead title={ar ? 'العملاء' : 'Customers'} sub={ar ? 'بيانات العميل وقيمة أوردراته' : 'Customer details and order value'} />
      <div className="card"><table className="data"><thead><tr><th>{ar ? 'الاسم' : 'Name'}</th><th>{ar ? 'الموبايل' : 'Phone'}</th><th>{ar ? 'الأوردرات' : 'Orders'}</th><th>{ar ? 'القيمة' : 'Value'}</th></tr></thead>
        <tbody>{CUSTOMERS_DEMO.map(c => <tr key={c.n}><td>{c.n}</td><td className="mono">{c.p}</td><td>{c.o}</td><td>{c.v.toLocaleString()} EGP</td></tr>)}</tbody></table></div>
    </div>
  );
}
function CartsPage({ lang, showToast }: { lang: Lang; showToast: (m: string) => void }) {
  const ar = lang === 'ar';
  const rows = [['Mariam Adel', 'Oversized hoodie', 890, 'sent'], ['Karim Fouad', 'White sneakers', 1250, 'pending'], ['Salma Nabil', 'Denim jacket', 1490, 'recovered']];
  return (
    <div>
      <PageHead title={ar ? 'السلات المتروكة' : 'Abandoned Carts'} sub={ar ? 'تذكير واتساب أوتوماتيك يرجّع العميل' : 'Automatic WhatsApp reminders bring customers back'} />
      <div className="card"><table className="data"><thead><tr><th>{ar ? 'العميل' : 'Customer'}</th><th>{ar ? 'المنتج' : 'Item'}</th><th>{ar ? 'القيمة' : 'Value'}</th><th>{ar ? 'الحالة' : 'Status'}</th><th /></tr></thead>
        <tbody>{rows.map(r => <tr key={String(r[0])}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]} EGP</td><td><span className={`chip ${r[3] === 'recovered' ? 'green' : r[3] === 'sent' ? 'blue' : 'grey'}`}>{r[3]}</span></td><td><button className="btn btn-ghost btn-sm" onClick={() => showToast(ar ? 'اتبعت تذكير واتساب' : 'WhatsApp reminder sent')}>{ar ? 'ابعت تذكير' : 'Send reminder'}</button></td></tr>)}</tbody></table></div>
    </div>
  );
}
function BillingPage({ lang }: { lang: Lang }) {
  const ar = lang === 'ar';
  return (
    <div>
      <PageHead title={ar ? 'الباقة والفواتير' : 'Plan & Billing'} />
      <div className="price-grid">{PLANS.map(p => (
        <div key={p.name.en} className={`price-card${p.popular ? ' popular' : ''}`}>
          <h3>{p.name[lang]}</h3><div className="price">{p.price} <span className="muted small">EGP{ar ? ' / شهر' : ' / mo'}</span></div>
          <ul>{p.features[lang].map((f: string) => <li key={f}>{f}</li>)}</ul>
        </div>))}</div>
    </div>
  );
}
