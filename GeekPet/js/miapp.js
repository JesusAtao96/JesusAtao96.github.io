var myApp = angular.module('myApp',['ngCart', 'ngRoute', 'firebase', 'toastr', 'angular.filter']);
myApp.config( function ($routeProvider) {
  $routeProvider
    .when('/', {
    	controller: 'myCtrl',
    	templateUrl: 'template/inicio.html'
    })
    .when('/login', {
        controller: 'loginController',
        templateUrl: 'template/login.html'
    })
    .when('/registro', {
        controller: 'registroController',
        templateUrl: 'template/registro.html'
    })
    .when('/crear', {
        controller: 'crearController',
    	templateUrl: 'template/crear.html'
    })
    .when('/productos', {
        controller: 'productosController',
    	templateUrl: 'template/productos.html'
    })
    .when('/buscar', {
        controller: 'buscarController',
    	templateUrl: 'template/buscar.html'
    })
    .when('/compras', {
    	controller: 'comprasController',
    	templateUrl: 'template/compras.html'
    }).when('/perfil', {
        controller: 'perfilController',
        templateUrl: 'template/perfil.html'
    })
    .when('/administrar', {
        controller: 'generalController',
        templateUrl: 'template/general.html'
    })
    .when('/configuracion', {
        controller: 'confController',
        templateUrl: 'template/conf.html'
    })
    .when('/editarp', {
        controller: 'editarpController',
        templateUrl: 'template/editarperfil.html'
    })
    .when('/cambiarc', {
        controller: 'cambiarcController',
        templateUrl: 'template/cambiarcontra.html'
    })
    .when('/usuario/:name', {
        controller: 'usuController',
        templateUrl: 'template/usuario.html'
    })
    .when('/panlogin', {
        controller: 'panloginController',
        templateUrl: 'template/panellogin.html'
    })
    .when('/panadmin', {
        controller: 'panadminController',
        templateUrl: 'template/paneladmin.html'
    })
    .when('/adpedidos', {
        controller: 'adpedidosController',
        templateUrl: 'template/adminpedidos.html'
    })
    .when('/adestadisticas', {
        controller: 'adestadisticasController',
        templateUrl: 'template/adminestadisticas.html'
    })
    .when('/adusuarios/:nombre', {
        controller: 'adusuariosController',
        templateUrl: 'template/adminusuarios.html'
    })
    .otherwise({ 
      redirectTo: '/' 
    });
});

/* Controlador Inicio*/
myApp.controller ('myCtrl', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    var index = new Firebase("https://geekpet.firebaseio.com/usuarios");
    $scope.inicio = $firebaseArray(index);

    $scope.online = null;

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));
            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online : false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                    toastr.info('Estas suspendido');
                }
            });
        } else {
            $scope.online = false;
        }
    })

    $scope.logout = function () {
        notie.alert(3, 'Cerrando Sesión.', 3);
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth();
        $location.path('#/');
    }
})

/* Controlador Login*/
myApp.controller ('loginController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.email = null;
    $scope.password = null;

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $location.path('#/');
        } else {
            $scope.online = false;
        }
    })

    $scope.login = function (email, password) {
        $scope.authObj.$authWithPassword({
          email: $scope.email,
          password: $scope.password,
        }).then(function(authData) {
          // Guarda fecha de conexion al iniciar sesion
          notie.alert(4, 'Iniciando Sesión', 3);
          $scope.online = true;
          ref.child('usuarios').child(authData.uid).update({
              fec_con : Firebase.ServerValue.TIMESTAMP,
              online : $scope.online
          });
        }).then(function(authData) {
              $location.path('#/');
        }).catch(function(error) {
                console.error("Datos incorrectos:", error);
        });
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
            $scope.online = true;
            ref.child('usuarios').child(authData.uid).update({
                usuario : authData.facebook.displayName,
                img     : authData.facebook.profileImageURL,
                proveedor : authData.provider,
                carpeta : authData.provider + ' ' + authData.facebook.displayName,
                fec_reg : Firebase.ServerValue.TIMESTAMP,
                fec_con : Firebase.ServerValue.TIMESTAMP,
                serial : $scope.aleatorio,
                suspendido : 'no',
                online : $scope.online
            });
            notie.alert(4, 'Iniciando Sesión', 3);
        }).then(function(authData) {
            $location.path('#/');
        }).catch(function(error) {
            console.error("Fallo la autenticacion:", error);
            $location.path('#/login');
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
            $scope.online = true;
            ref.child('usuarios').child(authData.uid).update({
                usuario : authData.google.displayName,
                img     : authData.google.profileImageURL,
                proveedor : authData.provider,
                carpeta : authData.provider + ' ' + authData.google.displayName,
                fec_reg : Firebase.ServerValue.TIMESTAMP,
                fec_con : Firebase.ServerValue.TIMESTAMP,
                serial : $scope.aleatorio,
                suspendido : 'no',
                online : $scope.online
            });
            notie.alert(4, 'Iniciando Sesión', 3);
        }).then(function(authData) {
            $location.path('#/');
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
            $scope.online = true;
            ref.child('usuarios').child(authData.uid).update({
                usuario : authData.twitter.displayName,
                img     : authData.twitter.profileImageURL,
                proveedor : authData.provider,
                carpeta : authData.provider + ' ' + authData.twitter.displayName,
                fec_reg : Firebase.ServerValue.TIMESTAMP,
                fec_con : Firebase.ServerValue.TIMESTAMP,
                serial : $scope.aleatorio,
                suspendido : 'no',
                online : $scope.online
            });
            notie.alert(4, 'Iniciando Sesión', 3);
        }).then(function(authData) {
            $location.path('#/');
        }).catch(function(error) {
          console.error("Fallo la autenticacion:", error);
          $location.path('/');
        });
    };
})

/* Controlador Registro*/
myApp.controller ('registroController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.usuario = null;
    $scope.email = null;
    $scope.password = null;
    $scope.repassword = null;
    $scope.coinciden = true;

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            console.log(authData);
            $scope.online = true;
            $location.path('#/');
        } else {
            $scope.online = false;
        }
    })


    $scope.registrar = function (email, password) {
        var i;
        var text = "";
        var possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ ){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          $scope.aleatorio = text;
        }

        if ($scope.password === $scope.repassword){
            $scope.authObj.$createUser({
                email: $scope.email,
                password: $scope.password
              }).then(function(userData) {
                $scope.authObj.$authWithPassword({
                  email: $scope.email,
                  password: $scope.password
                }).then(function(authData) {
                  // Guarda Datos
                  $scope.online = true;
                  console.log($scope.online);
                  ref.child('usuarios').child(userData.uid).update({
                      usuario : $scope.usuario,
                      email   : $scope.email,
                      img     : authData.password.profileImageURL,
                      proveedor : authData.provider,
                      carpeta : authData.provider + ' ' + $scope.usuario,
                      fec_reg : Firebase.ServerValue.TIMESTAMP,
                      fec_con : Firebase.ServerValue.TIMESTAMP,
                      serial : $scope.aleatorio,
                      suspendido : 'no',
                      online : $scope.online
                  });
                }).then(function(authData) {
                  $location.path('#/');
                }).catch(function(error) {
                  console.error("Datos incorrectos:", error);
                  $scope.online = false;
                  $location.path('#/registro');
                });
              }).catch(function(error) {
                console.error("Error: ", error);
              });
        }else{
            $scope.coinciden = false;
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
            $scope.online = true;
            ref.child('usuarios').child(authData.uid).update({
                usuario : authData.facebook.displayName,
                email : '',
                img     : authData.facebook.profileImageURL,
                proveedor : authData.provider,
                carpeta : authData.provider + ' ' + authData.facebook.displayName,
                fec_reg : Firebase.ServerValue.TIMESTAMP,
                fec_con : Firebase.ServerValue.TIMESTAMP,
                serial : $scope.aleatorio,
                suspendido : 'no',
                online : $scope.online
            });
        }).then(function(authData) {
          $location.path('#/');
        }).catch(function(error) {
          console.error("Fallo la autenticacion:", error);
          $location.path('#/registro');
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
            $scope.online = true;
            ref.child('usuarios').child(authData.uid).update({
                usuario : authData.google.displayName,
                email : '',
                img     : authData.google.profileImageURL,
                proveedor : authData.provider,
                carpeta : authData.provider + ' ' + authData.google.displayName,
                fec_reg : Firebase.ServerValue.TIMESTAMP,
                fec_con : Firebase.ServerValue.TIMESTAMP,
                serial : $scope.aleatorio,
                suspendido : 'no',
                online : $scope.online
            });
        }).then(function(authData) {
            $location.path('#/');
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
            $scope.online = true;
            ref.child('usuarios').child(authData.uid).set({
                usuario : authData.twitter.displayName,
                email : '',
                img     : authData.twitter.profileImageURL,
                proveedor : authData.provider,
                carpeta : authData.provider + ' ' + authData.twitter.displayName,
                fec_reg : Firebase.ServerValue.TIMESTAMP,
                fec_con : Firebase.ServerValue.TIMESTAMP,
                serial : $scope.aleatorio,
                suspendido : 'no',
                online : $scope.online
            });
        }).then(function(authData) {
            $location.path('#/');
        }).catch(function(error) {
          console.error("Fallo la autenticacion:", error);
          $location.path('/');
        });
    };

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth()
        $location.path('#/');
    }

})
/* Controlador Crear*/
myApp.controller ('crearController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
    $scope.uploadFile = function(){
        var sFileName = $("#nombreControl").val();
        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions.length; j++) {
                var sCurExtension = _validFileExtensions[j];
                if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    var filesSelected = document.getElementById("nombreControl").files;
                    if (filesSelected.length > 0)
                    {
                        var fileToLoad = filesSelected[0];
                 
                        var fileReader = new FileReader();
                 
                        fileReader.onload = function(fileLoadedEvent) 
                        {
                            var textAreaFileContents = document.getElementById
                            (
                                "textAreaFileContents"
                            );
                           
                            //console.log(fileLoadedEvent.target.result);
                            var refimg = $firebaseArray(new Firebase("https://geekpet.firebaseio.com/usuarios/"+$scope.myid+"/imagenes"));
            
                            refimg.$add(
                                {
                                    fec_sub : Firebase.ServerValue.TIMESTAMP,
                                    fotos : fileLoadedEvent.target.result
                                }
                            );
                        };
                 
                        fileReader.readAsDataURL(fileToLoad);
                    }
                    break;
                }
            }

            if (!blnValid) {
                toastr.error('Archivo de imagen no valida');
                console.log("falso");
                return false;
            }
        }
     
        return true;
    }

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.myid = authData.uid;
            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online : false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                }
            });

            $scope.nombred = null;
            $scope.obs = "privada";
            $scope.disprecio = null;

            var fotos = new Firebase("https://geekpet.firebaseio.com/usuarios/"+$scope.myid+"/imagenes");
            $scope.misfotos = $firebaseArray(fotos);

            var refArray = $firebaseArray(new Firebase("https://geekpet.firebaseio.com/usuarios/"+$scope.myid+"/design"));
            
            
                var lista = new Firebase("https://geekpet.firebaseio.com/usuarios/" + authData.uid + "/design");
                $scope.enviardis = function (){
                    if ($scope.nombred == null && $scope.disprecio == null) {
                        toastr.error('Coloque el nombre del diseño y el precio');
                    }else if ($scope.nombred == null){
                        toastr.error('Coloque el nombre del diseño');
                    }else if($scope.disprecio == null){
                        toastr.error('Coloque el precio');
                    }else if($scope.disprecio < 58 || $scope.disprecio > 90){
                        toastr.error('El precio debe ser mayor de S/.58 y menor de S/.90');
                    }else{
                        //var json = JSON.stringify(canvas);
                        $('#shirtDiv').html2canvas({
                            onrendered: function (canvas) {
                            //Set hidden field's value to image data (base-64 string)
                                $('#img_val').val(canvas.toDataURL("image/png"));

                                var imgbase = $('#img_val').val(canvas.toDataURL("image/png"));
                                $scope.captura = imgbase[0].defaultValue;
                                refArray.$add(
                                    {
                                      nombre      : $scope.nombred,
                                      precio      : $scope.disprecio,
                                      creacion    : Firebase.ServerValue.TIMESTAMP,
                                      observacion : $scope.obs,
                                      captura     : $scope.captura
                                    }
                                );
                            }
                        });

                        lista.on("value", function(snapshot) {
                            $scope.totaldis = snapshot.numChildren();
                            ref.child('usuarios').child(authData.uid).update(
                                {
                                  totaldis: $scope.totaldis + 1
                                }
                            );
                        });
                        $scope.texto  = "";
                        toastr.success('Guardado Correctamete"');
                    }
                }

                $scope.eliminardis = function (miid){
                    var misimg = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/imagenes/"+miid);
                    var r = confirm("Deseas eliminar esta foto");
                    if (r == true) {
                        misimg.remove();
                    }
                }

        } else {
            $scope.online = false;
            $location.path('#/');
        }
    })

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth()
        $location.path('#/');
    }

})

/* Directiva Foto en Prenda */
.directive("myCoolDirective", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            $(elem).click(function(e) {
                
                var el = e.target;
                /*temp code*/
                var offset = 50;
                var left = fabric.util.getRandomInt(0 + offset, 200 - offset);
                var top = fabric.util.getRandomInt(0 + offset, 400 - offset);
                var angle = fabric.util.getRandomInt(-20, 40);
                var width = fabric.util.getRandomInt(30, 50);
                var opacity = (function(min, max){ return Math.random() * (max - min) + min; })(0.5, 1);
                
                fabric.Image.fromURL(el.src, function(image) {
                      image.set({
                        left: left,
                        top: top,
                        angle: 0,
                        padding: 10,
                        cornersize: 10,
                        hasRotatingPoint:true
                      });
                      image.scale(getRandomNum(0.1, 0.25)).setCoords();
                      canvas.add(image);
                });

            });
        }
    }
});

/* Controlador Productos*/
myApp.controller ('productosController', function($scope, toastr, $location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    var index = new Firebase("https://geekpet.firebaseio.com/usuarios");
    $scope.inicio = $firebaseArray(index);

    $scope.cantidad = [1, 2, 3, 4, 5, 6, 7, 8];

    $scope.cargarMas = function() {
        var last = $scope.cantidad[$scope.cantidad.length - 1];
        for(var i = 1; i <= 8; i++) {
         $scope.cantidad.push(last + i);
        }
    };

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));
            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online : false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                }
            });
        } else {
            $scope.online = false;
        }
    })

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth()
        $location.path('#/');
    }

})

/* Controlador Buscar*/
myApp.controller ('buscarController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    var indexusu = new Firebase("https://geekpet.firebaseio.com/usuarios");
    $scope.usu = $firebaseArray(indexusu);

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));
            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online : false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                }
            });
        } else {
            $scope.online = false;
        }
    })

    $scope.buscar = null;
  
    $scope.mostrar = false;
    $scope.press = function() {
        if ($scope.buscar == "") {
        $scope.mostrar = false;
        }else{
        $scope.mostrar = true;
        }
    }

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth()
        $location.path('#/');
    }

})

/* Controlador Usuario*/
myApp.controller ('usuController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject, $routeParams) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    var listArray = $firebaseArray(ref);
    $scope.authObj = $firebaseAuth(ref);


    var array = new Firebase("https://geekpet.firebaseio.com/usuarios");
    $scope.usua = $firebaseArray(array);

    array.on("value", function(todosUsuarios) {
      todosUsuarios.forEach(function(usuarios) {
        // Will be called with a messageSnapshot for each child under the /messages/ node
        var mail = usuarios.child("email").val();  // e.g. "barney"
        if (mail == $routeParams.name){
            $scope.conectado = usuarios.child("online").val();
            if ($scope.conectado == true){
                $scope.mensaje = "Ahora";
            }else{
                $scope.mensaje = usuarios.child("fec_con").val();
            }
        }
      });
    });

    $scope.num = $routeParams.name;

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));
            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online : false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                }
            });
        } else {
            $scope.online = false;
        }
    })

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth()
        $location.path('#/');
    }
})

/* Controlador Compras*/
myApp.controller ('comprasController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));
            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online : false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                }
            });
            $scope.talla = '--Seleccione--';
            $scope.distrito = null;
            $scope.direccion = null;

            var refUsu = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/pedidos");
            var refArray = $firebaseArray(refUsu);
            ngCart.setTaxRate(0);
            ngCart.setShipping(0);
            $scope.items = ngCart.getItems();
            $scope.total = ngCart.totalCost();

            $scope.actualizar = function(){

                $scope.pUsuario = document.getElementById("pUsuario").value;
                $scope.pEmail = document.getElementById("pEmail").value;
                $scope.pTelefono = document.getElementById("pTelefono").value;
                $scope.pSelect = document.getElementById("select").value;
                $scope.Pdireccion = document.getElementById("Pdireccion").value;

                if (authData.provider === 'password'){
                    document.getElementById("pEmail").disabled = true;
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        telefono  : $scope.pTelefono
                    })
                }else{
                    document.getElementById("pEmail").disabled = false;
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        email     : $scope.pEmail,
                        telefono  : $scope.pTelefono
                    })
                }
                

                var i;

                for (i = 0; i < $scope.items.length; i++) { 
                    var e;
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for( var e=0; e < 10; e++ ){
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                        $scope.aleatorio = text;
                    }

                    refArray.$add(
                            {
                                producto : {
                                    foto_producto     : $scope.items[i]._id,
                                    nombre_producto   : $scope.items[i]._name,
                                    talla             : $scope.talla,
                                    precio_producto   : $scope.items[i]._price,
                                    cantidad_producto : $scope.items[i]._quantity,
                                    subtotal          : $scope.items[i]._price * $scope.items[i]._quantity
                                },
                                telefono     : $scope.pTelefono,
                                distrito     : $scope.pSelect,
                                direccion    : $scope.Pdireccion,
                                aleatorio    : $scope.aleatorio,
                                estado       : 'Pendiente',
                                fecha_pedido : Firebase.ServerValue.TIMESTAMP,
                                fecha_listo : 0,
                                fecha_recibido : 0
                            }
                    ).then(function(refUsu) {
                        $scope.mensaje = true;
                    });
                }

                if ($scope.mensaje = true) {
                    toastr.success('Compra satifactoria, Nos pondremos al contacto con usted');
                    //console.log(ngCart.empty());
                    ngCart.empty();
                    $location.path('#/');
                }

            }
        } else {
            $scope.online = false;
        }
    })

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth()
        $location.path('#/');
    }
})

/* Controlador General*/
myApp.controller ('generalController', function($scope, toastr, $location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));

            var lista = new Firebase("https://geekpet.firebaseio.com/usuarios/" + authData.uid + "/design");
            $scope.dis = $firebaseArray(lista);

            lista.on("value", function(snapshot) {
              var data = snapshot.val();
            });

            lista.on("value", function(snapshot) {
              $scope.totaldis = snapshot.numChildren();
            });


            var pedidos = new Firebase("https://geekpet.firebaseio.com/usuarios/" + authData.uid + "/pedidos");
            $scope.pedid = $firebaseArray(pedidos);
            
            pedidos.on("value", function(snapshot) {
              $scope.totalped = snapshot.numChildren();
            });


            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online : false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                }
            });

            $scope.actualizar = function(idDis) {
                $scope.disnom = document.getElementById("disnom" + idDis).value;
                $scope.disprecio = document.getElementById("disprecio" + idDis).value;
                $scope.disestado = document.getElementById("estado" + idDis).value;
                var miDis = new Firebase("https://geekpet.firebaseio.com/usuarios/" + authData.uid + "/design/" + idDis + "/");

                if ($scope.disprecio > 58 && $scope.disprecio < 90) {
                    var completo = function(error) {
                      if (error) {
                        toastr.error('Error al Actualizar');
                      } else {
                        toastr.success('Actualizado Correctamente');
                      }
                    };

                    miDis.update(
                                    { 
                                        nombre      : $scope.disnom,
                                        observacion : $scope.disestado,
                                        precio      : $scope.disprecio
                                    },
                                    completo
                                );
                }else{
                    toastr.error('El precio debe ser mayor de 58 y menor de 90');
                    var precio = new Firebase("https://geekpet.firebaseio.com/usuarios/" + authData.uid + "/design/" + idDis + "/precio/");
                    precio.on("value", function(snapshot) {
                        var data = snapshot.val();
                        document.getElementById("disprecio" + idDis).value = data;
                    });
                }
            }

            $scope.eliminar = function(idDis) {
                var miDis = new Firebase("https://geekpet.firebaseio.com/usuarios/" + authData.uid + "/design/" + idDis + "/");

                var completo = function(error) {
                    if (error) {
                        toastr.error('Fallo la Eliminación');
                    } else {
                        toastr.success('Eliminado Correctamente');
                    }
                };
                miDis.remove(completo);
            }
            
            if (authData.provider === 'password'){
                $scope.espwd = true;
            }else{
                $scope.espwd = false;
            }
        } else {
            $scope.online = false;
        }
    })

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth()
        $location.path('#/');
    }
})

/* Controlador Perfil*/
myApp.controller ('perfilController', function($scope, toastr, $location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));

            var lista = new Firebase("https://geekpet.firebaseio.com/usuarios/" + authData.uid + "/design");
            $scope.dis = $firebaseArray(lista);

            lista.on("value", function(snapshot) {
              var data = snapshot.val();
            });

            //Query
            lista.on("value", function(snapshot) {
              $scope.totaldis = snapshot.numChildren();
            });

            /*lista.orderByChild("observacion").equalTo("privada").on("child_added", function(snapshot) {
              $scope.totalpri = snapshot.child("observacion").val();
            });

            lista.orderByChild("observacion").equalTo("publica").on("child_added", function(snapshot) {
              $scope.totalpub = snapshot.child("observacion").val();
            });*/

            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online : false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                }
            });

            
            if (authData.provider === 'password'){
                $scope.espwd = true;
            }else{
                $scope.espwd = false;
            }
        } else {
            $scope.online = false;
        }
    })

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth()
        $location.path('#/');
    }
})


/* Controlador Vista General*/
myApp.controller ('confController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));
            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online : false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                }
            });

            var lista = new Firebase("https://geekpet.firebaseio.com/usuarios/" + authData.uid + "/design");
            lista.on("value", function(snapshot) {
              $scope.totaldis = snapshot.numChildren();
            });
            
            if (authData.provider === 'password'){
                $scope.espwd = true;
            }else{
                $scope.espwd = false;
            }
        } else {
            $scope.online = false;
        }
    })

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth()
        $location.path('#/');
    }
})

/* Controlador Editar Perfil*/
myApp.controller ('editarpController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));

            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online : false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                }
            });

            if (authData.provider === 'password'){
                    $scope.espwd = true;
                    document.getElementById("mEmail").disabled = true;
            }else{
                $scope.espwd = false;
                document.getElementById("mEmail").disabled = false;
            }

            $scope.editarperfil = function () {
                $scope.email = document.getElementById("mEmail").value;
                $scope.telefono = document.getElementById("mTelefono").value;
                $scope.edad = parseInt(document.getElementById("mEdad").value);
                $scope.sexo = document.getElementById("mSexo").value;
                console.log($scope.email, $scope.telefono, $scope.edad, $scope.sexo);

                if (authData.provider === 'password'){
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        edad     : $scope.edad,
                        sexo     : $scope.sexo,
                        telefono : $scope.telefono
                    });
                    $location.path('#/configuracion');
                }else{
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        email    : $scope.email,
                        edad     : $scope.edad,
                        sexo     : $scope.sexo,
                        telefono : $scope.telefono
                    });
                    $location.path('#/configuracion');
                }
            }
        } else {
            $scope.online = false;
        }
    })

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth()
        $location.path('#/');
    }
})

/* Controlador Cambiar Contraseña*/
myApp.controller ('cambiarcController', function($scope, toastr, $location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.actualc = null;
    $scope.nuevac = null;
    $scope.repnuevac = null;

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.online = true;
            $scope.perfil = $firebaseObject(ref.child('usuarios').child(authData.uid));

            var susp = new Firebase("https://geekpet.firebaseio.com/usuarios/"+authData.uid+"/suspendido");
            susp.on('value', function(dataSnapshot) {
                suspValue = dataSnapshot.w.A;
                if (suspValue == 'si') {
                    ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
                        online :false
                    });
                    $scope.authObj.$unauth();
                    $location.path('#/');
                }
            });

            if (authData.provider === 'password'){
                $scope.espwd = true;
                $scope.actualizarc = function () {
                    if($scope.nuevac == $scope.repnuevac){
                        $scope.authObj.$changePassword({
                            email: authData.password.email,
                            oldPassword: $scope.actualc,
                            newPassword: $scope.nuevac
                        }).then(function() {
                            toastr.success('Inicie Sesión nuevamente con su nueva contraseña');
                            $scope.authObj.$unauth();
                            $location.path('#/');
                        }).catch(function(error) {
                          console.error("Error: ", error);
                        });
                    }else{
                        toastr.error('repita bien la nueva contraseña');
                    }
                }
            }else{
                $scope.espwd = false;
                $location.path('#/configuracion');
            }
        } else {
            $scope.online = false;
        }
    })

    $scope.logout = function () {
        ref.child('usuarios').child($scope.authObj.$getAuth().uid).update({
            online : false
        });
        $scope.authObj.$unauth();
        $location.path('#/');
    }
})

/* Controlador Login Admin*/
myApp.controller ('panloginController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $location.path('/panadmin');
        } else {
            $scope.online = false;
        }
    })

    $scope.email = null;
    $scope.password = null;

    $scope.login = function (email, password) {
        if ($scope.email == null && $scope.password == null) {
            toastr.error('Complete los campos');
        }else if($scope.email == null){
            toastr.error('Complete el campo email');
        }else if($scope.password == null){
            toastr.error('Complete el campo contraseña');
        }else if ($scope.email === 'admingeek@gmail.com') {
            $scope.authObj.$authWithPassword({
              email: $scope.email,
              password: $scope.password
            }).then(function(authData) {
                $location.path('/panadmin');
            }).catch(function(error) {
                toastr.error('Datos incorrectos');
            });
        }else{
            toastr.error('Usted no tiene permiso de ingresar');
            $scope.email = '';
            $scope.password = '';
        }
    };
})

/*Panel de Administracion*/

myApp.controller ('panadminController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);


    $scope.authObj.$onAuth(function(authData) {
        if (authData) {

        } else {
            $scope.online = false;
            $location.path('/panlogin');
        }
    })

    $scope.logout = function () {
        $scope.authObj.$unauth()
        $location.path('/panlogin');
    }

})

/*Administrador de Pedidos*/

myApp.controller ('adpedidosController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.users = $firebaseArray(ref);
            $scope.usuarios = $firebaseArray(ref.child('usuarios'));
            $scope.id = function(miid){
                var list = new Firebase("https://geekpet.firebaseio.com/usuarios/"+miid+"/pedidos");
                $scope.dise = $firebaseArray(list);
                //console.log($scope.dise);

                list.on("value", function(snapshot) {
                  var a = snapshot.numChildren();
                  //console.log(a);
                });
            }

            $scope.suspenderu = function(idusuario, proveedor){
                ref.child('usuarios').child(idusuario).update({
                    suspendido : 'si'
                });
            }

            $scope.activaru = function(idusuario, proveedor){
                ref.child('usuarios').child(idusuario).update({
                    suspendido : 'no'
                });
            }

        } else {
            $scope.online = false;
            $location.path('/panlogin');
        }
    })

    $scope.logout = function () {
        $scope.authObj.$unauth()
        $location.path('/panlogin');
    }

})


myApp.controller ('adusuariosController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject, $routeParams) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);


    $scope.authObj.$onAuth(function(authData) {
        if (authData) {

            var array = new Firebase("https://geekpet.firebaseio.com/usuarios");
            $scope.usua = $firebaseArray(array);

            array.on("value", function(todosUsuarios) {
              todosUsuarios.forEach(function(usuarios) {
                // Will be called with a messageSnapshot for each child under the /messages/ node
                var mail = usuarios.child("email").val();  // e.g. "barney"
                if (mail == $routeParams.nombre){
                    //console.log(usuarios.key());
                    var pedido = new Firebase("https://geekpet.firebaseio.com/usuarios/"+usuarios.key()+"/pedidos");
                    $scope.pedidos = $firebaseArray(pedido);


                    $scope.pendiente = function(idpedidos){
                        pedido.child(idpedidos).update({
                            estado : 'Pendiente'
                        });
                    }

                    $scope.listo = function(idpedidos){
                        pedido.child(idpedidos).update({
                            estado : 'Listo'
                        });
                    }


                    $scope.recibido = function(idpedidos){
                        pedido.child(idpedidos).update({
                            estado : 'Recibido'
                        });
                    }


                    $scope.conectado = usuarios.child("online").val();

                    if ($scope.conectado == true){
                        $scope.mensaje = "Ahora";
                    }else{
                        $scope.mensaje = usuarios.child("fec_con").val();
                    }
                }
              });
            });

            $scope.num = $routeParams.nombre;
        } else {
            $scope.online = false;
            $location.path('/panlogin');
        }
    })

    $scope.logout = function () {
        $scope.authObj.$unauth()
        $location.path('/panlogin');
    }

})


myApp.controller ('adestadisticasController', function($scope, toastr,$location, $http, ngCart, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://geekpet.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    var xd = new Firebase("https://geekpet.firebaseio.com/estadisticas/proveedores");
    /* Proveedores de logueo */
    var fb = new Firebase("https://geekpet.firebaseio.com/estadisticas/proveedores/facebook");
    var tw = new Firebase("https://geekpet.firebaseio.com/estadisticas/proveedores/twitter");
    var go = new Firebase("https://geekpet.firebaseio.com/estadisticas/proveedores/google");
    var nor = new Firebase("https://geekpet.firebaseio.com/estadisticas/proveedores/normal");

    /* Edades */
    var diecinueve = new Firebase("https://geekpet.firebaseio.com/estadisticas/edades/19");
    var veinte = new Firebase("https://geekpet.firebaseio.com/estadisticas/edades/20");
    var veintiuno = new Firebase("https://geekpet.firebaseio.com/estadisticas/edades/21");
    var veintidos = new Firebase("https://geekpet.firebaseio.com/estadisticas/edades/22");

    $scope.authObj.$onAuth(function(authData) {
        if (authData) {
            $scope.users = $firebaseArray(ref);
            $scope.usuarios = $firebaseArray(ref.child('usuarios'));


            xd.on("value", function(data){
                $scope.facebook = data.child("facebook").val();
                $scope.twitter  = data.child("twitter").val();
                $scope.google   = data.child("google").val();
                $scope.normal   = data.child("normal").val();

                    Highcharts.setOptions({
                        colors: ['#009688', '#1976D2', '#03A9F4', '#F44336']
                    });
                    $('#proveedor').highcharts({
                        exporting: {
                            chartOptions: { // specific options for the exported image
                                plotOptions: {
                                    series: {
                                        dataLabels: {
                                            enabled: true,
                                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                            style: {
                                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                            }
                                        },
                                    }
                                }
                            },
                            scale: 3,
                            fallbackToExportServer: false,
                            filename: 'grafico',
                            type: "image/png"
                        },
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Seccion de reportes de proveedores de logueo'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: true
                            }
                        },
                        series: [{
                            name: 'Total',
                            colorByPoint: true,
                            data: [{
                                name : $scope.normal.nombre,
                                y    : $scope.normal.total
                            }, {
                                name : $scope.facebook.nombre,
                                y    : $scope.facebook.total
                                //sliced: true,
                                //selected: true
                            }, {
                                name : $scope.twitter.nombre,
                                y    : $scope.twitter.total
                            }, {
                                name : $scope.google.nombre,
                                y    : $scope.google.total
                            },]
                        }]
                    })
            })
            
            


            /* Edades */
            $scope.diecinueve = $firebaseObject(diecinueve);
            $scope.veinte = $firebaseObject(veinte);
            $scope.veintiuno = $firebaseObject(veintiuno);
            $scope.veintidos = $firebaseObject(veintidos);

            $scope.edad = function () {
                $('#edad').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Seccion de reportes de las edades de los usuarios'
                    },
                    xAxis: {
                        categories: [
                            $scope.diecinueve.edad,
                            $scope.veinte.edad,
                            $scope.veintiuno.edad,
                            $scope.veintidos.edad
                        ],
                        crosshair: true
                    },
                    tooltip: {
                        pointFormat: '<td style="padding:0"><b>Total: {point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Edades',
                        data: [$scope.diecinueve.total, $scope.veinte.total, $scope.veintiuno.total, $scope.veintidos.total]
                    }]
                })
            }

        } else {
            $scope.online = false;
            $location.path('/panlogin');
        }
    })


    $scope.logout = function () {
        $scope.authObj.$unauth()
        $location.path('/panlogin');
    }

})


myApp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});