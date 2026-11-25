// All data here is fake and generated for the demo. No real customers.
export type OStatus = 'Pending' | 'Confirmed' | 'Fulfilled' | 'Return' | 'Partial Return' | 'Customer cancel' | 'Cancelled';
export type OSource = 'Shopify' | 'Recovered abandoned checkout' | 'Abandoned message' | 'Direct / Other';

export interface DOrder {
  id: number; status: OStatus; source: OSource; name: string; phone: string; email: string;
  date: number; subtotal: number; shipping: number; tax: number; discount: number; total: number; profit: number;
  bosta: number; bostaStatus: 'Delivered' | 'In transit' | 'Returned' | 'Unverified'; tracking: string | null;
  payment: string; fulfillment: string; items: { name: string; qty: number; unit: number }[];
  address: string; city: string; tags: string[]; timeline: { t: string; at: number }[]; comments: string[]; unread: number; lastMsg: string;
}

const FIRST = ['Mariam', 'Ahmed', 'Salma', 'Karim', 'Nour', 'Hana', 'Omar', 'Yara', 'Youssef', 'Dina', 'Mazen', 'Laila', 'Hassan', 'Rana', 'Tarek', 'Aya'];
const LAST = ['Adel', 'Samy', 'Nabil', 'Fouad', 'Hassan', 'Tarek', 'Fawzy', 'Naser', 'Khaled', 'Sherif', 'Ehab', 'Raouf'];
const PRODUCTS: [string, number][] = [
  ['Oversized hoodie', 890], ['Cotton scarf - sand', 260], ['Denim jacket', 1300], ['White sneakers', 1250], ['Linen shirt', 540],
  ['Winter shawl', 400], ['Leather belt', 320], ['Printed tote bag', 280], ['Knit cardigan', 760], ['Silk scarf - olive', 290],
];
const CITIES = ['Cairo', 'Giza', 'Alexandria', 'Tanta', 'Mansoura', 'Aswan', 'Hurghada', 'Port Said'];
const STATUS_CYCLE: OStatus[] = ['Fulfilled', 'Fulfilled', 'Fulfilled', 'Confirmed', 'Pending', 'Fulfilled', 'Cancelled', 'Fulfilled', 'Customer cancel', 'Fulfilled', 'Return', 'Fulfilled', 'Pending', 'Partial Return'];
const SOURCES: OSource[] = ['Shopify', 'Recovered abandoned checkout', 'Shopify', 'Abandoned message', 'Direct / Other', 'Shopify'];
const NOW = new Date('2026-11-25T15:00:00').getTime();
const DAY = 86400000;

function rnd(i: number, m: number) { return Math.abs(Math.sin(i * 9301 + m * 49297) * 10000) % 1; }

export const ORDERS: DOrder[] = Array.from({ length: 64 }, (_, i) => {
  const id = 12539 - i;
  const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
  const n = 1 + Math.floor(rnd(i, 1) * 3);
  const items = Array.from({ length: n }, (_, k) => {
    const p = PRODUCTS[Math.floor(rnd(i, 10 + k) * PRODUCTS.length)];
    return { name: p[0], qty: 1 + (rnd(i, 20 + k) > 0.8 ? 1 : 0), unit: p[1] };
  });
  const subtotal = items.reduce((s, x) => s + x.qty * x.unit, 0);
  const shipping = 90;
  const discount = rnd(i, 3) > 0.8 ? Math.round(subtotal * 0.1) : 0;
  const cancelled = status === 'Cancelled' || status === 'Customer cancel';
  const total = cancelled ? 0 : subtotal + shipping - discount;
  const profit = cancelled ? -75 : Math.round((subtotal - discount) * 0.78);
  const name = `${FIRST[Math.floor(rnd(i, 4) * FIRST.length)]} ${LAST[Math.floor(rnd(i, 5) * LAST.length)]}`;
  const date = NOW - i * 0.55 * DAY - Math.floor(rnd(i, 6) * 6) * 3600000;
  const bostaStatus = status === 'Fulfilled' ? (rnd(i, 7) > 0.35 ? 'Delivered' : 'In transit') : status === 'Return' ? 'Returned' : 'Unverified';
  return {
    id, status, source: SOURCES[i % SOURCES.length], name,
    phone: `2010${String(10000000 + Math.floor(rnd(i, 8) * 89999999)).slice(0, 8)}`,
    email: `${name.split(' ')[0].toLowerCase()}${100 + i}@example.com`,
    date, subtotal, shipping, tax: 0, discount, total, profit,
    bosta: [100, 100, 93.3333, 84.8485, 64.7059, 92.8571][i % 6],
    bostaStatus, tracking: bostaStatus === 'Unverified' ? null : `BST${700000 + id}`,
    payment: status === 'Fulfilled' ? 'paid (COD collected)' : 'pending (COD)', fulfillment: status === 'Fulfilled' ? 'fulfilled' : '-',
    items, address: `${10 + (i % 40)} Example St., Block ${1 + (i % 9)}`, city: CITIES[i % CITIES.length],
    tags: bostaStatus === 'Unverified' ? ['bosta_pending'] : ['bosta_synced'],
    timeline: [{ t: 'Order created', at: date }, { t: 'Confirmation sent', at: date + 8000 }, ...(status === 'Confirmed' || status === 'Fulfilled' ? [{ t: 'Customer confirmed', at: date + 900000 }] : [])],
    comments: i % 7 === 0 ? ['Customer asked to deliver after 5 PM.'] : [],
    unread: i % 5 === 0 ? 1 + (i % 3) : 0,
    lastMsg: i % 4 === 0 ? 'Hello, when will my order arrive?' : i % 4 === 1 ? 'Thank you, got it!' : 'Your order is confirmed. Reply YES to confirm shipping details.',
  };
});

export function fmtMoney(n: number) { return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' LE'; }
export function fmtDate(ts: number) { return new Date(ts).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }); }
export const DEMO_NOW = NOW;
export const DAY_MS = DAY;

export interface Range { key: string; from: number; to: number }
export function rangeFor(key: string, custom?: { from: string; to: string }): { from: number; to: number } {
  const d0 = new Date(NOW); d0.setHours(0, 0, 0, 0); const today = d0.getTime();
  switch (key) {
    case 'Today': return { from: today, to: today + DAY };
    case 'Yesterday': return { from: today - DAY, to: today };
    case 'Last 7 days': return { from: today - 6 * DAY, to: today + DAY };
    case 'Last 30 days': return { from: today - 29 * DAY, to: today + DAY };
    case 'This week': return { from: today - d0.getDay() * DAY, to: today + DAY };
    case 'Last week': return { from: today - (d0.getDay() + 7) * DAY, to: today - d0.getDay() * DAY };
    case 'This month': return { from: new Date(2026, 10, 1).getTime(), to: today + DAY };
    case 'Last month': return { from: new Date(2026, 9, 1).getTime(), to: new Date(2026, 10, 1).getTime() };
    case 'Custom range': {
      const f = custom?.from ? new Date(custom.from + 'T00:00:00').getTime() : 0;
      const t = custom?.to ? new Date(custom.to + 'T00:00:00').getTime() + DAY : Infinity;
      return { from: f, to: t };
    }
    default: return { from: 0, to: Infinity };
  }
}
export const RANGE_KEYS = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'This week', 'Last week', 'This month', 'Last month', 'All time', 'Custom range'];
