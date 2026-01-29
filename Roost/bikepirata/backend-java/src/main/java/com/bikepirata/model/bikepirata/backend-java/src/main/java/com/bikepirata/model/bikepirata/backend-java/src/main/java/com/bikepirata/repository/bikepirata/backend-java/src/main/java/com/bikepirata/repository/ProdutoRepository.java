package com.bikepirata.repository;

import com.bikepirata.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByCategoria(String categoria);
    List<Produto> findByCidadeAndEstado(String cidade, String estado);
    List<Produto> findByVendedorId(Long vendedorId);
    
    @Query("SELECT p FROM Produto p WHERE " +
           "LOWER(p.titulo) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(p.descricao) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(p.marca) LIKE LOWER(CONCAT('%', :termo, '%'))")
    List<Produto> buscarPorTermo(@Param("termo") String termo);
    
    @Query("SELECT p FROM Produto p WHERE p.preco BETWEEN :minPreco AND :maxPreco")
    List<Produto> buscarPorFaixaPreco(@Param("minPreco") Double minPreco, 
                                      @Param("maxPreco") Double maxPreco);
}
