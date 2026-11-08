# Prumo

Frontend web responsivo para ajudar pequenos negócios a organizar
estabelecimentos, serviços e agendamentos. A interface está em português do
Brasil e usa a API do Prumo para autenticação e operações de negócio.

## Requisitos

- Node.js e npm
- Uma instância acessível da API do Prumo

## Configuração e execução

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env.local` na raiz e configure a URL-base da API:

   ```env
   NEXT_PUBLIC_API_URL=<URL-base-da-API>
   ```

   A URL deve apontar para a API usada pelo frontend. Não inclua credenciais
   nesse arquivo nem publique valores de ambiente.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Funcionalidades disponíveis

| Rota | O que oferece |
| --- | --- |
| `/` | Página institucional com apresentação do Prumo. |
| `/registro` | Cadastro de uma conta de responsável pelo negócio. |
| `/login` | Acesso à conta com e-mail ou CPF e senha. |
| `/my-establishments` | Lista os estabelecimentos da conta e permite selecionar o estabelecimento ativo. |
| `/my-establishments/new` | Cadastro de um estabelecimento. |
| `/dashboard` | Resumo dos agendamentos, próximos atendimentos e ações de agenda. |
| `/services` | Criação, edição e remoção de serviços do estabelecimento selecionado. |
| `/settings` | Cadastro, edição e remoção dos horários de funcionamento. |
| `/establishments` | Consulta pública e paginada dos estabelecimentos cadastrados. |
| `/establishments/[id]` | Consulta dos dados e serviços de um estabelecimento. |

O painel do estabelecimento permite consultar os agendamentos, criar novos,
confirmar presença e cancelar agendamentos. Os serviços e os horários são
gerenciados para o estabelecimento selecionado.

## Estado atual

- As opções **Calendário**, **Clientes** e **Mensagens** do menu são exibidas
  como indisponíveis e não navegam para uma funcionalidade.
- O resumo e a lista de agendamentos usam dados da API. Os cartões de
  **Atividade Recente** e **Novos Clientes vs. Retorno** ainda exibem dados de
  exemplo e não representam indicadores conectados ao backend.
- A página pública de um estabelecimento apresenta informações e serviços; o
  fluxo de agendamento está disponível no painel do negócio.
- As telas que dependem de dados da API precisam de uma URL válida em
  `NEXT_PUBLIC_API_URL`.

## Integração e sessão

As chamadas dos serviços da aplicação usam `/api/backend` como base. A rota
`/api/backend/[...path]` encaminha as requisições para a API configurada e
repassa o cookie de sessão quando disponível. Após o login, o frontend mantém
o token em um cookie `HttpOnly`; o acesso a `/dashboard` valida a sessão com a
API. O identificador do estabelecimento ativo é armazenado no `localStorage`
do navegador.

## Tecnologias

- Next.js 16 e React 19
- TypeScript
- Tailwind CSS
- Axios para comunicação com a API
- Lucide React para ícones

## Comandos

```bash
npm run dev    # servidor de desenvolvimento
npm run lint   # análise estática com ESLint
npm run build  # compilação de produção
npm run start  # servidor de produção após o build
```

## Organização do código

- `app/`: rotas, páginas e componentes específicos das telas.
- `app/api/`: rotas do frontend para encaminhar chamadas à API e encerrar a sessão.
- `components/`: componentes reutilizáveis de interface.
- `lib/http/`: configuração do cliente HTTP.
- `lib/services/`: serviços e tipos para proprietários, estabelecimentos,
  serviços e agendamentos.
- `public/`: imagens e outros arquivos estáticos.
