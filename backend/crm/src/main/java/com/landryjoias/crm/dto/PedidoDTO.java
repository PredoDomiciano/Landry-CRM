package com.landryjoias.crm.dto;

import com.landryjoias.crm.entity.StatusPedido;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class PedidoDTO {
    private LocalDate data;
    private Double valorTotal; // Double para aceitar centavos
    private StatusPedido status;
    private Integer idOportunidade; // Recebe apenas o ID
    private List<ItemPedidoDTO> itens; // Lista de itens simples

    @Data
    public static class ItemPedidoDTO {
        private Integer idProduto; // Recebe apenas o ID do produto
        private Integer quantidade;
        private Double valor;
        private String tamanho;
        private String pedra;
    }
}