var socket = io.connect("http://79.161.71.139:5000");  
var username = localStorage.getItem("username"); 

if (username) {
    socket.emit("register", { "username": username }); 
    console.log("Gjenopptok session for:", username);
    document.getElementById("username").value = username;  
}

function registerUser() {
    username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Vennligst skriv inn et brukernavn.");
        return;
    }
    localStorage.setItem("username", username); 
    socket.emit("register", { "username": username });
    alert("Registrert som " + username);
}

function sendMessage() {
    var receiver = document.getElementById("receiver").value.trim();
    var message = document.getElementById("message").value.trim();
    if (receiver === "" || message === "") {
        alert("Både mottaker og melding må fylles ut.");
        return;
    }
    socket.emit("private_message", { "from": username, "to": receiver, "message": message });
    document.getElementById("chat").innerHTML += `<p><b>Til ${receiver}:</b> ${message}</p>`;
}

socket.on("message", function(data) {
    document.getElementById("chat").innerHTML += `<p><b>Fra ${data.from}:</b> ${data.message}</p>`;
});

function sendImage() {
    var receiver = document.getElementById("receiver").value.trim();
    var file = document.getElementById("imageInput").files[0];

    if (!file) {
        alert("Velg et bilde før du sender.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var base64Image = event.target.result.split(",")[1]; // Fjern Base64-header
        socket.emit("send_image", {
            "from": username,
            "to": receiver,
            "image": base64Image
        });
    };

    reader.readAsDataURL(file);
}

socket.on("receive_image", function(data) {
    document.getElementById("chat").innerHTML += 
        `<p><b>Fra ${data.from}:</b> <br><img src="${data.image_url}" style="max-width: 200px;"></p>`;
}); 