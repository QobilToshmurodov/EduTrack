const PALETTE = ['#4F5DE0', '#14B89A', '#F58A3D', '#8E47C7'];

export function avatarColor(name: string | null | undefined): string {
  const value = name ?? '';
  let hash = 0;
  for (const c of value) hash = (hash * 31 + c.charCodeAt(0)) & 0xfff;
  return PALETTE[hash % PALETTE.length];
}

export function initials(name: string | null | undefined): string {
  return (name ?? '')
    .split(' ')
    .filter(p => p.length > 0)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
}
