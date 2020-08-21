//declarar las variables de nuestra app. 
var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var mesh1, mesh2;

var markerRoot1;

var RhinoMesh, RhinoMesh2, RhinoMesh3, RhinoMesh4, RhinoMesh5, RhinoMesh6;

init(); // llamado de la funcion principal que se encarga de hacer casi  todo en la app
animate();

function init() {

    //////////THREE Setup////////////////
    // crear nuestra escena -  OBJETO.
    scene = new THREE.Scene(); //  crea un objeto escena.

    // 1. Crear Luces

    let light = new THREE.PointLight(0xffffff, 1, 100); //creo nueva luz 
    light.position.set(0, 4, 4); //indico la posicion de la luz 
    light.castShadow = true; //activo la capacidad de generar sombras.
    scene.add(light); //agrego la luz a mi escena 

    let lightSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        })
    );

    lightSphere.position.copy(light);
    scene.add(lightSphere);

    
    let ambientLight = new THREE.AmbientLight(0xcccccc); //creo las luz
    scene.add(ambientLight); //agrego la luz a mi escena. 

    // 2. Crear Camara

    camera = new THREE.Camera(); //creo objeto camara 
    scene.add(camera); // agrego camara a la escena


    // 3. Render: permite mostrar las cosas en 3d en la pantalla

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setClearColor(new THREE.Color('lightgrey'), 0);
    renderer.setSize(640, 480);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement); // agregarlo a nuestra pagina web


    // 5. Tiempo

    clock = new THREE.Clock();
    deltaTime = 0;
    totalTime = 0;

    ////////////////////////////////////////////////////////
    //AR Setup
    ///////////////////////////////////////////////////////

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
    });

    function onResize() {
        arToolkitSource.onResize()
        arToolkitSource.copySizeTo(renderer.domElement)
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
        }
    }


    arToolkitSource.init(function onReady() {
        onResize();
    });

    //agregamos un event listener
    window.addEventListener('resize', function () { onResize() });

    //Setup ArKitContext
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono'
    });

    arToolkitContext.init(function onCompleted() {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    /////////////////////////////////////////////////
    //Marker setup
    /////////////////////////////////////////////////

    markerRoot1 = new THREE.Group(); //creamos un grupo de objetos
    scene.add(markerRoot1); // agregamos el grupo a la escena. 

    //Creamos nuestro marcador 
    let markerControl = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {

        type: 'pattern', patternUrl: 'data/comida.patt',
    });

    /////////////////////////////////////////////////
    //GEOMETRY
    /////////////////////////////////////////////////

    //Creo una geometria cubo
    let geo1 = new THREE.CubeGeometry(.75, .75, .75); // crear la plantilla
    //creo material 
    let material1 = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }); //creamos el material 

    //Creo una geometria 
    let geo2 = new THREE.CubeGeometry(.75, .75, .75); // crear la plantilla
    //creo material 
    let material2 = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }); //creamos el material

    //////////////MESH1//////////////////////////////////////////
    //creo un mesh con la geometria y el material 
    mesh1 = new THREE.Mesh(geo1, material1); //nuestro mesh 
    //CAMBIO LA POSICION DE MI MESH 
    mesh1.position.y = 0.5;
    mesh1.position.z = -0.3;

    //activo el recibir y proyectar sombras en otros meshes
    mesh1.castShadow = true;
    mesh1.receiveShadow = true;

    //////////////MESH2//////////////////////////////////////////
    //creo un mesh con la geometria y el material 
    mesh2 = new THREE.Mesh(geo2, material2); //nuestro mesh 
    //CAMBIO LA POSICION DE MI MESH 
    mesh2.position.x = 0.75;
    mesh2.position.y = 1.0;
    //activo el recibir y proyectar sombras en otros meshes
    mesh2.castShadow = true;
    mesh2.receiveShadow = true;


    //markerRoot1.add(mesh1); //esta linea agrega el cubo a mi grupo y finalmente se puede ver en la escena 
    //markerRoot1.add(mesh2); //agregando el mesh 2 a mi escena

    ////////////////////PISO////////////////
    let floorGeometry = new THREE.PlaneGeometry(20, 20);
    let floorMaterial = new THREE.ShadowMaterial();
    floorMaterial.opacity = 0.25;

    let floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    markerRoot1.add(floorMesh);


    /////// OBJ IMPORT/////////////////////
    function onProgress(xhr) { console.log((xhr.loaded / xhr.total * 100) + "% loaded"); }
    function onError(xhr) { console.log("ha ocurrido un error") };

    //////OBJETO RHINO 1///////////////
    new THREE.MTLLoader()
        .setPath('data/models/')
        .load('tabla 1.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('data/models/')
                .load('tabla 1.obj', function (group) {
                    RhinoMesh = group.children[0];
                    RhinoMesh.material.side = THREE.DoubleSide;
                    RhinoMesh.scale.set(0.25, 0.25, 0.25);
                    RhinoMesh.castShadow = true;
                    RhinoMesh.receiveShadow = true;

                    markerRoot1.add(RhinoMesh);
                }, onProgress, onError);
        });

    //////OBJETO RHINO 2///////////////
    new THREE.MTLLoader()
        .setPath('data/models/')
        .load('salmon 2.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('data/models/')
                .load('salmon 2.obj', function (group) {
                    RhinoMesh2 = group.children[0];
                    RhinoMesh2.material.side = THREE.DoubleSide;
                    RhinoMesh2.scale.set(0.25, 0.25, 0.25);
                    RhinoMesh2.castShadow = true;
                    RhinoMesh2.receiveShadow = true;

                    markerRoot1.add(RhinoMesh2);
                }, onProgress, onError);
        });

     //////OBJETO RHINO 3///////////////
    new THREE.MTLLoader()
    .setPath('data/models/')
    .load('salmon 3.mtl', function (materials) {
        materials.preload();
        new THREE.OBJLoader()
            .setMaterials(materials)
            .setPath('data/models/')
            .load('salmon 3.obj', function (group) {
                RhinoMesh3 = group.children[0];
                RhinoMesh3.material.side = THREE.DoubleSide;
                RhinoMesh3.scale.set(0.25, 0.25, 0.25);
                RhinoMesh3.castShadow = true;
                RhinoMesh3.receiveShadow = true;

                markerRoot1.add(RhinoMesh3);
            }, onProgress, onError);
    });

    //////OBJETO RHINO 4///////////////
    new THREE.MTLLoader()
        .setPath('data/models/')
        .load('arroz 4.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('data/models/')
                .load('arroz 4.obj', function (group) {
                    RhinoMesh4 = group.children[0];
                    RhinoMesh4.material.side = THREE.DoubleSide;
                    RhinoMesh4.scale.set(0.25, 0.25, 0.25);
                    RhinoMesh4.castShadow = true;
                    RhinoMesh4.receiveShadow = true;

                    markerRoot1.add(RhinoMesh4);
                }, onProgress, onError);
        });

        //////OBJETO RHINO 5///////////////
        new THREE.MTLLoader()
        .setPath('data/models/')
        .load('alga 6.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('data/models/')
                .load('alga 6.obj', function (group) {
                    RhinoMesh5 = group.children[0];
                    RhinoMesh5.material.side = THREE.DoubleSide;
                    RhinoMesh5.scale.set(0.25, 0.25, 0.25);
                    RhinoMesh5.castShadow = true;
                    RhinoMesh5.receiveShadow = true;
    
                    markerRoot1.add(RhinoMesh5);
                }, onProgress, onError);
        });

            //////OBJETO RHINO 6///////////////
    new THREE.MTLLoader()
    .setPath('data/models/')
    .load('palta 7.mtl', function (materials) {
        materials.preload();
        new THREE.OBJLoader()
            .setMaterials(materials)
            .setPath('data/models/')
            .load('palta 7.obj', function (group) {
                RhinoMesh6 = group.children[0];
                RhinoMesh6.material.side = THREE.DoubleSide;
                RhinoMesh6.scale.set(0.25, 0.25, 0.25);
                RhinoMesh6.castShadow = true;
                RhinoMesh6.receiveShadow = true;

                markerRoot1.add(RhinoMesh6);
            }, onProgress, onError);
    });
}

function update() {
    //actualiza contenido de nuestra app AR
    if (arToolkitSource.ready !== false) {
        arToolkitContext.update(arToolkitSource.domElement);
    }
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    deltaTime = clock.getDelta();
    totalTime += deltaTime; // totalTime =  totalTime + deltaTime 
    update();
    render();
}