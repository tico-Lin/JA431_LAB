export type Role = 'guest' | 'vendor' | 'member' | 'tester';

export const ROLES: Role[] = ['guest', 'vendor', 'member', 'tester'];

// Maps SHA-256 hashes to their corresponding roles
export const ROLE_HASHES: Record<string, Role> = {
  // 'vendor'
  '630ba09448af522154f38ef7685ef1f44b0f3e9430f80829a03ce24f400f3754': 'vendor',
  // 'member'
  e31ab643c44f7a0ec824b59d1194d60dac334200d845e61d2d289daa0f087ea4: 'member',
  // 'tester'
  '9bba5c53a0545e0c80184b946153c9f58387e3bd1d4ee35740f29ac2e718b019': 'tester',
};

// Define page access permissions for each role
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  guest: ['/', '/pi'],
  vendor: ['/', '/pi', '/overview', '/services'],
  member: ['/', '/pi', '/overview', '/gaps', '/update', '/services'],
  tester: ['/', '/pi', '/overview', '/gaps', '/update', '/services'], // All pages
};

export const hasAccess = (role: Role, path: string): boolean => {
  return ROLE_PERMISSIONS[role].includes(path);
};
