/**
 * Created by XInran Xiao & Caleb An on 3/8/2015.
 */
var outsideWorld;

Physics({
  timestep: 100
}, function (world) {
  outsideWorld = world;

  // bounds of the window
  var viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight)
    ,edgeBounce
    ,renderer
    ;

  // create a renderer
  renderer = Physics.renderer('pixi', {
    width: window.innerWidth,
    height: window.innerHeight,
    el: 'viewport'
  });

  // add the renderer
  world.add(renderer);
  // render on each step
  world.on('step', function () {
    world.render();
  });

  // constrain objects to these bounds
  edgeBounce = Physics.behavior('edge-collision-detection', {
    aabb: viewportBounds
    ,restitution: 0.99
    ,cof: 0.8
  });

  // resize events
  window.addEventListener('resize', function () {
    // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
    viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
    // update the boundaries
    edgeBounce.setAABB(viewportBounds);
  }, true);

  // Add Yorke
  var yorke = Physics.body('circle', {
    x: renderer.width / 2
    ,y: renderer.height / 2 - 240
    ,vx: -0.15
    ,mass: 0.1
    ,radius: 30
    ,styles: {
      fillStyle: '0xcb4b16'
      ,angleIndicator: '0x72240d'
    }
  });
  yorke.view = renderer.createDisplay('sprite', {
    texture: 'images/yorke.png',
    anchor: {
      x: 0.5,
      y: 0.5
    }
  });
  world.add(yorke);

  // Add Earth
  var earth = Physics.body('circle', {
    x: renderer.width / 2
    ,y: renderer.height / 2
    ,radius: 50
    ,mass: 20
    ,vx: 0
    ,vy: 0
    ,styles: {
      fillStyle: '0x6c71c4'
      ,angleIndicator: '0x3b3e6b'
    }
  });
  earth.view = renderer.createDisplay('sprite', {
    texture: 'images/earth.jpg',
    anchor: {
      x: 0.5,
      y: 0.5
    }
  });
  world.add(earth);

  // Add attraction between masses.
  var attractor = Physics.behavior('attractor', {
    order: 0,
    strength: .002
  });

  // Add gravity to the world
  world.add([
    Physics.behavior('newtonian', { strength:.25 }) // Gravitational constant
    ,edgeBounce
  ]);

  var startTime = Date.now();
  var dilationConstant = 1 / Math.sqrt(1 - (Math.pow(150, 2) / Math.pow(3e8, 2)));  // Assuming constant velocity / circular orbit.
  var dilatedTimeElement = $('#dilatedTime');
  var earthTimeElement = $('#earthTime');
  var yorkeTimeElement = $('#yorkeTime');
  var earthTime = 0;
  var yorkeTimer = 0;

  $('#velocity').html(Math.sqrt(Math.pow(yorke.state.vel.x, 2) + Math.pow(yorke.state.vel.y, 2)));
  // subscribe to ticker to advance the simulation
  Physics.util.ticker.on(function( time ) {
    earthTime = time - startTime;
    yorkeTimer = earthTime / dilationConstant;

    dilatedTimeElement.html(earthTime - yorkeTimer);
    earthTimeElement.html(earthTime);
    yorkeTimeElement.html(yorkeTimer);

    world.step( time );
  });
});

function start() {
  Physics.util.ticker.start();
}

function pause() {
  Physics.util.ticker.stop()
}