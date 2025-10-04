// Obtém o modal e a imagem do modal
var modal = document.getElementById("modal-imagem");
var modalImg = document.getElementById("img-ampliada");
var captionText = document.getElementById("modal-caption");

/**
 * Função para abrir o modal e ampliar a imagem clicada.
 * É chamada pelo atributo onclick nos cards de produto.
 * @param {string} src - O caminho da imagem.
 * @param {string} alt - O texto alternativo/descrição.
 */
function ampliarImagem(src, alt) {
    modal.style.display = "block";
    modalImg.src = src;
    captionText.innerHTML = alt;
}

/**
 * Função para fechar o modal.
 * É chamada ao clicar no 'X' ou no fundo preto do modal.
 */
function fecharModal() {
    modal.style.display = "none";
}