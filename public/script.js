// Envia o formulário e salva os dados
document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email })
    })
    .then(response => response.json())
    .then(data => {
        alert("Cadastro realizado com sucesso! Em breve entraremos em contato.");
        document.getElementById("signup-form").reset();
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao enviar seu cadastro. Tente novamente.");
    });
});

// Exibe o número de interessados
fetch('/get-interested-users')
    .then(response => response.json())
    .then(data => {
        document.getElementById('interested-count').textContent = `${data.interestedUsers} pessoas já demonstraram interesse!`;
    })
    .catch(error => {
        console.error('Erro ao obter o número de interessados:', error);
        document.getElementById('interested-count').textContent = 'Erro ao carregar.';
    });
