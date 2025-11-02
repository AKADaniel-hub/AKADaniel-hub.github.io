const url = "https://deisishop.pythonanywhere.com/"
let litaProdutos = [];
const filtro = document.getElementById('filtro');
const ordenar = document.getElementById('ordenar');
const alunoDeisi = document.getElementById('estudante-checkbox')
const desconto = document.getElementById('codigo-desconto');
let referencia = 3312312312;

document.addEventListener('DOMContentLoaded', function () {

    fetch(`${url}products/`)
        .then(response => response.json())
        .then(data => {
            litaProdutos = data;
            carregarProdutos(litaProdutos);
            console.log('Products fetched successfully:', data);

        })
        .catch(error => console.error('Error fetching products:', error));


    fetch(`${url}categories/`)
        .then(response => response.json())
        .then(data => {
            console.log('categories fetched successfully:', data);
            criaFiltroCategorias(data);
        })
        .catch(error => console.error('Error fetching categories:', error));


});



function criaFiltroCategorias(categorias) {
    const filtro = document.getElementById('filtro');
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        filtro.appendChild(option);
    });
}


filtro.addEventListener('change', filtrarProdutos);


function filtrarProdutos() {


    const filtro = document.getElementById('filtro').value;

    const produtos = document.getElementById('produtos');
    produtos.innerHTML = '';

    let produtosFiltrado = litaProdutos.filter(produto => produto.category === filtro);

    carregarProdutos(produtosFiltrado);

    if (filtro === 'todas-as-categorias') {
        carregarProdutos(litaProdutos);
    }

}

ordenar.addEventListener('change', ordenarProdutos);

function ordenarProdutos() {
    const ordenar = document.getElementById('ordenar').value;
    console.log("entrou na funcao ordenarProdutos");
    const produtos = document.getElementById('produtos');
    produtos.innerHTML = '';

    let produtosOrdenados = litaProdutos;

    if (ordenar === 'preco-crescente') {
        produtosOrdenados.sort((a, b) => a.price - b.price);
    }

    if (ordenar === 'preco-decrescente') {
        produtosOrdenados.sort((a, b) => b.price - a.price);
    }
    carregarProdutos(produtosOrdenados);
}


procurar.addEventListener('input', procurarProdutos);

function procurarProdutos() {
    const procurar = document.getElementById('procurar').value.toLowerCase();
    console.log("entrou na funcao procurarProdutos");
    const produtos = document.getElementById('produtos');
    produtos.innerHTML = '';

    let produtosProcurados = litaProdutos.filter(produto => produto.title.toLowerCase().includes(procurar));

    carregarProdutos(produtosProcurados);
}


if (!localStorage.getItem('produtos-selecionados')) { // update
    localStorage.setItem('produtos-selecionados', '[]')
}

document.addEventListener('DOMContentLoaded', function () {

    carregarProdutos(litaProdutos);
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

const opcaoCheckout = document.querySelectorAll('.opcao-checkout');
opcaoCheckout.forEach(opcao => {
    opcao.addEventListener('change', actualizarCesto);
});

function actualizarCesto() {

    const comprar = document.getElementById('comprar-button');

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
    let precoTotalSemDescontos = 0;

    const precoTotalElemento = document.getElementById('precoTotal');

    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados'));

    produtosSelecionados.forEach(produto => {
        precoTotalSemDescontos += produto.price;
        precoTotal += produto.price;
    })

    if (alunoDeisi.checked) {
        precoTotal = precoTotal * 0.75;
    }

    if (desconto.value === 'black-friday' || desconto.value === 'ALL10') {
        precoTotal = precoTotal * 0.90;
    }

    precoTotalElemento.textContent = `Preço Total: ${precoTotalSemDescontos}€`;

    comprar.addEventListener('click', function () {

        referencia++;

        const mensagemCompra = document.getElementById('mensagem-compra');

        mensagemCompra.innerHTML = `
        <p>Valor final a pagar (com eventuais descontos): ${precoTotal.toFixed(2)}€</p>
        <p>A sua Referencia de compra é: ${referencia}</p>
        `;

        fetch(`${url}buy/`, {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)


                .then(response => response.json())
                .then(data => {



                })

                .catch(error => {
                    console.error('Error during purchase:', error);
                })


        });




    });


}


