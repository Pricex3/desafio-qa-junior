/**
 * Funções utilitárias de cálculo e formatação para o resumo do pedido.
 *
 * Todos os cálculos são feitos em CENTAVOS (inteiros) para evitar erros de
 * ponto flutuante (ex.: 0.1 + 0.2 !== 0.3).
 */

/** Regras de negócio da loja (documentação do ambiente) */
const REGRAS_PADRAO = {
  valorFrete: 19.9,
  freteGratisAPartirDe: 200,
  baseFreteGratis: 'subtotalComDesconto', // ou 'subtotal'
};

/** Converte "R$ 1.234,56" (ou "- R$ 5,99") em número: 1234.56 */
function paraNumero(texto) {
  const limpo = String(texto).replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(limpo);
}

/** Converte reais em centavos inteiros: 59.9 -> 5990 */
function paraCentavos(valor) {
  return Math.round(valor * 100);
}

/** Formata centavos como o site exibe: 5990 -> "R$ 59,90" */
function formatarMoeda(centavos) {
  const reais = (centavos / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${reais}`;
}

/** Formata reais como o site exibe: 59.9 -> "R$ 59,90" */
function moeda(reais) {
  return formatarMoeda(paraCentavos(reais));
}

/** Frete: o site exibe "Grátis" quando o valor é zero; senão, a moeda. */
function formatarFrete(centavos) {
  return centavos === 0 ? 'Grátis' : formatarMoeda(centavos);
}

/**
 * Calcula o resumo do pedido.
 *
 * @param {Object}   params
 * @param {Array}    params.itens  [{ preco: 59.9, quantidade: 1 }]
 * @param {Object}   [params.cupom]  { percentual: 10 }  (omitir = sem cupom)
 * @param {Object}   params.regras
 * @param {number}   params.regras.valorFrete             ex.: 19.9
 * @param {number}   params.regras.freteGratisAPartirDe   ex.: 200
 * @param {string}   [params.regras.baseFreteGratis]
 *        'subtotalComDesconto' (padrão) ou 'subtotal'
 *
 * @returns {{subtotal:number, desconto:number, frete:number, total:number}}
 *          valores em centavos
 */
function calcularResumo({ itens, cupom, regras = REGRAS_PADRAO }) {
  const subtotal = itens.reduce(
    (soma, item) => soma + paraCentavos(item.preco) * item.quantidade,
    0
  );

  const desconto = cupom
    ? Math.round((subtotal * cupom.percentual) / 100)
    : 0;

  const base =
    regras.baseFreteGratis === 'subtotal' ? subtotal : subtotal - desconto;

  const frete =
    base >= paraCentavos(regras.freteGratisAPartirDe)
      ? 0
      : paraCentavos(regras.valorFrete);

  const total = subtotal - desconto + frete;

  return { subtotal, desconto, frete, total };
}

module.exports = { REGRAS_PADRAO, paraNumero, paraCentavos, formatarMoeda, moeda, formatarFrete, calcularResumo };