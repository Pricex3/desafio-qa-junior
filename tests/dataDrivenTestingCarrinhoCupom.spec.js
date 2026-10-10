const { test, expect } = require('@playwright/test');
const { ProdutosPage } = require('../support/pages/ProdutosPage');
const massaCupomValido = require('../support/data/carrinhoCupomValido.json');
const massaCupomInvalido = require('../support/data/carrinhoCupomInvalido.json');
const {
  calcularResumo,
  moeda,
  formatarFrete,
  paraCentavos,
} = require('../support/utils/calculos');

test.describe('Carrinho com cupom válido', () => {
  for (const { testTitle, dadosPedido, resultadoEsperado } of massaCupomValido) {
    test(testTitle, async ({ page }) => {
      const { produto, preco, quantidade, cupom } = dadosPedido;

      // Garante que a massa de teste está coerente com as regras de negócio
      expect(
        calcularResumo({ itens: [{ preco, quantidade }], cupom })
      ).toEqual({
        subtotal: paraCentavos(resultadoEsperado.subtotal),
        desconto: paraCentavos(resultadoEsperado.desconto),
        frete: paraCentavos(resultadoEsperado.frete),
        total: paraCentavos(resultadoEsperado.total),
      });

      // 1. Acessar a página
      const produtosPage = new ProdutosPage(page);
      await produtosPage.acessar();

      // 2. Adicionar produto ao carrinho
      await expect(produtosPage.preco(produto)).toHaveText(moeda(preco));
      await produtosPage.adicionarAoCarrinho(produto);
      await expect(produtosPage.contadorCarrinho).toHaveText('1');

      const carrinhoPage = await produtosPage.irParaCarrinho();
      await expect(carrinhoPage.titulo).toBeVisible();
      await expect(carrinhoPage.item(produto)).toBeVisible();
      await carrinhoPage.definirQuantidade(produto, quantidade);

      // Resumo antes do cupom
      await expect(carrinhoPage.valor('subtotal')).toHaveText(moeda(resultadoEsperado.subtotal));
      await expect(carrinhoPage.valor('desconto')).toHaveText(moeda(0));

      // 3. Aplicar o cupom
      await carrinhoPage.aplicarCupom(cupom);

      // 4. Validar o Resumo do pedido
      await carrinhoPage.aguardarResumoAtualizado();
      await expect(carrinhoPage.valor('desconto')).not.toHaveText(moeda(0));

      await expect(carrinhoPage.valor('subtotal')).toHaveText(moeda(resultadoEsperado.subtotal));
      // toContainText: o site pode exibir o desconto com sinal ("- R$ 5,99")
      await expect(carrinhoPage.valor('desconto')).toContainText(moeda(resultadoEsperado.desconto));
      await expect(carrinhoPage.valor('frete')).toHaveText(
        formatarFrete(paraCentavos(resultadoEsperado.frete))
      );
      await expect(carrinhoPage.valor('total')).toHaveText(moeda(resultadoEsperado.total));
    });
  }
});

test.describe('Carrinho com cupom inválido ou expirado', () => {
  for (const {
    testTitle,
    dadosPedido,
    mensagemEsperada,
    resultadoEsperado,
  } of massaCupomInvalido) {
    test(testTitle, async ({ page }) => {
      const { produto, preco, quantidade, cupom } = dadosPedido;

      const produtosPage = new ProdutosPage(page);
      await produtosPage.acessar();
      await expect(produtosPage.preco(produto)).toHaveText(moeda(preco));
      await produtosPage.adicionarAoCarrinho(produto);
      await expect(produtosPage.contadorCarrinho).toHaveText('1');

      const carrinhoPage = await produtosPage.irParaCarrinho();
      await expect(carrinhoPage.item(produto)).toBeVisible();
      await carrinhoPage.definirQuantidade(produto, quantidade);

      await carrinhoPage.aplicarCupom(cupom);

      // Espera a mensagem de erro ANTES de validar o resumo: como o desconto
      // já começa em R$ 0,00, validar antes poderia passar sem o site responder.
      await expect(carrinhoPage.mensagemCupom).toHaveText(mensagemEsperada);
      await expect(carrinhoPage.campoCupom).toHaveAttribute('aria-invalid', 'true');
      await carrinhoPage.aguardarResumoAtualizado();

      // Resumo permanece sem desconto
      await expect(carrinhoPage.valor('subtotal')).toHaveText(moeda(resultadoEsperado.subtotal));
      await expect(carrinhoPage.valor('desconto')).toHaveText(moeda(resultadoEsperado.desconto));
      await expect(carrinhoPage.valor('frete')).toHaveText(
        formatarFrete(paraCentavos(resultadoEsperado.frete))
      );
      await expect(carrinhoPage.valor('total')).toHaveText(moeda(resultadoEsperado.total));
    });
  }
});