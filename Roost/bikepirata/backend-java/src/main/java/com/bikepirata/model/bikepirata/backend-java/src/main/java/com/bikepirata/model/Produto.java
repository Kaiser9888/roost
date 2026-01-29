package com.bikepirata.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "produtos")
public class Produto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Título é obrigatório")
    private String titulo;
    
    @NotBlank(message = "Descrição é obrigatória")
    @Column(length = 2000)
    private String descricao;
    
    @NotNull(message = "Preço é obrigatório")
    private Double preco;
    
    private String categoria; // mountain, speed, urbana, dobravel, eletrica, infantil, bmx
    private String condicao; // novo, semi-novo, usado
    private String marca;
    private Integer aro;
    private Integer marchas;
    private String suspensao; // dianteira, full, rigida
    private String cidade;
    private String estado;
    
    @Column(name = "vendedor_id")
    private Long vendedorId;
    
    @Column(name = "vendedor_nome")
    private String vendedorNome;
    
    private String telefone;
    
    @Column(name = "data_publicacao")
    private LocalDateTime dataPublicacao;
    
    private Integer visualizacoes = 0;
    
    @Column(name = "imagens")
    private String imagens; // URLs separadas por vírgula
    
    @PrePersist
    protected void onCreate() {
        dataPublicacao = LocalDateTime.now();
        visualizacoes = 0;
    }
}
