export interface Order {
  id: string;
  customer: string;
  phone: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  cost: number;
  shipping: number;
  fees: number;
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  governorate: string;
}

export const ORDERS: Order[] = [
  {
    id: 'PX-4821', customer: 'Mariam Adel', phone: '0100 234 8891',
    items: [{ name: 'Oversized Hoodie - Black', qty: 1, price: 850 }, { name: 'Cargo Pants', qty: 1, price: 1100 }],
    total: 1950, cost: 980, shipping: 65, fees: 39, status: 'new', date: '2026-11-25 11:42', governorate: 'Cairo',
  },
  {
    id: 'PX-4820', customer: 'Ahmed Samy', phone: '0122 781 3405',
    items: [{ name: 'Basic Tee', qty: 2, price: 350 }],
    total: 700, cost: 340, shipping: 55, fees: 14, status: 'new', date: '2026-11-25 10:18', governorate: 'Giza',
  },
  {
    id: 'PX-4819', customer: 'Nour Hassan', phone: '0111 456 9023',
    items: [{ name: 'Winter Jacket', qty: 1, price: 2400 }],
    total: 2400, cost: 1350, shipping: 70, fees: 48, status: 'confirmed', date: '2026-11-24 21:03', governorate: 'Alexandria',
  },
  {
    id: 'PX-4818', customer: 'Karim Fouad', phone: '0106 612 7845',
    items: [{ name: 'Sneakers - White', qty: 1, price: 1750 }],
    total: 1750, cost: 920, shipping: 65, fees: 35, status: 'confirmed', date: '2026-11-24 18:37', governorate: 'Tanta',
  },
  {
    id: 'PX-4817', customer: 'Salma Nabil', phone: '0109 877 1234',
    items: [{ name: 'Denim Jacket', qty: 1, price: 1450 }, { name: 'Cap', qty: 1, price: 250 }],
    total: 1700, cost: 830, shipping: 60, fees: 34, status: 'shipped', date: '2026-11-24 14:12', governorate: 'Mansoura',
  },
  {
    id: 'PX-4816', customer: 'Omar Khaled', phone: '0120 334 5567',
    items: [{ name: 'Tracksuit Set', qty: 1, price: 1650 }],
    total: 1650, cost: 870, shipping: 65, fees: 33, status: 'shipped', date: '2026-11-23 19:55', governorate: 'Cairo',
  },
  {
    id: 'PX-4815', customer: 'Hana Mostafa', phone: '0114 908 2210',
    items: [{ name: 'Summer Dress', qty: 1, price: 980 }],
    total: 980, cost: 470, shipping: 55, fees: 20, status: 'delivered', date: '2026-11-22 13:28', governorate: 'Zagazig',
  },
  {
    id: 'PX-4814', customer: 'Youssef Gamal', phone: '0101 765 4398',
    items: [{ name: 'Polo Shirt', qty: 2, price: 550 }],
    total: 1100, cost: 560, shipping: 55, fees: 22, status: 'delivered', date: '2026-11-21 16:44', governorate: 'Cairo',
  },
  {
    id: 'PX-4813', customer: 'Farida Sherif', phone: '0115 220 8876',
    items: [{ name: 'Handbag', qty: 1, price: 1250 }],
    total: 1250, cost: 640, shipping: 60, fees: 25, status: 'cancelled', date: '2026-11-21 09:15', governorate: 'Ismailia',
  },
];

export interface Conversation {
  id: string;
  name: string;
  channel: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
  last: string;
  time: string;
  unread: number;
  assigned?: string;
  messages: { from: 'customer' | 'me'; text: string; time: string }[];
}

export const CHATS: Conversation[] = [
  {
    id: 'c1', name: 'Mariam Adel', channel: 'whatsapp', last: 'ممكن أغير المقاس؟', time: '11:50', unread: 2,
    messages: [
      { from: 'customer', text: 'السلام عليكم، أنا عاملة أوردر PX-4821', time: '11:42' },
      { from: 'me', text: 'وعليكم السلام يا مريم، أوردرك وصل وتم تأكيده', time: '11:44' },
      { from: 'customer', text: 'ممكن أغير المقاس؟', time: '11:50' },
      { from: 'customer', text: 'الهودي كنت عايزاه L مش M', time: '11:50' },
    ],
  },
  {
    id: 'c2', name: 'karim.fouad', channel: 'instagram', last: 'Is the white sneakers available in 43?', time: '10:31', unread: 1,
    messages: [
      { from: 'customer', text: 'Hi! Is the white sneakers available in 43?', time: '10:31' },
    ],
  },
  {
    id: 'c3', name: 'Ahmed Samy', channel: 'whatsapp', last: 'تمام شكراً', time: '09:12', unread: 0, assigned: 'Mona',
    messages: [
      { from: 'customer', text: 'الأوردر هيوصل إمتى؟', time: '09:05' },
      { from: 'me', text: 'هيطلع مع بوسطة بكرة إن شاء الله وهيوصلك خلال يومين', time: '09:08' },
      { from: 'customer', text: 'تمام شكراً', time: '09:12' },
    ],
  },
  {
    id: 'c4', name: 'nour_hassan', channel: 'tiktok', last: 'سعر الجاكيت كام؟', time: 'أمس', unread: 3,
    messages: [
      { from: 'customer', text: 'سعر الجاكيت كام؟', time: 'أمس 22:14' },
      { from: 'customer', text: '؟؟', time: 'أمس 22:40' },
      { from: 'customer', text: 'حد يرد', time: 'أمس 23:01' },
    ],
  },
  {
    id: 'c5', name: 'Salma Nabil', channel: 'messenger', last: 'وصل الأوردر، شكراً جداً', time: 'أمس', unread: 0,
    messages: [
      { from: 'customer', text: 'وصل الأوردر، شكراً جداً', time: 'أمس 18:22' },
      { from: 'me', text: 'العفو يا سلمى، نورتينا. لو عندك دقيقة يسعدنا تقييمك', time: 'أمس 18:30' },
    ],
  },
];

export interface Automation {
  id: string;
  name: { en: string; ar: string };
  desc: { en: string; ar: string };
  state: 'active' | 'paused' | 'needsTemplate';
  sent30: number;
  recovered30?: number;
  preview: string;
}

export const AUTOMATIONS: Automation[] = [
  {
    id: 'a1',
    name: { en: 'Abandoned cart recovery', ar: 'استرجاع السلات المتروكة' },
    desc: { en: 'WhatsApp reminder 1h and 24h after cart abandonment.', ar: 'تذكير واتساب بعد ساعة وبعد 24 ساعة من ترك السلة.' },
    state: 'active', sent30: 412, recovered30: 38600,
    preview: 'أهلاً {{1}}، نسيت حاجات في سلتك على {{2}}. كمّل طلبك من هنا: {{3}}',
  },
  {
    id: 'a2',
    name: { en: 'Order confirmation', ar: 'تأكيد الأوردر' },
    desc: { en: 'Instant WhatsApp confirmation with order summary.', ar: 'تأكيد فوري على واتساب بملخص الأوردر.' },
    state: 'active', sent30: 1180,
    preview: 'تم استلام أوردرك {{1}} بقيمة {{2}} جنيه. هنأكد معاك تليفونياً قبل الشحن.',
  },
  {
    id: 'a3',
    name: { en: 'Review request', ar: 'طلب التقييم' },
    desc: { en: 'Sent 2 days after delivery.', ar: 'بتتبعت بعد يومين من التسليم.' },
    state: 'needsTemplate', sent30: 0,
    preview: 'أوردرك {{1}} وصل. قيّم تجربتك وخد 50 نقطة هدية: {{2}}',
  },
  {
    id: 'a4',
    name: { en: 'Win-back (60 days)', ar: 'استرجاع العملاء الخاملين' },
    desc: { en: 'Discount code for customers inactive 60 days.', ar: 'كود خصم للعملاء اللي ماشتروش من 60 يوم.' },
    state: 'paused', sent30: 0,
    preview: 'وحشتنا {{1}}! خد خصم 15% على طلبك الجاي بالكود: {{2}}',
  },
];

export interface Template {
  id: string;
  name: string;
  category: string;
  state: 'approved' | 'pending' | 'rejected';
  reason?: string;
}

export const TEMPLATES: Template[] = [
  { id: 't1', name: 'order_confirmation_v3', category: 'Utility', state: 'approved' },
  { id: 't2', name: 'abandoned_cart_v5', category: 'Marketing', state: 'approved' },
  { id: 't3', name: 'shipping_update_v2', category: 'Utility', state: 'approved' },
  { id: 't4', name: 'review_request_v1', category: 'Marketing', state: 'pending' },
  { id: 't5', name: 'winback_discount_v1', category: 'Marketing', state: 'pending' },
  {
    id: 't6', name: 'flash_sale_v1', category: 'Marketing', state: 'rejected',
    reason: 'Meta rejected this template: promotional content must not imply urgency pressure ("last chance"). Edit the wording and resubmit.',
  },
];

export interface Shipment {
  id: string;
  orderId: string;
  customer: string;
  state: 'inTransit' | 'outFor' | 'delivered' | 'failed';
  tracking: string;
  governorate: string;
}

export const SHIPMENTS: Shipment[] = [
  { id: 's1', orderId: 'PX-4817', customer: 'Salma Nabil', state: 'outFor', tracking: 'BST-88213', governorate: 'Mansoura' },
  { id: 's2', orderId: 'PX-4816', customer: 'Omar Khaled', state: 'inTransit', tracking: 'BST-88190', governorate: 'Cairo' },
  { id: 's3', orderId: 'PX-4815', customer: 'Hana Mostafa', state: 'delivered', tracking: 'BST-88102', governorate: 'Zagazig' },
  { id: 's4', orderId: 'PX-4812', customer: 'Mostafa Amin', state: 'failed', tracking: 'BST-88044', governorate: 'Suez' },
];

export const REVENUE_30D = [
  4200, 5100, 3800, 6200, 7400, 5900, 8100, 6800, 7200, 9400,
  8600, 7800, 10200, 9100, 8700, 11500, 10800, 9600, 12100, 11300,
  10400, 12800, 11900, 13200, 12100, 13900, 12600, 14100, 15200, 14800,
];

export const RETENTION_COHORTS = [
  { month: 'Jun', size: 210, m1: 18, m2: 24, m3: 29, m4: 33 },
  { month: 'Jul', size: 260, m1: 21, m2: 27, m3: 32, m4: 0 },
  { month: 'Aug', size: 305, m1: 23, m2: 30, m3: 0, m4: 0 },
  { month: 'Sep', size: 342, m1: 25, m2: 0, m3: 0, m4: 0 },
];

export const SMS_CAMPAIGNS = [
  { name: 'White Friday - VIP', sent: 1840, delivered: 1798, date: '2026-11-20' },
  { name: 'New collection drop', sent: 2450, delivered: 2390, date: '2026-11-14' },
  { name: 'Abandoned cart SMS', sent: 620, delivered: 604, date: '2026-11-10' },
];

export const PLANS = [
  {
    name: { en: 'Starter', ar: 'البداية' },
    price: 1000,
    features: {
      en: ['1 WhatsApp number', 'Unified inbox', 'Order confirmation', '1 team seat'],
      ar: ['رقم واتساب واحد', 'صندوق محادثات موحد', 'تأكيد الأوردرات', 'مقعد واحد للفريق'],
    },
  },
  {
    name: { en: 'Growth', ar: 'النمو' },
    price: 1300,
    popular: true,
    features: {
      en: ['3 WhatsApp numbers', 'Abandoned carts + reviews', 'Loyalty program', 'SMS wallet', '3 team seats'],
      ar: ['3 أرقام واتساب', 'السلات المتروكة والتقييمات', 'برنامج الولاء', 'محفظة SMS', '3 مقاعد للفريق'],
    },
  },
  {
    name: { en: 'Pro', ar: 'الاحتراف' },
    price: 1800,
    features: {
      en: ['8 WhatsApp numbers', 'All automations', 'Retention analytics', 'Bosta + Google Sheets sync', '5 team seats'],
      ar: ['8 أرقام واتساب', 'كل الأوتوميشن', 'تحليلات الاحتفاظ', 'بوسطة + مزامنة Google Sheets', '5 مقاعد للفريق'],
    },
  },
];

export const LANDING_FEATURES = [
  {
    title: { en: 'Official WhatsApp API', ar: 'واتساب API الرسمي' },
    desc: {
      en: 'Your number stays safe. No unofficial sessions, no blocks, up to 8 numbers in one inbox.',
      ar: 'رقمك في أمان. لا جلسات غير رسمية ولا حظر، ولحد 8 أرقام في صندوق واحد.',
    },
    icon: 'whatsapp',
  },
  {
    title: { en: 'One-click Shopify connect', ar: 'ربط Shopify بضغطة واحدة' },
    desc: {
      en: 'Press connect, approve, done. No developer apps, no manual webhooks, no copied secrets.',
      ar: 'دوس ربط، وافق، خلاص. لا Custom Apps ولا webhooks يدوية ولا أسرار تتنسخ.',
    },
    icon: 'shopify',
  },
  {
    title: { en: 'Unified inbox', ar: 'صندوق محادثات موحد' },
    desc: {
      en: 'WhatsApp, Instagram, Messenger and TikTok messages in one screen, assigned to your team.',
      ar: 'رسايل واتساب وإنستجرام وماسنجر وتيك توك في شاشة واحدة، متوزعة على فريقك.',
    },
    icon: 'inbox',
  },
  {
    title: { en: 'Real net profit', ar: 'صافي ربح حقيقي' },
    desc: {
      en: 'Every order shows cost, shipping and fees, so you see what you actually earned.',
      ar: 'كل أوردر يوضح التكلفة والشحن والرسوم، فتشوف إنت كسبت كام بالظبط.',
    },
    icon: 'profit',
  },
  {
    title: { en: 'Abandoned cart recovery', ar: 'استرجاع السلات المتروكة' },
    desc: {
      en: 'Automatic WhatsApp reminders that bring customers back, with recovered revenue tracked.',
      ar: 'تذكير واتساب أوتوماتيك يرجّع العملاء، والإيراد المسترجع متسجل قدامك.',
    },
    icon: 'cart',
  },
  {
    title: { en: 'Honest automation states', ar: 'حالات أوتوميشن واضحة' },
    desc: {
      en: 'Every automation tells you if it is running, paused, or waiting for Meta approval, and why.',
      ar: 'كل أوتوميشن يقولك شغال ولا متوقف ولا مستني موافقة Meta، وليه.',
    },
    icon: 'auto',
  },
];
