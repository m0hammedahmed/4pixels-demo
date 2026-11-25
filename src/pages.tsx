import React, { useMemo, useState } from 'react';
import { I } from './App';
import { ORDERS, DOrder, OStatus, fmtMoney, fmtDate, rangeFor, RANGE_KEYS, DEMO_NOW } from './demoData';
import type { Lang } from './i18n';

type P = { lang: Lang; showToast: (m: string, undo?: () => void) => void; go: (p: string) => void };
const tr = (lang: Lang, en: string, ar?: string) => (lang === 'ar' && ar ? ar : en);

function Head({ right }: { eyebrow?: string; title?: string; sub?: string; right?: React.ReactNode }) {
  return right ? <div className="page-head page-bar">{right}</div> : null;
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

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <div className="card section">
      <div className="section-head static"><div><b>{title}</b>{sub && <div className="muted small">{sub}</div>}</div></div>
      <div className="section-body">{children}</div>
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
  const iso = (ms: number) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const [guideDone, setGuideDone] = useState(() => { try { return localStorage.getItem('fp-guide') === '1'; } catch { return false; } });
  const [doneSteps, setDoneSteps] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('fp-steps') || '[]'); } catch { return []; } });
  const markStep = (n: string) => { const d = doneSteps.includes(n) ? doneSteps : [...doneSteps, n]; setDoneSteps(d); try { localStorage.setItem('fp-steps', JSON.stringify(d)); if (d.length >= 4) localStorage.setItem('fp-guide', '1'); } catch { /* ignore */ } };
  const dismiss = () => { try { localStorage.setItem('fp-guide', '1'); } catch { /* ignore */ } setGuideDone(true); };
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
  const stat: [string, number, string][] = [['Pending', cnt(o => o.status === 'Pending'), 'gold'], ['Confirmed', cnt(o => o.status === 'Confirmed'), 'green'], ['Fulfilled', cnt(o => o.status === 'Fulfilled'), 'blue'], ['Returned / RTO', cnt(o => o.status === 'Return' || o.status === 'Partial Return'), 'orange'], ['Customer cancel request', cnt(o => o.status === 'Customer cancel'), 'purple'], ['Cancelled on Shopify', cnt(o => o.status === 'Cancelled'), 'red']];
  const days = Array.from({ length: 14 }, (_, i) => { const from = r.to - (14 - i) * 86400000; return { d: new Date(from), n: ORDERS.filter(o => o.date >= from && o.date < from + 86400000).length }; });
  const maxN = Math.max(1, ...days.map(d => d.n));
  const recent = [...scoped].sort((a, b) => b.date - a.date).slice(0, 5);
  const top = products.slice(0, 5); const topMax = Math.max(1, ...top.map(p => mode === 'revenue' ? p.value : p.qty));
  const steps: [string, string, string, string][] = [['1', 'Connect Shopify', 'Link your store so orders flow in', 'settings'], ['2', 'Connect WhatsApp', 'Pair the number customers will hear from', 'settings'], ['3', 'Set up messages', 'Approve confirmation and follow-up templates', 'templates'], ['4', 'Turn on Smart Offers', 'Start tracked upsell after each order', 'automations']];
  return (
    <div className="dash">
      <div className="card card-pad dash-bar">
        <div className="chips">{['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'This month', 'Last month'].map(k => <button key={k} className={`pill${range === k ? ' on' : ''}`} onClick={() => setRange(k)}>{k}</button>)}</div>
        <div className="dash-dates"><label>From<input className="inp" type="date" value={iso(r.from)} onChange={e => { setCustom({ from: e.target.value, to: iso(r.to - 86400000) }); setRange('Custom range'); }} /></label><label>To<input className="inp" type="date" value={iso(Math.min(r.to - 86400000, DEMO_NOW))} onChange={e => { setCustom({ from: iso(r.from), to: e.target.value }); setRange('Custom range'); }} /></label></div>
        <button className="btn btn-ghost" onClick={() => showToast('Dashboard report exported (demo, no real file)')}>Export</button>
        <label className="dash-status">Status<select className="inp" value={scope} onChange={e => setScope(e.target.value)}>{['All statuses', 'Pending', 'Confirmed', 'Confirmed & Fulfilled', 'Returned / RTO', 'Customer cancel', 'Cancelled'].map(x => <option key={x}>{x}</option>)}</select></label>
      </div>
      {!guideDone && <div className="card guide">
        <div className="row-between"><div style={{ flex: 1 }}><h3 className="h3">Welcome! Get started in 4 steps</h3><p className="muted small" style={{ margin: '2px 0 0' }}>Tap a step to jump straight in. {doneSteps.length} of 4 done.</p><div className="gbar"><i style={{ width: `${doneSteps.length * 25}%` }} /></div></div><button className="btn btn-ghost btn-sm" onClick={dismiss}>Skip, I know my way</button></div>
        <div className="guide-steps">{steps.map(([n, t, d, k]) => <button key={n} className={`guide-step${doneSteps.includes(n) ? ' done' : ''}`} onClick={() => { markStep(n); go(k); }}><span className="gs-n">{doneSteps.includes(n) ? '✓' : n}</span><span className="gs-t"><b>{t}</b><small>{d}</small></span><span className="gs-go">›</span></button>)}</div>
      </div>}
      <div className="kpi-grid kpi-4" style={{ marginTop: 20 }}>
        <div className="card kpi"><div className="small k-t">Total Orders</div><div className="kpi-v">{list.length}</div><div className="small muted">{range}</div></div>
        <div className="card kpi k-blue"><div className="small k-t">Confirmed &amp; Fulfilled</div><div className="kpi-v">{cnt(o => o.status === 'Confirmed' || o.status === 'Fulfilled')}</div><div className="small muted">Moving forward</div></div>
        <div className="card kpi dark"><div className="small">All order value</div><div className="kpi-v">{fmtMoney(sum(() => true))}</div><div className="small op">Every status</div></div>
        <div className="card kpi blue"><div className="small">Requested Revenue</div><div className="kpi-v">{fmtMoney(sum(o => o.status === 'Pending' || o.status === 'Confirmed'))}</div><div className="small op">Pending and confirmed</div></div>
      </div>
      <div className="dash-cols">
        <div className="card card-pad"><h3 className="h3">Orders per day</h3><p className="muted small" style={{ margin: '2px 0 14px' }}>Last 14 days of the range</p>
          <div className="daybars">{days.map((d, i) => <div key={i} className="daybar"><i style={{ height: `${(d.n / maxN) * 100}%` }} /><span>{d.d.getDate()}</span></div>)}</div></div>
        <div className="card card-pad"><h3 className="h3">By status</h3><div className="brk" style={{ marginTop: 12 }}>
          {stat.map(([k, v, c]) => <div className="brk-row" key={k}><span className={`dot d-${c}`} /><span className="grow">{k}</span><b>{v}</b></div>)}</div></div>
      </div>
      <div className="dash-cols">
        <div className="card card-pad"><div className="row-between"><h3 className="h3">Top products</h3><div className="seg"><button className={mode === 'revenue' ? 'on' : ''} onClick={() => setMode('revenue')}>Revenue</button><button className={mode === 'quantity' ? 'on' : ''} onClick={() => setMode('quantity')}>Quantity</button></div></div>
          <div className="mini-list">{top.map(p => <div key={p.name} className="top-row"><div className="row-between"><span>{p.name}</span><b>{mode === 'revenue' ? fmtMoney(p.value) : p.qty}</b></div><div className="bar"><i className="d-blue" style={{ width: `${((mode === 'revenue' ? p.value : p.qty) / topMax) * 100}%` }} /></div></div>)}</div></div>
      </div>
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
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card kpi k-blue"><div className="small k-t">Net sales <button className="info-dot" title="Product value from fulfilled orders after discounts and returns. Excludes shipping, taxes and cancellations." onClick={() => setInfo(!info)}>i</button></div><div className="kpi-v">{fmtMoney(net)}</div><div className="small muted">{ful.length} fulfilled orders</div></div>
        <div className="card kpi"><div className="small k-t">Net profit <button className="info-dot" title="Net sales minus product cost and shipping. Ads and operating expenses are not deducted." onClick={() => setInfo(!info)}>i</button></div><div className="kpi-v green-t">{fmtMoney(prof)}</div><div className="small muted">After product cost and shipping</div></div>
        <div className="card kpi"><div className="small k-t">Orders in view</div><div className="kpi-v">{list.length}</div><div className="small muted">Matching your filters</div></div>
      </div>
      {info && <p className="muted small" style={{ margin: '-4px 4px 14px' }}>Net sales: product value from fulfilled orders after Shopify discounts and returns, excluding shipping, taxes and cancellations. Net profit: net sales minus product cost and recorded shipping. Ads and operating expenses are not deducted.</p>}
      <div className="tool-row">
        <input className="inp grow" placeholder="Search by order # or phone" value={q} onChange={e => setQ(e.target.value)} />
        <button className={`btn btn-ghost${filt ? ' on' : ''}`} onClick={() => setFilt(!filt)}>Filters</button>
      </div>
      {filt && (
        <div className="toolbar">
          <RangePicker lang={lang} range={range} setRange={setRange} custom={custom} setCustom={setCustom} />
          <div className="range-box"><label className="lbl">Search in</label><select className="inp" value={field} onChange={e => setField(e.target.value)}><option>Order #</option><option>Phone</option><option>All fields</option></select></div>
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
          <button className="btn btn-ghost btn-sm" onClick={() => showToast('Exported orders to Excel (demo, no real file)')}>Export</button>
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
                  <div className="d-sec"><h4>Activity log</h4>{o.timeline.slice().reverse().map((t, ix) => <div className="tl" key={t.t}><i />{t.t}<small>{['System', 'Mona', 'System', 'Kareem'][ix % 4]} · {fmtDate(t.at)}</small></div>)}</div>
                  <div className="d-sec"><h4>Tags</h4><div className="chip-row">{o.tags.map(t => <span className="chip grey" key={t}>{t}</span>)}</div></div>
                  <div className="d-sec"><h4>Order comments</h4>
                    {cm.length === 0 && <div className="muted small">No comments yet.</div>}{cm.map((c, i) => <div className="comment" key={i}>{c}</div>)}
                    <div className="tool-row"><input className="inp grow" placeholder="Write an internal comment" value={draft} onChange={e => setDraft(e.target.value)} /><button className="btn btn-primary btn-sm" onClick={() => { if (draft.trim()) { const prev = comments; setComments({ ...comments, [o.id]: [...(comments[o.id] || []), draft.trim()] }); setDraft(''); showToast('Comment added', () => setComments(prev)); } }}>Add Comment</button></div>
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
            <div className="btn-row" style={{ marginTop: 12 }}><button className="btn btn-ghost" onClick={() => setRetFor(null)}>Cancel</button><button className="btn btn-primary" onClick={() => { setRetFor(null); showToast('Return reason saved', () => showToast('Change undone')); }}>Save</button></div>
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
  const [noteMode, setNoteMode] = useState(false);
  const [notes, setNotes] = useState<Record<number, string[]>>({});
  const [assignee, setAssignee] = useState<Record<number, string>>({});
  const chats = ORDERS.slice(0, 24);
  const unread = (o: DOrder) => (read.includes(o.id) ? 0 : o.unread);
  let list = chats.filter(o => (chan === 'All' || chan === 'WhatsApp') && (`${o.name} ${o.phone} ${o.lastMsg} ${o.id}`.toLowerCase().includes(q.toLowerCase())));
  if (filter === 'Unread') list = list.filter(o => unread(o) > 0);
  if (filter === 'Unreplied') list = list.filter(o => o.id % 4 === 0);
  if (filter === 'Follow-up') list = list.filter(o => o.id % 9 === 0);
  const cur = chats.find(o => o.id === sel) || null;
  const send = () => { if (cur && draft.trim() && noteMode) { setNotes({ ...notes, [cur.id]: [...(notes[cur.id] || []), draft.trim()] }); setDraft(''); } else if (cur && draft.trim()) { setSent({ ...sent, [cur.id]: [...(sent[cur.id] || []), draft.trim()] }); setDraft(''); } };
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
                  <div className="muted small clamp1">{(sent[o.id] || []).length ? 'You: ' + sent[o.id][sent[o.id].length - 1] : o.lastMsg}</div>
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
                <select className="inp assign" value={assignee[cur.id] || 'Unassigned'} onChange={e => { setAssignee({ ...assignee, [cur.id]: e.target.value }); showToast(`Assigned to ${e.target.value}`); }}>{['Unassigned', 'Mona', 'Kareem', 'Mohammed'].map(x => <option key={x}>{x}</option>)}</select>
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
                {(notes[cur.id] || []).map((m, i) => <div className="bubble note" key={'n' + i}><b>Internal note</b> {m}<small>only your team sees this</small></div>)}
              </div>
              <div className="composer"><div className="seg mode"><button className={!noteMode ? 'on' : ''} onClick={() => setNoteMode(false)}>Reply</button><button className={noteMode ? 'on' : ''} onClick={() => setNoteMode(true)}>Note</button></div><input className="inp grow" placeholder={noteMode ? 'Write an internal note (customer cannot see it)' : 'Type a message'} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />{!noteMode && <button className="btn btn-ghost btn-sm" onClick={() => showToast('Template picker (demo)')}>Template</button>}<button className="btn btn-primary send-btn" onClick={send}><I n="send" size={16} /></button></div>
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
        right={<div className="btn-row"><button className="btn btn-ghost btn-sm" onClick={() => showToast('Report refreshed')}>Refresh Report</button><button className="btn btn-primary btn-sm" onClick={() => showToast('Excel exported (demo, no real file)')}>Export Excel</button></div>} />
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
      <div className="btn-row" style={{ margin: '12px 0' }}><button className="btn btn-primary btn-sm" onClick={() => showToast('Add customer form (demo)')}>Add customer</button><button className="btn btn-ghost btn-sm" onClick={() => showToast('Shopify customers synced')}>Sync Shopify</button><button className={`btn btn-sm ${consent ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setConsent(!consent); showToast(consent ? 'Marketing consent disabled' : 'Marketing consent enabled'); }}>{consent ? 'Marketing Consent On' : 'Enable Marketing Consent'}</button><button className="btn btn-ghost btn-sm" onClick={() => showToast('Customers exported (demo, no real file)')}>Export customers</button></div>
      <div className="cust-grid">{list.slice(0, 30).map((c, i) => (
        <div className="card cust-card" key={c.phone}><div className="av">{c.name[0]}<span className="num">{i + 1}</span></div>
          <div className="grow"><div className="row-between"><b>{c.name}</b><span className={`chip ${c.risk === 'Regular' ? 'grey' : 'red'}`}>{c.risk}</span></div><div className="muted small"><span className={`chip ${c.msgs % 7 === 0 ? 'grey' : 'green'}`} style={{ marginInlineEnd: 6 }}>{c.msgs % 7 === 0 ? 'Opted out' : 'Opted in'}</span>Bosta · {c.orders === 1 ? 'New customer' : `${c.bosta}%`}</div><div className="small">{c.phone}</div><div className="muted small">{ago(c.last)}</div>
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
      <div className="page-bar"><button className="btn btn-ghost btn-sm" onClick={() => showToast('Abandoned carts exported (demo, no real file)')}>Export</button></div>
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
      <div className="page-bar"><button className="btn btn-ghost btn-sm" onClick={() => showToast('SMS report exported (demo, no real file)')}>Export</button></div>
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
      <div className="page-bar"><button className="btn btn-ghost btn-sm" onClick={() => showToast('Smart Offers report exported (demo, no real file)')}>Export</button></div>
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
      <div className="page-bar"><button className="btn btn-ghost btn-sm" onClick={() => showToast('Retention report exported (demo, no real file)')}>Export</button></div>
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
      <div className="card card-pad usage" style={{ marginTop: 14 }}><div className="row-between"><h3 className="h3">Usage this month</h3><span className="muted small">Resets 14 Dec</span></div>{[['Orders', 343, 2200], ['Messages', 1856, 5000], ['Team seats', 3, 5]].map(([k, v, m]) => <div className="meter" key={String(k)}><div className="row-between small"><span>{k}</span><b>{Number(v).toLocaleString()} / {Number(m).toLocaleString()}</b></div><div className="mtrack"><i style={{ width: `${Math.min(100, Math.round(Number(v) / Number(m) * 100))}%` }} /></div></div>)}<p className="muted small" style={{ margin: '8px 0 0' }}>You are well within your Pro limits. We only suggest an upgrade when you pass 80%.</p></div>
      <div className="card card-pad" style={{ marginTop: 14 }}><div className="row-between wrap"><div><h3 className="h3">Choose your plan</h3><p className="muted small" style={{ margin: 0 }}>Choose the order capacity that fits your store and submit the transfer proof. Six months saves 10%, and yearly billing saves 20%.</p></div><div className="seg">{['Monthly', '6 Months - save 10%', 'Yearly - save 20%'].map(p => <button key={p} className={period === p ? 'on' : ''} onClick={() => setPeriod(p)}>{p}</button>)}</div></div>
        <div className="plan-grid">{plans.map(([n, p, o, d]) => <div key={n} className={`card plan${cur === n ? ' cur' : ''}`}>{cur === n && <span className="chip green">Current</span>}<h3 className="h3">{n}</h3><p className="muted small">{d}</p><div className="big">{Math.round(p * mult)} <small>EGP / MONTHLY</small></div><ul><li>Unlimited customers</li><li>{o} | Unlimited messages</li><li>5 team members</li><li>Every CRM feature is included</li><li>WhatsApp, Shopify, abandoned carts, and marketing tools</li></ul><button className={`btn ${cur === n ? 'btn-ghost' : 'btn-primary'} btn-block`} onClick={() => { setCur(n); showToast(`${n} selected (demo)`); }}>Select {n}</button></div>)}</div></div>
      <div className="card card-pad" style={{ marginTop: 14 }}><h3 className="h3">Transfer details</h3><p className="muted small">Pay first, then upload the transfer proof. The plan duration starts only after the admin approves the payment.</p><div className="box"><span>PAYMENT METHODS</span><b>Vodafone Cash / InstaPay</b></div><button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => showToast('Upload proof (demo)')}>Upload transfer proof</button></div>
    </div>
  );
}

/* ---------------- Settings ---------------- */
export function SettingsPage({ lang, showToast }: P) {
  const tiles: [string, string, string, string][] = [
    ['conn', 'WhatsApp Business', 'Number quality, templates and send limit', 'whatsapp'], ['conn', 'Shopify Store', 'Connection, webhooks and store sync', 'shopify'], ['conn', 'Meta Connection', 'Callbacks, verification and Embedded Signup', 'auto'],
    ['conn', 'Delivery & Bosta', 'Secure API key, shipment checks and delivery settings', 'delivery'], ['conn', 'InstaPay', 'Payment link and customer instructions', 'profit'],
    ['ops', 'Order Confirmation', 'Provider, template and confirmation flow', 'orders'], ['ops', 'Order Tracking', 'Fulfilled orders, shipping delays, overdue orders and Excel exports', 'delivery'], ['ops', 'Notifications', 'What alerts you get and the daily summary', 'bell'],
    ['ops', 'Reviews', 'Post-delivery review requests', 'loyalty'], ['ops', 'Returns', 'Reasons and return rules', 'back'], ['ops', 'Net Profit', 'Product cost and profit rules', 'profit'], ['ops', 'Consent & Quiet Hours', 'Opt-outs, STOP replies and no-send hours', 'back'],
    ['ws', 'User & Workspace', 'Workspace-level CRM preferences', 'settings'], ['ws', 'Team & Permissions', 'Invite agents, roles and seats', 'inbox'], ['ws', 'App & Language', 'Language, install and display preferences', 'settings'], ['ws', 'AI Assistant', 'Model, reply policy and escalation', 'auto'],
  ];
  const [open, setOpen] = useState<string | null>(null);
  const grp = [['conn', 'Connections & Billing', 'Accounts, providers and balances.'], ['ops', 'Operations', 'Customer journey and order controls.'], ['ws', 'Workspace', 'People, access and app preferences.']];
  return (
    <div>
      <Head eyebrow="4PIXELS CRM" title="Settings" sub="Connections, billing and workspace controls — organized without the clutter." right={<span className="chip green">Live workspace</span>} />
      <div className="set-cols">{grp.map(([g, t, d]) => <div className="card card-pad" key={g}><h3 className="h3">{t}</h3><p className="muted small">{d}</p>{tiles.filter(x => x[0] === g).map(x => <button key={x[1]} className="tile" onClick={() => setOpen(x[1])}><span className="tile-ic"><I n={x[3]} size={18} /></span><span className="grow"><b>{x[1]}</b><small>{x[2]}</small></span><I n="back" size={12} /></button>)}</div>)}</div>
      {open && <div className="drawer-back" onClick={() => setOpen(null)}><div className="modal" onClick={e => e.stopPropagation()}><h3 className="h3">{open}</h3>
        {open === 'Shopify Store' ? <><div className="field"><label>Store domain</label><input value="demo-store.myshopify.com" readOnly /></div><div className="row-between"><span>Connection</span><span className="chip green">Connected</span></div><div className="row-between"><span>Webhooks</span><span className="chip green">Receiving</span></div><button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => showToast('Store sync started')}>Sync store</button></> : open === 'Delivery & Bosta' ? <><div className="field"><label>Bosta API key</label><input type="password" value="demo-key-hidden" readOnly /></div><div className="row-between"><span>Shipment checks</span><span className="chip green">On</span></div></> : <SettingsPanel name={open} />}
        <div className="btn-row" style={{ marginTop: 14 }}><button className="btn btn-ghost" onClick={() => setOpen(null)}>Close</button><button className="btn btn-primary" onClick={() => { setOpen(null); showToast('Saved'); }}>Save</button></div></div></div>}
    </div>
  );
}

function Tog({ label, sub, on: init = true }: { label: string; sub?: string; on?: boolean }) {
  const [on, setOn] = useState(init);
  return <div className="row-between tog-row"><span><b>{label}</b>{sub && <small className="muted">{sub}</small>}</span><button className={`tog${on ? ' on' : ''}`} onClick={() => setOn(!on)} aria-pressed={on}><i /></button></div>;
}
function SettingsPanel({ name }: { name: string }) {
  if (name === 'WhatsApp Business') {
    const tpl: [string, string, string][] = [['Order confirmation', 'Approved', 'green'], ['Shipping update', 'Approved', 'green'], ['Abandoned cart reminder', 'In review', 'gold'], ['Win-back offer', 'Rejected', 'red']];
    return <>
      <div className="row-between"><span>Number</span><b>+20 100 555 0199</b></div>
      <div className="row-between"><span>Connection</span><span className="chip green">Coexistence</span></div>
      <div className="row-between"><span>Quality rating</span><span className="chip green">High</span></div>
      <div className="row-between"><span>Daily limit</span><b>1,000 customers / 24h</b></div>
      <h4 style={{ margin: '14px 0 6px' }}>Templates</h4>
      {tpl.map(([n, st, c]) => <div className="row-between" key={n}><span>{n}</span><span className={`chip ${c}`}>{st}</span></div>)}
      <p className="muted small" style={{ marginTop: 8 }}>Win-back offer was rejected: a variable sits at the start of the message body. Edit it and resubmit.</p>
    </>;
  }
  if (name === 'Notifications') return <>
    <Tog label="New order" sub="Instant alert" /><Tog label="Abandoned cart" sub="When a cart is left for 1 hour" /><Tog label="Unanswered chat" sub="If a customer waits more than 10 minutes" /><Tog label="Daily summary" sub="Orders and sales every morning at 9:00" on={false} />
  </>;
  if (name === 'Team & Permissions') return <>
    {[['Mohammed Ahmed', 'Owner'], ['Mona', 'Agent'], ['Kareem', 'Agent']].map(([n, r]) => <div className="row-between" key={n}><span>{n}</span><select className="inp mini" defaultValue={r} disabled={r === 'Owner'}>{['Owner', 'Admin', 'Agent'].map(x => <option key={x}>{x}</option>)}</select></div>)}
    <p className="muted small">3 of 5 seats used</p>
    <div className="tool-row"><input className="inp grow" placeholder="Invite by email" /><button className="btn btn-primary btn-sm">Invite</button></div>
  </>;
  if (name === 'Consent & Quiet Hours') return <>
    <Tog label="Respect STOP replies" sub="Customers who reply STOP are never messaged again" /><Tog label="Only message opted-in customers" sub="Marketing goes to customers who agreed" />
    <Tog label="Quiet hours" sub="No marketing messages during these hours" />
    <div className="tool-row"><label className="muted small">From</label><input className="inp" type="time" defaultValue="22:00" /><label className="muted small">To</label><input className="inp" type="time" defaultValue="09:00" /></div>
  </>;
  return <p className="muted">Demo settings panel for {name}.</p>;
}

/* ---------------- Products report ---------------- */
const BASES: [string, number][] = [
  ['Classic cotton tee', 249], ['Knit cardigan', 640], ['Denim jacket', 650], ['Oversized hoodie', 519], ['White sneakers', 1250], ['Linen shirt', 420], ['Canvas tote bag', 180], ['Leather belt', 330],
  ['Summer scarf', 210], ['Wool beanie', 150], ['Sport socks (3 pack)', 95], ['Phone case', 120], ['Satin evening gown - One Size (Fits 65-85 kg)', 699], ['Maxi dress - One Size (55-80 kg)', 689],
  ['بوكس الهدية', 2500], ['بوكس الشتاء', 1599], ['فستان سهرة', 899], ['عباية كاجوال', 749], ['طرحة قطن', 130], ['حقيبة يد', 560], ['شنطة ظهر', 430], ['كوب حراري', 220],
];
const VARS = ['Black', 'Beige', 'Navy', 'Sand', 'Grey'], VARS_AR = ['أسود', 'بيج', 'كحلي', 'رملي', 'رمادي'];
const PRODUCTS: [string, number, number, number][] = (() => {
  const out: [string, number, number, number][] = []; let k = 0;
  for (let v = 0; v < 12 && out.length < 103; v++) BASES.forEach(([b, price], i) => {
    if (out.length >= 103 || (v > 0 && (i + v) % 4 === 0)) return;
    const ar = /[\u0600-\u06FF]/.test(b); k++;
    const qty = Math.max(4, Math.round((120 - i * 4 - v * 17) * (1 + ((k * 7) % 5) / 10)));
    out.push([`${b} - ${ar ? VARS_AR[v % 5] : VARS[v % 5]}`, qty, Math.max(2, qty - 1 - (k % 6)), price + (k % 4) * 0]);
  });
  const ar = out.filter(x => /[\u0600-\u06FF]/.test(x[0])), en = out.filter(x => !/[\u0600-\u06FF]/.test(x[0])), mix: typeof out = [];
  en.forEach((x, i) => { if (i % 3 === 0 && ar.length) mix.push(ar.shift()!); mix.push(x); });
  return mix.concat(ar).sort((a, b) => b[1] * b[3] - a[1] * a[3]);
})();
const HUES = Array.from({ length: 103 }, (_, i) => (i * 47 + 200) % 360);
export function ProductsPage({ lang, showToast }: P) {
  const [mode, setMode] = useState<'Single Search' | 'Multi Search'>('Single Search');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('No alphabetical sort');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const terms = mode === 'Multi Search' ? q.split(',').map(x => x.trim().toLowerCase()).filter(Boolean) : q.trim() ? [q.trim().toLowerCase()] : [];
  const nf = from ? parseInt(from, 10) : 0, nt = to ? parseInt(to, 10) : 1e9;
  let list = PRODUCTS.map((x, i) => ({ n: x[0], qty: x[1], ord: x[2], unit: x[3], v: x[1] * x[3], hue: HUES[i], lo: 12400 + (i * 9) % 90, hi: 12539 - (i * 4) % 60 })).filter(x => (!terms.length || terms.some(t => x.n.toLowerCase().includes(t))) && (isNaN(nf) || nf <= x.hi) && (isNaN(nt) || nt >= x.lo));
  if (sort === 'A to Z') list = [...list].sort((a, b) => a.n.localeCompare(b.n));
  if (sort === 'Z to A') list = [...list].sort((a, b) => b.n.localeCompare(a.n));
  const clear = () => { setQ(''); setSort('No alphabetical sort'); setFrom(''); setTo(''); };
  const f = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' LE';
  return (
    <div className="prod-page">
      <div className="prod-top">
        <div className="card prod-search">
          <div className="seg">{(['Single Search', 'Multi Search'] as const).map(m => <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{tr(lang, m, m === 'Single Search' ? 'بحث واحد' : 'بحث متعدد')}</button>)}</div>
          <input className="inp" placeholder={mode === 'Single Search' ? 'Search products by name...' : 'Search several products, separated by commas'} value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <button className="btn btn-primary prod-export" onClick={() => showToast('Exported filtered products (demo, no real file)')}><I n="doc" size={16} />{tr(lang, 'Export filtered', 'تصدير المفلتر')}</button>
      </div>
      <div className="card prod-filters">
        <select className="inp" value={sort} onChange={e => setSort(e.target.value)}>{['No alphabetical sort', 'A to Z', 'Z to A'].map(x => <option key={x}>{x}</option>)}</select>
        <input className="inp" placeholder="Order number from" value={from} onChange={e => setFrom(e.target.value)} />
        <input className="inp" placeholder="Order number to" value={to} onChange={e => setTo(e.target.value)} />
        <button className="btn btn-ghost" onClick={clear}>{tr(lang, 'Clear filters', 'مسح الفلاتر')}</button>
        <button className="btn btn-primary" onClick={() => showToast('Product report ready (demo)')}><I n="doc" size={16} />{tr(lang, 'Product report', 'تقرير المنتجات')}</button>
      </div>
      <div className="kpi-grid prod-kpi">{[['Requested products', String(list.length)], ['Total requested quantity', String(list.reduce((s, x) => s + x.qty, 0))], ['Products value', f(list.reduce((s, x) => s + x.v, 0))]].map(([k, v]) => <div className="card kpi" key={k}><div className="small k-t">{k}</div><div className="kpi-v">{v}</div></div>)}</div>
      <div className="card prod-table">
        <div className="prod-row head"><span>Product</span><span /><span>Quantity</span><span>Orders</span><span>Value</span><span>Unit price</span></div>
        {list.map(x => <div className="prod-row" key={x.n}><b className="pn">{x.n}</b><span className="pimg" style={{ background: `linear-gradient(160deg, hsl(${x.hue} 45% 78%), hsl(${x.hue} 40% 38%))` }}><i /></span><span data-l="Quantity">{x.qty}</span><span data-l="Orders">{x.ord}</span><b data-l="Value">{f(x.v)}</b><span className="muted" data-l="Unit price">{f(x.unit)}</span></div>)}
        {list.length === 0 && <div className="muted" style={{ padding: 20 }}>No products match.</div>}
      </div>
    </div>
  );
}
