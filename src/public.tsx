import React, { useState } from 'react';
import { I } from './App';
import type { Lang } from './i18n';

const tr = (lang: Lang, en: string, ar?: string) => (lang === 'ar' && ar ? ar : en);
type Props = { lang: Lang; setLang: (l: Lang) => void; go: (p: string) => void; page: string };

const NAV: [string, string, string][] = [['home', 'Home', 'الرئيسية'], ['about', 'About us', 'من نحن'], ['features', 'Features', 'المميزات'], ['pricing', 'Pricing', 'الأسعار'], ['projects', 'Projects', 'المشاريع'], ['contact', 'Contact', 'تواصل معنا']];

export function PublicSite({ lang, setLang, go, page }: Props) {
  const [menu, setMenu] = useState(false);
  const nav = (p: string) => { go(p); setMenu(false); };
  return (
    <div className="pub">
      <header className="pub-head">
        <div className="ph-in">
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
          <div><h5>{tr(lang, 'Contact', 'تواصل')}</h5><span>{tr(lang, 'WhatsApp', 'واتساب')}: 01066184859</span><span>{tr(lang, 'Reach us on WhatsApp', 'كلمنا على واتساب')}</span><span>{tr(lang, 'Cairo, Egypt', 'القاهرة، مصر')}</span></div>
        </div>
        <div className="foot-bottom"><span>© 2026 4Pixels. {tr(lang, 'All rights reserved.', 'جميع الحقوق محفوظة.')}</span><span><button onClick={() => nav('contact')}>{tr(lang, 'Privacy', 'الخصوصية')}</button><button onClick={() => nav('contact')}>{tr(lang, 'Terms', 'الشروط')}</button></span></div>
      </footer>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) { return <span className="pw-eye">{children}</span>; }

function AppMock({ lang }: { lang: Lang }) {
  const bars = [38, 55, 44, 70, 58, 82, 64, 92, 76, 100, 84, 96];
  return (
    <div className="aw">
      <div className="aw-chrome"><i /><i /><i /><span className="aw-url">app.4pixels</span></div>
      <div className="aw-body">
        <div className="aw-side"><span className="aw-logo">4P</span>{['overview', 'chats', 'orders', 'cart', 'templates', 'profit'].map((n, i) => <span key={n} className={`aw-ic${i === 0 ? ' on' : ''}`}><I n={n} size={15} /></span>)}</div>
        <div className="aw-main">
          <div className="aw-title"><b>{tr(lang, 'Dashboard', 'لوحة التحكم')}</b><span className="aw-pill">{tr(lang, 'Today', 'اليوم')}</span></div>
          <div className="aw-kpis">{[[tr(lang, 'Orders', 'الأوردرات'), '34'], [tr(lang, 'Delivered', 'تم التسليم'), '89'], [tr(lang, 'Open chats', 'محادثات'), '12']].map(([k, v]) => <div key={k}><b>{v}</b><small>{k}</small></div>)}</div>
          <div className="aw-chart"><p>{tr(lang, 'Sales this week', 'مبيعات الأسبوع')}</p><div className="aw-bars">{bars.map((h, i) => <span key={i} style={{ height: h + '%' }} />)}</div></div>
          <div className="aw-list">{[[tr(lang, 'Order confirmed', 'تم تأكيد الأوردر'), '2m'], [tr(lang, 'Out for delivery', 'خرج للتوصيل'), '5m'], [tr(lang, 'Cart recovered', 'سلة اتسترجعت'), '8m']].map(([t, m]) => <div className="aw-row" key={t}><span className="tick"><I n="check" size={11} /></span><span>{t}</span><small>{m}</small></div>)}</div>
        </div>
      </div>
    </div>
  );
}

const FEATURES: [string, string, string, string, string][] = [
  ['One customer view', 'Conversation history, orders, tags, notes, and customer value in one place.', 'inbox', 'عرض موحد للعميل', 'سجل المحادثات والأوردرات والتاجات والملاحظات وقيمة العميل في مكان واحد.'],
  ['Order operations', 'Confirm, edit, track, return, and follow up on orders without scattered tools.', 'orders', 'تشغيل الأوردرات', 'تأكيد وتعديل وتتبع ومرتجعات ومتابعة من غير أدوات متفرقة.'],
  ['Abandoned cart recovery', 'Bring incomplete checkouts back with timed messages and direct checkout links.', 'cart', 'استرجاع السلات المتروكة', 'رجّع السلات اللي مكملتش برسائل مجدولة ولينكات تشيك أوت مباشرة.'],
  ['Returns control', 'Record reasons, notes, status changes, and patterns that need action.', 'back', 'التحكم في المرتجعات', 'سجّل الأسباب والملاحظات والحالات والأنماط اللي محتاجة تدخل.'],
  ['Automation', 'Trigger confirmations, reminders, review requests, and post-purchase follow-up.', 'auto', 'الأتمتة', 'شغّل تأكيدات وتذكيرات وطلبات تقييم ومتابعة بعد الشراء.'],
  ['Clear analytics', 'See sales, confirmation, delivery, returns, campaigns, and team activity.', 'profit', 'تحليلات واضحة', 'شوف المبيعات والتأكيد والتسليم والمرتجعات والحملات ونشاط الفريق.'],
];
const MORE: [string, string][] = [['Team inbox & notes', 'إنبوكس فريق وملاحظات'], ['Template status', 'حالة التمبليتات'], ['Opt-in & quiet hours', 'موافقات وساعات هدوء'], ['Activity log', 'سجل النشاط'], ['Export anywhere', 'تصدير في كل مكان'], ['Date presets & ranges', 'تواريخ جاهزة ومدى مخصص'], ['Quick search (Ctrl+K)', 'بحث سريع (Ctrl+K)'], ['Delivery tracking', 'تتبع الشحنات']];
const REVIEWS: [string, string, string, string][] = [
  ['Sara Mahmoud', 'Instead of orders getting lost between WhatsApp and Shopify, everything is clear and we can see exactly who needs a reply.', 'سارة محمود', 'بدل ما الأوردرات تضيع بين واتساب وShopify، كل حاجة واضحة وعارفين مين محتاج رد.'],
  ['Ahmed Samy', 'Having the chat and the order in one place is the biggest relief. Everything is easier to follow.', 'أحمد سامي', 'وجود المحادثة والأوردر في مكان واحد أكبر راحة. كل حاجة أسهل في المتابعة.'],
  ['Menna Khaled', 'We used to review every order manually. Now the system shows the status and what follow-up is needed.', 'منة خالد', 'كنا بنراجع كل أوردر يدوي. دلوقتي السيستم بيوضح الحالة والمتابعة المطلوبة.'],
  ['Youssef Adel', 'Abandoned carts finally make sense. We know who came back and who needs a message.', 'يوسف عادل', 'السلات المتروكة بقت مفهومة أخيراً. عارفين مين رجع ومين محتاج رسالة.'],
];

function Home({ lang, go }: { lang: Lang; go: (p: string) => void }) {
  return (
    <>
      <section className="pw-hero">
        <div className="pw-hero-in">
          <div className="pw-hero-txt">
            <Eyebrow>{tr(lang, 'Official WhatsApp Business API', 'واتساب للأعمال API الرسمي')}</Eyebrow>
            <h1>{tr(lang, 'Every customer, order and chat in one calm workspace.', 'كل عميل وأوردر ومحادثة في مساحة عمل واحدة مريحة.')}</h1>
            <p className="pw-lead">{tr(lang, '4Pixels connects your Shopify store to WhatsApp, so your team confirms orders, answers customers and recovers carts from one place.', '4Pixels بيربط متجر Shopify بتاعك بواتساب، عشان فريقك يأكد الأوردرات ويرد على العملاء ويسترجع السلات من مكان واحد.')}</p>
            <div className="btn-row"><button className="btn btn-primary btn-lg" onClick={() => go('login')}>{tr(lang, 'Start free trial', 'ابدأ التجربة المجانية')}</button><button className="btn btn-ghost btn-lg" onClick={() => go('login')}>{tr(lang, 'See the live demo', 'شوف الديمو المباشر')}</button></div>
            <div className="pw-trust"><span>{tr(lang, 'Free trial', 'تجربة مجانية')}</span><span>Shopify + WhatsApp</span><span>{tr(lang, 'Arabic & English', 'عربي وإنجليزي')}</span></div>
          </div>
          <div className="pw-mockwrap"><AppMock lang={lang} /><div className="pw-float f1"><span className="pw-fdot" /><div><b>{tr(lang, 'New order #1042', 'أوردر جديد #1042')}</b><small>{tr(lang, 'Confirmed on WhatsApp', 'اتأكد على واتساب')}</small></div></div><div className="pw-float f2"><span className="pw-fdot b" /><div><b>{tr(lang, 'Cart recovered', 'سلة اتسترجعت')}</b><small>{tr(lang, 'Sample data', 'بيانات تجريبية')}</small></div></div></div>
        </div>
      </section>
      <section className="pw-logos"><p>{tr(lang, 'Stores & websites built by the 4Pixels team', 'متاجر ومواقع من تنفيذ فريق 4Pixels')}</p><div>{['TETIANO', 'MOON', 'ERWANA', 'N.S HOME', 'THARAA', 'LAMSA'].map(n => <span key={n}>{n}</span>)}</div></section>
      <section className="pw-sec">
        <div className="pw-sec-head"><Eyebrow>{tr(lang, 'Connections', 'الربط')}</Eyebrow><h2>{tr(lang, 'Your tools stay connected. Your customer context stays together.', 'أدواتك متصلة، وسياق عميلك في مكان واحد.')}</h2><p>{tr(lang, 'Every channel has a clear job, while 4Pixels keeps the order, the customer and the next action visible to the whole team.', 'كل قناة ليها دور واضح، و4Pixels بيخلي الأوردر والعميل والخطوة الجاية ظاهرين للفريق كله.')}</p></div>
        <div className="pw-grid4">{[['shopify', 'Shopify', 'Orders, customers and products stay in sync.', 'الأوردرات والعملاء والمنتجات متزامنة دايماً.'], ['orders', 'Easy Order', 'Create orders from inside the conversation.', 'اعمل أوردر من جوه المحادثة نفسها.'], ['templates', 'Marketing', 'Campaigns, offers and lifecycle follow-up.', 'حملات وعروض ومتابعة دورة حياة العميل.'], ['sms', 'SMS', 'Order updates and controlled SMS campaigns.', 'تحديثات الأوردرات وحملات SMS منظمة.']].map(([ic, t, d, ard]) => <div className="pw-card" key={t}><span className="pw-ic"><I n={ic} size={20} /></span><h3>{t}</h3><p>{tr(lang, d, ard)}</p></div>)}</div>
      </section>
      <section className="pw-sec pw-alt">
        <div className="pw-sec-head"><Eyebrow>{tr(lang, 'Features', 'المميزات')}</Eyebrow><h2>{tr(lang, 'Practical tools for the work your team already does.', 'أدوات عملية للشغل اللي فريقك بيعمله فعلاً.')}</h2></div>
        <div className="pw-grid3">{FEATURES.map(([t, d, ic, art, ard]) => <div className="pw-card" key={t}><span className="pw-ic"><I n={ic} size={20} /></span><h3>{tr(lang, t, art)}</h3><p>{tr(lang, d, ard)}</p></div>)}</div>
      </section>
      <section className="pw-sec">
        <div className="pw-sec-head"><Eyebrow>{tr(lang, 'How it works', 'إزاي بيشتغل')}</Eyebrow><h2>{tr(lang, 'Clear from the first message to the final result.', 'واضح من أول رسالة لحد النتيجة.')}</h2></div>
        <div className="pw-steps">{[['A customer places an order or sends a message.', 'عميل يطلب أوردر أو يبعتلك رسالة.'], ['4Pixels gathers the customer, order and channel context.', '4Pixels يجمع بيانات العميل والأوردر والقناة.'], ['The right automation or team action starts immediately.', 'الأتمتة أو إجراء الفريق المناسب يبدأ فوراً.'], ['Everything is tracked in one clear operating view.', 'وكل حاجة تتتابع في شاشة تشغيل واحدة واضحة.']].map(([s, ars], i) => <div className="pw-step" key={s}><span className="pw-num">{i + 1}</span><p>{tr(lang, s, ars)}</p></div>)}</div>
      </section>
      <section className="pw-sec pw-alt">
        <div className="pw-sec-head"><Eyebrow>{tr(lang, 'Reviews', 'الآراء')}</Eyebrow><h2>{tr(lang, 'What store teams say', 'فرق المتاجر بتقول إيه')}</h2><p>{tr(lang, 'Sample reviews from demo stores, shown for illustration.', 'آراء تجريبية من متاجر وهمية للعرض فقط.')}</p></div>
        <div className="pw-grid2">{REVIEWS.map(([n, t, arn, art]) => <div className="pw-card pw-rev" key={n}><div className="pw-stars">★★★★★</div><p>“{tr(lang, t, art)}”</p><div className="pw-by"><span className="pw-av">{n[0]}</span><div><b>{tr(lang, n, arn)}</b><small>{tr(lang, 'Demo store', 'متجر تجريبي')}</small></div></div></div>)}</div>
      </section>
      <CTA lang={lang} go={go} />
    </>
  );
}

function CTA(_p: { lang: Lang; go: (p: string) => void }) {
  return null;
}

function PageHero({ lang, eye, h1, arH1, lead, arLead }: { lang: Lang; eye: string; h1: string; arH1: string; lead?: string; arLead?: string }) {
  return <section className="pw-pagehero"><Eyebrow>{eye}</Eyebrow><h1>{tr(lang, h1, arH1)}</h1>{lead && <p className="pw-lead">{tr(lang, lead, arLead)}</p>}</section>;
}

function About({ lang, go }: { lang: Lang; go: (p: string) => void }) {
  const values: [string, string, string, string, string][] = [
    ['One workspace', 'Everything your team needs lives on one screen, not in scattered tools.', 'overview', 'مساحة واحدة', 'كل اللي فريقك محتاجه في شاشة واحدة، مش أدوات متفرقة.'],
    ['Human control', 'Automation runs the routine; your team keeps the final say.', 'settings', 'تحكم بشري', 'الأتمتة تشغّل الروتين، وفريقك له الكلمة الأخيرة.'],
    ['Customer context', 'Every action starts from the customer\u2019s full picture.', 'inbox', 'سياق العميل', 'كل إجراء يبدأ من الصورة الكاملة للعميل.'],
    ['Arabic-first', 'Built for Arabic commerce teams, in Arabic and English.', 'chats', 'عربي أولاً', 'متبني لفرق التجارة العربية، بالعربي والإنجليزي.'],
  ];
  const areas: [string, string, string[], string, string][] = [
    ['Turn customer messages into controlled sales work.', 'The team sees the customer, the order, the owner and the next action from one clear inbox.', ['Team WhatsApp inbox', 'Order confirmation', 'Abandoned cart recovery'], 'حوّل رسائل العملاء لشغل مبيعات منظم.', 'الفريق يشوف العميل والأوردر والمسؤول والخطوة الجاية من إنبوكس واحد واضح.'],
    ['Run orders without chasing.', 'Every order carries its status, shipping and return details.', ['Order tracking', 'Returns control', 'Bosta delivery checks'], 'شغّل الأوردرات من غير مطاردة.', 'كل أوردر معاه حالته وتفاصيل الشحن والمرتجع.'],
    ['Grow repeat purchases.', 'Offers and retention flows run with clear tracking.', ['Smart Offers', 'Customer retention', 'SMS campaigns'], 'زوّد تكرار الشراء.', 'العروض وتدفقات الاحتفاظ بالعملاء شغالة بمتابعة واضحة.'],
    ['See the whole picture.', 'Sales, profit and team activity in one operating view.', ['Dashboard', 'Net profit', 'Exact Shopify sales'], 'شوف الصورة كاملة.', 'المبيعات والربح ونشاط الفريق في شاشة تشغيل واحدة.'],
  ];
  return (<>
    <PageHero lang={lang} eye={tr(lang, 'About us', 'من نحن')} h1="We keep store operations simple." arH1="بنخلي تشغيل المتاجر بسيط." lead="4Pixels brings conversations, orders, customers, marketing, loyalty and analytics into one clear operating workspace." arLead="4Pixels يجمع المحادثات والأوردرات والعملاء والتسويق والولاء والتحليلات في مساحة تشغيل واحدة واضحة." />
    <section className="pw-sec"><div className="pw-sec-head"><h2>{tr(lang, 'A simple idea: keep the whole operation visible.', 'فكرة بسيطة: خلّي كل العملية قدام عينك.')}</h2></div>
      <div className="pw-grid4">{values.map(([t, d, ic, art, ard]) => <div className="pw-card" key={t}><span className="pw-ic"><I n={ic} size={20} /></span><h3>{tr(lang, t, art)}</h3><p>{tr(lang, d, ard)}</p></div>)}</div></section>
    <section className="pw-sec pw-alt"><div className="pw-sec-head"><h2>{tr(lang, 'Four clear areas running the store.', 'أربع مناطق واضحة بتشغّل المتجر.')}</h2></div>
      <div className="pw-areas">{areas.map(([t, d, l, art, ard], i) => <div className="pw-area" key={t}><span className="pw-num">0{i + 1}</span><div><h3>{tr(lang, t, art)}</h3><p>{tr(lang, d, ard)}</p><div className="chip-row">{l.map(x => <span className="chip blue" key={x}>{x}</span>)}</div></div></div>)}</div></section>
    <CTA lang={lang} go={go} /></>);
}

function Features({ lang, go }: { lang: Lang; go: (p: string) => void }) {
  return (<>
    <PageHero lang={lang} eye={tr(lang, 'Features', 'المميزات')} h1="Everything your store operation needs." arH1="كل اللي عمليات متجرك محتاجاه." lead="From the first customer message to delivery, returns and repeat purchases." arLead="من أول رسالة من العميل لحد التسليم والمرتجعات وتكرار الشراء." />
    <section className="pw-sec"><div className="pw-grid3">{FEATURES.map(([t, d, ic, art, ard]) => <div className="pw-card" key={t}><span className="pw-ic"><I n={ic} size={20} /></span><h3>{tr(lang, t, art)}</h3><p>{tr(lang, d, ard)}</p></div>)}</div></section>
    <section className="pw-sec pw-alt"><div className="pw-sec-head"><h2>{tr(lang, 'And the details that make daily work easier.', 'والتفاصيل اللي بتسهّل الشغل اليومي.')}</h2></div>
      <div className="pw-grid4 pw-tiles">{MORE.map(([en, ar]) => <div className="pw-tile" key={en}><span className="tick"><I n="check" size={12} /></span>{tr(lang, en, ar)}</div>)}</div></section>
    <CTA lang={lang} go={go} /></>);
}

function Pricing({ lang, go }: { lang: Lang; go: (p: string) => void }) {
  const [per, setPer] = useState<'m' | 'y'>('m');
  const plans = [['Basic', 20, tr(lang, '1,200 orders / month', '1,200 أوردر / شهر')], ['Pro', 26, tr(lang, '2,200 orders / month', '2,200 أوردر / شهر')], ['Premium', 36, tr(lang, 'Unlimited orders', 'أوردرات غير محدودة')]] as const;
  const feats: [string, string][] = [[tr(lang, 'Unlimited customers', 'عملاء غير محدودين'), ''], [tr(lang, 'Unlimited messages', 'رسائل غير محدودة'), ''], [tr(lang, '5 team members', '5 أعضاء فريق'), ''], [tr(lang, 'Every CRM feature included', 'كل مميزات الـ CRM مشمولة'), '']];
  const faq: [string, string, string, string][] = [
    ['How does billing work?', 'You pick a plan inside Shopify and Shopify processes every charge. No transfers, no payment proof.', 'إزاي بيتم الدفع؟', 'بتختار الخطة من جوه Shopify وShopify بتتولى كل المدفوعات. من غير تحويلات أو إثبات دفع.'],
    ['Is there a free trial?', 'Yes. Every plan starts with a free trial with all features included.', 'في تجربة مجانية؟', 'أيوه. كل خطة بتبدأ بتجربة مجانية بكل المميزات.'],
    ['Can I change or cancel anytime?', 'Yes. Manage your plan from your Shopify admin whenever you like.', 'أقدر أغيّر أو ألغي في أي وقت؟', 'أيوه. تدير خطتك من لوحة Shopify في أي وقت.'],
  ];
  return (<>
    <PageHero lang={lang} eye={tr(lang, 'Pricing', 'الأسعار')} h1="Simple plans, billed securely by Shopify." arH1="خطط بسيطة، والدفع بأمان عن طريق Shopify." lead="Shopify App Store merchants choose and approve their plan directly in Shopify. No transfers or payment proof." arLead="تجار Shopify App Store يختاروا ويوافقوا على خطتهم مباشرة من Shopify. من غير تحويلات أو إثبات دفع." />
    <section className="pw-sec pw-plans-sec">
      <div className="seg center">{([['m', 'Monthly', 'شهري'], ['y', 'Yearly', 'سنوي']] as const).map(([k, en, ar]) => <button key={k} className={per === k ? 'on' : ''} onClick={() => setPer(k)}>{tr(lang, en, ar)}</button>)}</div>
      <div className="pw-plans">{plans.map(([n, usd, orders]) => <div className={`pw-plan${n === 'Pro' ? ' cur' : ''}`} key={n}>{n === 'Pro' && <span className="pw-pop">{tr(lang, 'Most popular', 'الأكثر اختياراً')}</span>}<h3>{n}</h3><div className="pw-price">${per === 'm' ? usd : Math.round(usd * 12 * 0.8)}<small>{per === 'm' ? tr(lang, 'USD / month', 'دولار / شهر') : tr(lang, 'USD / year', 'دولار / سنة')}</small></div><p className="pw-bill">{per === 'm' ? tr(lang, 'Billed by Shopify each month', 'الدفع عن طريق Shopify كل شهر') : tr(lang, 'Billed by Shopify yearly, 20% off', 'الدفع عن طريق Shopify سنوياً، خصم 20%')}</p><ul><li>{orders}</li>{feats.map(([f]) => <li key={f}>{f}</li>)}</ul><button className={`btn ${n === 'Pro' ? 'btn-primary' : 'btn-ghost'} btn-block`} onClick={() => go('login')}>{tr(lang, 'Start free trial', 'ابدأ التجربة المجانية')}</button></div>)}</div>
      <div className="pw-faq">{faq.map(([q, a, arq, ara]) => <div className="pw-faq-i" key={q}><h4>{tr(lang, q, arq)}</h4><p>{tr(lang, a, ara)}</p></div>)}</div>
    </section>
    <CTA lang={lang} go={go} /></>);
}

const PROJECTS: [string, string, string, string][] = [
  ['Tetiano', 'A premium Shopify website with a clean, responsive design, smooth shopping experience, product collections, and CRM/ERP-ready structure.', '#0284c7', 'موقع Shopify مميز بتصميم نظيف ومتجاوب وتجربة تسوق سلسة وكولكشنات وهيكل جاهز للـ CRM/ERP.'],
  ['Moon', 'A premium Shopify website with product collections and a smooth, responsive shopping experience.', '#6366f1', 'موقع Shopify مميز بكولكشنات وتجربة تسوق سلسة ومتجاوبة.'],
  ['Erwana', 'A premium Shopify website built for daily e-commerce operations and brand growth.', '#0d9488', 'موقع Shopify مميز متبني للتشغيل اليومي ونمو البراند.'],
  ['N.S Home Organization', 'An Arabic-first store for smart home-organization products with clear category navigation.', '#d97706', 'متجر عربي أولاً لمنتجات تنظيم البيت الذكية بتصفح أقسام واضح.'],
  ['Tharaa Gaming', 'A high-converting gaming store for consoles, games, controllers, and accessories.', '#7c3aed', 'متجر جيمنج عالي التحويل للأجهزة والألعاب والإكسسوارات.'],
  ['Lamsa Home & Textiles', 'An elegant home décor storefront for rugs, mats, curtains, and home-textile collections.', '#db2777', 'واجهة أنيقة لديكور البيت: سجاد ومفارش وستائر وكولكشنات مفروشات.'],
];

function StoreMock({ c, name }: { c: string; name: string }) {
  return (
    <div className="pj-frame">
      <div className="pj-chrome"><span className="pj-dots"><i /><i /><i /></span><span className="pj-url">{name}</span></div>
      <div className="pj-site">
        <div className="pj-nav" style={{ background: c }}><b /><i /><i /><i /></div>
        <div className="pj-hero" style={{ background: `linear-gradient(120deg, ${c}1f, ${c}08)` }}><b style={{ background: c }} /><em /><em className="s" /></div>
        <div className="pj-prods">{[0, 1, 2].map(i => <div className="pj-prod" key={i}><span style={{ background: `${c}1f` }} /><em /><em className="s" style={{ background: c }} /></div>)}</div>
      </div>
    </div>
  );
}

function Projects({ lang }: { lang: Lang }) {
  return (<>
    <PageHero lang={lang} eye={tr(lang, 'Projects', 'المشاريع')} h1="Selected websites, systems and commerce builds." arH1="مواقع وأنظمة ومتاجر مختارة من شغلنا." lead="A clear view of the work, the product type, and the final result." arLead="نظرة واضحة على الشغل ونوع المنتج والنتيجة النهائية." />
    <section className="pw-sec"><div className="pw-grid3 pw-projs">{PROJECTS.map(([t, d, c, ard]) => <div className="pw-proj" key={t}><StoreMock c={c} name={t} /><div className="pw-proj-body"><h3>{t}</h3><span className="chip blue">Shopify</span><p>{tr(lang, d, ard)}</p></div></div>)}</div></section></>);
}

function Contact({ lang }: { lang: Lang }) {
  const [sent, setSent] = useState(false);
  return (<>
    <PageHero lang={lang} eye={tr(lang, 'Contact', 'تواصل معنا')} h1="Tell us what you need." arH1="قولنا محتاج إيه." lead="Send a short brief and we will continue on WhatsApp with the context already prepared." arLead="ابعت وصف مختصر وهنكمل معاك على واتساب وإحنا فاهمين المطلوب." />
    <section className="pw-sec"><div className="pw-contact">
      <div className="pw-card pw-form"><h3>{sent ? tr(lang, 'Thanks, we got your brief.', 'شكراً، وصلنا طلبك.') : tr(lang, 'Project brief', 'تفاصيل طلبك')}</h3>{sent ? <p>{tr(lang, 'We will message you on WhatsApp shortly.', 'هنبعتلك على واتساب قريب.')}</p> : <>
        <div className="field"><label>{tr(lang, 'Name', 'الاسم')}</label><input /></div>
        <div className="field"><label>{tr(lang, 'WhatsApp number', 'رقم واتساب')}</label><input /></div>
        <div className="field"><label>{tr(lang, 'What do you need?', 'محتاج إيه؟')}</label><textarea rows={4} className="inp" /></div>
        <button className="btn btn-primary" onClick={() => setSent(true)}>{tr(lang, 'Send brief', 'إرسال')}</button></>}</div>
      <div className="pw-card pw-info">
        <h3>{tr(lang, 'WhatsApp', 'واتساب')}</h3><p className="pw-phone">01066184859</p>
        <a className="btn btn-primary" href="https://wa.me/201066184859" target="_blank" rel="noreferrer">{tr(lang, 'Chat on WhatsApp', 'كلمنا على واتساب')}</a>
        <hr />
        <h3>{tr(lang, 'Response', 'الرد')}</h3><p>{tr(lang, 'We usually reply on WhatsApp the same day.', 'بنرد على واتساب عادة في نفس اليوم.')}</p>
        <h3>{tr(lang, 'Location', 'المكان')}</h3><p>{tr(lang, 'Cairo, Egypt', 'القاهرة، مصر')}</p>
      </div>
    </div></section></>);
}
