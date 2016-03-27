/*
// Step 3 : Add Object
// Parameter 1 : radiusTop
// Parameter 2 : radiusBottom
// Parameter 3 : segmentsRadius - Height of cylinder
// Parameter 4 : segmentsHeight
// Parameter 5 : openEnded cylinder
conegeometry = new THREE.CylinderGeometry(1, 0, 1, 30, 0, false) ; // Cone
conematerial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
conemesh = new THREE.Mesh( conegeometry, conematerial ) ;
GrabberXW.threejs.scene.add( conemesh );
*/
var GrabberXW = {
    initialise: function(config){
        GrabberXW.config = config;
        GrabberXW.threejs.scene = new THREE.Scene();
        GrabberXW.threejs.camera = new THREE.PerspectiveCamera( 75, (window.innerWidth-GrabberXW.config.sidebarSize) / window.innerHeight, 0.1, 1000 );
        GrabberXW.threejs.renderer = new THREE.WebGLRenderer();
        GrabberXW.threejs.renderer.setSize( window.innerWidth-300, window.innerHeight );
        GrabberXW.threejs.renderer.domElement.setAttribute("id", "GrabberXW_Render");
        GrabberXW.threejs.renderer.shadowMap.enabled = true;
        document.body.appendChild(GrabberXW.threejs.renderer.domElement );
        GrabberXW.managers.resize = new GrabberXW.util.eventmanager();
        GrabberXW.managers.resize.register(function(){
            GrabberXW.threejs.renderer.setSize(window.innerWidth-GrabberXW.config.sidebarSize, window.innerHeight);
            GrabberXW.threejs.camera.aspect = (window.innerWidth-GrabberXW.config.sidebarSize) / window.innerHeight;
            GrabberXW.threejs.camera.updateProjectionMatrix();
        });
        
        GrabberXW.threejs.camera.position.z = 40;
        
        var geometry = new THREE.BoxGeometry( 30, 30, 30 );
        var material = new THREE.MeshBasicMaterial({
            color: 0xffa223
        });
        cube = new THREE.Mesh( geometry, material );
        cube.castShadow = true;
        cube.receiveShadow = true;
        GrabberXW.threejs.scene.add( cube );

        GrabberXW.threejs.scene.add(GrabberXW.threejs.helpers.constructAxisMarker({
            length: 5,
            origin: [0, 0, 0]
        }));
 
light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        light.position.set(0, 50, 0);
        light.castShadow = true;
GrabberXW.threejs.scene.add( light );

        
        GrabberXW.threejs.controls = new THREE.OrbitControls( GrabberXW.threejs.camera, GrabberXW.threejs.renderer.domElement );
        GrabberXW.threejs.controls.enableDamping = true;
        GrabberXW.threejs.controls.dampingFactor = 0.9;
        GrabberXW.threejs.controls.enableZoom = true;
        
        GrabberXW.threejs.loop();
    },
    threejs: {
        loop: function(){
            window.requestAnimationFrame(GrabberXW.threejs.loop);
            GrabberXW.threejs.renderer.render(GrabberXW.threejs.scene, GrabberXW.threejs.camera);
            GrabberXW.threejs.controls.update();
        },
        helpers: {
            constructAxisMarker: function(config){
                function buildAxis( src, dst, colorHex) {
                    var geom = new THREE.Geometry(),
                        mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
                    geom.vertices.push(src.clone());
                    geom.vertices.push(dst.clone());
                    geom.computeLineDistances();
                    var axis = new THREE.Line( geom, mat, THREE.LinePieces );
                    return axis;
                }
                return GrabberXW.threejs.helpers.objectPopulater(
                    new THREE.Object3D(),
                    buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3( config.length, 0, 0 ), 0xFF0000),
                    buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3( 0, config.length, 0 ), 0x00FF00),
                    buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3( 0, 0, config.length ), 0x0000FF)
                );
            },
            objectPopulater: function(){
                var args = Array.prototype.slice.call(arguments);
                args.forEach(function(v, i, e){
                    if (i !== 0) args[0].add(v);
                });
                return args[0];
            }
        }
    },
    managers: {
        
    },
    util: {
        eventmanager: function(){
            this.events = [];
            this.register = function(event){
                this.events.push(event);
            };
            this.call = function(){
                this.events.forEach(function(v, i, e){
                    v();
                });
            };
        }
    }
}
window.onload = function(){
    GrabberXW.initialise({
        sidebarSize: 300
    });
};
window.onresize = function(){GrabberXW.managers.resize.call()};