const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

const numeros = [
    '1', '2', '3', '4', '5',
    '6', '7', '8', '9', '10',
    '11', '12', '13', '14'
];

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

let firstCard = '';
let secondCard = '';
let segundosDecorridos = 0;
let loop = null;
const LIMITE_TEMPO = 180; // 3 minutos

const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
};

const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disabled-card');
    if (disabledCards.length === 28) { // 14 pares = 28 cartas
        clearInterval(loop);

        Swal.fire({
            icon: 'success',
            title: 'Parabéns!',
            text: `Seu tempo foi de ${formatarTempo(segundosDecorridos)}minutos.`,
            confirmButtonText: 'OK'
        }).then(() => {
            resetarJogo();
        });
    }
};

const checkCards = () => {
    const firstNumeros = firstCard.getAttribute('data-numeros');
    const secondNumeros = secondCard.getAttribute('data-numeros');

    if (firstNumeros === secondNumeros) {
        firstCard.firstChild.classList.add('disabled-card');
        secondCard.firstChild.classList.add('disabled-card');
        firstCard = '';
        secondCard = '';
        checkEndGame();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('reveal-card');
            secondCard.classList.remove('reveal-card');
            firstCard = '';
            secondCard = '';
        }, 500);
    }
};

const revealCard = ({ target }) => {
    if (target.parentNode.className.includes('reveal-card')) return;

    if (firstCard === '') {
        target.parentNode.classList.add('reveal-card');
        firstCard = target.parentNode;
    } else if (secondCard === '') {
        target.parentNode.classList.add('reveal-card');
        secondCard = target.parentNode;
        checkCards();
    }
};

const createCard = (numeros, posicao) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', `face back${posicao}`);

    front.style.backgroundImage = `url('../imagens/${numeros}.jpg')`;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', revealCard);
    card.setAttribute('data-numeros', numeros);

    return card;
};

const loadGame = () => {
    const duplicateNumeros = [...numeros, ...numeros];
    const shuffledArray = duplicateNumeros.sort(() => Math.random() - 0.5);

    let index = 0;
    shuffledArray.forEach((numeros) => {
        index++;
        const card = createCard(numeros, index);
        grid.appendChild(card);
        if (index == 2) index = 0;
    });
};

const startTimer = () => {
    segundosDecorridos = 0;
    timer.innerHTML = formatarTempo(segundosDecorridos);
    clearInterval(loop);

    loop = setInterval(() => {
        segundosDecorridos++;
        timer.innerHTML = formatarTempo(segundosDecorridos);

        if (segundosDecorridos >= LIMITE_TEMPO) {
            clearInterval(loop);

            Swal.fire({
                icon: 'warning',
                title: 'Tempo esgotado!',
                text: 'Vamos começar novamente.',
                confirmButtonText: 'OK'
            }).then(() => {
                resetarJogo();
            });
        }
    }, 1000);
};

function resetarJogo() {
    clearInterval(loop);
    segundosDecorridos = 0;
    timer.innerHTML = formatarTempo(0);
    campoAtivo = null;
    firstCard = '';
    secondCard = '';
    grid.innerHTML = '';
    loadGame();

    const modal = document.getElementById('modalCadastro');
    if (modal) modal.style.display = 'flex';

    // Reseta o formulário e nome do jogador
    const form = document.getElementById('formCadastro');
    if (form) form.reset();
    if (spanPlayer) spanPlayer.textContent = '';
}

document.getElementById('repetir').addEventListener('click', () => {
    resetarJogo();
});

window.onload = () => {
    loadGame();
    // Timer inicia só após o envio do formulário
};

// TECLADO VIRTUAL
let campoAtivo = null;

document.querySelectorAll('#formCadastro input').forEach(input => {
    input.addEventListener('focus', () => {
        campoAtivo = input;

        const tecladoCompleto = document.getElementById('tecladoVirtual');
        const tecladoNumerico = document.getElementById('tecladoNumerico');

        if (input.id === 'telefone') {
            tecladoCompleto.style.display = 'none';
            tecladoNumerico.style.display = 'flex';
        } else {
            tecladoNumerico.style.display = 'none';
            tecladoCompleto.style.display = 'flex';
        }

        setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    });
});

function inserirTecla(char) {
    if (!campoAtivo) return;

    campoAtivo.focus();
    let start = campoAtivo.selectionStart || campoAtivo.value.length;
    let end = campoAtivo.selectionEnd || campoAtivo.value.length;
    const texto = campoAtivo.value;

    campoAtivo.value = texto.substring(0, start) + char + texto.substring(end);
    campoAtivo.setSelectionRange(start + char.length, start + char.length);
}

function removerTecla() {
    if (!campoAtivo) return;

    const valorAtual = campoAtivo.value;
    const cursorPos = campoAtivo.selectionStart || valorAtual.length;

    if (cursorPos > 0) {
        const novoValor = valorAtual.slice(0, cursorPos - 1) + valorAtual.slice(cursorPos);
        campoAtivo.value = novoValor;
        campoAtivo.focus();
        campoAtivo.setSelectionRange(cursorPos - 1, cursorPos - 1);
    }
}

document.getElementById('formCadastro').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone')
    };

    const modal = document.getElementById('modalCadastro');
    modal.style.display = 'none';

    if (spanPlayer) spanPlayer.textContent = data.nome;

    if (typeof startTimer === 'function') startTimer();

    document.getElementById('tecladoVirtual').style.display = 'none';
    document.getElementById('tecladoNumerico').style.display = 'none';
    campoAtivo = null;
    this.reset();
});

// FIRESTORE
window.salvarDados = async function () {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;

    try {
        await addDoc(collection(db, "usuarios"), { nome, email, telefone });
        alert("Dados Salvos");
    } catch (error) {
        alert("Erro ao salvar: " + error);
    }
};
