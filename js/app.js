$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio = {};

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }

};

cardapio.metodos = {
    
    // obetem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'burgers') => {

        var filtro = MENU[categoria];
        console.log(filtro);

        $("#itensCardapio").html('')// toda vez que um novo filtro é chamado o filtro anterior é "limpado" e o novo entra no lugar.
        
        $.each(filtro, (i, e) =>{ // Passa em cada um dos itens da Array, pega um template e coloca no item

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)//Utilizando o Regex pra alterar o src padrão do template pelo src de cada item.
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','));// toFixed() faz com que o float fique com  2 casas decimais e o replace é usado para tirar o ponto e substituir por vírgula.
            $("#itensCardapio").append(temp)//  Pesquisa pelo ID e Adiciona o template no HTMl
        })

        // remove o ativo
        $(".container-menu a").removeClass('active')

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active')

    },
};

cardapio.templates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item">
                <div class="img-produto">
                    <img src="\${img}" alt=""/>
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${preco}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens">0</span>
                    <span class="btn-mais"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `

};