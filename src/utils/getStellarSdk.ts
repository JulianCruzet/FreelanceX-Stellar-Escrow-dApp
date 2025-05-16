export async function getStellarSdk() {
  // If already loaded, return immediately
  if ((window as any).StellarSdk && (window as any).StellarSdk.Server) {
    return (window as any).StellarSdk;
  }

  // If script is already being loaded, wait for it
  if ((window as any).__stellarSdkLoadingPromise) {
    await (window as any).__stellarSdkLoadingPromise;
    if ((window as any).StellarSdk && (window as any).StellarSdk.Server) {
      return (window as any).StellarSdk;
    }
    throw new Error('StellarSdk did not load from CDN in time.');
  }

  // Only try CDN
  (window as any).__stellarSdkLoadingPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/stellar-sdk@13.3.0/dist/stellar-sdk.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load StellarSdk from CDN'));
    document.body.appendChild(script);
  });

  await (window as any).__stellarSdkLoadingPromise;

  if ((window as any).StellarSdk && (window as any).StellarSdk.Server) {
    return (window as any).StellarSdk;
  }
  throw new Error('StellarSdk did not load from CDN in time.');
} 