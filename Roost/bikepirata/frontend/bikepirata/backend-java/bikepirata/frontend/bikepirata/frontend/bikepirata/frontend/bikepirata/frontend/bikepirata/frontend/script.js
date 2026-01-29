// ============================================
// CONFIGURAÇÕES DA API
// ============================================
const API_URL = 'http://localhost:8080/api';

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================
let usuarioLogado = JSON.parse(localStorage.getItem('usuario')) || null;
let produtos = [];
let paginaAtual = 1;
const produtosPorPagina = 12;

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar interface do usuário
    atualizarInterfaceUsuario();
    
    // Verificar se está logado nas páginas que precisam
    verificarLoginRequerido();
    
    // Configurar páginas específicas
    if (document.getElementById('grid-produtos')) {
        // Página principal
        carregarProdutos();
        configurarFiltros();
        configurarCategorias();
        configurarOrdenacao();
    }
    
    if (document.getElementById('form-busca')) {
        configurarBusca();
    }
    
    if (document.getElementById('form-cadastro')) {
        configurarCadastro();
    }
    
    if (document.getElementById('form-login')) {
        configurarLogin();
    }
    
    if (document.getElementById('form-anunciar')) {
        configurarFormAnunciar();
    }
    
    if (document.getElementById('meus-anuncios-content')) {
        carregarMeusAnuncios();
    }
    
    if (document.getElementById('produto-titulo')) {
        carregarDetalhesProduto();
    }
    
    // Configurar logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
            e.preventDefault();
            fazerLogout();
        });
    }
    
    const btnSair = document.getElementById('btn-sair');
    if (btnSair) {
        btnSair.addEventListener('click', function(e) {
            e.preventDefault();
            fazerLogout();
        });
    }
    
    // Carregar mais produtos
    const btnCarregarMais = document.getElementById('btn-carregar-mais');
    if (btnCarregarMais) {
        btnCarregarMais.addEventListener('click', carregarMaisProdutos);
    }
});

// ============================================
// FUNÇÕES DE USUÁRIO
// ============================================
function atualizarInterfaceUsuario() {
    const btnLogin = document.getElementById('btn-login');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    
    if (usuarioLogado) {
        if (btnLogin) btnLogin.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            if (userName) userName.textContent = usuarioLogado.nome.split(' ')[0];
        }
    } else {
        if (btnLogin) btnLogin.style.display = 'inline-flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

function verificarLoginRequerido() {
    const path = window.location.pathname;
    const paginasProtegidas = ['vender.html', 'meus-anuncios.html'];
    const paginaAtual = path.substring(path.lastIndexOf('/') + 1);
    
    if (paginasProtegidas.includes(paginaAtual) && !usuarioLogado) {
        if (paginaAtual === 'vender.html') {
            alert('Você precisa estar logado para anunciar uma bike!');
            window.location.href = 'login.html';
        }
    }
    
    // Na página meus-anuncios, mostrar mensagem se não estiver logado
    if (paginaAtual === 'meus-anuncios.html') {
        const loginRequired = document.getElementById('login-required');
        const meusAnunciosContent = document.getElementById('meus-anuncios-content');
        
        if (!usuarioLogado) {
            if (loginRequired) loginRequired.style.display = 'block';
            if (meusAnunciosContent) meusAnunciosContent.style.display = 'none';
        } else {
            if (loginRequired) loginRequired.style.display = 'none';
            if (meusAnunciosContent) meusAnunciosContent.style.display = 'block';
        }
    }
}

function fazerLogout() {
    localStorage.removeItem('usuario');
    usuarioLogado = null;
    atualizarInterfaceUsuario();
    window.location.href = 'index.html';
}

// ============================================
// FUNÇÕES DE PRODUTOS
// ============================================
async function carregarProdutos(filtros = {}) {
    try {
        mostrarLoading(true);
        
        let url = `${API_URL}/produtos`;
        const params = new URLSearchParams();
        
        if (filtros.categoria) params.append('categoria', filtros.categoria);
        if (filtros.estado) params.append('estado', filtros.estado);
        if (filtros.termo) params.append('termo', filtros.termo);
        
        const queryString = params.toString();
        if (queryString) url += `/buscar?${queryString}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao carregar produtos');
        
        produtos = await response.json();
        exibirProdutos(produtos.slice(0, produtosPorPagina));
        
        mostrarLoading(false);
    } catch (error) {
        console.error('Erro:', error);
        mostrarLoading(false);
        // Dados de exemplo para demonstração
        exibirProdutosDemo();
    }
}

function exibirProdutos(listaProdutos) {
    const grid = document.getElementById('grid-produtos');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (listaProdutos.length === 0) {
        grid.innerHTML = `
            <div class="nenhum-produto">
                <i class="fas fa-bicycle"></i>
                <h3>Nenhuma bike encontrada</h3>
                <p>Tente alterar os filtros ou cadastre a primeira bike!</p>
                <a href="vender.html" class="btn-primary">Anunciar Primeira Bike</a>
            </div>
        `;
        return;
    }
    
    listaProdutos.forEach(produto => {
        const precoFormatado = formatarPreco(produto.preco);
        const dataFormatada = new Date(produto.dataPublicacao).toLocaleDateString('pt-BR');
        
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <div class="produto-imagem">
                <i class="fas fa-bicycle"></i>
            </div>
            <div class="produto-info">
                <h3 class="produto-titulo">${produto.titulo}</h3>
                <p class="produto-preco">${precoFormatado}</p>
                <p class="produto-local">
                    <i class="fas fa-map-marker-alt"></i>
                    ${produto.cidade} - ${produto.estado}
                </p>
                <p class="produto-data">Publicado em ${dataFormatada}</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `produto.html?id=${produto.id}`;
        });
        
        grid.appendChild(card);
    });
    
    // Mostrar/ocultar botão de carregar mais
    const btnCarregarMais = document.getElementById('btn-carregar-mais');
    if (btnCarregarMais) {
        if (produtos.length > paginaAtual * produtosPorPagina) {
            btnCarregarMais.style.display = 'block';
        } else {
            btnCarregarMais.style.display = 'none';
        }
    }
}

function exibirProdutosDemo() {
    const produtosDemo = [
        {
            id: 1,
            titulo: "Caloi Explorer 29 - Mountain Bike",
            preco: 1200.00,
            cidade: "São Paulo",
            estado: "SP",
            dataPublicacao: "2024-01-20"
        },
        {
            id: 2,
            titulo: "Specialized Allez Sprint - Speed",
            preco: 8500.00,
            cidade: "Rio de Janeiro",
            estado: "RJ",
            dataPublicacao: "2024-01-18"
        },
        {
            id: 3,
            titulo: "Bike Urbana Monark - Aro 26",
            preco: 650.00,
            cidade: "Belo Horizonte",
            estado: "MG",
            dataPublicacao: "2024-01-15"
        },
        {
            id: 4,
            titulo: "Bike Elétrica Smart - 250W",
            preco: 3200.00,
            cidade: "Curitiba",
            estado: "PR",
            dataPublicacao: "2024-01-10"
        }
    ];
    
    exibirProdutos(produtosDemo);
}

function carregarMaisProdutos() {
    paginaAtual++;
    const inicio = (paginaAtual - 1) * produtosPorPagina;
    const fim = inicio + produtosPorPagina;
    const maisProdutos = produtos.slice(inicio, fim);
    
    if (maisProdutos.length > 0) {
        const grid = document.getElementById('grid-produtos');
        maisProdutos.forEach(produto => {
            const precoFormatado = formatarPreco(produto.preco);
            const dataFormatada = new Date(produto.dataPublicacao).toLocaleDateString('pt-BR');
            
            const card = document.createElement('div');
            card.className = 'produto-card';
            card.innerHTML = `
                <div class="produto-imagem">
                    <i class="fas fa-bicycle"></i>
                </div>
                <div class="produto-info">
                    <h3 class="produto-titulo">${produto.titulo}</h3>
                    <p class="produto-preco">${precoFormatado}</p>
                    <p class="produto-local">
                        <i class="fas fa-map-marker-alt"></i>
                        ${produto.cidade} - ${produto.estado}
                    </p>
                    <p class="produto-data">Publicado em ${dataFormatada}</p>
                </div>
            `;
            
            card.addEventListener('click', () => {
                window.location.href = `produto.html?id=${produto.id}`;
            });
            
            grid.appendChild(card);
        });
    }
    
    // Esconder botão se não houver mais produtos
    const btnCarregarMais = document.getElementById('btn-carregar-mais');
    if (btnCarregarMais && produtos.length <= paginaAtual * produtosPorPagina) {
        btnCarregarMais.style.display = 'none';
    }
}

function formatarPreco(preco) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(preco);
}

// ============================================
// CONFIGURAÇÕES DE FILTROS E BUSCA
// ============================================
function configurarFiltros() {
    const btnFiltrar = document.getElementById('btn-filtrar');
    if (!btnFiltrar) return;
    
    btnFiltrar.addEventListener('click', aplicarFiltros);
}

function aplicarFiltros() {
    const categoria = document.getElementById('filtro-categoria').value;
    const estado = document.getElementById('filtro-estado').value;
    const condicao = document.getElementById('filtro-condicao').value;
    const minPreco = document.getElementById('preco-min').value;
    const maxPreco = document.getElementById('preco-max').value;
    
    const filtros = {};
    if (categoria) filtros.categoria = categoria;
    if (estado) filtros.estado = estado;
    if (condicao) filtros.condicao = condicao;
    
    // Resetar páginação
    paginaAtual = 1;
    
    carregarProdutos(filtros);
}

function configurarCategorias() {
    const linksCategoria = document.querySelectorAll('[data-categoria]');
    linksCategoria.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoria = this.getAttribute('data-categoria');
            document.getElementById('filtro-categoria').value = categoria;
            carregarProdutos({ categoria });
        });
    });
}

function configurarBusca() {
    const formBusca = document.getElementById('form-busca');
    if (!formBusca) return;
    
    formBusca.addEventListener('submit', function(e) {
        e.preventDefault();
        const termo = document.getElementById('busca-input').value.trim();
        if (termo) {
            carregarProdutos({ termo });
        }
    });
}

function configurarOrdenacao() {
    const selectOrdenar = document.getElementById('ordenar-por');
    if (!selectOrdenar) return;
    
    selectOrdenar.addEventListener('change', function() {
        const ordem = this.value;
        let produtosOrdenados = [...produtos];
        
        switch (ordem) {
            case 'baratos':
                produtosOrdenados.sort((a, b) => a.preco - b.preco);
                break;
            case 'caros':
                produtosOrdenados.sort((a, b) => b.preco - a.preco);
                break;
            case 'recentes':
                produtosOrdenados.sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao));
                break;
        }
        
        exibirProdutos(produtosOrdenados.slice(0, produtosPorPagina));
    });
}

// ============================================
// CADASTRO E LOGIN
// ============================================
function configurarCadastro() {
    const formCadastro = document.getElementById('form-cadastro');
    if (!formCadastro) return;
    
    // Validação de senha
    const inputSenha = document.getElementById('senha');
    if (inputSenha) {
        const feedback = document.querySelector('.password-feedback');
        
        inputSenha.addEventListener('input', function() {
            const senha = this.value;
            
            if (senha.length < 6) {
                feedback.textContent = 'A senha deve ter pelo menos 6 caracteres';
                feedback.style.color = '#ff4444';
            } else if (senha.length > 50) {
                feedback.textContent = 'A senha é muito longa';
                feedback.style.color = '#ff4444';
            } else {
                feedback.textContent = 'Senha válida';
                feedback.style.color = '#4CAF50';
            }
        });
    }
    
    // Validação de email
    const inputEmail = document.getElementById('email');
    if (inputEmail) {
        inputEmail.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#ff4444';
                this.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
            } else {
                this.style.borderColor = '#333';
                this.style.boxShadow = 'none';
            }
        });
    }
    
    // Formatar telefone
    const inputTelefone = document.getElementById('telefone');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', formatarTelefone);
    }
    
    // Submit do formulário
    formCadastro.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const usuario = {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            senha: document.getElementById('senha').value,
            telefone: document.getElementById('telefone').value,
            cidade: document.getElementById('cidade').value.trim(),
            estado: document.getElementById('estado').value
        };
        
        // Validações básicas
        if (!usuario.nome || !usuario.email || !usuario.senha) {
            mostrarMensagem('Preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        if (usuario.senha.length < 6) {
            mostrarMensagem('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }
        
        try {
            mostrarLoading(true);
            
            const response = await fetch(`${API_URL}/auth/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });
            
            const data = await response.json();
            
            if (data.success) {
                mostrarMensagem('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                mostrarMensagem(data.message || 'Erro ao cadastrar. Tente novamente.', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagem('Erro ao conectar com o servidor. Tente novamente.', 'error');
        } finally {
            mostrarLoading(false);
        }
    });
}

function configurarLogin() {
    const formLogin = document.getElementById('form-login');
    if (!formLogin) return;
    
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const senha = document.getElementById('login-senha').value;
        
        if (!email || !senha) {
            mostrarMensagem('Preencha todos os campos', 'error');
            return;
        }
        
        try {
            mostrarLoading(true);
            
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Salvar usuário no localStorage
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                usuarioLogado = data.usuario;
                
                mostrarMensagem('Login realizado com sucesso!', 'success');
                
                setTimeout(() => {
                    // Redirecionar para página anterior ou index
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect') || 'index.html';
                    window.location.href = redirect;
                }, 1500);
            } else {
                mostrarMensagem(data.message || 'Email ou senha incorretos', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagem('Erro ao conectar com o servidor', 'error');
        } finally {
            mostrarLoading(false);
        }
    });
}

// ============================================
// FORMULÁRIO DE ANÚNCIO
// ============================================
function configurarFormAnunciar() {
    const formAnunciar = document.getElementById('form-anunciar');
    if (!formAnunciar) return;
    
    // Verificar se está logado
    if (!usuarioLogado) {
        window.location.href = 'login.html?redirect=vender.html';
        return;
    }
    
    // Validação de preço
    const inputPreco = document.getElementById('preco');
    if (inputPreco) {
        inputPreco.addEventListener('input', function() {
            const valor = parseFloat(this.value);
            if (valor < 0) {
                this.value = 0;
            }
        });
    }
    
    // Validação de telefone
    const inputTelefone = document.getElementById('telefone-anuncio');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', formatarTelefone);
    }
    
    // Contador de caracteres para descrição
    const textareaDescricao = document.getElementById('descricao');
    const charCount = document.querySelector('.char-count');
    if (textareaDescricao && charCount) {
        textareaDescricao.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = `${count}/2000`;
            
            if (count > 1800) {
                charCount.className = 'char-count warning';
            } else if (count > 1950) {
                charCount.className = 'char-count error';
            } else {
                charCount.className = 'char-count';
            }
        });
    }
    
    // Preencher dados do usuário
    preencherDadosUsuario();
    
    // Submit do formulário
    formAnunciar.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validarFormAnunciar()) {
            return;
        }
        
        const produto = {
            titulo: document.getElementById('titulo').value.trim(),
            descricao: document.getElementById('descricao').value.trim(),
            preco: parseFloat(document.getElementById('preco').value),
            categoria: document.getElementById('categoria').value,
            condicao: document.getElementById('condicao').value,
            marca: document.getElementById('marca').value.trim() || null,
            aro: document.getElementById('aro').value ? parseInt(document.getElementById('aro').value) : null,
            marchas: document.getElementById('marchas').value ? parseInt(document.getElementById('marchas').value) : null,
            suspensao: document.getElementById('suspensao').value || null,
            cidade: document.getElementById('cidade-anuncio').value.trim(),
            estado: document.getElementById('estado-anuncio').value,
            telefone: document.getElementById('telefone-anuncio').value,
            vendedorId: usuarioLogado.id,
            vendedorNome: usuarioLogado.nome
        };
        
        try {
            mostrarLoading(true);
            
            const response = await fetch(`${API_URL}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
            
            const data = await response.json();
            
            if (data.success) {
                mostrarMensagem('Anúncio publicado com sucesso! Redirecionando...', 'success');
                
                setTimeout(() => {
                    window.location.href = `produto.html?id=${data.produto.id}`;
                }, 2000);
            } else {
                mostrarMensagem(data.message || 'Erro ao publicar anúncio', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagem('Erro ao conectar com o servidor', 'error');
        } finally {
            mostrarLoading(false);
        }
    });
}

function validarFormAnunciar() {
    const titulo = document.getElementById('titulo').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const preco = document.getElementById('preco').value;
    const categoria = document.getElementById('categoria').value;
    const condicao = document.getElementById('condicao').value;
    const cidade = document.getElementById('cidade-anuncio').value.trim();
    const estado = document.getElementById('estado-anuncio').value;
    const telefone = document.getElementById('telefone-anuncio').value;
    
    if (!titulo || titulo.length < 10) {
        mostrarMensagem('O título deve ter pelo menos 10 caracteres', 'error');
        return false;
    }
    
    if (!descricao || descricao.length < 20) {
        mostrarMensagem('A descrição deve ter pelo menos 20 caracteres', 'error');
        return false;
    }
    
    if (!preco || parseFloat(preco) <= 0) {
        mostrarMensagem('Digite um preço válido', 'error');
        return false;
    }
    
    if (!categoria) {
        mostrarMensagem('Selecione uma categoria', 'error');
        return false;
    }
    
    if (!condicao) {
        mostrarMensagem('Selecione a condição da bike', 'error');
        return false;
    }
    
    if (!cidade) {
        mostrarMensagem('Digite a cidade', 'error');
        return false;
    }
    
    if (!estado) {
        mostrarMensagem('Selecione o estado', 'error');
        return false;
    }
    
    if (!telefone || telefone.length < 14) {
        mostrarMensagem('Digite um telefone válido', 'error');
        return false;
    }
    
    return true;
}

function preencherDadosUsuario() {
    if (!usuarioLogado) return;
    
    const inputCidade = document.getElementById('cidade-anuncio');
    const inputEstado = document.getElementById('estado-anuncio');
    const inputTelefone = document.getElementById('telefone-anuncio');
    
    if (inputCidade && usuarioLogado.cidade) {
        inputCidade.value = usuarioLogado.cidade;
    }
    
    if (inputEstado && usuarioLogado.estado) {
        inputEstado.value = usuarioLogado.estado;
    }
    
    if (inputTelefone && usuarioLogado.telefone) {
        inputTelefone.value = usuarioLogado.telefone;
        formatarTelefone.call(inputTelefone);
    }
}

// ============================================
// PÁGINA DE DETALHES DO PRODUTO
// ============================================
async function carregarDetalhesProduto() {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');
    
    if (!produtoId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        mostrarLoading(true);
        
        const response = await fetch(`${API_URL}/produtos/${produtoId}`);
        if (!response.ok) throw new Error('Produto não encontrado');
        
        const data = await response.json();
        
        if (data.success) {
            exibirDetalhesProduto(data.produto);
            carregarProdutosRelacionados(data.produto.categoria, produtoId);
        } else {
            mostrarMensagem('Produto não encontrado', 'error');
            setTimeout(() => window.location.href = 'index.html', 2000);
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar produto', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
    } finally {
        mostrarLoading(false);
    }
}

function exibirDetalhesProduto(produto) {
    // Atualizar título da página
    document.title = `${produto.titulo} - BikePirata`;
    
    // Informações básicas
    document.getElementById('produto-titulo').textContent = produto.titulo;
    document.getElementById('produto-preco').textContent = formatarPreco(produto.preco);
    document.getElementById('produto-local').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${produto.cidade} - ${produto.estado}`;
    document.getElementById('produto-descricao').textContent = produto.descricao;
    document.getElementById('produto-visualizacoes').textContent = produto.visualizacoes || 0;
    
    // Categoria e condição
    const categoriaElement = document.getElementById('produto-categoria');
    const condicaoElement = document.getElementById('produto-condicao');
    
    if (categoriaElement) {
        categoriaElement.textContent = formatarCategoria(produto.categoria);
    }
    
    if (condicaoElement) {
        condicaoElement.textContent = formatarCondicao(produto.condicao);
    }
    
    // Detalhes técnicos
    const detalhesLista = document.getElementById('produto-detalhes-lista');
    if (detalhesLista) {
        detalhesLista.innerHTML = '';
        
        const detalhes = [
            { label: 'Marca', value: produto.marca },
            { label: 'Aro', value: produto.aro ? `${produto.aro}"` : 'Não informado' },
            { label: 'Marchas', value: produto.marchas || 'Não informado' },
            { label: 'Suspensão', value: formatarSuspensao(produto.suspensao) },
            { label: 'Condição', value: formatarCondicao(produto.condicao) },
            { label: 'Categoria', value: formatarCategoria(produto.categoria) },
            { label: 'Publicado em', value: new Date(produto.dataPublicacao).toLocaleDateString('pt-BR') }
        ];
        
        detalhes.forEach(detalhe => {
            if (detalhe.value) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${detalhe.label}:</span>
                    <span>${detalhe.value}</span>
                `;
                detalhesLista.appendChild(li);
            }
        });
    }
    
    // Informações do vendedor
    document.getElementById('vendedor-nome').textContent = produto.vendedorNome || 'Anônimo';
    document.getElementById('vendedor-telefone').textContent = produto.telefone || 'Não informado';
    document.getElementById('vendedor-local').textContent = `${produto.cidade} - ${produto.estado}`;
    
    if (produto.dataPublicacao) {
        const data = new Date(produto.dataPublicacao);
        document.getElementById('vendedor-data').textContent = data.getFullYear();
    }
    
    // Botão de contato
    const btnContatar = document.querySelector('.btn-contatar');
    if (btnContatar && produto.telefone) {
        btnContatar.addEventListener('click', function() {
            const mensagem = `Olá, tenho interesse na bike "${produto.titulo}" anunciada no BikePirata.`;
            const url = `https://wa.me/55${produto.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank');
        });
    }
}

function formatarCategoria(categoria) {
    const categorias = {
        'mountain': 'Mountain Bike',
        'speed': 'Speed',
        'urbana': 'Urbana',
        'dobravel': 'Dobrável',
        'eletrica': 'Elétrica',
        'infantil': 'Infantil',
        'bmx': 'BMX',
        'peças': 'Peças e Acessórios'
    };
    
    return categorias[categoria] || categoria;
}

function formatarCondicao(condicao) {
    const condicoes = {
        'novo': 'Novo',
        'semi-novo': 'Semi-novo',
        'usado': 'Usado'
    };
    
    return condicoes[condicao] || condicao;
}

function formatarSuspensao(suspensao) {
    const suspensoes = {
        'rigida': 'Rígida',
        'dianteira': 'Dianteira',
        'full': 'Full Suspension'
    };
    
    return suspensoes[suspensao] || suspensao || 'Não informado';
}

async function carregarProdutosRelacionados(categoria, produtoIdExcluir) {
    try {
        const response = await fetch(`${API_URL}/produtos/buscar?categoria=${categoria}`);
        if (!response.ok) return;
        
        const produtosRelacionados = await response.json();
        
        // Filtrar produto atual
        const filtrados = produtosRelacionados.filter(p => p.id != produtoIdExcluir).slice(0, 4);
        
        exibirProdutosRelacionados(filtrados);
    } catch (error) {
        console.error('Erro ao carregar produtos relacionados:', error);
    }
}

function exibirProdutosRelacionados(produtos) {
    const grid = document.getElementById('grid-relacionados');
    if (!grid) return;
    
    if (produtos.length === 0) {
        grid.innerHTML = '<p class="nenhum-relacionado">Nenhuma bike relacionada encontrada.</p>';
        return;
    }
    
    grid.innerHTML = '';
    
    produtos.forEach(produto => {
        const precoFormatado = formatarPreco(produto.preco);
        
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <div class="produto-imagem">
                <i class="fas fa-bicycle"></i>
            </div>
            <div class="produto-info">
                <h3 class="produto-titulo">${produto.titulo}</h3>
                <p class="produto-preco">${precoFormatado}</p>
                <p class="produto-local">
                    <i class="fas fa-map-marker-alt"></i>
                    ${produto.cidade} - ${produto.estado}
                </p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `produto.html?id=${produto.id}`;
        });
        
        grid.appendChild(card);
    });
}

// ============================================
// PÁGINA MEUS ANÚNCIOS
// ============================================
async function carregarMeusAnuncios() {
    if (!usuarioLogado) return;
    
    try {
        mostrarLoading(true);
        
        const response = await fetch(`${API_URL}/produtos/vendedor/${usuarioLogado.id}`);
        if (!response.ok) throw new Error('Erro ao carregar anúncios');
        
        const anuncios = await response.json();
        
        atualizarEstatisticas(anuncios);
        exibirMeusAnuncios(anuncios);
        
        const nenhumAnuncio = document.getElementById('nenhum-anuncio');
        if (nenhumAnuncio) {
            nenhumAnuncio.style.display = anuncios.length === 0 ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar seus anúncios', 'error');
    } finally {
        mostrarLoading(false);
    }
}

function atualizarEstatisticas(anuncios) {
    const totalAnuncios = document.getElementById('total-anuncios');
    const totalVisualizacoes = document.getElementById('total-visualizacoes');
    const valorTotal = document.getElementById('valor-total');
    
    if (totalAnuncios) {
        totalAnuncios.textContent = anuncios.length;
    }
    
    if (totalVisualizacoes) {
        const visualizacoes = anuncios.reduce((total, anuncio) => total + (anuncio.visualizacoes || 0), 0);
        totalVisualizacoes.textContent = visualizacoes;
    }
    
    if (valorTotal) {
        const valor = anuncios.reduce((total, anuncio) => total + (anuncio.preco || 0), 0);
        valorTotal.textContent = formatarPreco(valor);
    }
}

function exibirMeusAnuncios(anuncios) {
    const grid = document.getElementById('grid-anuncios');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    anuncios.forEach(anuncio => {
        const precoFormatado = formatarPreco(anuncio.preco);
        const dataFormatada = new Date(anuncio.dataPublicacao).toLocaleDateString('pt-BR');
        
        const card = document.createElement('div');
        card.className = 'anuncio-card';
        card.innerHTML = `
            <div class="anuncio-imagem">
                <i class="fas fa-bicycle"></i>
            </div>
            <div class="anuncio-conteudo">
                <h3 class="anuncio-titulo">${anuncio.titulo}</h3>
                <p class="anuncio-preco">${precoFormatado}</p>
                <span class="anuncio-status status-ativo">Ativo</span>
                <p class="anuncio-local">
                    <i class="fas fa-map-marker-alt"></i>
                    ${anuncio.cidade} - ${anuncio.estado}
                </p>
                <p class="anuncio-data">Publicado em ${dataFormatada}</p>
                <div class="anuncio-acoes">
                    <button class="btn-editar" onclick="editarAnuncio(${anuncio.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-excluir" onclick="excluirAnuncio(${anuncio.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function editarAnuncio(id) {
    // Implementar edição de anúncio
    alert('Funcionalidade de edição em desenvolvimento!');
}

async function excluirAnuncio(id) {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensagem('Anúncio excluído com sucesso!', 'success');
            carregarMeusAnuncios();
        } else {
            mostrarMensagem('Erro ao excluir anúncio', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao excluir anúncio', 'error');
    }
}

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================
function mostrarMensagem(texto, tipo = 'info') {
    // Remover mensagens anteriores
    const mensagensAntigas = document.querySelectorAll('.message');
    mensagensAntigas.forEach(msg => msg.remove());
    
    // Criar nova mensagem
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `message ${tipo}`;
    mensagemDiv.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${texto}</span>
    `;
    
    // Encontrar local apropriado para inserir
    const form = document.querySelector('form');
    const container = document.querySelector('.container') || document.querySelector('.auth-container');
    
    if (form) {
        form.parentNode.insertBefore(mensagemDiv, form);
    } else if (container) {
        container.insertBefore(mensagemDiv, container.firstChild);
    } else {
        document.body.insertBefore(mensagemDiv, document.body.firstChild);
    }
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (mensagemDiv.parentNode) {
            mensagemDiv.remove();
        }
    }, 5000);
}

function mostrarLoading(mostrar) {
    // Implementar loading spinner se necessário
    if (mostrar) {
        // Criar overlay de loading
        let loadingDiv = document.getElementById('loading-overlay');
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.id = 'loading-overlay';
            loadingDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;
            loadingDiv.innerHTML = `
                <div style="text-align: center; color: white;">
                    <i class="fas fa-spinner fa-spin fa-3x" style="margin-bottom: 20px; color: #8b0000;"></i>
                    <p>Carregando...</p>
                </div>
            `;
            document.body.appendChild(loadingDiv);
        }
        loadingDiv.style.display = 'flex';
    } else {
        const loadingDiv = document.getElementById('loading-overlay');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }
}

function formatarTelefone() {
    let valor = this.value.replace(/\D/g, '');
    
    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }
    
    if (valor.length > 10) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (valor.length > 0) {
        valor = valor.replace(/^(\d{0,2})$/, '($1');
    }
    
    this.value = valor;
}

// ============================================
// INICIALIZAR FORMATADORES DE TELEFONE
// ============================================
function inicializarFormatadoresTelefone() {
    const inputsTelefone = document.querySelectorAll('input[type="tel"]');
    inputsTelefone.forEach(input => {
        input.addEventListener('input', formatarTelefone);
    });
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarFormatadoresTelefone);
} else {
    inicializarFormatadoresTelefone();
}