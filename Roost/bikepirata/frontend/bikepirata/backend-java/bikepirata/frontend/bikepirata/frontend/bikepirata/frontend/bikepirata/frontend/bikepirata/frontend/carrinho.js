// ============================================
// CONFIGURAÇÃO DO CARRINHO
// ============================================
const API_URL = 'http://localhost:8080/api';

// Estado do carrinho
let carrinho = [];
let desconto = 0;
let frete = 0;

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinho();
    configurarEventos();
    atualizarCarrinho();
});

// ============================================
// CARREGAR CARRINHO
// ============================================
function carregarCarrinho() {
    const carrinhoLocalStorage = localStorage.getItem('carrinhoPersonalizado');
    if (carrinhoLocalStorage) {
        carrinho = JSON.parse(carrinhoLocalStorage);
    }
}

// ============================================
// CONFIGURAR EVENTOS
// ============================================
function configurarEventos() {
    document.getElementById('btn-continuar-comprando')?.addEventListener('click', function() {
        window.location.href = 'personalizar.html';
    });

    document.getElementById('btn-finalizar-compra')?.addEventListener('click', finalizarCompra);
    document.getElementById('btn-aplicar-cupom')?.addEventListener('click', aplicarCupom);

    // Eventos de quantidade
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-aumentar')) {
            const id = e.target.closest('.btn-aumentar').dataset.id;
            aumentarQuantidade(id);
        }
        if (e.target.closest('.btn-diminuir')) {
            const id = e.target.closest('.btn-diminuir').dataset.id;
            diminuirQuantidade(id);
        }
        if (e.target.closest('.btn-remover')) {
            const id = e.target.closest('.btn-remover').dataset.id;
            removerDoCarrinho(id);
        }
    });
}

// ============================================
// ATUALIZAR CARRINHO
// ============================================
function atualizarCarrinho() {
    const carrinhoVazio = document.getElementById('carrinho-vazio');
    const carrinhoConteudo = document.getElementById('carrinho-conteudo');
    const tbody = document.getElementById('tbody-carrinho');

    if (carrinho.length === 0) {
        if (carrinhoVazio) carrinhoVazio.style.display = 'block';
        if (carrinhoConteudo) carrinhoConteudo.style.display = 'none';
        return;
    }

    if (carrinhoVazio) carrinhoVazio.style.display = 'none';
    if (carrinhoConteudo) carrinhoConteudo.style.display = 'block';

    // Limpar tabela
    tbody.innerHTML = '';

    // Adicionar linhas
    carrinho.forEach(bike => {
        const descricao = `Bike Personalizada #${bike.id}`;
        const vendedores = obterVendedoresUnicos(bike.componentes);
        const subtotal = bike.precoTotal * bike.quantidade;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="col-descricao">
                <div class="descricao-bike">
                    <h4>${descricao}</h4>
                    <small class="componentes-list">
                        ${bike.componentes.quadro.modelo}<br>
                        ${bike.componentes.rodas.modelo}<br>
                        ${bike.componentes.freios.modelo}
                    </small>
                </div>
            </td>
            <td class="col-vendedor">
                <div class="vendedores-list">
                    ${vendedores.map(v => `<span class="badge-vendedor">${v}</span>`).join('')}
                </div>
            </td>
            <td class="col-preco">${formatarPreco(bike.precoTotal)}</td>
            <td class="col-quantidade">
                <div class="quantidade-controle">
                    <button class="btn-diminuir" data-id="${bike.id}">-</button>
                    <input type="number" value="${bike.quantidade}" readonly>
                    <button class="btn-aumentar" data-id="${bike.id}">+</button>
                </div>
            </td>
            <td class="col-subtotal">${formatarPreco(subtotal)}</td>
            <td class="col-acao">
                <button class="btn-remover" data-id="${bike.id}" title="Remover">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    atualizarTotais();
}

// ============================================
// QUANTIDADE
// ============================================
function aumentarQuantidade(id) {
    const bike = carrinho.find(b => b.id == id);
    if (bike) {
        bike.quantidade++;
        salvarCarrinho();
        atualizarCarrinho();
    }
}

function diminuirQuantidade(id) {
    const bike = carrinho.find(b => b.id == id);
    if (bike && bike.quantidade > 1) {
        bike.quantidade--;
        salvarCarrinho();
        atualizarCarrinho();
    }
}

function removerDoCarrinho(id) {
    if (confirm('Deseja remover este item do carrinho?')) {
        carrinho = carrinho.filter(b => b.id != id);
        salvarCarrinho();
        atualizarCarrinho();
        mostrarMensagem('Item removido do carrinho', 'info');
    }
}

// ============================================
// TOTAIS
// ============================================
function atualizarTotais() {
    // Calcular subtotal
    const subtotal = carrinho.reduce((total, bike) => {
        return total + (bike.precoTotal * bike.quantidade);
    }, 0);

    // Calcular frete (simulado)
    frete = calcularFrete(subtotal);

    // Total
    const total = subtotal + frete - desconto;

    // Atualizar elementos
    const subtotalEl = document.getElementById('subtotal');
    const freteEl = document.getElementById('frete');
    const descontoEl = document.getElementById('desconto');
    const totalEl = document.getElementById('total');
    const descontoContainer = document.getElementById('desconto-container');

    if (subtotalEl) subtotalEl.textContent = formatarPreco(subtotal);
    if (freteEl) freteEl.textContent = formatarPreco(frete);
    
    if (desconto > 0) {
        if (descontoContainer) descontoContainer.style.display = 'flex';
        if (descontoEl) descontoEl.textContent = `-${formatarPreco(desconto)}`;
    } else {
        if (descontoContainer) descontoContainer.style.display = 'none';
    }
    
    if (totalEl) totalEl.textContent = formatarPreco(total);
}

// ============================================
// CUPOM DE DESCONTO
// ============================================
function aplicarCupom() {
    const cupomInput = document.getElementById('cupom-input');
    const cupom = cupomInput?.value.toUpperCase().trim();

    if (!cupom) {
        mostrarMensagem('Por favor, digite um código de cupom', 'info');
        return;
    }

    // Simular validação de cupom (na prática seria chamado na API)
    const cuponsValidos = {
        'PRIMEIRACOMPRA': 50,
        'ROOST10': 10,
        'ROOST20': 20,
        'DESCONTO50': 50,
        'MEGA100': 100
    };

    if (cuponsValidos[cupom]) {
        desconto = cuponsValidos[cupom];
        mostrarMensagem(`Cupom aplicado! Desconto de ${formatarPreco(desconto)} concedido.`, 'success');
        cupomInput.disabled = true;
        document.getElementById('btn-aplicar-cupom').disabled = true;
        atualizarTotais();
    } else {
        mostrarMensagem('Cupom inválido ou expirado', 'error');
    }
}

// ============================================
// FRETE
// ============================================
function calcularFrete(subtotal) {
    // Frete grátis acima de R$ 500
    if (subtotal >= 500) {
        return 0;
    }
    
    // Cálculo simples: 10% do subtotal ou mínimo de R$ 20
    const freteCalc = Math.max(subtotal * 0.1, 20);
    return freteCalc;
}

// ============================================
// FINALIZAR COMPRA
// ============================================
async function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Verificar se usuário está logado
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        alert('Você precisa estar logado para finalizar a compra!');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Preparar dados do pedido
        const pedido = {
            usuarioId: usuario.id,
            itens: carrinho.map(bike => ({
                bikePersonalizadaId: bike.id,
                componentes: bike.componentes,
                quantidade: bike.quantidade,
                precoTotal: bike.precoTotal
            })),
            subtotal: calcularSubtotal(),
            frete: frete,
            desconto: desconto,
            total: calcularTotal(),
            dataPedido: new Date().toISOString()
        };

        // Enviar para API
        const response = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        if (response.ok) {
            const result = await response.json();
            
            // Limpar carrinho
            localStorage.removeItem('carrinhoPersonalizado');
            carrinho = [];

            mostrarMensagem('Pedido realizado com sucesso!', 'success');
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'meus-anuncios.html';
            }, 2000);
        } else {
            mostrarMensagem('Erro ao finalizar pedido', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao finalizar pedido', 'error');
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function obterVendedoresUnicos(componentes) {
    const vendedores = new Set();
    
    ['quadro', 'rodas', 'freios', 'corrente', 'guidao', 'banco'].forEach(tipo => {
        if (componentes[tipo]) {
            vendedores.add(componentes[tipo].vendedor);
        }
    });
    
    componentes.acessorios?.forEach(acessorio => {
        vendedores.add(acessorio.vendedor);
    });

    return Array.from(vendedores);
}

function calcularSubtotal() {
    return carrinho.reduce((total, bike) => {
        return total + (bike.precoTotal * bike.quantidade);
    }, 0);
}

function calcularTotal() {
    const subtotal = calcularSubtotal();
    return subtotal + frete - desconto;
}

function formatarPreco(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function salvarCarrinho() {
    localStorage.setItem('carrinhoPersonalizado', JSON.stringify(carrinho));
}

function mostrarMensagem(texto, tipo = 'info') {
    const mensagensAntigas = document.querySelectorAll('.message');
    mensagensAntigas.forEach(msg => msg.remove());

    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `message ${tipo}`;
    mensagemDiv.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${texto}</span>
    `;

    const container = document.querySelector('.container') || document.body;
    container.insertBefore(mensagemDiv, container.firstChild);

    setTimeout(() => {
        if (mensagemDiv.parentNode) {
            mensagemDiv.remove();
        }
    }, 5000);
}
