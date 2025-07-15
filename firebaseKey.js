// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyARjG3gnHPDxKVTDPWbIepq4_b1AxZz0AM",
    authDomain: "jogo-da-memoria-iii-db4d3.firebaseapp.com",
    projectId: "jogo-da-memoria-iii-db4d3",
    storageBucket: "jogo-da-memoria-iii-db4d3.firebasestorage.app",
    messagingSenderId: "135153416945",
    appId: "1:135153416945:web:2b38228df4ce5b0dc68750"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// preenchimento forms
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

    // Define o nome do jogador, se tiver o span
    const spanPlayer = document.querySelector('.player');
    if (spanPlayer) {
        spanPlayer.textContent = data.nome;
    }

    // Inicia o timer
    startTimer();

    this.reset();
});


// Função para salvar dados
window.salvarDados = async function () {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;


    try {
        await addDoc(collection(db, "usuarios"), {
            nome,
            email,
            telefone
        })
        alert("Dados Salvos");
    } catch (error) {
        alert("Error" + error)
    }

}