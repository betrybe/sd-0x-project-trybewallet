export default function conversor (valor, cambioGeral, moedaGasto, moedaTotal) {
  if ((moedaGasto === moedaTotal)) {
    return valor;
  }

  const valorBRL = cambioGeral[moedaGasto].ask * valor;
  let valorConvertido = valorBRL;
  if (moedaTotal !== 'BRL') {
    valorConvertido = valorBRL/(cambioGeral[moedaTotal].ask);
  }

  return valorConvertido;
}
