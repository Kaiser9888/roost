package com.bikepirata.controller;

import com.bikepirata.model.Produto;
import com.bikepirata.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {
    
    @Autowired
    private ProdutoService produtoService;
    
    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        return produtoService.buscarPorId(id)
            .map(produto -> {
                response.put("success", true);
                response.put("produto", produto);
                return ResponseEntity.ok(response);
            })
            .orElseGet(() -> {
                response.put("success", false);
                response.put("message", "Produto não encontrado");
                return ResponseEntity.badRequest().body(response);
            });
    }
    
    @PostMapping
    public ResponseEntity<?> criarProduto(@RequestBody Produto produto) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Produto produtoSalvo = produtoService.salvarProduto(produto);
            response.put("success", true);
            response.put("message", "Produto publicado com sucesso");
            response.put("produto", produtoSalvo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro ao publicar produto");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<List<Produto>> buscar(@RequestParam(required = false) String termo,
                                                @RequestParam(required = false) String categoria,
                                                @RequestParam(required = false) String cidade,
                                                @RequestParam(required = false) String estado,
                                                @RequestParam(required = false) Double minPreco,
                                                @RequestParam(required = false) Double maxPreco) {
        
        if (termo != null && !termo.isEmpty()) {
            return ResponseEntity.ok(produtoService.buscarPorTermo(termo));
        }
        
        if (categoria != null && !categoria.isEmpty()) {
            return ResponseEntity.ok(produtoService.buscarPorCategoria(categoria));
        }
        
        if (cidade != null && estado != null) {
            return ResponseEntity.ok(produtoService.buscarPorLocalidade(cidade, estado));
        }
        
        if (minPreco != null && maxPreco != null) {
            return ResponseEntity.ok(produtoService.buscarPorFaixaPreco(minPreco, maxPreco));
        }
        
        return ResponseEntity.ok(produtoService.listarTodos());
    }
    
    @GetMapping("/vendedor/{vendedorId}")
    public ResponseEntity<List<Produto>> buscarPorVendedor(@PathVariable Long vendedorId) {
        return ResponseEntity.ok(produtoService.buscarPorVendedor(vendedorId));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarProduto(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            produtoService.deletarProduto(id);
            response.put("success", true);
            response.put("message", "Produto deletado com sucesso");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro ao deletar produto");
            return ResponseEntity.badRequest().body(response);
        }
    }
}