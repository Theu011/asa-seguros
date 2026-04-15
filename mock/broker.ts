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
    thread: [
      {
        from: 'broker',
        date: '2025-01-08T09:00:00',
        body: 'Olá Ricardo, tudo bem? Estamos entrando em contato pois a apólice AUTO-2024-00847 vence em 10 de janeiro. Preparamos a proposta de renovação com a Porto Seguro com as mesmas coberturas atuais. O valor proposto é de R$ 3.620,00/ano — um reajuste de 4% em relação ao prêmio atual.\n\nA proposta está disponível na central de documentos. Qualquer dúvida, estou à disposição. Precisamos da sua confirmação até dia 08/01 para garantir a continuidade da cobertura sem intervalo.',
      },
    ],
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
    thread: [
      {
        from: 'client',
        date: '2024-12-17T10:15:00',
        body: 'Olá Thiago, gostaria de incluir minha esposa Camila Fernandes como condutora adicional no seguro do meu carro. O que preciso fazer?',
      },
      {
        from: 'broker',
        date: '2024-12-18T14:30:00',
        body: 'Olá Ricardo! Para incluir a Camila como condutora adicional habitual precisamos de algumas informações:\n\n• Número da CNH da Camila\n• Data de nascimento\n• Categoria da habilitação\n\nCom esses dados solicitamos o endosso à Porto Seguro. Em geral leva de 2 a 3 dias úteis e pode haver um pequeno reajuste no prêmio dependendo do perfil. Pode nos enviar?',
      },
      {
        from: 'client',
        date: '2024-12-19T09:00:00',
        body: 'Olá! Segue as informações:\n\nCNH: 01234567890\nData de nascimento: 15/03/1990\nCategoria: B\n\nAguardo o retorno!',
      },
    ],
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
    thread: [
      {
        from: 'client',
        date: '2024-11-19T16:45:00',
        body: 'Thiago, tenho uma dúvida. Se eu bater o carro num poste, isso cobre pelo seguro? Ou a cobertura de colisão é só com outro veículo?',
      },
      {
        from: 'broker',
        date: '2024-11-20T10:30:00',
        body: 'Boa tarde, Ricardo! Sim, colisão com poste está coberto. A cobertura de colisão da sua apólice inclui:\n\n• Colisão com outro veículo (em movimento ou parado)\n• Colisão com objetos fixos (postes, muros, grades, etc.)\n• Capotamento e tombamento\n\nNesse caso você acionaria o seguro, passaria por vistoria, pagaria a franquia de R$ 2.200,00 e a seguradora arcaria com o restante do conserto. Ficou claro? Qualquer dúvida é só falar!',
      },
      {
        from: 'client',
        date: '2024-11-20T11:15:00',
        body: 'Perfeito, Thiago! Muito obrigado pela explicação. Agora ficou bem claro. Abraço!',
      },
    ],
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
    thread: [
      {
        from: 'client',
        date: '2024-10-21T09:30:00',
        body: 'Olá Thiago, preciso atualizar meu telefone e e-mail no cadastro. Meu novo celular é (11) 99887-6655 e o novo e-mail é ricardo.fernandes@gmail.com.',
      },
      {
        from: 'broker',
        date: '2024-10-21T14:00:00',
        body: 'Olá Ricardo! Solicitação recebida. Vou encaminhar a atualização para o nosso time. Deve ser concluída até amanhã. Te aviso por aqui quando estiver pronto!',
      },
      {
        from: 'broker',
        date: '2024-10-22T16:00:00',
        body: 'Ricardo, boa notícia! Os dados já foram atualizados com sucesso no nosso sistema:\n\n• Telefone: (11) 99887-6655\n• E-mail: ricardo.fernandes@gmail.com\n\nA partir de agora todas as comunicações serão enviadas para o novo e-mail. Qualquer dúvida estou à disposição. Atenciosamente, Thiago.',
      },
    ],
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
    thread: [
      {
        from: 'client',
        date: '2024-10-04T11:00:00',
        body: 'Thiago, preciso de uma segunda via da minha apólice residencial (RES-2023-04412). Poderia me enviar o PDF?',
      },
      {
        from: 'broker',
        date: '2024-10-04T15:30:00',
        body: 'Olá Ricardo! Claro, vou solicitar a segunda via junto à Bradesco Seguros. Deve ficar pronto em 1 dia útil. Assim que estiver disponível deixarei na sua central de documentos e te aviso aqui.',
      },
      {
        from: 'broker',
        date: '2024-10-05T14:15:00',
        body: 'Ricardo, a segunda via da apólice RES-2023-04412 já está disponível na sua central de documentos. Basta acessar a seção "Documentos" e baixar o arquivo "Apólice RES-2023-04412". Qualquer dúvida é só falar. Abraço!',
      },
    ],
  },
];
