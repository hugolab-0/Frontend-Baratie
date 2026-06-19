'use strict';

// URL base da API
const Url = "http://localhost:8080";

/*
========================================================
ESTADO GLOBAL
========================================================
*/
let refeicoes = [];            // lista completa da API
let refeicoesFiltradas = [];   // lista filtrada (busca)
let indiceAtual = 0;           // controle de paginação
const quantidadePorClique = 6; // quantidade de cards por vez

/*
========================================================
CARREGAR REFEIÇÕES DA API
========================================================
*/
const carregarRefeicoes = async () => {
    try {

        const response = await fetch(`${Url}/v1/baratie/refeicao`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        // pega array seguro da API
        refeicoes = data?.response?.refeicao || [];

        // embaralha lista (Fisher-Yates)
        for (let i = refeicoes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [refeicoes[i], refeicoes[j]] = [refeicoes[j], refeicoes[i]];
        }

        refeicoesFiltradas = refeicoes;

        exibirRefeicoes();

    } catch (error) {
        console.error("Erro ao carregar refeições:", error);
    }
};

/*
========================================================
CRIAR CARD DE REFEIÇÃO
========================================================
*/
const criarCard = (refeicao) => {

    // evita erro caso valores venham null/undefined
    const proteina = Number(refeicao.proteinas_g || 0);
    const carbo = Number(refeicao.carboidratos_g || 0);
    const gordura = Number(refeicao.lipidios_g || 0);

    // cálculo de calorias
    const calorias =
        (proteina * 4) +
        (carbo * 4) +
        (gordura * 9);

    const card = document.createElement("div");
    card.className = "prato-card";

    card.innerHTML = `
        <img class="prato-card-img" src="${refeicao.img}" alt="${refeicao.nome}">

        <span class="prato-card-kcal">
            ${Math.round(calorias)} Kcal
        </span>

        <h3 class="prato-card-title">
            ${refeicao.nome}
        </h3>

        <p class="prato-card-desc">
            ${refeicao.descricao || ""}
        </p>

        <div class="prato-card-macros">

            <div class="prato-card-macro-item">
                <span class="prato-card-macro-valor">${proteina}g</span>
                <span class="prato-card-macro-label">Prot</span>
            </div>

            <div class="prato-card-macro-item">
                <span class="prato-card-macro-valor">${carbo}g</span>
                <span class="prato-card-macro-label">Carb</span>
            </div>

            <div class="prato-card-macro-item">
                <span class="prato-card-macro-valor">${gordura}g</span>
                <span class="prato-card-macro-label">Gord</span>
            </div>

        </div>
    `;

    return card;
};

/*
========================================================
EXIBIR REFEIÇÕES (PAGINAÇÃO)
========================================================
*/
const exibirRefeicoes = () => {

    const container = document.getElementById("pratosGrid");

    const lista = refeicoesFiltradas;

    const fim = Math.min(indiceAtual + quantidadePorClique, lista.length);

    for (let i = indiceAtual; i < fim; i++) {
        container.appendChild(criarCard(lista[i]));
    }

    indiceAtual = fim;

    // esconde botão se acabou lista
    const btn = document.getElementById("btnCarregarMais");
    if (btn && indiceAtual >= lista.length) {
        btn.style.display = "none";
    }
};

/*
========================================================
RENDERIZAR LISTA (RESET)
========================================================
*/
function renderizarPratos(lista) {

    const container = document.getElementById("pratosGrid");

    container.innerHTML = "";

    indiceAtual = 0;

    refeicoesFiltradas = lista;

    const btn = document.getElementById("btnCarregarMais");
    if (btn) btn.style.display = "block";

    exibirRefeicoes();
}

/*
========================================================
PESQUISA
========================================================
*/
const inputPesquisa = document.getElementById("filtraralimento");

if (inputPesquisa) {
    inputPesquisa.addEventListener("input", () => {

        const texto = inputPesquisa.value.trim().toLowerCase();

        if (texto === "") {
            renderizarPratos(refeicoes);
            return;
        }

        const resultados = refeicoes.filter(prato =>
            prato.nome.toLowerCase().includes(texto)
        );

        if (resultados.length === 0) {
            document.getElementById("pratosGrid").innerHTML =
                `<p class="sem-resultados">Nenhuma refeição encontrada.</p>`;
            return;
        }

        renderizarPratos(resultados);
    });
}

/*
========================================================
BOTÃO CARREGAR MAIS
========================================================
*/
const btnCarregar = document.getElementById("btnCarregarMais");

if (btnCarregar) {
    btnCarregar.addEventListener("click", (event) => {
        event.preventDefault();
        exibirRefeicoes();
    });
}

/*
========================================================
INICIALIZAÇÃO
========================================================
*/
window.addEventListener("load", carregarRefeicoes);