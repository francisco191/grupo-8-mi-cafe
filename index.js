const express = require('express');
const app = express();

app.listen(3030, () => console.log('Corriendo en el servidor 3030'));

app.get('/detalle', function(req, res){
    res.sendFile(__dirname + '/src/views/detalle-producto.html');
});

app.get('/borrador', function(req, res){
    res.sendFile(__dirname + '/src/views/borrador-rodri.html');
});

app.get('/formulario', function(req, res){
    res.sendFile(__dirname + '/src/views/formulario-registro.html');
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/' + req.url);
  });