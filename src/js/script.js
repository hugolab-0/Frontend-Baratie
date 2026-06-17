'use strict';

const Url = "http://localhost:8080";

let alimentos = [];
let indiceAtual = 0;
const quantidadePorClique = 6;

async function carregarDados() {
    const response = await fetch(`${Url}/v1/baratie/alimento`);
    const data = await response.json();

    console.log(data);

    alimentos = data.response.alimento;
}

async function ListarMarmitas() {

    if (alimentos.length === 0) {
        await carregarDados();
    }

    const pratosGrid = document.getElementById('pratosGrid');

    const proximosAlimentos = alimentos.slice(
        indiceAtual,
        indiceAtual + quantidadePorClique
    );

    proximosAlimentos.forEach(prato => {

        const calorias =
            Number(prato.carboidratos_g) * 4 +
            Number(prato.proteinas_g) * 4 +
            Number(prato.lipidios_g) * 9;

        const card = document.createElement('div');
        card.classList.add('prato-card', 'prato-card--destaque');

        card.innerHTML = `
            <img
                class="prato-card-img"
                src="src/assets/images/marmita-1.svg"
                alt="${prato.nome}"
            >

            <span class="prato-card-kcal">
                ${Math.round(calorias)} Kcal
            </span>

            <h3 class="prato-card-title">
                ${prato.nome}
            </h3>

            <p class="prato-card-desc">
                ${prato.descricao ?? ''}
            </p>

            <div class="prato-card-macros">

                <div class="prato-card-macro-item">
                    <span class="prato-card-macro-valor">
                        ${prato.proteinas_g}g
                    </span>
                    <span class="prato-card-macro-label">
                        prot
                    </span>
                </div>

                <div class="prato-card-macro-item">
                    <span class="prato-card-macro-valor">
                        ${prato.carboidratos_g}g
                    </span>
                    <span class="prato-card-macro-label">
                        carb
                    </span>
                </div>

                <div class="prato-card-macro-item">
                    <span class="prato-card-macro-valor">
                        ${prato.lipidios_g}g
                    </span>
                    <span class="prato-card-macro-label">
                        gord
                    </span>
                </div>

            </div>
        `;

        pratosGrid.appendChild(card);
    });

    indiceAtual += quantidadePorClique;

  
}

document.getElementById('btnCarregarMais').addEventListener('click', async (e) => {
    e.preventDefault();
    await ListarMarmitas();
});