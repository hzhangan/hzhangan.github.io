var scene, camera, renderer, clock, deltaTime, totalTime;
var arToolkitSource, arToolkitContext;
var p001, p002, p003, p004, p005, p006;

init();
animate();

function init() {

	///////CREACION DE UNA ESCENA///////////////////
	scene = new THREE.Scene();

	let light = new THREE.PointLight(0xffffff, 1, 100); //creo nueva luz 
	light.position.set(0, 4, 4); //indico la posicion de la luz 
	light.castShadow = true; //activo la capacidad de generar sombras.
	scene.add(light); //agrego la luz a mi escena    

	///////CREACION DE UNA LUCES///////////////////
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

	///////CREACION DE UNA CAMARA///////////////////
	camera = new THREE.Camera();
	scene.add(camera);


	///////CREACION DEL RENDERER///////////////////
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});

	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize(1920, 1080);
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	document.body.appendChild(renderer.domElement);

	///////CREACION DE UN COUNTER///////////////////
	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;

	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////

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
		onResize()
	});

	// handle resize event
	window.addEventListener('resize', function () {
		onResize()
	});

	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////	

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para.dat',
		detectionMode: 'mono'
	});

	// copy projection matrix to camera when initialization complete
	arToolkitContext.init(function onCompleted() {
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
	});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	//HAIYING
	p001 = new THREE.Group();
	p001.name = 'marker1';
	scene.add(p001);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, p001, {
		type: 'pattern',
		patternUrl: "data/haiying.patt",
	})

	let meme001 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader001 = new THREE.TextureLoader();
	let texture001 = loader001.load('./images/haiying.png')
	let material001 = new THREE.MeshBasicMaterial({map:texture001});

	let foto001 = new THREE.Mesh(meme001, material001);
	foto001.rotation.x = -Math.PI / 2;
	p001.add(foto001);

	//CONSTANZA
	p002 = new THREE.Group();
	p002.name = 'marker2';
	scene.add(p002);
	let markerControls2 = new THREEx.ArMarkerControls(arToolkitContext, p002, {
		type: 'pattern',
		patternUrl: "data/constanza.patt",
	})

	let meme002 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader002 = new THREE.TextureLoader();
	let texture002 = loader002.load('./images/constanza.png')
	let material002 = new THREE.MeshBasicMaterial({map:texture002});

	let foto002 = new THREE.Mesh(meme002, material002);
	foto002.rotation.x = -Math.PI / 2;
	p002.add(foto002);

	//IGNACIO
	p003 = new THREE.Group();
	p003.name = 'marker3';
	scene.add(p003);
	let markerControls3 = new THREEx.ArMarkerControls(arToolkitContext, p003, {
		type: 'pattern',
			patternUrl: "data/kako.patt",
	})
	
	let meme003 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader003 = new THREE.TextureLoader();
	let texture003 = loader003.load('./images/kako.png')
	let material003 = new THREE.MeshBasicMaterial({map:texture003});
	
	let foto003 = new THREE.Mesh(meme003, material003);
	foto003.rotation.x = -Math.PI / 2;
	p003.add(foto003);

	//NICOLÁS
	p004 = new THREE.Group();
	p004.name = 'marker4';
	scene.add(p004);
	let markerControls4 = new THREEx.ArMarkerControls(arToolkitContext, p004, {
		type: 'pattern',
			patternUrl: "data/nicolas.patt",
	})
	
	let meme004 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader004 = new THREE.TextureLoader();
	let texture004 = loader004.load('./images/Nicolás.png')
	let material004 = new THREE.MeshBasicMaterial({map:texture004});
	
	let foto004 = new THREE.Mesh(meme004, material004);
	foto004.rotation.x = -Math.PI / 2;
	p004.add(foto004);	

	//JUAN CARLOS
	p005 = new THREE.Group();
	p005.name = 'marker5';
	scene.add(p005);
	let markerControls5 = new THREEx.ArMarkerControls(arToolkitContext, p005, {
		type: 'pattern',
		patternUrl: "data/juanca.patt",
	})

	let meme005 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader005 = new THREE.TextureLoader();
	let texture005 = loader005.load('./images/juancarlos.png')
	let material005 = new THREE.MeshBasicMaterial({map:texture005});

	let foto005 = new THREE.Mesh(meme005, material005);
	foto005.rotation.x = -Math.PI / 2;
	p005.add(foto005);

	//CAMILIA
	p006 = new THREE.Group();
	p006.name = 'marker5';
	scene.add(p006);
	let markerControls6 = new THREEx.ArMarkerControls(arToolkitContext, p006, {
		type: 'pattern',
		patternUrl: "data/camila.patt",
	})

	let meme006 = new THREE.PlaneBufferGeometry(1,1.5,6,6);
	let loader006 = new THREE.TextureLoader();
	let texture006 = loader006.load('./images/camila.png')
	let material006 = new THREE.MeshBasicMaterial({map:texture006});

	let foto006 = new THREE.Mesh(meme006, material006);
	foto006.rotation.x = -Math.PI / 2;
	p006.add(foto006);	
}


///////automatico///////////////////////

function update() {
	// update artoolkit on every frame
	if (arToolkitSource.ready !== false)
		arToolkitContext.update(arToolkitSource.domElement);
}


function render() {
	renderer.render(scene, camera);
}


function animate() {
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}