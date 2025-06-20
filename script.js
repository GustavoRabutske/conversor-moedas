// Listeners de Eventos
document.addEventListener('DOMContentLoaded', init);
document.getElementById('botao-converter').addEventListener('click', converterMoeda);
document.getElementById('botao-trocar').addEventListener('click', trocarMoedas);

// Função de inicialização
function init() {
    carregarMoedas();
    carregarCotacoes();
}

// Carrega as moedas nos selects
async function carregarMoedas() {
    const selectOrigem = document.getElementById('moeda-origem');
    const selectDestino = document.getElementById('moeda-destino');
    const url = 'https://api.frankfurter.app/currencies';

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Falha ao buscar moedas.");
        const moedas = await resposta.json();

        for (const [sigla, nome] of Object.entries(moedas)) {
            const option = document.createElement('option');
            option.value = sigla;
            option.textContent = `${sigla} - ${nome}`;
            
            selectOrigem.appendChild(option.cloneNode(true));
            selectDestino.appendChild(option);
        }

        selectOrigem.value = 'BRL';
        selectDestino.value = 'USD';

    } catch (erro) {
        console.error("Erro ao carregar moedas:", erro);
        document.getElementById('resultado').textContent = "Não foi possível carregar as moedas.";
    }
}

// Converte a moeda com base nos inputs do usuário
async function converterMoeda() {
    const valor = parseFloat(document.getElementById('valor').value);
    const de = document.getElementById('moeda-origem').value;
    const para = document.getElementById('moeda-destino').value;
    const resultadoP = document.getElementById('resultado');

    resultadoP.textContent = "Convertendo...";

    if (!valor || valor <= 0) {
        resultadoP.textContent = "Por favor, digite um valor válido.";
        return;
    }

    if (de === para) {
        resultadoP.textContent = "As moedas de origem e destino são iguais.";
        return;
    }

    try {
        const url = `https://api.frankfurter.app/latest?amount=${valor}&from=${de}&to=${para}`;
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Falha na conversão. Verifique as moedas.");
        const dados = await resposta.json();
        
        const valorConvertido = dados.rates[para];
        
        // Formatando os valores para a localidade do navegador (ex: R$ 1.234,56)
        const formatoOrigem = new Intl.NumberFormat(undefined, { style: 'currency', currency: de });
        const formatoDestino = new Intl.NumberFormat(undefined, { style: 'currency', currency: para });

        resultadoP.textContent = `${formatoOrigem.format(valor)} = ${formatoDestino.format(valorConvertido)}`;

    } catch (erro) {
        resultadoP.textContent = `Erro ao converter: ${erro.message}`;
        console.error("Erro na conversão:", erro);
    }
}

// Troca os valores entre os selects de origem e destino
function trocarMoedas() {
    const selectOrigem = document.getElementById('moeda-origem');
    const selectDestino = document.getElementById('moeda-destino');

    [selectOrigem.value, selectDestino.value] = [selectDestino.value, selectOrigem.value];
}

// Carrega a cotação das principais moedas em relação ao BRL
async function carregarCotacoes() {
    const containerCotacoes = document.getElementById('lista-cotacoes');
    const moedasAlvo = ['USD', 'EUR', 'GBP', 'JPY', 'ARS'];
    const url = `https://api.frankfurter.app/latest?from=BRL&to=${moedasAlvo.join(',')}`;

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Falha ao buscar cotações.");
        const dados = await resposta.json();
        
        containerCotacoes.innerHTML = ''; // Limpa a mensagem de "carregando"

        for (const moeda in dados.rates) {
            // A API retorna quanto 1 BRL vale na outra moeda.
            // Para ter o valor de 1 da outra moeda em BRL, invertemos (1 / taxa).
            const valorEmBRL = (1 / dados.rates[moeda]).toFixed(2);
            
            const item = document.createElement('div');
            item.className = 'cotacao-item';
            item.innerHTML = `<span>1 ${moeda}</span> <span>R$ ${valorEmBRL}</span>`;
            
            containerCotacoes.appendChild(item);
        }

    } catch (erro) {
        console.error("Erro ao carregar cotações:", erro);
        containerCotacoes.innerHTML = '<p>Não foi possível carregar as cotações.</p>';
    }
}