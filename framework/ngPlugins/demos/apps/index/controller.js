/**
 * demo入口页
 */
define([
], function(){
    return ["$scope", "$rootScope", "$stateParams","$timeout", "btPage",
    function ($scope, $rootScope, $stateParams, $timeout, btPage) {
        $scope.setPageTitle("demo入口页");
    }];
});

