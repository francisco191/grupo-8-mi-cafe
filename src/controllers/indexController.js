
let indexController = {
    nosotrosMC: function(req, res) {
        res.send('Somos Mí Café');
      },
    regionesMC: function(req, res) {
        res.send('Regiones del café');
      },
    perfilMC: function(req, res) {
        res.send('Tu perfil de café');
      }

};
module.exports = indexController;