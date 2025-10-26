import { produtos } from "./produtos.js";


if (!localStorage.getItem('produtos-selecionados')) { // update
    localStorage.setItem('produtos-selecionados', '[]')
}

document.addEventListener('DOMContentLoaded', function () {

    carregarProdutos(produtos);
});
document.addEventListener('DOMContentLoaded', function () {

    actualizarCesto();
});

function carregarProdutos(produtos) {

    console.log("entrou na funcao carregarProdutos");
    const sectionProduto = document.getElementById('produtos');

    produtos.forEach(produto => {
        const artigo = criarProduto(produto);
        sectionProduto.append(artigo);

    });
};


function criarProduto(produto) {

    const artigo = document.createElement('article');

    const titulo = document.createElement('h4');
    titulo.textContent = produto.title;

    const ssectionImage = document.createElement('section');
    const imagem = document.createElement('img');
    imagem.src = produto.image;
    ssectionImage.append(imagem);

    const descricao = document.createElement('p');
    descricao.textContent = produto.description;

    const preco = document.createElement('h5');
    preco.textContent = `Preço:  ${produto.price} €`;


    const button = document.createElement('button');
    button.textContent = 'Adicionar ao cesto';

    button.addEventListener('click', function () {

        let produtosEscolhidos = JSON.parse(localStorage.getItem('produtos-selecionados'));

        produtosEscolhidos.push(produto);

        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosEscolhidos));

        actualizarCesto();
    });


    artigo.append(titulo, ssectionImage, preco, descricao, button);

    return artigo;

};



function criarProdutoCesto(produto) {


    const artigoCesto = document.createElement('article');

    const tituloCesto = document.createElement('h4');
    tituloCesto.textContent = produto.title;


    const sectionImageCesto = document.createElement('section');
    const imagemCesto = document.createElement('img');
    imagemCesto.src = produto.image;
    sectionImageCesto.append(imagemCesto);
/*
    const descricaoCesto = document.createElement('p');
    descricaoCesto.textContent = produto.description;
*/
    const precoCesto = document.createElement('h5');
    precoCesto.textContent = `Preço:  ${produto.price} €`;


    const buttonCesto = document.createElement('button');
    buttonCesto.textContent = 'Remover do cesto';


    artigoCesto.append(tituloCesto, sectionImageCesto, precoCesto, buttonCesto);


    buttonCesto.addEventListener('click', function () {

        removerArtigoCesto(produto.id);

        actualizarCesto();
    });

    return artigoCesto;

}


function removerArtigoCesto(id) {

    let produtosEscolhidos = JSON.parse(localStorage.getItem('produtos-selecionados'));

    let elementoARemover = produtosEscolhidos.findIndex(produto => produto.id === id);

    produtosEscolhidos.splice(elementoARemover, 1);

    localStorage.setItem('produtos-selecionados', JSON.stringify(produtosEscolhidos));




}


function actualizarCesto() {


    const listaCesto = JSON.parse(localStorage.getItem('produtos-selecionados'));
    const cesto = document.getElementById('cesto');

    cesto.innerHTML = '';



    listaCesto.forEach(produto => {
        const artigoCesto = criarProdutoCesto(produto);
        cesto.append(artigoCesto);

    }

    );

    // preco total



    let precoTotal = 0;

    const precoTotalElemento = document.getElementById('precoTotal');

    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados'));

    produtosSelecionados.forEach(produto => {
        precoTotal += produto.price;
    })

    precoTotalElemento.textContent = `Preço Total: ${precoTotal}€`;


}