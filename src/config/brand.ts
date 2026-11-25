export interface BrandColorPalette {
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly background: string;
  readonly text: string;
}

export interface BrandTypography {
  readonly primary: string;
  readonly weights: readonly number[];
}

export interface BrandIdentity {
  readonly name: string;
  readonly category: string;
  readonly shortLocation: string;
  readonly locationAddress: string;
  readonly subtitle: string;
  readonly pageTitle: string;
  readonly statusLabel: string;
  readonly statusDescription: string;
  readonly palette: BrandColorPalette;
  readonly typography: BrandTypography;
}

export const BRAND_PALETTE: BrandColorPalette = {
  primary: '#1C3A27',
  secondary: '#C5A059',
  accent: '#D97706',
  background: '#FAF8F5',
  text: '#1A241E',
} as const;

export const BRAND_TYPOGRAPHY: BrandTypography = {
  primary: 'Afacad',
  weights: [400, 500, 600, 700],
} as const;

export const GANG_SABARANG_BRAND: BrandIdentity = {
  name: 'Gang Sabarang',
  category: 'Restaurant & Cottage',
  shortLocation: 'Rangamati, Bangladesh',
  locationAddress:
    'Pagoda Road, Opposite Assambosti Govt. Primary School, Rangamati, Bangladesh',
  subtitle: 'Luxury Dining & Nature Cottages in the Heart of Rangamati',
  pageTitle: 'Gang Sabarang | Restaurant & Cottage — Rangamati',
  statusLabel: 'Project Foundation Ready',
  statusDescription:
    'Afacad typography, brand color tokens, and the core TypeScript architecture are configured.',
  palette: BRAND_PALETTE,
  typography: BRAND_TYPOGRAPHY,
} as const;

export function isValidHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}
