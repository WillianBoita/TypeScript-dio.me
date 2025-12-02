let botaoAtualizar = document.getElementById('atualizar-saldo') as HTMLButtonElement;
let botaoLimpar = document.getElementById('limpar-saldo') as HTMLButtonElement;
let soma = document.getElementById('soma') as HTMLInputElement;
let campoSaldo = document.getElementById('campo-saldo') as HTMLElement;

console.log(soma)
console.log(soma.value)

campoSaldo.innerHTML = "0"


function somarAoSaldo(soma: string) {
    let novaSoma = parseInt(campoSaldo.innerHTML) + parseInt(soma)
    campoSaldo.innerHTML = novaSoma.toString();
}

function limparSaldo() {
    campoSaldo.innerHTML = '0';
}

botaoAtualizar.addEventListener('click', function () {
    somarAoSaldo(soma.value);
});

botaoLimpar.addEventListener('click', function () {
    limparSaldo();
});
