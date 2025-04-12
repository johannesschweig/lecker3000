// returns a random string of a given length
function createRandomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


// returns a random id and the extension of the fileName
export function getRandomIdAndExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.')
  const extension = dotIndex !== -1 ? fileName.substring(dotIndex) : '.ERROR'
  if (dotIndex === -1) {
    console.error('ERROR', 'Could not find extension for file', fileName)
  }
  return {
    id: createRandomString(8),
    extension,
  }
}

const TAILWIND_COLORS = ['amber', 'blue', 'cyan', 'emerald', 'fuchsia', 'green', 'indigo', 'lime', 'orange', 'pink', 'purple', 'red', 'rose', 'sky', 'teal', 'violet', 'yellow' ]

export function getTagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash + tag.charCodeAt(i) * i) % TAILWIND_COLORS.length;
  }
  return TAILWIND_COLORS[hash];
}

function base64urlEncode(str: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function generatePKCECodes(): Promise<{ codeVerifier: string; codeChallenge: string }> {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(64); // Length of 64 ensures it meets the 43-128 character requirement
  crypto.getRandomValues(array);

  // Generate a codeVerifier using only valid characters
  const codeVerifier = Array.from(array)
    .map((byte) => validChars[byte % validChars.length])
    .join('');

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = base64urlEncode(digest);

  return { codeVerifier, codeChallenge };
}

export async function getValidAccessToken(): Promise<string> {
  const expiresAt = parseInt(localStorage.getItem('dropbox_token_expires') || '0', 10);
  const now = Date.now();

  // Check if the token is still valid
  if (now < expiresAt - 60 * 1000) {
    const accessToken = localStorage.getItem('dropbox_access_token');
    if (accessToken) {
      return accessToken;
    }
    throw new Error('Access token is missing from localStorage.');
  }

  // Refresh token if the current token is expired or about to expire
  const refreshToken = localStorage.getItem('dropbox_refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available.');
  }

  const clientId = import.meta.env.VITE_CLIENT_ID as string; // Ensure clientId is typed
  if (!clientId) {
    throw new Error('Client ID is not defined in environment variables.');
  }

  const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  const data: {
    access_token: string;
    expires_in: number;
  } = await response.json();

  // Save new token info in localStorage
  localStorage.setItem('dropbox_access_token', data.access_token);
  localStorage.setItem('dropbox_token_expires', (Date.now() + data.expires_in * 1000).toString());

  return data.access_token;
}
