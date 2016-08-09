var chattituApp = angular.module('chattituApp',['ngRoute', 'firebase', 'angular.filter']);
chattituApp.config( function ($routeProvider) {
  $routeProvider
    .when('/', {
    	controller: 'inicioCtrl',
    	templateUrl: 'templates/inicio.html'
    })
    .when('/chatroom', {
    	controller: 'chatroomCtrl',
    	templateUrl: 'templates/chat.html'
    })
    .when('/configuracion', {
        controller: 'confCtrl',
        templateUrl: 'templates/conf.html'
    })
    .otherwise({ 
      redirectTo: '/' 
    });
});

chattituApp.controller ('inicioCtrl', function($scope,$location, $http, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://chattitu.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    var index = new Firebase("https://chattitu.firebaseio.com/usuarios");
    $scope.inicio = $firebaseArray(index);

    $scope.lemail = null;
    $scope.lpassword = null;

    $scope.login = function (email, password) {
        $scope.authObj.$authWithPassword({
            email: $scope.lemail,
            password: $scope.lpassword,
        }).then(function(authData) {
            ref.child('usuarios').child(authData.uid).update({
                fec_con : Firebase.ServerValue.TIMESTAMP,
                online : true
            });
            $location.path('/chatroom');
        }).catch(function(error) {
            console.error("Datos incorrectos:", error);
        });
    };

    $scope.rusuario = null;
    $scope.remail = null;
    $scope.rpassword = null;
    $scope.rrepassword = null;

    $scope.registrar = function (email, password) {
        var i;
        var text = "";
        var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ ){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            $scope.raleatorio = text;
        }

        if ($scope.rpassword === $scope.rrepassword){
            $scope.authObj.$createUser({
                email: $scope.remail,
                password: $scope.rpassword
            }).then(function(userData) {
                $scope.authObj.$authWithPassword({
                    email: $scope.remail,
                    password: $scope.rpassword
                }).then(function(authData) {
                    ref.child('usuarios').child(userData.uid).update({
                        usuario : $scope.rusuario,
                        email   : $scope.remail,
                        img     : authData.password.profileImageURL,
                        proveedor : authData.provider,
                        fec_reg : Firebase.ServerValue.TIMESTAMP,
                        fec_con : Firebase.ServerValue.TIMESTAMP,
                        serial : $scope.raleatorio,
                        suspendido : 'no',
                        online : true
                    });
                    $location.path('/chatroom');
                }).catch(function(error) {
                    console.error("Datos incorrectos:", error);
                    $location.path('/');
                });
            }).catch(function(error) {
                console.error("Error: ", error);
            });
        }else{
            console.log('No Coinciden');
        }
    };


    $scope.facebook = function () {
        var i;
        var text = "";
        var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          $scope.aleatorio = text;
        }

        $scope.authObj.$authWithOAuthPopup("facebook").then(function(authData) {
            ref.child('usuarios').child(authData.uid).update({
                usuario : authData.facebook.displayName,
                email : '',
                img     : authData.facebook.profileImageURL,
                proveedor : authData.provider,
                fec_reg : Firebase.ServerValue.TIMESTAMP,
                fec_con : Firebase.ServerValue.TIMESTAMP,
                serial : $scope.aleatorio,
                suspendido : 'no',
                online : true
            });
        }).then(function(authData) {
            $location.path('/chatroom');
        }).catch(function(error) {
          console.error("Fallo la autenticacion:", error);
          $location.path('/');
        });
    };

    $scope.google = function () {
        var i;
        var text = "";
        var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          $scope.aleatorio = text;
        }

        $scope.authObj.$authWithOAuthPopup("google").then(function(authData) {
            ref.child('usuarios').child(authData.uid).update({
                usuario : authData.google.displayName,
                email : '',
                img     : authData.google.profileImageURL,
                proveedor : authData.provider,
                fec_reg : Firebase.ServerValue.TIMESTAMP,
                fec_con : Firebase.ServerValue.TIMESTAMP,
                serial : $scope.aleatorio,
                suspendido : 'no',
                online : true
            });
        }).then(function(authData) {
            $location.path('/chatroom');
        }).catch(function(error) {
          console.error("Fallo la autenticacion:", error);
          $location.path('/');
        });
    };

    $scope.twitter = function () {
        var i;
        var text = "";
        var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          $scope.aleatorio = text;
        }

        $scope.authObj.$authWithOAuthPopup("twitter").then(function(authData) {
            ref.child('usuarios').child(authData.uid).set({
                usuario : authData.twitter.displayName,
                email : '',
                img     : authData.twitter.profileImageURL,
                proveedor : authData.provider,
                fec_reg : Firebase.ServerValue.TIMESTAMP,
                fec_con : Firebase.ServerValue.TIMESTAMP,
                serial : $scope.aleatorio,
                suspendido : 'no',
                online : true
            });
        }).then(function(authData) {
            $location.path('/chatroom');
        }).catch(function(error) {
          console.error("Fallo la autenticacion:", error);
          $location.path('/');
        });
    };


    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $location.path('/chatroom');
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));
        } else {
            $scope.online = false;
        }
    })
})


chattituApp.controller ('chatroomCtrl', function($scope,$location, $http, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://chattitu.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    var index = new Firebase("https://chattitu.firebaseio.com/usuarios");
    $scope.inicio = $firebaseArray(index);

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));

            var refMensaje = new Firebase('https://chattitu.firebaseio.com/mensajes/general');
            $scope.mensajes = $firebaseArray(refMensaje);

            $scope.texto  = null;
            $scope.enviarMensaje = function (){
                if ($scope.texto == null) {
                    console.log('llene su mensaje');
                }else{
                    $scope.mensajes.$add(
                        {
                            id : authData.uid,
                            usuario : $scope.perfil.usuario,
                            foto : $scope.perfil.img,
                            mensaje : $scope.texto,
                            fec_mensaje : Firebase.ServerValue.TIMESTAMP
                        }
                    );
                    $scope.texto  = null;
                }
            }


            $scope.logout = function () {
                ref.child('usuarios').child(authData.uid).update({
                    online : false
                });
                $scope.authObj.$unauth()
                $location.path('/');
            }
        } else {
            $scope.online = false;
        }
    })
})


chattituApp.controller ('confCtrl', function($scope,$location, $http, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://chattitu.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    var index = new Firebase("https://chattitu.firebaseio.com/usuarios");
    $scope.inicio = $firebaseArray(index);

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));
        } else {
            $scope.online = false;
        }




        $scope.logout = function () {
            ref.child('usuarios').child(authData.uid).update({
                online : false
            });
            $scope.authObj.$unauth()
            $location.path('/');
        }
    })
})
