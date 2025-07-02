# ☕ Café Nepré — Painel de Envios

Painel interno para gestão dos envios de café do Café Nepré.  
Permite visualizar para onde o café foi enviado, controlar dados detalhados e acompanhar gráficos e estatísticas.

---

## 🚀 Funcionalidades principais

- ✅ Cadastro de envios por CEP.
- ✅ Registro da **quantidade (kg)** enviada.
- ✅ Registro da **data do envio** manual.
- ✅ Visualização em mapa interativo com estados destacados.
- ✅ Lista filtrável por estado e por data.
- ✅ Exportação dos envios em CSV.
- ✅ Dashboard com:
  - Total de pedidos e kg enviados.
  - Gráfico de pizza com pedidos por estado.
  - Gráfico de pizza com kg por estado.
  - Detalhamento de kg por estado.

---

## 💻 Tecnologias

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/) (Firestore e Auth)
- [Recharts](https://recharts.org/) (gráficos)

---

## ⚙️ Instalação local

1️⃣ Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPO.git
cd SEU_REPO
2️⃣ Instale as dependências:

bash
Copiar
Editar
npm install
3️⃣ Configure o Firebase:

Crie um projeto no Firebase.

Copie as credenciais para o arquivo lib/firebase.ts.

ts
Copiar
Editar
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
};
4️⃣ Rode o projeto:

bash
Copiar
Editar
npm run dev
🌍 Acessar
Painel principal: http://localhost:3000

Dashboard: http://localhost:3000/dashboard

✅ Funcionalidades futuras
Confirmação antes de excluir envio.

Edição de envios cadastrados.

Exportação em PDF.

Gráfico de evolução mensal.

Loader animado durante carregamento.

🤝 Contribuição
Pull requests são bem-vindos! 💚

🧑‍💻 Autor
Seu Nome

☕ Licença
Este projeto está licenciado sob a MIT License.

yaml
Copiar
Editar

---

# ✅ **O que fazer agora**

1️⃣ Crie um arquivo no seu projeto:

README.md

sql
Copiar
Editar

2️⃣ Cola **todo o conteúdo acima**.  
3️⃣ Salva.  
4️⃣ Faz commit e push:

```bash
git add README.md
git commit -m "docs: adiciona README completo"
git push