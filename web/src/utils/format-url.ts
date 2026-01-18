export function formatUrl(url: string, maxLength = 25): string {
  const formattedUrl = url.replace('http://', '').replace('https://', '');
  if (formattedUrl.length <= maxLength) return formattedUrl;
  return `${formattedUrl.slice(0, maxLength)}...`;
}
