import type { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: 'not-001',
    type: 'renovacao',
    title: 'Renovação do Seguro Auto em andamento',
    message:
      'Sua apólice AUTO-2024-00847 vence em 10/01/2025. Uma proposta de renovação foi enviada pelo seu corretor.',
    date: '2024-12-01T09:00:00',
    read: false,
    priority: 'alta',
    policyId: 'pol-001',
  },
  {
    id: 'not-002',
    type: 'documento',
    title: 'Proposta de renovação disponível',
    message:
      'A proposta de renovação do Seguro Auto (Porto Seguro) está disponível na sua central de documentos.',
    date: '2024-12-01T09:05:00',
    read: false,
    priority: 'media',
    policyId: 'pol-001',
  },
  {
    id: 'not-003',
    type: 'vencimento',
    title: 'Seguro Residencial vencido',
    message:
      'Sua apólice RES-2023-04412 venceu em 01/06/2024. Entre em contato com seu corretor para renovação.',
    date: '2024-06-02T08:00:00',
    read: true,
    priority: 'alta',
    policyId: 'pol-002',
  },
  {
    id: 'not-004',
    type: 'atendimento',
    title: 'Resposta do corretor recebida',
    message: 'Thiago Almeida respondeu seu protocolo ATD-2024-0381 sobre cobertura de colisão.',
    date: '2024-11-20T10:30:00',
    read: true,
    priority: 'media',
  },
  {
    id: 'not-005',
    type: 'sistema',
    title: 'Bem-vindo ao portal Asa Seguros',
    message: 'Seu acesso ao portal foi ativado. Aqui você acompanha todos os seus seguros em um só lugar.',
    date: '2024-01-10T12:00:00',
    read: true,
    priority: 'baixa',
  },
];

export const unreadCount = mockNotifications.filter((n) => !n.read).length;
