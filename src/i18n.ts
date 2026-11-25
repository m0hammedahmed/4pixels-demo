export type Lang = 'en' | 'ar';

export const STR: Record<string, { en: string; ar: string }> = {
  // Nav
  'nav.overview': { en: 'Overview', ar: 'نظرة عامة' },
  'nav.orders': { en: 'Orders', ar: 'الأوردرات' },
  'nav.chats': { en: 'Chats', ar: 'المحادثات' },
  'nav.automations': { en: 'Automations', ar: 'الأوتوميشن' },
  'nav.templates': { en: 'Templates', ar: 'التمبليتس' },
  'nav.loyalty': { en: 'Loyalty', ar: 'الولاء' },
  'nav.sms': { en: 'SMS', ar: 'SMS' },
  'nav.retention': { en: 'Retention', ar: 'الاحتفاظ' },
  'nav.delivery': { en: 'Delivery', ar: 'التوصيل' },
  'nav.settings': { en: 'Settings', ar: 'الإعدادات' },
  'nav.chat': { en: 'Chat', ar: 'المحادثات' },
  'nav.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'nav.sales': { en: 'Shopify Sales', ar: 'مبيعات Shopify' },
  'nav.products': { en: 'Products report', ar: 'تقرير المنتجات' },
  'nav.customers': { en: 'Customers', ar: 'العملاء' },
  'nav.carts': { en: 'Abandoned Carts', ar: 'السلات المتروكة' },
  'nav.marketing': { en: 'Marketing', ar: 'التسويق' },
  'nav.offers': { en: 'Smart Offers', ar: 'العروض الذكية' },
  'nav.loyaltyR': { en: 'Loyalty & Rewards', ar: 'الولاء والمكافآت' },
  'nav.billing': { en: 'Plan & Billing', ar: 'الباقة والفواتير' },
  'nav.logout': { en: 'Logout', ar: 'تسجيل خروج' },
  'nav.g.workspace': { en: 'WORKSPACE', ar: 'مساحة العمل' },
  'nav.g.growth': { en: 'GROWTH', ar: 'النمو' },
  'nav.g.account': { en: 'ACCOUNT', ar: 'الحساب' },
  'nav.backToSite': { en: 'Back to site', ar: 'رجوع للموقع' },

  // Landing
  'land.badge': { en: 'Official Meta WhatsApp API', ar: 'واتساب API الرسمي من Meta' },
  'land.heroTitle': {
    en: 'Your Shopify store, WhatsApp, and marketing in one place',
    ar: 'متجر Shopify وواتساب والتسويق في مكان واحد',
  },
  'land.heroSub': {
    en: 'Connect Shopify, WhatsApp, marketing, SMS and customer chats, and run every order operation without complexity, from the first minute.',
    ar: 'اربط Shopify وواتساب والتسويق والـ SMS ومحادثات العملاء وشغّل كل عمليات الأوردرات من غير تعقيد، ومن أول دقيقة.',
  },
  'land.ctaStart': { en: 'Start free trial', ar: 'ابدأ التجربة المجانية' },
  'land.ctaDemo': { en: 'See the live demo', ar: 'شوف الديمو المباشر' },
  'land.featTitle': { en: 'Everything your store needs', ar: 'كل اللي متجرك محتاجه' },
  'land.featSub': {
    en: 'Built for Egyptian stores selling on Shopify.',
    ar: 'مبني للمتاجر المصرية اللي بتبيع على Shopify.',
  },
  'land.pricingTitle': { en: 'One clear price, in Egyptian pounds', ar: 'سعر واحد واضح، بالجنيه المصري' },
  'land.pricingSub': {
    en: 'No dollars, no Shopify billing surprises. Pay by InstaPay or Vodafone Cash.',
    ar: 'لا دولار ولا مفاجآت من فواتير Shopify. ادفع بإنستاباي أو فودافون كاش.',
  },
  'land.mostPopular': { en: 'Most popular', ar: 'الأكثر اختياراً' },
  'land.perMonth': { en: '/month', ar: '/شهر' },
  'land.choose': { en: 'Choose plan', ar: 'اختار الخطة' },
  'land.footer': { en: 'Made for Egyptian merchants.', ar: 'اتعمل للتجار المصريين.' },

  // Topbar
  'top.search': { en: 'Search orders, customers, chats...', ar: 'دور على أوردر أو عميل أو محادثة...' },
  'top.trial': { en: 'Trial: 5 days left', ar: 'التجربة: باقي 5 أيام' },
  'top.upgrade': { en: 'Upgrade', ar: 'ترقية' },

  // Dashboard
  'dash.title': { en: 'Overview', ar: 'نظرة عامة' },
  'dash.subtitle': { en: 'Last 30 days across all channels', ar: 'آخر 30 يوم على كل القنوات' },
  'dash.revenue': { en: 'Revenue', ar: 'الإيراد' },
  'dash.orders': { en: 'Orders', ar: 'الأوردرات' },
  'dash.netProfit': { en: 'Net profit', ar: 'صافي الربح' },
  'dash.recovered': { en: 'Recovered carts', ar: 'السلات المسترجعة' },
  'dash.vsLast': { en: 'vs previous 30 days', ar: 'مقارنة بالـ 30 يوم اللي فاتوا' },
  'dash.revByDay': { en: 'Revenue by day', ar: 'الإيراد باليوم' },
  'dash.recentOrders': { en: 'Recent orders', ar: 'أحدث الأوردرات' },
  'dash.viewAll': { en: 'View all', ar: 'عرض الكل' },
  'dash.checklist.title': { en: 'Get your store running', ar: 'شغّل متجرك' },
  'dash.checklist.sub': { en: 'Finish these steps and your automations go live.', ar: 'كمّل الخطوات دي والأوتوميشن هيشتغل.' },
  'dash.checklist.shopify': { en: 'Connect Shopify', ar: 'ربط Shopify' },
  'dash.checklist.whatsapp': { en: 'Connect WhatsApp number', ar: 'ربط رقم الواتساب' },
  'dash.checklist.automation': { en: 'Activate your first automation', ar: 'تفعيل أول أوتوميشن' },
  'dash.checklist.done': { en: 'Done', ar: 'تم' },
  'dash.checklist.start': { en: 'Start', ar: 'ابدأ' },

  // Notifications
  'notif.title': { en: 'Notifications', ar: 'الإشعارات' },
  'notif.dismiss': { en: 'Dismiss', ar: 'إخفاء' },
  'notif.dismissAll': { en: 'Dismiss all', ar: 'إخفاء الكل' },
  'notif.empty': { en: 'All caught up.', ar: 'مفيش إشعارات جديدة.' },

  // Orders
  'orders.title': { en: 'Orders', ar: 'الأوردرات' },
  'orders.all': { en: 'All', ar: 'الكل' },
  'orders.new': { en: 'New', ar: 'جديد' },
  'orders.confirmed': { en: 'Confirmed', ar: 'مؤكد' },
  'orders.shipped': { en: 'Shipped', ar: 'اتشحن' },
  'orders.delivered': { en: 'Delivered', ar: 'اتسلم' },
  'orders.cancelled': { en: 'Cancelled', ar: 'ملغي' },
  'orders.customer': { en: 'Customer', ar: 'العميل' },
  'orders.items': { en: 'Items', ar: 'المنتجات' },
  'orders.total': { en: 'Total', ar: 'الإجمالي' },
  'orders.profit': { en: 'Net profit', ar: 'صافي الربح' },
  'orders.status': { en: 'Status', ar: 'الحالة' },
  'orders.date': { en: 'Date', ar: 'التاريخ' },
  'orders.detail': { en: 'Order details', ar: 'تفاصيل الأوردر' },
  'orders.cost': { en: 'Product cost', ar: 'تكلفة المنتج' },
  'orders.shipping': { en: 'Shipping', ar: 'الشحن' },
  'orders.fees': { en: 'Fees', ar: 'الرسوم' },
  'orders.sendWA': { en: 'Send WhatsApp confirmation', ar: 'ابعت تأكيد واتساب' },
  'orders.sent': { en: 'Sent', ar: 'اتبعت' },
  'orders.close': { en: 'Close', ar: 'قفل' },

  // Chats
  'chats.title': { en: 'Unified inbox', ar: 'صندوق المحادثات الموحد' },
  'chats.all': { en: 'All channels', ar: 'كل القنوات' },
  'chats.typeMsg': { en: 'Type a reply...', ar: 'اكتب رد...' },
  'chats.send': { en: 'Send', ar: 'إرسال' },
  'chats.assignTo': { en: 'Assign', ar: 'إسناد' },
  'chats.you': { en: 'You', ar: 'أنت' },
  'chats.online': { en: 'Online', ar: 'متصل' },

  // Automations
  'auto.title': { en: 'Automations', ar: 'الأوتوميشن' },
  'auto.sub': { en: 'Every automation shows its exact state and what it needs.', ar: 'كل أوتوميشن واضح حالته ومحتاج إيه.' },
  'auto.active': { en: 'Active', ar: 'شغال' },
  'auto.paused': { en: 'Paused', ar: 'متوقف' },
  'auto.needsTemplate': { en: 'Waiting for Meta template approval', ar: 'مستني موافقة Meta على التمبليت' },
  'auto.sent30': { en: 'sent last 30 days', ar: 'اتبعت آخر 30 يوم' },
  'auto.recovered30': { en: 'EGP recovered last 30 days', ar: 'جنيه مسترجعة آخر 30 يوم' },
  'auto.preview': { en: 'Template preview', ar: 'معاينة التمبليت' },
  'auto.on': { en: 'On', ar: 'شغال' },
  'auto.off': { en: 'Off', ar: 'متوقف' },

  // Templates
  'tpl.title': { en: 'WhatsApp templates', ar: 'تمبليتس واتساب' },
  'tpl.sub': { en: 'Meta approval states, in plain words.', ar: 'حالات موافقة Meta، بكلام واضح.' },
  'tpl.approved': { en: 'Approved', ar: 'مقبول' },
  'tpl.pending': { en: 'Pending Meta review', ar: 'في مراجعة Meta' },
  'tpl.rejected': { en: 'Rejected', ar: 'مرفوض' },
  'tpl.synced': { en: 'Synced', ar: 'متزامن' },
  'tpl.resync': { en: 'Re-sync', ar: 'مزامنة تاني' },
  'tpl.syncedOk': { en: 'Templates synced just now.', ar: 'التمبليتس اتزامنت دلوقتي.' },
  'tpl.rejectedWhy': { en: 'Why rejected', ar: 'سبب الرفض' },

  // Loyalty
  'loy.title': { en: 'Loyalty & rewards', ar: 'الولاء والمكافآت' },
  'loy.members': { en: 'Members', ar: 'الأعضاء' },
  'loy.pointsIssued': { en: 'Points issued', ar: 'النقاط المتصرفة' },
  'loy.redeemed': { en: 'Rewards redeemed', ar: 'مكافآت اتستبدلت' },
  'loy.tiers': { en: 'Tiers', ar: 'المستويات' },
  'loy.howItWorks': { en: 'How customers earn', ar: 'العميل بيكسب إزاي' },

  // SMS
  'sms.title': { en: 'SMS wallet & campaigns', ar: 'محفظة الـ SMS والحملات' },
  'sms.balance': { en: 'Wallet balance', ar: 'رصيد المحفظة' },
  'sms.perMsg': { en: 'per message part', ar: 'للرسالة الواحدة' },
  'sms.topup': { en: 'Top up', ar: 'اشحن' },
  'sms.topupHow': { en: 'InstaPay or Vodafone Cash to 01066184859, then send the receipt here.', ar: 'إنستاباي أو فودافون كاش على 01066184859 وابعت الإيصال هنا.' },
  'sms.campaigns': { en: 'Campaigns', ar: 'الحملات' },
  'sms.delivered': { en: 'Delivered', ar: 'وصلت' },

  // Retention
  'ret.title': { en: 'Retention', ar: 'الاحتفاظ بالعملاء' },
  'ret.sub': { en: 'Repeat purchase by first-order month.', ar: 'إعادة الشراء حسب شهر أول أوردر.' },
  'ret.repeatRate': { en: 'Repeat rate', ar: 'نسبة إعادة الشراء' },
  'ret.avgSecond': { en: 'Avg days to 2nd order', ar: 'متوسط الأيام للأوردر التاني' },

  // Delivery
  'del.title': { en: 'Delivery (Bosta)', ar: 'التوصيل (بوسطة)' },
  'del.inTransit': { en: 'In transit', ar: 'في الطريق' },
  'del.outFor': { en: 'Out for delivery', ar: 'خرج للتسليم' },
  'del.delivered': { en: 'Delivered', ar: 'اتسلم' },
  'del.failed': { en: 'Failed attempt', ar: 'محاولة فاشلة' },
  'del.tracking': { en: 'Tracking', ar: 'التتبع' },

  // Settings
  'set.title': { en: 'Settings', ar: 'الإعدادات' },
  'set.store': { en: 'Store', ar: 'المتجر' },
  'set.whatsapp': { en: 'WhatsApp numbers', ar: 'أرقام الواتساب' },
  'set.team': { en: 'Team', ar: 'الفريق' },
  'set.billing': { en: 'Billing', ar: 'الفواتير' },
  'set.connected': { en: 'Connected', ar: 'متصل' },
  'set.officialApi': { en: 'Official API', ar: 'API رسمي' },
  'set.plan': { en: 'Current plan', ar: 'الخطة الحالية' },
  'set.nextPayment': { en: 'Next payment', ar: 'الدفعة الجاية' },
  'set.payMethod': { en: 'Payment method', ar: 'طريقة الدفع' },
  'set.seats': { en: 'seats', ar: 'مقاعد' },
  'set.owner': { en: 'Owner', ar: 'المالك' },
  'set.agent': { en: 'Agent', ar: 'موظف' },
  'set.save': { en: 'Save changes', ar: 'احفظ التغييرات' },
  'set.saved': { en: 'Saved.', ar: 'اتحفظ.' },

  // Common
  'common.egp': { en: 'EGP', ar: 'جنيه' },
  'common.language': { en: 'العربية', ar: 'English' },
};

export function makeT(lang: Lang) {
  return (key: string): string => STR[key]?.[lang] ?? key;
}
