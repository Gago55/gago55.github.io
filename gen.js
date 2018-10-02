var camera, scene, renderer,conteiner;

var controls;
var controlsPanel;
var activeSphereNumber;

init();




var buttons = [];
var divContainers = [];
var spheres = [];
var preColors = [];
var obj = [];
var mouseX = 0, mouseY = 0;

var geometry = new THREE.SphereGeometry( 5, 32, 32 );
var material =new THREE.MeshNormalMaterial();
var manager;
var preCircle = false;
var progressRemove = true;
var startWait = true;
var uje =false;
var model;


var clock = new THREE.Clock();

var mixers = [] ;
            

 function init() 
{
     manager = new THREE.LoadingManager();

        conteiner=document.getElementById('threejs');
        // document.getElementById("ranBut").addEventListener("click", ranColor);
        camera = new THREE.PerspectiveCamera( 20, conteiner.clientWidth / conteiner.clientHeight, 1, 3000 );
    
        scene = new THREE.Scene();
    //  var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );
        //var geometry = new THREE.Sp

        
       // scene.add( mesh );
       
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( conteiner.devicePixelRatio );
        renderer.setSize( conteiner.clientWidth, conteiner.clientHeight );
        conteiner.appendChild( renderer.domElement );

        window.addEventListener( 'resize', onWindowResize, false );
       scene.background = new THREE.Color("rgb(241,238,238)");
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enablePan=false;
        camera.position.set( 0, 20, 900 );

       function addLightHelper() {
        var sphereSize = 10;
        scene.traverse( function( node ) {
                    // console.log(node.type);
        
            if ( node instanceof THREE.PointLight ) {

                var pointLightHelper = new THREE.PointLightHelper( node, sphereSize );
                scene.add( pointLightHelper );
            } 
    } );

    }
       var ambient = new THREE.AmbientLight(  0x525252 );
       scene.add( ambient );

                      var ambient = new THREE.AmbientLight( "rgb(70,70,70)" );
                      // scene.add( ambient );

    var Omni001 = new THREE.PointLight( 0xffffff , 0.3 );
          scene.add( Omni001 );
          Omni001.position.set( 100, 77.616, 100 );
      var Omni002 = new THREE.PointLight( 0xffffff , 0.3 );
          scene.add( Omni002 );
          Omni002.position.set( -100, 77.616, 100 );
      var Omni003 = new THREE.PointLight( 0xffffff , 0.3 );
          scene.add( Omni003 );
          Omni003.position.set( -100, 77.616, -100 );
      var Omni004 = new THREE.PointLight( 0xffffff , 0.3 );
          scene.add( Omni004 );
          Omni004.position.set( 100, 77.616, -100 );
      var Omni005 = new THREE.PointLight( 0xffffff , 0.8 );
          scene.add( Omni005 );
          Omni005.position.set( 0, -100,0 );
   

    
    //  loadModel('ring01');
    loadModel('ground01');
    loadModel('animal01');
                
    }
    var mixer,clips,clip;

    function loadModel(modelName)
    {
        


       
       manager.onProgress = function ( item, loaded, total ) {

        //    console.log( item, loaded, total );

       };
    //    var textureDf = new THREE.Texture();
    //    var textureSp = new THREE.Texture();

       var onProgress = function ( xhr ) {
        //    if(preCircle)
        //    {
        //     document.getElementById("controlsPanel").innerHTML=preLoaderCircle; 
        //         preCircle=false;
        //         preCircleRemove=true;
        //    }
        if ( xhr.lengthComputable ) {
           
            var percentComplete = xhr.loaded / xhr.total * 100;
            if(startWait)
             var widthOfProgress = document.getElementById("loading").style.width= Math.round(percentComplete, 2) + "%"; 
            //$("#load").html( Math.round(percentComplete, 2) + '% downloaded' );
            if(Math.round(percentComplete, 2) == 100)
            {
                if(startWait)
                {
                    $("#wait").remove();
                    startWait=false;
                }
                
                 if(progressRemove)
                {
                        $("#progressDiv").remove();
                        progressRemove=false;
                        
                }
                
            }
        }}

        function onError( error ) {

   console.error( error );

}
        
       
       var loader = new THREE.FBXLoader( manager );
				loader.load( 'models/'+ modelName + '.FBX', function( object ) {
                    var objectName = modelName.replace(/[0-9]/g, '');
                    object.name=objectName;
					scene.add( object );
					
                    render();               
                    
                    // object.mixer = new THREE.AnimationMixer( object );
					// mixers.push( object.mixer );
					// var action = object.mixer.clipAction( object.animations[ 0 ] );
                    // action.setLoop( THREE.LoopOnce );
                    // console.log(object);
                    Iter(scene);
      
model = object;
// Play all animations


// uje=true;
animate();
// action.play();
                   // $("#wait").css("display", "none");
                }, onProgress, onError
                 );
    }



// CreatingButtons();

 function onWindowResize()
{
    camera.aspect = conteiner.clientWidth / conteiner.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( conteiner.clientWidth, conteiner.clientHeight );
}

function changelight() {
    controls.autoRotate = !controls.autoRotate;
}


//   function animate() 
// {
//     requestAnimationFrame( animate );
//     renderer.render( scene, camera );
//     controls.update();
//     // mixer.update();
    
//     // if(uje){
//     // action.play();
//     // // console.log(1);
//     // }
    
//     // mixer.clipAction(model.animations[0]).play();
//     // console.log(mixer.length);
    
//     // if ( mixers.length > 0 ) {
//     //     for ( var i = 0; i < mixers.length; i ++ ) {
//     //         mixers[ i ].update( clock.getDelta() );
//     //     }
//     // }

//     mixers[0].update(clock.getDelta());

//     render();
// }

function animate() {
    requestAnimationFrame( animate );
   

    
                if ( mixers.length > 0 ) {
                    for ( var i = 0; i < mixers.length; i ++ ) {
                        mixers[ i ].update( clock.getDelta() );
                    }
                }


    renderer.render( scene, camera );
    controls.update();
    // stats.update();

   
}

// function update () {
// 	mixer.update( deltaSeconds );
// }

function render() {
    renderer.render( scene, camera );
}
var qaq=true;
function ranColor()
{
    // for (var i = 0; i < 11; i++) 
    // {
    //     var r=Math.floor(Math.random() * 256)
    //     var g=Math.floor(Math.random() * 256)
    //     var b=Math.floor(Math.random() * 256)
    //     var color = "rgb(" + r + " ,"+ g + ","+ b + ")";
    //     preColors[i]=color;
    //     color=rgb2hex(color);
    //     materials[i].color.setHex(color); 

    // }
    // preCircle=true;
    scene.remove(scene.children[6]);
    document.getElementById("controlsPanel").innerHTML=""; 
    document.getElementById("controlsPanel").innerHTML=progressLoader; 
    document.getElementById("dropdown1").innerHTML=""; 
    
    while (camera.children.length)
{
    camera.remove(camera.children[0]);

}
    spheres=[];
    divContainers=[];
    preColors=[];
    alredyToken=false;
    if(qaq)
    {
        loadModel('one1');qaq=false
    }
    else{
            loadModel("ring01");qaq=true;
    }
    
}

function CreatingButtons(num)
{
    
    // console.log(num);
    
    // var marginButtons=window.innerHeight/num - 60;
    document.getElementById("controlsPanel").style.height = num * 85;
    for (var i = 0; i < num ; i++) 
    {
       var divContainer=  document.createElement('div');
       divContainer.setAttribute("class", "divContainer");
        divContainer.setAttribute("style", "width:90%;");
       
    //    var button = document.createElement('div');
    //    button.setAttribute("class", "buttons");
    //    button.setAttribute("id", "mtl" + (i+1));
    //    button.setAttribute("onclick", "createColorDiv(this.id)");
      
       document.getElementById("controlsPanel").appendChild(divContainer);
        // divContainer.appendChild(button);

        // button.setAttribute("style", "margin-top:"+ marginButtons/2 + "px");
        // button.innerHTML = 'M' + (i+1);
    //    buttons.push(button);
       divContainers.push(divContainer);

    //    var buttonsDiv = document.createElement('div');
    //     divContainer.appendChild(buttonsDiv);
    //     buttonsDiv.setAttribute("class", "buttonsDiv");
        // buttonsDiv.setAttribute("style", "margin:auto;margin-left:"+ (divContainers[0].clientWidth - 75 -buttonsDiv.clientWidth)/2 + "px");
        divContainer.setAttribute("id", i);
        divContainer.setAttribute("onmouseover", "scaleSphere(this.id)");
        divContainer.setAttribute("onmouseout", "scaleSphere(this.id)");
        miniButtons(divContainer);

        
    }

    //SPHERES
  
    for (var i=0 ; i<num; i++)
    {
       var mesh = new THREE.Mesh( geometry, materials[i] );
       scene.add(camera);
       camera.add( mesh );
        mesh.position.set(119,72,-450);
        mesh.position.y-=14.3*i;
        spheres.push(mesh);

        var r=materials[i].color.r*255;
        var g=materials[i].color.g*255;
        var b=materials[i].color.b*255;
        var col = "rgb(" + r + " ,"+ g + ","+ b + ")";
        preColors.push(col);
    }
   
    // console.log(numberOfMats);
    num=parseInt(num);
    // console.log(num);
    
     divContainers[num-1].style.borderBottomWidth=0;
}
  



function miniButtons(parent)
{
    for (var i=0 ; i < 4 ; i++)
    {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        var miniButtons = document.createElement('div');
        miniButtons.setAttribute("class", "miniButtons");
        miniButtons.setAttribute("style", "background-color :#" +randomColor);
        parent.appendChild(miniButtons);
        miniButtons.setAttribute("onclick", "miniClick(this)");
        miniButtons.setAttribute("onmouseover", "hoverOnColor(this,this.style.backgroundColor)");
        miniButtons.setAttribute("onmouseout",  "hoverOffColor(this,this.style.backgroundColor)");
    }

    var miniRandomButtons = document.createElement('div');
    miniRandomButtons.setAttribute("class", "miniRandomButtons");
    parent.appendChild(miniRandomButtons);
    miniRandomButtons.innerHTML = 'R';
    miniRandomButtons.setAttribute("onclick", "miniRandomClick(this)");

}
function miniClick(clickedButton)
{
    var id = clickedButton.parentElement.id;
    var color=clickedButton.style.backgroundColor;
    preColors[id]=color;
    color=rgb2hex(color);
    materials[id].color.setHex(color);  

    var drop = document.getElementById("dropdowna");
    var nameId = parseInt(id) + 1;
    var name ="MTL" + nameId;

    if(drop.innerHTML == name)
    {
        changeDinamicColor(id);
    }
    
}

function miniRandomClick(clickedButton)
{
    var id = clickedButton.parentElement.id;
    
    var r=Math.floor(Math.random() * 256)
    var g=Math.floor(Math.random() * 256)
    var b=Math.floor(Math.random() * 256)
    var color = "rgb(" + r + " ,"+ g + ","+ b + ")";
    preColors[id]=color;
    color=rgb2hex(color);
    materials[id].color.setHex(color); 
    
    var drop = document.getElementById("dropdowna");
    var nameId = parseInt(id) + 1;
    var name ="MTL" + nameId;

    if(drop.innerHTML == name)
    {
        changeDinamicColor(id);
    }
    
}


function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "0x" +
     ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
   }
   
function scaleSphere(id)
{
        if(spheres[id].scale.x==1)
        {
            spheres[id].scale.set(1.2,1.2,1.2);
        }
        else
        spheres[id].scale.set(1,1,1);
}

function hoverOnColor(hovered,color)
{
   var id = hovered.parentElement.id;

        color=rgb2hex(color);
        materials[id].color.setHex(color);     
}

function hoverOffColor(hovered,color)
{
    var id = hovered.parentElement.id;
    color=preColors[id];
    color=rgb2hex(color);
    materials[id].color.setHex(color);  
}

$('.dropdown-trigger').dropdown();
function createColorDiv(num)
{
  
    // alert(num);
    for (var i=0 ; i<num ; i++)
    {
        var li = document.createElement('li');
        li.setAttribute("tabIndex","0");

        var a = document.createElement('a');
        a.setAttribute("href","#!");
        a.setAttribute("id",i+1);
        a.innerHTML="MTL" + (i+1);

        li.appendChild(a);
        a.setAttribute("onclick","dropdownButtons(this.id)");
    
        $("#dropdown1" ).append(li);
    }
}
modelsDropdown ();
function modelsDropdown ()
{
    for (var i=0 ; i<4 ; i++)
    {
        var li = document.createElement('li');
        li.setAttribute("tabIndex","0");

        var a = document.createElement('a');
        a.setAttribute("href","#!");
        a.setAttribute("id",i+1);
        a.innerHTML="ground0" + (i+1);

        li.appendChild(a);
        a.setAttribute("onclick","changeGround(this.id)");
    
        $("#dropdown2" ).append(li);
    }

    for (var i=0 ; i<4 ; i++)
    {
        var li = document.createElement('li');
        li.setAttribute("tabIndex","0");

        var a = document.createElement('a');
        a.setAttribute("href","#!");
        a.setAttribute("id",i+1);
        a.innerHTML="animal0" + (i+1);

        li.appendChild(a);
        a.setAttribute("onclick","changeAnimal(this.id)");
    
        $("#dropdown3" ).append(li);
    }
}

function dropdownButtons(id)
{
    var drop = document.getElementById("dropdowna");
    drop.innerHTML="MTL" + id;
   id=id-1;
    changeDinamicColor(id,"","","");
    changeMetalizm(id,"","" );
    activIdMet=id;
}

 var activIdMet;
function showVal(value,name)
{
    if(name=="red")
    {
          var h6 = document.getElementById("rh6");
          h6.innerHTML=value;
    }
    else if(name== "green")
    {
        var h6 = document.getElementById("gh6");
        h6.innerHTML=value;
  }
  else  if(name== "blue")
  {
    var h6 = document.getElementById("bh6");
    h6.innerHTML=value;
}
else if(name == "metal")
{
    var h6 = document.getElementById("metalh6");
    h6.innerHTML=value;
}
else{
    var h6 = document.getElementById("roughh6");
    h6.innerHTML=value;
}

        var r = document.getElementsByName("red")[0].valueAsNumber;
        var g = document.getElementsByName("green")[0].valueAsNumber;
        var b = document.getElementsByName("blue")[0].valueAsNumber;
        var metal = document.getElementsByName("metal")[0].valueAsNumber;
        var rough = document.getElementsByName("rough")[0].valueAsNumber;

        materials[activIdMet].metalness=metal;
        materials[activIdMet].roughness=rough;
        changeDinamicColor("",r,g,b);
        changeMetalizm("",metal,rough);
}

function changeDinamicColor(id,r,g,b)
{
    
    if (id === "")
        {    
            var red = r;
            var green = g;
            var blue = b;
         }
    else
        {
            var red=materials[id].color.r*255;
            var green=materials[id].color.g*255;
            var blue=materials[id].color.b*255;
        }
    var color = document.getElementById("dinamicColor"); 
    color.style.backgroundColor="rgb("+red+","+green+","+blue+")";

    document.getElementsByName("red")[0].value=red;
    document.getElementsByName("green")[0].value=green;
    document.getElementsByName("blue")[0].value=blue;
    var h6 = document.getElementById("rh6");
    h6.innerHTML=red;
    h6 = document.getElementById("gh6");
    h6.innerHTML=green;
    h6 = document.getElementById("bh6");
    h6.innerHTML=blue;
    
}

$(document).keypress(function(e) {
    if(e.which == 32) 
    {
        action.reset();
        action.play();
        
        
        var drop = document.getElementById("dropdowna");
        drop=drop.innerHTML;
        if(drop != "Drop Me!")
        {
            var r,g,b;
            var h6 = document.getElementById("rh6");
            r=h6.innerHTML;
            h6 = document.getElementById("gh6");
            g=h6.innerHTML;
            h6 = document.getElementById("bh6");
            b=h6.innerHTML;

            drop=drop.match(/\d+/g);//.map(Number);
            
            var color = "rgb(" + r + " ,"+ g + ","+ b + ")";
            preColors[drop-1]=color;
            color=rgb2hex(color);
            materials[drop-1].color.setHex(color); 
        }
        else
        {
                // alert("qaq ches kere");
        }
    }
   
});

function changeMetalizm(id,m,r)
{
    if (id === "")
        {    
            var rough = r;
            var metal = m;
         }
    else
        {
            console.log(id);
            
            var metal= materials[id].metalness;
            var rough= materials[id].roughness;  
            if(metal=="")
            metal=0;
            if(rough=="")
            rough=0;   

           
        }
   
        document.getElementsByName("metal")[0].value=metal;
        document.getElementsByName("rough")[0].value=rough;
        var h6 = document.getElementById("roughh6");
        h6.innerHTML=rough;
        var h6 = document.getElementById("metalh6");
        h6.innerHTML=metal;

        
}

// function sleep(milliseconds) {
//     var start = new Date().getTime();
//     for (var i = 0; i < 1e7; i++) {
//       if ((new Date().getTime() - start) > milliseconds){
//         break;
//       }
//     }
//   }


function changeGround(id)
{
    removeRecurs(scene.getObjectByName('ground'));// scene.remove(scene.getObjectByName('ground'));
     document.getElementById("controlsPanel").innerHTML=""; 
    document.getElementById("controlsPanel").innerHTML=progressLoader; 
    document.getElementById("dropdown1").innerHTML=""; 
     while (camera.children.length)
     {
         camera.remove(camera.children[0]);
     
     }
     spheres=[];
     divContainers=[];
     preColors=[];
     alredyToken=false;
     addToControls=true;
     progressRemove=true;
     loadModel('ground0' + id);
    //  scene.getObjectByName('ground').children[0].material.opacity = 1;

}

function changeAnimal(id)
{
    removeRecurs(scene.getObjectByName('animal')); //  scene.remove(scene.getObjectByName('animal'));
     document.getElementById("controlsPanel").innerHTML=""; 
    document.getElementById("controlsPanel").innerHTML=progressLoader; 
    document.getElementById("dropdown1").innerHTML=""; 
     while (camera.children.length)
     {
         camera.remove(camera.children[0]);
     
     }
     spheres=[];
     divContainers=[];
     preColors=[];
    //  alredyToken=false;
    addToControls=true;
     progressRemove=true;
     loadModel('animal0' + id);
    //  scene.getObjectByName('animal').children[0].material.opacity = 1;
}

function removeRecurs(cabGr) {
    console.log(cabGr);
    
    // if (selected.parent == cabGr){selected == undefined};
    while (cabGr.children.length > 0) {
        
        var act = cabGr.children[0];
        // console.log(act);

        if ( act instanceof THREE.Mesh ) {
            if (act != undefined) {
                cabGr.remove(act);
                act.geometry.dispose();
                // if (act.material != undefined) {
                //     act.material.dispose();
                //     act.material = undefined;
                // }
                
                act = undefined;
            }

        }else{
            if (act instanceof THREE.Object3D) {
                removeRecurs(act);
                cabGr.remove(act);
            }
        }  
    }

    cabGr.parent.remove(cabGr);
}