# 🎯 SM3 - Batalha de Modelos & Engenharia de Prompt (XML)

## 📋 A Tarefa

Construir um Prompt Estruturado em XML para gerar uma página HTML Single Page 
com CSS integrado, testado nas ferramentas: ChatGPT, Gemini, Claude, Qwen, 
DeepSeek, Grok e Maritaca.

## 🧩 Prompt XML Utilizado

<tarefa>
  <objetivo>Criar uma página HTML5 única com CSS3 interno (single page).</objetivo>
  <tema>Comercio de grãos</tema>
  <diretrizes_design>
    <layout>Responsivo e minimalista.</layout>
    <paleta_cores>
      tons terrosos, marrom muito escuro quase preto, marrom escuro, 
      marrom médio quente, bege rosado claro (nude), estética minimalista
    </paleta_cores>
    <tipografia>
      Berlin Sans FB Demi para títulos, Berlin Sans FB para corpo.
    </tipografia>
  </diretrizes_design>
  <obrigatoriedades_tecnicas>
    <item>Menu de navegação funcional (âncoras).</item>
    <item>Seção de portfólio ou galeria.</item>
    <item>Rodapé com informações de contato simuladas.</item>
    <item>Cadastro de clientes</item>
    <item>Fornecedores</item>
    <item>Avaliações de clientes</item>
  </obrigatoriedades_tecnicas>
  <metrica_obrigatoria>
    Ao final da resposta, informe uma estimativa de quantos tokens 
    foram gerados para este código.
  </metrica_obrigatoria>
</tarefa>

## 📊 Quadro de Análise Comparativa

| Critério | GPT | Gemini | DeepSeek | Qwen | Grok | Maritaca | Claude |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Precisão do Prompt | 6 | 7 | 9 | 9,5 | 8 | 7 | 10 |
| Precisão do HTML | 9 | 9 | 10 | 8 | 9 | 8 | 10 |
| Criatividade no Conteúdo | 5 | 6 | 10 | 9 | 7 | 6 | 10 |
| Erros de Sintaxe | 9 | 8 | 10 | 8 | 9 | 7 | 10 |
| Tokens Gastos | 1.400 | 850 | 11.000 | 1.150 | 5.000 | 1.400 | 7.500 |

## 💭 Reflexão Crítica

### 1. Qual modelo demonstrou maior "compreensão" da estrutura XML?
O Claude demonstrou maior compreensão da estrutura do prompt em XML, sendo o 
único a cumprir todos os requisitos com exatidão, sem erros de sintaxe e com 
alta criatividade na distribuição do conteúdo.

### 2. Houve diferença significativa na verbosidade (tokens) entre as IAs?
Sim, houve diferença expressiva. O Gemini consumiu apenas 850 tokens e entregou 
um resultado simplório, enquanto o DeepSeek utilizou 11.000 tokens com excelente 
resultado. De forma geral, quanto maior o consumo de tokens, melhor foi a 
performance — evidenciando que modelos mais verbosos tendem a gerar código mais 
completo e detalhado.

### 3. Qual ferramenta escolheria para prototipagem rápida e qual para códigos complexos?
Para prototipagem rápida, o DeepSeek e o Qwen se mostram opções viáveis pela 
entrega criativa e precisa. Para projetos complexos, o Claude é a escolha mais 
indicada — melhor desempenho, entrega direta na própria IA, ausência de erros 
e fidelidade total ao prompt XML.

## ✅ Conclusão

A batalha de modelos revelou diferenças expressivas na capacidade de cada LLM 
em interpretar e obedecer a instruções estruturadas em XML. Enquanto modelos 
como GPT e Maritaca cumpriram os requisitos de forma simplória, o Claude 
demonstrou superioridade técnica em todas as métricas avaliadas — atingindo 
nota máxima em precisão, HTML, criatividade e ausência de erros de sintaxe.

A diferença de tokens foi significativa: o DeepSeek consumiu 11.000 tokens 
contra apenas 850 do Gemini, evidenciando que maior verbosidade tende a 
produzir resultados mais ricos — mas não é uma regra absoluta.

O experimento reforça que a engenharia de prompt estruturada em XML é uma 
estratégia eficaz para extrair o máximo de fidelidade de um modelo, delimitando 
com precisão o escopo, o estilo e as obrigatoriedades técnicas.

## 🛠️ Tecnologias e Ferramentas
![IA](https://img.shields.io/badge/IA-Modelos%20de%20Linguagem-orange?style=flat-square)
![XML](https://img.shields.io/badge/Prompt-XML-red?style=flat-square)

## 📚 Matéria
Engenharia de Prompt e Aplicações em IA
