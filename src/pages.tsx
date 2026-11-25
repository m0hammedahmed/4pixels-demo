import React, { useMemo, useState } from 'react';
import { I } from './App';
import { ORDERS, DOrder, OStatus, fmtMoney, fmtDate, rangeFor, RANGE_KEYS, DEMO_NOW } from './demoData';
import type { Lang } from './i18n';

type P = { lang: Lang; showToast: (m: string) => void; go: (p: string) => void };
const tr = (lang: Lang, en: string, ar?: string) => (lang === 'ar' && ar ? ar : en);

function Head({ title, sub, right }: { eyebrow?: string; title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="page-head">
      <div><h1 className="h1">{title}</h1>{sub && <p className="muted">{sub}</p>}</div>
      {right && <div className="head-right">{right}</div>}
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = { Pending: 'gold', Confirmed: 'green', Fulfilled: 'green', Return: 'red', 'Partial Return': 'red', 'Customer cancel': 'purple', Cancelled: 'red' };
const statusLabel = (s: string) => (s === 'Confirmed' ? 'Confirmed' : s === 'Fulfilled' ? 'Fulfilled / Shipped' : s);

/* ---------------- Range filter ---------------- */
function RangePicker({ lang, range, setRange, custom, setCustom }: { lang: Lang; range: string; setRange: (r: string) => void; custom: { from: string; to: string }; setCustom: (c: { from: string; to: string }) => void }) {
  return (
    <div className="range-box">
      <label className="lbl">{tr(lang, 'Date range', 'الفترة')}</label>
      <select className="inp" value={range} onChange={e => setRange(e.target.value)}>{RANGE_KEYS.map(r => <option key={r}>{r}</option>)}</select>
      {range === 'Custom range' && (
        <div className="custom-range">
          <label>{tr(lang, 'From day', 'من يوم')}<input className="inp" type="date" value={custom.from} onChange={e => setCustom({ ...custom, from: e.target.value })} /></label>
          <label>{tr(lang, 'To day', 'إلى يوم')}<input className="inp" type="date" value={custom.to} onChange={e => setCustom({ ...custom, to: e.target.value })} /></label>
        </div>
      )}
    </div>
  );
}

function Section({ title, sub, children, defaultOpen }: { title: string; sub?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="card section">
      <button className="section-head" onClick={() => setOpen(!open)}><div><b>{title}</b>{sub && <div className="muted small">{sub}</div>}</div><span className={`chev${open ? ' up' : ''}`}><I n="back" size={16} /></span></button>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
export function DashboardPage({ lang, showToast, go }: P) {
  const [range, setRange] = useState('Last 30 days');
  const [custom, setCustom] = useState({ from: '2026-11-01', to: '2026-11-25' });
  const [scope, setScope] = useState('All statuses');
  const [mode, setMode] = useState<'revenue' | 'quantity'>('revenue');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('none');
  const r = rangeFor(range, custom);
  const list = ORDERS.filter(o => o.date >= r.from && o.date < r.to);
  const scoped = scope === 'All statuses' ? list : list.filter(o => (scope === 'Confirmed & Fulfilled' ? o.status === 'Confirmed' || o.status === 'Fulfilled' : o.status === scope || (scope === 'Returned / RTO' && o.status === 'Return') || (scope === 'Cancelled' && o.status === 'Cancelled')));
  const cnt = (f: (o: DOrder) => boolean) => list.filter(f).length;
  const sum = (f: (o: DOrder) => boolean) => list.filter(f).reduce((s, o) => s + o.total, 0);
  const kpis: [string, string, string][] = [
    ['Total Orders', String(list.length), ''], ['Pending', String(cnt(o => o.status === 'Pending')), 'gold'], ['Confirmed', String(cnt(o => o.status === 'Confirmed')), 'green'],
    ['Confirmed & Fulfilled', String(cnt(o => o.status === 'Confirmed' || o.status === 'Fulfilled')), 'blue'], ['Returned / RTO', String(cnt(o => o.status === 'Return' || o.status === 'Partial Return')), 'orange'],
    ['Customer cancel request', String(cnt(o => o.status === 'Customer cancel')), 'purple'], ['Cancelled on Shopify', String(cnt(o => o.status === 'Cancelled')), 'red'],
  ];
  const products = useMemo(() => {
    const m: Record<string, { qty: number; orders: number; value: number }> = {};
    scoped.forEach(o => o.items.forEach(it => { const x = (m[it.name] ||= { qty: 0, orders: 0, value: 0 }); x.qty += it.qty; x.orders += 1; x.value += it.qty * it.unit; }));
    let rows = Object.entries(m).map(([name, v]) => ({ name, ...v, unit: v.value / v.qty })).filter(x => x.name.toLowerCase().includes(q.toLowerCase()));
    rows.sort((a, b) => (sort === 'az' ? a.name.localeCompare(b.name) : sort === 'za' ? b.name.localeCompare(a.name) : mode === 'revenue' ? b.value - a.value : b.qty - a.qty));
    return rows;
  }, [scoped, q, sort, mode]);
  return (
    <div>
      <Head title={tr(lang, 'Dashboard', 'لوحة التحكم')} sub={tr(lang, 'Your orders at a glance. Open a section to see more.', 'أوردراتك في نظرة واحدة. افتح أي قسم لتفاصيل أكتر.')} />
      <div className="toolbar">
        <RangePicker lang={lang} range={range} setRange={setRange} custom={custom} setCustom={setCustom} />
        <div className="range-box"><label className="lbl">{tr(lang, 'Order status', 'حالة الأوردر')}</label>
          <select className="inp" value={scope} onChange={e => setScope(e.target.value)}>{['All statuses', 'Pending', 'Confirmed', 'Confirmed & Fulfilled', 'Returned / RTO', 'Customer cancel', 'Cancelled'].map(s => <option key={s}>{s}</option>)}</select></div>
      </div>
      <div className="kpi-grid kpi-4">
        <div className="card kpi"><div className="small k-t">Total Orders</div><div className="kpi-v">{list.length}</div><div className="small muted">{range}</div></div>
        <div className="card kpi k-blue"><div className="small k-t">Confirmed &amp; Fulfilled</div><div className="kpi-v">{cnt(o => o.status === 'Confirmed' || o.status === 'Fulfilled')}</div><div className="small muted">Orders moving forward</div></div>
        <div className="card kpi dark"><div className="small">All order value</div><div className="kpi-v">{fmtMoney(sum(() => true))}</div><div className="small op">Every status</div></div>
        <div className="card kpi blue"><div className="small">Requested Revenue</div><div className="kpi-v">{fmtMoney(sum(o => o.status === 'Pending' || o.status === 'Confirmed'))}</div><div className="small op">Pending and confirmed</div></div>
      </div>
      <Section title={tr(lang, 'Status breakdown', 'تفصيل الحالات')} sub={tr(lang, 'Pending, returns, and cancellations', 'المعلّق والمرتجع والملغي')} defaultOpen>
        <div className="brk">
          {[['Pending', cnt(o => o.status === 'Pending'), 'gold'], ['Confirmed', cnt(o => o.status === 'Confirmed'), 'green'], ['Returned / RTO', cnt(o => o.status === 'Return' || o.status === 'Partial Return'), 'orange'], ['Customer cancel request', cnt(o => o.status === 'Customer cancel'), 'purple'], ['Cancelled on Shopify', cnt(o => o.status === 'Cancelled'), 'red']].map(([k, v, c]) => (
            <div className="brk-row" key={String(k)}><span className={`dot d-${c}`} /><span className="grow">{k}</span><b>{v as number}</b><div className="bar"><i className={`d-${c}`} style={{ width: `${list.length ? ((v as number) / list.length) * 100 : 0}%` }} /></div></div>
          ))}
        </div>
      </Section>
      <Section title={tr(lang, 'Product stats', 'إحصائيات المنتجات')} sub={tr(lang, 'Calculated from order line items. Search, sort and export.', 'من بنود الأوردرات. بحث وترتيب وتصدير.')}>
        <div className="seg" style={{ marginBottom: 12 }}><button className={mode === 'revenue' ? 'on' : ''} onClick={() => setMode('revenue')}>By revenue</button><button className={mode === 'quantity' ? 'on' : ''} onClick={() => setMode('quantity')}>By quantity</button></div>
        <div className="tool-row">
          <input className="inp grow" placeholder="Single Search" value={q} onChange={e => setQ(e.target.value)} />
          <button className="btn btn-ghost btn-sm" onClick={() => showToast('Multi search: paste several product names')}>Multi Search</button>
          <select className="inp" value={sort} onChange={e => setSort(e.target.value)}><option value="none">No alphabetical sort</option><option value="az">A to Z</option><option value="za">Z to A</option></select>
          <button className="btn btn-ghost btn-sm" onClick={() => { setQ(''); setSort('none'); setScope('All statuses'); }}>Clear filters</button>
          <button className="btn btn-primary btn-sm" onClick={() => showToast('Exported filtered products (demo)')}>Export filtered</button>
        </div>
        <div className="stat-row">
          <div><span className="muted small">Requested products</span><b>{products.length}</b></div>
          <div><span className="muted small">Total quantity</span><b>{products.reduce((s, p) => s + p.qty, 0)}</b></div>
          <div><span className="muted small">Products value</span><b>{fmtMoney(products.reduce((s, p) => s + p.value, 0))}</b></div>
        </div>
        <div className="table-wrap"><table className="data"><thead><tr><th>Product</th><th>Qty</th><th>Orders</th><th>Value</th><th>Unit price</th></tr></thead>
          <tbody>{products.map(p => <tr key={p.name}><td>{p.name}</td><td>{p.qty}</td><td>{p.orders}</td><td>{fmtMoney(p.value)}</td><td>{fmtMoney(p.unit)}</td></tr>)}
            {products.length === 0 && <tr><td colSpan={5} className="muted">No orders in this range.</td></tr>}</tbody></table></div>
      </Section>
    </div>
  );
}

/* ---------------- Orders ---------------- */
export function OrdersPage({ lang, showToast, go }: P) {
  const [range, setRange] = useState('All time');
  const [custom, setCustom] = useState({ from: '2026-11-01', to: '2026-11-25' });
  const [source, setSource] = useState('All sources');
  const [sort, setSort] = useState('Newest first');
  const [tab, setTab] = useState('All');
  const [field, setField] = useState('Order #');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<number | null>(null);
  const [sel, setSel] = useState<number[]>([]);
  const [shown, setShown] = useState(20);
  const [comments, setComments] = useState<Record<number, string[]>>({});
  const [draft, setDraft] = useState('');
  const [retFor, setRetFor] = useState<number | null>(null);
  const [info, setInfo] = useState(false);
  const [filt, setFilt] = useState(false);
  const r = rangeFor(range, custom);
  let list = ORDERS.filter(o => o.date >= r.from && o.date < r.to && (source === 'All sources' || o.source === source) && (tab === 'All' || o.status === tab));
  const ql = q.trim().toLowerCase();
  if (ql) list = list.filter(o => field === 'Order #' ? String(o.id).includes(ql) : field === 'Phone' ? o.phone.includes(ql) : `${o.id} ${o.phone} ${o.name} ${o.email}`.toLowerCase().includes(ql));
  list = [...list].sort((a, b) => sort === 'Oldest first' ? a.date - b.date : sort === 'Order number high to low' ? b.id - a.id : sort === 'Highest value' ? b.total - a.total : sort === 'Lowest value' ? a.total - b.total : b.date - a.date);
  const ful = list.filter(o => o.status === 'Fulfilled');
  const net = ful.reduce((s, o) => s + o.subtotal - o.discount, 0);
  const prof = ful.reduce((s, o) => s + o.profit, 0);
  const tabs: OStatus[] = ['Pending', 'Confirmed', 'Fulfilled', 'Return', 'Partial Return', 'Customer cancel', 'Cancelled'];
  const countIn = (s: string) => ORDERS.filter(o => s === 'All' || o.status === s).length;
  return (
    <div>
      <Head title={tr(lang, 'Orders', 'الأوردرات')} sub={tr(lang, 'Tap an order to see its details.', 'اضغط على أوردر لتشوف تفاصيله.')} />
      <div className="card strip">
        <div><span className="muted small">Filtered net sales</span><b>{fmtMoney(net)}</b><span className="chip green">{ful.length} fulfilled</span></div>
        <div><span className="muted small">Filtered net profit</span><b>{fmtMoney(prof)}</b></div>
        <button className="link-btn" onClick={() => setInfo(!info)}>{info ? 'Hide' : 'How is this calculated?'}</button>
        {info && <p className="muted small strip-note">Net sales: product value from fulfilled orders after Shopify discounts and returns, excluding shipping, taxes and cancellations. Net profit: net sales minus product cost and recorded shipping. Ads and operating expenses are not deducted.</p>}
      </div>
      <div className="tool-row">
        <select className="inp narrow" value={field} onChange={e => setField(e.target.value)}><option>Order #</option><option>Phone</option><option>All fields</option></select>
        <input className="inp grow" placeholder="Search by order number, e.g. 12500" value={q} onChange={e => setQ(e.target.value)} />
        <button className={`btn btn-ghost${filt ? ' on' : ''}`} onClick={() => setFilt(!filt)}>Filters</button>
      </div>
      {filt && (
        <div className="toolbar">
          <RangePicker lang={lang} range={range} setRange={setRange} custom={custom} setCustom={setCustom} />
          <div className="range-box"><label className="lbl">Order source</label><select className="inp" value={source} onChange={e => setSource(e.target.value)}>{['All sources', 'Recovered abandoned checkout', 'Abandoned message', 'Direct / Other', 'Shopify'].map(s => <option key={s}>{s}</option>)}</select></div>
          <div className="range-box"><label className="lbl">Sort by</label><select className="inp" value={sort} onChange={e => setSort(e.target.value)}>{['Newest first', 'Oldest first', 'Order number high to low', 'Highest value', 'Lowest value'].map(s => <option key={s}>{s}</option>)}</select></div>
          <button className="btn btn-ghost btn-sm" onClick={() => { setQ(''); setTab('All'); setSource('All sources'); setRange('All time'); }}>Clear filters</button>
        </div>
      )}
      <div className="tabs-scroll">
        {['All', ...tabs].map(s => <button key={s} className={`tab${tab === s ? ' on' : ''}`} onClick={() => setTab(s)}>{statusLabel(s)} <small>{countIn(s)}</small></button>)}
      </div>
      <div className="bulk-line">
        <span className="muted small">{Math.min(shown, list.length)} of {list.length} orders{sel.length ? ` · ${sel.length} selected` : ''}</span>
        <div className="btn-row">
          <button className="btn btn-ghost btn-sm" onClick={() => setSel(sel.length ? [] : list.slice(0, shown).map(o => o.id))}>{sel.length ? 'Clear selection' : 'Select visible'}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => showToast('Exported filtered orders (demo)')}>Export filtered</button>
          <button className="btn btn-ghost btn-sm" onClick={() => showToast('Exported all orders (demo)')}>Export all</button>
          <button className="btn btn-primary btn-sm" disabled={!sel.length} onClick={() => { showToast(`Confirmation sent to ${sel.length} orders`); setSel([]); }}>Send confirmation</button>
        </div>
      </div>
      <div className="order-list">
        {list.slice(0, shown).map(o => {
          const isOpen = open === o.id;
          const cm = [...o.comments, ...(comments[o.id] || [])];
          return (
            <div className={`card order-card${isOpen ? ' open' : ''}`} key={o.id}>
              <div className="order-top" onClick={() => setOpen(isOpen ? null : o.id)}>
                <input type="checkbox" checked={sel.includes(o.id)} onClick={e => e.stopPropagation()} onChange={e => setSel(e.target.checked ? [...sel, o.id] : sel.filter(x => x !== o.id))} />
                <div className="order-main">
                  <div className="order-line"><b>#{o.id}</b><span className={`chip ${STATUS_COLOR[o.status]}`}>{statusLabel(o.status)}</span></div>
                  <div className="order-name">{o.name}</div>
                  <div className="muted small">{o.phone} · {fmtDate(o.date)}</div>
                </div>
                <div className="order-side"><div className="order-total">{fmtMoney(o.total)}</div><span className={`chev${isOpen ? ' up' : ''}`}><I n="back" size={16} /></span></div>
              </div>
              {isOpen && (
                <div className="order-details">
                  <div className="btn-row">
                    <button className="btn btn-primary btn-sm" onClick={() => go('chats')}>Open Chat</button>
                    <button className="btn btn-warn btn-sm" onClick={() => setRetFor(o.id)}>Edit Return Reason</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setOpen(null)}>Hide Details</button>
                  </div>
                  <div className="d-cols">
                    <div className="d-sec"><h4>Payment summary</h4>
                      {[['Subtotal', o.subtotal], ['Shipping', o.shipping], ['Tax', o.tax], ['Discount', o.discount ? -o.discount : 0]].map(([k, v]) => <div className="kv" key={String(k)}><span>{k}</span><b>{fmtMoney(Number(v))}</b></div>)}
                      <div className="kv total"><span>Total</span><b>{fmtMoney(o.total)}</b></div>
                      <div className="kv"><span>Net profit</span><b className="g">{fmtMoney(o.profit)}</b></div>
                    </div>
                    <div className="d-sec"><h4>Status</h4>
                      <div className="kv"><span>Acquisition source</span><b>{o.source}</b></div>
                      <div className="kv"><span>Payment</span><b>{o.payment}</b></div>
                      <div className="kv"><span>Fulfillment</span><b>{o.fulfillment}</b></div>
                      <div className="kv"><span>Bosta</span><b>{o.bostaStatus}</b></div>
                      <div className="kv"><span>Tracking</span><b>{o.tracking || 'not linked'}</b></div>
                      <div className="kv"><span>Bosta verification</span><b>{o.bosta}%</b></div>
                    </div>
                  </div>
                  <div className="d-sec"><h4>Items</h4>{o.items.map(it => <div className="item-row" key={it.name}><div>{it.name}<small>x{it.qty}</small></div><div className="muted small">{fmtMoney(it.unit)} each</div><b>{fmtMoney(it.unit * it.qty)}</b></div>)}</div>
                  <div className="d-cols">
                    <div className="d-sec"><h4>Shipping address</h4><b>{o.name}</b><div className="muted small">{o.address}, {o.city}, Egypt<br />{o.phone}<br />{o.email}</div></div>
                    <div className="d-sec"><h4>Billing address</h4><b>{o.name}</b><div className="muted small">{o.address}, {o.city}, Egypt</div></div>
                  </div>
                  <div className="d-sec"><h4>Automation timeline</h4>{o.timeline.slice().reverse().map(t => <div className="tl" key={t.t}><i />{t.t}<small>{fmtDate(t.at)}</small></div>)}</div>
                  <div className="d-sec"><h4>Tags</h4><div className="chip-row">{o.tags.map(t => <span className="chip grey" key={t}>{t}</span>)}</div></div>
                  <div className="d-sec"><h4>Order comments</h4>
                    {cm.length === 0 && <div className="muted small">No comments yet.</div>}{cm.map((c, i) => <div className="comment" key={i}>{c}</div>)}
                    <div className="tool-row"><input className="inp grow" placeholder="Write an internal comment" value={draft} onChange={e => setDraft(e.target.value)} /><button className="btn btn-primary btn-sm" onClick={() => { if (draft.trim()) { setComments({ ...comments, [o.id]: [...(comments[o.id] || []), draft.trim()] }); setDraft(''); } }}>Add Comment</button></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && <div className="card card-pad muted">No orders match these filters.</div>}
      </div>
      {shown < list.length && <button className="btn btn-ghost btn-block" onClick={() => setShown(shown + 20)}>Load more orders ({list.length - shown})</button>}
      {retFor && (
        <div className="drawer-back" onClick={() => setRetFor(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="h3">Return reason · #{retFor}</h3>
            <select className="inp" defaultValue="Customer changed mind">{['Customer changed mind', 'Wrong size', 'Damaged item', 'Late delivery', 'Not reachable'].map(x => <option key={x}>{x}</option>)}</select>
            <textarea className="inp" rows={3} placeholder="Notes" style={{ marginTop: 10 }} />
            <div className="btn-row" style={{ marginTop: 12 }}><button className="btn btn-ghost" onClick={() => setRetFor(null)}>Cancel</button><button className="btn btn-primary" onClick={() => { setRetFor(null); showToast('Return reason saved'); }}>Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Chat ---------------- */
export function ChatPage({ lang, showToast }: P) {
  const [chan, setChan] = useState('All');
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<number | null>(typeof window !== 'undefined' && window.innerWidth > 900 ? ORDERS[0].id : null);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<Record<number, string[]>>({});
  const [read, setRead] = useState<number[]>([]);
  const [more, setMore] = useState(false);
  const chats = ORDERS.slice(0, 24);
  const unread = (o: DOrder) => (read.includes(o.id) ? 0 : o.unread);
  let list = chats.filter(o => (chan === 'All' || chan === 'WhatsApp') && (`${o.name} ${o.phone} ${o.lastMsg} ${o.id}`.toLowerCase().includes(q.toLowerCase())));
  if (filter === 'Unread') list = list.filter(o => unread(o) > 0);
  if (filter === 'Unreplied') list = list.filter(o => o.id % 4 === 0);
  if (filter === 'Follow-up') list = list.filter(o => o.id % 9 === 0);
  const cur = chats.find(o => o.id === sel) || null;
  const send = () => { if (cur && draft.trim()) { setSent({ ...sent, [cur.id]: [...(sent[cur.id] || []), draft.trim()] }); setDraft(''); } };
  return (
    <div className="chat-page">
      <div className={`chat-wrap${cur ? ' has-sel' : ''}`}>
        <div className="conv-col card">
          <div className="conv-head">
            <div className="row-between"><h2 className="h2">Chats</h2><span className="muted small">{chats.length} chats · {chats.filter(o => unread(o) > 0).length} unread</span></div>
            <div className="seg full">{['All', 'WhatsApp', 'Instagram', 'Messenger'].map(n => <button key={n} className={chan === n ? 'on' : ''} onClick={() => setChan(n)}>{n}</button>)}</div>
            <input className="inp" placeholder="Search name, phone or message" value={q} onChange={e => setQ(e.target.value)} />
            <div className="pill-row scroll">{['All', 'Unreplied', 'Not contacted', 'Unread', 'Follow-up'].map(f => <button key={f} className={`pill${filter === f ? ' on' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}</div>
          </div>
          <div className="conv-scroll">
            {list.map(o => (
              <div key={o.id} className={`conv${sel === o.id ? ' on' : ''}`} onClick={() => { setSel(o.id); setRead([...read, o.id]); setMore(false); }}>
                <div className="av">{o.name[0]}</div>
                <div className="conv-body">
                  <div className="row-between"><b>{o.name}</b><span className="muted small">{new Date(o.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span></div>
                  <div className="muted small">#{o.id} · {o.phone}</div>
                  <div className="muted small clamp1">{o.lastMsg}</div>
                </div>
                {unread(o) > 0 && <span className="unread">{unread(o)}</span>}
              </div>
            ))}
            {list.length === 0 && <div className="empty">No chats found</div>}
          </div>
        </div>
        <div className="thread-col card">
          {!cur ? <div className="empty big"><div className="empty-ic"><I n="chats" size={26} /></div><b>Select a chat</b><small>Pick a customer on the left to see the conversation and the order.</small></div> : (
            <>
              <div className="thread-head">
                <button className="icon-btn back-btn" onClick={() => setSel(null)}><I n="back" size={16} /></button>
                <div className="av">{cur.name[0]}</div>
                <div className="grow"><b>{cur.name}</b><div className="muted small">{cur.phone}</div></div>
                <button className="btn btn-ghost btn-sm" onClick={() => setMore(!more)}>{more ? 'Hide order' : 'Order details'}</button>
              </div>
              <div className="order-chip-row">
                <span className="chip order-ch">Order #{cur.id}</span><span className={`chip ${STATUS_COLOR[cur.status]}`}>{statusLabel(cur.status)}</span><span className="chip green">Bosta · {cur.bostaStatus}</span><span className="muted small">{fmtMoney(cur.total)}</span>
              </div>
              {more && (
                <div className="info-panel">
                  <div className="kv"><span>Order number</span><b>#{cur.id}</b></div>
                  <div className="kv"><span>Customer</span><b>{cur.name}</b></div>
                  <div className="kv"><span>Phone</span><b>{cur.phone}</b></div>
                  <div className="kv"><span>City</span><b>{cur.city}</b></div>
                  <div className="kv"><span>Total</span><b>{fmtMoney(cur.total)}</b></div>
                  <div className="kv"><span>Bosta status</span><b>{cur.bostaStatus} · {cur.bosta}%</b></div>
                  <div className="kv"><span>Tracking</span><b>{cur.tracking || 'Not linked'}</b></div>
                  <div className="kv"><span>Items</span><b>{cur.items.map(i => `${i.name} x${i.qty}`).join(', ')}</b></div>
                </div>
              )}
              <div className="msgs-col">
                <div className="day">{new Date(cur.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</div>
                <div className="bubble out">Hello {cur.name.split(' ')[0]}, your order #{cur.id} was created. Reply YES to confirm.<small>{fmtDate(cur.date + 8000)}</small></div>
                <div className="bubble in">{cur.lastMsg}<small>{fmtDate(cur.date + 600000)}</small></div>
                {(sent[cur.id] || []).map((m, i) => <div className="bubble out" key={i}>{m}<small>now ✓✓</small></div>)}
              </div>
              <div className="composer"><input className="inp grow" placeholder="Type a message" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} /><button className="btn btn-ghost btn-sm" onClick={() => showToast('Template picker (demo)')}>Template</button><button className="btn btn-primary send-btn" onClick={send}><I n="send" size={16} /></button></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Shopify Sales (Bosta verification) ---------------- */
export function SalesPage({ lang, showToast }: P) {
  const [f, setF] = useState('All Orders');
  const [from, setFrom] = useState('2026-11-01'); const [to, setTo] = useState('2026-11-25');
  const rows = ORDERS.filter(o => o.status === 'Fulfilled' && o.date >= new Date(from + 'T00:00:00').getTime() && o.date < new Date(to + 'T00:00:00').getTime() + 86400000);
  const g = (s: string) => rows.filter(o => o.bostaStatus === s);
  const v = (a: DOrder[]) => fmtMoney(a.reduce((s, o) => s + o.total, 0));
  const shown = f === 'All Orders' ? rows : rows.filter(o => o.bostaStatus === (f === 'Delivered' ? 'Delivered' : f === 'In Transit' ? 'In transit' : f === 'Returned / Failed' ? 'Returned' : 'Unverified'));
  return (
    <div>
      <Head eyebrow="Verified from Shopify" title="Exact Shopify Sales" sub={tr(lang, 'Figures come from ShopifyQL using Shopify report definitions.', 'الأرقام مأخوذة من ShopifyQL حسب تعريفات تقارير Shopify.')}
        right={<div className="btn-row"><button className="btn btn-ghost btn-sm" onClick={() => showToast('Report refreshed')}>Refresh Report</button><button className="btn btn-primary btn-sm" onClick={() => showToast('Excel exported (demo)')}>Export Excel</button></div>} />
      <div className="card card-pad filter-bar"><div className="range-box"><label className="lbl">Start Date</label><input type="date" className="inp" value={from} onChange={e => setFrom(e.target.value)} /></div><div className="range-box"><label className="lbl">End Date</label><input type="date" className="inp" value={to} onChange={e => setTo(e.target.value)} /></div><div className="range-box"><span className="muted small">Source: ShopifyQL • demo-store.myshopify.com • Africa/Cairo</span></div></div>
      <div className="card card-pad" style={{ marginTop: 16 }}>
        <div className="row-between wrap"><div><h3 className="h3">Bosta Delivery Verification</h3><p className="muted small" style={{ margin: 0 }}>An order counts as received only when Bosta confirms delivery. Fulfilled in Shopify is not proof of delivery or cash collection.</p></div><div className="btn-row"><button className="btn btn-ghost btn-sm" onClick={() => showToast('Opening Bosta settings')}>Bosta Settings</button><button className="btn btn-primary btn-sm" onClick={() => showToast('Verified delivery statuses synced')}>Sync Verified Delivery Statuses</button></div></div>
        <div className="kpi-grid kpi-4" style={{ marginTop: 14 }}>
          {([['Bosta Delivered', 'Delivered', 'green'], ['In Transit', 'In transit', 'blue'], ['Returned / Failed', 'Returned', 'red'], ['Unverified', 'Unverified', 'gold']] as const).map(([k, s, c]) => <div className={`card kpi k-${c}`} key={k}><div className="small k-t">{k}</div><div className="kpi-v">{g(s).length}</div><div className="muted small">{v(g(s))} in order values</div></div>)}
        </div>
        <div className="tool-row"><label className="lbl">Status Filter</label><select className="inp" value={f} onChange={e => setF(e.target.value)}>{['All Orders', 'Delivered', 'In Transit', 'Returned / Failed', 'Unverified'].map(x => <option key={x}>{x}</option>)}</select></div>
        <div className="table-wrap"><table className="data"><thead><tr><th>Order</th><th>Bosta Status</th><th>Tracking</th><th>Order Total (EGP)</th></tr></thead><tbody>{shown.map(o => <tr key={o.id}><td>{o.id}</td><td><span className={`chip ${o.bostaStatus === 'Delivered' ? 'green' : o.bostaStatus === 'In transit' ? 'blue' : o.bostaStatus === 'Returned' ? 'red' : 'gold'}`}>{o.bostaStatus}</span></td><td className="mono">{o.tracking || 'Not Linked'}</td><td>{fmtMoney(o.total)}</td></tr>)}</tbody></table></div>
      </div>
    </div>
  );
}

/* ---------------- Customers ---------------- */
export function CustomersPage({ lang, showToast, go }: P) {
  const [risk, setRisk] = useState('All risk levels');
  const [sort, setSort] = useState('Latest activity');
  const [q, setQ] = useState('');
  const [consent, setConsent] = useState(false);
  const cust = useMemo(() => {
    const m: Record<string, { name: string; phone: string; orders: number; value: number; last: number; bosta: number; msgs: number; risk: string }> = {};
    ORDERS.forEach(o => { const c = (m[o.phone] ||= { name: o.name, phone: o.phone, orders: 0, value: 0, last: 0, bosta: o.bosta, msgs: 3 + (o.id % 9), risk: o.status === 'Cancelled' ? 'Cancelled before' : o.status === 'Return' ? 'Returned before' : 'Regular' }); c.orders++; c.value += o.total; c.last = Math.max(c.last, o.date); });
    return Object.values(m);
  }, []);
  let list = cust.filter(c => (risk === 'All risk levels' || c.risk === risk) && `${c.name} ${c.phone}`.toLowerCase().includes(q.toLowerCase()));
  list = [...list].sort((a, b) => (sort === 'Name' ? a.name.localeCompare(b.name) : sort === 'Customer value' ? b.value - a.value : b.last - a.last));
  const ago = (t: number) => { const m = Math.round((DEMO_NOW - t) / 60000); return m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
  return (
    <div>
      <Head eyebrow="CUSTOMER MANAGEMENT" title={tr(lang, 'Customers', 'العملاء')} sub="Every customer in one clear view with latest activity, order value, and open conversation status." right={<span className="chip green">Shopify · Connected and receiving data</span>} />
      <div className="kpi-grid kpi-4">{[['Total customers', String(cust.length)], ['Total revenue', fmtMoney(cust.reduce((s, c) => s + c.value, 0))], ['Guarded customers', '3'], ['New customers', String(Math.round(cust.length * 0.3))]].map(([k, v]) => <div className="card kpi" key={k}><div className="small k-t">{k}</div><div className="kpi-v">{v}</div></div>)}</div>
      <div className="tool-row"><input className="inp grow" placeholder="Search by name or phone" value={q} onChange={e => setQ(e.target.value)} />
        <select className="inp" value={sort} onChange={e => setSort(e.target.value)}>{['Latest message', 'Latest activity', 'Created at', 'Name', 'Customer value'].map(x => <option key={x}>{x}</option>)}</select>
        <select className="inp" value={risk} onChange={e => setRisk(e.target.value)}>{['All risk levels', 'Guard active', 'High risk', 'Cancelled before', 'Returned before', 'Not received before'].map(x => <option key={x}>{x}</option>)}</select></div>
      <div className="btn-row" style={{ margin: '12px 0' }}><button className="btn btn-primary btn-sm" onClick={() => showToast('Add customer form (demo)')}>Add customer</button><button className="btn btn-ghost btn-sm" onClick={() => showToast('Shopify customers synced')}>Sync Shopify</button><button className={`btn btn-sm ${consent ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setConsent(!consent); showToast(consent ? 'Marketing consent disabled' : 'Marketing consent enabled'); }}>{consent ? 'Marketing Consent On' : 'Enable Marketing Consent'}</button><button className="btn btn-ghost btn-sm" onClick={() => showToast('Customers exported (demo)')}>Export customers</button></div>
      <div className="cust-grid">{list.slice(0, 30).map((c, i) => (
        <div className="card cust-card" key={c.phone}><div className="av">{c.name[0]}<span className="num">{i + 1}</span></div>
          <div className="grow"><div className="row-between"><b>{c.name}</b><span className={`chip ${c.risk === 'Regular' ? 'grey' : 'red'}`}>{c.risk}</span></div><div className="muted small">Bosta · {c.orders === 1 ? 'New customer' : `${c.bosta}%`}</div><div className="small">{c.phone}</div><div className="muted small">{ago(c.last)}</div>
            <div className="cust-foot"><div><span className="muted small">Customer value</span><b>{fmtMoney(c.value)}</b></div><div className="muted small">{c.orders} orders · {c.msgs} messages</div><button className="btn btn-ghost btn-sm" onClick={() => go('chats')}>Open chat</button></div></div></div>))}</div>
    </div>
  );
}

/* ---------------- Abandoned carts ---------------- */
export function CartsPage({ lang, showToast }: P) {
  const [auto, setAuto] = useState(true);
  const [tpl, setTpl] = useState('abandoned_checkout_recovery_ar_v3 (ar | APPROVED)');
  const [v1, setV1] = useState('Abandoned customer name'); const [v2, setV2] = useState('Abandoned product name');
  const vars = ['Manual value', 'Abandoned customer name', 'Abandoned product name', 'Abandoned cart ID (checkout CTA)', 'Abandoned cart total', 'Abandoned currency', 'Abandoned checkout link', 'CRM customer name', 'CRM customer phone', 'Recipient phone', 'CRM customer ID'];
  const rows = ORDERS.filter(o => o.source !== 'Shopify').slice(0, 10);
  return (
    <div>
      <Head eyebrow="" title="Abandoned Checkouts" sub="Auto-send follows up on checkout drop-offs after the safe delay, skips completed orders, and keeps recovery tracking visible." right={<button className="btn btn-ghost btn-sm" onClick={() => showToast('Refreshed')}>Refresh</button>} />
      <div className="two-col-flex">
        <div className="card card-pad grow">
          <p className="eyebrow">ABANDONED RECOVERY</p><h3 className="h3">Template, variables, preview</h3><p className="muted small">Choose the approved Meta template, map its variables, and save.</p>
          <label className="switch-row"><input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)} /> Auto-send {auto ? 'enabled' : 'disabled'}</label>
          <label className="lbl">Meta template</label><select className="inp" value={tpl} onChange={e => setTpl(e.target.value)}>{['abandoned_checkout_recovery_ar_v3 (ar | APPROVED)', 'abandoned_checkout_recovery_en_v3 (en_US | APPROVED)', 'moon_abandoned_discount_ar (ar | APPROVED)'].map(x => <option key={x}>{x}</option>)}</select>
          <label className="lbl">Template variables · 2 variables</label>
          <div className="var-row"><code>{'{{1}}'}</code><select className="inp" value={v1} onChange={e => setV1(e.target.value)}>{vars.map(x => <option key={x}>{x}</option>)}</select></div>
          <div className="var-row"><code>{'{{2}}'}</code><select className="inp" value={v2} onChange={e => setV2(e.target.value)}>{vars.map(x => <option key={x}>{x}</option>)}</select></div>
          <div className="btn-row" style={{ marginTop: 12 }}><button className="btn btn-primary" onClick={() => showToast('Setup saved')}>Save setup</button><button className="btn btn-ghost" onClick={() => { setAuto(false); showToast('Auto-send disabled'); }}>Disable auto-send</button></div>
        </div>
        <div className="card card-pad preview-card"><h3 className="h3">Live preview</h3><p className="muted small">This is the message shape after variables are filled.</p>
          <div className="wa-bubble"><div className="wa-img">🖼️ Customer's first abandoned product image</div><b>🛍️ Your cart is still waiting</b><p>Winter jacket is still in your cart 🤍<br />Use discount code DEMO10 and finish your order before stock runs out.</p><div className="wa-btn">Complete order</div><div className="wa-btn">Copy offer code</div></div></div>
      </div>
      <div className="kpi-grid kpi-4" style={{ marginTop: 16 }}>{[['UNRECOVERED', '3,528', 'complete checkout history'], ['RECOVERED', '851', 'after becoming abandoned'], ['UNRECOVERED VALUE', '2,248,076.54 EGP', ''], ['READY NOW', '4', 'inside the recovery window'], ['MESSAGES SENT', '1,206', '']].map(([k, v, s]) => <div className="card kpi" key={k}><div className="eyebrow">{k}</div><div className="kpi-v">{v}</div><div className="muted small">{s}</div></div>)}</div>
      <div className="card" style={{ marginTop: 16 }}><div className="table-wrap"><table className="data"><thead><tr><th>Customer</th><th>Phone</th><th>Cart total</th><th>Status</th><th /></tr></thead><tbody>{rows.map((o, i) => <tr key={o.id}><td>{o.name}</td><td className="mono">{o.phone}</td><td>{fmtMoney(o.subtotal)}</td><td><span className={`chip ${i % 3 === 0 ? 'green' : i % 3 === 1 ? 'blue' : 'gold'}`}>{i % 3 === 0 ? 'Recovered' : i % 3 === 1 ? 'Message sent' : 'Ready now'}</span></td><td><button className="btn btn-ghost btn-sm" onClick={() => showToast('Recovery message sent')}>Send now</button></td></tr>)}</tbody></table></div></div>
    </div>
  );
}

/* ---------------- Marketing ---------------- */
export function MarketingPage({ lang, showToast, go }: P) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(''); const [tpl, setTpl] = useState('');
  const [aud, setAud] = useState('CRM customers'); const [picked, setPicked] = useState<string[]>([]);
  const steps = ['Template', 'Audience', 'Personalize', 'Review & send'];
  const elig = ORDERS.slice(0, 12);
  return (
    <div>
      <div className="card card-pad tint-green"><b>Free Marketing workspace</b><p className="muted small" style={{ margin: '4px 0 0' }}>No 4PIXELS monthly plan. WhatsApp campaigns are included, and you pay only when buying prepaid SMS credits. Any Meta messaging fees are billed separately to your own WhatsApp Business account.</p></div>
      <div className="card card-pad" style={{ marginTop: 14 }}><div className="row-between wrap"><div><span className="chip blue">SMS</span><h3 className="h3">Prepaid SMS campaigns</h3><p className="muted small" style={{ margin: 0 }}>Send customer updates by SMS with balance checks, recharge visibility, test send, and live preview.</p></div><button className="btn btn-primary" onClick={() => go('sms')}>Open SMS</button></div></div>
      <Head eyebrow="CAMPAIGN STUDIO" title="WhatsApp Campaigns" sub="Choose a template, build the audience, personalize the data, and review every send from one workspace." right={<button className="btn btn-ghost btn-sm" onClick={() => showToast('Refreshed')}>Refresh</button>} />
      <div className="kpi-grid kpi-4">{[['META LIMIT', '∞'], ['META USED 24H', '0'], ['META REMAINING', '∞'], ['CONSENTED', String(picked.length ? picked.length : 0)], ['CAMPAIGN AUDIENCE', String(picked.length)]].map(([k, v]) => <div className="card kpi" key={k}><div className="eyebrow">{k}</div><div className="kpi-v">{v}</div></div>)}</div>
      <div className="stepper wide">{steps.map((s, i) => <button key={s} className={`st${step === i + 1 ? ' cur' : step > i + 1 ? ' done' : ''}`} onClick={() => setStep(i + 1)}><span>{step > i + 1 ? '✓' : i + 1}</span>{s}</button>)}</div>
      <div className="card card-pad">
        {step === 1 && <><label className="lbl">Campaign name</label><input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Winter sale" /><label className="lbl">Approved Meta template</label><select className="inp" value={tpl} onChange={e => setTpl(e.target.value)}><option value="">Choose an approved Meta template</option>{['special_client20 (en)', 'smart_offer_product_card_ar_v2 (ar)', 'conversation_reopen_ar_default (ar)'].map(x => <option key={x}>{x}</option>)}</select>{!tpl && <p className="muted small">Choose a template to show only the settings it needs.</p>}</>}
        {step === 2 && <><div className="seg">{['CRM customers', 'Excel / CSV'].map(a => <button key={a} className={aud === a ? 'on' : ''} onClick={() => setAud(a)}>{a}</button>)}</div>{aud === 'CRM customers' ? <><div className="row-between" style={{ marginTop: 12 }}><b>Eligible customers ({elig.length})</b><button className="btn btn-ghost btn-sm" onClick={() => setPicked(elig.map(o => o.phone))}>Select all</button></div><div className="pick-list">{elig.map(o => <label key={o.id} className="pick"><input type="checkbox" checked={picked.includes(o.phone)} onChange={e => setPicked(e.target.checked ? [...picked, o.phone] : picked.filter(x => x !== o.phone))} />{o.name} <span className="muted small">{o.phone}</span></label>)}</div></> : <div className="drop">Drop an Excel / CSV file here (columns: phone, name)</div>}</>}
        {step === 3 && <p className="muted">Map each template variable to customer data (name, last order, discount code).</p>}
        {step === 4 && <p>Ready to send <b>{name || 'Untitled campaign'}</b> to <b>{picked.length}</b> customers.</p>}
        <div className="btn-row" style={{ marginTop: 14 }}>{step > 1 && <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}{step < 4 ? <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next</button> : <button className="btn btn-primary" disabled={!picked.length} onClick={() => showToast(`Start campaign (${picked.length}) queued`)}>Start campaign ({picked.length})</button>}</div>
      </div>
      <div className="card card-pad" style={{ marginTop: 14 }}><h3 className="h3">Recent campaigns</h3><p className="muted small">Track queue, delivery, reads, and failures from the same workspace.</p><p className="muted">No campaigns yet.</p></div>
    </div>
  );
}

/* ---------------- SMS ---------------- */
export function SmsPage({ lang, showToast }: P) {
  const [msg, setMsg] = useState('Hello {customerName}, your order {orderNumber} from {storeName} is on its way.');
  const [type, setType] = useState('Uploaded Excel / CSV numbers');
  const [balance, setBalance] = useState(0);
  const [pack, setPack] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState(false);
  const recipients = type.includes('Uploaded') ? (file ? 120 : 0) : type.includes('Manual') ? 5 : type.includes('All') ? 312 : 74;
  const isAr = /[\u0600-\u06FF]/.test(msg);
  const per = isAr ? 140 : 280;
  const parts = Math.max(1, Math.ceil(msg.length / per));
  const cost = recipients * parts * 1.5;
  const packs: [number, number][] = [[500, 750], [1000, 1500], [2500, 3750], [5000, 7500]];
  return (
    <div>
      <Head eyebrow="SMS" title="Create & manage SMS campaigns" sub="Send promotional offers, new arrivals, order updates and more. Reach your customers instantly with a clean prepaid wallet flow." />
      <div className="card card-pad tint-blue"><b>Gateway connected · 4PIXELS master SMS account</b><p className="muted small" style={{ margin: '4px 0 0' }}>Sender awaiting provider approval: DEMOSTORE. Sending is blocked until the sender name is approved. 4PIXELS will not switch the sender name automatically.</p></div>
      <div className="kpi-grid kpi-4" style={{ marginTop: 14 }}>{[['SMS Wallet', String(balance), 'Credits available'], ['Recipients Now', String(recipients), 'Deduped by phone'], ['SMS Parts Needed', String(recipients * parts), `${parts} max per customer`], ['Estimated Cost', cost.toFixed(2) + ' EGP', '1.50 EGP per part']].map(([k, v, s]) => <div className="card kpi" key={k}><div className="small k-t">{k}</div><div className="kpi-v">{v}</div><div className="muted small">{s}</div></div>)}</div>
      <div className="card card-pad" style={{ marginTop: 14 }}><div className="row-between"><h3 className="h3">Prepaid SMS Wallet</h3><span className={`chip ${balance > 0 ? 'green' : 'red'}`}>{balance > 0 ? 'Sending unlocked' : 'Sending locked'}</span></div><p className="muted small">Recharge your balance to start sending campaigns. Available: {balance} credits · 1.50 EGP per credit</p>
        <div className="pack-grid">{packs.map(([c, p]) => <button key={c} className={`pack${pack === c ? ' on' : ''}`} onClick={() => setPack(c)}><b>{p.toFixed(2)} EGP</b><span>{c} credits</span></button>)}</div>
        <div className="box" style={{ marginTop: 12 }}><span>Recharge details</span><p className="muted small" style={{ margin: 0 }}>Recharge and upload the InstaPay proof to unlock campaign and test sending.</p><div className="btn-row" style={{ marginTop: 8 }}><button className="btn btn-ghost btn-sm" onClick={() => showToast('Upload InstaPay proof (demo)')}>Upload proof</button><button className="btn btn-primary btn-sm" disabled={!pack} onClick={() => { setBalance(balance + (pack || 0)); showToast(`${pack} credits added (demo)`); }}>Confirm recharge</button></div></div></div>
      <div className="card card-pad" style={{ marginTop: 14 }}>
        <h3 className="h3">Create New Campaign</h3><p className="muted small">Name the campaign, choose the message type, and prepare the audience.</p>
        <div className="two-box"><div><label className="lbl">CAMPAIGN NAME</label><input className="inp" value={name} onChange={e => setName(e.target.value)} /></div><div><label className="lbl">MESSAGE TYPE</label><select className="inp" value={type} onChange={e => setType(e.target.value)}>{['Uploaded Excel / CSV numbers', 'Manual phone numbers', 'All marketing customers', 'Fulfilled orders - last 20 days', 'Confirmed orders - last 20 days'].map(x => <option key={x}>{x}</option>)}</select></div></div>
        {type.includes('Uploaded') && <div className="box"><span>UPLOAD RECIPIENTS</span><div className="drop" onClick={() => setFile(!file)}>{file ? 'recipients.xlsx · 120 valid phones' : 'Upload Excel / CSV numbers (CSV, XLS, XLSX. Columns: phone, mobile, name, orderNumber)'}</div><div className="mini-grid"><div className="mini"><span>VALID PHONES</span><b>{file ? 120 : 0}</b></div><div className="mini"><span>ROWS SCANNED</span><b>{file ? 124 : 0}</b></div></div></div>}
        <label className="lbl">Message content</label><p className="muted small">Variables: {'{customerName}, {orderNumber}, {storeName}, {phoneNumber}'}. Emoji is supported.</p>
        <div className="chip-row">{['{customerName}', '{orderNumber}', '{storeName}'].map(v => <button key={v} className="pill" onClick={() => setMsg(msg + ' ' + v)}>{v}</button>)}</div>
        <textarea className="inp" rows={4} value={msg} onChange={e => setMsg(e.target.value)} />
        <div className="muted small">{isAr ? 'Arabic' : 'English'} · {msg.length} characters · 1 credit covers {per} characters · {parts} credit(s) per recipient</div>
        <div className="box" style={{ marginTop: 10 }}><span>Send a test first</span><p className="muted small" style={{ margin: 0 }}>The test uses the exact cleaned message and sender used by the campaign. {balance < 1 ? 'The test needs 1 SMS credit. Recharge first.' : ''}</p><button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} disabled={balance < 1} onClick={() => { setBalance(balance - 1); showToast('Test SMS sent'); }}>Send test</button></div>
        <div className="btn-row" style={{ marginTop: 12 }}><button className="btn btn-primary" disabled={balance < recipients * parts || recipients === 0} onClick={() => showToast('Campaign sent (demo)')}>Send campaign</button>{balance < recipients * parts && <span className="muted small">Needs {recipients * parts} credits, you have {balance}.</span>}</div>
      </div>
    </div>
  );
}

/* ---------------- Smart Offers ---------------- */
export function OffersPage({ lang, showToast }: P) {
  const [flow, setFlow] = useState<'up' | 'cancel'>('up');
  const [en, setEn] = useState({ up: true, cancel: true });
  const [hrs, setHrs] = useState(3); const [pct, setPct] = useState(10); const [code, setCode] = useState('DEMO10'); const [gap, setGap] = useState(14);
  const [language, setLanguage] = useState('Arabic'); const [choice, setChoice] = useState('Smart');
  const [tpl, setTpl] = useState('Hi {customerName}, thanks for order {orderNumber}! Take {discountPercent}% off {productTitle} with code {discountCode}: {productUrl}');
  const preview = tpl.replace('{customerName}', 'Mariam').replace('{orderNumber}', '#12500').replace('{productTitle}', 'Cotton scarf').replace('{discountPercent}', String(pct)).replace('{discountCode}', code).replace('{productUrl}', 'shop.example.com/p/scarf').replace('{discountPart}', `${pct}% off with ${code}`);
  return (
    <div>
      <Head eyebrow="SMART OFFER" title="Choose a Smart Offer flow" sub="Each flow has its own switch, settings, and save action." />
      <div className="two-box">{([['up', 'Upsell & Cross-sell', 'Post-confirmation offers for complementary or additional products.'], ['cancel', 'Cancellation Recovery', 'Recovery offers only after a real Shopify cancellation.']] as const).map(([k, t, d]) => <button key={k} className={`flow-card${flow === k ? ' on' : ''}`} onClick={() => setFlow(k)}><b>{t}</b><span className="muted small">{d}</span><span className={`chip ${en[k] ? 'green' : 'grey'}`}>{en[k] ? 'Enabled' : 'Disabled'}</span></button>)}</div>
      <div className="card card-pad" style={{ marginTop: 14 }}>
        <p className="eyebrow">SMART OFFERS</p><h3 className="h3">{flow === 'up' ? 'Send a catalog-wide, tracked WhatsApp cross-sell after every confirmed order.' : 'Win back customers after a Shopify cancellation.'}</h3>
<Section title="Results and tracking" sub="Send time, discount, clicks and repeat purchases">        <div className="kpi-grid kpi-4">{[['SEND TIME', `${hrs}h`, 'hours after confirmation'], ['DISCOUNT PERCENT', `${pct}%`, 'Discount code ' + code], ['CUSTOMER GAP', `${gap}d`, 'days before another offer'], ['STATUS', en[flow] ? 'Enabled' : 'Disabled', 'Automation is ready to send offers after confirmation.']].map(([k, v, s]) => <div className="card kpi" key={k}><div className="eyebrow">{k}</div><div className="kpi-v">{v}</div><div className="muted small">{s}</div></div>)}</div>
        <div className="kpi-grid kpi-4" style={{ marginTop: 12 }}>{[['Messages sent', '3,399', '615 QUEUED • 4,294 MATCHED'], ['Link clicks', '1,513', '1,066 CUSTOMERS'], ['Repeat purchases', '48', '47 CUSTOMERS'], ['Click-through rate', '44.5%', '1.4% REPEAT RATE']].map(([k, v, s]) => <div className="card kpi" key={k}><div className="eyebrow">CAMPAIGN TRACKING</div><div className="small">{k}</div><div className="kpi-v">{v}</div><div className="muted small">{s}</div></div>)}</div></Section>
        <p className="muted small">We measure sends, clicks, and repeat purchases from the tracked link. Last send: 11/25/2026, 8:59 AM · 3,884 reached · 1,067 clicked offers · 47 purchased offers</p>
      </div>
      <div className="two-col-flex" style={{ marginTop: 14 }}>
        <div className="card card-pad grow">
          <div className="row-between"><h3 className="h3">Smart Offers</h3><label className="switch-row"><input type="checkbox" checked={en[flow]} onChange={e => setEn({ ...en, [flow]: e.target.checked })} /> {en[flow] ? 'Enabled' : 'Disabled'}</label></div>
          <div className="two-box"><div><label className="lbl">Send time (hours after confirmation)</label><input className="inp" type="number" min={0} value={hrs} onChange={e => setHrs(+e.target.value)} /></div><div><label className="lbl">Discount percent</label><input className="inp" type="number" min={0} max={90} value={pct} onChange={e => setPct(+e.target.value)} /></div></div>
          <div className="two-box"><div><label className="lbl">Discount code</label><input className="inp" value={code} onChange={e => setCode(e.target.value.replace(/[^A-Za-z0-9_-]/g, ''))} /><p className="muted small">Letters, numbers, - or _ only. Do not use % or spaces.</p></div><div><label className="lbl">Customer gap (days)</label><input className="inp" type="number" min={0} value={gap} onChange={e => setGap(+e.target.value)} /></div></div>
          <div className="two-box"><div><label className="lbl">Message language</label><div className="seg">{['Arabic', 'English'].map(l => <button key={l} className={language === l ? 'on' : ''} onClick={() => setLanguage(l)}>{l}</button>)}</div></div><div><label className="lbl">Product choice</label><div className="seg">{['Smart', 'Manual'].map(l => <button key={l} className={choice === l ? 'on' : ''} onClick={() => setChoice(l)}>{l}</button>)}</div></div></div>
          <label className="lbl">Message template</label><p className="muted small">Use {'{customerName}, {orderNumber}, {productTitle}, {productUrl}, {discountPercent}, {discountCode}, or {discountPart}'}.</p>
          <textarea className="inp" rows={4} value={tpl} onChange={e => setTpl(e.target.value)} />
          <div className="btn-row" style={{ marginTop: 12 }}><button className="btn btn-primary" onClick={() => showToast('Settings saved')}>Save settings</button><button className="btn btn-ghost" onClick={() => showToast('Preview refreshed')}>Refresh preview</button></div>
        </div>
        <div className="card card-pad preview-card"><p className="eyebrow">PREVIEW</p><div className="wa-bubble"><p>{preview}</p><div className="wa-btn">Open offer</div></div><span className="chip green">Ready</span></div>
      </div>
    </div>
  );
}

/* ---------------- Retention ---------------- */
export function RetentionPage({ lang, showToast }: P) {
  const [on, setOn] = useState(false);
  const [f, setF] = useState({ last: 60, wait: 30, valid: 7, min: 300, max: 400, reg: 10, s1: 12, s2: 15 });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: +e.target.value });
  return (
    <div>
      <Head eyebrow="GROWTH AUTOMATION" title="Customer Retention" sub="Bring recent buyers back automatically. Every week, eligible customers receive a private one-time Shopify discount with a polished Meta marketing message." right={<div className="btn-row"><span className={`chip ${on ? 'green' : 'grey'}`}>{on ? 'Automation active' : 'Automation paused'}</span><span className="muted small">Next run: {on ? 'Mon 10:00' : '—'}</span><button className="btn btn-primary btn-sm" onClick={() => showToast('Run started (demo)')}>Run now</button></div>} />
<Section title="Results" sub="Offers issued, messages sent, conversions">      <div className="kpi-grid kpi-4">{[['ACTIVE OFFERS', '0'], ['ISSUED', '83'], ['MESSAGES SENT', '0'], ['CLICKED', '0'], ['CONVERTED', '0'], ['FAILED', '83'], ['RECOVERED REVENUE', '0 EGP']].map(([k, v]) => <div className="card kpi" key={k}><div className="eyebrow">{k}</div><div className="kpi-v">{v}</div></div>)}</div></Section>
      <p className="muted small">Orders placed after a retention message are matched back to the customer automatically.</p>
      <div className="card card-pad" style={{ marginTop: 14 }}><p className="eyebrow">AUTOMATION RULES</p><div className="row-between"><h3 className="h3">Who should receive the weekly offer?</h3><label className="switch-row"><input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} />Enabled</label></div><p className="muted small">No customer picking. The CRM builds the audience automatically from recent orders. Up to 400 customers can be contacted in each weekly run.</p>
        <div className="grid-3">{([['LAST ORDER WITHIN (days)', 'last'], ['WAIT AT LEAST (days)', 'wait'], ['OFFER VALIDITY (days)', 'valid'], ['MINIMUM LAST ORDER (EGP)', 'min'], ['MAX CUSTOMERS / RUN', 'max']] as const).map(([l, k]) => <div key={k}><label className="lbl">{l}</label><input className="inp" type="number" value={f[k]} onChange={set(k)} /></div>)}</div></div>
      <div className="card card-pad" style={{ marginTop: 14 }}><h3 className="h3">Value-based discount ladder</h3><p className="muted small">The CRM adjusts the offer automatically using customer lifetime spend.</p><div className="grid-3">{([['REGULAR CUSTOMERS %', 'reg'], ['SPEND ≥ 1000 %', 's1'], ['SPEND ≥ 2500 %', 's2']] as const).map(([l, k]) => <div key={k}><label className="lbl">{l}</label><input className="inp" type="number" value={f[k]} onChange={set(k)} /></div>)}</div></div>
      <div className="card card-pad" style={{ marginTop: 14 }}><h3 className="h3">Retention message</h3><p className="muted small">Choose an approved Meta MARKETING template. 4Pixels defaults are submitted automatically.</p><label className="lbl">MESSAGE TEMPLATE</label><select className="inp">{['abandoned_checkout_product_ar_v2 (ar)', 'abandoned_checkout_product_en_v2 (en_US)', 'conversation_reopen_ar_default (ar)'].map(x => <option key={x}>{x}</option>)}</select><div className="btn-row" style={{ marginTop: 12 }}><button className="btn btn-primary" onClick={() => showToast('Retention settings saved')}>Save</button></div></div>
    </div>
  );
}

/* ---------------- Loyalty ---------------- */
export function LoyaltyPage({ lang, showToast }: P) {
  const [sub, setSub] = useState(false);
  return (
    <div>
      <div className="card card-pad loyalty"><span className="chip gold">PAID CRM ADD-ON</span><h1 className="h1" style={{ marginTop: 8 }}>{sub ? 'Loyalty Points · Pending approval' : 'Activate Loyalty Points'}</h1><p className="muted">Order-value points, customer wallets, referrals, Google reviews, UGC requests, QR management, Meta templates and one complete Shopify rewards page.</p>
        <div className="big">500 <small>EGP / month</small></div>
        <button className="btn btn-primary" disabled={sub} onClick={() => { setSub(true); showToast('Payment proof uploaded (demo)'); }}>{sub ? 'Waiting for admin approval' : 'Subscribe and upload payment'}</button>
        <p className="muted small">The add-on is separate from the main CRM subscription and becomes active after admin approval.</p></div>
    </div>
  );
}

/* ---------------- Plan & Billing ---------------- */
export function PlanPage({ lang, showToast }: P) {
  const [period, setPeriod] = useState('Monthly');
  const mult = period === 'Monthly' ? 1 : period.startsWith('6') ? 0.9 : 0.8;
  const months = period === 'Monthly' ? 1 : period.startsWith('6') ? 6 : 12;
  const plans = [['Basic', 1000, '1,200 orders', 'Up to 1,200 orders per month.'], ['Pro', 1300, '2,200 orders', 'Up to 2,200 orders per month.'], ['Premium', 1800, 'Unlimited orders', 'Unlimited access with every workflow unlocked.']] as const;
  const [cur, setCur] = useState('Pro');
  return (
    <div>
      <Head eyebrow="PLAN & BILLING" title={cur} sub={`${period === 'Monthly' ? 'Monthly' : period.startsWith('6') ? '6 Months' : 'Yearly'} | active`} />
      <div className="kpi-grid kpi-4">{[['CURRENT PRICE', `${Math.round((plans.find(p => p[0] === cur)![1]) * mult * months)} EGP`], ['RENEWAL', '3/14/2027'], ['CUSTOMERS', '317 / Unlimited'], ['ORDERS', '343 / Unlimited'], ['MESSAGES', '1856 / Unlimited']].map(([k, v]) => <div className="card kpi" key={k}><div className="eyebrow">{k}</div><div className="kpi-v sm">{v}</div></div>)}</div>
      <div className="card card-pad" style={{ marginTop: 14 }}><div className="row-between wrap"><div><h3 className="h3">Choose your plan</h3><p className="muted small" style={{ margin: 0 }}>Choose the order capacity that fits your store and submit the transfer proof. Six months saves 10%, and yearly billing saves 20%.</p></div><div className="seg">{['Monthly', '6 Months - save 10%', 'Yearly - save 20%'].map(p => <button key={p} className={period === p ? 'on' : ''} onClick={() => setPeriod(p)}>{p}</button>)}</div></div>
        <div className="plan-grid">{plans.map(([n, p, o, d]) => <div key={n} className={`card plan${cur === n ? ' cur' : ''}`}>{cur === n && <span className="chip green">Current</span>}<h3 className="h3">{n}</h3><p className="muted small">{d}</p><div className="big">{Math.round(p * mult)} <small>EGP / MONTHLY</small></div><ul><li>Unlimited customers</li><li>{o} | Unlimited messages</li><li>5 team members</li><li>Every CRM feature is included</li><li>WhatsApp, Shopify, abandoned carts, and marketing tools</li></ul><button className={`btn ${cur === n ? 'btn-ghost' : 'btn-primary'} btn-block`} onClick={() => { setCur(n); showToast(`${n} selected (demo)`); }}>Select {n}</button></div>)}</div></div>
      <div className="card card-pad" style={{ marginTop: 14 }}><h3 className="h3">Transfer details</h3><p className="muted small">Pay first, then upload the transfer proof. The plan duration starts only after the admin approves the payment.</p><div className="box"><span>PAYMENT METHODS</span><b>Vodafone Cash / InstaPay</b></div><button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => showToast('Upload proof (demo)')}>Upload transfer proof</button></div>
    </div>
  );
}

/* ---------------- Settings ---------------- */
export function SettingsPage({ lang, showToast }: P) {
  const tiles: [string, string, string, string][] = [
    ['conn', 'WhatsApp Business', 'Connect number, credits and partner billing', 'whatsapp'], ['conn', 'Shopify Store', 'Connection, webhooks and store sync', 'shopify'], ['conn', 'Meta Connection', 'Callbacks, verification and Embedded Signup', 'auto'],
    ['conn', 'Delivery & Bosta', 'Secure API key, shipment checks and delivery settings', 'delivery'], ['conn', 'InstaPay', 'Payment link and customer instructions', 'profit'],
    ['ops', 'Order Confirmation', 'Provider, template and confirmation flow', 'orders'], ['ops', 'Order Tracking', 'Fulfilled orders, shipping delays, overdue orders and Excel exports', 'delivery'], ['ops', 'Notifications', 'Push registration and linked devices', 'bell'],
    ['ops', 'Reviews', 'Post-delivery review requests', 'loyalty'], ['ops', 'Returns', 'Reasons and return rules', 'back'], ['ops', 'Net Profit', 'Product cost and profit rules', 'profit'],
    ['ws', 'User & Workspace', 'Workspace-level CRM preferences', 'settings'], ['ws', 'Team & Permissions', 'Roles, seats and access control', 'inbox'], ['ws', 'App & Language', 'Language, install and display preferences', 'settings'], ['ws', 'AI Assistant', 'Model, reply policy and escalation', 'auto'],
  ];
  const [open, setOpen] = useState<string | null>(null);
  const grp = [['conn', 'Connections & Billing', 'Accounts, providers and balances.'], ['ops', 'Operations', 'Customer journey and order controls.'], ['ws', 'Workspace', 'People, access and app preferences.']];
  return (
    <div>
      <Head eyebrow="4PIXELS CRM" title="Settings" sub="Connections, billing and workspace controls — organized without the clutter." right={<span className="chip green">Live workspace</span>} />
      <div className="set-cols">{grp.map(([g, t, d]) => <div className="card card-pad" key={g}><h3 className="h3">{t}</h3><p className="muted small">{d}</p>{tiles.filter(x => x[0] === g).map(x => <button key={x[1]} className="tile" onClick={() => setOpen(x[1])}><span className="tile-ic"><I n={x[3]} size={18} /></span><span className="grow"><b>{x[1]}</b><small>{x[2]}</small></span><I n="back" size={12} /></button>)}</div>)}</div>
      {open && <div className="drawer-back" onClick={() => setOpen(null)}><div className="modal" onClick={e => e.stopPropagation()}><h3 className="h3">{open}</h3>
        {open === 'Shopify Store' ? <><div className="field"><label>Store domain</label><input value="demo-store.myshopify.com" readOnly /></div><div className="row-between"><span>Connection</span><span className="chip green">Connected</span></div><div className="row-between"><span>Webhooks</span><span className="chip green">Receiving</span></div><button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => showToast('Store sync started')}>Sync store</button></> : open === 'Delivery & Bosta' ? <><div className="field"><label>Bosta API key</label><input type="password" value="demo-key-hidden" readOnly /></div><div className="row-between"><span>Shipment checks</span><span className="chip green">On</span></div></> : <p className="muted">Demo settings panel for {open}.</p>}
        <div className="btn-row" style={{ marginTop: 14 }}><button className="btn btn-ghost" onClick={() => setOpen(null)}>Close</button><button className="btn btn-primary" onClick={() => { setOpen(null); showToast('Saved'); }}>Save</button></div></div></div>}
    </div>
  );
}
