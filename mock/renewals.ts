import type { Renewal } from '@/types';

export const mockRenewals: Renewal[] = [
  {
    id: 'ren-001',
    policyId: 'pol-001',
    policyNumber: 'AUTO-2024-00847',
    type: 'auto',
    insurer: 'Porto Seguro',
    expirationDate: '2025-01-10',
    status: 'proposta_recebida',
    hasProposal: true,
    currentPremium: 3480,
    proposedPremium: 3620,
    notes: 'Proposta com reajuste de 4%. Mantém mesmas coberturas com assistência 24h ampliada.',
  },
  {
    id: 'ren-002',
    policyId: 'pol-002',
    policyNumber: 'RES-2023-04412',
    type: 'residencial',
    insurer: 'Bradesco Seguros',
    expirationDate: '2024-06-01',
    status: 'aguardando_cliente',
    hasProposal: true,
    currentPremium: 1240,
    proposedPremium: 1310,
    notes: 'Apólice já vencida. Aguardando confirmação para emissão.',
  },
];
