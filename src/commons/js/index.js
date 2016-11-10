//# sourceURL=storage-management-plugin.js
(function() {
    "use strict";

    var storageModule = angular.module("TendrlModule", ["ui.router"]);

    storageModule.constant("config", {
            baseUrl: "http://10.70.41.164:9292/1.0/",
            requestHeader: {"Content-Type": "application/x-www-form-urlencoded"},
            clusterId: "3969b68f-e927-45da-84d6-004c67974f07"
        }
    );

    storageModule.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

        //$locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise("/dashboard");

        $stateProvider
            .state("Tendrl", {
                url: "/Tendrl",
                templateUrl: "index.html",
                abstract: true
            })
            .state("dashboard", {
                url: "/dashboard",
                template: "<h1>Coming soon...</h1>"
            })
            .state("volume", {
                url: "/volume",
                templateUrl: "/modules/volume/volume.html",
                controller: "volumeController",
                controllerAs: "volume"
            })
            .state("create-volume", {
                url: "/create-volume",
                templateUrl: "/modules/volume/create-volume/create-volume.html",
                controller: "createVolumeController",
                controllerAs: "createVolume"
            });

    });


}());
