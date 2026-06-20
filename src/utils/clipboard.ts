const CLIPBOARD_CLEAR_DELAY_MS = 30_000;

export async function copySensitiveText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);

  window.setTimeout(async () => {
    try {
      const currentClipboard = await navigator.clipboard.readText();
      if (currentClipboard === value) {
        await navigator.clipboard.writeText('');
      }
    } catch (error) {
      console.warn('Unable to clear clipboard:', error);
    }
  }, CLIPBOARD_CLEAR_DELAY_MS);
}
