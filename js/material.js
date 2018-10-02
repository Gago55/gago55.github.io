var urls = [ "textures/px.jpg", "textures/nx.jpg", "textures/py.jpg", "textures/ny.jpg", "textures/pz.jpg", "textures/nz.jpg" ];
//var urls = [ "textures/posx.jpg", "textures/negx.jpg", "textures/posy.jpg", "textures/negy.jpg", "textures/posz.jpg", "textures/negz.jpg" ];
cubMap = new THREE.CubeTextureLoader().load( urls );
cubMap.format = THREE.RGBFormat;
cubMap.mapping = THREE.CubeReflectionMapping;    
// Drmap = new THREE.TextureLoader().load( "./textures/drowing.png" );
var lable = new THREE.TextureLoader().load( 'textures/Label.png' );


var mtl1 = new THREE.MeshPhysicalMaterial({
    name:"mtl1",
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.9,
    //clearCoat: 1.0 - alpha,
    //clearCoatRoughness: 1.0 - beta,
    //reflectivity: 1.0 - gamma,
    envMap: cubMap
});  
var mtl2 = new THREE.MeshPhysicalMaterial({
    name:"mtl2",
     color: 0xffffff,
    metalness: 0.9,
    roughness: 0.6,
    //clearCoat: 1.0 - alpha,
    //clearCoatRoughness: 1.0 - beta,
    //reflectivity: 1.0 - gamma,
    envMap: cubMap
}); 
var mtl3 = new THREE.MeshPhysicalMaterial({
    name:"mtl3",
    color: 0x333333,
    metalness: 0.4,
    roughness: 0.1,
    //clearCoat: 1.0 - alpha,
    //clearCoatRoughness: 1.0 - beta,
    //reflectivity: 1.0 - gamma,
    envMap: cubMap
}); 
var mtl4 = new THREE.MeshPhysicalMaterial({
    name:"mtl4",
     color: 0x2fff11,
    metalness: 0,
    roughness: 0.0,
    // emissive: 0x2fff11,
    //clearCoatRoughness: 1.0 - beta,
    //reflectivity: 1.0 - gamma,
    envMap: cubMap
});
    var mtl5 = new THREE.MeshPhysicalMaterial({
    name:"mtl5",
    color: new THREE.Color(0xffffff),
    metalness: 0.0,
    roughness: 0.7,
    //clearCoat: 1.0 - alpha,
    //clearCoatRoughness: 1.0 - beta,
    //reflectivity: 1.0 - gamma,
    envMap: cubMap
}); 
var mtl6 = new THREE.MeshPhysicalMaterial({
    name:"mtl6",
    color: new THREE.Color('red'),
    metalness: 0.0,
    roughness: 0.5,
    //clearCoat: 1.0 - alpha,
    //clearCoatRoughness: 1.0 - beta,
    //reflectivity: 1.0 - gamma,
    envMap: cubMap
}); 
var mtl7 = new THREE.MeshPhysicalMaterial({
    name:"mtl7",
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.4,
    //clearCoat: 1.0 - alpha,
    //clearCoatRoughness: 1.0 - beta,
    //reflectivity: 1.0 - gamma,
    envMap: cubMap
}); 
var mtl8 = new THREE.MeshPhysicalMaterial({
    name:"mtl8",
    color: 0x1a83ff,
    metalness: 0.0,
    roughness: 0.5,
    //clearCoat: 1.0 - alpha,
    //clearCoatRoughness: 1.0 - beta,
    //reflectivity: 1.0 - gamma,
    envMap: cubMap
}); 
var mtl9 = new THREE.MeshPhysicalMaterial({
    name:"mtl9",
    color: 0xffffff,
    // emissive: 0xffffff,
    metalness: 0.0,
    roughness: 0.5,
    //clearCoat: 1.0 - alpha,
    //clearCoatRoughness: 1.0 - beta,
    //reflectivity: 1.0 - gamma,
    envMap: cubMap
}); 
var mtl10 = new THREE.MeshLambertMaterial({
    name:"mtl10",
       color: 0xffffff,
    
      lightMap: lable,
      lightMapIntensity: 20,
    // emissiveIntensity: 20,
    metalness:0.0,
    roughness: 0.0,
    map:  lable,
    // envMap: cubMap
}); 
var mtl11 = new THREE.MeshPhysicalMaterial({
    name:"mtl11",
    color: 0xff848a,
    metalness: 0.0,
    roughness: 0.5,
    //clearCoat: 1.0 - alpha,
    //clearCoatRoughness: 1.0 - beta,
    //reflectivity: 1.0 - gamma,
    envMap: cubMap
}); 
var createdMats = [mtl1.name,mtl2.name,mtl3.name,mtl4.name,mtl5.name,mtl6.name,mtl7.name,mtl8.name,mtl9.name,mtl10.name,mtl11.name];  
var materials = [mtl1,mtl2,mtl3,mtl4,mtl5,mtl6,mtl7,mtl8,mtl9,mtl10,mtl11];  

var numberOfMats;//materials.length;

var objectsCount = 0;
var alredyToken=false;
var addToControls = true;
function Iter(item) {
             
    item.traverse( function( node ) {
                  // console.log(node.type);
       
                //   objectsCount++;
           if ( node instanceof THREE.Mesh ) {
              
            //    node.castShadow = true;
            //    node.receiveShadow = true;
                // console.log(node.material.name);
               if (createdMats.indexOf(node.material.name) !== -1) {
                  
                    if(node.material.name == "mtl1" && alredyToken==false)
                    {
                        console.log(node.material.opacity);
                        
                        if(node.material.opacity<1 )//&& node.material.opacity !== undefined)
                        {
                            objectsCount =node.material.opacity;
                            objectsCount=objectsCount*100;
                            objectsCount=objectsCount.toFixed(0);
                            // alert(objectsCount);
                           
                        }
                        else console.log(node);
                        alredyToken=true;
                       
                    }
                   if(addToControls)
                   {
                        CreatingButtons(objectsCount);
                        createColorDiv(objectsCount);     
                        addToControls=false;
                   }
                   node.material = eval(node.material.name)
                        // console.log(objectsCount);
                        
               }
/*                            if (node.material.name =="MetalMTL1" ){
                   
                   node.material = metMat1;
                   //console.log("..................../////////////////////////");
               }*/
               

           } 
            // console.log(numberOfMats);
            
            
   } );
   
}