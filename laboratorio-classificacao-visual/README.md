# 🎯 SM2 - Laboratório de Classificação Visual

## 🧪 Testes de Inferência

### Definição de Categorias
O modelo foi treinado com duas classes de classificação:
- **Tênis Originais**
- **Tênis Falsos**

### Alimentação de Dados
Foram carregadas **20 imagens para cada categoria**, utilizando deliberadamente 
um dataset enviesado — as imagens de tênis originais apresentavam padrões visuais 
distintos dos falsos, como ângulos, iluminação e contexto específicos, limitando 
a capacidade de generalização do modelo.

### Resultados dos Testes

**Teste 1 — Tênis Original classificado corretamente (99% de confiança)**
![Teste 1](./imagem1.png)


> ⚠️ **Erro registrado:** dois tênis **originais** foram classificados
> pelo modelo com **100% de confiança** como **tênis falso** — um falso positivo 
> gerado pelo viés do dataset de treinamento.

**Teste 2 — Tênis Original sendo testado e classificado incorretamente via upload de arquivo**
![Teste 2](./imagem2.png)

**Teste 3 — Tênis Original sendo testado e classificado incorretamente via upload de arquivo**
![Teste 3](./imagem3.png)

---

## 🧠 Memorial de Impacto e Ética

### 1. Mecanismo do Viés
A seleção restrita de dados corrompe a lógica do algoritmo porque o modelo aprende 
apenas os padrões presentes no conjunto de treinamento, e não a realidade em sua 
totalidade. Qualquer imagem que fuja do padrão visual aprendido é classificada 
incorretamente.

### 2. Consequência Social
O impacto de um sistema enviesado vai além do erro técnico. No contexto de 
autenticação de produtos, um indivíduo que tem seu tênis legítimo classificado 
como falso sofre consequências diretas: perde credibilidade, enfrenta 
constrangimento público e tem seu patrimônio questionado sem justificativa real.

## 🛠️ Tecnologias e Ferramentas
![ML](https://img.shields.io/badge/IA-Machine%20Learning-green?style=flat-square)
![Teachable Machine](https://img.shields.io/badge/Google-Teachable%20Machine-yellow?style=flat-square)

## 📚 Matéria
Engenharia de Prompt e Aplicações em IA
