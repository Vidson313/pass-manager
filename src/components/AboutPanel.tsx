import { ShieldCheck, KeyRound, Cloud, Cpu, Lock, Github, ExternalLink } from 'lucide-react';
import {
  APP_AUTHOR,
  APP_GITHUB_URL,
  APP_HANDLE,
  APP_NAME,
  APP_RELEASE_CHANNEL,
  APP_TAGLINE,
  APP_TELEGRAM,
  APP_VERSION,
} from '../appMeta';

interface AboutPanelProps {
  itemCount: number;
  folderCount: number;
  gdriveConnected: boolean;
}

export default function AboutPanel({ itemCount, folderCount, gdriveConnected }: AboutPanelProps) {
  const capabilities = [
    'AES-GCM 256-bit client-side vault encryption',
    'PBKDF2-SHA256 key derivation from the master password',
    'Secure random password and item ID generation via WebCrypto',
    'TOTP generation for two-factor authentication codes',
    'Optional encrypted Google Drive sync for vault.enc only',
    'Windows desktop packaging with Electron and NSIS',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <section className="glass-panel rounded-3xl p-6 md:p-8 overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 status-pill">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              نسخه پایدار {APP_VERSION}
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-white tracking-tight">
                {APP_NAME}
              </h2>
              <p className="text-sm md:text-base text-neutral-400 mt-2 leading-7">
                {APP_TAGLINE} برای نگهداری امن حساب‌ها، کارت‌ها، یادداشت‌ها و کدهای دومرحله‌ای.
              </p>
            </div>
          </div>

          <div className="w-20 h-20 rounded-3xl bg-brand-400/12 border border-brand-400/25 flex items-center justify-center shadow-2xl shadow-brand-500/10">
            <KeyRound className="w-9 h-9 text-brand-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          <div className="surface-panel rounded-2xl p-4">
            <p className="text-[11px] text-neutral-500 mb-1">آیتم‌های ذخیره‌شده</p>
            <p className="text-2xl font-mono font-semibold text-white">{itemCount}</p>
          </div>
          <div className="surface-panel rounded-2xl p-4">
            <p className="text-[11px] text-neutral-500 mb-1">پوشه‌ها</p>
            <p className="text-2xl font-mono font-semibold text-white">{folderCount}</p>
          </div>
          <div className="surface-panel rounded-2xl p-4">
            <p className="text-[11px] text-neutral-500 mb-1">Google Drive</p>
            <p className="text-sm font-semibold text-white">{gdriveConnected ? 'متصل' : 'غیرفعال'}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="section-title text-base">مدل امنیتی</h3>
          </div>
          <p className="text-xs text-neutral-400 leading-6 mb-4">
            کلیدبان با مدل zero-knowledge طراحی شده است: رمز مستر در برنامه ذخیره نمی‌شود و داده‌ها پیش از ذخیره یا همگام‌سازی به ciphertext تبدیل می‌شوند.
          </p>
          <div className="space-y-2">
            {capabilities.map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs text-neutral-300 leading-5">
                <Lock className="w-3.5 h-3.5 mt-0.5 text-brand-300 shrink-0" />
                <span className="ltr text-left flex-1">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-brand-300" />
            <h3 className="section-title text-base">اطلاعات نسخه</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between surface-panel rounded-xl px-3 py-2.5">
              <span className="text-neutral-500">Version</span>
              <span className="font-mono text-white">{APP_VERSION}</span>
            </div>
            <div className="flex items-center justify-between surface-panel rounded-xl px-3 py-2.5">
              <span className="text-neutral-500">Release channel</span>
              <span className="font-mono text-white">{APP_RELEASE_CHANNEL}</span>
            </div>
            <div className="flex items-center justify-between surface-panel rounded-xl px-3 py-2.5">
              <span className="text-neutral-500">Developer</span>
              <span className="font-mono text-white ltr text-left">{APP_AUTHOR}</span>
            </div>
            <div className="flex items-center justify-between surface-panel rounded-xl px-3 py-2.5">
              <span className="text-neutral-500">Handle</span>
              <span className="font-mono text-white">{APP_HANDLE}</span>
            </div>
            <div className="flex items-center justify-between surface-panel rounded-xl px-3 py-2.5">
              <span className="text-neutral-500">Telegram</span>
              <span className="font-mono text-white">{APP_TELEGRAM}</span>
            </div>
            <div className="flex items-center justify-between surface-panel rounded-xl px-3 py-2.5">
              <span className="text-neutral-500">Runtime</span>
              <span className="font-mono text-white">Electron Desktop</span>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/8 border border-amber-400/15 text-amber-200 text-xs leading-6">
            این پروژه برای نمونه‌کار حرفه‌ای و استفاده شخصی ساخته شده است. قبل از استفاده سازمانی یا نگهداری داده‌های بسیار حساس، audit امنیتی مستقل پیشنهاد می‌شود.
          </div>
        </section>
      </div>

      <section className="glass-panel rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Cloud className="w-5 h-5 text-sky-300" />
          <h3 className="section-title text-base">مسیر انتشار حرفه‌ای</h3>
        </div>
        <p className="text-xs text-neutral-400 leading-6">
          نسخه 1.0.0 با installer ویندوزی، آیکون اختصاصی، مستندات امنیتی و release checklist آماده انتشار دستی است. برای نسخه‌های بعدی می‌توان GitHub Releases و auto-update را اضافه کرد.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="status-pill"><Github className="w-3.5 h-3.5" /> GitHub Release Ready</span>
          <a
            href={APP_GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="status-pill hover:text-white transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> {APP_HANDLE} on GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
