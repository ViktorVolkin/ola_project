// Only the confirmed subject is added. No booking, sending or invented template.
export function getEnquiryUrl(baseUrl: string | null, subject?: string): string | null {
  if (!baseUrl || !subject) return baseUrl;
  const url = new URL(baseUrl);
  const existing = url.searchParams.get("text");
  url.searchParams.set("text", existing ? `${existing}\n${subject}` : subject);
  return url.toString();
}
