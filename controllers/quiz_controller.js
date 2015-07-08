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

/*exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index', {quizes: quizes});  
  }
  ).catch(function(error) { next(error);});
};*/

exports.index = function(req, res) {
  search = req.query.search;
  if(search) {
    search = search.replace(/\s/g,"%");
    models.Quiz.findAll({where: ["pregunta LIKE '%"+search+"%'"], order: 'pregunta ASC'}).then(function(quizes){
      res.render('quizes/index', {quizes: quizes});  
    })
    .catch(function(error) {next(error);});
  } else {
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index', {quizes: quizes, errors: []});  
    })
    .catch(function(error) {next(error);});
  }
};

exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};

exports.edit = function(req, res) {
  var quiz = req.quiz;
  console.log(quiz);

  res.render('quizes/edit', {quiz: quiz, errors: []});  
};

exports.update = function(req, res) {
  // console.log(req);
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .validate()
  .then(function(err){
    if(err) {
      res.render('quizes/edit', {quiz: req.quiz, errors: err.errors})
    } else {
      req.quiz.save({fields: ['pregunta', 'respuesta']}).then(function(){
        res.redirect('/quizes');
      });
    }
  });
};


// GET /author
exports.author = function(req, res) {
   res.render('author', {errors: []});
};
