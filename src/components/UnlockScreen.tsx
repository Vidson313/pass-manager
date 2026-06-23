import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, Eye, EyeOff, KeyRound, Check, AlertTriangle, ShieldCheck, Cloud, RefreshCw, Trash2 } from 'lucide-react';
import { EncryptedVaultPayload } from '../types';
import { decryptVault, encryptVault } from '../utils/crypto';

interface UnlockScreenProps {
  payload: EncryptedVaultPayload | null;
  onUnlocked: (password: string, decryptedItems: any, decryptedFolders: any, encryptedPayload?: EncryptedVaultPayload) => void;
  gdriveToken: string | null;
  isSyncing: boolean;
  onConnectGDrive: () => void;
  onDownloadGDrive: () => Promise<void>;
  onResetVault: () => void;
}

export default function UnlockScreen({
  payload,
  onUnlocked,
  gdriveToken,
  isSyncing,
  onConnectGDrive,
  onDownloadGDrive,
  onResetVault
}: UnlockScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isSetup = payload === null;

  // Strength check
  const checkPasswordStrength = (p: string) => {
    if (!p) return { score: 0, text: 'خالی', color: 'bg-gray-200' };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 2) return { score, text: 'ضعیف 🔴', color: 'bg-rose-500 w-1/4' };
    if (score <= 4) return { score, text: 'متوسط 🟡', color: 'bg-amber-500 w-2/4' };
    if (score <= 5) return { score, text: 'قوی 🟢', color: 'bg-emerald-500 w-3/4' };
    return { score, text: 'بسیار قوی 🔥', color: 'bg-blue-600 w-full' };
  };

  const strength = checkPasswordStrength(password);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSetup) {
        // Enforce validations
        if (password.length < 8) {
          throw new Error('رمز عبور مستر باید حداقل دارای ۸ کاراکتر باشد.');
        }
        if (password !== confirmPassword) {
          throw new Error('رمزهای عبور وارد شده همخوانی ندارند.');
        }

        // Initialize empty state
        const initialStore = {
          items: [],
          folders: [],
          version: 1
        };

        // Encrypt of empty state
        const encrypted = await encryptVault(initialStore, password);
        localStorage.setItem('vault_payload', JSON.stringify(encrypted));
        onUnlocked(password, [], [], encrypted);
      } else {
        if (!payload) return;
        
        // Decrypt with given password
        const decrypted = await decryptVault(payload, password);
        onUnlocked(password, decrypted.items, decrypted.folders);
      }
    } catch (err: any) {
      setError(err?.message || 'خطایی در پردازش رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 selection:bg-brand-400/30 selection:text-white" dir="rtl">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-300">
        
        {/* Subtle, premium glowing accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-400/20 via-neutral-300 to-brand-300/20 opacity-70" />
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400/24 to-neutral-300/10 border border-white/10 text-neutral-100 mb-4 shadow-lg shadow-black/30">
            {isSetup ? <KeyRound className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <h1 className="text-2xl font-semibold text-white font-heading tracking-tight mb-1">
            {isSetup ? 'راه‌اندازی گاوصندوق رمز عبور' : 'بازگشایی گاوصندوق محافظتی'}
          </h1>
          <div className="text-sm text-neutral-400 mt-2 font-sans text-center leading-6">
            {isSetup 
              ? 'یک رمز عبور مستر قوی برای رمزگذاری تمام اطلاعات خود تعیین کنید' 
              : 'رمز مستر خود را جهت بازگشایی و رمزگشایی اطلاعات محلی وارد کنید'}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/25 text-red-300 text-xs flex items-start gap-3">
            <ShieldAlert className="w-[18px] h-[18px] shrink-0 mt-0.5 text-red-500" />
            <span className="leading-5 font-sans">{error}</span>
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-neutral-450 tracking-wider mb-2">
              رمز عبور مستر (Master Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder="••••••••••••"
                className="w-full px-4 py-3 field-standard rounded-xl text-left font-mono placeholder:text-neutral-700 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-neutral-550 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>

            {/* Password Strength Indicator for Setup only */}
            {isSetup && password && (
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-medium text-neutral-400 font-sans">
                  <span>قدرت رمز عبور: {strength.text}</span>
                  <span className="font-mono">{password.length} کاراکتر</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/10">
                  <div className={`h-full ${strength.color} transition-all duration-300 rounded-full`} />
                </div>
              </div>
            )}
          </div>

          {isSetup && (
            <div>
              <label className="block text-[11px] font-bold text-neutral-450 tracking-wider mb-2">
                تأیید رمز عبور مستر
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 field-standard rounded-xl text-left font-mono placeholder:text-neutral-700 transition"
                required
              />
            </div>
          )}

          {/* Zero Knowledge Safeguard Warning */}
          {isSetup && (
            <div className="p-3.5 rounded-xl bg-amber-955/35 border border-amber-400/20 text-amber-300 text-xs flex gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
              <div className="space-y-1">
                <p className="font-semibold text-[13px]">حفاظت دانش-صفر (Zero-Knowledge)</p>
                <p className="leading-5 font-sans">هیچ سروری رمز عبور شما را ذخیره نمی‌کند. در صورت فراموشی، به علت پیاده‌سازی رمزارزی کلاینت‌ساید مستقل، بازیابی به هیچ وجه ممکن نخواهد بود.</p>
              </div>
            </div>
          )}

          {!isSetup && (
            <div className="p-3 surface-panel rounded-xl flex items-center gap-3 text-neutral-350 text-xs">
              <ShieldCheck className="w-[18px] h-[18px] text-neutral-400 shrink-0" />
              <span className="font-sans">محیط محلی رمزارزی AES-GCM-256 فعال است.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 h-11 btn-primary disabled:opacity-50 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition duration-150"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
            ) : isSetup ? (
              <>
                <Check className="w-4 h-4" />
                <span>راه‌اندازی و گشایش گاوصندوق</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>باز کردن کامل گاوصندوق</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-white/[0.08] space-y-3">
          <div className="p-3 surface-panel rounded-xl text-[11px] text-neutral-350 leading-5">
            برای دسترسی از هر مرورگر، ابتدا به Google Drive وصل شوید و vault رمزنگاری‌شده را بارگیری کنید. رمز مستر فقط روی همین دستگاه وارد می‌شود و به Google ارسال نمی‌شود.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onConnectGDrive}
              className="py-2.5 px-3 btn-ghost text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Cloud className="w-4 h-4" />
              {gdriveToken ? 'اتصال Google فعال است' : 'اتصال به Google Drive'}
            </button>

            <button
              type="button"
              onClick={onDownloadGDrive}
              disabled={!gdriveToken || isSyncing}
              className="py-2.5 px-3 btn-ghost disabled:opacity-50 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              بارگیری vault ابری
            </button>
          </div>

          <button
            type="button"
            onClick={onResetVault}
            className="w-full py-2.5 px-3 bg-rose-950/35 hover:bg-rose-950/55 border border-rose-500/25 text-rose-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Trash2 className="w-4 h-4" />
            کاربر جدید / ریست کامل و راه‌اندازی از نو
          </button>
        </div>
      </div>
      
      {/* Footer Meta */}
      <p className="text-[10px] text-neutral-600 mt-8 font-mono text-center tracking-wider uppercase">
        Zero-Knowledge Web Cryptography Vault
      </p>
    </div>
  );
}
