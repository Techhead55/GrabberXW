//http://soledadpenades.com/articles/three-js-tutorials/drawing-the-coordinate-axes/
function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat; 

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

}
function buildAxes( length ) {
        var axes = new THREE.Object3D();

        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

        return axes;

}
//{end}
var GrabberXW = {
    initialise: function(config){
        GrabberXW.config = config;
        GrabberXW.threejs.scene = new THREE.Scene();
        GrabberXW.threejs.camera = new THREE.PerspectiveCamera( 75, (window.innerWidth-GrabberXW.config.sidebarSize) / window.innerHeight, 0.1, 1000 );
        GrabberXW.threejs.renderer = new THREE.WebGLRenderer();
        GrabberXW.threejs.renderer.setSize( window.innerWidth-300, window.innerHeight );
        GrabberXW.threejs.renderer.domElement.setAttribute("id", "GrabberXW_Render");
        document.body.appendChild(GrabberXW.threejs.renderer.domElement );
        GrabberXW.taskmanager.resize.register(function(){
            GrabberXW.threejs.renderer.setSize(window.innerWidth-GrabberXW.config.sidebarSize, window.innerHeight);
            GrabberXW.threejs.camera.aspect = (window.innerWidth-GrabberXW.config.sidebarSize) / window.innerHeight;
            GrabberXW.threejs.camera.updateProjectionMatrix();
        });
        
        GrabberXW.threejs.camera.position.z = 5;
        
        var geometry = new THREE.BoxGeometry( 3, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 , wireframe: true} );
        cube = new THREE.Mesh( geometry, material );
        GrabberXW.threejs.scene.add( cube );

        sceneAxes = buildAxes(5);
        GrabberXW.threejs.scene.add( sceneAxes );
        
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
            //console.log("rendering");
        }
    },
    taskmanager: {
        resize: {
            events: [],
            register: function(event){
                GrabberXW.taskmanager.resize.events.push(event);
            },
            call: function(){
                GrabberXW.taskmanager.resize.events.forEach(function(v, i, e){
                    v();
                });
            }
        }
    }
}
window.onload = function(){
    GrabberXW.initialise({
        sidebarSize: 300
    });
};
window.onresize = GrabberXW.taskmanager.resize.call;