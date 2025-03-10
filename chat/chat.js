var socket = io.connect(window.location.origin);


// Send bilde
function sendImage() {
    var receiver = document.getElementById("receiver").value.trim();
    var file = document.getElementById("imageInput").files[0];

    if (!file || receiver === "") {
        alert("Velg en mottaker og et bilde.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        socket.emit("send_image", {
            "to": receiver,
            "image": event.target.result.split(",")[1] // Kun Base64-data
        });
    };
    reader.readAsDataURL(file);
}

// Motta bilde
socket.on("receive_image", function(data) {
    document.getElementById("chat").innerHTML += `<p><b>Fra ${data.from}:</b> <img src="data:image/png;base64,${data.image}" style="max-width: 200px;"></p>`;
});
