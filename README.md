# Asa Seguros

Portal do cliente da Asa Seguros — plataforma web onde segurados podem consultar suas apólices, acompanhar sinistros, acessar documentos e entrar em contato com seu corretor.

## Tecnologias

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) — ícones

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Theu011/asa-seguros.git
cd asa-seguros
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse no navegador: [http://localhost:3000](http://localhost:3000)

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor em modo produção |
| `npm run lint` | Executa o linter |

## Estrutura do Projeto

```
asa-seguros/
├── app/                        # Rotas (Next.js App Router)
│   ├── (portal)/               # Layout do portal autenticado
│   │   ├── dashboard/          # Página principal do cliente
│   │   └── seguros/            # Listagem de apólices
│   ├── area-do-cliente/login/  # Página de login
│   └── page.tsx                # Landing page
├── components/
│   ├── portal/                 # Header, Sidebar, navegação
│   └── ui/                     # Componentes reutilizáveis
├── mock/                       # Dados fictícios para desenvolvimento
├── public/                     # Assets estáticos (logos, imagens)
└── types/                      # Tipos TypeScript
```

## Funcionalidades

- **Landing page** institucional da Asa Seguros
- **Portal do cliente** com autenticação
- **Dashboard** com resumo de apólices, sinistros e renovações
- **Área de seguros** com detalhes de cada apólice
- **Dados do corretor** e canais de contato
- Design responsivo, mobile-first
