const { expect } = require('@playwright/test');

class CarrinhoPage {
  constructor(page) {
    this.page = page;
    this.titulo = page.getByRole('heading', { name: 'Carrinho', level: 1 });
    this.campoCupom = page.getByLabel('Cupom de desconto');
    this.botaoAplicarCupom = page.getByRole('button', { name: 'Aplicar cupom' });
    this.mensagemCupom = page.getByRole('alert');
    this.colunaResumo = page.locator('.coluna-resumo');
    this.resumo = page.getByRole('region', { name: 'Resumo do pedido' });
  }

  item(produto) {
    return this.page.getByRole('heading', { name: produto });
  }

  quantidade(produto) {
    return this.page.getByRole('status', { name: `Quantidade de ${produto}` });
  }

  /** Localiza um valor do resumo: subtotal, desconto, frete ou total. */
  valor(campo) {
    return this.resumo.locator(`[data-valor="${campo}"]`);
  }

  /** Clica em "+" até atingir a quantidade desejada (parte de 1). */
  async definirQuantidade(produto, quantidade) {
    const aumentar = this.page.getByRole('button', {
      name: `Aumentar quantidade de ${produto}`,
    });
    for (let i = 1; i < quantidade; i++) {
      await aumentar.click();
      await expect(this.quantidade(produto)).toHaveText(String(i + 1));
    }
  }

  /** Aceita o código ("BEMVINDO10") ou o objeto da massa ({ codigo: "..." }). */
  async aplicarCupom(cupom) {
    const codigo = typeof cupom === 'string' ? cupom : cupom.codigo;
    await this.campoCupom.fill(codigo);
    await this.botaoAplicarCupom.click();
  }

  async aguardarResumoAtualizado() {
    await expect(this.colunaResumo).toHaveAttribute('aria-busy', 'false');
  }
}

module.exports = { CarrinhoPage };