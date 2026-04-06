import { clsx, type ClassValue } from 'clsx';
import { format, parseISO, differenceInDays, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type {
  PolicyType,
  PolicyStatus,
  DocumentCategory,
  RenewalStatus,
  ClaimStatus,
  RequestType,
  RequestStatus,
  NotificationType,
  NotificationPriority,
} from '@/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ── Date formatting ──────────────────────────────────────────────
export function formatDate(date: string): string {
  return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDateLong(date: string): string {
  return format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function daysUntil(date: string): number {
  return differenceInDays(parseISO(date), new Date());
}

export function isExpiringSoon(date: string, thresholdDays = 30): boolean {
  const days = daysUntil(date);
  return days >= 0 && days <= thresholdDays;
}

export function isExpired(date: string): boolean {
  return !isAfter(parseISO(date), new Date());
}

// ── Currency ─────────────────────────────────────────────────────
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// ── Policy labels ────────────────────────────────────────────────
export const policyTypeLabel: Record<PolicyType, string> = {
  auto: 'Seguro Auto',
  residencial: 'Residencial',
  vida: 'Seguro de Vida',
  empresarial: 'Empresarial',
  viagem: 'Viagem',
};

export const policyStatusLabel: Record<PolicyStatus, string> = {
  ativo: 'Ativo',
  vencido: 'Vencido',
  cancelado: 'Cancelado',
  em_renovacao: 'Em Renovação',
  aguardando: 'Aguardando',
};

export const policyStatusColor: Record<PolicyStatus, string> = {
  ativo: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  vencido: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  cancelado: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  em_renovacao: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  aguardando: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
};

// ── Document labels ───────────────────────────────────────────────
export const documentCategoryLabel: Record<DocumentCategory, string> = {
  apolice: 'Apólice',
  proposta: 'Proposta',
  certificado: 'Certificado',
  comprovante: 'Comprovante',
  sinistro: 'Sinistro',
  renovacao: 'Renovação',
  outro: 'Outro',
};

// ── Renewal labels ────────────────────────────────────────────────
export const renewalStatusLabel: Record<RenewalStatus, string> = {
  em_analise: 'Em Análise',
  aguardando_cliente: 'Aguardando você',
  proposta_recebida: 'Proposta Recebida',
  renovado: 'Renovado',
};

export const renewalStatusColor: Record<RenewalStatus, string> = {
  em_analise: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  aguardando_cliente: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  proposta_recebida: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  renovado: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

// ── Claim labels ──────────────────────────────────────────────────
export const claimStatusLabel: Record<ClaimStatus, string> = {
  aberto: 'Aberto',
  em_analise: 'Em Análise',
  aguardando_documentos: 'Aguardando Docs',
  encerrado: 'Encerrado',
  indenizado: 'Indenizado',
};

export const claimStatusColor: Record<ClaimStatus, string> = {
  aberto: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  em_analise: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  aguardando_documentos: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  encerrado: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  indenizado: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

// ── Request labels ────────────────────────────────────────────────
export const requestTypeLabel: Record<RequestType, string> = {
  alteracao_cadastral: 'Alteração Cadastral',
  segunda_via: 'Segunda Via',
  atualizacao_item: 'Atualização de Item',
  endosso: 'Endosso',
  inclusao_exclusao: 'Inclusão / Exclusão',
  cancelamento: 'Cancelamento',
};

export const requestStatusLabel: Record<RequestStatus, string> = {
  aberto: 'Aberto',
  em_analise: 'Em Análise',
  resolvido: 'Resolvido',
  cancelado: 'Cancelado',
};

export const requestStatusColor: Record<RequestStatus, string> = {
  aberto: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  em_analise: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  resolvido: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  cancelado: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

// ── Notification labels ───────────────────────────────────────────
export const notificationTypeLabel: Record<NotificationType, string> = {
  vencimento: 'Vencimento',
  documento: 'Documento',
  renovacao: 'Renovação',
  sinistro: 'Sinistro',
  atendimento: 'Atendimento',
  sistema: 'Sistema',
};

export const notificationPriorityColor: Record<NotificationPriority, string> = {
  alta: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  media: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  baixa: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
};
