'use strict';

const Url = "http://localhost:8080";

let alimentos = [];
let indiceAtual = 0;
const quantidadePorClique = 6;

async function carregarDados() {
    try {
        const response = await fetch(`${Url}/v1/baratie/alimento`);
        const data = await response.json();

        alimentos = data.response.alimento;
    } catch (error) {
        console.error('Erro ao carregar alimentos:', error);
    }
}

async function ListarMarmitas() {
    const response = await fetch(`${Url}/v1/baratie/alimento`);
    const data = await response.json();

    const pratosGrid = document.getElementById('pratosGrid');

    data.response.alimento.forEach(prato => {

        const calorias =
        (Number(prato.carboidratos_g) * 4) +
        (Number(prato.proteinas_g) * 4) +
        (Number(prato.lipidios_g) * 9);

        const card = document.createElement('div');
        card.classList.add('prato-card', 'prato-card--destaque');

        card.innerHTML = `
            <img class="prato-card-img" src="${prato.imagem}" alt="${prato.nome}" />

                  <span class="prato-card-kcal"> ${Math.round(calorias)} Kcal </span>

                <h3 class="prato-card-title">${prato.nome}</h3>

    <p class="prato-card-desc">${prato.descricao}</p>

    <div class="prato-card-macros">

        <div class="prato-card-macro-item">
            <span class="prato-card-macro-valor">${prato.proteinas_g}g</span>
            <span class="prato-card-macro-label">prot</span>
        </div>

        <div class="prato-card-macro-item">
            <span class="prato-card-macro-valor">${prato.carboidratos_g}g</span>
            <span class="prato-card-macro-label">carb</span>
        </div>

        <div class="prato-card-macro-item">
            <span class="prato-card-macro-valor">${prato.lipidios_g}g</span>
            <span class="prato-card-macro-label">gord</span>
        </div>

    </div>
`;

        pratosGrid.appendChild(card);
    });
}

const btnCarregar = document.getElementById('btnCarregarMais')

btnCarregar.addEventListener('click', async (e) => {
    e.preventDefault();
    await ListarMarmitas();

    btnCarregar.style.display = 'none';
});