//  ____  _     _         _     
// / ___|| |__ (_)_ __   (_)___ 
// \___ \| '_ \| | '_ \  | / __|
//  ___) | | | | | |_) | | \__ \
// |____/|_| |_|_| .__(_)/ |___/
//               |_|   |__/     
//
//   Implements the Zonn.io ships.  This file will undoubtedly grow dramatically
//   over time as the ships are matured.  Very cool.  Note that the constructor
//   is all of the way to the end because the member functions are defined above
//   it.
//

//   ____                _              _       
//  / ___|___  _ __  ___| |_ __ _ _ __ | |_ ___ 
// | |   / _ \| '_ \/ __| __/ _` | '_ \| __/ __|
// | |__| (_) | | | \__ \ || (_| | | | | |_\__ \
//  \____\___/|_| |_|___/\__\__,_|_| |_|\__|___/
//                                              
var SHIP_INITIAL_MASS = 100;
var SHIP_MAX_MASS = 10000;
var SHIP_GENERATIONS = 4;
var SHIP_LEVELS_PER_GENERATION = 3;
var SHIP_LEVELS = SHIP_GENERATIONS * SHIP_LEVELS_PER_GENERATION;

//
// shipMassToLevel() - The main function that converts a given mass to
//                     a level.  Note that the function is smooth, but not
//                     linear.  In this function, a level 1 ship (the lowest
//                     level) is of mass SHIP_INITIAL_MASS.  The SHIP_GROWTH_EXPONENT
//                     is the exponent for the growth rate of the ship.
function shipMassToLevel(mass)
{

}

//
// shipMassToSize() - Closely related to shipMassToLevel() this routine converts
//                    ship's mass to a size.  The size is in "world units" and
//                    should be used to render a ship continuously from level to
//                    level.  Note, though
function shipMassToLevel(mass)
{

}

// just to save on math, here are the points of the ship:
//
//                    .  A
//                   / \
//                  /   \
//                 /     \
//                /       \
//             D /         \ B
//               \         /
//                '-_   _-'
//                   'v'
//                    C
//
//  The defined size of a ship is 60x90 with (0,0) at the center.
//  Coordinates of the standard ship body are below.
//
var ShipA = { x:0,  y:-45};
var ShipB = { x:30, y:30 };
var ShipC = { x:0,  y:45 };
var ShipD = { x:-30,y:30 };

//
// The ship shield draws a pretty rounded shield around the body..
// To make it easy, the math is done during load time.
//
var shield_angleA = Math.atan(7.5/3);
var shield_angleB = Math.atan(-2);
var shield_angleC = (shield_angleA-shield_angleB)/2;

var shield_sin_angleA = Math.sin(shield_angleA);
var shield_cos_angleA = Math.cos(shield_angleA);
var shield_sin_angleB = Math.sin(shield_angleB);
var shield_cos_angleB = Math.cos(shield_angleB);
var shield_sin_angleC = Math.sin(shield_angleC);
var shield_cos_angleC = Math.cos(shield_angleC);

//
// shieldRound() - generates a  pretty rounded shield of the given color
//                 and returns it.
//
function ShipShieldRound(game,thickness,color)
{
    var shield;

    // in addition to the standard points for the ship, there
    // are the shield points used to draw the shield.  Note that
    // these points are drawn repeated during shield generation.
    //
    //                    .  A   a1
    //                   / \
    //                  /   \
    //                 /     \
    //                /       \      a2
    //             D /         \ B      c
    //               \         /     b1
    //                '-_   _-'    
    //                   'v'         
    //                    C   b2

    shield = game.add.graphics(0,0);
//    shield.renderable = false;

    alpha_start = .5
    alpha_step = 1/thickness/4;

    for(i=0, alpha=alpha_start;i < thickness && alpha > 0; i+=.5, alpha = alpha - alpha_step) {
	shield.lineStyle(1,color,alpha);

	a1 = { x:shield_sin_angleA*i+ShipA.x, y:-shield_cos_angleA*i+ShipA.y };
	a2 = { x:shield_sin_angleA*i+ShipB.x, y:-shield_cos_angleA*i+ShipB.y };
	b1 = { x:shield_cos_angleB*i+ShipB.x, y:-shield_sin_angleB*i+ShipB.y };
	b2 = { x:shield_cos_angleB*i+ShipC.x, y:-shield_sin_angleB*i+ShipC.y };

	c = { x:shield_sin_angleC*i+ShipB.x,  y:shield_cos_angleC*i+ShipB.y };

	shield.moveTo(a1.x,a1.y);
	shield.lineTo(a2.x,a2.y);
	shield.quadraticCurveTo(c.x,c.y,b1.x,b1.y);
	shield.lineTo(b2.x,b2.y);
	shield.quadraticCurveTo(ShipC.x,ShipC.y+i,-b2.x,b2.y);
	shield.lineTo(-b1.x,b1.y);
	shield.quadraticCurveTo(-c.x,c.y,-a2.x,a2.y);
	shield.lineTo(-a1.x,a1.y);
	shield.quadraticCurveTo(ShipA.x,ShipA.y-i*2,a1.x,a1.y);   // extra *2 to make the point more covered
    }

    return(shield);
}

//
// shieldPointy() - generates a pretty shield of the given color
//
function ShipShieldPointy(game,thickness,color)
{
    var shield = game.add.graphics(0,0);
    var poly;

    shield.renderable = false;

    step = 1/thickness;

    for(i=0, alpha=1;i < thickness; i++, alpha = alpha - step) {
	shield.lineStyle(1,color,alpha);
	poly = new Phaser.Polygon(ShipA.x,ShipA.y-i,
				  ShipB.x+i,ShipB.y,
				  ShipC.x,ShipC.y+i,
				  ShipD.x-i,ShipD.y,
				  ShipA.x,ShipA.y-i);
	shield.drawPolygon(poly.points);
    }

    return(shield);
}

//
// body() - generates the body of the ship
//
function ShipBody(game,color)
{
    var ship;
    var poly;

    var lineWidth = 5;
    var fillAlpha = .9

    console.log("calling ShipBody()");

    ship = game.add.graphics(0,0);
    ship.renderable = false;

    poly = new Phaser.Polygon(ShipA,ShipB,ShipC,ShipD,ShipA);

    ship.beginFill(0x000000);  // black
    ship.fillAlpha = fillAlpha;
    ship.lineStyle(lineWidth,color,1);  // 0x00ff00 is green
    ship.drawPolygon(poly.points);
    ship.endFill();

    return(ship);
}

function floopy(game,thickness,shieldColor)
{
    console.log("floopy!");
}

function insideDecoration(game,color,level)
{
    var decoration;
    var lineWidth = 4;

    console.log("calling insideDecoration() with " + level);

    decoration = game.add.graphics(0,0);
    decoration.lineStyle(lineWidth,color,1);  // 0x00ff00 is green
    decoration.renderable = false;

    switch(level) {
      case 1:
	var control = { x:0, y:30 }
	decoration.moveTo(ShipA.x,ShipA.y)
	decoration.quadraticCurveTo(control.x,control.y,ShipD.x,ShipD.y);
	decoration.moveTo(ShipA.x,ShipA.y)
	decoration.quadraticCurveTo(control.x,control.y,ShipB.x,ShipB.y);
	break;
      default:
	break;
    }

    return(decoration);
}


//
// Ship (constructor) - creates a new pretty ship of the given generation and level
//                      with full shield.  Note that you don't provide coordinates
//                      for the ship originally.  The ship is created with renderable
//                      set to false - or "disabled".
//
function Ship(game,color,shieldColor)
{
    var shieldThickness = 10;

    this.scaleValue = 1;
    this.shieldLevelValue = 1;
    this.levelValue = 1
    this.massValue = SHIP_INITIAL_MASS;
    this.angleValue = 0;

    this.shield = ShipShieldRound(game,shieldThickness,shieldColor);   // drawn before the body
    this.body = ShipBody(game,color);
    this.decoration = insideDecoration(game,color,this.levelValue);

    this.group = new Phaser.Group(game);
    this.group.add(this.shield,true);
    this.group.add(this.body,true);
    this.group.add(this.decoration,true);

//    this.group.renderable = true;

    return(this);
}

Object.defineProperties(Ship.prototype, { 

    "scale": { set: function(x) { this.group.scale.set(x); this.scaleValue = x;},
	       get: function() { return(this.scaleValue); } },

    "shieldLevel": { set: function(x) { if(x<0) {
	                                     x=0;
                                        } else if(x>1) {
					     x=1;
					} 
					this.shield.alpha = x; 
					this.shieldLevelValue = x; 
				      },
		     get: function() { return(this.shieldLevelValue); } },

    "level": { set: function(x) { this.levelValue = x;},
	       get: function() { return(this.levelValue); } },

    "mass": { set: function(x) { this.massValue = x;},
	      get: function() { return(this.massValue); } },

    "angle": { set: function(x) { this.group.angle = x; this.angleValue = x;},
	      get: function() { return(this.angleValue); } },

} );
