// export {buccoli,
//         cappelletti, 
//         cavatelli, 
//         casarecce,
//         castellane,
//         chifferi_rigati, 
//         conchiglioni_rigati,
//         corallini_lisci,
//         ditali_rigati, 
//         farfalline,
//         farfalle, // needs work,
//         fagottini, 
//         festonati,
//         fusili,
//         funghini, 
//         galletti,
//         gemelli,
//         giglio_ondulato,
//         gnocchetti_sardi,
//         gnocchi, 
//         lancette,
//         lasagna, 
//         lumaconi_rigati, 
//         orecchiette,
//         penn_rigate,
//         puntalette,
//         quadrefiore,
//         riccioli, 
//         spirali,
//         tortellini,
//         saccottini,
//         spaccatelle, 
//         trofie,
//         trottole,
//         // cuoretti,  // maybe not required?
// };

// ============= PASTA =====================

var sin = Math.sin, cos = Math.cos, pi = Math.PI;

function buccoli(u0, v0, target) {

    var uMin = -100, uMax = 100, uRange = uMax - uMin,
        vMin = 0, vMax = 25, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = (0.7 + 0.2 * sin(21 * v / 250 * pi)) * cos(u / 20 * pi);

    const y = (0.7 + 0.2 * sin(21 * v / 250 * pi)) * sin(-u / 20 * pi);

    const z = 39 * u / 1000 + 1.5 * sin(v / 50 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function cappelletti(u0, v0, target) {

    var uMin = 0, uMax = 40, uRange = uMax - uMin,
        vMin = 0, vMax = 120, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = (0.1 + sin(3 * u / 160 * pi)) * cos(2.3 * v / 120 * pi);

    const y = (0.1 + sin(3 * u / 160 * pi)) * sin(2.3 * v / 120 * pi);

    const z = 0.1 + v / 400 + (0.3 - 0.231 * u / 40) * cos(u / 20 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function casarecce(u0, v0, target) {

    var uMin = 0, uMax = 200, uRange = uMax - uMin,
        vMin = 0, vMax = 50, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = (u <= 30) ? 0.5 * cos(v / 30 * pi) + 0.5 * cos((2 * u + v + 16) / 40 * pi) : cos(v / 40 * pi) + 0.5 * cos(v / 30 * pi) + 0.5 * sin((2 * u - v) / 40 * pi);

    const y = (u <= 30) ? 0.5 * sin(v / 30 * pi) + 0.5 * sin((2 * u + v + 16) / 40 * pi) : sin(v / 40 * pi) + 0.5 * sin(v / 30 * pi) + 0.5 * cos((2 * u - v) / 40 * pi);

    const z = v / 4 * sin((v + 50) / 200 * pi) - 6;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function castellane(u0, v0, target) {

    var uMin = 0, uMax = 60, uRange = uMax - uMin,
        vMin = 0, vMax = 120, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = [0.3 * sin(v / 120 * pi) * Math.abs(cos((v + 3) / 6 * pi)) + u ** 2 / 720 * (sin(2 * v / 300 * pi) ** 2 + 0.1) + 0.3] * cos(7 * u / 150 * pi);

    const y = [0.3 * sin(v / 120 * pi) * Math.abs(cos((v + 3) / 6 * pi)) + u ** 2 / 720 * (sin(2 * v / 300 * pi) ** 2 + 0.1) + 0.3] * sin(7 * u / 150 * pi);

    const z = 12 * cos(v / 120 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function cavatelli(u0, v0, target) {

    var uMin = 0, uMax = 200, uRange = uMax - uMin,
        vMin = 0, vMax = 30, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 0.5 * cos(u / 100 * pi);
    var b = v / 60 * sin(u / 100 * pi);

    const x = 3 * (1 - sin(a * pi)) * cos(a * 0.99 * pi + 0.9 * pi)
        + 0.05 * cos(u / 2 * pi);

    const y = 3 * (sin(a * pi)) * sin(a * 0.99 * pi + 0.63 * pi)
        + 0.05 * cos(u / 2 * pi);

    const z = 4 * b * (5 - sin(a * pi));

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function chifferi_rigati(u0, v0, target) {

    var uMin = 0, uMax = 200, uRange = uMax - uMin,
        vMin = 0, vMax = 45, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = (0.45 + 0.3 * cos(u / 100 * pi) + 0.005 * cos((2 * u) / 5 * pi)) * cos(v / 45 * pi) + 0.15 * (v / 45) ** 10 * cos(v / 100 * pi) ** 3;

    const y = (0.35 + v / 300) * sin(u / 100 * pi) + 0.005 * sin(2 * u / 5 * pi);

    const z = (0.4 + 0.3 * cos(u / 100 * pi)) * sin(v / 45 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function conchiglioni_rigati(u0, v0, target) {

    var uMin = 0, uMax = 40, uRange = uMax - uMin,
        vMin = 0, vMax = 200, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 0.25 * sin(v / 200 * pi) * cos((v + 4) / 4 * pi);
    var b = (u / 40) * (0.1 + 0.1 * (sin(v / 200 * pi) ** 6)) * pi;
    var g = 2.5 *
        cos(v / 100 * pi) +
        3 * (sin((40 - u) / 80 * pi) ** 10) *
        (sin(v / 200 * pi) ** 10) *
        sin((v + 150) / 100 * pi);

    const x = a +
        (10 + 30 * sin(v / 200 * pi)) *
        sin((40 - u) / 40 * (0.3 + Math.pow(sin(v / 300 * pi), 3)) * pi)
        * sin(b) + cos(v / 100 * pi);

    const y = a +
        (10 + 30 * sin(v / 200 * pi)) *
        cos((40 - u) / 40 * (0.3 + Math.pow(sin(v / 300 * pi), 3)) * pi)
        * sin(b) + g;

    const z = 30 * cos(v / 200 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}


function corallini_lisci(u0, v0, target) {

    var uMin = 0, uMax = 100, uRange = uMax - uMin,
        vMin = 0, vMax = 25, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = 0.8 * cos(u / 50 * pi);

    const y = 0.8 * sin(u / 50 * pi) / 2 + 0.4 * sin(u / 50 * pi);

    const z = 3 * v / 50 - 1.5;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

// function cuoretti(u0, v0,target){

//     var uMin = 0, uMax = 300, uRange = uMax - uMin,
//         vMin = 0, vMax = 10,  vRange = vMax - vMin;

//     var u = uRange * u0 + uMin;
// 	var v = vRange * v0 + vMin;

//     const x = 2 * cos(u / 150 * pi) - 
//               cos( u / 75 * pi) -
//               Math.pow(sin(u / 300 * pi), 150) - 
//               Math.pow(cos(u / 300 * pi), 5);

//     const y = 2 * sin(u / 150 * pi) - 
//               sin(u / 75 * pi);

//     const z = v/10;

//     if ( isNaN(x) || isNaN(y) || isNaN(z) )
// 			return target.set( 0,0,0); // TODO: better fix
// 		else
// 			return target.set( x, y, z );
// }

function ditali_rigati(u0, v0, target) {

    var uMin = 0, uMax = 203, uRange = uMax - uMin,
        vMin = 0, vMax = 25, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = cos(u / 100 * pi) +
        0.03 * cos(7 * u / 40 * pi) +
        0.25 * cos(v / 50 * pi);

    const y = 1.1 * sin(u / 100 * pi) +
        0.03 * sin(7 * u / 40 * pi) +
        0.25 * sin(v / 50 * pi);

    const z = v / 10 - 1.5;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function fagottini(u0, v0, target) {

    var uMin = 0, uMax = 200, uRange = uMax - uMin,
        vMin = 0, vMax = 45, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = [(0.8 + sin(u / 100 * pi) ** 8 - 0.8 * cos(u / 25 * pi)) ** 1.5 + 0.2 + 0.2 * sin(u / 100 * pi)];

    var b = [(0.9 + cos(u / 100 * pi) ** 8 - 0.9 * cos(u / 25 * pi + 0.03 * pi)) ** 1.5 + 0.3 * cos(u / 100 * pi)];

    var g = 4 - 4 * v / 500 * (1 + cos(u / 100 * pi) ** 8 - 0.8 * cos(u / 25 * pi)) ** 1.5;

    const x = cos(u / 100 * pi) * (a * sin(v / 100 * pi) ** 8 + 0.6 * (2 + sin(u / 100 * pi) ** 2) * sin(v / 50 * pi) ** 2);

    const y = sin(u / 100 * pi) * (b * sin(v / 100 * pi) ** 8 + 0.6 * (2 + cos(u / 100 * pi) ** 2) * sin(v / 50 * pi) ** 2);

    const z = (1 + sin(v / 100 * pi - 0.5 * pi)) * (g - 4 * v / 500 * (1 + sin(u / 100 * pi) ** 8 - 0.8 * cos(u / 25 * pi)) ** 1.5);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}


function festonati(u0, v0, target) {

    var uMin = 0, uMax = 100, uRange = uMax - uMin,
        vMin = -40, vMax = 40, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = 5 * cos(u / 50 * pi) + 0.5 * cos(u / 50 * pi) * (1 + sin(v / 100 * pi)) + 0.5 * cos((u + 25) / 25 * pi) * (1 + sin(v / 5 * pi));

    const y = 5 * sin(u / 50 * pi) + 0.5 * sin(u / 50 * pi) * (1 + sin(v / 100 * pi)) + 0.5 * sin(u / 25 * pi) * (1 + sin(v / 5 * pi));

    const z = v / 2 + 2 * sin((3 * u + 25) / 50 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function funghini(u0, v0, target) {

    var uMin = 0, uMax = 300, uRange = uMax - uMin,
        vMin = 0, vMax = 30, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 5 * cos(u / 150 * pi) + 0.05 * cos(u / 3 * pi) * sin(v / 60 * pi) ** 2000;
    var b = v / 30 * (5 * sin(u / 150 * pi) + 0.05 * sin(u / 3 * pi));
    var g = v / 10 * (2 * sin(u / 150 * pi) + 0.05 * sin(u / 3 * pi));
    var e = (u <= 150) ? b : ((v <= 10) ? g : 2 * sin(u / 150 * pi) + 0.05 * sin(u / 6 * pi));

    const x = 0.05 * cos(a / 5 * pi) + 0.3 * cos(a / 5 * pi) * sin(3 * e / 50 * pi) ** 2;

    const y = 0.01 * sin(a / 5 * pi) + 0.3 * sin(a / 5 * pi) * sin(3 * e / 50 * pi) ** 2;

    const z = 0.25 * sin((e + 3) / 10 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function fusili(u0, v0, target) {

    var uMin = -100, uMax = 100, uRange = uMax - uMin,
        vMin = 0, vMax = 25, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = 6 * cos((3 * u + 10) / 100 * pi) * cos(v / 25 * pi);

    const y = 6 * sin((3 * u + 10) / 100 * pi) * cos(v / 25 * pi);

    const z = 3 * u / 20 + 2.5 * cos((v + 12.5) / 25 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}


function galletti(u0, v0, target) {

    var uMin = 0, uMax = 140, uRange = uMax - uMin,
        vMin = 0, vMax = 70, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var f = function (x) {
        return ((1 + sin(x * pi + 1.5 * pi)) / 2) ** 5
    };

    var a = 0.4 * sin(f(u / 140) * pi + 0.5 * pi) ** 1000 * cos(v / 70 * pi);
    var b = 0.15 * sin(f(u / 140) * pi + 0.5 * pi) ** 1000 * cos(v / 7 * pi);
    var g = 0.4 * cos(f(u / 140) * pi) ** 1000 * sin(v / 70 * pi);

    const x = (0.5 + 0.3 * cos(f(u / 140) * 2 * pi)) * cos(v / 70 * pi) + 0.15 * (v / 70) ** 10 * cos(f(u / 140) * 2 * pi) ** 3 + a;

    const y = 0.35 * sin(f(u / 140) * 2 * pi) + 0.15 * v / 70 * sin(f(u / 140) * 2 * pi) + b;

    const z = (0.4 + 0.3 * cos(f(u / 140) * 2 * pi)) * sin(v / 70 * pi) + g;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}


function gemelli(u0, v0, target) {

    var uMin = -50, uMax = 50, uRange = uMax - uMin,
        vMin = 0, vMax = 50, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = 6 * cos(v / 50 * 1.9 * pi + 0.55 * pi) * cos(3 * u / 25);

    const y = 6 * cos(v / 50 * 1.9 * pi + 0.55 * pi) * sin(3 * u / 25);

    const z = 8 * sin(v / 50 * 1.9 * pi + 0.55 * pi) + 3 * u / 4;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function giglio_ondulato(u0, v0, target) {

    var uMin = 0, uMax = 150, uRange = uMax - uMin,
        vMin = 0, vMax = 40, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 0.6 + 0.03 * ((40 - v) / 40) ** 10 * cos((4 * u + 75) / 15 * pi) - 0.5 * sin(v / 80 * pi) ** 0.6;
    var b = sin(2 * u / 75 * pi) + (u / 150) ** 10 * (0.08 * sin(v / 40 * pi) + 0.03 * sin(v / 5 * pi));

    const x = a * cos(2 * u / 75 * pi)
        + (u / 150) ** 10 * (0.08 * sin(v / 40 * pi) + 0.03 * cos(v / 5 * pi));
    // ;0.2 * cos(u/50*pi)*sin(v/150*pi)*b;

    const y = (0.6 + 0.03 * ((40 - v) / 40) ** 10 * sin(4 * u / 15 * pi) - 0.5 * sin(v / 80 * pi) ** 0.6) * b;

    const z = 1.1 * v / 40 + 0.7 * (1 - sin((150 - u) / 300 * pi));

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function gnocchetti_sardi(u0, v0, target) {

    var uMin = 0, uMax = 50, uRange = uMax - uMin,
        vMin = 0, vMax = 150, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 0.8 + 3 * sin(v / 150 * pi) ** 0.8;
    var b = Math.abs(cos((2 * v + 7.5) / 15 * pi));

    const x = a * cos(u / 50 * pi) + 0.2 * cos(u / 50 * pi) * sin(v / 150 * pi) * b;

    const y = a * sin(u / 50 * pi) + 0.2 * sin(u / 50 * pi) * sin(v / 150 * pi) * b;

    const z = 13 * cos(v / 150 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function gnocchi(u0, v0, target) {

    var uMin = 0, uMax = 40, uRange = uMax - uMin,
        vMin = 0, vMax = 130, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = u / 40 * sin(v / 130 * pi);
    var b = Math.abs(cos((v + 13) / 26 * pi));

    const x = 0.2 * cos(u / 40 * 1.3 * pi) * sin(v / 130 * pi) * b + a * cos(u / 40 * 1.3 * pi);

    const y = 0.2 * sin(u / 40 * 1.3 * pi) * sin(v / 130 * pi) * b + a * sin(u / 40 * 1.3 * pi);

    const z = 1.5 * cos(v / 130 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function lancette(u0, v0, target) {

    var uMin = 0, uMax = 50, uRange = uMax - uMin,
        vMin = 0, vMax = 90, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 0.4 * sin(5 * v / 9 * pi);
    var b = sin((v + 45) / 90 * pi);
    var g = ((3 * u - 75) / 5) * sin(v / 90 * pi) - (1 - sin(u / 50 * pi)) ** 25 * a * b;
    var e = (u <= 25) ? g : 30 * (u - 25) / 50 * sin(v / 90 * pi) + sin((u - 25) / 50 * pi) * a * b;

    const x = 4 * cos(3 * e / 50 * pi)

    const y = 4 * sin(3 * e / 50 * pi) * (0.3 + (1 - sin(v / 90 * pi)) ** 0.6);

    const z = v / 3 - 15;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function lasagna(u0, v0, target) {

    var uMin = 0, uMax = 50, uRange = uMax - uMin,
        vMin = 0, vMax = 150, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var x = 7 * u / 18;

    var y = v / 3;

    var z = (u < 10) ? ((10 - u) / 10) * cos((v + 5) / 12 * pi) :
        (u > 40) ? ((u - 40) / 10) * cos((v + 15) / 12 * pi) :
            0.1 * cos(u / 4 * pi);

    y = y - 20;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function lumaconi_rigati(u0, v0, target) {

    var uMin = 0, uMax = 240, uRange = uMax - uMin,
        vMin = 0, vMax = 60, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 0.45 + 0.01 * cos(u / 3 * pi) + v / 300 * Math.abs(cos(u / 240 * pi)) * cos(u / 120 * pi) ** 20;
    var b = v / 300 * Math.abs(cos(u / 240 * pi)) * sin(u / 120 * pi) + 0.125 * (v / 60) ** 6 * sin(u / 120 * pi);

    const x = (0.4 * cos(u / 120 * pi) + a) * cos(v / 60 * pi) + 0.48 * (v / 60) ** 6 * sin((u + 60) / 120 * pi) ** 3;

    const y = 0.5 * sin(u / 120 * pi) + 0.01 * sin(u / 3 * pi) + b;

    const z = (0.45 + 0.4 * cos(u / 120 * pi)) * sin(v / 60 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function orecchiette(u0, v0, target) {

    var uMin = 0, uMax = 150, uRange = uMax - uMin,
        vMin = 0, vMax = 15, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = 2 * v / 3 * cos(u / 75 * pi) + 0.3 * cos(2 * u / 15 * pi);

    const y = 10 * sin(u / 75 * pi);

    const z = 0.1 * sin(u / 3 * pi) +
        5 * (0.5 + 0.5 * cos(2 * u / 75 * pi)) ** 4 * cos(v / 30 * pi) ** 2 +
        1.5 * (0.5 + 0.5 * cos(2 * u / 75 * pi)) ** 4 * cos(v / 30 * pi) ** 5 * sin(v / 30 * pi) ** 10;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function penn_rigate(u0, v0, target) {

    var uMin = 0, uMax = 170, uRange = uMax - uMin,
        vMin = 0, vMax = 45, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = (u < 85) ? 4 * sin(u / 85 * pi) ** 2 + 0.1 * sin(6 * u / 17 * pi) : -4 * sin((u - 85) / 85 * pi) ** 2 + 0.1 * sin((6 / 17) * (u - 85) * pi);

    const y = (u < 85) ? 4 * cos(u / 85 * pi) + 0.1 * cos(6 * u / 17 * pi) : -4 * cos((u - 85) / 85 * pi) + 0.1 * cos((6 / 17) * (u - 85) * pi);

    const z = (u < 85) ? 7 * cos(u / 85 * pi) + 15 * sin((v - 20) / 40 * pi) : -7 * cos((u - 85) / 85 * pi) + 15 * sin((1 / 40) * (v - 20) * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function puntalette(u0, v0, target) {

    var uMin = 0, uMax = 80, uRange = uMax - uMin,
        vMin = 0, vMax = 80, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = 1.4 * sin(v / 80 * pi) ** 1.2 * sin(u / 40 * pi);
    const z = 8 * cos(v / 80 * pi);
    const y = 1.4 * sin(v / 80 * pi) ** 1.2 * cos(u / 40 * pi);


    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function quadrefiore(u0, v0, target) {

    var uMin = 0, uMax = 500, uRange = uMax - uMin,
        vMin = 0, vMax = 50, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = 2 * cos(u / 250 * pi) * Math.abs(sin(3 * u / 250 * pi)) ** 20
        + (0.6 + 0.9 * sin(v / 50 * pi))
        * cos(u / 250 * pi)
        + 0.2 * cos(4 * v / 25 * pi);

    const y = 2 * sin(u / 250 * pi) * Math.abs(sin(3 * u / 250 * pi)) ** 20
        + (0.6 + 0.9 * sin(v / 50 * pi))
        * sin(u / 250 * pi);
    + 1.5 * sin(4 * v / 50 * pi);

    const z = 3 * v / 10 - 8;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function riccioli(u0, v0, target) {

    var uMin = 0, uMax = 60, uRange = uMax - uMin,
        vMin = -80, vMax = 80, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = (2 + 8 * sin(u / 100 * pi) + 9 * sin((11 * v + 100) / 400 * pi) ** 2) * cos(4 * u / 125 * pi);

    const y = (2 + 8 * sin(u / 100 * pi) + 9 * sin((11 * v + 100) / 400 * pi) ** 2) * sin(4 * u / 125 * pi);

    const z = v / 4;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function saccottini(u0, v0, target) {

    var uMin = 0, uMax = 150, uRange = uMax - uMin,
        vMin = 0, vMax = 100, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = cos(u / 75 * pi) * (sin(v / 50 * pi) + 1.3 * sin(v / 200 * pi) + 3 * v / 1000 * cos((u + 25) / 25 * pi));

    const y = sin(u / 75 * pi) * (sin(v / 50 * pi) + 1.3 * sin(v / 200 * pi) + 0.7 * (v / 100) ** 2 * sin(u / 15 * pi));

    const z = 2 * [1 - Math.abs(cos(v / 200 * pi)) ** 5 + (v / 100) ** 4.5] - 2;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function spaccatelle(u0, v0, target) {

    var uMin = 0, uMax = 30, uRange = uMax - uMin,
        vMin = 0, vMax = 120, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = (0.5 + 5 * (v / 100) ** 3 + 0.5 * cos((u + 37.5) / 25 * pi)) * cos(2 * v / 125 * pi);

    const y = 0.6 * sin((u + 37.5) / 25 * pi);

    const z = (0.5 + 5 * (v / 100) ** 3 + 0.5 * cos((u + 37.5) / 25 * pi)) * sin(2 * v / 125 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function spirali(u0, v0, target) {

    var uMin = 0, uMax = 100, uRange = uMax - uMin,
        vMin = -60, vMax = 60, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    const x = (2.5 + 2.0 * cos(u / 50 * pi) + 0.1 * cos(u / 5 * pi)) * cos(v / 30 * pi);

    const y = (2.5 + 2.0 * cos(u / 50 * pi) + 0.1 * cos(u / 5 * pi)) * sin(v / 30 * pi);

    const z = (2.5 + 2.0 * sin(u / 50 * pi) + 0.1 * sin(u / 5 * pi)) + v / 6;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function tortellini(u0, v0, target) {

    var uMin = 0, uMax = 120, uRange = uMax - uMin,
        vMin = 0, vMax = 60, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 0.2 * sin(u / 120 * pi) + v / 400;
    var b = cos(v / 60 * (2.7 + 0.2 * sin(u / 120 * pi) ** 50) * pi + 1.4 * pi);
    var g = sin(v / 60 * (2.7 + 0.2 * sin(u / 120 * pi) ** 50) * pi + 1.4 * pi);

    const x = 0.5 ** (1 + 0.5 * sin(u / 120 * pi)) * cos((11 * u - 60) / 600 * pi) * (1.35 + (3 + sin(u / 120 * pi)) * a * b);

    const y = 0.5 * sin((11 * u - 60) / 600 * pi) * (1.35 + (3 + sin(u / 120 * pi)) * a * b);

    const z = 0.15 + u / 1200 + 0.5 * (0.8 * sin(u / 120 * pi) + v / 400) * sin(u / 120 * pi) * g;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}


function trofie(u0, v0, target) {

    var uMin = -75, uMax = 75, uRange = uMax - uMin,
        vMin = 0, vMax = 50, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 3 * u / 5 + 10 * cos(v / 25 * pi);

    const x = (1 + sin(u / 150 * pi) + 2 * sin(u / 150 * pi) * sin(v / 25 * pi)) * sin(13 * u / 300 * pi);

    const y = (1 + sin(u / 150 * pi) + 2 * sin(u / 150 * pi) * sin(v / 25 * pi)) * cos(13 * u / 300 * pi) + 5 * sin(2 * a / 125 * pi);

    const z = a;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function trottole(u0, v0, target) {

    var uMin = -80, uMax = 80, uRange = uMax - uMin,
        vMin = 0, vMax = 60, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 0.17 - 0.15 * sin(v / 120 * pi) + 0.25 * ((60 - v) / 60) ** 10 * sin(v / 30 * pi);
    var b = 0.17 - 0.15 * sin(v / 120 * pi) + 0.25 * ((60 - v) / 60) ** 10 * sin(v / 30 * pi);
    var g = 0.25 * ((60 - v) / 60) ** 5 * (1 - sin((u - 128) / 160 * pi)) * cos(v / 30 * pi);
    var e = 7 * u / 400 - 48 / 25 + g + (v / 120) * (1 - sin((u - 128) / 64 * pi));


    const x = (u >= 128) ? (a * (1 - sin((u - 128) / 320 * pi))) * cos(7 * u / 160 * pi) : b * cos(7 * u / 160 * pi);

    const y = (u >= 128) ? (a * (1 - sin((u - 128) / 320 * pi))) * sin(7 * u / 160 * pi) : b * sin(7 * u / 160 * pi);

    const z = (u >= 128) ? e : u / 400 + v / 100 + 0.25 * ((60 - v) / 60) ** 5 * cos(v / 30 * pi);

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

function farfalle(u0, v0, target) {

    var uMin = 0, uMax = 70, uRange = uMax - uMin,
        vMin = 0, vMax = 70, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var alpha = 10 * cos((u + 70) / 70 * pi) * (sin(2 * v / 175 * pi + 1.1 * pi)) ** 9;

    var beta = 0.3 * sin(6 * u / 7 * pi + 0.4 * pi);

    var gamma = (17 <= u <= 52) ? 7 * (sin((u + 35) / 35 * pi)) ** 3 * (sin(2 * v / 175 * pi + 1.1 * pi)) ** 9 : alpha;

    var iota = v / 2 + 4 * sin(u / 70 * pi) * sin((v - 10) / 100 * pi) - 4 * sin(u / 70 * pi) * sin((60 - v) / 100 * pi);

    var lambda = v / 2 + 4 * sin(u / 70 * pi) + 0.7 * sin((2 * u + 2.8) / 7 * pi) * sin((v - 60) / 20 * pi);
    var mu = v / 2 - 4 * sin(u / 70 * pi) - 0.7 * sin((2 * u + 2.8) / 7 * pi) * sin((10 - v) / 20 * pi);

    const x = 3 * u / 7 + gamma;
    var y = (v < 10) ? mu :
        (v > 60) ? lambda :
            iota;
    const z = 3 * sin((2 * u + 17.5) / 35 * pi) * (sin(v / 70 * pi) ** 1.5) - 10;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}

// function farfalle(u0, v0,target){

//     var uMin = 0, uMax = 80, uRange = uMax - uMin,
//         vMin = 0, vMax = 80,  vRange = vMax - vMin;

//     var u = uRange * u0 + uMin;
// 	var v = vRange * v0 + vMin;


//     var a = sin((7*u + 16)/40*pi);
//     var b = 7*u/16 + 4*sin(u/80*pi) * sin((v-10)/120*pi);
//     var g = 10*cos((u+80)/80*pi) * sin((v+110)/100*pi)**9;
//     var e = 7*v/16 - 4*sin(u/80*pi) - a * sin((10-v)/20*pi);

//     const x = 3*u/8 + (20 <= u <=60) ? 7*sin((u+40)/40*pi)**3*sin((v + 110)/100*pi)**9 : g;
//     const y = (v < 10) ? e :
//               (v > 70) ? - 4*sin(u/80*pi) - a * sin((10-v)/20*pi) :
//               b - 4*sin(u/80*pi)*sin((70-v)/120*pi);

//     const z = 3*sin((u+110)/100*pi)*sin(v/80*pi)**1.5;

//     if ( isNaN(x) || isNaN(y) || isNaN(z) )
// 			return target.set( 0,0,0); // TODOpasta
//     var alpha = 10*cos((u+80)/80*pi)*sin((v + 110)/100*pi)**9;

//     var beta = 35*v/80 + 4*sin(u/80*pi)*sin((v - 10)/120*pi);

//     const x = 30*u/80 + (20 <= u <= 60) ? 7*(sin((u+40)/40*pi)**3)*(sin((v + 110)/100*pi)**9) : alpha;

//     const y = beta - 4*sin(u/80*pi)*sin((70-v)/120*pi);

//     const z = 3*sin((u + 10)/20*pi)*(sin(v/80*pi)**1.5) - 0.7*((sin(3*v/8*pi) +  1)/2)**4;

//     if ( isNaN(x) || isNaN(y) || isNaN(z) )
// 			return target.set( 0,0,0); // TODO: better fix
// 		else
// 			return target.set( x, y, z );
// }

function farfalline(u0, v0, target) {

    var uMin = 0, uMax = 250, uRange = uMax - uMin,
        vMin = 0, vMax = 50, vRange = vMax - vMin;

    var u = uRange * u0 + uMin;
    var v = vRange * v0 + vMin;

    var a = 30 * cos(u / 125 * pi) + 0.5 * cos(6 * u / 25 * pi);

    var b = 30 * sin(u / 125 * pi) + 0.5 * sin(6 * u / 25 * pi);

    const x = cos(3 * a / 100 * pi);

    const y = 0.5 * sin(3 * a / 100 * pi) * (1 + sin(v / 100 * pi) ** 10);

    const z = b * v / 500;

    if (isNaN(x) || isNaN(y) || isNaN(z))
        return target.set(0, 0, 0); // TODO: better fix
    else
        return target.set(x, y, z);
}