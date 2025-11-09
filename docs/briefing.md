# Contexto de Fundamentos — Hackathon Brendi (Gestão Web + Agent)

> **Propósito**  
> Consolidar *somente os fundamentos* do produto, dados e arquitetura — sem travar em modelos finais — e trazer **as mensagens do usuário exatamente como foram enviadas**, seguidas do **reasoning** (o que discutimos e quais decisões/linhas mestras saíram dali).  
> Este arquivo é pensado para ser usado como **contexto por outras IAs** (geração de código, prompts, docs e decisões táticas), preservando a intenção do projeto.

---

## 0) Histórico das **mensagens do usuário** (texto original) + Reasoning

### 0.1 Mensagem
```
Estou participando desse hackathon e preciso definir o escopo tecnológico que eu vou usar, como você sugere que eu me organize para atacar esse problema?

README do hackathon

# 🧠 Gestão Web + Agent · Hackathon Brendi
Mini hackathon para engenheiros de software seniores com foco em construir a melhor experiência de análise de gestão para donos de restaurantes Brendi.

## 🎯 Objetivo
Desenvolver um dashboard web integrado a um agente LLM para análise de dados brutos.

## 📦 Entregáveis
- Dashboard Web funcional
- Experiência de chat com agente LLM
- Deploy ativo
- Código em uma branch desse repositório com um README apresentativo do projetos e das principais decisões técnicas

## 🗂 Dados
Base raw da loja Bambinella (JSON) sem formatação prévia

## 🛠 Stack
Livre escolha de linguagem, framework e infraestrutura

Tokens disponíveis para: OpenAI, Anthropic, Grok, Gemini

## 🧪 Avaliação
- **Produtividade** → entregar um produto funcionando bem, com robustez, features, etc, na infra que precisar pra fazer isso rodar
- Qualidade técnica do **código** → o quanto tem problemas de código complexo, sem seguir princípios de responsabilidade única, etc
    - Baixo cognitive loading: tem que ser fácil bater o olho na estrutura de pastas/arquivos/funções, saber o que está acontecendo e se achar no projeto
    - Baixo overengineering: abstrações enxutas e limpas, sem focar muito em edge cases do futuro → foco em tech simples pra produto funcional
- Boa escolha de **tecnologias** e **arquitetura escalável**: o racional das decisões técnicas tem que ficar o mais clara possível, sem escolha por hype ou sem saber o porquê
- Qualidade de construção do **produto** → o quanto o produto realmente é bom e encanta quem o utiliza
```
**Reasoning (o que discutimos/decidimos):**
- **Prioridade**: entregar valor prático rápido dentro do escopo — dashboard + agente LLM + deploy — com ênfase em clareza de arquitetura e baixo overengineering.
- **Estratégia**: dividir em 4 frentes: (1) escopo funcional mínimo; (2) stack simples e produtiva; (3) arquitetura com separação de responsabilidades; (4) plano de ataque incremental.
- **Diretriz**: todo artefato e código precisa contar uma **história coerente** ligando dor do usuário → escolha técnica → entrega.

---

### 0.2 Mensagem
```
Agora que você tem um contexto melhor do hackathon... Esses serão os critérios de avaliação:

- Produto: Como resolve as dores do cliente, para mim as principais dores hoje são que os donos de restaurantes não tem conhecimento técnico para conseguir tirar insights profundos a partir dos dados que ele possui sobre o próprio restaurante
- Infra: O quão robusto e escalável está a implementação, o porque de cada escolha técnica é importante
- Codigo: Baixo cognitive load, baixo overengineering
- Produtividade: O quanto de tudo que foi definido eu consegui entregar
```
**Reasoning:**
- **Foco de Produto**: o sistema deve **pensar pela pessoa**, traduzindo dados brutos em **insights compreensíveis** (não só gráficos).
- **Infra**: todas as escolhas precisam ter **racional explícito** (por que é simples/robusto/escala).
- **Código**: baixa complexidade cognitiva → organização de pastas clara; funções pequenas; sem abstrações prematuras.
- **Produtividade**: plano faseado para garantir *end-to-end* funcional cedo e polimento depois.

---

### 0.3 Mensagem
```
Pensando um pouco mais sobre produto, já pensei quais áreas de gestão pretendo atacar: 
"Vendas",
"Feedbacks", 
"Cardápio", 
"Clientes"

A partir disso quero ter um dashboard simples para visualização, pense o que é relevante para o dono de restaurante em cada uma dessas áreas

Na parte do agent, será no Whatsapp para fácil acesso, o agent a princípio será reativo e proativo, então ele também deve conseguir enviar disparos e mensagens diárias com insights

Seria bom pensar nessa entidade insights, pois ambas as features reativas (Conversacional e Dashboard) quanto as features proativas (Disparo no Whatsapp) provavelmente vão olhar para a mesma entidade,

Essa entidade pode ser comparações: "Seu faturamento esse mês foi menor", "Ontem o tempo de entrega foi maior do que nas últimas sexta feiras"

Podem ser alertas: "Você teve 2 feedbacks bem baixos ontem"

Gostaria de clarear um pouco mais os fundamentos do que eu vou fazer
```
**Reasoning:**
- **Áreas-chave**: Vendas, Feedbacks, Cardápio, Clientes — guiam métricas e perguntas que o dono faria.
- **Canais**: Dashboard (visual), Chat (reativo) e WhatsApp (proativo). **Mesma inteligência** servindo todos.
- **Conceito central**: uma **entidade de Insight** como “átomo de inteligência” compartilhado; **não travamos em um modelo final agora**, apenas no princípio: *comparar, alertar, sugerir ação*.
- **Fundamento**: arquitetura *insight-first* (regras → gerações → distribuição).

---

### 0.4 Mensagem
```
Legal, agora vamos pensar na infra e tech,
Coisas que estou familiarizado:
- Typescript
- GCP
- Firebase
- Serverless
- Supabase
- Nuxt, Vue

Acho que minha produtividade será maior se eu ficar próximo dessas coisas, de resto podemos pensar no que será mais robusto e escalável
```
**Reasoning:**
- **Stack guiada por produtividade**: Nuxt 3 + Vue + TypeScript (monolito com server routes), rodando serverless (Cloud Run).
- **LLM** com *tool calling* e adaptador simples (provider-agnostic).
- **Jobs** disparados por HTTP (Cloud Scheduler) — mesma lógica pode ser acionada por botão no dashboard durante a demo.
- **Banco** inicialmente livre; decisão adiante conforme conforto.

---

### 0.5 Mensagem
```
Acho que o Firestore como banco, por ser relacional e fácil de reestruturar e refazer as coisas, mexer nos dados etc, acho que seria melhor
```
**Reasoning:**
- Adotamos **Firestore** como armazenamento principal (apesar de ser NoSQL, atende bem a **iteração rápida**, materializações e coleção por restaurante).
- **Fundamento de dados**: modelar por **namespace de restaurante**, aceitar **denormalização controlada** e **materializações por período** para consultas simples e baratas.
- Sem travar em schema final: começamos simples e evoluímos conforme perguntas/insights pedirem.

---

### 0.6 Mensagem
```
OBJETIVO: Legal, gere um .md com tudo isso que você acabou de me falar e um contexto sobre o que eu to fazendo de produto e sobre o hackathon, pense "Como consolido todo o contexto do que discutimos para que outra IA consiga entender também"

IMPORTANTE: Deve ter o histórico das minhas mensagem!

O QUE EU QUERO: Quero colocar como contexto para outras IAs que vou usar

OBS.: Pense com calma
```
**Reasoning:**
- Criamos um documento de contexto consolidado e, agora, **expandimos** com foco **em fundamentos** (sem definições finais de tipos/insights), incluindo **as mensagens originais** e a linha de raciocínio após cada uma.

---

## 1) Fundamentos de Produto (sem “modelo final”)

- **Problema**: donos não técnicos querem **decidir** rapidamente; não querem “navegar dados”.
- **Princípios de UX**:
  - “O que olhar hoje?” sempre visível (insights priorizados por relevância/severidade).
  - Linguagem **simples** e **comparativa** (vs período anterior ou média histórica).
  - CTA claro (“ver detalhe”, “abrir gráfico”, “ver itens que causaram isso”).
- **Áreas de gestão** (Vendas, Feedbacks, Cardápio, Clientes):
  - Para cada área, **perguntas fundamentais** (ex.: “estou melhor ou pior?”; “o que puxou o resultado?”; “onde está a dor?”).
  - **Cortes** úteis (tempo, canal, produto, horário, novo vs recorrente).
- **Canais**:
  - **Dashboard**: visão consolidada + shortlist de insights do dia.
  - **Chat (reativo)**: conversa guiada por ferramentas de consulta; respostas explicativas com próxima pergunta sugerida.
  - **WhatsApp (proativo)**: resumos/alertas curtos e úteis, com limite de ruído.
- **Qualidade do Insight** (critérios):
  - **Relevância** (impacto, severidade, novidade).
  - **Explicabilidade** (o que aconteceu + por que importa).
  - **Ação sugerida** (quando fizer sentido).
  - **Calibração** (evitar falsos positivos; thresholds conservadores no começo).
  - **Consistência** (mesma lógica entre canais).

---

## 2) Fundamentos de Dados & Firestore (sem schema fechado)

- **Organização**: tudo abaixo de `restaurants/{restaurantId}/...` (ordens, feedbacks, insights, mensagens). *Nome das coleções pode evoluir*.
- **Importação**: processo **idempotente**; versionar origem/import; permitir reprocessar.
- **Granularidade**: começar simples (documento por pedido/feedback) e **denormalizar** itens quando reduzir custo de leitura (evitar fan-out excessivo).
- **Agregações**: calcular em memória/servidor para períodos curtos; **materializar** agregados diários/semanas quando necessário.
- **Indexação**: planejar **queries por período** e por **chaves de filtro** (ex.: dateKey, área, severidade), criando índices conforme uso real.
- **Custo & limites**: preferir **leituras por período** previsíveis; evitar scans amplos.
- **Evolução**: tolerar mudanças no formato dos documentos; versionar geradores de insights se a lógica mudar.
- **Privacidade**: armazenar o mínimo necessário; logs de mensagens sem dados sensíveis quando possível.

---

## 3) Fundamentos de Arquitetura & Infra

- **Monolito Nuxt 3 (server routes)**: reduz complexidade; front+API no mesmo repo.
- **Separação por camadas (conceito)**:
  - **dados** (carregar/consultar),
  - **analytics** (agregações e cálculos),
  - **insights** (regras e priorização),
  - **api** (exposição HTTP),
  - **integrations** (LLM, WhatsApp).
- **LLM (agent)**:
  - **Tool calling** como integração padrão (LLM descreve intenção, servidor executa consultas).
  - **Determinismo**: máximo possível fora do modelo (regras e cálculos no servidor).
  - **Custo**: preferir prompts curtos e respostas objetivas; reusar insights já gerados.
- **Jobs**:
  - Lógica de geração de insights **acionável via HTTP** (Cloud Scheduler em prod; botão manual na demo).
  - Idempotência: evitar duplicidades e controlar janela temporal.
- **Deploy**:
  - **Cloud Run** (serverless), Firestore gerenciado; alternativa rápida: Vercel (compatível).
- **Observabilidade**:
  - Logs dos jobs (tempo, nº de insights, erros).
  - Métricas simples (latência API, falhas por endpoint).
  - Traços mínimos para conversas do chat (sem conteúdo sensível).

---

## 4) Fundamentos do Agent & WhatsApp (sem travar em impl. específica)

- **Reativo (Chat)**:
  - Entradas: pergunta natural.
  - Saídas: resposta explicativa + sugestão de próximo passo.
  - Ferramentas: KPIs, listagem de insights por período/área, top produtos/horários.
  - **Fallback**: quando não houver dado suficiente, responder com transparência.
- **Proativo (WhatsApp)**:
  - **Periodicidade**: diária/semanais com *budget* de mensagens (evitar fadiga).
  - **Seleção**: priorizar insights de maior severidade/impacto; limite (ex.: 3–5).
  - **Conteúdo**: curto, comparativo, com link/CTA para ver detalhe no dashboard.
  - **Consentimento**: canal opt-in; fácil pausar/silenciar.

---

## 5) Fundamentos de Código & Qualidade

- **Baixo cognitive load**: nomes explícitos; funções pequenas; pastas por responsabilidade.
- **Sem overengineering**: evitar camadas genéricas sem demanda; começar direto e evoluir.
- **Testabilidade**: regras de insights e cálculos desacoplados de HTTP/LLM.
- **Resiliência**: validação de entradas; tratamento de ausência de dados.
- **Documentação**: README curto explicando *porquês*; comentários só onde há regra de negócio.

---

## 6) Fundamentos de Produtividade & Escopo

- **Entrega incremental** (end-to-end cedo): importar dados → KPIs → primeiros insights → dashboard → chat → proativo.
- **Demonstração clara**: roteiro simples mostrando “O que olhar hoje?” e um fluxo conversacional útil.
- **Cortes conscientes**: começar com 1–2 áreas bem feitas (ex.: Vendas e Feedbacks) e expandir se sobrar tempo.
- **Métricas de sucesso**: nº de insights úteis/dia, tempo para responder perguntas comuns, estabilidade do job.

---

## 7) Como outras IAs devem usar este contexto

- **Evitar** propor modelos/tipos definitivos neste estágio; manter **flexibilidade**.
- **Sugerir** implementações que respeitem:
  - a separação de camadas,
  - a centralidade dos insights,
  - a simplicidade operacional (serverless + Firestore),
  - e a reusabilidade entre canais (dashboard/chat/WhatsApp).
- **Quando gerar código**, priorizar:
  - endpoints essenciais,
  - lógica de agregação simples e clara,
  - função de seleção/priorização de insights,
  - UX que explique o “porquê” dos números.

---

> **Nota final**: Este documento é deliberadamente **fundacional**. Ele foca no *como pensar* (princípios, critérios, responsabilidades e trade‑offs) — e **não** em travar formatos/campos finais. As formas exatas podem (e devem) emergir conforme os dados reais e os primeiros insights mostrarem onde há valor.
