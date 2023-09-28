const canvas = document.querySelector("#render-canvas");
const timer = document.querySelector('.header__timer');
const countProgress = document.querySelector('.count__progress');
const countAll = document.querySelector('.count__need');
const gameOverScreen = document.querySelector('.game-over')
const startGame = (time, countTreasure) => {
  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
  });
  const createScene = async function () {
    const CAMERA_HEIGHT = 13;
    const CAMERA_RADIUS = 45;
    const CAMERA_ALPHA = 3.5;
    const CAMERA_BETA = 0.93;
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    // initialize plugin
    scene.enablePhysics();
    const camera = new BABYLON.ArcRotateCamera(
      "camera1",
      CAMERA_ALPHA,
      CAMERA_BETA,
      CAMERA_RADIUS,
      new BABYLON.Vector3(-55, CAMERA_HEIGHT, 5),
      scene
    );
    camera.attachControl(canvas, true)
    camera.minZ = 0.01;

    // Creates a light, aiming 0,1,0
    const light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, -3.5, -2.5), scene);
    light.position = new BABYLON.Vector3(3, 100, 3);
    light.intensity = 2;
    //Creates shadow
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 2;
    shadowGenerator.setDarkness(0.4);
//Create audio
    BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;
    const fonAudio = new BABYLON.Sound("Music", "./audio/main-menu.mp3", scene, null, {
      loop: true,
      autoplay:true,
      volume: 0.05
    });
    const runAudio = new BABYLON.Sound("run", "./audio/run.mp3", scene, null, {
      loop: true,
      volume: 0.25,
    });
    const fastRunAudio = new BABYLON.Sound("fastRun", "./audio/fast-run.mp3", scene, null, {
      loop: true,
      volume: 0.25,
    });
    const treasureAudio = new BABYLON.Sound("treasure", "./audio/treasure.mp3", scene, null, {
      volume: 0.2,
      length: 1.2
    });
    const gameOverAudio = new BABYLON.Sound("gameOver", "./audio/gameover.mp3", scene, null, {
      volume: 0.3
    });
    const victoryAudio = new BABYLON.Sound("victory", "./audio/victory.mp3", scene, null, {
      volume: 0.3
    });
    const timeOutAudio = new BABYLON.Sound("timeOut", "./audio/time-out.mp3", scene, null, {
      loop: true,
      volume: 0.4
    });
//Skybox
    const skybox = BABYLON.Mesh.CreateBox("skyBox", 2000.0, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    // Water
    const sandTexture = new BABYLON.Texture("img/sand.jpg", scene);
    sandTexture.vScale = sandTexture.uScale = 16;

    const sandMaterial = new BABYLON.StandardMaterial("sandMaterial", scene);
    sandMaterial.diffuseTexture = sandTexture;

    const sand = BABYLON.Mesh.CreateGround("sand", 1024, 1024, 32, scene, false);
    sand.position.y = -1;
    sand.material = sandMaterial;


    // Ground
    const MAP_SIZE = 100;
    const MAP_MAX_HEIGHT = 15;
    // Built-in 'ground' shape.
    const creatGround = (x, y, z) => {
      const ground = BABYLON.MeshBuilder.CreateBox(
        "ground",
        {
          width: MAP_SIZE,
          height: 0.1,
          depth: MAP_SIZE,
        },
        scene
      );
      ground.position.x = x
      ground.position.z = z
      ground.position.y = y
      ground.receiveShadows = true;
      ground.isPickable = true;

      const material = new BABYLON.StandardMaterial("groundMaterial", scene);

      const groundTexture = new BABYLON.Texture(
        "https://playground.babylonjs.com/textures/floor.png"
      );
      groundTexture.uScale = groundTexture.vScale = 15;
      material.diffuseTexture = groundTexture;

      const groundBumpTexture = new BABYLON.Texture(
        "https://playground.babylonjs.com/textures/floor_bump.png"
      );
      groundBumpTexture.uScale = groundBumpTexture.vScale = MAP_SIZE / 2.5;
      material.bumpTexture = groundBumpTexture;

      material.specularColor = BABYLON.Color3.White().scale(0.3);
      ground.material = material;
      ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0,
        friction: 0.5
      }, scene);

    }
    creatGround(-0.3, 3.5, -100)
    creatGround(-0.3, 3.5, 0)
    creatGround(-0.3, 3.5, 100)
    creatGround(99.7, 3.5, -100)
    creatGround(99.7, 3.5, 0)
    creatGround(99.7, 3.5, 100)

    //Текстуры мира
    const wall = new BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./public/",
      "WonderWalls_SecondAge.gltf",
      scene).then((result) => {

      const [wall] = result.meshes;
      wall.position = new BABYLON.Vector3(50, 3.5, 0)
      wall.scaling = new BABYLON.Vector3(150, 30, 105)
      wall.rotation = new BABYLON.Vector3(0, -1.58, 0)
      shadowGenerator.addShadowCaster(result.meshes[0])
      const wallLeftBox = new BABYLON.MeshBuilder.CreateBox('wallLeftBox', {width: 150, height: 20, depth: 40})
      wallLeftBox.position = new BABYLON.Vector3(50, 8.3, 130);
      wallLeftBox.isVisible = false
      wallLeftBox.physicsImpostor = new BABYLON.PhysicsImpostor(wallLeftBox, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0,
        friction: 0
      }, scene);
      const wallRightBox = new BABYLON.MeshBuilder.CreateBox('wallRightBox', {width: 150, height: 20, depth: 40})
      wallRightBox.position = new BABYLON.Vector3(50, 8.3, -130);
      wallRightBox.isVisible = false
      wallRightBox.physicsImpostor = new BABYLON.PhysicsImpostor(wallRightBox, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0,
        friction: 0
      }, scene);
      const wallFrontBox = new BABYLON.MeshBuilder.CreateBox('wallFrontBox', {width: 20, height: 20, depth: 220})
      wallFrontBox.position = new BABYLON.Vector3(135, 8.3, 0);
      wallFrontBox.isVisible = false
      wallFrontBox.physicsImpostor = new BABYLON.PhysicsImpostor(wallFrontBox, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0,
        friction: 0
      }, scene);
      wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.NoImpostor, {
        mass: 0,
      }, scene);
      const wallBack1Box = new BABYLON.MeshBuilder.CreateBox('wallBack1Box', {width: 32, height: 20, depth: 120})
      wallBack1Box.position = new BABYLON.Vector3(-33, 8.3, 80);
      wallBack1Box.isVisible = false
      wallBack1Box.physicsImpostor = new BABYLON.PhysicsImpostor(wallBack1Box, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0,
        friction: 0
      }, scene);
      const wallBack2Box = new BABYLON.MeshBuilder.CreateBox('wallBack2Box', {width: 32, height: 20, depth: 120})
      wallBack2Box.position = new BABYLON.Vector3(-33, 8.3, -81);
      wallBack2Box.isVisible = false
      wallBack2Box.physicsImpostor = new BABYLON.PhysicsImpostor(wallBack2Box, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0,
        friction: 0
      }, scene);
      wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.NoImpostor, {
        mass: 0,
      }, scene);
      wall.addChild(wallLeftBox);
      wall.addChild(wallRightBox);
      wall.addChild(wallFrontBox);
      wall.addChild(wallBack1Box);
      wall.addChild(wallBack2Box);
    })
    const port = new BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./public/",
      "Port.gltf",
      scene).then((result) => {
      const [port] = result.meshes;
      port.position = new BABYLON.Vector3(-52.2, 3.2, -10);
      port.scaling = new BABYLON.Vector3(15, 15, 15);
      result.meshes[2].receiveShadows = true;
      const boxPort1 = new BABYLON.MeshBuilder.CreateBox('boxPort', {width: 20, height: 0.5, depth: 12}, scene);
      boxPort1.position = new BABYLON.Vector3(-60.0, 3.2, 0)
      boxPort1.physicsImpostor = new BABYLON.PhysicsImpostor(boxPort1, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0
      }, scene);
      boxPort1.isVisible = false
      const wallLeftPort1 = new BABYLON.MeshBuilder.CreateBox('wallLeftPort', {width: 20, height: 20, depth: 1}, scene);
      wallLeftPort1.position = new BABYLON.Vector3(-60.0, 3.0, 6)
      wallLeftPort1.physicsImpostor = new BABYLON.PhysicsImpostor(wallLeftPort1, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0
      }, scene);
      wallLeftPort1.isVisible = false;
      const wallRightPort1 = new BABYLON.MeshBuilder.CreateBox('wallRightPort', {
        width: 20,
        height: 20,
        depth: 1
      }, scene);
      wallRightPort1.position = new BABYLON.Vector3(-60.0, 3.0, -5)
      wallRightPort1.physicsImpostor = new BABYLON.PhysicsImpostor(wallRightPort1, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0
      }, scene);
      wallRightPort1.isVisible = false;
      const wallBackPort1 = new BABYLON.MeshBuilder.CreateBox('wallBackPort', {width: 1, height: 20, depth: 12}, scene);
      wallBackPort1.position = new BABYLON.Vector3(-70.0, 3.0, 0)
      wallBackPort1.physicsImpostor = new BABYLON.PhysicsImpostor(wallBackPort1, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0
      }, scene);
      wallBackPort1.isVisible = false;
      port.physicsImpostor = new BABYLON.PhysicsImpostor(port, BABYLON.PhysicsImpostor.NoImpostor, {
        mass: 0,
        restitution: 0
      }, scene);
      port.addChild(boxPort1)
      port.addChild(wallLeftPort1)
    })
    //Бочки
    const barrelArray = []
    const createBarrel = (x, z) => {
      new BABYLON.SceneLoader.ImportMeshAsync(
        null,
        "./public/",
        "Barrel.gltf",
        scene).then((result) => {
        const [barrel] = result.meshes;
        shadowGenerator.addShadowCaster(barrel)
        barrel.position = new BABYLON.Vector3(x, 3.5, z);
        barrel.scaling = new BABYLON.Vector3(15, 15, 15)
        const barrelBox = new BABYLON.MeshBuilder.CreateCylinder('barrelBox', {diameter: 1.5, height: 1.7}, scene)
        barrelBox.position = new BABYLON.Vector3(x, 4.5, z);
        barrelBox.isVisible = false
        barrel.addChild(barrelBox)
        barrelBox.physicsImpostor = new BABYLON.PhysicsImpostor(barrelBox, BABYLON.PhysicsImpostor.CylinderImpostor, {
          mass: 0
        }, scene);
        barrel.physicsImpostor = new BABYLON.PhysicsImpostor(barrel, BABYLON.PhysicsImpostor.NoImpostor, {
          mass: 40,
          restitution: 1
        }, scene);
        barrelArray.push(barrel)
      })
    }
    createBarrel(-50, 0);

    //Здания
    const creatHouse = (x, z) => {
      new BABYLON.SceneLoader.ImportMeshAsync(
        null,
        "./public/",
        "Houses.gltf", scene).then((result) => {
        const [house] = result.meshes;
        shadowGenerator.addShadowCaster(house)
        house.position = new BABYLON.Vector3(x, 3.5, z);
        house.scaling = new BABYLON.Vector3(15, 15, 15);
        house.rotation = new BABYLON.Vector3(0, 1.58, 0)
        const house1Box = new BABYLON.MeshBuilder.CreateBox('house1Box', {width: 10, height: 6, depth: 15}, scene)
        house1Box.position = new BABYLON.Vector3(x - 7, 5.5, z - 1.5)
        house1Box.isVisible = false;
        house1Box.physicsImpostor = new BABYLON.PhysicsImpostor(house1Box, BABYLON.PhysicsImpostor.BoxImpostor, {
          mass: 0
        }, scene);
        const house2Box = new BABYLON.MeshBuilder.CreateBox('house2Box', {width: 8, height: 6, depth: 16}, scene)
        house2Box.position = new BABYLON.Vector3(x + 5, 5.5, z + 2.5);
        house2Box.isVisible = false;
        house2Box.physicsImpostor = new BABYLON.PhysicsImpostor(house2Box, BABYLON.PhysicsImpostor.BoxImpostor, {
          mass: 0
        }, scene);
        house.physicsImpostor = new BABYLON.PhysicsImpostor(house, BABYLON.PhysicsImpostor.NoImpostor, {
          mass: 0
        }, scene);
        house.addChild(house1Box);
        house.addChild(house2Box);
      })
    }
    //Row1 house
    for (let i = 0; i < 5; i++) {
      creatHouse(i * 25, 98)
    }
    //Row2 house
    for (let i = 0; i < 5; i++) {
      creatHouse(i * 25, 38)
    }
    //Create Farm
    const creatFarm = (x, z) => {
      new BABYLON.SceneLoader.ImportMeshAsync(
        null,
        "./public/",
        "Farm.gltf", scene).then((result) => {
        const [farm] = result.meshes;
        shadowGenerator.addShadowCaster(farm)
        farm.position = new BABYLON.Vector3(x, 3.5, z);
        farm.scaling = new BABYLON.Vector3(12, 12, 12);
        farm.rotation = new BABYLON.Vector3(0, 0, 0)
        const farmBox = new BABYLON.MeshBuilder.CreateBox('farmBox', {width: 8, height: 6, depth: 8}, scene)
        farmBox.position = new BABYLON.Vector3(x - 6, 5.5, z - 7)
        farmBox.isVisible = false;
        farmBox.physicsImpostor = new BABYLON.PhysicsImpostor(farmBox, BABYLON.PhysicsImpostor.BoxImpostor, {
          mass: 0
        }, scene);
        farm.physicsImpostor = new BABYLON.PhysicsImpostor(farm, BABYLON.PhysicsImpostor.NoImpostor, {
          mass: 0
        }, scene);
        farm.addChild(farmBox);
      })
    }
    for (let i = 0; i < 5; i++) {
      creatFarm(i * 25, 70)
    }
    //create center
    new BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./public/",
      "Center.gltf", scene).then((result) => {
      const [center] = result.meshes;
      center.scaling = new BABYLON.Vector3(15, 10, 15);
      center.position = new BABYLON.Vector3(50, 3.5, 0);
      center.rotation = new BABYLON.Vector3(0, -3.14, 0);
      shadowGenerator.addShadowCaster(center);
      const centerBox = new BABYLON.MeshBuilder.CreateBox('centerBox', {width: 26, height: 3, depth: 26}, scene)
      centerBox.position = new BABYLON.Vector3(50, 3.5, 0);
      centerBox.isVisible = false;
      centerBox.physicsImpostor = new BABYLON.PhysicsImpostor(centerBox, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
      }, scene);
      center.physicsImpostor = new BABYLON.PhysicsImpostor(center, BABYLON.PhysicsImpostor.NoImpostor, {
        mass: 0
      }, scene);
      center.addChild(centerBox);
    })
//Create Market
    const creatMarket = (x, z, rotate) => {
      new BABYLON.SceneLoader.ImportMeshAsync(
        null,
        "./public/",
        "Market.gltf", scene).then((result) => {
        const [market] = result.meshes;
        shadowGenerator.addShadowCaster(market)
        market.position = new BABYLON.Vector3(x, 3.5, z);
        market.scaling = new BABYLON.Vector3(15, 15, 15);
        market.rotation = new BABYLON.Vector3(0, rotate, 0)
        const market1Box = new BABYLON.MeshBuilder.CreateBox('market1Box', {width: 28, height: 6, depth: 10}, scene)
        market1Box.position = new BABYLON.Vector3(x + 0, 5.5, z - 8)
        market1Box.rotation = new BABYLON.Vector3(0, 0, 0)
        market1Box.isVisible = false;
        market1Box.physicsImpostor = new BABYLON.PhysicsImpostor(market1Box, BABYLON.PhysicsImpostor.BoxImpostor, {
          mass: 0
        }, scene);
        const market2Box = new BABYLON.MeshBuilder.CreateBox('market2Box', {width: 28, height: 6, depth: 14}, scene)
        market2Box.position = new BABYLON.Vector3(x + 0, 5.5, z + 8);
        market2Box.rotation = new BABYLON.Vector3(0, 0, 0)
        market2Box.isVisible = false;
        market2Box.physicsImpostor = new BABYLON.PhysicsImpostor(market2Box, BABYLON.PhysicsImpostor.BoxImpostor, {
          mass: 0
        }, scene);
        market.physicsImpostor = new BABYLON.PhysicsImpostor(market, BABYLON.PhysicsImpostor.NoImpostor, {
          mass: 0
        }, scene);
        market.addChild(market1Box);
        market.addChild(market2Box);
      })
    }
    for (let i = 0; i < 2; i++) {
      creatMarket((i * 80) + 10, 5, 1.55)
    }
    for (let i = 0; i < 2; i++) {
      creatMarket((i * 80) + 10, -32, 1.55)
    }
    //Create Temple
    new BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./public/",
      "Temple.gltf", scene).then((result) => {
      const [temple] = result.meshes;
      temple.scaling = new BABYLON.Vector3(18, 18, 18);
      temple.position = new BABYLON.Vector3(50, 3.5, -45);
      temple.rotation = new BABYLON.Vector3(0, -3.14, 0);
      shadowGenerator.addShadowCaster(temple);
      const templeBox = new BABYLON.MeshBuilder.CreateBox('templeBox', {width: 38, height: 10, depth: 38}, scene)
      templeBox.position = new BABYLON.Vector3(50, 5.5, -45);
      templeBox.isVisible = false;
      templeBox.physicsImpostor = new BABYLON.PhysicsImpostor(templeBox, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
      }, scene);
      temple.physicsImpostor = new BABYLON.PhysicsImpostor(temple, BABYLON.PhysicsImpostor.NoImpostor, {
        mass: 0
      }, scene);
      temple.addChild(templeBox);
    })
    //Create Archery
    new BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./public/",
      "Archery.gltf", scene).then((result) => {
      const [archery] = result.meshes;
      archery.scaling = new BABYLON.Vector3(18, 18, 18);
      archery.position = new BABYLON.Vector3(100, 3.5, -90);
      archery.rotation = new BABYLON.Vector3(0, 0, 0);
      shadowGenerator.addShadowCaster(archery);
      const archeryBox = new BABYLON.MeshBuilder.CreateBox('archeryBox', {width: 28, height: 10, depth: 10}, scene)
      archeryBox.position = new BABYLON.Vector3(97, 5.5, -100);
      archeryBox.isVisible = false;
      archeryBox.physicsImpostor = new BABYLON.PhysicsImpostor(archeryBox, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
      }, scene);
      const archery1Box = new BABYLON.MeshBuilder.CreateBox('archery1Box', {width: 12, height: 10, depth: 25}, scene)
      archery1Box.position = new BABYLON.Vector3(112, 5.5, -93);
      archery1Box.isVisible = false;
      archery1Box.physicsImpostor = new BABYLON.PhysicsImpostor(archery1Box, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
      }, scene);
      archery.physicsImpostor = new BABYLON.PhysicsImpostor(archery, BABYLON.PhysicsImpostor.NoImpostor, {
        mass: 0
      }, scene);
      const fenceBox = new BABYLON.MeshBuilder.CreateBox('fenceBox', {width: 0.5, height: 3, depth: 27}, scene)
      fenceBox.position = new BABYLON.Vector3(85, 3.5, -92);
      fenceBox.isVisible = false;
      fenceBox.physicsImpostor = new BABYLON.PhysicsImpostor(fenceBox, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
      }, scene);
      archery.physicsImpostor = new BABYLON.PhysicsImpostor(archery, BABYLON.PhysicsImpostor.NoImpostor, {
        mass: 0
      }, scene);
      archery.addChild(archeryBox);
      archery.addChild(archery1Box);
      archery.addChild(fenceBox);
    })
    //Create Barracks
    new BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./public/",
      "Barracks.gltf", scene).then((result) => {
      const [barrack] = result.meshes;
      barrack.scaling = new BABYLON.Vector3(18, 18, 18);
      barrack.position = new BABYLON.Vector3(0, 3.5, -90);
      barrack.rotation = new BABYLON.Vector3(0, 0, 0);
      shadowGenerator.addShadowCaster(barrack);
      const barrackBox = new BABYLON.MeshBuilder.CreateBox('barrackBox', {width: 30, height: 10, depth: 8}, scene)
      barrackBox.position = new BABYLON.Vector3(0, 5.5, -89.5);
      barrackBox.isVisible = false;
      barrackBox.physicsImpostor = new BABYLON.PhysicsImpostor(barrackBox, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
      }, scene);
      const barrack1Box = new BABYLON.MeshBuilder.CreateBox('barrack1Box', {width: 13, height: 10, depth: 30}, scene)
      barrack1Box.position = new BABYLON.Vector3(0, 5.5, -89.5);
      barrack1Box.isVisible = false;
      barrack1Box.physicsImpostor = new BABYLON.PhysicsImpostor(barrack1Box, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
      }, scene);
      barrack.physicsImpostor = new BABYLON.PhysicsImpostor(barrack, BABYLON.PhysicsImpostor.NoImpostor, {
        mass: 0
      }, scene);
      barrack.addChild(barrackBox);
      barrack.addChild(barrack1Box);
    });
//Create towerHouse
    const createTowerHouse = (x, z) => {
      new BABYLON.SceneLoader.ImportMeshAsync(
        null,
        "./public/",
        "TowerHouse.gltf", scene).then((result) => {
        const [towerHouse] = result.meshes;
        towerHouse.scaling = new BABYLON.Vector3(18, 18, 18);
        towerHouse.position = new BABYLON.Vector3(x, 3.5, z);
        towerHouse.rotation = new BABYLON.Vector3(0, -3.14, 0);
        shadowGenerator.addShadowCaster(towerHouse);
        const towerHouseBox = new BABYLON.MeshBuilder.CreateBox('towerHouseBox', {
          width: 20,
          height: 10,
          depth: 20
        }, scene)
        towerHouseBox.position = new BABYLON.Vector3(x, 5.5, z);
        towerHouseBox.isVisible = false;
        towerHouseBox.physicsImpostor = new BABYLON.PhysicsImpostor(towerHouseBox, BABYLON.PhysicsImpostor.BoxImpostor, {
          mass: 0
        }, scene);
        towerHouse.physicsImpostor = new BABYLON.PhysicsImpostor(towerHouse, BABYLON.PhysicsImpostor.NoImpostor, {
          mass: 0
        }, scene);
        towerHouse.addChild(towerHouseBox);
      })
    }
    createTowerHouse(65, -95);
    createTowerHouse(32, -95);
//Create chest
    const treasureArray = []
    const createTreasure = (x, z) => {
      new BABYLON.SceneLoader.ImportMeshAsync(
        null,
        "./public/",
        "Chest.gltf",
        scene).then((result) => {
        let [treasure] = result.meshes;
        shadowGenerator.addShadowCaster(treasure)
        treasure.position = new BABYLON.Vector3(x, 3.5, z);
        treasure.scaling = new BABYLON.Vector3(2, 2, 2);
        treasureArray.push(result.meshes[2])
      })
    }
    for (let i = 0; i < countTreasure; i++) {
      if (i >= countTreasure / 2) {
        createTreasure((Math.floor(Math.random() * 100) + 1), (Math.floor(Math.random() * 100) + 1));
        countAll.innerHTML = countTreasure;
      } else {
        createTreasure((Math.floor(Math.random() * 100) + 1), (Math.floor(Math.random() * -100) - 1));
        countAll.innerHTML = countTreasure;
      }

    }

//Персонаж
    const person = new BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./public/",
      "Pirate_Male.gltf",
      scene
    ).then((result) => {
      const [playerRoot] = result.meshes;
      playerRoot.position = new BABYLON.Vector3(-56, 3.5, 0)
      shadowGenerator.addShadowCaster(playerRoot);
      const playerBox = new BABYLON.MeshBuilder.CreateBox('playerBox', {width: 1.5, height: 3, depth: 1.5}, scene)
      playerBox.position = new BABYLON.Vector3(-56, 5, 0)
      playerBox.isVisible = false;
      playerRoot.addChild(playerBox);
      runAudio.attachToMesh(playerBox);
      fastRunAudio.attachToMesh(playerBox);
      playerBox.physicsImpostor = new BABYLON.PhysicsImpostor(playerBox, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0
      }, scene);
      playerRoot.physicsImpostor = new BABYLON.PhysicsImpostor(playerRoot, BABYLON.PhysicsImpostor.NoImpostor, {
        mass: 120,
        restitution: 1,
        friction: 5
      }, scene);
      const playIdle = (play) => {
        result.animationGroups.forEach((ag) => {
          if (ag.name === "Idle") {
            ag.start(true);
          } else {
            ag.stop();
          }
        });
      };
      const playRun = () => {
        result.animationGroups.forEach((ag) => {
          if (ag.name === "Run") {
            ag.start(true);
          } else {
            ag.stop();
          }
        });
      };
      const playDeath = () => {
        result.animationGroups.forEach((ag) => {
          if (ag.name === "Death") {
            ag.start(true);
          } else {
            ag.stop();
          }
        });
      };
      playIdle()
      playerRoot.rotationQuaternion = new BABYLON.Quaternion.Identity();
      const targetPoint = playerRoot.position.clone();
      const targetRotation = playerRoot.rotationQuaternion.clone();


      let speed = 8;
      const rotLerpSpeed = 16;
      const rotAmount = 5;
      const maxDelta = speed * 0.015;

      const axis = {
        f: 0,
        r: 0,
      };

      const keys = {
        KeyW: 1,
        KeyS: -1,
        KeyA: -1,
        KeyD: 1,
      };

      const pressedKeys = {};

      scene.onKeyboardObservable.add((eventData) => {

        const code = eventData.event.code;

        if (code === 'ShiftLeft' && eventData.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
          speed = 16;
        } else if (code === 'ShiftLeft' && eventData.type === BABYLON.KeyboardEventTypes.KEYUP) {
          speed = 8;
        }
        const getKey = (c) => {
          return !!pressedKeys[c] ? keys[c] : 0;
        };

        if (eventData.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
          pressedKeys[code] = 1;
        } else if (eventData.type === BABYLON.KeyboardEventTypes.KEYUP) {
          pressedKeys[code] = 0;
        }

        axis.f = getKey("KeyW") + getKey("KeyS");
        axis.r = getKey("KeyA") + getKey("KeyD");
      });
      scene.onBeforeRenderObservable.add(() => {

        for (let i = 0; i < treasureArray.length; i++) {
          if (playerBox.intersectsMesh(treasureArray[i])) {
            if (treasureArray[i].parent) {
              treasureArray[i].parent.dispose();
              countProgress.innerHTML = parseInt(++countProgress.innerHTML);
              treasureAudio.play()
              if(countProgress.innerHTML == treasureArray.length){
                victoryAudio.play();
              }
            }
          }
        }

        const deltaTime = (scene.deltaTime ?? 1) / 1000;


        if (Math.abs(axis.f) > 0.001) {
          const nextPoint = playerRoot.position.add(
            playerRoot.forward.scale(axis.f * 0.3)
          );

          targetPoint.copyFrom(nextPoint);
        }

        if (Math.abs(axis.r) > 0.001) {
          targetRotation.multiplyInPlace(
            BABYLON.Quaternion.RotationAxis(
              BABYLON.Vector3.UpReadOnly,
              axis.r * rotAmount * deltaTime
            )
          );
        }

        BABYLON.Quaternion.SlerpToRef(
          playerRoot.rotationQuaternion,
          targetRotation,
          rotLerpSpeed * deltaTime,
          playerRoot.rotationQuaternion
        );

        const diff = targetPoint.subtract(playerRoot.position);
        if (diff.length() < maxDelta) {
          playIdle();
          runAudio.stop()
          fastRunAudio.stop()
          return;
        }
        if (!runAudio.isPlaying) {
          runAudio.play()
          if(!(fastRunAudio.isPlaying) && speed === 16){
            fastRunAudio.play()
          }
        }
        playRun();
        const dir = diff.normalize();

        const velocity = dir.scale(speed * deltaTime);
        playerRoot.position.addInPlace(velocity);

        camera.target.copyFrom(playerRoot.position);
        camera.target.y += CAMERA_HEIGHT;
      });
    });
    //Restart
    gameOverScreen.addEventListener('click', ()=>{
      window.location.reload();
    })
    // Timer
    const startTimer = (time) => {
      let nowDate = new Date().getMinutes();
      let countDownTime = new Date().setMinutes(nowDate + time)
      let updateTimer = setInterval(() => {
        // Получаем текущее дату и время
        let now = new Date().getTime();
        // Находим разницу между текущим временем и заданным
        let difference = countDownTime - now;

        // Рассчитываем дни, часы, минуты и секунды
        let minutesDif = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let secondsDif = Math.floor((difference % (1000 * 60)) / 1000);
        // Вставляем значения в таймер
        timer.innerHTML = `${minutesDif}:${secondsDif}`

        // Когда таймер дойдет до заданной даты и времени
        if (minutesDif === 0 && secondsDif > 0) {
          timer.classList.add('active')
          timer.style.animation = 'timeOutAnim 1.0s ease-in infinite';
          fonAudio.stop();
          if(!timeOutAudio.isPlaying){
            timeOutAudio.play()
          }
        }else{
          timeOutAudio.stop()
          if(!fonAudio.isPlaying){
            fonAudio.play()
          }
        }
        if (difference < 0) {
          clearInterval(updateTimer);
          timer.style.animation='none';
          timer.innerHTML = "0:0"
          gameOverScreen.style.display = 'flex'
          gameOverAudio.play();
        }
        // Обновляем функцию с интервалом 1 секунда
      }, 100);
    }

    startTimer(time);

    // Water
    const waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 1024, 1024, 32, scene, false);
    const water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(1024, 1024));
    water.backFaceCulling = true;
    water.bumpTexture = new BABYLON.Texture("img/waterbump.png", scene);
    water.windForce = -5;
    water.waveHeight = 0.5;
    water.bumpHeight = 0.5;
    water.waveLength = 0.1;
    water.colorBlendFactor = 0;
    water.addToRenderList(skybox);
    water.addToRenderList(sand);
    waterMesh.material = water;

    return scene;
  };

  createScene().then((scene) => {
    async function addInspectorForScene(scene) {
      const switchDebugLayer = () => {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show({overlay: true});
        }
      };

      // hide/show the Inspector
      window.addEventListener("keydown", async (ev) => {
        // Shift+Ctrl+Alt+I
        if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
          const debuggerScript = document.querySelector("script[inspector]");

          if (!debuggerScript) {
            console.log(`Start loading inspector...`);
            const s = document.createElement("script");
            s.setAttribute("inspector", "true");
            s.src =
              "https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js";

            s.onload = () => {
              console.log(`Inspector loaded!`);
              switchDebugLayer();
            };
            s.onerror = () => {
              console.log(`Inspector failed to load`);
            };
            document.body.appendChild(s);
            return;
          }

          switchDebugLayer();
        }
      });
    }

    addInspectorForScene(scene);

    engine.runRenderLoop(function () {
      if (scene) {
        scene.render();
        window.addEventListener('keydown', ()=>{
          if(!BABYLON.Engine.audioEngine.unlocked){
            BABYLON.Engine.audioEngine.unlock();
            BABYLON.Engine.audioEngine.setGlobalVolume(1)
          }
        })
      }
    });
  });
// Resize
  window.addEventListener("resize", function () {
    engine.resize();
  });
}
startGame(5, 10)
