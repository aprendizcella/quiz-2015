// Importamos el modelo
var models = require('../models/models.js');

var statistics = {
      quizes: 0,
      comments: 0,
      commentsUnpublished: 0,
      commentedQuizes:0
   };
var errors = [];

// GET /quizes/statistics
exports.statistics = function(req, res, next) {
	// NOTE: Usar promesas (Promise.all) sería mejor, ya que se podrían
	// lanzar todas las consultas simultáneamente
	 models.Quiz.count()
  	.then(function (numQuizes) { // número de preguntas
	   statistics.quizes = numQuizes;
	   return models.Comment.count();
	  })
	  .then(function (numComments) { // número de comentarios
	   statistics.comments = numComments;
	    return models.Comment.countUnpublished();
	 })
	 .then(function (numUnpublished) { // número de comentarios sin publicar
	   statistics.commentsUnpublished = numUnpublished;
	   return models.Comment.countCommentedQuizes();
	 })
	  .then(function (numCommented) { // número de preguntas con comentario
	   statistics.commentedQuizes = numCommented;
	  })
	  .catch(function (err) { errors.push(err); })
	  .finally(function () {
	    next();
	  });
};

// GET /statistics
// 1ª Opción
/*exports.show = function(req, res){
  //var n_quizes = models.Comment.countCommentedQuizes();
  res.render('statistics/show', { statistics: statistics, errors: errors });
  //res.render('quizes/statistics',{statistics: statistics, errors:[]});	
};*/

// 2ª Opción
exports.show = function(req,res){
	 models.Comment.countCommentedQuizes().then(function(n_quizes){
		 res.render('statistics/show', {statistics: statistics, n_quizes:n_quizes, errors: errors});
 		}
 	);
};
