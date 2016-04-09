app.angular.module("GoProject").directive("termes", function(){
	return {
		// <termes />
		restrict: 'E',
		templateUrl: 'templates/termes.html',
		replace: true
	}
})