'use strict';

angular.module('ethExplorer', ['ngRoute','ui.bootstrap'])

.config(function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/main.html',
                controller: 'mainCtrl'
            }).
            when('/block/:blockId', {
                templateUrl: 'views/blockInfos.html',
                controller: 'blockInfosCtrl'
            }).
            when('/tx/:transactionId', { // make it compatible with metamask
                templateUrl: 'views/transactionInfos.html',
                controller: 'transactionInfosCtrl'
            }).
            when('/address/:addressId', {
                templateUrl: 'views/addressInfo.html',
                controller: 'addressInfoCtrl'
            }).
            when('/jns/:jnsId', {
                templateUrl: 'views/jnsInfo.html',
                controller: 'jnsInfoCtrl'
            }).
            when('/jnsvote/', {
                templateUrl: 'views/jnsVoteInfo.html',
                controller: 'jnsVoteInfoCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });

		// use the HTML5 History API. needs base href and server-side rewrite.
		$locationProvider.html5Mode(false); // FIXME use # for pure static deployment
    })
    .run(function($rootScope) {
        var web3 = new Web3();

	    	var protocol = location.protocol;
			//var hostname = 'localhost';
			var hostname = 'rpc.jnsdao.com'; //'j.blockcoach.com'; //location.hostname; // FIXME manual fix
			var port = (hostname == 'localhost' || hostname == '127.0.0.1')? 8501 : (protocol == 'http:' ? 8502 : 8503); //XXX yuanma rpc, geth:8501, nginx:8502, nginx-https:8503
	        //var eth_node_url = protocol + '//' + hostname + ':' + port; // adaptive to http & https
	        var eth_node_url = '//' + hostname + ':' + port; // 使用相对协议，在https页面混合http请求？

		web3.setProvider(new web3.providers.HttpProvider(eth_node_url));
        $rootScope.web3 = web3;
		window.web3 = web3; //XXX inject it to console for debugging
        function sleepFor( sleepDuration ){
            var now = new Date().getTime();
            while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
        }
        var connected = false;
        if(!web3.isConnected()) {
            $('#connectwarning').modal({keyboard:false,backdrop:'static'}) 
            $('#connectwarning').modal('show') 
        }
    });
