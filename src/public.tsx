import React, { useState } from 'react';
import { I } from './App';
import type { Lang } from './i18n';
import { PLANS } from './data';

const tr = (lang: Lang, en: string, ar?: string) => (lang === 'ar' && ar ? ar : en);
type Props = { lang: Lang; setLang: (l: Lang) => void; go: (p: string) => void; page: string };

const NAV: [string, string, string][] = [['home', 'Home', 'الرئيسية'], ['about', 'About us', 'من نحن'], ['features', 'Features', 'المميزات'], ['pricing', 'Pricing', 'الأسعار'], ['projects', 'Projects', 'المشاريع'], ['contact', 'Contact', 'تواصل معنا']];

export function PublicSite({ lang, setLang, go, page }: Props) {
  const [menu, setMenu] = useState(false);
  const nav = (p: string) => { go(p); setMenu(false); };
  return (
    <div className="pub">
      <header className="pub-head">
        <button className="brand" onClick={() => nav('home')}><span className="brand-mark">4P</span><span>4Pixels<small>CRM &amp; E-COMMERCE</small></span></button>
        <nav className={`pub-nav${menu ? ' open' : ''}`}>
          {NAV.map(([k, en, ar]) => <button key={k} className={page === k ? 'on' : ''} onClick={() => nav(k)}>{tr(lang, en, ar)}</button>)}
          <div className="pub-auth-m"><button className="btn btn-ghost btn-sm" onClick={() => nav('login')}>{tr(lang, 'Login', 'دخول')}</button><button className="btn btn-primary btn-sm" onClick={() => nav('login')}>{tr(lang, 'Create account', 'إنشاء حساب')}</button></div>
        </nav>
        <div className="pub-actions">
          <button className="lang-btn" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>{lang === 'en' ? 'عربي' : 'EN'}</button>
          <button className="btn btn-ghost btn-sm hide-m" onClick={() => nav('login')}>{tr(lang, 'Login', 'دخول')}</button>
          <button className="btn btn-primary btn-sm hide-m" onClick={() => nav('login')}>{tr(lang, 'Create account', 'إنشاء حساب')}</button>
          <button className="icon-btn pub-burger" onClick={() => setMenu(!menu)} aria-label="menu"><I n="menu" /></button>
        </div>
      </header>
      <main>
        {page === 'home' && <Home lang={lang} go={nav} />}
        {page === 'about' && <About lang={lang} go={nav} />}
        {page === 'features' && <Features lang={lang} go={nav} />}
        {page === 'pricing' && <Pricing lang={lang} go={nav} />}
        {page === 'projects' && <Projects lang={lang} />}
        {page === 'contact' && <Contact lang={lang} />}
      </main>
      <footer className="pub-foot">
        <div className="foot-grid">
          <div className="foot-brand"><span className="brand-row"><span className="brand-mark">4P</span><b>4Pixels CRM</b></span><p>{tr(lang, 'WhatsApp CRM for Shopify and e-commerce teams. One inbox, every order, clear next steps.', 'CRM على واتساب لفرق Shopify والتجارة الإلكترونية. إنبوكس واحد، كل الأوردرات، وخطوات واضحة.')}</p></div>
          <div><h5>{tr(lang, 'Product', 'المنتج')}</h5>{[['features', 'Features', 'المميزات'], ['pricing', 'Pricing', 'الأسعار'], ['login', 'Login', 'دخول'], ['login', 'Create account', 'إنشاء حساب']].map(([k, en, ar]) => <button key={en} onClick={() => nav(k)}>{tr(lang, en, ar)}</button>)}</div>
          <div><h5>{tr(lang, 'Company', 'الشركة')}</h5>{[['home', 'Home', 'الرئيسية'], ['about', 'About us', 'من نحن'], ['projects', 'Projects', 'المشاريع'], ['contact', 'Contact', 'تواصل معنا']].map(([k, en, ar]) => <button key={en} onClick={() => nav(k)}>{tr(lang, en, ar)}</button>)}</div>
          <div><h5>{tr(lang, 'Contact', 'تواصل')}</h5><span>{tr(lang, 'WhatsApp', 'واتساب')}: 01066184859</span><span>{tr(lang, 'Replies in about 2 minutes', 'بنرد في حوالي دقيقتين')}</span><span>{tr(lang, 'Cairo, Egypt', 'القاهرة، مصر')}</span></div>
        </div>
        <div className="foot-bottom"><span>© 2026 4Pixels. {tr(lang, 'All rights reserved.', 'جميع الحقوق محفوظة.')}</span><span><button onClick={() => nav('contact')}>{tr(lang, 'Privacy', 'الخصوصية')}</button><button onClick={() => nav('contact')}>{tr(lang, 'Terms', 'الشروط')}</button></span></div>
      </footer>
    </div>
  );
}

function Hero({ lang, go }: { lang: Lang; go: (p: string) => void }) {
  return (
    <section className="pub-hero">
      <div>
        <span className="pill-badge">{tr(lang, 'Official Meta WhatsApp API', 'واتساب API الرسمي من Meta')}</span>
        <h1>{tr(lang, 'Every customer channel in one clear workspace.', 'كل قنوات عملائك في مساحة عمل واحدة واضحة.')}</h1>
        <p className="muted lead">{tr(lang, 'Connect Shopify, Easy Order, Marketing, SMS, customer conversations, and order operations without adding more operational noise.', 'اربط Shopify والأوردرات والتسويق والـ SMS ومحادثات العملاء من غير ضوضاء تشغيلية.')}</p>
        <div className="btn-row"><button className="btn btn-primary" onClick={() => go('login')}>{tr(lang, 'Start free trial', 'ابدأ التجربة المجانية')}</button><button className="btn btn-ghost" onClick={() => go('login')}>{tr(lang, 'See the live demo', 'شوف الديمو المباشر')}</button></div>
        <div className="trust-row"><span>5-day full-access trial</span><span>Shopify + WhatsApp</span><span>Arabic-first</span></div>
      </div>
      <div className="hero-visual">
        <span className="hv-badge hv-a"><I n="orders" size={20} /></span><span className="hv-badge hv-b"><I n="whatsapp" size={20} /></span>
        <div className="phone-mock hv-phone">
          <div className="pm-head"><span className="brand-mark sm">4P</span><div><b>4Pixels CRM</b><small>{tr(lang, 'Operations dashboard', 'لوحة التشغيل')}</small></div></div>
          <div className="hv-kpis">{[[tr(lang, 'Orders today', 'أوردرات النهارده'), '34'], [tr(lang, 'Delivered', 'تم التسليم'), '89'], [tr(lang, 'Open chats', 'محادثات مفتوحة'), '12']].map(([k, v]) => <div key={k}><b>{v}</b><small>{k}</small></div>)}</div>
          <div className="hv-list"><p>{tr(lang, 'Recent activity', 'آخر النشاط')}</p>{[[tr(lang, 'Order confirmed', 'تم تأكيد الأوردر'), tr(lang, '2 min ago', 'من دقيقتين')], [tr(lang, 'Shipment out for delivery', 'الشحنة خرجت للتوصيل'), tr(lang, '5 min ago', 'من 5 دقايق')], [tr(lang, 'Cart recovered', 'سلة اتسترجعت'), tr(lang, '8 min ago', 'من 8 دقايق')]].map(([t, m]) => <div className="hv-row" key={t}><span className="tick"><I n="check" size={12} /></span><span className="hv-t">{t}</span><small>{m}</small></div>)}</div>
        </div>
        <div className="hv-review"><div className="hv-stars">★★★★★</div><p>{tr(lang, '“Orders and chats finally live in one place. We reply faster and nothing gets lost.”', '“الأوردرات والمحادثات أخيراً في مكان واحد. بنرد أسرع ومفيش حاجة بتضيع.”')}</p><div className="hv-by"><span className="av">S</span><div><b>{tr(lang, 'Sara M.', 'سارة م.')}</b><small>{tr(lang, 'Operations lead, demo store', 'مسؤولة العمليات، متجر تجريبي')}</small></div></div></div>
      </div>
    </section>
  );
}
const FEATURES: [string, string, string, string][] = [
  ['One customer view', 'Conversation history, orders, tags, notes, and customer value in one place.', 'inbox', 'عرض موحد للعميل'],
  ['Order operations', 'Confirm, edit, track, return, and follow up on orders without scattered tools.', 'orders', 'تشغيل الأوردرات'],
  ['Abandoned cart recovery', 'Bring incomplete checkouts back with timed messages and direct checkout links.', 'cart', 'استرجاع السلات المتروكة'],
  ['Returns control', 'Record reasons, notes, status changes, and patterns that need action.', 'back', 'التحكم في المرتجعات'],
  ['Automation', 'Trigger confirmations, reminders, review requests, and post-purchase follow-up.', 'auto', 'الأتمتة'],
  ['Clear analytics', 'See sales, confirmation, delivery, returns, campaigns, and team activity.', 'profit', 'تحليلات واضحة'],
];
const REVIEWS = [['Sara Mahmoud', 'Instead of orders getting lost between WhatsApp and Shopify, everything is clear and we can see exactly who needs a reply.'], ['Ahmed Samy', 'Having the chat and the order in one place is the biggest relief. The team replies faster.'], ['Menna Khaled', 'We used to review every order manually. Now the system shows the status and what follow-up is needed.'], ['Youssef Adel', 'Abandoned carts finally make sense. We know who came back and who needs a message.']];
function Home({ lang, go }: { lang: Lang; go: (p: string) => void }) {
  return (
    <>
      <Hero lang={lang} go={go} />
      <section className="pub-sec"><h2>{tr(lang, 'The tools stay separate. The customer context stays together.', 'الأدوات منفصلة، وسياق العميل واحد.')}</h2><p className="muted">{tr(lang, 'Every channel has a clear job, while 4Pixels keeps the order, customer, and next action visible to the team.', '')}</p>
        <div className="ch-grid">{[['Shopify', 'Orders, customers, products, and storefront activity stay connected.'], ['Easy Order', 'Create and manage orders directly from the customer conversation.'], ['Marketing', 'Run focused campaigns, offers, and lifecycle follow-up.'], ['SMS', 'Send clear order updates and controlled marketing campaigns.']].map(([t, d]) => <div className="card card-pad" key={t}><h3 className="h3">{t}</h3><p className="muted small">{d}</p></div>)}</div></section>
      <section className="pub-sec alt"><h2>{tr(lang, 'Practical features for the work your team already does.', 'مميزات عملية للشغل اللي فريقك بيعمله فعلاً.')}</h2>
        <div className="feat-grid3">{FEATURES.map(([t, d, ic, ar]) => <div className="card card-pad" key={t}><span className="tile-ic"><I n={ic} size={18} /></span><h3 className="h3">{tr(lang, t, ar)}</h3><p className="muted small">{d}</p></div>)}</div></section>
      <section className="pub-sec"><h2>{tr(lang, 'Clear from the first message to the final result.', 'واضح من أول رسالة لحد النتيجة.')}</h2>
        <div className="steps4">{['A customer places an order or starts a conversation.', '4Pixels gathers the customer, order, and channel context.', 'The right automation or team action starts immediately.', 'The result is tracked in one clear operating view.'].map((s, i) => <div className="card card-pad" key={s}><span className="num-b">{i + 1}</span><p>{s}</p></div>)}</div></section>
      <section className="pub-sec alt"><h2>{tr(lang, 'Real feedback, presented without noise.', 'آراء حقيقية من غير ضوضاء.')}</h2><div className="rev-grid">{REVIEWS.map(([n, t]) => <div className="card card-pad" key={n}><p>“{t}”</p><b>{n}</b></div>)}</div></section>
      <CTA lang={lang} go={go} />
    </>
  );
}
function CTA({ lang, go }: { lang: Lang; go: (p: string) => void }) { return <section className="pub-cta-wrap"><div className="pub-cta"><h2>{tr(lang, 'Ready to see your store in one workspace?', 'جاهز تشوف متجرك في مساحة عمل واحدة؟')}</h2><p>{tr(lang, 'Connect Shopify and WhatsApp in about 5 minutes. No card needed.', 'اربط Shopify وواتساب في حوالي 5 دقايق. من غير كارت.')}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => go('login')}>{tr(lang, 'Start free trial', 'ابدأ التجربة المجانية')}</button><button className="btn cta-ghost" onClick={() => go('contact')}>{tr(lang, 'Talk to us', 'كلمنا')}</button></div></div></section>; }
function About({ lang, go }: { lang: Lang; go: (p: string) => void }) {
  const areas: [string, string, string[]][] = [['Turn customer messages into controlled sales work.', 'The team sees the customer, the order, the owner, and the next action from one clear inbox.', ['Team WhatsApp inbox', 'Order confirmation', 'Abandoned cart recovery']], ['Run orders without chasing.', 'Every order carries its status, shipping and return details.', ['Order tracking', 'Returns control', 'Bosta delivery checks']], ['Grow repeat purchases.', 'Offers and retention flows run with clear tracking.', ['Smart Offers', 'Customer retention', 'SMS campaigns']], ['See the whole picture.', 'Sales, profit and team activity in one operating view.', ['Dashboard', 'Net profit', 'Exact Shopify sales']]];
  return (<>
    <section className="pub-hero single"><div><h1>{tr(lang, 'From the first message to the next purchase in one system.', 'من أول رسالة لحد الشراء الجاي في سيستم واحد.')}</h1><p className="muted lead">4Pixels brings conversations, orders, customers, marketing, loyalty, and analytics into one clear operating workspace.</p></div></section>
    <section className="pub-sec"><h2>A simple idea: keep the whole operation visible.</h2><div className="ch-grid">{['One workspace instead of disconnected tools.', 'Automation with clear human control.', 'Customer context connected to every action.', 'Built for Arabic commerce operations.'].map(t => <div className="card card-pad" key={t}><p>{t}</p></div>)}</div></section>
    <section className="pub-sec alt"><h2>Four clear areas running the store.</h2>{areas.map(([t, d, l], i) => <div className="area card card-pad" key={t}><span className="num-b">0{i + 1}</span><div><h3 className="h3">{t}</h3><p className="muted">{d}</p><div className="chip-row">{l.map(x => <span className="chip blue" key={x}>{x}</span>)}</div></div></div>)}</section>
    <CTA lang={lang} go={go} /></>);
}
function Features({ lang, go }: { lang: Lang; go: (p: string) => void }) { return (<><section className="pub-hero single"><div><h1>{tr(lang, 'Everything your store operation needs.', 'كل اللي عمليات متجرك محتاجاها.')}</h1></div></section><section className="pub-sec"><div className="feat-grid3">{FEATURES.map(([t, d, ic, ar]) => <div className="card card-pad" key={t}><span className="tile-ic"><I n={ic} size={18} /></span><h3 className="h3">{tr(lang, t, ar)}</h3><p className="muted small">{d}</p></div>)}</div></section><CTA lang={lang} go={go} /></>); }
function Pricing({ lang, go }: { lang: Lang; go: (p: string) => void }) {
  const [per, setPer] = useState('Monthly');
  const p = [['Basic', 20, '1,200 orders'], ['Pro', 26, '2,200 orders'], ['Premium', 36, 'Unlimited orders']] as const;
  return (<><section className="pub-hero single"><div><h1>{tr(lang, 'Simple plans, billed securely by Shopify.', 'خطط بسيطة والدفع من خلال Shopify.')}</h1><p className="muted lead">Shopify App Store merchants choose and approve their plan directly in Shopify. No transfers or payment proof.</p><div className="trust-row"><span>5-day full-access trial</span><span>All app charges processed by Shopify</span><span>Plan support from the team</span></div></div></section>
    <section className="pub-sec"><div className="seg center">{['Monthly', 'Yearly'].map(x => <button key={x} className={per === x ? 'on' : ''} onClick={() => setPer(x)}>{x}</button>)}</div>
      <div className="plan-grid">{p.map(([n, usd, o]) => <div className={`card plan${n === 'Pro' ? ' cur' : ''}`} key={n}><h3 className="h3">{n}</h3><div className="big">${per === 'Monthly' ? usd : Math.round(usd * 12 * 0.8)} <small>{per === 'Monthly' ? 'USD / month' : 'USD / year'}</small></div><p className="muted small">{per === 'Monthly' ? 'Billed by Shopify each month' : 'Billed by Shopify yearly'}</p><ul><li>{o}</li><li>Unlimited customers</li><li>Unlimited messages</li><li>5 team members</li><li>Every CRM feature is included</li></ul><button className="btn btn-primary btn-block" onClick={() => go('login')}>Start free trial</button></div>)}</div></section></>);
}
const PROJECTS: [string, string, string][] = [['Tetiano Site', 'A premium Shopify website with a clean, responsive design, smooth shopping experience, product collections, and CRM/ERP-ready structure.', '#0ea5e9'], ['Moon Site', 'A premium Shopify website with product collections and a smooth, responsive shopping experience.', '#6366f1'], ['Erwana Site', 'A premium Shopify website built for daily e-commerce operations and brand growth.', '#14b8a6'], ['N.S Home Organization', 'An Arabic-first store for smart home-organization products with clear category navigation.', '#f59e0b'], ['Tharaa Gaming Store', 'A high-converting gaming store for consoles, games, controllers, and accessories.', '#8b5cf6'], ['Lamsa Home & Textiles', 'An elegant home décor storefront for rugs, mats, curtains, and home-textile collections.', '#ec4899']];
function Projects({ lang }: { lang: Lang }) { return (<><section className="pub-hero single"><div><h1>{tr(lang, 'Selected websites, systems, and commerce builds.', 'مواقع وأنظمة ومتاجر اتنفذت.')}</h1><p className="muted lead">A clear view of the work, the product type, and the final live result.</p></div></section><section className="pub-sec"><div className="proj-grid">{PROJECTS.map(([t, d, c]) => <div className="card proj" key={t}><div className="proj-img" style={{ background: `linear-gradient(135deg, ${c}, #0f172a)` }}><span>{t}</span></div><div className="card-pad"><h3 className="h3">{t}</h3><p className="muted small">{d}</p></div></div>)}</div></section></>); }
function Contact({ lang }: { lang: Lang }) {
  const [sent, setSent] = useState(false);
  return (<><section className="pub-hero single"><div><h1>{tr(lang, 'Tell us what needs to improve.', 'قولنا إيه اللي محتاج يتحسن.')}</h1><p className="muted lead">{tr(lang, 'Send a short brief and we will continue the conversation on WhatsApp with the right context already prepared.', 'ابعت وصف مختصر وهنكمل معاك على واتساب وإحنا فاهمين المطلوب.')}</p></div></section>
    <section className="pub-sec"><div className="two-col-flex"><div className="card card-pad grow"><h3 className="h3">{sent ? tr(lang, 'Thanks, we got your brief.', 'شكراً، وصلنا طلبك.') : tr(lang, 'Project brief', 'تفاصيل طلبك')}</h3>{!sent && <><div className="field"><label>{tr(lang, 'Name', 'الاسم')}</label><input /></div><div className="field"><label>{tr(lang, 'WhatsApp number', 'رقم واتساب')}</label><input /></div><div className="field"><label>{tr(lang, 'What do you need?', 'محتاج إيه؟')}</label><textarea rows={4} className="inp" /></div><button className="btn btn-primary" onClick={() => setSent(true)}>{tr(lang, 'Send brief', 'إرسال')}</button></>}</div>
      <div className="card card-pad grow"><h3 className="h3">{tr(lang, 'WhatsApp', 'واتساب')}</h3><p>01066184859</p><h3 className="h3">{tr(lang, 'Response time', 'وقت الرد')}</h3><p className="muted">{tr(lang, 'About 2 minutes on WhatsApp', 'حوالي دقيقتين على واتساب')}</p></div></div></section></>);
}
