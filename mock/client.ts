import type { Client } from '@/types';

export const mockClient: Client = {
  id: 'cli-001',
  name: 'Ricardo Fernandes',
  cpf: '392.084.170-55',
  email: 'ricardo.fernandes@gmail.com',
  phone: '(11) 98765-4321',
  address: {
    street: 'Rua das Orquídeas',
    number: '452',
    complement: 'Apto 31',
    neighborhood: 'Jardim Paulista',
    city: 'São Paulo',
    state: 'SP',
    zip: '01408-000',
  },
  company: undefined,
  since: '2020-03-15',
  preferences: {
    email: true,
    sms: false,
    whatsapp: true,
    renewalAlerts: true,
    expirationAlerts: true,
  },
};
