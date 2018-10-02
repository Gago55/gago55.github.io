    var banka;
	var camera,scene,renderer,projector;
	var geometry,geometrypl,material,material1,texture;
	var mesh1,mesh2,mesh3,mesh4,mesh5,mesh6,mesh7,mesh8,mesh9;
	var plane , line1, line2 ,line3 ,line4,line5,linegeomatry ,linegeomatry2 ,linegeomatry3 ,linegeomatry4 ,linegeomatry5 , linematerial;
	var sxmac= false;
	var havor= false;
	var in_pos1= false;
	var in_pos2= false;
	var in_pos3= false;
	var in_pos4= false;
	var in_pos5= false;
	var in_pos6= false;
	var in_pos7= false;
	var in_pos8= false;
	var in_pos9= false;
	var mousesxmac = false;
	var her;
	var v1 ,v2,v3,v4,v5,v6,v7,v8,v9;
	var boxes  = [];
	var lines  = [];
	var texture1= new THREE.TextureLoader().load('pic.png');
	var texture2= new THREE.TextureLoader().load('pic.png');
	var texture3= new THREE.TextureLoader().load('pic.png');
	var texture4= new THREE.TextureLoader().load('pic.png');
	var texture5= new THREE.TextureLoader().load('pic.png');
	var texture6= new THREE.TextureLoader().load('pic.png');
	var texture7= new THREE.TextureLoader().load('pic.png');
	var texture8= new THREE.TextureLoader().load('pic.png');
	var texture9= new THREE.TextureLoader().load('pic.png');
	var h1;
	var text;
	var text_alredy=false;

//	var clock = new THREE.Clock();
	var movingobject;
//	var inter = mouseMove();


	document.addEventListener('mousemove',mouseMove,false);
	document.addEventListener('mouseup',mouseUp,false);
	document.addEventListener('mousedown',mouseDown,false);
init();
animate();

function init()
{
    banka=document.getElementById("banka");     
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	banka.appendChild( renderer.domElement );
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10 );


	geometry=new THREE.BoxGeometry(1,1,0.1);
	geometrypl=new THREE.PlaneGeometry(window.innerWidth*1.2,1.2*window.innerHeight,0.5);
	material=new THREE.MeshNormalMaterial();
	
	texture1.repeat.x=1/3;
	texture1.repeat.y=1/3;
	texture1.offset.y=1/3 + 1/3;

	texture2.repeat.x=1/3;
	texture2.repeat.y=1/3;
	texture2.offset.x=1/3;
	texture2.offset.y=1/3 + 1/3;

	texture3.repeat.x=1/3;
	texture3.repeat.y=1/3;
	texture3.offset.x=1/3 + 1/3;
	texture3.offset.y=1/3 + 1/3;

	texture4.repeat.x=1/3;
	texture4.repeat.y=1/3;
	texture4.offset.y=1/3;

	texture5.repeat.x=1/3;
	texture5.repeat.y=1/3;
	texture5.offset.x=1/3;
	texture5.offset.y=1/3;

	texture6.repeat.x=1/3;
	texture6.repeat.y=1/3;
	texture6.offset.x=1/3 + 1/3;
	texture6.offset.y=1/3;

	texture7.repeat.x=1/3;
	texture7.repeat.y=1/3;

	texture8.repeat.x=1/3;
	texture8.repeat.y=1/3;
	texture8.offset.x=1/3;

	
	texture9.repeat.x=1/3;
	texture9.repeat.y=1/3;
	texture9.offset.x=1/3 + 1/3;

	
	
	material1=new THREE.MeshBasicMaterial({map:texture1});
	material2=new THREE.MeshBasicMaterial({map:texture2});
	material3=new THREE.MeshBasicMaterial({map:texture3});
	material4=new THREE.MeshBasicMaterial({map:texture4});
	material5=new THREE.MeshBasicMaterial({map:texture5});
	material6=new THREE.MeshBasicMaterial({map:texture6});
	material7=new THREE.MeshBasicMaterial({map:texture7});
	material8=new THREE.MeshBasicMaterial({map:texture8});
	material9=new THREE.MeshBasicMaterial({map:texture9});


	mesh1=new THREE.Mesh(geometry,material1);
	mesh2=new THREE.Mesh(geometry,material2);	
	mesh3=new THREE.Mesh(geometry,material3);
	mesh4=new THREE.Mesh(geometry,material4);	
	mesh5=new THREE.Mesh(geometry,material5);
	mesh6=new THREE.Mesh(geometry,material6);
	mesh7=new THREE.Mesh(geometry,material7);
	mesh8=new THREE.Mesh(geometry,material8);
	mesh9=new THREE.Mesh(geometry,material9);
	scene=new THREE.Scene();	
	plane=new THREE.Mesh(geometrypl,material);


	
/*	textureloder.wrapS = THREE.RepeatWrapping;
	textureloder.wrapT = THREE.RepeatWrapping;
	textureloder.repeat.set(0.5,0.5);*/


/*	material1 = new THREE.MeshBasicMaterial({
	
		map:texture
	})*/

	
	var tiv=Math.floor(Math.random() * 6) + 1  ;
	camera.position.z=10;
	scene.background = new THREE.Color( 0x966f69 );
	plane.position.z=-0.25;


	linematerial= new THREE.LineBasicMaterial({color:0xffffff});
	linegeomatry= new THREE.Geometry();
	linegeomatry2= new THREE.Geometry();
	linegeomatry3= new THREE.Geometry();
	linegeomatry4= new THREE.Geometry();
	linegeomatry5= new THREE.Geometry();
	linegeomatry.vertices.push(
		new THREE.Vector3(-1.5,1.5,0),
		new THREE.Vector3(1.5,1.5,0),
		new THREE.Vector3(1.5,-1.5,0),
		new THREE.Vector3(-1.5,-1.5,0),
		new THREE.Vector3(-1.5,1.5,0)
	);
	linegeomatry2.vertices.push(
		new THREE.Vector3(-1.5,0.5,0),
		new THREE.Vector3(1.5,0.5,0)
	);
	linegeomatry3.vertices.push(
		new THREE.Vector3(-1.5,-0.5,0),
		new THREE.Vector3(1.5,-0.5,0)
	);
	linegeomatry4.vertices.push(
		new THREE.Vector3(0.5,1.5,0),
		new THREE.Vector3(0.5,-1.5,0)
	);	linegeomatry5.vertices.push(
		new THREE.Vector3(-0.5,1.5,0),
		new THREE.Vector3(-0.5,-1.5,0)
	);

	line = new THREE.Line(linegeomatry,linematerial);
	line2 = new THREE.Line(linegeomatry2,linematerial);
	line3 = new THREE.Line(linegeomatry3,linematerial);
	line4 = new THREE.Line(linegeomatry4,linematerial);
	line5 = new THREE.Line(linegeomatry5,linematerial);

	v1=new THREE.Vector3(-1,1,0);
	v4=new THREE.Vector3(-1,0,0);
	v2=new THREE.Vector3(0,1,0);
	v3=new THREE.Vector3(1,1,0);
	v5=new THREE.Vector3(0,0,0);
	v6=new THREE.Vector3(1,0,0);
	v7=new THREE.Vector3(-1,-1,0);
	v8=new THREE.Vector3(0,-1,0);
	v9=new THREE.Vector3(1,-1,0);

	

	
	//add
	
	scene.add(mesh1);
	scene.add(mesh2);
	scene.add(mesh3);
	scene.add(mesh4);
	scene.add(mesh5);
	scene.add(mesh6);
	scene.add(mesh7);
	scene.add(mesh8);
	scene.add(mesh9);
	scene.add(camera);
//	scene.add(plane);
	scene.add(line);
	scene.add(line3);
	scene.add(line2);
	scene.add(line4);
	scene.add(line5);
	boxes.push(plane);
	boxes.push(mesh1);
	boxes.push(mesh2);
	boxes.push(mesh3);
	boxes.push(mesh4);
	boxes.push(mesh5);
	boxes.push(mesh6);
	boxes.push(mesh7);
	boxes.push(mesh8);
	boxes.push(mesh9);
	lines.push(line);
	lines.push(line2);
	lines.push(line3);
	lines.push(line4);
	lines.push(line5);
	pos();

	

	h1=document.createElement("h1");
	banka.appendChild(h1);
	h1.innerHTML="123";
	h1.style.fontSize="150px";
	h1.style.position = "absolute";
	h1.style.left= "0px";
    h1.style.top = "0px";


}

function animate()
{

	requestAnimationFrame(animate);
//	var t = clock.getElapsedTime();
//	console.log(mesh1.position);
	
	update();
	render();
}

function update()
{
	
//	console.log(Math.floor(Math.random() * window.innerWidth/180) - window.innerWidth/180  );
//	console.log(Math.floor(Math.random() * (window.innerWidth/180  + window.innerWidth/180 )) - window.innerWidth/180 );
	if (mesh1.position.distanceTo(v1)<=0.15)
	{
		mesh1.position.x=v1.x;
		mesh1.position.y=v1.y;
		in_pos1=true;
	}
	if (mesh2.position.distanceTo(v2)<=0.15)
	{
		mesh2.position.x=v2.x;
		mesh2.position.y=v2.y;
		in_pos2=true;
	}
	if (mesh3.position.distanceTo(v3)<=0.15)
	{
		mesh3.position.x=v3.x;
		mesh3.position.y=v3.y;
		in_pos3=true;
	}
	if (mesh4.position.distanceTo(v4)<=0.15)
	{
		mesh4.position.x=v4.x;
		mesh4.position.y=v4.y;
		in_pos4=true;
	}	if (mesh5.position.distanceTo(v5)<=0.15)
	{
		mesh5.position.x=v5.x;
		mesh5.position.y=v5.y;
		in_pos5=true;
	}	if (mesh6.position.distanceTo(v6)<=0.15)
	{
		mesh6.position.x=v6.x;
		mesh6.position.y=v6.y;
		in_pos6=true;
	}	if (mesh7.position.distanceTo(v7)<=0.15)
	{
		mesh7.position.x=v7.x;
		mesh7.position.y=v7.y;
		in_pos7=true;
	}	if (mesh8.position.distanceTo(v8)<=0.15)
	{
		mesh8.position.x=v8.x;
		mesh8.position.y=v8.y;
		in_pos8=true;
	}	if (mesh9.position.distanceTo(v9)<=0.15)
	{
		mesh9.position.x=v9.x;
		mesh9.position.y=v9.y;
		in_pos9=true;
	}

	if (in_pos1)
	{
		mesh1.position.x=v1.x;
		mesh1.position.y=v1.y;
	}
	if (in_pos2)
	{
		mesh2.position.x=v2.x;
		mesh2.position.y=v2.y;
	}if (in_pos3)
	{
		mesh3.position.x=v3.x;
		mesh3.position.y=v3.y;
	}if (in_pos4)
	{
		mesh4.position.x=v4.x;
		mesh4.position.y=v4.y;
	}if (in_pos5)
	{
		mesh5.position.x=v5.x;
		mesh5.position.y=v5.y;
	}if (in_pos6)
	{
		mesh6.position.x=v6.x;
		mesh6.position.y=v6.y;
	}if (in_pos7)
	{
		mesh7.position.x=v7.x;
		mesh7.position.y=v7.y;
	}if (in_pos8)
	{
		mesh8.position.x=v8.x;
		mesh8.position.y=v8.y;
	}if (in_pos9)
	{
		mesh9.position.x=v9.x;
		mesh9.position.y=v9.y;
	}

	if(in_pos1 && in_pos2 && in_pos3 && in_pos4 && in_pos5 && in_pos6 && in_pos7 && in_pos8 && in_pos9 && text_alredy==false)
	{
		window.setTimeout(hop,500);
		function hop(){	window.alert("Maladyoj");}
		text_alredy=true;
	}

/*	 text =document.createElement('h1');
	text.innerHTML = "CLAP";
	text.style.color = "red";
	text.style.fontSize="150px";
	text.style.position = "absolute";
	text.style.textAlign = "center";

	document.body.appendChild(text);*/


	

	

	/*if(sxmac && havor)
	{
		if(movingobject.scale.x <=1.5)
		{
			movingobject.scale.x +=0.1;
			movingobject.scale.y +=0.1;
		}

	}
	else
	{
		if(movingobject.scale.x >1)
		{
			movingobject.scale.x -=0.1;
			movingobject.scale.y -=0.1;
		}
	}*/
	//console.log(movingobject);
}
function render()
{
//	mesh1.rotation.x += 0.01;
//   mesh1.rotation.y += 0.02;
//	line.linegeomatry.verticesNeedUpdate = true;

	renderer.render(scene,camera);
}

function mouseMove(event )
{
	event.preventDefault();
	var mouse3d = new THREE.Vector3( (event.clientX/window.innerWidth)*2-1 ,-(event.clientY/window.innerHeight)*2+1);
	projector= new THREE.Projector();
	mouse3d=mouse3d.unproject(camera);
    var raycaster = new THREE.Raycaster( camera.position, mouse3d.sub(camera.position).normalize() );
	var intersects = raycaster.intersectObjects(boxes,true);
	//console.log(intersects);
//	console.log(intersects.length);
	
	if(intersects.length>0 && havor && sxmac )
	{
		
		movingobject.position.x=intersects[0].point.x;
		movingobject.position.y=intersects[0].point.y;
		

		
	}
	return intersects.lenght;

/*	for(var i=0;i<intersects.length;i++)
	{
		
	//	intersects[i].object.rotation.x+=0.1;
	//	intersects[i].object.rotation.y+=0.1;
	//	intersects[i].object.rotation.z-=1;

	}*/
}

function mouseDown(event)
{
	
	event.preventDefault();
	var mouse3d = new THREE.Vector3( (event.clientX/window.innerWidth)*2-1 ,-(event.clientY/window.innerHeight)*2+1);
	projector= new THREE.Projector();
	mouse3d=mouse3d.unproject(camera);
    var raycaster = new THREE.Raycaster( camera.position, mouse3d.sub(camera.position).normalize() );
	var intersects = raycaster.intersectObjects(boxes,true);

	if(intersects.length>=2 && sxmac==false)
	{
		havor=true;
		sxmac=true;
	}
	else if(intersects.length>=2 && sxmac)
	{
		havor=false;
		sxmac=false;
	}

	if(havor && sxmac && intersects.length >=2)
	{
		movingobject = intersects[0].object;
		animboxup();
	//	movingobject.scale.x =1.5;
	//	movingobject.scale.y =1.5;
	}
	/*else{
		movingobject.scale.x =1;
			movingobject.scale.y =1;
	}*/
	
	
	//console.log(movingobject.position);
	
//	return(havor);
}

function mouseUp(event) 
{
	event.preventDefault();
	var mouse3d = new THREE.Vector3( (event.clientX/window.innerWidth)*2-1 ,-(event.clientY/window.innerHeight)*2+1);
	projector= new THREE.Projector();
	mouse3d=mouse3d.unproject(camera);
    var raycaster = new THREE.Raycaster( camera.position, mouse3d.sub(camera.position).normalize() );
	var intersects = raycaster.intersectObjects(boxes,true);
	if(intersects.length==2 && sxmac)
	{
		sxmac=false;
		animboxdown();
	}
} 

function pos()
{
	mesh1.position.x=Math.floor(Math.random() *2* window.innerWidth/180) - window.innerWidth/180 ; mesh1.position.y=Math.floor(Math.random() * 2*window.innerHeight/160) - window.innerHeight/160 ;
	mesh2.position.x=Math.floor(Math.random() *2* window.innerWidth/180) - window.innerWidth/180 ; mesh2.position.y=Math.floor(Math.random() *2* window.innerHeight/160) - window.innerHeight/160 ;
	mesh3.position.x=Math.floor(Math.random() *2* window.innerWidth/180) - window.innerWidth/180 ; mesh3.position.y=Math.floor(Math.random() * 2*window.innerHeight/160) - window.innerHeight/160 ;
	mesh4.position.x=Math.floor(Math.random() *2* window.innerWidth/180) - window.innerWidth/180 ; mesh4.position.y=Math.floor(Math.random() * 2*window.innerHeight/160) - window.innerHeight/160 ;
	mesh5.position.x=Math.floor(Math.random() *2* window.innerWidth/180) - window.innerWidth/180 ; mesh5.position.y=Math.floor(Math.random() *2* window.innerHeight/160) - window.innerHeight/160 ;
	mesh6.position.x=Math.floor(Math.random() *2* window.innerWidth/180) - window.innerWidth/180 ; mesh6.position.y=Math.floor(Math.random() *2* window.innerHeight/160) - window.innerHeight/160 ;
	mesh7.position.x=Math.floor(Math.random() *2* window.innerWidth/180) - window.innerWidth/180 ; mesh7.position.y=Math.floor(Math.random() *2* window.innerHeight/160) - window.innerHeight/160 ;
	mesh8.position.x=Math.floor(Math.random() *2* window.innerWidth/180) - window.innerWidth/180 ; mesh8.position.y=Math.floor(Math.random() * 2*window.innerHeight/160) - window.innerHeight/160 ;
	mesh9.position.x=Math.floor(Math.random() *2* window.innerWidth/180) - window.innerWidth/180 ; mesh9.position.y=Math.floor(Math.random() *2* window.innerHeight/160) - window.innerHeight/160 ;
}
function animboxup()
{
	var i = movingobject.scale.x;
	for(i;i<1.2;i += 0.001)
	{
		movingobject.scale.x=i;
		movingobject.scale.y=i;
	}
}
function animboxdown()
{

	for(var i=1.2; i>1;i -= 0.001)
	{
		movingobject.scale.x=i;
		movingobject.scale.y=i;
	}
}
