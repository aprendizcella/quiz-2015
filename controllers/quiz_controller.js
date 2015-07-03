var models = require('../models/models.js');

// Foros de Miriada X error en models.js 
// En las nuevas versiones de Sequelize (3 o más) el interfaz ha cambiado para usar "Promesas". A grandes rasgos hay que cambiar .success por .then, .error por .catch y .done por .finally
// Otra modificación a tener en cuenta findAll se queda igual pero hay que cambiar find por findById

exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(function(quiz) {
    if(quiz) {
      req.quiz = quiz;
      next();
    } else { next(new Error('No existe quizId=' + quizId));}
  })
  .catch(function(error) {next(error);});
};

exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index', {quizes: quizes});  
  }
  ).catch(function(error) { next(error);});
};

exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

// GET /author
exports.author = function(req, res) {
   res.render('author', {});
};
