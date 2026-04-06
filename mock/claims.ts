import type { Claim } from '@/types';

export const mockClaims: Claim[] = [
  {
    id: 'sin-001',
    policyId: 'pol-001',
    policyNumber: 'AUTO-2024-00847',
    type: 'Colisão',
    openDate: '2024-10-12',
    status: 'em_analise',
    description: 'Colisão traseira em semáforo na Av. Paulista. Danos no para-choque e tampa do porta-malas.',
    pendingDocuments: ['Boletim de Ocorrência', 'Fotos do veículo'],
    nextAction: 'Aguardar vistoria da seguradora',
    timeline: [
      {
        date: '2024-10-12T15:30:00',
        title: 'Sinistro aberto',
        description: 'Sinistro registrado pelo cliente via portal.',
        type: 'info',
      },
      {
        date: '2024-10-13T09:00:00',
        title: 'Documentação recebida',
        description: 'Porto Seguro confirmou recebimento do BO e das fotos.',
        type: 'success',
      },
      {
        date: '2024-10-15T11:00:00',
        title: 'Vistoria agendada',
        description: 'Vistoria marcada para 18/10 às 10h na Av. Rebouças, 1200.',
        type: 'info',
      },
      {
        date: '2024-10-18T10:30:00',
        title: 'Vistoria realizada',
        description: 'Vistoria concluída. Laudo em análise pela seguradora.',
        type: 'success',
      },
      {
        date: '2024-10-22T00:00:00',
        title: 'Em análise',
        description: 'Aguardando parecer final da Porto Seguro.',
        type: 'pending',
      },
    ],
  },
];
