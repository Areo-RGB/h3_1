import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DeferredInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-prompt-dismissed';
const DISMISS_FOR_MS = 30 * 24 * 60 * 60 * 1000;

function wasRecentlyDismissed() {
  const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY));
  return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_FOR_MS;
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<DeferredInstallPrompt | null>(null);

  useEffect(() => {
    if (wasRecentlyDismissed()) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as DeferredInstallPrompt);
    };
    const handleInstalled = () => setInstallEvent(null);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (!installEvent) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setInstallEvent(null);
  };

  const install = async () => {
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'dismissed') dismiss();
    else setInstallEvent(null);
  };

  return (
    <aside id="install-prompt-banner" className="absolute inset-x-3 bottom-[76px] z-[60] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#00479e]/10 text-[#00479e]">
          <Download size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p id="install-prompt-title" className="text-sm font-bold text-slate-900">Team-App installieren?</p>
          <p id="install-prompt-subtitle" className="truncate text-xs text-slate-500">Schneller vom Startbildschirm öffnen</p>
        </div>
        <button
          id="install-prompt-accept-btn"
          type="button"
          onClick={install}
          className="rounded-lg bg-[#00479e] px-3 py-2 text-xs font-bold text-white hover:bg-[#003a82]"
        >
          Installieren
        </button>
        <button
          id="install-prompt-dismiss-btn"
          type="button"
          onClick={dismiss}
          aria-label="Installationshinweis schließen"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
