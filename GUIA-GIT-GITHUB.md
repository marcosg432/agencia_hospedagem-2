# Guia: Configurar Git e Fazer Push para GitHub

## ✅ Arquivos Limpos
Todos os arquivos .md e .txt desnecessários foram excluídos. Mantido apenas o README.md.

## 📋 Passos para Configurar Git e Fazer Push

### 1. Abra o PowerShell no diretório do projeto
```powershell
cd "C:\Users\andre\OneDrive\Área de Trabalho\agencia-1"
```

### 2. Configure o Git (se ainda não configurou globalmente)
```powershell
git config --global user.name "marcosg432"
git config --global user.email "mg9149303@gmail.com"
```

### 3. Inicialize o repositório Git
```powershell
# Remover .git se existir
if (Test-Path .git) { Remove-Item -Recurse -Force .git }

# Inicializar
git init
```

### 4. Adicione todos os arquivos
```powershell
git add .
```

### 5. Faça o commit inicial
```powershell
git commit -m "Initial commit: Sistema de Gerenciamento de Hospedagem"
```

### 6. Configure o remote do GitHub
```powershell
git remote add origin https://github.com/marcosg432/agencia_hospedagem.git
```

### 7. Renomeie a branch para main
```powershell
git branch -M main
```

### 8. Crie o repositório no GitHub
1. Acesse: https://github.com/new
2. Nome do repositório: `agencia_hospedagem`
3. Escolha: Público ou Privado
4. **NÃO marque** "Add a README file", "Add .gitignore" ou "Choose a license"
5. Clique em "Create repository"

### 9. Faça o push
```powershell
git push -u origin main
```

### 10. Autenticação
Quando solicitado:
- **Username:** `marcosg432`
- **Password:** Use um **Personal Access Token (PAT)**

#### Como criar um PAT:
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Dê um nome (ex: "agencia-hospedagem")
4. Selecione o escopo: **`repo`** (todas as permissões)
5. Clique em "Generate token"
6. **COPIE O TOKEN** (você não verá novamente!)
7. Use esse token como senha no push

## ✅ Verificação
Após o push, acesse:
https://github.com/marcosg432/agencia_hospedagem

Você deve ver todos os arquivos do projeto!

