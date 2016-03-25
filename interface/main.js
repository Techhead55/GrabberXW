var GrabberXW = {
    initialise: function(){
        GrabberXW.threejs.scene = new THREE.Scene();
        GrabberXW.threejs.camera = new THREE.PerspectiveCamera( 75, (window.innerWidth-300) / window.innerHeight, 0.1, 1000 );
        GrabberXW.threejs.renderer = new THREE.WebGLRenderer();
        GrabberXW.threejs.renderer.setSize( window.innerWidth-300, window.innerHeight );
        GrabberXW.threejs.renderer.domElement.setAttribute("id", "GrabberXW_Render");
        document.body.appendChild(GrabberXW.threejs.renderer.domElement );
        GrabberXW.taskmanager.resize.register(function(){
            GrabberXW.threejs.renderer.setSize(window.innerWidth-300, window.innerHeight);
        });
    },
    threejs: {
        
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
    GrabberXW.initialise();
};
window.onresize = GrabberXW.taskmanager.resize.call;