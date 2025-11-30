package com.landryjoias.crm.dto; // Note o pacote .dto

import lombok.Data;

@Data
public class LoginDTO {
    private String email;
    private String senha;
}