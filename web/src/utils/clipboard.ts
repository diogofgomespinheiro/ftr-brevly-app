export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function buildShortUrl(shortCode: string): string {
  return `${window.location.origin}/${shortCode}`;
}
