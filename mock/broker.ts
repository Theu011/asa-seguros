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
    protocol: 'ATD-2025-0412',
    subject: 'Renovação do Seguro Auto – Proposta enviada',
    date: '2025-01-08T09:00:00',
    status: 'enviado',
    preview:
      'Enviamos a proposta de renovação do seu seguro auto com a Porto Seguro. Por favor, analise e nos informe se deseja prosseguir com as condições apresentadas.',
    from: 'broker',
    policyId: 'pol-001',
  },
  {
    id: 'msg-002',
    protocol: 'ATD-2024-0389',
    subject: 'Inclusão de condutor adicional – retorno',
    date: '2024-12-18T14:30:00',
    status: 'respondido',
    preview:
      'Olá Ricardo, para incluir a Camila como condutora adicional precisamos do número da CNH e data de nascimento dela. Pode nos enviar?',
    from: 'broker',
    policyId: 'pol-001',
  },
  {
    id: 'msg-003',
    protocol: 'ATD-2024-0381',
    subject: 'Dúvida sobre cobertura de colisão – Seguro Auto',
    date: '2024-11-20T10:30:00',
    status: 'respondido',
    preview:
      'Olá Ricardo, sobre sua dúvida: a cobertura de colisão inclui danos causados por colisão com outro veículo ou objeto fixo, conforme as condições gerais da apólice.',
    from: 'broker',
    policyId: 'pol-001',
  },
  {
    id: 'msg-004',
    protocol: 'ATD-2024-0355',
    subject: 'Atualização de dados cadastrais concluída',
    date: '2024-10-22T16:00:00',
    status: 'encerrado',
    preview:
      'Sua solicitação de atualização de e-mail e telefone foi processada com sucesso. Os novos dados já estão ativos no sistema.',
    from: 'broker',
    policyId: undefined,
  },
  {
    id: 'msg-005',
    protocol: 'ATD-2024-0319',
    subject: 'Segunda via – Apólice Residencial disponível',
    date: '2024-10-05T14:15:00',
    status: 'encerrado',
    preview:
      'O documento foi gerado e está disponível na sua central de documentos. Qualquer dúvida, estou à disposição.',
    from: 'broker',
    policyId: 'pol-002',
  },
];
