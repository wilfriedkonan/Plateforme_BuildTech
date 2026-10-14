/**
 * Commandes ESC/POS pour imprimante thermique 80mm (48 colonnes police normale)
 * Compatible Xprinter XP-80T et tout clone ESC/POS standard.
 */

// ── Commandes de base ──────────────────────────────────────────────────────────

const INIT         = [0x1B, 0x40];
const ALIGN_LEFT   = [0x1B, 0x61, 0x00];
const ALIGN_CENTER = [0x1B, 0x61, 0x01];
const BOLD_ON      = [0x1B, 0x45, 0x01];
const BOLD_OFF     = [0x1B, 0x45, 0x00];
const SIZE_2X      = [0x1D, 0x21, 0x11]; // double hauteur + largeur
const SIZE_NORM    = [0x1D, 0x21, 0x00];
const LF           = [0x0A];
const CUT          = [0x1D, 0x56, 0x42, 0x00]; // coupure partielle

const COLS = 48; // colonnes en police normale à 80mm

// ── Normalisation ASCII (compatibilité code-page imprimante) ───────────────────

function norm(text: string): string {
  return text
    .replace(/[àâä]/g, 'a').replace(/[ÀÂÄ]/g, 'A')
    .replace(/[éèêë]/g, 'e').replace(/[ÉÈÊË]/g, 'E')
    .replace(/[îï]/g, 'i').replace(/[ÎÏ]/g, 'I')
    .replace(/[ôö]/g, 'o').replace(/[ÔÖ]/g, 'O')
    .replace(/[ùûü]/g, 'u').replace(/[ÙÛÜ]/g, 'U')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/ñ/g, 'n').replace(/œ/g, 'oe').replace(/Œ/g, 'OE')
    .replace(/æ/g, 'ae').replace(/[«»]/g, '"')
    .replace(/['']/g, "'").replace(/[–—]/g, '-').replace(/×/g, 'x')
    .replace(/[^\x20-\x7E]/g, '?');
}

function enc(text: string): number[] {
  return Array.from(new TextEncoder().encode(norm(text)));
}

// ── Helpers de mise en page ────────────────────────────────────────────────────

function textLine(text: string): number[] {
  return [...enc(text), ...LF];
}

function sep(): number[] {
  return textLine('-'.repeat(COLS));
}

function centered(text: string, cols = COLS): number[] {
  const n = norm(text);
  const pad = Math.max(0, Math.floor((cols - n.length) / 2));
  return textLine(' '.repeat(pad) + n);
}

/** Deux colonnes gauche + droite justifiées sur COLS caractères */
function twoCol(left: string, right: string, cols = COLS): number[] {
  const l = norm(left);
  const r = norm(right);
  const spaces = Math.max(1, cols - l.length - r.length);
  return textLine(l + ' '.repeat(spaces) + r);
}

/** Découpe un texte en lignes de maxLen caractères max (word-wrap) */
function wrap(text: string, maxLen = COLS): string[] {
  const words = norm(text).split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (!cur) {
      cur = w.slice(0, maxLen);
    } else if (cur.length + 1 + w.length <= maxLen) {
      cur += ' ' + w;
    } else {
      lines.push(cur);
      cur = w.slice(0, maxLen);
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

function fmt(n: number): string {
  return n.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' F';
}

// ── Type de données du ticket ──────────────────────────────────────────────────

export interface TicketArticle {
  nom: string;
  quantite: number;
  prixUnitaire: number;
  remise: number;
  montantLigne: number;
}

export interface PrintTicketData {
  titre: string;
  numero: string;
  date: string;
  caissier: string;
  clientNom?: string | null;
  articles: TicketArticle[];
  sousTotal: number;
  remiseGlobale: number;
  valeurRemise: number;
  montantTVA: number;
  total: number;
  modePaiement: string;
  montantVerser?: number | null;
  monnaieRemis?: number | null;
}

// ── Générateur ESC/POS ─────────────────────────────────────────────────────────

export function buildTicket(data: PrintTicketData): Uint8Array {
  const b: number[] = [];

  // Initialisation
  b.push(...INIT, ...ALIGN_CENTER);

  // En-tête : titre en double taille (24 cols effectifs)
  b.push(...SIZE_2X, ...BOLD_ON);
  for (const l of wrap(data.titre.toUpperCase(), 22)) {
    b.push(...centered(l, 22), ...LF);
  }
  b.push(...SIZE_NORM, ...BOLD_OFF);
  b.push(...textLine('Point de vente'), ...LF);

  b.push(...sep());

  // Numéro / date / caissier
  b.push(...BOLD_ON, ...textLine('N ' + data.numero), ...BOLD_OFF);
  b.push(...textLine(data.date));
  b.push(...textLine('Caissier: ' + data.caissier));
  if (data.clientNom) b.push(...textLine('Client: ' + data.clientNom));
  b.push(...LF);

  b.push(...sep(), ...ALIGN_LEFT);

  // Articles
  for (const a of data.articles) {
    const lines = wrap(a.nom, COLS);
    b.push(...BOLD_ON, ...textLine(lines[0]), ...BOLD_OFF);
    for (let i = 1; i < lines.length; i++) b.push(...textLine('  ' + lines[i]));
    const qtyStr = `  ${a.quantite} x ${fmt(a.prixUnitaire)}${a.remise > 0 ? ` (-${a.remise}%)` : ''}`;
    b.push(...twoCol(qtyStr, fmt(a.montantLigne)));
  }

  b.push(...LF, ...sep());

  // Totaux
  b.push(...twoCol('Sous-total', fmt(data.sousTotal)));
  if (data.remiseGlobale > 0) {
    b.push(...twoCol(`Remise (-${data.remiseGlobale}%)`, '-' + fmt(data.valeurRemise)));
  }
  b.push(...twoCol('TVA', fmt(data.montantTVA)));
  b.push(...sep());
  b.push(...BOLD_ON, ...twoCol('TOTAL', fmt(data.total)), ...BOLD_OFF);

  b.push(...LF, ...sep(), ...ALIGN_CENTER);

  // Paiement
  b.push(...textLine('Paye par: ' + data.modePaiement));
  if (data.montantVerser != null && data.montantVerser > 0) {
    b.push(...ALIGN_LEFT);
    b.push(...twoCol('Recu:', fmt(data.montantVerser)));
    b.push(...twoCol('Rendu:', fmt(data.monnaieRemis ?? 0)));
    b.push(...ALIGN_CENTER);
  }

  b.push(...LF, ...sep(), ...LF);
  b.push(...centered('Merci de votre visite !'));
  b.push(...LF, ...LF, ...LF);
  b.push(...CUT);

  return new Uint8Array(b);
}
