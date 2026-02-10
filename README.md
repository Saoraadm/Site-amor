# Site Amor

Projeto estático com páginas românticas e um mural público de fotos na página `fotos.html`.

## Mural de fotos com Firebase

A página de fotos usa:
- **Firebase Storage** para armazenar as imagens enviadas.
- **Cloud Firestore** para salvar metadados e links públicos das imagens.

### 1) Criar projeto Firebase
1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Crie um projeto (ou use um existente).
3. No projeto, ative:
   - **Cloud Firestore**
   - **Firebase Storage**
4. Em **Configurações do projeto > Seus apps**, crie um app Web e copie o objeto de configuração.

### 2) Configurar credenciais no frontend
Edite o arquivo `firebase-config.js` e substitua os placeholders:

```js
export const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

### 3) Estrutura usada no Firestore e Storage
- **Coleção Firestore**: `photoWall`
- **Documento**:
  - `imageUrl` (string)
  - `filePath` (string)
  - `fileName` (string)
  - `createdAt` (timestamp)
- **Pasta no Storage**: `photo-wall/`

### 4) Regras de segurança (exemplo para ambiente de testes)
> Ajuste as regras para produção conforme sua necessidade.

#### Firestore (exemplo simples)
```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /photoWall/{docId} {
      allow read, write: if true;
    }
  }
}
```

#### Storage (exemplo simples)
```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photo-wall/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### 5) Executar localmente
Como é um site estático, suba um servidor local na raiz do projeto:

```bash
python3 -m http.server 4173
```

Depois acesse `http://localhost:4173/fotos.html`.
