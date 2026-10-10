# Desafio QA Júnior

Este repositório reúne os cenários de teste para a Verzel Store, seus resultados manuais/exploratórios, os bugs encontrados e uma suíte de automação com Playwright.

## Como executar a automação

Pré-requisitos: Node.js (versão LTS recomendada) e npm. A aplicação testada é acessada pela internet no endereço configurado em `playwright.config.js`.

Na raiz do projeto, execute:

```bash
npm ci
npx playwright install chromium
npx playwright test
```

O comando executa os testes no Chromium. A suíte é orientada por dados e atualmente cobre **6 casos**: 4 variações de cupom válido e 2 casos de cupom inválido ou expirado.

Para executar somente o arquivo da suíte:

```bash
npx playwright test tests/dataDrivenTestingCarrinhoCupom.spec.js
```

Para abrir o relatório HTML gerado após a execução:

```bash
npx playwright show-report
```

O Playwright grava o relatório em `playwright-report/` e os resultados da execução em `test-results/`. Essas pastas são geradas localmente e estão ignoradas pelo Git. A configuração do CI também executa `npx playwright test` em pushes e pull requests para `main` e `master`.

## Entregas e onde encontrá-las

| Entrega | Localização | Conteúdo |
| --- | --- | --- |
| Cenários levantados da documentação | [`cenarios-de-teste/CA01.md`](cenarios-de-teste/CA01.md), [`cenarios-de-teste/CA02.md`](cenarios-de-teste/CA02.md), [`cenarios-de-teste/CA03.md`](cenarios-de-teste/CA03.md) e [`cenarios-de-teste/CA04.md`](cenarios-de-teste/CA04.md) | Cenários em Gherkin organizados pelos critérios de aceitação CA01 a CA04. |
| Execução manual e exploratória e resultados | Nos mesmos quatro arquivos em [`cenarios-de-teste/`](cenarios-de-teste/) | Cada cenário registra seu resultado (aprovado/reprovado), com motivo nos casos reprovados. Os arquivos também incluem testes de interface e API. |
| Relatórios de bugs encontrados | [`bug-reports/BUG001.md`](bug-reports/BUG001.md), [`bug-reports/BUG002.md`](bug-reports/BUG002.md) e [`bug-reports/BUG003.md`](bug-reports/BUG003.md) | Descrição, passos para reprodução, resultados esperado e obtido, impacto e evidência disponível para cada bug. |
| Evidências da execução | Capturas em [`evidenciais/`](evidenciais/) (`image.png` e `image-1.png` a `image-39.png`), referenciadas nos arquivos CA e no relatório [`BUG003.md`](bug-reports/BUG003.md) | As imagens ficam centralizadas em `evidenciais/`; os links nos documentos de cenário e no relatório de bug apontam para essa pasta para que continuem aparecendo. |
| Automação Playwright | [`tests/dataDrivenTestingCarrinhoCupom.spec.js`](tests/dataDrivenTestingCarrinhoCupom.spec.js), [`support/data/`](support/data/) e [`playwright.config.js`](playwright.config.js) | Testes de carrinho com cupons, massas de dados, configuração do navegador e URL base. |

## Escopo da automação

A suíte automatiza o fluxo de adicionar produto ao carrinho, alterar a quantidade, aplicar cupom e validar a mensagem e o resumo do pedido (subtotal, desconto, frete e total). As regras de cálculo auxiliares ficam em [`support/utils/calculos.js`](support/utils/calculos.js), e os objetos de página em [`support/pages/`](support/pages/).

Os cenários de API e as demais execuções documentadas nos arquivos CA são evidências de testes manuais/exploratórios; a suíte Playwright atual automatiza os fluxos da interface descritos acima.