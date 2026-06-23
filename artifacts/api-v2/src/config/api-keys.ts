// Простая система API ключей
export const API_KEYS = {
  admin: process.env.ADMIN_API_KEY || 'grizzly-admin-key-2026',
  read: process.env.READ_API_KEY || 'grizzly-read-key-2026',
};

export function validateApiKey(key: string | undefined, requiredLevel: 'admin' | 'read'): boolean {
  if (!key) return false;
  
  if (requiredLevel === 'admin') {
    return key === API_KEYS.admin;
  }
  
  // read уровень позволяет использовать любой валидный ключ
  return key === API_KEYS.admin || key === API_KEYS.read;
}
