
var larguraCanvas = window.innerWidth;
var alturaCanvas = window.innerHeight;
var ctx;
var primeiroClique = true;
var primeiraCarta = -1;
var segundaCarta;
var corFundoCarta = "#AEA"; //verde
var corFundoCartaAcerto = "#FFF"; //branco
var cartas = [];
var primeiraSX = 0.1 * larguraCanvas + 10; //posição inicial da primeria carta no eixo x, ou seja, na horizontal
var primeiraSY = 0.1 * alturaCanvas; //posição inicial da primeria carta no eixo y, ou seja, na vertical
var margin = 0.01 * larguraCanvas; //adiciona espaçamento entre as cartas
if (larguraCanvas > alturaCanvas) {
    var larguraCarta = 0.12 * larguraCanvas;
    var alturaCarta = 0.3 * alturaCanvas;
}
else {
    var larguraCarta = 0.15 * larguraCanvas;
    var alturaCarta = 0.10 * alturaCanvas;
}
var acerto;
var contagem = 0;
var pares = [
    ["./img/leao.png", "./img/leao.png"],
    ["./img/elefante.png", "./img/elefante.png"],
    ["./img/coala.png", "./img/coala.png"],
    ["./img/girafa.png", "./img/girafa.png"],
    ["./img/macaco.png", "./img/macaco.png"],
    ["./img/jacare.png", "./img/jacare.png"]
]

function iniciar() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('click', escolherCartas, false);
    redimensionarCanvas();
    sortearCartas();
    embaralharCartas();
    inicio = new Date(); //pega o omento que o jogo inicia
    inicio = Number(inicio.getTime());
}

function redimensionarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function sortearCartas() {
    var carta1; //inicializa primeira carta do par
    var carta2; //inicializa segunda carta do par
    var imgCarta1; //inicializa imagem da primeira carta do par
    var imgCarta2; //inicializa imagem da segunda carta do par
    var cx = primeiraSX; //posicao horizontal da primeira carta do par
    var cy = primeiraSY; //posicao vertical da primeira carta do par
    for (var i = 0; i < pares.length; i++) {
        // Criação das cartas e imagens
        imgCarta1 = new Image();
        imgCarta1.src = pares[i][0];
        carta1 = mostrarCarta(cx, cy, larguraCarta, alturaCarta, imgCarta1, i);
        cartas.push(carta1); //alimenta o array com a carta
        imgCarta2 = new Image();
        imgCarta2.src = pares[i][1];
        carta2 = mostrarCarta(cx, cy + alturaCarta + margin, larguraCarta, alturaCarta, imgCarta2, i);
        cartas.push(carta2); //alimenta o array com a carta
        cx = cx + larguraCarta + margin;
        carta1.draw();
        carta2.draw();
    }

}

function mostrarCarta(sx, sy, swidth, sheight, img, info) {
    return {
        sx: sx,
        sy: sy,
        swidth: swidth,
        sheight: sheight,
        img: img,
        info: info,
        draw: desenharCarta
    };
}

// desenhar o formato das peças
function desenharCarta() {
    ctx.fillStyle = corFundoCarta; //cor do fundo da carta que ainda nao tem par
    ctx.fillRect(this.sx, this.sy, this.swidth, this.sheight);
}

function escolherCartas(e) {
    var mx;
    var my;
    ctx.font = "bold 1em sans-serif";
    //identificação das posições x e y no momento do clique, e de acordo com o navegador
    if (e.layerX || e.layerX == 0) { // Firefox, Google
        mx = e.layerX;
        my = e.layerY;
    } else if (e.offsetX || e.offsetX == 0) { // Opera
        mx = e.offsetX;
        my = e.offsetY;
    }
    for (var i = 0; i < cartas.length; i++) {
        var carta = cartas[i];
        if (carta.sx >= 0) //verifica se a carta ainda esta no jogo, caso seja maior que 0, nao podendo ser -1
            if ((mx > carta.sx) && (mx < carta.sx + carta.swidth) && (my > carta.sy) && (my < carta.sy + carta.sheight)) {
                //verifica se a primeira carta nao é clicada novamente
                if ((primeiroClique) || (i != primeiraCarta)) {
                    break;
                }
            }
    }
    if (i < cartas.length) {  //se for clicada em uma carta
        if (primeiroClique) {
            primeiraCarta = i;
            primeiroClique = false;
            ctx.drawImage(carta.img, carta.sx, carta.sy, carta.swidth, carta.sheight);
        }
        else {
            segundaCarta = i;
            ctx.drawImage(carta.img, carta.sx, carta.sy, carta.swidth, carta.sheight);
            if (carta.info == cartas[primeiraCarta].info) {
                acerto = true;
                contagem++;
                ctx.fillStyle = "antiquewhite";
                ctx.fillRect(0.1 * larguraCanvas, 0.80 * alturaCanvas, 0.8 * larguraCanvas, alturaCanvas);
                //gerar o placar parcial dos acertos
                ctx.fillStyle = "#000";
                ctx.fillText("PONTUACAO: " + String(contagem), 0.1 * larguraCanvas, 0.95 * alturaCanvas);
                if (contagem >= 0.5 * cartas.length) {
                    //obtenção do tempo final para comparar com o início 
                    var agora = new Date();
                    var tempo = Number(agora.getTime());
                    var segundos = Math.floor(.5 + (tempo - inicio) / 1000);
                    //impressão do resultado final com o tempo de duração 
                    ctx.fillStyle = "antiquewhite";
                    ctx.fillRect(0.2 * larguraCanvas, 0.80 * alturaCanvas, 0.8 * larguraCanvas, alturaCanvas);
                    ctx.fillStyle = "#000";
                    var saida = "VOCE TERMINOU EM: " + String(segundos) + " segundos.";
                    ctx.fillText(saida, 0.1 * larguraCanvas, 0.92 * alturaCanvas);
                    return;
                }
            }
            else {
                acerto = false;
            }
            primeiroClique = true;
            //durante o processo de seleção das cartas, a função esconderCartas() é chamada
            setTimeout(esconderCartas, 500);
        }
    }
}

// garante que as cartas fiquem em posições diferentes todo vez que o jogo reiniciar
function embaralharCartas() {
    var indice1;
    var indice2;
    var guardarInfo;
    var guardarImagem;
    var quantCartas = cartas.length
    for (var j = 0; j <= 2 * quantCartas; j++) {
        indice1 = Math.floor(Math.random() * quantCartas); //seleciona aleatoriamente um indice do array com o Math.random()
        indice2 = Math.floor(Math.random() * quantCartas); //seleciona aleatoriamente um indice do array com o Math.random()
        guardarInfo = cartas[indice1].info; //dados da carata no indice1
        guardarImagem = cartas[indice1].img;//dados da carata no indice1
        cartas[indice1].info = cartas[indice2].info;  //troca indice1 e indice2
        cartas[indice1].img = cartas[indice2].img; //troca indice1 e indice2
        cartas[indice2].info = guardarInfo; //troca indice1 e indice2
        cartas[indice2].img = guardarImagem; //troca indice1 e indice2
    }
}

// função que esconde as cartas após duas serem abertas
function esconderCartas() {
    //se as cartas nao forem iaguais, sao desenhadas novamente sem alterar a posiçao inicial
    if (!acerto) {
        cartas[primeiraCarta].draw();
        cartas[segundaCarta].draw();
    }
    else {
        ctx.fillStyle = corFundoCartaAcerto; //cor de preenchimento da carta após ter acertado os pares
        ctx.fillRect(cartas[segundaCarta].sx, cartas[segundaCarta].sy, cartas[segundaCarta].swidth, cartas[segundaCarta].sheight);
        ctx.fillRect(cartas[primeiraCarta].sx, cartas[primeiraCarta].sy, cartas[primeiraCarta].swidth, cartas[primeiraCarta].sheight);
        cartas[segundaCarta].sx = -1; //define como -1 para que elas nao possam mais ser selecionadas
        cartas[primeiraCarta].sx = -1;  //define como -1 para que elas nao possam mais ser selecionadas
    }
}
