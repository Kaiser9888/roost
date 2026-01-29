package com.bikepirata.controller;

import com.bikepirata.model.Usuario;
import com.bikepirata.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        Map<String, Object> response = new HashMap<>();
        
        if (usuarioService.emailExiste(usuario.getEmail())) {
            response.put("success", false);
            response.put("message", "Email já cadastrado");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            Usuario usuarioSalvo = usuarioService.salvarUsuario(usuario);
            response.put("success", true);
            response.put("message", "Usuário registrado com sucesso");
            response.put("usuario", usuarioSalvo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro ao registrar usuário");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        Map<String, Object> response = new HashMap<>();
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");
        
        if (usuarioService.validarLogin(email, senha)) {
            Usuario usuario = usuarioService.buscarPorEmail(email).orElse(null);
            response.put("success", true);
            response.put("message", "Login realizado com sucesso");
            response.put("usuario", usuario);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Email ou senha incorretos");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
