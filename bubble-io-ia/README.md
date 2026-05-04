# 🎯 SM7 - Engenharia de Software e IA com Bubble.io

##  Descrição
Construção de aplicativos por meio de ferramentas no-code com integração de inteligência artificial.

##  Objetivo
Explorar o desenvolvimento de aplicações utilizando a plataforma no-code Bubble.io, integrando recursos de Inteligência Artificial para criar soluções funcionais sem necessidade de programação tradicional.

---

## 🔗 Links do Projeto

| | Link |
|---|---|
| 🌐 Aplicativo Publicado | [Acessar aplicativo](https://caiqueoliveira0123-58708.bubbleapps.io/version-test?debug_mode=true) |
| 📋 Modelagem de Dados | [Ver no Notion](https://www.notion.so/Modelagem-de-Dados-Gerenciador-de-Reembolso-34a4761b6e108036b5dafe5e919bbb6d) |

> ⚠️ O aplicativo está registrado com outro e-mail pois houve um problema de acesso durante o desenvolvimento.

---

## 📝 Sobre o Projeto — Gerenciador de Reembolso

Sistema de gerenciamento de solicitações de reembolso desenvolvido no Bubble.io, com autenticação de usuários, controle de privacidade e fluxos de trabalho automatizados.

### 🗃️ Modelagem de Dados

| Tabela | Campos principais |
|---|---|
| **Usuário** | ID, e-mail, nome, função, data_de_criação |
| **Solicitação** | ID, criador, título, descrição, valor, status, categoria, arquivo_de_recibo, data_de_criação |

### 🔒 Regras de Privacidade
- **Apenas o Criador** pode visualizar, editar e buscar suas próprias solicitações
- **Permissões padrão** configuradas para os demais usuários

### ⚙️ Workflows Implementados
- `Button alert-action-btn` → Redireciona para página de solicitações
- `Button nr-cancel-btn` → Cancela operação
- `Button nr-close-btn` → Fecha modal
- `Button nr-submit-btn` → Envia nova solicitação
- `Button qa-history-btn` → Acessa histórico
- `Button qa-new-btn` → Nova solicitação
- `Button recent-card-view-btn` → Visualiza solicitação recente
- `Button welcome-new-btn` → Inicia nova solicitação
- `Button welcome-refresh-btn` → Atualiza página inicial

---

## 🚨 Gestão de Limitações — Estratégia de Saída (Vendor Lock-in)

O Bubble.io retém o código-fonte gerado, o que representa um risco de dependência da plataforma. A estratégia de saída planejada consiste em:

**1. Exportar os dados via Data API do Bubble**
- Habilitar: `Settings → API → Enable Data API`
- Exportar tabelas `User` e `Solicitacao` em formato JSON

**2. Reescrever em stack tradicional**

| Camada | Tecnologia |
|---|---|
| Front-end | React.js |
| Back-end | Node.js com Express |
| Banco de dados | PostgreSQL ou MongoDB |
| Autenticação | Firebase Auth ou Auth0 |
| Arquivos | Amazon S3 |

---

## 🛠️ Tecnologias e Ferramentas
![No-Code](https://img.shields.io/badge/No--Code-Bubble.io-yellow?style=flat-square)
![IA](https://img.shields.io/badge/IA-Integração-blue?style=flat-square)
![Notion](https://img.shields.io/badge/Docs-Notion-black?style=flat-square)

## 📚 Matéria
Engenharia de Software & Produto

---

*Autora: Yasmin Santos de Oliveira — abril de 2026*
