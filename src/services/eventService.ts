/**
 * SERVIÇO DE GESTÃO DE EVENTOS / CASAMENTOS
 * Permite ter múltiplos casamentos em simultâneo no mesmo site sem misturar fotos.
 */

export interface EventDetails {
  slug: string;
  title: string;
}

export function getCurrentEventSlug(): string {
  const params = new URLSearchParams(window.location.search);
  const evento = params.get('evento') || params.get('casamento');
  
  if (evento && evento.trim()) {
    return sanitizeSlug(evento);
  }

  return 'demo-casamento';
}

export function getEventDetails(): EventDetails {
  const slug = getCurrentEventSlug();
  const title = formatEventTitle(slug);
  return { slug, title };
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remover acentos
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-');
}

export function formatEventTitle(slug: string): string {
  if (slug === 'demo-casamento') return 'Álbum Casamento';
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getEventUrl(slug: string): string {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('evento', slug);
  return currentUrl.toString();
}
