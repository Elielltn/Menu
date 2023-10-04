$(document).ready(function(){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO= [];

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }

};

cardapio.metodos = {
    
    // obetem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];
        if (!vermais) {
            $("#itensCardapio").html('')// toda vez que um novo filtro é chamado o filtro anterior é "limpado" e o novo entra no lugar.
            $('#btnVerMais').removeClass("hidden")
        }
        
        
        
        $.each(filtro, (i, e) =>{ // Passa em cada um dos itens da Array, pega um template e coloca no item

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)//Utilizando o Regex pra alterar o src padrão do template pelo src de cada item.
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))// toFixed() faz com que o float fique com  2 casas decimais e o replace é usado para tirar o ponto e substituir por vírgula.
            .replace(/\${id}/g, e.id);
            // botão ver mais foi clicado (12 itens)
            if(vermais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp)//  Pesquisa pelo ID e Adiciona o template no HTMl
            }
            
            // paginação inicial (8 itens)
            if(!vermais && i < 8){
                $("#itensCardapio").append(temp)    
            }
        })

        // remove o ativo
        $(".container-menu a").removeClass('active')

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active')

    },

    verMais: () =>{
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $('#btnVerMais').addClass("hidden")
    },

    //Diminuir a quantidade do item no cardápio
    diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        if(qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }
    },
    //Aumentar a quantidade do item no cardápio
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)
    },

    //Adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0){
            //Obter categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //Obtem a lista de itens
            let filtro = MENU[categoria];
            
            //Obtem o item
            let item = $.grep(filtro, (e, i) => {return e.id == id})

            if (item.length > 0) {
                //Validar se já existe esse item no carrinho 
                let existe = $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id});

                //Caso já exita só altera a quantidade
                if(existe.length > 0){
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                //Caso ainda não exista no carrinho, adiciona ele
                else{
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.metodos.mensagem('item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0)

                cardapio.metodos.atualizarBadgeTotal(); 
            }
        }
        

    }, 

    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0){
            $(".botao-carrinho").removeClass("hidden");
            $(".container-total-carrinho").removeClass("hidden");
        } 
        else {
            $(".botao-carrinho").addClass("hidden");
            $(".container-total-carrinho").addClass("hidden");
        }

        $(".badge-total-carrinho").html(total);

    }, 

    abrirCarrinho: (abrir) => {
        if (abrir){
            $("#modalCarrinho").removeClass("hidden")
        } else {
            $("#modalCarrinho").addClass("hidden")
        }
    },

    mensagem: (texto, cor = 'red', tempo = 3500) =>{
        let id = Math.floor(Date.now() * Math.random()).toString();
        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;
        
        $("#container-mensagens").append(msg);

        setTimeout(() =>{
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800)
        }, tempo)
    },
};

cardapio.templates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}"/>
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${preco}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `

};