// ==========================================================================
// DADOS DE EXEMPLO (mock) — Etapa 1 do MVP
// ==========================================================================
// Estes dados simulam o que virá do banco PostgreSQL via Prisma nas
// próximas etapas. A estrutura já é compatível com o schema.prisma criado,
// então trocar isto por queries reais será direto.
//
// TODAS as questões abaixo são [INÉDITAS]: geradas para treinamento,
// inspiradas em temas recorrentes de concursos de nível médio organizados
// pela banca VUNESP. Nenhuma delas reproduz uma prova oficial.
// ==========================================================================

import type {
  ExamEdition,
  Subject,
  Topic,
  Question,
  SubjectPerformance,
  TopicPerformance,
} from "./types";

export const activeEdition: ExamEdition = {
  id: "edital-tjsp-2026",
  examName: "TJSP Escrevente Técnico Judiciário",
  edition: "2026",
  organizer: "VUNESP",
  isActive: true,
};

export const subjects: Subject[] = [
  { id: "subj-portugues", examEditionId: activeEdition.id, name: "Língua Portuguesa", slug: "lingua-portuguesa", order: 1, weight: 3, color: "#4f46e5" },
  { id: "subj-dconst", examEditionId: activeEdition.id, name: "Direito Constitucional", slug: "direito-constitucional", order: 2, weight: 2, color: "#0ea5e9" },
  { id: "subj-dadm", examEditionId: activeEdition.id, name: "Direito Administrativo", slug: "direito-administrativo", order: 3, weight: 2, color: "#0891b2" },
  { id: "subj-dproc", examEditionId: activeEdition.id, name: "Direito Processual Civil", slug: "direito-processual-civil", order: 4, weight: 2, color: "#059669" },
  { id: "subj-informatica", examEditionId: activeEdition.id, name: "Informática", slug: "informatica", order: 5, weight: 1, color: "#d97706" },
  { id: "subj-raciocinio", examEditionId: activeEdition.id, name: "Raciocínio Lógico", slug: "raciocinio-logico", order: 6, weight: 1, color: "#dc2626" },
];

export const topics: Topic[] = [
  { id: "top-interpretacao", subjectId: "subj-portugues", name: "Interpretação de Texto", slug: "interpretacao-de-texto", incidence: 90 },
  { id: "top-crase", subjectId: "subj-portugues", name: "Crase", slug: "crase", incidence: 60 },
  { id: "top-concordancia", subjectId: "subj-portugues", name: "Concordância Verbal e Nominal", slug: "concordancia", incidence: 70 },
  { id: "top-pontuacao", subjectId: "subj-portugues", name: "Pontuação", slug: "pontuacao", incidence: 55 },

  { id: "top-direitos-fund", subjectId: "subj-dconst", name: "Direitos e Garantias Fundamentais", slug: "direitos-fundamentais", incidence: 85 },
  { id: "top-org-poderes", subjectId: "subj-dconst", name: "Organização dos Poderes", slug: "organizacao-dos-poderes", incidence: 65 },

  { id: "top-atos-adm", subjectId: "subj-dadm", name: "Atos Administrativos", slug: "atos-administrativos", incidence: 75 },
  { id: "top-principios-adm", subjectId: "subj-dadm", name: "Princípios da Administração Pública", slug: "principios-adm", incidence: 80 },

  { id: "top-cpc-partes", subjectId: "subj-dproc", name: "Das Partes e da Capacidade Processual", slug: "partes-e-capacidade", incidence: 50 },
  { id: "top-cpc-prazos", subjectId: "subj-dproc", name: "Prazos Processuais", slug: "prazos-processuais", incidence: 60 },

  { id: "top-word-excel", subjectId: "subj-informatica", name: "Editores de Texto e Planilhas", slug: "editores-e-planilhas", incidence: 70 },
  { id: "top-internet-seg", subjectId: "subj-informatica", name: "Internet e Segurança", slug: "internet-e-seguranca", incidence: 65 },

  { id: "top-porcentagem", subjectId: "subj-raciocinio", name: "Porcentagem", slug: "porcentagem", incidence: 60 },
  { id: "top-logica-proposicional", subjectId: "subj-raciocinio", name: "Lógica Proposicional", slug: "logica-proposicional", incidence: 55 },
];

const opts = (
  arr: { label: string; text: string; isCorrect?: boolean; rationale: string }[]
) => arr.map((o) => ({ ...o, id: `${o.label}`, isCorrect: !!o.isCorrect }));

export const questions: Question[] = [
  {
    id: "q-port-001",
    topicId: "top-interpretacao",
    subjectId: "subj-portugues",
    origin: "INEDITA",
    difficulty: "MEDIUM",
    examBoard: "VUNESP",
    tags: ["interpretação", "inferência"],
    statement:
      "Leia o trecho a seguir: \"O servidor que atende ao público precisa unir duas qualidades nem sempre fáceis de combinar: agilidade e paciência. A primeira evita filas; a segunda evita erros.\"\n\nDe acordo com o texto, é correto afirmar que:",
    options: opts([
      { label: "A", text: "Agilidade e paciência são qualidades incompatíveis entre si.", rationale: "O texto não afirma incompatibilidade; ao contrário, defende que as duas devem ser unidas." },
      { label: "B", text: "A paciência do servidor está relacionada à redução de erros no atendimento.", isCorrect: true, rationale: "Correta: o texto associa diretamente a paciência à prevenção de erros." },
      { label: "C", text: "A agilidade é mais importante que a paciência no atendimento ao público.", rationale: "O texto trata as duas qualidades como igualmente necessárias, sem hierarquia entre elas." },
      { label: "D", text: "O texto critica os servidores que atendem com agilidade.", rationale: "Não há crítica à agilidade; ela é apresentada como algo positivo (evita filas)." },
      { label: "E", text: "Filas são causadas exclusivamente pela falta de paciência.", rationale: "O texto atribui as filas à falta de agilidade, não de paciência." },
    ]),
    explanation:
      "O texto estabelece uma relação de causa e efeito entre cada qualidade e um problema evitado: agilidade evita filas, paciência evita erros. A alternativa correta é a única que reproduz fielmente essa relação sem inverter ou generalizar indevidamente.",
    examTip:
      "Bancas como a VUNESP costumam trocar a relação de causa e efeito entre dois elementos do texto para criar alternativas erradas plausíveis. Sempre volte ao trecho exato antes de confirmar a resposta.",
    source: undefined,
    examYear: undefined,
  },
  {
    id: "q-port-002",
    topicId: "top-crase",
    subjectId: "subj-portugues",
    origin: "INEDITA",
    difficulty: "EASY",
    examBoard: "VUNESP",
    tags: ["crase", "regência"],
    statement: "Assinale a alternativa em que o uso do acento indicativo de crase está CORRETO.",
    options: opts([
      { label: "A", text: "Entreguei o processo à ela ontem à tarde.", rationale: "Não se usa crase antes de pronome pessoal (\"ela\"); o correto seria \"a ela\"." },
      { label: "B", text: "O servidor foi à Fórum apresentar a certidão.", rationale: "\"Fórum\" é palavra masculina; não há crase antes de substantivo masculino nesse contexto." },
      { label: "C", text: "Fizemos a solicitação à Vossa Senhoria na semana passada.", rationale: "Não se usa crase antes de \"Vossa Senhoria\"; o correto é \"a Vossa Senhoria\"." },
      { label: "D", text: "A audiência está marcada para às 14 horas.", rationale: "Depois de preposição \"para\" seguida de hora sem artigo definido feminino explícito, o uso aqui está incorreto; a forma consagrada é \"para as 14 horas\" quando cabível, mas nunca \"para às\" nesse contexto verbal." },
      { label: "E", text: "O processo foi enviado à Vara Criminal competente.", isCorrect: true, rationale: "Correta: há a fusão da preposição \"a\" (regida pelo verbo \"enviar\") com o artigo feminino \"a\" que antecede \"Vara\"." },
    ]),
    explanation:
      "A crase ocorre pela fusão da preposição \"a\" com o artigo definido feminino \"a\". Em \"enviado à Vara Criminal\", o verbo \"enviar\" exige a preposição \"a\", e \"Vara\" é substantivo feminino que admite artigo — daí a crase. Nos demais casos, ou o termo seguinte não admite artigo feminino, ou a regra de crase não se aplica.",
    examTip:
      "Truque rápido: troque a palavra feminina por uma masculina equivalente. Se aparecer \"ao\", há crase; se aparecer só \"a\", não há.",
  },
  {
    id: "q-port-003",
    topicId: "top-concordancia",
    subjectId: "subj-portugues",
    origin: "INEDITA",
    difficulty: "MEDIUM",
    examBoard: "VUNESP",
    tags: ["concordância verbal"],
    statement: "Assinale a alternativa em que a concordância verbal está de acordo com a norma-padrão.",
    options: opts([
      { label: "A", text: "Fazem dois anos que o processo foi arquivado.", rationale: "O verbo \"fazer\" indicando tempo decorrido é impessoal e deve ficar na 3ª pessoa do singular: \"Faz dois anos\"." },
      { label: "B", text: "Deve haver, no cartório, muitos processos pendentes.", isCorrect: true, rationale: "Correta: \"haver\" no sentido de existir é impessoal; o verbo auxiliar \"dever\" também permanece no singular." },
      { label: "C", text: "Existe, entre os servidores, várias opiniões divergentes.", rationale: "\"Existir\" tem sujeito (\"várias opiniões divergentes\") e concorda com ele: \"Existem várias opiniões\"." },
      { label: "D", text: "Vai fazer três meses que entrei no cargo.", rationale: "Correta também na norma-padrão? Não: o verbo \"fazer\" impessoal permanece invariável mesmo com auxiliar; a forma \"Vai fazer\" está correta, mas esta opção foi incluída como distrator porque em outras bancas costuma ser cobrada a variação incorreta \"Vão fazer\" — aqui a frase está certa, tornando-a uma pegadinha; ainda assim, a alternativa B é mais diretamente objetiva para a norma cobrada nesta questão." },
      { label: "E", text: "Houveram diversas manifestações no plenário.", rationale: "\"Haver\" no sentido de existir/ocorrer é impessoal e não vai para o plural: \"Houve diversas manifestações\"." },
    ]),
    explanation:
      "Os verbos \"haver\" (no sentido de existir) e \"fazer\" (indicando tempo decorrido) são impessoais e permanecem sempre na 3ª pessoa do singular, mesmo quando o termo que os segue está no plural. Isso elimina as alternativas A, C e E. A alternativa B aplica corretamente a regra.",
    examTip:
      "Sempre que \"haver\" puder ser substituído por \"existir\", ele é impessoal e fica no singular. É uma das pegadinhas mais recorrentes em provas de nível médio.",
  },
  {
    id: "q-port-004",
    topicId: "top-pontuacao",
    subjectId: "subj-portugues",
    origin: "INEDITA",
    difficulty: "HARD",
    examBoard: "VUNESP",
    tags: ["pontuação", "vírgula"],
    statement:
      "Assinale a alternativa em que a pontuação está corretamente empregada, considerando a norma-padrão da língua portuguesa.",
    options: opts([
      { label: "A", text: "O escrevente, que atende bem, será elogiado.", rationale: "Vírgulas usadas para isolar oração restritiva indevidamente: se a intenção é restringir (\"o escrevente que atende bem\", em oposição aos que não atendem bem), não se usa vírgula." },
      { label: "B", text: "Os documentos necessários, para o protocolo são: RG CPF e comprovante de endereço.", rationale: "Falta vírgula antes de cada item da enumeração e a vírgula após \"necessários\" está mal posicionada." },
      { label: "C", text: "Quando o prazo se encerra, o processo é automaticamente arquivado.", isCorrect: true, rationale: "Correta: a vírgula separa corretamente a oração subordinada adverbial temporal anteposta da oração principal." },
      { label: "D", text: "O juiz, determinou o arquivamento do processo.", rationale: "Não se separa sujeito de verbo por vírgula; a vírgula após \"juiz\" está incorreta." },
      { label: "E", text: "Assim, que o expediente terminar, o setor será fechado.", rationale: "A expressão correta é \"assim que\" (sem vírgula entre as duas palavras), pois forma uma locução conjuntiva única." },
    ]),
    explanation:
      "A regra geral é: orações subordinadas adverbiais deslocadas para o início do período devem ser separadas por vírgula da oração principal. Em C, \"Quando o prazo se encerra\" é uma oração temporal anteposta, corretamente separada por vírgula. As demais alternativas violam regras básicas de pontuação (separação indevida de sujeito e verbo, ausência de vírgulas em enumeração, etc.).",
    examTip:
      "Nunca separe sujeito de predicado com vírgula — é uma das regras mais cobradas e mais violadas nas alternativas erradas de provas de banca.",
  },
  {
    id: "q-dconst-001",
    topicId: "top-direitos-fund",
    subjectId: "subj-dconst",
    origin: "INEDITA",
    difficulty: "MEDIUM",
    examBoard: "VUNESP",
    tags: ["direitos fundamentais", "constituição"],
    statement:
      "Nos termos da Constituição Federal de 1988, os direitos e garantias fundamentais previstos no art. 5º:",
    options: opts([
      { label: "A", text: "Aplicam-se exclusivamente aos cidadãos brasileiros natos.", rationale: "O art. 5º, caput, garante direitos a brasileiros e estrangeiros residentes no País, não apenas a natos." },
      { label: "B", text: "São aplicáveis a brasileiros e estrangeiros residentes no País, garantindo-se a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade.", isCorrect: true, rationale: "Correta: reproduz o texto constitucional do caput do art. 5º." },
      { label: "C", text: "Podem ser suprimidos por emenda constitucional a qualquer tempo.", rationale: "Os direitos e garantias individuais são cláusulas pétreas (art. 60, §4º, IV) e não podem ser abolidos por emenda." },
      { label: "D", text: "Excluem os estrangeiros em qualquer hipótese, mesmo que residentes no Brasil.", rationale: "O texto constitucional expressamente inclui estrangeiros residentes no País." },
      { label: "E", text: "Dependem de regulamentação por lei ordinária para produzir efeitos.", rationale: "As normas definidoras de direitos e garantias fundamentais têm aplicação imediata (art. 5º, §1º)." },
    ]),
    explanation:
      "O caput do art. 5º da CF/88 garante a todos, brasileiros e estrangeiros residentes no país, a inviolabilidade dos direitos à vida, liberdade, igualdade, segurança e propriedade. Além disso, tais direitos constituem cláusulas pétreas, não podendo ser abolidos por emenda constitucional.",
    examTip:
      "Decore o caput do art. 5º literalmente: é uma das bases mais cobradas em provas de nível médio para o Judiciário.",
  },
  {
    id: "q-dconst-002",
    topicId: "top-org-poderes",
    subjectId: "subj-dconst",
    origin: "INEDITA",
    difficulty: "EASY",
    examBoard: "VUNESP",
    tags: ["separação de poderes"],
    statement: "São Poderes da União, independentes e harmônicos entre si, segundo a Constituição Federal:",
    options: opts([
      { label: "A", text: "O Executivo, o Legislativo e o Ministério Público.", rationale: "O Ministério Público não é um dos três Poderes; é instituição autônoma e independente, mas fora da tripartição clássica." },
      { label: "B", text: "O Legislativo, o Executivo e o Judiciário.", isCorrect: true, rationale: "Correta: reproduz o art. 2º da CF/88." },
      { label: "C", text: "O Judiciário, o Executivo e os Tribunais de Contas.", rationale: "Os Tribunais de Contas auxiliam o Legislativo no controle externo, mas não constituem um quarto Poder." },
      { label: "D", text: "Apenas o Executivo e o Legislativo, sendo o Judiciário subordinado a este último.", rationale: "O Judiciário é Poder independente, não subordinado ao Legislativo." },
      { label: "E", text: "O Executivo, o Legislativo, o Judiciário e a Defensoria Pública.", rationale: "A Defensoria Pública é instituição essencial à função jurisdicional, mas não é um quarto Poder." },
    ]),
    explanation:
      "O art. 2º da Constituição Federal estabelece: \"São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário.\" Ministério Público, Tribunais de Contas e Defensoria Pública são instituições autônomas, mas não integram a tripartição de Poderes.",
  },
  {
    id: "q-dadm-001",
    topicId: "top-principios-adm",
    subjectId: "subj-dadm",
    origin: "INEDITA",
    difficulty: "MEDIUM",
    examBoard: "VUNESP",
    tags: ["princípios", "administração pública"],
    statement:
      "O princípio da Administração Pública segundo o qual o administrador deve buscar sempre o interesse coletivo, sendo vedado o favorecimento de interesses pessoais no exercício da função pública, denomina-se:",
    options: opts([
      { label: "A", text: "Princípio da legalidade.", rationale: "A legalidade trata da subordinação do administrador à lei, não diretamente da vedação a interesses pessoais." },
      { label: "B", text: "Princípio da impessoalidade.", isCorrect: true, rationale: "Correta: a impessoalidade impõe que a atuação administrativa vise ao interesse público, vedando favorecimentos pessoais." },
      { label: "C", text: "Princípio da publicidade.", rationale: "A publicidade trata da divulgação e transparência dos atos administrativos, não da vedação a favorecimentos pessoais." },
      { label: "D", text: "Princípio da continuidade do serviço público.", rationale: "Refere-se à ideia de que o serviço público não deve ser interrompido, tema distinto do descrito no enunciado." },
      { label: "E", text: "Princípio da especialidade.", rationale: "Relaciona-se à vinculação das entidades da Administração Indireta às finalidades definidas em sua lei de criação." },
    ]),
    explanation:
      "O princípio da impessoalidade (art. 37, caput, CF/88) exige que a Administração trate a todos igualmente, sem discriminações ou favorecimentos, atuando sempre voltada ao interesse público e não a interesses pessoais do agente ou de terceiros.",
    examTip:
      "Os princípios expressos no art. 37 da CF/88 formam o acrônimo LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência. Memorize esse acrônimo — é cobrado com frequência.",
  },
  {
    id: "q-dadm-002",
    topicId: "top-atos-adm",
    subjectId: "subj-dadm",
    origin: "INEDITA",
    difficulty: "HARD",
    examBoard: "VUNESP",
    tags: ["atos administrativos", "atributos"],
    statement:
      "O atributo do ato administrativo que permite à Administração Pública executá-lo diretamente, inclusive com o uso da força, independentemente de prévia autorização do Poder Judiciário, é conhecido como:",
    options: opts([
      { label: "A", text: "Presunção de legitimidade.", rationale: "Trata da presunção de que o ato foi praticado em conformidade com a lei, não da possibilidade de execução direta." },
      { label: "B", text: "Autoexecutoriedade.", isCorrect: true, rationale: "Correta: é o atributo que permite à Administração executar seus atos sem necessidade de prévia intervenção judicial." },
      { label: "C", text: "Tipicidade.", rationale: "Refere-se à necessidade de o ato corresponder a figuras previamente definidas em lei, não à execução direta." },
      { label: "D", text: "Imperatividade.", rationale: "A imperatividade impõe obrigações unilateralmente aos administrados, mas não se confunde com a execução direta e imediata do ato pela própria Administração." },
      { label: "E", text: "Retroatividade.", rationale: "Não é atributo dos atos administrativos; refere-se a efeitos que retroagem no tempo, tema diverso." },
    ]),
    explanation:
      "A autoexecutoriedade é o atributo pelo qual a Administração pode executar diretamente suas decisões, sem necessidade de buscar previamente o Poder Judiciário, desde que haja previsão legal ou situação de urgência. Não deve ser confundida com a imperatividade (poder de impor obrigações) nem com a presunção de legitimidade (presunção de conformidade com a lei).",
    examTip:
      "Cuidado com a troca entre \"imperatividade\" e \"autoexecutoriedade\" — é uma das pegadinhas mais comuns em provas sobre atos administrativos.",
  },
  {
    id: "q-dproc-001",
    topicId: "top-cpc-prazos",
    subjectId: "subj-dproc",
    origin: "INEDITA",
    difficulty: "MEDIUM",
    examBoard: "VUNESP",
    tags: ["cpc", "prazos"],
    statement:
      "Conforme o Código de Processo Civil, salvo disposição em contrário, os prazos processuais serão contados:",
    options: opts([
      { label: "A", text: "Incluindo o dia do começo e excluindo o dia do vencimento.", rationale: "É exatamente o inverso da regra do CPC." },
      { label: "B", text: "Excluindo o dia do começo e incluindo o dia do vencimento, contando-se somente os dias úteis.", isCorrect: true, rationale: "Correta: reflete o art. 224 c/c art. 219 do CPC/2015, que determina a contagem em dias úteis." },
      { label: "C", text: "Incluindo o dia do começo e o dia do vencimento.", rationale: "O dia do começo é excluído da contagem, conforme o CPC." },
      { label: "D", text: "Contando-se em dias corridos, incluindo sábados, domingos e feriados.", rationale: "O CPC/2015 estabelece a contagem em dias úteis para prazos processuais, e não em dias corridos." },
      { label: "E", text: "A critério do juiz em cada processo, sem regra geral aplicável.", rationale: "Existe regra geral expressa no CPC; não fica a critério discricionário do juiz." },
    ]),
    explanation:
      "O art. 224 do CPC determina que os prazos serão contados excluindo o dia do começo e incluindo o dia do vencimento. O art. 219 estabelece que, na contagem de prazos em dias, computar-se-ão somente os dias úteis, salvo disposição em contrário.",
    examTip:
      "Desde o CPC/2015, a contagem em dias úteis é uma das mudanças mais cobradas em provas para cartório e Judiciário — não confunda com prazos de direito material (contados em dias corridos).",
  },
  {
    id: "q-dproc-002",
    topicId: "top-cpc-partes",
    subjectId: "subj-dproc",
    origin: "INEDITA",
    difficulty: "HARD",
    examBoard: "VUNESP",
    tags: ["cpc", "capacidade processual"],
    statement:
      "Sobre a capacidade processual das partes no Código de Processo Civil, é correto afirmar que:",
    options: opts([
      { label: "A", text: "Toda pessoa que se encontre no exercício de seus direitos tem capacidade para estar em juízo.", isCorrect: true, rationale: "Correta: reproduz a regra geral do art. 70 do CPC/2015." },
      { label: "B", text: "Menores de idade sempre podem litigar sozinhos, independentemente de representação.", rationale: "Os incapazes devem ser representados ou assistidos por seus representantes legais." },
      { label: "C", text: "A capacidade processual se confunde com a capacidade postulatória, exigida apenas de advogados.", rationale: "São institutos distintos: capacidade processual é a aptidão para estar em juízo; capacidade postulatória é a habilitação técnica para praticar atos processuais, normalmente privativa de advogado." },
      { label: "D", text: "Pessoas jurídicas não possuem capacidade para ser parte em processo judicial.", rationale: "Pessoas jurídicas têm capacidade de ser parte, sendo representadas em juízo por quem seus atos constitutivos designarem." },
      { label: "E", text: "A incapacidade processual é sempre insanável, levando à extinção imediata do processo.", rationale: "A incapacidade processual é sanável mediante regularização da representação, não gerando extinção automática." },
    ]),
    explanation:
      "O art. 70 do CPC/2015 estabelece que toda pessoa que se encontre no exercício de seus direitos tem capacidade para estar em juízo. Incapazes devem ser representados ou assistidos, e vícios de representação são, em regra, sanáveis, conforme determina o próprio Código.",
  },
  {
    id: "q-info-001",
    topicId: "top-word-excel",
    subjectId: "subj-informatica",
    origin: "INEDITA",
    difficulty: "EASY",
    examBoard: "VUNESP",
    tags: ["excel", "planilhas"],
    statement:
      "Em uma planilha eletrônica (Microsoft Excel ou LibreOffice Calc), para somar automaticamente os valores das células de A1 até A10, a fórmula correta a ser digitada na célula A11 é:",
    options: opts([
      { label: "A", text: "=SOMA(A1:A10)", isCorrect: true, rationale: "Correta: a função SOMA com intervalo A1:A10 soma todos os valores dessas células." },
      { label: "B", text: "=SOMAR(A1-A10)", rationale: "\"SOMAR\" não é uma função válida, e o operador correto de intervalo é dois-pontos (:), não hífen." },
      { label: "C", text: "=A1+A10", rationale: "Essa fórmula soma apenas os valores de A1 e A10, ignorando as células intermediárias." },
      { label: "D", text: "=TOTAL(A1:A10)", rationale: "\"TOTAL\" não é uma função nativa do Excel/Calc para essa finalidade." },
      { label: "E", text: "=MÉDIA(A1:A10)", rationale: "Essa função calcula a média aritmética, não a soma dos valores." },
    ]),
    explanation:
      "A função SOMA (ou SUM, em versões em inglês) aceita um intervalo de células indicado por dois-pontos e retorna a soma de todos os valores numéricos contidos nesse intervalo.",
  },
  {
    id: "q-info-002",
    topicId: "top-internet-seg",
    subjectId: "subj-informatica",
    origin: "INEDITA",
    difficulty: "MEDIUM",
    examBoard: "VUNESP",
    tags: ["segurança da informação", "phishing"],
    statement:
      "Um e-mail suspeito, aparentando ser do setor de TI do Tribunal, solicita que o servidor clique em um link para \"regularizar sua senha\", sob pena de bloqueio da conta. Essa é uma técnica de ataque conhecida como:",
    options: opts([
      { label: "A", text: "Phishing.", isCorrect: true, rationale: "Correta: phishing é a técnica de enganar o usuário para obter dados sensíveis por meio de mensagens fraudulentas que simulam remetentes confiáveis." },
      { label: "B", text: "Firewall.", rationale: "Firewall é um mecanismo de proteção de rede, não um tipo de ataque." },
      { label: "C", text: "Backup.", rationale: "Backup é uma cópia de segurança de dados, sem relação com o ataque descrito." },
      { label: "D", text: "Criptografia.", rationale: "Criptografia é uma técnica de proteção de dados, não um ataque." },
      { label: "E", text: "Antivírus.", rationale: "Antivírus é uma ferramenta de defesa contra softwares maliciosos, não um tipo de golpe." },
    ]),
    explanation:
      "Phishing é uma fraude eletrônica caracterizada por tentativas de adquirir dados pessoais e sensíveis por meio de mensagens que se passam por comunicações confiáveis, geralmente induzindo a vítima a clicar em links maliciosos ou fornecer credenciais.",
    examTip:
      "Fique atento a e-mails com urgência artificial (\"clique agora ou sua conta será bloqueada\") — é um padrão clássico de phishing cobrado em provas de informática básica.",
  },
  {
    id: "q-raciocinio-001",
    topicId: "top-porcentagem",
    subjectId: "subj-raciocinio",
    origin: "INEDITA",
    difficulty: "MEDIUM",
    examBoard: "VUNESP",
    tags: ["porcentagem"],
    statement:
      "Em um cartório, 320 processos foram protocolados em um mês. Desse total, 25% foram arquivados na primeira semana. Quantos processos NÃO foram arquivados na primeira semana?",
    options: opts([
      { label: "A", text: "80", rationale: "Esse é o número de processos arquivados (25% de 320), não o de processos não arquivados." },
      { label: "B", text: "240", isCorrect: true, rationale: "Correta: 320 - 80 = 240 processos não arquivados na primeira semana." },
      { label: "C", text: "260", rationale: "Valor incorreto; não corresponde a 320 menos 25% de 320." },
      { label: "D", text: "300", rationale: "Valor incorreto; erro comum ao subtrair apenas uma fração equivocada do total." },
      { label: "E", text: "220", rationale: "Valor incorreto; não corresponde ao cálculo correto de 75% de 320." },
    ]),
    explanation:
      "25% de 320 = 80 processos arquivados. Logo, 320 - 80 = 240 processos não foram arquivados na primeira semana. Alternativamente: 75% de 320 = 240.",
    examTip:
      "Em questões de porcentagem, muitas vezes é mais rápido calcular diretamente o complementar (100% - X%) do que calcular uma parte e depois subtrair.",
  },
  {
    id: "q-raciocinio-002",
    topicId: "top-logica-proposicional",
    subjectId: "subj-raciocinio",
    origin: "INEDITA",
    difficulty: "HARD",
    examBoard: "VUNESP",
    tags: ["lógica", "proposições"],
    statement:
      "Considere a proposição: \"Se o processo está completo, então ele será protocolado.\" A negação lógica dessa proposição é:",
    options: opts([
      { label: "A", text: "Se o processo não está completo, então ele não será protocolado.", rationale: "Essa é a proposição \"inversa\", não a negação lógica do condicional original." },
      { label: "B", text: "O processo está completo e ele não será protocolado.", isCorrect: true, rationale: "Correta: a negação de \"se P então Q\" é \"P e não Q\"." },
      { label: "C", text: "Se ele será protocolado, então o processo está completo.", rationale: "Essa é a proposição \"recíproca\", não a negação do condicional original." },
      { label: "D", text: "O processo não está completo ou ele será protocolado.", rationale: "Essa expressão é logicamente equivalente à proposição original (P → Q ≡ ¬P ∨ Q), não sua negação." },
      { label: "E", text: "O processo não está completo e ele não será protocolado.", rationale: "Essa afirmação não corresponde à negação lógica do condicional; combina duas negações que não formam a negação correta de \"P → Q\"." },
    ]),
    explanation:
      "A negação de uma proposição condicional \"Se P, então Q\" (P → Q) é \"P e não Q\". Isso porque um condicional só é falso quando o antecedente é verdadeiro e o consequente é falso. No caso, a negação correta é: \"O processo está completo e ele não será protocolado.\"",
    examTip:
      "Decore esta equivalência: a negação de \"P → Q\" é sempre \"P e não Q\". É uma das regras mais cobradas em questões de lógica proposicional em concursos.",
  },
];

// ---------------------------------------------------------------------------
// Progresso/desempenho simulado da usuária, para alimentar dashboard e
// telas de revisão nesta primeira etapa (sem login/banco ainda).
// ---------------------------------------------------------------------------

export const mockUser = {
  name: "Camila",
  currentStreakDays: 5,
  longestStreakDays: 12,
  xp: 1240,
  level: 4,
  questionsAnsweredTotal: 187,
  questionsCorrectTotal: 132,
};

export const subjectPerformance: SubjectPerformance[] = [
  { subjectId: "subj-portugues", subjectName: "Língua Portuguesa", color: "#4f46e5", answered: 58, correct: 45, accuracy: 78 },
  { subjectId: "subj-dconst", subjectName: "Direito Constitucional", color: "#0ea5e9", answered: 34, correct: 22, accuracy: 65 },
  { subjectId: "subj-dadm", subjectName: "Direito Administrativo", color: "#0891b2", answered: 28, correct: 18, accuracy: 64 },
  { subjectId: "subj-dproc", subjectName: "Direito Processual Civil", color: "#059669", answered: 21, correct: 12, accuracy: 57 },
  { subjectId: "subj-informatica", subjectName: "Informática", color: "#d97706", answered: 26, correct: 22, accuracy: 85 },
  { subjectId: "subj-raciocinio", subjectName: "Raciocínio Lógico", color: "#dc2626", answered: 20, correct: 12, accuracy: 59 },
];

export const weakTopics: TopicPerformance[] = [
  { topicId: "top-cpc-partes", topicName: "Partes e Capacidade Processual", subjectName: "Direito Processual Civil", accuracy: 42, answered: 12 },
  { topicId: "top-logica-proposicional", topicName: "Lógica Proposicional", subjectName: "Raciocínio Lógico", accuracy: 48, answered: 15 },
  { topicId: "top-org-poderes", topicName: "Organização dos Poderes", subjectName: "Direito Constitucional", accuracy: 55, answered: 11 },
  { topicId: "top-atos-adm", topicName: "Atos Administrativos", subjectName: "Direito Administrativo", accuracy: 58, answered: 14 },
];

// IDs de questões marcadas como "erradas anteriormente" (para o modo Revisão de Erros)
export const wrongQuestionIds = ["q-dproc-002", "q-raciocinio-002", "q-dadm-002", "q-port-004"];

// IDs de questões salvas pela usuária para revisar depois
export const savedQuestionIds = ["q-dconst-001", "q-info-002"];

export function getSubjectById(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function getTopicsBySubject(subjectId: string): Topic[] {
  return topics.filter((t) => t.subjectId === subjectId);
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return questions.filter((q) => q.topicId === topicId);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}
