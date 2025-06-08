document.getElementById('botao-converter').addEventListener('click', converterMoeda);

window.onload = carregarMoedas;

async function carregarMoedas() {
  const selectOrigem = document.getElementById('moeda-origem');
  const selectDestino = document.getElementById('moeda-destino');

  try {
    const resposta = await fetch('https://api.frankfurter.app/currencies');
    const moedas = await resposta.json();

    for (const [sigla, nome] of Object.entries(moedas)) {
      const optionOrigem = document.createElement('option');
      optionOrigem.value = sigla;
      optionOrigem.textContent = `${sigla} - ${nome}`;

      const optionDestino = optionOrigem.cloneNode(true);

      selectOrigem.appendChild(optionOrigem);
      selectDestino.appendChild(optionDestino);
    }

    selectOrigem.value = 'BRL';
    selectDestino.value = 'USD';

  } catch (erro) {
    console.error("Erro ao carregar moedas:", erro);
  }
}

async function converterMoeda() {
  const valor = parseFloat(document.getElementById('valor').value);
  const de = document.getElementById('moeda-origem').value;
  const para = document.getElementById('moeda-destino').value;
  const resultado = document.getElementById('resultado');

  if (!valor || valor <= 0) {
    resultado.textContent = "Digite um valor válido.";
    return;
  }

  if (de === para) {
    resultado.textContent = "As moedas de origem e destino são iguais.";
    return;
  }

  try {
    const url = `https://api.frankfurter.app/latest?amount=${valor}&from=${de}&to=${para}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    const convertido = dados.rates[para].toFixed(2);
    resultado.textContent = `${valor} ${de} = ${convertido} ${para}`;
  } catch (erro) {
    resultado.textContent = `Erro ao converter: ${erro.message}`;
    console.error("Erro na conversão:", erro);
  }
}
