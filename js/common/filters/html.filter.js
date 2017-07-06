export default {
    'trustHtml' : /*@ngInject*/trustHtml
};

function trustHtml($sce){
    return function(input) {
		return $sce.trustAsHtml(input);
	};
}