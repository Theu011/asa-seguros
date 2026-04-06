import type { Broker, Message } from '@/types';

export const mockBroker: Broker = {
  id: 'brk-001',
  name: 'Thiago Almeida',
  email: 'thiago@asaseguros.com.br',
  phone: '(11) 3456-7890',
  whatsapp: '(11) 98234-5678',
  role: 'Corretor Responsável',
  workingHours: 'Seg–Sex, 9h às 18h',
};

export const mockMessages: Message[] = [
  {
    id: 'msg-001',
    protocol: 'ATD-2024-0381',
    subject: 'Dúvida sobre cobertura de colisão – Seguro Auto',
    date: '2024-11-20T10:30:00',
    status: 'respondido',
    preview:
      'Olá Ricardo, sobre sua dúvida a cobertura de colisão inclui danos causados por colisão com outro veículo ou objeto...',
    from: 'broker',
    policyId: 'pol-001',
  },
  {
    id: 'msg-002',
    protocol: 'ATD-2024-0319',
    subject: 'Solicitação de segunda via – Apólice Residencial',
    date: '2024-10-05T14:15:00',
    status: 'encerrado',
    preview:
      'O documento foi gerado e está disponível na sua central de documentos. Qualquer dúvida, estou à disposição.',
    from: 'broker',
    policyId: 'pol-002',
  },
  {
    id: 'msg-003',
    protocol: 'ATD-2024-0412',
    subject: 'Renovação do Seguro Auto – Proposta enviada',
    date: '2024-12-01T09:00:00',
    status: 'enviado',
    preview:
      'Enviamos a proposta de renovação do seu seguro auto com a Porto Seguro. Por favor, analise e nos informe...',
    from: 'broker',
    policyId: 'pol-001',
  },
];
