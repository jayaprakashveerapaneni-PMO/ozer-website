// Helper-side offer alerts: a short two-tone chime (WebAudio — no asset) and
// a native OS notification so offers land even when the tab is backgrounded.
// Web Push (browser fully closed) needs VAPID + a service worker — roadmap.

export function playChime(): void {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const t0 = ctx.currentTime;
    [880, 1174.66].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = t0 + i * 0.14;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.42);
    });
  } catch {
    /* audio blocked or unsupported — toast still shows */
  }
}

export type NotifyState = "unsupported" | NotificationPermission;

export function notificationState(): NotifyState {
  return typeof Notification === "undefined" ? "unsupported" : Notification.permission;
}

export async function requestNotifications(): Promise<NotifyState> {
  if (typeof Notification === "undefined") return "unsupported";
  if (Notification.permission === "default") await Notification.requestPermission();
  return Notification.permission;
}

export function showNativeOffer(title: string, body: string, tag: string): void {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, tag, icon: "/icon" });
  } catch {
    /* some platforms require a service worker — toast still shows */
  }
}
