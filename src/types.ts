// ---------- Constants ----------
export const UNITS = ['Everest', 'Fênix'] as const;
export const SCS = ['SC1', 'SC2', 'SC3', 'SC4', 'SC5', 'SC6'] as const;
export const MATERIAL_STATUS = ['Disponível', 'Baixo', 'Indisponível'] as const;
export const SITUATIONS = ['Preparado', 'A preparar', 'Em fábrica'] as const;

// ---------- Derived Types ----------
export type Unit = (typeof UNITS)[number];
export type SC = (typeof SCS)[number];
export type MaterialStatus = (typeof MATERIAL_STATUS)[number];
export type Situation = (typeof SITUATIONS)[number];

// ---------- Model ----------
export type ProductionItem = {
  id: string;
  date: string; // YYYY-MM-DD
  unit: Unit;
  sc: SC;
  product: string;
  product_abbr: string;
  batch: string;
  quantity?: number | null;
  quantity_unit: string;
  material_status: MaterialStatus;
  situation: Situation;
  observation: string;
  created_at: string;
  updated_at: string;
};

// ---------- Helpers ----------
export const todayISO = (): string => {
  const d = new Date();

  // evita problemas de timezone
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
};

export const formatDateLabel = (iso: string): string => {
  if (!iso) return '';

  const parts = iso.split('-');
  if (parts.length !== 3) return iso;

  const [y, m, d] = parts.map(Number);

  if (!y || !m || !d) return iso;

  const dt = new Date(y, m - 1, d);

  if (isNaN(dt.getTime())) return iso;

  return dt.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
};
