// ── Client ─────────────────────────────────────────────────────
export interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: Address;
  company?: string;
  since: string; // ISO date
  preferences: NotificationPreferences;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  renewalAlerts: boolean;
  expirationAlerts: boolean;
}

// ── Policy ─────────────────────────────────────────────────────
export type PolicyType = 'auto' | 'residencial' | 'vida' | 'empresarial' | 'viagem';
export type PolicyStatus = 'ativo' | 'vencido' | 'cancelado' | 'em_renovacao' | 'aguardando';

export interface Policy {
  id: string;
  number: string;
  type: PolicyType;
  insurer: string;
  status: PolicyStatus;
  startDate: string;
  endDate: string;
  premium: number; // annual value
  coverages: Coverage[];
  deductible?: number;
  insuredItems: InsuredItem[];
  brokerId: string;
  documentIds: string[];
}

export interface Coverage {
  name: string;
  limit: number;
  description?: string;
}

export interface InsuredItem {
  label: string;
  value: string;
}

// ── Document ────────────────────────────────────────────────────
export type DocumentCategory =
  | 'apolice'
  | 'proposta'
  | 'certificado'
  | 'comprovante'
  | 'sinistro'
  | 'renovacao'
  | 'outro';

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  policyId?: string;
  policyNumber?: string;
  date: string;
  sizeKb: number;
  url: string; // mock URL
}

// ── Renewal ─────────────────────────────────────────────────────
export type RenewalStatus = 'em_analise' | 'aguardando_cliente' | 'proposta_recebida' | 'renovado';

export interface Renewal {
  id: string;
  policyId: string;
  policyNumber: string;
  type: PolicyType;
  insurer: string;
  expirationDate: string;
  status: RenewalStatus;
  hasProposal: boolean;
  currentPremium?: number;
  proposedPremium?: number;
  notes?: string;
}

// ── Claim (Sinistro) ────────────────────────────────────────────
export type ClaimStatus = 'aberto' | 'em_analise' | 'aguardando_documentos' | 'encerrado' | 'indenizado';

export interface Claim {
  id: string;
  policyId: string;
  policyNumber: string;
  type: string;
  openDate: string;
  status: ClaimStatus;
  description: string;
  pendingDocuments: string[];
  nextAction?: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'pending';
}

// ── Request (Solicitação / Endosso) ─────────────────────────────
export type RequestType =
  | 'alteracao_cadastral'
  | 'segunda_via'
  | 'atualizacao_item'
  | 'endosso'
  | 'inclusao_exclusao'
  | 'cancelamento';

export type RequestStatus = 'aberto' | 'em_analise' | 'resolvido' | 'cancelado';

export interface Request {
  id: string;
  type: RequestType;
  policyId?: string;
  policyNumber?: string;
  date: string;
  status: RequestStatus;
  subject: string;
  description: string;
}

// ── Notification ────────────────────────────────────────────────
export type NotificationType =
  | 'vencimento'
  | 'documento'
  | 'renovacao'
  | 'sinistro'
  | 'atendimento'
  | 'sistema';

export type NotificationPriority = 'alta' | 'media' | 'baixa';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: NotificationPriority;
  policyId?: string;
}

// ── Broker ──────────────────────────────────────────────────────
export interface Broker {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatar?: string;
  role: string;
  workingHours: string;
}

// ── Message / Protocol ──────────────────────────────────────────
export type MessageStatus = 'enviado' | 'respondido' | 'encerrado';

export interface Message {
  id: string;
  protocol: string;
  subject: string;
  date: string;
  status: MessageStatus;
  preview: string;
  from: 'client' | 'broker';
  policyId?: string;
}
