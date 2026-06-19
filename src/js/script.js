'use strict';

const Url = "http://localhost:8080";

let refeicoes = [];
let indiceAtual = 0;
const quantidadePorClique = 6;

// ===============================
// CARREGAR DADOS
// ===============================
const carregarDados = async () => {
    try {

        const response = await fetch(`${Url}/v1/baratie/refeicao`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log("API RESPONSE:", data);

        refeicoes = data?.response?.refeicao || [];

        console.log("REFEIÇÕES:", refeicoes);

        exibirRefeicoes();

    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
};

// ===============================
// CRIAR CARD
// ===============================
// ===============================
// CRIAR CARD
// ===============================
const criarCard = (refeicao) => {

    const calorias =
        refeicao.calorias ??
        ((Number(refeicao.proteinas_g) * 4) +
        (Number(refeicao.carboidratos_g)  * 4)+
        (Number(refeicao.lipidios_g)  * 9));

    const card = document.createElement("div");
    card.className = "prato-card";

    card.innerHTML = `
        <img
            class="prato-card-img"
            src="${refeicao.img}"
            alt="${refeicao.nome}"
        >

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
                <span class="prato-card-macro-valor">
                    ${refeicao.proteinas_g}g
                </span>

                <span class="prato-card-macro-label">
                    Prot
                </span>
            </div>

            <div class="prato-card-macro-item">
                <span class="prato-card-macro-valor">
                    ${refeicao.carboidratos_g ?? 0}g
                </span>

                <span class="prato-card-macro-label">
                    Carb
                </span>
            </div>

            <div class="prato-card-macro-item">
                <span class="prato-card-macro-valor">
                    ${refeicao.lipidios_g ?? 0}g
                </span>

                <span class="prato-card-macro-label">
                    Gord
                </span>
            </div>

        </div>
    `;

    return card;
};

// ===============================
// EXIBIR NO GRID
// ===============================
const exibirRefeicoes = () => {

    const container = document.getElementById("pratosGrid");

    if (!container) {
        console.error("Elemento #pratosGrid não encontrado.");
        return;
    }

    const fim = Math.min(indiceAtual + quantidadePorClique, refeicoes.length);

    for (let i = indiceAtual; i < fim; i++) {
        container.appendChild(criarCard(refeicoes[i]));
    }

    indiceAtual = fim;

    if (indiceAtual >= refeicoes.length) {
        const btn = document.getElementById("btnCarregarMais");
        if (btn) {
            btn.style.display = "none";
        }
    }
};

// ===============================
// BOTÃO CARREGAR MAIS
// ===============================
document.getElementById("btnCarregarMais")?.addEventListener("click", (event) => {
    event.preventDefault();
    exibirRefeicoes();
});

// ===============================
// INICIALIZAÇÃO
// ===============================
window.addEventListener("load", carregarDados);