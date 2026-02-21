// ── Design Document ─────────────────────────────────────────────────
export interface DesignDocument {
  id: string;
  name: string;
  width: number;
  height: number;
  objects: CanvasObject[];
  updatedAt: string;
  createdAt: string;
  published: boolean;
}

export interface CanvasObject {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  rotation: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  src?: string;
  locked?: boolean;
  visible?: boolean;
  name: string;
}

// ── Portfolio Document ──────────────────────────────────────────────
export interface PortfolioDocument {
  id: string;
  name: string;
  pages: PortfolioPage[];
  updatedAt: string;
  createdAt: string;
  published: boolean;
}

export interface PortfolioPage {
  id: string;
  title: string;
  sections: SectionBlock[];
}

export interface SectionBlock {
  id: string;
  type: 'hero' | 'gallery' | 'text' | 'cta' | 'columns';
  content: Record<string, unknown>;
  style?: Record<string, string>;
}

// ── Page Document (Website Page Builder) ────────────────────────────
export interface PageDocument {
  id: string;
  name: string;
  slug: string;
  tree: RowNode[];
  updatedAt: string;
  createdAt: string;
  published: boolean;
}

export interface RowNode {
  id: string;
  type: 'row';
  style: Record<string, string>;
  columns: ColumnNode[];
}

export interface ColumnNode {
  id: string;
  type: 'column';
  width: string;
  style: Record<string, string>;
  children: BlockNode[];
}

export type BlockType = 'text' | 'image' | 'button' | 'link' | 'spacer' | 'divider';

export interface BlockNode {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
  style: Record<string, string>;
}

// ── Shared utility ──────────────────────────────────────────────────
export type DocumentType = 'design' | 'portfolio' | 'page';

export type AnyDocument = DesignDocument | PortfolioDocument | PageDocument;
