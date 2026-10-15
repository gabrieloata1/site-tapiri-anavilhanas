# Tapiri Anavilhanas Lodge — Site Oficial & Reservas

Site oficial e plataforma de reservas da pousada de selva **Tapiri Anavilhanas Lodge**, localizada no Arquipélago das Anavilhanas, Novo Airão - Amazonas.

---

## 🌿 Sobre o Projeto

Plataforma completa de experiência do hóspede e contratação de pacotes ecoturísticos na Amazônia, com suporte multilíngue (Português, Inglês, Espanhol, Francês, Alemão e Italiano), galeria de fotos e checkout transparente integrado ao **Stripe**.

* **Cliente:** Wendel Aires (Pousada Tapiri Anavilhanas Lodge)
* **Domínio de Produção:** [tapiryanavilhanaslodge.com.br](https://www.tapiryanavilhanaslodge.com.br)
* **Localização:** Novo Airão — AM, Arquipélago de Anavilhanas (Rio Negro)

---

## 🚀 Estrutura do Site

1. **Home / Hero:** Apresentação da pousada de selva com fotos em alta resolução e chamada para os pacotes.
2. **Pacotes Ecoturísticos:**
   * **Adventure (Aventura):** Passeios na selva, focagem noturna e sobrevivência.
   * **Complete (Completo):** Experiência imersiva pela fauna e flora amazônica.
   * **Essence (Essência):** Vivência cultural indígena, botos-cor-de-rosa e trilhas.
3. **Página de Detalhes do Pacote (`/pacote/:id`):**
   * Itinerários dia a dia detalhados.
   * Seletor de hóspedes (adultos e crianças) e calendário de datas.
   * Cálculo automatizado de tarifas sazonais, adicionais de ocupação e taxas.
4. **Checkout Stripe:**
   * Redirecionamento seguro para o Stripe Checkout (Cartão de Crédito e Boleto).
   * Validação e recálculo obrigatório de preços no servidor via Edge Functions (prevenindo adulteração de valores).
5. **Confirmação de Reserva (`/booking-success`):**
   * Captura automática da sessão e registro de reserva no banco.
   * Disparo das tags de conversão do Google Ads.
6. **Painel Administrativo (`/admin/login` e `/admin`):**
   * Gerenciamento de conteúdo, fotos da galeria, pacotes e reservas.

---

## 🛠️ Tecnologias e Infraestrutura

* **Frontend:** React SPA compilado e otimizado com Tailwind CSS e Radix UI.
* **Backend:** [Supabase](https://supabase.com) (PostgreSQL, Storage CDN e Row Level Security).
  * Região: `sa-east-1` (São Paulo, Brasil) para baixa latência.
  * Autenticação protegida via RPC `is_admin()`.
* **Pagamentos:** [Stripe](https://stripe.com) integrado via Edge Functions com verificação de assinatura HMAC em Webhooks.

---

## 🌐 Publicação no Netlify

O repositório já está 100% pré-configurado para publicação direta no **Netlify**:

1. Acesse o painel do [Netlify](https://app.netlify.com/) e clique em **"Add new site" → "Import an existing project"**.
2. Conecte sua conta do GitHub e selecione o repositório `site-tapiri-anavilhanas`.
3. As configurações de build serão preenchidas automaticamente pelo [`netlify.toml`](./netlify.toml):
   * **Build command:** *(vazio)*
   * **Publish directory:** `.`
4. O arquivo [`_redirects`](./_redirects) e o [`netlify.toml`](./netlify.toml) já contêm a regra SPA (`/* /index.html 200`), garantindo que o recarregamento de páginas internas (como `/admin/login`, `/pacote/essence` e `/booking-success`) funcione perfeitamente sem erros 404.
5. Clique em **"Deploy site"**.
