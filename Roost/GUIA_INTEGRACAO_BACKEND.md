# 🔌 Guia de Integração com Backend - Sistema de Personalização

## Endpoints API Necessários

### 1. **POST** `/api/pedidos`
Cria um novo pedido com bikes personalizadas

**Request:**
```json
{
  "usuarioId": 1,
  "itens": [
    {
      "bikePersonalizadaId": 1705161234567,
      "componentes": {
        "quadro": {
          "id": 1,
          "vendedor": "Vendedor A",
          "modelo": "Quadro MTB Alumínio 21\"",
          "preco": 450.00,
          "vendedorId": 1
        },
        "rodas": {...},
        "freios": {...},
        "corrente": {...},
        "guidao": {...},
        "banco": {...},
        "acessorios": [...]
      },
      "quantidade": 1,
      "precoTotal": 2380.00
    }
  ],
  "subtotal": 2380.00,
  "frete": 0,
  "desconto": 50,
  "total": 2330.00,
  "dataPedido": "2024-01-14T10:30:00Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "pedidoId": 12345,
  "mensagem": "Pedido criado com sucesso",
  "statusPedido": "pendente_pagamento",
  "dataEstimada": "2024-01-20"
}
```

---

### 2. **GET** `/api/produtos`
Já existe - retorna lista de produtos

---

### 3. **GET** `/api/produtos/buscar`
Já existe - busca com filtros

---

### 4. **GET** `/api/usuarios/{id}`
Para validar usuário (pode usar existente)

---

## Modelos de Dados - Java

### **ProdutoPersonalizado.java**
```java
package com.bikepirata.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "produtos_personalizados")
public class ProdutoPersonalizado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "quadro_id")
    private Produto quadro;
    
    @ManyToOne
    @JoinColumn(name = "rodas_id")
    private Produto rodas;
    
    @ManyToOne
    @JoinColumn(name = "freios_id")
    private Produto freios;
    
    @ManyToOne
    @JoinColumn(name = "corrente_id")
    private Produto corrente;
    
    @ManyToOne
    @JoinColumn(name = "guidao_id")
    private Produto guidao;
    
    @ManyToOne
    @JoinColumn(name = "banco_id")
    private Produto banco;
    
    @ManyToMany
    @JoinTable(
        name = "personalizado_acessorios",
        joinColumns = @JoinColumn(name = "personalizado_id"),
        inverseJoinColumns = @JoinColumn(name = "acessorio_id")
    )
    private List<Produto> acessorios;
    
    @Column(name = "preco_total")
    private BigDecimal precoTotal;
    
    @Column(name = "data_personalizacao")
    private LocalDateTime dataPersonalizacao;
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    // ... outros getters/setters
    
    public void calcularPrecoTotal() {
        precoTotal = BigDecimal.ZERO;
        
        if (quadro != null) precoTotal = precoTotal.add(new BigDecimal(quadro.getPreco()));
        if (rodas != null) precoTotal = precoTotal.add(new BigDecimal(rodas.getPreco()));
        if (freios != null) precoTotal = precoTotal.add(new BigDecimal(freios.getPreco()));
        if (corrente != null) precoTotal = precoTotal.add(new BigDecimal(corrente.getPreco()));
        if (guidao != null) precoTotal = precoTotal.add(new BigDecimal(guidao.getPreco()));
        if (banco != null) precoTotal = precoTotal.add(new BigDecimal(banco.getPreco()));
        
        if (acessorios != null) {
            for (Produto acessorio : acessorios) {
                precoTotal = precoTotal.add(new BigDecimal(acessorio.getPreco()));
            }
        }
    }
}
```

---

### **Pedido.java** (modificado)
```java
package com.bikepirata.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> itens;
    
    @Column(name = "subtotal")
    private BigDecimal subtotal;
    
    @Column(name = "frete")
    private BigDecimal frete;
    
    @Column(name = "desconto")
    private BigDecimal desconto;
    
    @Column(name = "total")
    private BigDecimal total;
    
    @Column(name = "status")
    private String status; // pendente_pagamento, pago, enviado, entregue
    
    @Column(name = "data_pedido")
    private LocalDateTime dataPedido;
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;
    
    // ... getters e setters
}
```

---

### **ItemPedido.java** (novo)
```java
package com.bikepirata.model;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "itens_pedido")
public class ItemPedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;
    
    @ManyToOne
    @JoinColumn(name = "personalizado_id")
    private ProdutoPersonalizado produtoPersonalizado;
    
    @Column(name = "quantidade")
    private Integer quantidade;
    
    @Column(name = "preco_unitario")
    private BigDecimal precoUnitario;
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
    
    // ... outros getters/setters
}
```

---

## Controllers Necessários

### **PedidoController.java**
```java
package com.bikepirata.controller;

import com.bikepirata.model.*;
import com.bikepirata.repository.*;
import com.bikepirata.dto.PedidoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ProdutoPersonalizadoRepository produtoPersonalizadoRepository;
    
    @PostMapping
    public ResponseEntity<?> criarPedido(@RequestBody PedidoDTO pedidoDTO) {
        try {
            // Validar usuário
            Usuario usuario = usuarioRepository.findById(pedidoDTO.getUsuarioId())
                .orElseThrow(() -> new Exception("Usuário não encontrado"));
            
            // Criar pedido
            Pedido pedido = new Pedido();
            pedido.setUsuario(usuario);
            pedido.setSubtotal(pedidoDTO.getSubtotal());
            pedido.setFrete(pedidoDTO.getFrete());
            pedido.setDesconto(pedidoDTO.getDesconto());
            pedido.setTotal(pedidoDTO.getTotal());
            pedido.setStatus("pendente_pagamento");
            pedido.setDataPedido(LocalDateTime.now());
            pedido.setDataCriacao(LocalDateTime.now());
            
            Pedido pedidoSalvo = pedidoRepository.save(pedido);
            
            // Salvar itens
            List<ItemPedido> itens = new ArrayList<>();
            for (PedidoDTO.ItemDTO itemDTO : pedidoDTO.getItens()) {
                ItemPedido item = new ItemPedido();
                item.setPedido(pedidoSalvo);
                item.setQuantidade(itemDTO.getQuantidade());
                item.setPrecoUnitario(itemDTO.getPrecoTotal());
                itens.add(item);
            }
            pedidoSalvo.setItens(itens);
            pedidoRepository.save(pedidoSalvo);
            
            // Resposta
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("pedidoId", pedidoSalvo.getId());
            response.put("mensagem", "Pedido criado com sucesso");
            response.put("statusPedido", "pendente_pagamento");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("erro", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obterPedido(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        return pedido.isPresent() 
            ? ResponseEntity.ok(pedido.get())
            : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> obterPedidosPorUsuario(@PathVariable Long usuarioId) {
        List<Pedido> pedidos = pedidoRepository.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(pedidos);
    }
}
```

---

### **ProdutoPersonalizadoController.java**
```java
package com.bikepirata.controller;

import com.bikepirata.model.*;
import com.bikepirata.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/produtos-personalizados")
@CrossOrigin(origins = "*")
public class ProdutoPersonalizadoController {
    
    @Autowired
    private ProdutoPersonalizadoRepository produtoPersonalizadoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ProdutoRepository produtoRepository;
    
    @PostMapping
    public ResponseEntity<?> criarProdutoPersonalizado(@RequestBody Map<String, Object> data) {
        try {
            Long usuarioId = Long.parseLong(data.get("usuarioId").toString());
            Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new Exception("Usuário não encontrado"));
            
            ProdutoPersonalizado produto = new ProdutoPersonalizado();
            produto.setUsuario(usuario);
            
            // Buscar componentes (IDs fornecidos no request)
            if (data.containsKey("quadroId")) {
                Long quadroId = Long.parseLong(data.get("quadroId").toString());
                Produto quadro = produtoRepository.findById(quadroId).orElse(null);
                produto.setQuadro(quadro);
            }
            
            // ... setear outros componentes
            
            produto.setDataPersonalizacao(LocalDateTime.now());
            produto.setDataCriacao(LocalDateTime.now());
            produto.calcularPrecoTotal();
            
            ProdutoPersonalizado salvo = produtoPersonalizadoRepository.save(produto);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }
}
```

---

## Repositories

### **PedidoRepository.java**
```java
package com.bikepirata.repository;

import com.bikepirata.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId);
    List<Pedido> findByStatus(String status);
}
```

### **ProdutoPersonalizadoRepository.java**
```java
package com.bikepirata.repository;

import com.bikepirata.model.ProdutoPersonalizado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProdutoPersonalizadoRepository extends JpaRepository<ProdutoPersonalizado, Long> {
    List<ProdutoPersonalizado> findByUsuarioId(Long usuarioId);
}
```

### **ItemPedidoRepository.java**
```java
package com.bikepirata.repository;

import com.bikepirata.model.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
    List<ItemPedido> findByPedidoId(Long pedidoId);
}
```

---

## DTOs

### **PedidoDTO.java**
```java
package com.bikepirata.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoDTO {
    private Long usuarioId;
    private List<ItemDTO> itens;
    private BigDecimal subtotal;
    private BigDecimal frete;
    private BigDecimal desconto;
    private BigDecimal total;
    private LocalDateTime dataPedido;
    
    public static class ItemDTO {
        private Long bikePersonalizadaId;
        private Integer quantidade;
        private BigDecimal precoTotal;
        private Object componentes;
        
        // Getters e Setters
        public Long getBikePersonalizadaId() { return bikePersonalizadaId; }
        public void setBikePersonalizadaId(Long id) { this.bikePersonalizadaId = id; }
        
        public Integer getQuantidade() { return quantidade; }
        public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
        
        public BigDecimal getPrecoTotal() { return precoTotal; }
        public void setPrecoTotal(BigDecimal precoTotal) { this.precoTotal = precoTotal; }
    }
    
    // Getters e Setters
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long id) { this.usuarioId = id; }
    
    public List<ItemDTO> getItens() { return itens; }
    public void setItens(List<ItemDTO> itens) { this.itens = itens; }
    
    // ... outros getters/setters
}
```

---

## Migrations - SQL

### **criar_pedidos_personalizados.sql**
```sql
-- Tabela de Produtos Personalizados
CREATE TABLE IF NOT EXISTS produtos_personalizados (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL,
    quadro_id BIGINT,
    rodas_id BIGINT,
    freios_id BIGINT,
    corrente_id BIGINT,
    guidao_id BIGINT,
    banco_id BIGINT,
    preco_total DECIMAL(10, 2),
    data_personalizacao DATETIME,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (quadro_id) REFERENCES produtos(id),
    FOREIGN KEY (rodas_id) REFERENCES produtos(id),
    FOREIGN KEY (freios_id) REFERENCES produtos(id),
    FOREIGN KEY (corrente_id) REFERENCES produtos(id),
    FOREIGN KEY (guidao_id) REFERENCES produtos(id),
    FOREIGN KEY (banco_id) REFERENCES produtos(id)
);

-- Tabela de Associação Acessórios
CREATE TABLE IF NOT EXISTS personalizado_acessorios (
    personalizado_id BIGINT NOT NULL,
    acessorio_id BIGINT NOT NULL,
    PRIMARY KEY (personalizado_id, acessorio_id),
    FOREIGN KEY (personalizado_id) REFERENCES produtos_personalizados(id),
    FOREIGN KEY (acessorio_id) REFERENCES produtos(id)
);

-- Modificar tabela de pedidos
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS frete DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS desconto DECIMAL(10, 2);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pedido_id BIGINT NOT NULL,
    personalizado_id BIGINT NOT NULL,
    quantidade INT DEFAULT 1,
    preco_unitario DECIMAL(10, 2),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (personalizado_id) REFERENCES produtos_personalizados(id)
);

-- Índices para performance
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_itens_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_personalizado_usuario ON produtos_personalizados(usuario_id);
```

---

## Testando os Endpoints

### **Usando curl:**

```bash
# Criar pedido
curl -X POST http://localhost:8080/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": 1,
    "itens": [...],
    "subtotal": 2380.00,
    "frete": 0,
    "desconto": 50,
    "total": 2330.00,
    "dataPedido": "2024-01-14T10:30:00Z"
  }'

# Obter pedido
curl http://localhost:8080/api/pedidos/1

# Obter pedidos do usuário
curl http://localhost:8080/api/pedidos/usuario/1
```

---

## Checklist de Implementação

- [ ] Criar models (ProdutoPersonalizado, ItemPedido)
- [ ] Criar repositories
- [ ] Criar DTOs
- [ ] Criar controllers
- [ ] Atualizar pom.xml com dependências
- [ ] Executar migrations SQL
- [ ] Testar endpoints
- [ ] Integrar com frontend (atualizar `API_URL` em carrinho.js)
- [ ] Testar fluxo completo
- [ ] Documentar API
- [ ] Deploy em produção

---

*Guia de Integração - Versão 1.0*
