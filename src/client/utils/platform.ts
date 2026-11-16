const APPLE_MOBILE_USER_AGENT = /iPad|iPhone|iPod/;

export function isAppleMobileDevice(): boolean {
  const { userAgent, maxTouchPoints } = navigator;
  const isIpadWithDesktopUserAgent = userAgent.includes('Macintosh') && maxTouchPoints > 1;
  return APPLE_MOBILE_USER_AGENT.test(userAgent) || isIpadWithDesktopUserAgent;
}
