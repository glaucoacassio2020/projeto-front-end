// ===================== SISTEMA INTEGRADO DE FAVORITOS + CARRINHO =====================

// Inicializar carrinho do localStorage
let carrinhoData = JSON.parse(localStorage.getItem('carrinho')) || {};

// Atualizar UI ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  restaurarEstadoBotoes();
  atualizarContador();
  console.log('✅ Favoritos + Carrinho carregado');
  console.log('Heart buttons encontrados:', document.querySelectorAll('.heart-btn').length);
});

// ===================== GERENCIAR CLIQUES =====================

document.addEventListener('click', (e) => {
  const coracao = e.target.closest('.heart-btn, .product-heart-btn');
  const botaoCarrinho = e.target.closest('.add-to-cart, .men-cart-btn, .product-cart-btn, .kids-cart-btn, .sport-cart-btn, .shoe-cart-btn');
  
  if (coracao) {
    handleCoracaoClick(coracao);
  } else if (botaoCarrinho) {
    handleCarrinhoClick(botaoCarrinho, e);
  }
});

// ===================== LÓGICA DO CORAÇÃO =====================

function handleCoracaoClick(btn) {
  const productId = btn.dataset.productId;
  const productCard = btn.closest('.product-card, .men-item, .product-item, article');
  const productName = productCard.querySelector('h3, .men-title, .product-title')?.textContent || `Produto ${productId}`;

  if (btn.classList.contains('liked')) {
    btn.classList.remove('liked');
    delete carrinhoData[productId];
  } else {
    btn.classList.add('liked');
    const productPrice = productCard.querySelector('.current, .men-price, .product-price')?.textContent || 'R$ 0,00';
    const productImage = productCard.querySelector('img')?.src || '';
    
    carrinhoData[productId] = {
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantidade: 1,
      addedAt: new Date().toISOString()
    };
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinhoData));
  atualizarContador();
  atualizarBotaoCarrinho(btn.dataset.productId);
  
  btn.style.animation = 'none';
  setTimeout(() => {
    btn.style.animation = 'pulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }, 10);
}

// ===================== LÓGICA DO CARRINHO =====================

function handleCarrinhoClick(btn, e) {
  e.preventDefault();
  
  const productCard = btn.closest('.product-card, .men-item, .product-item, article');
  const coracao = productCard?.querySelector('.heart-btn, .product-heart-btn');
  let productId = btn.dataset.productId || coracao?.dataset.productId;
  
  if (!productId) {
    productId = `produto-${Date.now()}`;
  }

  const productName = productCard.querySelector('h3, .men-title, .product-title')?.textContent || `Produto ${productId}`;
  const productPrice = productCard.querySelector('.current, .men-price, .product-price')?.textContent || 'R$ 0,00';
  const productImage = productCard.querySelector('img')?.src || '';

  if (!carrinhoData[productId]) {
    carrinhoData[productId] = {
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantidade: 1,
      addedAt: new Date().toISOString()
    };
  } else {
    carrinhoData[productId].quantidade++;
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinhoData));
  atualizarContador();
  
  if (coracao) {
    coracao.classList.add('liked');
  }
  
  btn.style.animation = 'none';
  setTimeout(() => {
    btn.style.animation = 'pulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }, 10);

  const textoOriginal = btn.textContent;
  btn.textContent = '✓ Adicionado';
  setTimeout(() => {
    btn.textContent = textoOriginal;
  }, 1500);
}

// ===================== ATUALIZAR VISUAL =====================

function atualizarBotaoCarrinho(productId) {
  const botoes = document.querySelectorAll(`.add-to-cart[data-product-id="${productId}"], .men-cart-btn, .product-cart-btn`);
  botoes.forEach(botao => {
    if (carrinhoData[productId]) {
      botao.classList.add('liked');
    } else {
      botao.classList.remove('liked');
    }
  });
}

// ===================== CONTADOR UNIFICADO =====================

function atualizarContador() {
  const total = Object.keys(carrinhoData).length;
  const cartBtn = document.querySelector('.cart-btn');
  
  if (cartBtn) {
    let counter = cartBtn.querySelector('.cart-badge');
    
    if (!counter) {
      counter = document.createElement('span');
      counter.className = 'cart-badge';
      cartBtn.appendChild(counter);
    }
    
    if (total > 0) {
      counter.textContent = total;
      counter.style.display = 'flex';
    } else {
      counter.style.display = 'none';
    }
  }
}

// ===================== RESTAURAR ESTADO =====================

function restaurarEstadoBotoes() {
  document.querySelectorAll('.heart-btn, .product-heart-btn').forEach(btn => {
    const productId = btn.dataset.productId;
    
    if (productId && carrinhoData[productId]) {
      btn.classList.add('liked');
    } else {
      btn.classList.remove('liked');
    }
  });

  document.querySelectorAll('.add-to-cart, .men-cart-btn, .product-cart-btn').forEach(btn => {
    const productCard = btn.closest('.product-card, .men-item, .product-item, article');
    const coracao = productCard?.querySelector('.heart-btn, .product-heart-btn');
    const productId = coracao?.dataset.productId || btn.dataset.productId;
    
    if (productId && carrinhoData[productId]) {
      btn.classList.add('liked');
    } else {
      btn.classList.remove('liked');
    }
  });
}

// ===================== ESTILOS CSS UNIFICADOS =====================

const style = document.createElement('style');
style.innerHTML = `
  @keyframes pulse {
    0% { transform: scale(1); }
    25% { transform: scale(1.2); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }

  .cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff6b6b;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  }

  .cart-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* ===== POSITION RELATIVE - IMPORTANTE ===== */
  .product-image,
  .product-img-wrapper,
  .men-img-wrapper,
  .product-actions {
    position: relative !important;
  }

  /* ===== HEART BUTTON - PADRÃO ===== */
  .heart-btn,
  .product-heart-btn {
    position: absolute !important;
    top: 15px !important;
    right: 15px !important;
    background: transparent !important;
    border: none !important;
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    z-index: 999 !important;
    padding: 0 !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  /* ===== OUTLET - ESQUERDO ===== */
  .product-image .heart-btn {
    left: 15px !important;
    right: auto !important;
  }

  /* ===== HOVER ===== */
  .heart-btn:hover,
  .product-heart-btn:hover {
    transform: scale(1.2) !important;
  }

  /* ===== SVG ===== */
  .heart-btn svg,
  .product-heart-btn svg {
    width: 24px !important;
    height: 24px !important;
    stroke: #2c2c2c !important;
    fill: none !important;
    transition: all 0.3s ease !important;
  }

  /* ===== LIKED ===== */
  .heart-btn.liked svg,
  .product-heart-btn.liked svg {
    fill: #ff6b6b !important;
    stroke: #ff6b6b !important;
  }
`;
document.head.appendChild(style);

console.log('✅ Sistema Integrado carregado com sucesso');