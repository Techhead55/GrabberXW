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
        });
        
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 , wireframe: true} );
        cube = new THREE.Mesh( geometry, material );
        GrabberXW.threejs.scene.add( cube );

        GrabberXW.threejs.camera.position.z = 5;
        
        GrabberXW.threejs.loop();
    },
    threejs: {
        loop: function(){
            window.requestAnimationFrame(GrabberXW.threejs.loop);
            GrabberXW.threejs.renderer.render(GrabberXW.threejs.scene, GrabberXW.threejs.camera);
            //console.log("rendering");
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
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