package com.bikepirata.service;

import com.bikepirata.model.Produto;
import com.bikepirata.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {
    
    @Autowired
    private ProdutoRepository produtoRepository;
    
    public Produto salvarProduto(Produto produto) {
        return produtoRepository.save(produto);
    }
    
    public Optional<Produto> buscarPorId(Long id) {
        Optional<Produto> produto = produtoRepository.findById(id);
        if (produto.isPresent()) {
            Produto p = produto.get();
            p.setVisualizacoes(p.getVisualizacoes() + 1);
            produtoRepository.save(p);
        }
        return produto;
    }
    
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }
    
    public List<Produto> buscarPorCategoria(String categoria) {
        return produtoRepository.findByCategoria(categoria);
    }
    
    public List<Produto> buscarPorLocalidade(String cidade, String estado) {
        return produtoRepository.findByCidadeAndEstado(cidade, estado);
    }
    
    public List<Produto> buscarPorVendedor(Long vendedorId) {
        return produtoRepository.findByVendedorId(vendedorId);
    }
    
    public List<Produto> buscarPorTermo(String termo) {
        return produtoRepository.buscarPorTermo(termo);
    }
    
    public List<Produto> buscarPorFaixaPreco(Double min, Double max) {
        return produtoRepository.buscarPorFaixaPreco(min, max);
    }
    
    public void deletarProduto(Long id) {
        produtoRepository.deleteById(id);
    }
}
