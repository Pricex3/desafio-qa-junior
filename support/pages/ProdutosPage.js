const { expect } = require('@playwright/test');
const { CarrinhoPage } = require('./CarrinhoPage');

class ProdutosPage {
  constructor(page) {
    this.page = page;
    this.tituloVitrine = page.getByRole('heading', { name: 'Produtos', level: 2 });
    this.linkCarrinho = page.getByRole('link', { name: /Carrinho/ });
    this.contadorCarrinho = page.locator('.contador-carrinho');
  }

  async acessar() {
    await this.page.goto('/');
    await expect(this.tituloVitrine).toBeVisible();
  }

  card(produto) {
    return this.page.getByRole('article', { name: produto });
  }

  preco(produto) {
    return this.card(produto).locator('.produto-preco');
  }

  async adicionarAoCarrinho(produto) {
    await this.card(produto)
      .getByRole('button', { name: 'Adicionar ao carrinho' })
      .click();
  }

  /** Abre o carrinho e devolve o Page Object da página de carrinho. */
  async irParaCarrinho() {
    await this.linkCarrinho.click();
    await expect(this.page).toHaveURL(/\/carrinho/);
    return new CarrinhoPage(this.page);
  }
}

module.exports = { ProdutosPage };