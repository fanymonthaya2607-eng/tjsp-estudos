# TJSP Estudos — Escrevente Técnico Judiciário

Plataforma pessoal de estudos para o concurso de **Escrevente Técnico Judiciário do TJSP** (banca **VUNESP**): banco de questões, simulados, revisão inteligente, painel de desempenho e gamificação.

> **Etapa 1 (esta entrega): MVP visual e funcional com dados de exemplo.**
> Login com Google, banco de dados real e IA entram nas próximas etapas — veja [Próximos passos](#próximos-passos).

---

## O que já funciona nesta etapa

- Dashboard com saudação, sequência de dias, XP, taxa de acerto e atalhos ("Estudar agora", "Revisar erros", "Desafio diário").
- Fluxo completo de responder questão: seleção de alternativa → correção imediata → explicação → por que as outras alternativas estão erradas → dica de prova → próxima questão.
- 8 modos de estudo: Estudo Livre, Revisão de Erros, Questões Difíceis, Revisão Inteligente, Simulado, Treino VUNESP, Desafio Diário e Treino de um Assunto.
- Tela de Desempenho (por matéria e por assunto) e tela de Revisão (erros e questões salvas).
- ~16 questões de exemplo, **todas identificadas como [INÉDITA] — geradas para treinamento**, cobrindo Português, Direito Constitucional, Direito Administrativo, Direito Processual Civil, Informática e Raciocínio Lógico.
- Schema completo do banco de dados (`prisma/schema.prisma`) já modelando tudo que o projeto vai precisar: edital versionado, matérias/assuntos/subassuntos, questões (oficiais/inéditas/adaptadas), respostas, repetição espaçada, simulados, gamificação e histórico do Professor IA.
- Script de seed (`prisma/seed.ts`) pronto para popular um banco PostgreSQL real com os mesmos dados de exemplo.

Por enquanto, os dados vêm de `src/lib/mock-data.ts` (não há login nem banco de dados ligado ainda) — isso é proposital, para você já poder ver e testar a experiência completa antes de conectarmos a infraestrutura real.

## Stack

- **Frontend/Backend:** Next.js 16 (App Router) + React 19 + TypeScript
- **Estilo:** Tailwind CSS v4
- **Banco de dados:** PostgreSQL via Prisma ORM 7 (schema pronto, ainda não conectado)
- **Autenticação (próxima etapa):** NextAuth.js (Auth.js) com Google OAuth
- **Hospedagem:** Vercel
- **Ícones:** lucide-react

## Estrutura de pastas

```
src/
  app/                 rotas (App Router)
    page.tsx           dashboard
    estudar/           seleção de modo + estudo livre
    estudar/sessao/    fluxo de responder questões
    desempenho/        painel de desempenho
    revisar/           erros e questões salvas
    simulados/         lista de simulados
  components/          componentes de UI reutilizáveis
  lib/
    types.ts           tipos do domínio (espelham o schema Prisma)
    mock-data.ts        dados de exemplo (edital, matérias, questões)
    study-engine.ts     regras de seleção de questões por modo de estudo
prisma/
  schema.prisma         modelo completo do banco de dados
  seed.ts                popula o banco com os dados de exemplo
```

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000 — o app já funciona de ponta a ponta com os dados de exemplo, sem precisar de banco de dados ou variáveis de ambiente para isso.

## Preparando o banco de dados real (próxima etapa)

O schema já está pronto em `prisma/schema.prisma`. A partir do Prisma 7, a *connection string* não fica mais dentro do schema — ela é configurada em `prisma.config.ts` (na raiz do projeto), que já está pronto para ler `DATABASE_URL` do `.env`. Quando quiser conectar um banco de verdade:

1. Crie um banco PostgreSQL gratuito (recomendado: [Neon](https://neon.tech) ou [Supabase](https://supabase.com) — ambos têm integração de um clique com a Vercel).
2. Copie a *connection string* para `DATABASE_URL` no arquivo `.env` (localmente) e também nas variáveis de ambiente do projeto na Vercel.
3. Rode as migrations e o seed:
   ```bash
   npm run db:migrate   # cria as tabelas
   npm run db:seed      # popula com o edital e as questões de exemplo
   ```
4. Rode `npm run db:studio` para navegar pelos dados visualmente (Prisma Studio).

> **Nota:** neste ambiente de desenvolvimento (sandbox) usado para montar o projeto, não foi possível baixar os binários do motor do Prisma por causa de uma restrição de rede do próprio sandbox — por isso o schema foi validado com `prisma validate` (que confirma a configuração sem precisar baixar o motor) e a interface foi testada inteiramente com dados de exemplo. Isso **não afeta você**: na sua máquina ou no build da Vercel, `npx prisma generate`/`migrate` funcionam normalmente.
>
> Enquanto o banco real não está conectado, mantenha um valor qualquer (placeholder) em `DATABASE_URL` — tanto no `.env` local quanto nas variáveis de ambiente da Vercel — para que `prisma generate` (rodado automaticamente a cada instalação via `postinstall`) não falhe por falta da variável.

## Variáveis de ambiente

Veja `.env.example`. Nunca commite o arquivo `.env` com valores reais (ele já está no `.gitignore`).

| Variável | Para que serve | Quando configurar |
|---|---|---|
| `DATABASE_URL` | Conexão com o PostgreSQL | Próxima etapa (banco real) |
| `AUTH_SECRET` | Chave de sessão do NextAuth | Próxima etapa (login) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Credenciais OAuth do Google | Próxima etapa (login) |
| `ANTHROPIC_API_KEY` | Geração de questões / Professor IA | Etapa futura (IA) |

### Como criar as credenciais do Google OAuth (quando chegarmos lá)

1. Acesse https://console.cloud.google.com/apis/credentials
2. Crie um projeto (ex.: "TJSP Estudos").
3. Em **Tela de consentimento OAuth**, configure como "Externo" e adicione o e-mail da sua esposa como usuário de teste (enquanto o app não for verificado pelo Google).
4. Em **Credenciais → Criar credenciais → ID do cliente OAuth**, tipo "Aplicativo da Web".
5. Em "URIs de redirecionamento autorizados", adicione:
   - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
   - `https://SEU-DOMINIO.vercel.app/api/auth/callback/google` (produção, depois do deploy)
6. Copie o *Client ID* e o *Client Secret* para `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`.

## Deploy na Vercel

1. Suba este projeto para um repositório no GitHub (veja abaixo).
2. Em https://vercel.com/new, importe o repositório.
3. Configure as variáveis de ambiente (mesmas do `.env`) no painel da Vercel.
4. A Vercel builda automaticamente a cada push — o `prisma generate` roda no build sem nenhum problema (diferente deste sandbox de desenvolvimento).

## Sobre a origem das questões

Todas as questões desta primeira entrega são **[INÉDITA] — geradas para treinamento**, inspiradas em temas recorrentes de concursos de nível médio organizados pela banca VUNESP. Nenhuma questão real de prova foi copiada. O schema já está preparado para receber questões **[OFICIAL]** (de provas reais, quando você tiver o direito de utilizá-las) e **[ADAPTADA]** (baseada em um conceito de uma questão real, com enunciado e alternativas totalmente novos), sempre identificando claramente a origem — conforme especificado no projeto.

## Próximos passos

Seguindo o plano de evolução (MVP → funcionalidades avançadas):

1. **Login com Google + banco de dados real** — conectar NextAuth + Prisma + PostgreSQL, persistindo progresso por usuária.
2. **Histórico e repetição espaçada de verdade** — usar `UserAnswer` e `UserQuestionProgress` para calcular `nextReviewAt`.
3. **Simulados com cronômetro e distribuição configurável por matéria.**
4. **Gerador de questões com IA** (fluxo: IA geradora → IA revisora → validação → banco).
5. **Professor IA** (chat contextual sobre a questão atual e o histórico de erros).
6. **Gamificação completa** (conquistas, metas semanais).
7. **Área administrativa** (importar/aprovar questões, editar matérias e assuntos).

Cada etapa será entregue de forma testável, como esta.
