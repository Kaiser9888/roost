// ============================================
// BIKE BUILDER - Sistema Profissional
// ============================================
const API_URL = 'http://localhost:8080/api';

// Dados de componentes - Estrutura profissional
const componentesDisponiveis = {
    frame: [
        { id: 1, nome: 'Alumínio Performance', categoria: 'frame', marca: 'TREK', modelo: 'FX 3', preco: 850.00, specs: 'Alumínio 6061, Geom. Urbana' },
        { id: 2, nome: 'Carbono Pro', categoria: 'frame', marca: 'SPECIALIZED', modelo: 'Tarmac', preco: 2400.00, specs: 'Carbono UD, Aerodinâmico' },
        { id: 3, nome: 'Aço Clássico', categoria: 'frame', marca: 'CALOI', modelo: 'Elite', preco: 650.00, specs: 'Aço Hi-Ten, Durável' }
    ],
    wheels: [
        { id: 1, nome: 'Aro 29" Dupla Câmara', categoria: 'wheels', marca: 'MAVIC', modelo: 'XM429', preco: 550.00, specs: 'Peso: 920g, Freio: Disco' },
        { id: 2, nome: 'Aro 28" Aerodinâmico', categoria: 'wheels', marca: 'SRAM', modelo: 'Roam', preco: 720.00, specs: 'Peso: 750g, Aerodinâmico' },
        { id: 3, nome: 'Aro 26" Trail', categoria: 'wheels', marca: 'TREK', modelo: 'Bontrager XR', preco: 480.00, specs: 'Peso: 850g, Off-road' }
    ],
    drivetrain: [
        { id: 1, nome: 'Transmissão 10 Vel.', categoria: 'drivetrain', marca: 'SHIMANO', modelo: 'Altus', preco: 320.00, specs: '10 velocidades, Durável' },
        { id: 2, nome: 'Transmissão 11 Vel.', categoria: 'drivetrain', marca: 'SRAM', modelo: 'NX', preco: 480.00, specs: '11 velocidades, 1x11' },
        { id: 3, nome: 'Transmissão 21 Vel.', categoria: 'drivetrain', marca: 'SHIMANO', modelo: 'Tourney', preco: 280.00, specs: '21 velocidades, 3x7' }
    ],
    brakes: [
        { id: 1, nome: 'Freio Disco Hidráulico', categoria: 'brakes', marca: 'SHIMANO', modelo: 'MT500', preco: 420.00, specs: 'Disco Hidráulico, 160mm' },
        { id: 2, nome: 'Freio V-Brake', categoria: 'brakes', marca: 'TEKTRO', modelo: 'Oryx', preco: 180.00, specs: 'V-Brake, Confiável' },
        { id: 3, nome: 'Freio Disco Mecânico', categoria: 'brakes', marca: 'AVID', modelo: 'B1', preco: 250.00, specs: 'Disco Mecânico, 160mm' }
    ],
    cockpit: [
        { id: 1, nome: 'Guidão Reto + Banco Conforto', categoria: 'cockpit', marca: 'VELO', modelo: 'Ergo Set', preco: 280.00, specs: 'Guidão 720mm + Banco Gel' },
        { id: 2, nome: 'Guidão Drop + Banco Racing', categoria: 'cockpit', marca: 'SPECIALIZED', modelo: 'Pro Set', preco: 520.00, specs: 'Guidão Drop + Banco Leve' },
        { id: 3, nome: 'Guidão Ajustável + Banco Esportivo', categoria: 'cockpit', marca: 'TREK', modelo: 'Fit Set', preco: 350.00, specs: 'Guidão Flex + Banco Médio' }
    ],
    accessories: [
        { id: 1, nome: 'Farol LED 300 Lumens', categoria: 'accessories', marca: 'CATEYE', modelo: 'Volt 300', preco: 180.00, specs: 'Frontal, USB Recarregável' },
        { id: 2, nome: 'Lanterna Traseira LED', categoria: 'accessories', marca: 'LEZYNE', modelo: 'KTV Drive', preco: 120.00, specs: 'Traseira, 150 Lumens' },
        { id: 3, nome: 'Cesto Premium', categoria: 'accessories', marca: 'BASIL', modelo: 'Forte', preco: 220.00, specs: 'Alumínio, 8kg Capacidade' },
        { id: 4, nome: 'Espelho Retrovisor', categoria: 'accessories', marca: 'MIRRYCLE', modelo: 'Mountain', preco: 85.00, specs: 'Segurança, Ajustável' }
    ]
};

// Estado da aplicação
let bikeConfig = {
    frame: null,
    wheels: null,
    drivetrain: null,
    brakes: null,
    cockpit: null,
    accessories: []
};

let carrinhoPersonalizado = [];
const componentesObrigatorios = ['frame', 'wheels', 'drivetrain', 'brakes', 'cockpit'];

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinho();
    inicializarBuilder();
    configurarNavegacao();
    carregarComponentes();
    configurarEventos();
    atualizarResumo();
});

function inicializarBuilder() {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
        navItems[0].classList.add('active');
        mostrarPainel('frame');
    }
}

function configurarNavegacao() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const component = this.dataset.component;
            mostrarPainel(component);
        });
    });
}

function mostrarPainel(component) {
    const paineis = document.querySelectorAll('.component-panel');
    paineis.forEach(p => p.style.display = 'none');
    
    const painel = document.getElementById(`panel-${component}`);
    if (painel) painel.style.display = 'block';
}

// ============================================
// CARREGAMENTO DE COMPONENTES
// ============================================
function carregarComponentes() {
    Object.keys(componentesDisponiveis).forEach(tipo => {
        const container = document.getElementById(`options-${tipo}`);
        if (!container) return;

        container.innerHTML = '';
        componentesDisponiveis[tipo].forEach(componente => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.innerHTML = `
                <div class="card-header">
                    <h4>${componente.marca}</h4>
                    <span class="card-model">${componente.modelo}</span>
                </div>
                <div class="card-body">
                    <p class="card-name">${componente.nome}</p>
                    <p class="card-specs">${componente.specs}</p>
                </div>
                <div class="card-footer">
                    <span class="card-price">R$ ${formatarPreco(componente.preco)}</span>
                    <button class="btn-select" data-tipo="${tipo}" data-id="${componente.id}">
                        Selecionar
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    });
}

// ============================================
// CONFIGURAR EVENTOS
// ============================================
function configurarEventos() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-select')) {
            const btn = e.target.closest('.btn-select');
            const tipo = btn.dataset.tipo;
            const id = parseInt(btn.dataset.id);
            selecionarComponente(tipo, id);
        }
    });

    document.getElementById('btn-add-cart')?.addEventListener('click', adicionarAoCarrinho);
    document.getElementById('btn-clear-builder')?.addEventListener('click', limparConfiguracao);
}

// ============================================
// SELEÇÃO DE COMPONENTES
// ============================================
function selecionarComponente(tipo, id) {
    const componente = componentesDisponiveis[tipo].find(c => c.id === id);
    
    if (tipo === 'accessories') {
        const existe = bikeConfig.accessories.find(a => a.id === id);
        if (!existe) {
            bikeConfig.accessories.push(componente);
        }
    } else {
        bikeConfig[tipo] = componente;
    }
    
    atualizarResumo();
    atualizarStatusNavegacao();
}

// ============================================
// ATUALIZAR STATUS DA NAVEGAÇÃO
// ============================================
function atualizarStatusNavegacao() {
    componentesObrigatorios.forEach(comp => {
        const status = document.getElementById(`status-${comp}`);
        if (status) {
            status.textContent = bikeConfig[comp] ? '●' : '○';
            status.style.color = bikeConfig[comp] ? '#2ecc71' : '#95a5a6';
        }
    });
}

// ============================================
// ATUALIZAR RESUMO
// ============================================
function atualizarResumo() {
    // Atualizar specs da bike
    atualizarSpecsDisplay();
    
    // Atualizar summary
    ['frame', 'wheels', 'drivetrain', 'brakes', 'cockpit'].forEach(tipo => {
        const element = document.getElementById(`summary-${tipo}`);
        if (element && bikeConfig[tipo]) {
            element.querySelector('.item-value').textContent = bikeConfig[tipo].nome;
        }
    });

    // Acessórios
    const accessoriesList = document.getElementById('summary-accessories-list');
    if (accessoriesList) {
        accessoriesList.innerHTML = '';
        if (bikeConfig.accessories.length > 0) {
            bikeConfig.accessories.forEach(acc => {
                const div = document.createElement('div');
                div.className = 'summary-item';
                div.innerHTML = `
                    <span class="item-label">Acessório:</span>
                    <span class="item-value">${acc.nome}</span>
                `;
                accessoriesList.appendChild(div);
            });
        }
    }

    // Preços
    atualizarPrecos();
    
    // Progress
    atualizarProgress();
    
    // Habilitar botão
    const btnAddCart = document.getElementById('btn-add-cart');
    const todosObrigatorios = componentesObrigatorios.every(c => bikeConfig[c]);
    if (btnAddCart) {
        btnAddCart.disabled = !todosObrigatorios;
    }
    
    // Atualizar contador
    atualizarCarrinhoBadge();
}

function atualizarSpecsDisplay() {
    const display = document.getElementById('component-display');
    if (!display) return;

    let html = '<div class="specs-display">';
    
    if (bikeConfig.frame) {
        html += `
            <div class="spec-row">
                <span class="spec-label">QUADRO:</span>
                <span class="spec-value">${bikeConfig.frame.marca} ${bikeConfig.frame.modelo}</span>
            </div>
        `;
    }
    if (bikeConfig.wheels) {
        html += `
            <div class="spec-row">
                <span class="spec-label">RODAS:</span>
                <span class="spec-value">${bikeConfig.wheels.marca} ${bikeConfig.wheels.modelo}</span>
            </div>
        `;
    }
    if (bikeConfig.drivetrain) {
        html += `
            <div class="spec-row">
                <span class="spec-label">TRANSMISSÃO:</span>
                <span class="spec-value">${bikeConfig.drivetrain.marca} ${bikeConfig.drivetrain.modelo}</span>
            </div>
        `;
    }
    if (bikeConfig.brakes) {
        html += `
            <div class="spec-row">
                <span class="spec-label">FREIOS:</span>
                <span class="spec-value">${bikeConfig.brakes.marca} ${bikeConfig.brakes.modelo}</span>
            </div>
        `;
    }
    if (bikeConfig.cockpit) {
        html += `
            <div class="spec-row">
                <span class="spec-label">GUIDÃO & BANCO:</span>
                <span class="spec-value">${bikeConfig.cockpit.marca} ${bikeConfig.cockpit.modelo}</span>
            </div>
        `;
    }
    
    html += '</div>';
    display.innerHTML = html;
}

function atualizarPrecos() {
    let subtotal = 0;
    
    ['frame', 'wheels', 'drivetrain', 'brakes', 'cockpit'].forEach(tipo => {
        if (bikeConfig[tipo]) {
            subtotal += bikeConfig[tipo].preco;
        }
    });
    
    bikeConfig.accessories.forEach(acc => {
        subtotal += acc.preco;
    });

    const frete = subtotal >= 500 ? 0 : Math.max(subtotal * 0.1, 20);
    const total = subtotal + frete;

    document.getElementById('subtotal-price').textContent = formatarPreco(subtotal);
    document.getElementById('shipping-price').textContent = formatarPreco(frete);
    document.getElementById('total-price').textContent = formatarPreco(total);
}

function atualizarProgress() {
    const total = componentesObrigatorios.length;
    const selecionados = componentesObrigatorios.filter(c => bikeConfig[c]).length;
    const percent = (selecionados / total) * 100;
    
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = percent + '%';
    }
}

// ============================================
// ADICIONAR AO CARRINHO
// ============================================
function adicionarAoCarrinho() {
    const todosObrigatorios = componentesObrigatorios.every(c => bikeConfig[c]);
    
    if (!todosObrigatorios) {
        alert('Selecione todos os componentes obrigatórios');
        return;
    }

    const bikePersonalizada = {
        id: Date.now(),
        dataCriacao: new Date().toISOString(),
        componentes: {
            frame: bikeConfig.frame,
            wheels: bikeConfig.wheels,
            drivetrain: bikeConfig.drivetrain,
            brakes: bikeConfig.brakes,
            cockpit: bikeConfig.cockpit,
            accessories: bikeConfig.accessories
        },
        precoTotal: calcularPrecoTotal(),
        quantidade: 1
    };

    carrinhoPersonalizado.push(bikePersonalizada);
    localStorage.setItem('carrinhoPersonalizado', JSON.stringify(carrinhoPersonalizado));

    mostrarMensagem('Bike adicionada ao carrinho com sucesso!', 'success');
    atualizarCarrinhoBadge();
    
    setTimeout(() => {
        window.location.href = 'carrinho.html';
    }, 1500);
}

function limparConfiguracao() {
    if (confirm('Deseja limpar toda a configuração?')) {
        bikeConfig = {
            frame: null,
            wheels: null,
            drivetrain: null,
            brakes: null,
            cockpit: null,
            accessories: []
        };
        atualizarResumo();
        mostrarMensagem('Configuração limpa', 'info');
    }
}

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================
function calcularPrecoTotal() {
    let total = 0;
    componentesObrigatorios.forEach(tipo => {
        if (bikeConfig[tipo]) {
            total += bikeConfig[tipo].preco;
        }
    });
    bikeConfig.accessories.forEach(acc => {
        total += acc.preco;
    });
    return total;
}

function formatarPreco(valor) {
    if (typeof valor !== 'number') return '0,00';
    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function carregarCarrinho() {
    const carrinho = localStorage.getItem('carrinhoPersonalizado');
    if (carrinho) {
        carrinhoPersonalizado = JSON.parse(carrinho);
    }
}

function atualizarCarrinhoBadge() {
    const contador = document.getElementById('carrinho-contador');
    if (contador) {
        contador.textContent = carrinhoPersonalizado.length;
    }
}

function mostrarMensagem(texto, tipo = 'info') {
    const mensagensAntigas = document.querySelectorAll('.message');
    mensagensAntigas.forEach(msg => msg.remove());

    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `message ${tipo}`;
    mensagemDiv.innerHTML = `<span>${texto}</span>`;

    const container = document.querySelector('.container-builder') || document.body;
    container.insertBefore(mensagemDiv, container.firstChild);

    setTimeout(() => {
        if (mensagemDiv.parentNode) {
            mensagemDiv.remove();
        }
    }, 5000);
}
