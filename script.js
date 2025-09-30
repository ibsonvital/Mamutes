// ==========================================================
// 1. DADOS DA LOJA
// ==========================================================

// **MUDE ESTES VALORES:**
const DELIVERY_FEE = 10.00; // Taxa de entrega. Use 0.00 se for só retirada.
const WHATSAPP_NUMBER = "5521990900316"; // Telefone da Atlética para receber pedidos.
// **FIM DA MUDANÇA**

// Lista de Produtos da Atlética Mamutes
const PRODUTOS_ATLETICA = [
    {
        id: 1,
        item: "Camisa Oficial (Diversos Tamanhos)",
        price: 80.00,
        description: "Camisa Dryfit em Vinho e Azul.",
        img: "images/produtos/camisa_oficial.jpg"
    },
    {
        id: 2,
        item: "Boné Trucker Preto",
        price: 45.00,
        description: "Boné Trucker de tela com logo bordado.",
        img: "images/produtos/bone_preto.jpg"
    },
    {
        id: 3,
        item: "Caneca Alumínio 500ml",
        price: 30.00,
        description: "Caneca azul ou vinho, ideal para eventos.",
        img: "images/produtos/caneca_mamutes.jpg"
    }
    // Adicione mais produtos aqui
];

// ==========================================================
// 2. LÓGICA DO CARRINHO
// ==========================================================

let cart = []; 

// Função para gerar os cards de produtos no HTML
function gerarProdutos() {
    const lista = document.getElementById('produtos-lista');
    if (!lista) return;

    PRODUTOS_ATLETICA.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <img src="${prod.img || 'images/produtos/default.jpg'}" alt="${prod.item}">
            <h3>${prod.item}</h3>
            <p>${prod.description}</p>
            <p class="preco">R$ ${prod.price.toFixed(2)}</p>
            <button class="btn-adicionar" onclick="adicionarAoCarrinho(${prod.id})">
                Adicionar ao Pedido
            </button>
        `;
        lista.appendChild(card);
    });
}


// Função para adicionar um produto ao carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = PRODUTOS_ATLETICA.find(p => p.id === produtoId);
    if (!produto) return;

    const existingProduct = cart.find(p => p.id === produtoId);
    
    if (existingProduct) {
        existingProduct.qty += 1;
    } else {
        cart.push({ ...produto, qty: 1 });
    }
    
    atualizarCarrinhoVisual();
}

// Função para esvaziar o carrinho
function esvaziarCarrinho() {
    cart = [];
    atualizarCarrinhoVisual();
}


// Função principal para atualizar a visualização do carrinho e totais
function atualizarCarrinhoVisual() {
    const cartList = document.getElementById('cart-list');
    const totalCarrinhoElement = document.getElementById('total-carrinho');
    const subtotalCarrinhoElement = document.getElementById('subtotal-carrinho');
    const taxaEntregaElement = document.getElementById('taxa-entrega');
    const carrinhoLink = document.getElementById('carrinho-link');

    cartList.innerHTML = '';
    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="carrinho-vazio">Seu carrinho está vazio.</li>';
        taxaEntregaElement.textContent = `R$ ${DELIVERY_FEE.toFixed(2)}`;
    } else {
        cart.forEach(prod => {
            const itemTotal = prod.price * prod.qty;
            subtotal += itemTotal;
            totalItems += prod.qty;
            
            const li = document.createElement('li');
            li.innerHTML = `
                ${prod.item} 
                <span class="qty">x${prod.qty}</span> 
                (R$ ${itemTotal.toFixed(2)})
            `;
            cartList.appendChild(li);
        });
        taxaEntregaElement.textContent = `R$ ${DELIVERY_FEE.toFixed(2)}`;
    }

    const total = subtotal + DELIVERY_FEE;
    
    // Atualiza os elementos de preço
    subtotalCarrinhoElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    totalCarrinhoElement.textContent = `R$ ${total.toFixed(2)}`;
    
    // Atualiza o contador no menu de navegação
    carrinhoLink.textContent = `🛒 Pedido (${totalItems})`;
}

// ==========================================================
// 3. FUNÇÃO FINALIZAR PEDIDO
// ==========================================================

function finalizarPedido() {
    if (cart.length === 0) {
        alert("Seu pedido está vazio. Adicione um produto da loja para continuar.");
        return;
    }

    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const pagamento = document.getElementById("pagamento").value;
    const observacao = document.getElementById("observacao").value;
    const valorPago = parseFloat(document.getElementById("valorPago").value || 0);

    // VALIDAÇÃO DOS CAMPOS ESSENCIAIS
    if (!nome || !endereco || !pagamento) {
        alert("Por favor, preencha seu nome, o local de retirada/entrega e a forma de pagamento.");
        return;
    }
    // FIM DA VALIDAÇÃO

    const subtotal = cart.reduce((acc, prod) => acc + prod.price * prod.qty, 0);
    const total = subtotal + DELIVERY_FEE; 

    let trocoMsg = "";
    if (pagamento === "Dinheiro" && valorPago > 0) {
        const troco = valorPago - total;
        if (troco < 0) {
            trocoMsg = ` | O valor de R$ ${valorPago.toFixed(2)} é INSUFICIENTE (faltam R$ ${Math.abs(troco).toFixed(2)})`;
        } else {
            trocoMsg = ` | Troco para R$ ${valorPago.toFixed(2)}. Troco a devolver: R$ ${troco.toFixed(2)}`;
        }
    }

    // Montando a mensagem do WhatsApp
    let mensagem = `🔴 PEDIDO ATLÉTICA MAMUTES IFRJ:%0A`;
    cart.forEach(prod => {
        mensagem += `- ${prod.item} x${prod.qty} (R$ ${(prod.price * prod.qty).toFixed(2)})%0A`;
    });

    mensagem += `%0A--- Detalhes Financeiros ---%0A`;
    mensagem += `Subtotal: R$ ${subtotal.toFixed(2)}%0A`;
    mensagem += `Taxa de Entrega: R$ ${DELIVERY_FEE.toFixed(2)}%0A`;
    mensagem += `💰 TOTAL GERAL: R$ ${total.toFixed(2)}%0A`;
    
    mensagem += `%0A--- Dados do Cliente ---%0A`;
    mensagem += `Forma de pagamento: ${pagamento}${trocoMsg}%0A`;
    mensagem += `📍 Entregar/Retirar em: ${endereco}%0A`;
    mensagem += `👤 Cliente: ${nome}`;

    if (observacao) {
        mensagem += `%0A📝 Observações (TAMANHOS/CORES): ${observacao}`; 
    }
    
    // Abre o WhatsApp com a mensagem
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`;
    window.open(url, "_blank");

    // Limpa o carrinho e formulário após o envio
    esvaziarCarrinho();
    document.getElementById("nome").value = '';
    document.getElementById("endereco").value = '';
    document.getElementById("observacao").value = '';
    document.getElementById("valorPago").value = '';
    document.getElementById("pagamento").value = ''; 
}


// Inicializa o site: Carrega os produtos e o carrinho ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    gerarProdutos();
    atualizarCarrinhoVisual();
});