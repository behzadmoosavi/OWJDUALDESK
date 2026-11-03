// دوال دسک اوج — سیستم بومی‌سازی زبان فارسی، راست‌چین و تقویم شمسی
// شرکت داده گستر اوج (OWJ) — تحت مجوز GPL-3.0
'use strict';

(() => {
  // ۱. تبدیل تاریخ میلادی به هجری شمسی (جلالی)
  function gregorianToJalali(gy, gm, gd) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    const gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    jy += Math.floor((days - 1) / 365);
    if (days > 0) days = (days - 1) % 365;
    const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return [jy, jm, jd];
  }

  // ۲. تبدیل اعداد به ارقام فارسی
  function toPersianDigits(str) {
    if (str == null) return '';
    const p = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(str).replace(/[0-9]/g, (w) => p[+w]);
  }

  // ۳. دیکشنری جامع کلمات و عبارات فنی به فارسی اصیل مهندسی
  const FA_DICT = {
    // برندینگ
    'DuoDesk': 'دوال دسک اوج',
    'TwinDesk': 'دوال دسک اوج',
    'OWJ Dual Desk': 'دوال دسک اوج',
    'One desk for all your devices': 'یک میز کار یکپارچه برای تمام رایانه‌ها و تجهیزات شما',
    'Not paired': 'جفت نشده',
    'Paired': 'متصل و جفت‌شده',
    'Connecting': 'در حال برقراری ارتباط...',
    'Connected': 'متصل شد',
    'Disconnected': 'ارتباط قطع شد',

    // تب‌ها و صفحات اصلی
    'Overview': 'میز کار و وضعیت',
    'Connection': 'اتصال و جفت‌سازی',
    'Display': 'نمایشگر دوم و مانیتور مجازی',
    'Receive screen': 'دریافت تصویر صفحه',
    'Receive': 'دریافت تصویر',
    'Cursor': 'ماوس و نشانگر مشترک',
    'Keyboard': 'صفحه‌کلید یکپارچه',
    'Apps': 'برنامه‌های مجزا',
    'Files': 'تبادل فایل و پوشه',
    'Clipboard': 'کلیپ‌بورد مشترک',
    'Terminal': 'خط فرمان و ترمینال',
    'Audio': 'استریم و انتقال صدا',
    'Camera': 'وب‌کم و دوربین مشترک',
    'Notifications': 'اعلان‌ها و رویدادها',
    'Phone': 'مدیریت گوشی هوشمند',
    'Multi-device': 'شبکه مش چنددستگاهی',
    'General': 'تنظیمات عمومی',
    'About': 'درباره نرم‌افزار',
    'Messages': 'پیام‌ها و پیامک‌ها',
    'Calls': 'تماس‌های ورودی و خروجی',
    'Media': 'پخش رسانه و کنترل موزیک',

    // کنترل‌ها و دکمه‌ها
    'Extend': 'گسترش مانیتور (Extend)',
    'Mirror': 'آینه‌ای کردن (Mirror)',
    'Full screen': 'تمام‌صفحه',
    'Frame generation': 'تولید فریم روان',
    'Stop': 'توقف',
    'Start': 'شروع',
    'Settings': 'تنظیمات',
    'Close': 'بستن',
    'Apply': 'اعمال تغییرات',
    'Cancel': 'انصراف',
    'Pair': 'جفت‌سازی',
    'Unpair': 'لغو جفت‌سازی',
    'Share': 'اشتراک‌گذاری',
    'Save': 'ذخیره',
    'Done': 'تکمیل شد',
    'Help': 'راهنما',
    'Encrypted': 'رمزنگاری‌شده و امن',
    'Open Anyway': 'اجرا در هر صورت',
    'Run anyway': 'اجرا شود',

    // توضیحات فنی
    'Push the pointer off the edge of your screen and keep working on the other computer': 'ماوس را از لبه مانیتور رد کنید و بلافاصله روی سیستم دیگر کار کنید',
    'One mouse and keyboard across both computers': 'یک ماوس و کیبورد مشترک برای مدیریت هم‌زمان دو سیستم',
    'Copy on one computer and paste on the other': 'روی یک سیستم کپی کنید و روی سیستم دیگر فوراً پیست نمایید',
    'Drag files across the screen edge and drop them anywhere': 'فایل‌ها را با ماوس از لبه صفحه بکشید و روی دسکتاپ دیگر رها کنید',
    'No account, no cloud': 'کاملاً آفلاین، بدون نیاز به ثبت‌نام و بدون واسطه ابری',
    'Turn an old laptop or tablet into a second screen': 'لپ‌تاپ دوم یا تبلت خود را به عنوان مانیتور کمکی رایانه استفاده کنید',
    'Extend your desktop onto another computer': 'دسکتاپ خود را به عنوان مانیتور مجازی روی سیستم دیگر گسترش دهید',
    'Low-latency H.264 stream': 'استریم پرسرعت H.264 با کمترین تاخیر زمانی',
    'Cursor lock': 'قفل موقعیت نشانگر ماوس روی یک سیستم',
    'Shared folders through Samba': 'اشتراک‌گذاری پوشه‌ها با درایو شبکه (SMB)',
    'Start with Windows': 'اجرای خودکار هنگام بالا آمدن ویندوز',
    'Keep alive in background': 'فعال ماندن در پس‌زمینه و سینی ویندوز (Tray)',
    'Hardware acceleration': 'شتاب‌نگار سخت‌افزاری گرافیک (GPU)',
  };

  function translate(text) {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (FA_DICT[trimmed]) {
      return text.replace(trimmed, FA_DICT[trimmed]);
    }
    // جایگزینی کلمات کلیدی نام پروژه
    let res = text.replace(/DuoDesk/g, 'دوال دسک اوج')
                  .replace(/TwinDesk/g, 'دوال دسک اوج')
                  .replace(/duodesk/g, 'owjdesk');
    return res;
  }

  // ۴. تزریق و فعال‌سازی زبان فارسی و راست‌چین در DOM
  function applyPersian() {
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
    document.documentElement.classList.add('owj-rtl');
    if (document.body) {
      document.body.dir = 'rtl';
      document.body.classList.add('owj-rtl');
    }

    // ترجمه عناوین تب‌ها در شیء UI.tabs در صورت وجود
    if (window.UI && Array.isArray(window.UI.tabs)) {
      for (const tab of window.UI.tabs) {
        if (tab.title) tab.title = translate(tab.title);
        if (tab.heading) tab.heading = translate(tab.heading);
        if (tab.desc) tab.desc = translate(tab.desc);
      }
    }

    // پیمایش و ترجمه امن المان‌های متنی UI
    const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(parent.tagName)) continue;
      const original = node.nodeValue;
      if (original && original.trim().length > 0) {
        const trans = translate(original);
        if (trans !== original) {
          node.nodeValue = trans;
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPersian);
  } else {
    applyPersian();
  }

  window.OWJ = {
    translate,
    toPersianDigits,
    gregorianToJalali,
    applyPersian,
  };
})();
