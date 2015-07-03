var models = require('../models/models.js');

// Foros de Miriada X error en models.js 
// En las nuevas versiones de Sequelize (3 o más) el interfaz ha cambiado para usar "Promesas". A grandes rasgos hay que cambiar .success por .then, .error por .catch y .done por .finally
// Otra modificación a tener en cuenta findAll se queda igual pero hay que cambiar find por findById

exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index', {quizes: quizes});  
  });
};

exports.show = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz){
    res.render('quizes/show', {quiz: quiz});  
  });
};

exports.answer = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz){
    if (req.query.respuesta === quiz.respuesta) {
      res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
    } else {
      res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});
    }
  });
};

// GET /author
exports.author = function(req, res) {
   res.render('author', {});
};
