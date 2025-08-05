
# ⚡ Elétrica - Escala sobre aviso

Sistema leve e dinâmico para visualização de escalas de plantão da equipe elétrica, com suporte a múltiplos eventos por dia, tema claro/escuro e leitura automática de eventos a partir de uma planilha do Google Sheets.

---

## 🧠 Funcionalidades

✅ Exibição em grade dos dias do mês  
✅ Suporte a múltiplos eventos por dia  
✅ Modal com detalhes completos de cada evento  
✅ Alternância entre tema claro 🌞 e escuro 🌙  
✅ Navegação por meses  
✅ Responsivo e leve (HTML/CSS/JS puros)  
✅ Leitura da planilha via CSV (Google Sheets)  
✅ Conversão automática para objetos de evento  
✅ Suporte aos campos: `data`, `titulo`, `hora`, `responsavel`, `obs`, `corFundo`, `corTexto`  
✅ Cabeçalho com dias da semana  
✅ Tema persistente com `localStorage`

---

## 📝 Como adicionar eventos

1. Acesse a planilha conectada ao sistema.  
2. Preencha ou edite as linhas com os dados dos eventos.  
3. A agenda é atualizada automaticamente ao recarregar a página.

---

## 📌 Formato esperado dos eventos (colunas da planilha)

| Campo        | Obrigatório | Exemplo              | Descrição                                     |
|--------------|-------------|----------------------|-----------------------------------------------|
| `data`       | ✅           | `15/08/2025`         | Data do evento no formato `DD/MM/AAAA`        |
| `titulo`     | ✅           | `Plantão João`       | Título do evento (exibido no calendário)      |
| `hora`       | ⭕           | `08:00 - 17:00`      | Faixa de horário opcional                     |
| `responsavel`| ⭕           | `João da Luz`        | Nome da pessoa responsável                    |
| `obs`        | ⭕           | `Cobertura setor A`  | Observações complementares                    |
| `corFundo`   | ⭕           | `#FFD700`            | Cor de fundo personalizada do evento          |
| `corTexto`   | ⭕           | `#000000`            | Cor do texto personalizada do evento          |

🔁 Campos opcionais não preenchidos são omitidos no modal ou recebem cores padrão (`azul` de fundo e `branco` no texto).

---

## 🧪 Exemplo prático: planilha conectada via CSV

### ✅ Exemplo de conteúdo da planilha

| data       | titulo           | hora         | responsavel | obs                 | corFundo   | corTexto  | tipo        |
|------------|------------------|--------------|-------------|---------------------|------------|-----------|----------   |
| 15/08/2025 | Plantão João     | 08:00-18:00  | João        | Cobertura Setor A   | #FFD700  | #000000 | plantao     |
| 22/08/2025 | Vistoria Técnica | 09:00-17:00  | Ana         |                     | #00BFFF  | #FFFFFF | manutencao  |

### ✅ **Regras obrigatórias:**

1. **Cabeçalhos devem estar em minúsculas** e **sem acentos**:

    - `data`, `titulo`, `hora`, `responsavel`, `obs`, `corfundo`, `cortexto`, `tipo`

2. **Campos obrigatórios:**

    - `data` (formato: `DD/MM/AAAA`)
    - `titulo` (nome do evento)

3. O script faz o **mapeamento automático pelas colunas**, então:

    - A ordem das colunas **pode variar**
    - Mas os nomes **devem estar exatos** (sem espaço, acento, etc)

### 🔗 Como obter o link CSV

1. No Google Sheets:  
   `Arquivo` → `Publicar na Web` → selecione a aba e o formato `CSV`.

2. Você receberá um link assim ``https://docs.google.com/spreadsheets/d/e/SEU_ID/pub?output=csv``

3. Esse link deve estar configurado no seu `script.js`.

---

## ℹ️ Observações importantes

- Os nomes das colunas devem estar **em minúsculas**, sem acentos: `data`, `titulo`, `hora`, etc.  
- O campo `data` deve conter **ano completo** no formato `DD/MM/AAAA`.  
- Todos os eventos devem estar no mês e ano visíveis no calendário atual para serem exibidos.

---

## 🌐 Como usar

1. Abra o arquivo `index.html` em qualquer navegador moderno.
2. Navegue pelos meses com os botões ⬅️ ➡️.
3. Clique em qualquer evento para ver os detalhes no modal.
4. Altere o tema claro/escuro com o botão no canto superior direito 🌞/🌙.

---

## 🛠 Requisitos

Nenhum. O sistema é 100% estático — basta um navegador moderno.

---

## 🚀 Hospedagem recomendada

Você pode hospedar este projeto gratuitamente em:

- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- Google Drive (modo público)

---

## 📌 Melhorias futuras sugeridas

- Exportar eventos para PDF
- Integração com Telegram/Alexa
- Interface web para adicionar e editar eventos
- Filtragem de eventos por categoria ou responsável

---

## 👨‍🔧 Desenvolvido por

> Eliton Roberto Monteiro  
> 📅 Agosto 2025  
> ⚡ Para uso da equipe elétrica – escala de sobreaviso
