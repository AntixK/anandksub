import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.136.0-4Px7Kx1INqCFBN0tXUQc/mode=imports,min/optimized/three.js';
import { ParametricGeometry } from "https://cdn.skypack.dev/pin/three@v0.136.0-4Px7Kx1INqCFBN0tXUQc/mode=imports,min/unoptimized/examples/jsm/geometries/ParametricGeometry.js";

const sizes = {
    width: Math.max(Math.min(window.innerWidth / 2,
        window.innerHeight / 2),
        320),
    height: Math.max(Math.min(window.innerWidth / 2,
        window.innerHeight / 2),
        320),
}

const texture_loader = new THREE.TextureLoader().load('/media/art/math-of-pasta/tex1.webp');

const pasta_shapes = [
    {
        "func": buccoli, //done
        "name": "Buccoli",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 200 \\\\[3ex] \
                v =& 0, \\ldots, 25 \\\\[3ex] \
                \\hline \\\\ \
                x =& \\left [ 0.7 + 0.2\\sin \\left(\\frac{21u}{250} \\pi \\right) \\right]\\cos \\left(\\frac{u}{20} \\pi \\right) \\\\[3ex]  \
                y =& \\left [ 0.7 + 0.2\\sin \\left(\\frac{21u}{250} \\pi \\right) \\right]\\sin \\left(\\frac{-u}{20} \\pi \\right) \\\\[3ex] \
                z =&  \\frac{39u}{1000} + 1.5\\sin \\left(\\frac{v}{50} \\pi \\right) \
            \\end{aligned}\
        $$",
        "scale": 0.7,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": cappelletti, // done
        "name": "Cappelletti",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 40 \\\\[3ex] \
                v =& 0, \\ldots, 120 \\\\[3ex] \
                \\hline \\\\ \
                x =& \\left [ 0.1 + \\sin \\left(\\frac{3u}{160} \\pi \\right) \\right]\\cos \\left(\\frac{2.3v}{120} \\pi \\right) \\\\[3ex]  \
                y =& \\left [ 0.1 + \\sin \\left(\\frac{3u}{160} \\pi \\right) \\right]\\sin \\left(\\frac{2.3v}{120} \\pi \\right) \\\\[3ex] \
                z =& 0.1 + \\frac{v}{400} + \\left ( 0.3 - 0.231 \\frac{u}{40}\\right)\\cos\\left( \\frac{u}{20} \\pi \\right) \
            \\end{aligned}\
        $$",
        "scale": 1.0,
        "rot": [1.0, 0.7, 0.5],
    },
    {
        "func": casarecce, // done
        "name": "Casarecce",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 200 \\\\[3ex] \
                v =& 0, \\ldots, 50 \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\begin{cases} \
                0.5\\cos\\left(\\frac{v}{30}\\pi\\right) + 0.5\\sin\\left(\\frac{2u+v+16}{40}\\pi\\right)  &; u \\leq 30\\\\[3ex]  \
                \\cos\\left(\\frac{v}{40}\\pi\\right)+0.5\\cos\\left(\\frac{v}{30}\\pi\\right) + 0.5\\sin\\left(\\frac{2u - v}{40}\\pi\\right) &; u > 30 \\\\[3ex] \
                \\end{cases} \\\\[3ex] \
                y =& \\begin{cases} \
                0.5\\sin\\left(\\frac{v}{30}\\pi\\right) + 0.5\\sin\\left(\\frac{2u+v+16}{40}\\pi\\right) &; u \\leq 30 \\\\[3ex] \
                \\sin\\left(\\frac{v}{40}\\pi\\right)+0.5\\sin\\left(\\frac{v}{30}\\pi\\right) + 0.5\\cos\\left(\\frac{2u - v}{40}\\pi\\right) &; u > 30 \\\\[3ex] \
                \\end{cases} \\\\[3ex] \
                z =& \\frac{v}{4}\\sin \\left(\\frac{v +  50}{200} \\pi \\right) \
            \\end{aligned}\
         $$",
        "scale": 0.75,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": castellane, //done
        "name": "Castellane",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 60 \\\\[3ex] \
                v =& 0, \\ldots, 120 \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\left[0.3\\sin\\left(\\frac{v}{120}\\pi\\right) \\left|\\cos\\left(\\frac{v+3}{6}\\pi\\right)\\right| + \\frac{u^2}{720}\\left(\\sin^2\\left(\\frac{2v}{300}\\pi\\right) + 0.1\\right) +0.3 \\right]\\cos\\left(\\frac{7u}{150}\\pi\\right) \\\\[3ex]  \
                y =& \\left[0.3\\sin\\left(\\frac{v}{120}\\pi\\right) \\left|\\cos\\left(\\frac{v+3}{6}\\pi\\right)\\right| + \\frac{u^2}{720}\\left(\\sin^2\\left(\\frac{2v}{300}\\pi\\right) + 0.1\\right) +0.3 \\right]\\sin\\left(\\frac{7u}{150}\\pi\\right) \\\\[3ex] \
                z =& 12\\cos\\left(\\frac{v}{120}\\pi\\right)  \
            \\end{aligned}\
         $$",
        "scale": 0.7,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": cavatelli, // done
        "name": "Cavatelli",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 200 \\\\[3ex] \
                v =& 0, \\ldots, 30 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& 0.5\\cos\\left(\\frac{u}{100}\\pi \\right) \\\\[3ex] \
                \\beta =& \\frac{v}{60}\\sin\\left(\\frac{u}{100}\\pi \\right) \\\\[3ex] \
                \\hline \\\\ \
                x =& 3(1 - \\sin(\\alpha\\pi))\\cos(\\alpha \\pi + 0.9\\pi) + 0.05\\cos \\left(\\frac{u}{2}\\pi\\right)  \\\\[3ex]  \
                y =& 3\\sin(\\alpha\\pi)\\sin(\\alpha \\pi + 0.63\\pi) + 0.05\\cos\\left(\\frac{u}{2}\\pi\\right) \\\\[3ex] \
                z =& 4\\beta\\left(5-\\sin(\\alpha \\pi)\\right)  \
            \\end{aligned}\
         $$",
        "scale": 0.7,
        "rot": [1.0, 1.0, 0.1],
    }, // need surface texture
    {
        "func": chifferi_rigati, // done
        "name": "Chifferi Rigati",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 200 \\\\[3ex] \
                v =& 0, \\ldots, 45 \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\left[0.45 + 0.3 \\cos\\left(\\frac{u}{100} \\pi\\right) + 0.005 \\cos\\left(\\frac{2u}{5} \\pi\\right)\\right] \\cos\\left(\\frac{v}{45} \\pi\\right) + 0.15\\left(\\frac{v}{45}\\right)^{10}\\cos^3\\left(\\frac{v}{ 100} \\pi\\right) \\\\[3ex]  \
                y =& \\left(0.35 + \\frac{v}{300}\\right) \\sin\\left(\\frac{u}{100} \\pi\\right) + 0.005  \\sin\\left(\\frac{2u}{5}\\pi\\right) \\\\[3ex] \
                z =& \\left[0.4 + 0.3 \\cos\\left(\\frac{u}{100} \\pi \\right) \\right]\\sin\\left(\\frac{v}{45} \\pi \\right)  \
            \\end{aligned}\
         $$",
        "scale": 1.0,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": conchiglioni_rigati, // done
        "name": "Conchiglioni Rigati",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 40 \\\\[3ex] \
                v =& 0, \\ldots, 200 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& 0.25 \\sin\\left(\\frac{v}{200} \\pi \\right) \\cos\\left(\\frac{v + 4}{4} \\pi\\right ) \\\\[3ex] \
                \\beta =& \\left(\\frac{u}{40} \\right )  \\left(0.1 + 0.1  \\sin^6\\left(\\frac{v}{200}  \\pi\\right )\\right )\\pi \\\\[3ex] \
                \\gamma =&  2.5 \\cos\\left(\\frac{v}{100}  \\pi\\right ) + 3\\sin^{10}\\left(\\frac{40-u}{80} \\pi\\right )  \\sin^{10}\\left(\\frac{v}{200} \\pi\\right ) \\sin\\left(\\frac{v + 150}{100}  \\pi\\right ) \\\\[3ex] \
                \\hline \\\\ \
                x =& \\alpha + \\left[10 + 30  \\sin\\left(\\frac{v}{200} \\pi\\right )\\right ]  \\sin\\left(\\frac{40 - u}{40} \\left(0.3  + \\sin^3\\left(\\frac{v}{300}  \\pi\\right )\\right )\\pi\\right )  \\sin\\left(\\beta\\right ) + \\cos\\left(\\frac{v}{100}  \\pi\\right ) \\\\[3ex]  \
                y =& \\alpha + \\left[10 + 30  \\sin\\left(\\frac{v}{200} \\pi\\right )\\right ]  \\cos\\left(\\frac{40 - u}{40}  \\left(0.3  + \\sin^3\\left(\\frac{v}{300}  \\pi\\right )\\right )\\pi\\right )  \\sin\\left(\\beta\\right ) + \\gamma \\\\[3ex] \
                z =& 30 \\cos\\left(\\frac{v}{200}  \\pi \\right) \
            \\end{aligned}\
         $$",
        "scale": 1.3,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": corallini_lisci, // done
        "name": "Corallini Lisci",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 100 \\\\[3ex] \
                v =& 0, \\ldots, 25 \\\\[3ex] \
                \\hline \\\\ \
                x =&  0.8 \\cos\\left(\\frac{u}{50} \\pi \\right)\\\\[3ex]  \
                y =& 0.8 \\sin\\left(\\frac{u}{50}  \\pi \\right) + 0.4 \\sin\\left(\\frac{u}{50}\\pi \\right) \\\\[3ex] \
                z =& \\frac{3v}{50}  \
            \\end{aligned}\
         $$",
        "scale": 0.75,
        "rot": [1.0, 1.0, 0.1],
    },
    // {"func": cuoretti,
    //  "name":"Cuoretti",
    //  "scale":1.0,
    // },  // maybe not required?
    {
        "func": ditali_rigati, // done
        "name": "Ditali Rigati",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 203 \\\\[3ex] \
                v =& 0, \\ldots, 25 \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\cos\\left(\\frac{u}{100} \\pi \\right) + 0.03 \\cos\\left( \\frac{7u}{40} \\pi \\right) + 0.25 \\cos\\left(\\frac{v}{50} \\pi \\right) \\\\[3ex]  \
                y =& 1.1 \\sin\\left(\\frac{u}{100} \\pi \\right) + 0.03 \\sin\\left(\\frac{7u}{40} \\pi \\right) + 0.25 \\sin\\left(\\frac{v}{50} \\pi \\right) \\\\[3ex] \
                z =& \\frac{v}{10}  \
            \\end{aligned}\
         $$",
        "scale": 1.0,
        "rot": [1.0, 1.0, 0.1],
    }, // needs work
    {
        "func": farfalline, // done
        "name": "Farfalline",
        "scale": 0.7,
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 250 \\\\[3ex] \
                v =& 0, \\ldots, 50 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& 30\\cos\\left(\\frac{u}{125}\\pi\\right) + 0.5\\cos\\left(\\frac{6u}{25}\\pi\\right) \\\\[3ex] \
                \\beta =& 30\\sin\\left(\\frac{u}{125}\\pi\\right) + 0.5\\sin\\left(\\frac{6u}{25}\\pi\\right) \\\\[3ex] \
                \\hline \\\\ \
                x =& \\cos\\left(\\frac{3a}{100}\\pi\\right) \\\\[3ex]  \
                y =& 0.5\\sin\\left(\\frac{3 \\alpha}{100}\\pi\\right)\\left(1 + \\sin^{10}\\left(\\frac{v}{100}\\pi\\right)\\right) \\\\[3ex] \
                z =& \\frac{\\beta v}{500}  \
            \\end{aligned}\
          $$",
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": farfalle, // done
        "name": "Farfalle",
        "scale": 1.7,
        //\\beta =& 0.3  \\sin\\left (\\frac{6u}{7}  \\pi + 0.4\\pi\\right );\\\\[3ex] \
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 70 \\\\[3ex] \
                v =& 0, \\ldots, 70 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& 10\\cos\\left (\\frac{u + 70}{70}\\pi\\right )  \\sin^9\\left (\\frac{2v}{175}\\pi + 1.1\\pi\\right )\\\\[3ex] \
                \\gamma =& \\begin{cases} \
                7\\sin^3\\left (\\frac{u + 35}{35}  \\pi\\right ) \\sin^9\\left (\\frac{2v}{175}\\pi + 1.1\\pi\\right ) &; 17  \\leq u \\leq 52 \\\\[3ex] \
                \\alpha &; \\text{otherwise} \\\\[3ex] \
                \\end{cases} \\\\[3ex] \
                \\xi =& \\frac{v}{2} + 4\\sin\\left (\\frac{u}{70}\\pi\\right )\\sin\\left (\\frac{v-10}{100}\\pi\\right ) - 4\\sin\\left (\\frac{u}{70}\\pi\\right )\\sin\\left (\\frac{60-v}{100}\\pi\\right ) \\\\[3ex] \
                \\lambda =& \\frac{v}{2} + 4\\sin\\left (\\frac{u}{70}\\pi\\right )+0.7\\sin\\left (\\frac{2u + 2.8}{7}\\pi\\right )\\sin\\left (\\frac{v-60}{20}\\pi\\right ) \\\\[3ex] \
                \\mu =& \\frac{v}{2} - 4\\sin\\left (\\frac{u}{70}\\pi\\right )-0.7\\sin\\left (\\frac{2u + 2.8}{7}\\pi\\right )\\sin\\left (\\frac{10-v}{20}\\pi\\right ) \\\\[3ex] \
                \\hline \\\\ \
                x =& \\frac{3u}{7} + \\gamma \\\\[3ex] \
                y =& \\begin{cases} \
                \\mu &;  v < 10 \\\\[3ex] \
                \\lambda &; v > 60 \\\\[3ex] \
                \\xi &; \\text{otherwise} \\\\[3ex] \
                \\end{cases} \\\\[3ex] \
                z =& 3  \\sin\\left (\\frac{2u + 17.5}{35}  \\pi\\right )\\sin^{1.5}\\left (\\frac{v}{70}\\pi\\right ) \
            \\end{aligned}\
          $$",
        "rot": [1.0, 0.0, 0.7],
    }, // needs work,
    {
        "func": fagottini, // done
        "name": "Fagottini",
        "scale": 1.0,
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 200 \\\\[3ex] \
                v =& 0, \\ldots, 45 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& \\left[0.8+\\sin^8\\left(\\frac{u}{100}\\pi  \\right) - 0.8\\cos\\left(\\frac{u}{25}\\pi\\right )\\right ]^{1.5} + 0.2+0.2\\sin\\left(\\frac{u}{100}\\pi\\right ) \\\\[3ex] \
                \\beta =& \\left[0.9+\\cos^8\\left(\\frac{u}{100}\\pi\\right ) - 0.9\\cos\\left(\\frac{u}{25}\\pi + 0.03\\pi\\right )\\right ]^{1.5} +0.3\\cos\\left(\\frac{u}{100}\\pi\\right )\\\\[3ex] \
                \\gamma =& 4 - \\frac{4v}{500}\\left[1 + \\cos^8\\left(\\frac{u}{100}\\pi\\right ) - 0.8\\cos\\left(\\frac{u}{25}\\pi\\right )\\right ]^{1.5} \\\\[3ex] \
                \\hline \\\\ \
                x =& \\cos\\left(\\frac{u}{100}\\pi\\right )\\left[\\alpha \\sin^8\\left(\\frac{v}{100}\\pi\\right )+0.6\\left(2 + \\sin^2\\left(\\frac{u}{100}\\pi\\right )\\right )\\sin^2\\left(\\frac{v}{50}\\pi\\right )\\right ] \\\\[3ex]  \
                y =& \\sin\\left(\\frac{u}{100}\\pi\\right )\\left[\\beta \\sin^8\\left(\\frac{v}{100}\\pi\\right )+0.6\\left(2 + \\cos^2\\left(\\frac{u}{100}\\pi\\right )\\right )\\sin^2\\left(\\frac{v}{50}\\pi\\right )\\right ] \\\\[3ex] \
                z =& \\left[1+\\sin\\left(\\frac{v}{100}\\pi - 0.5\\pi\\right )\\right ]\\left[\\gamma - \\frac{4v}{500}\\left(1 + \\sin^8\\left(\\frac{u}{100}\\pi\\right ) - 0.8\\cos\\left(\\frac{u}{25}\\pi\\right )\\right )^{1.5}\\right ]  \
            \\end{aligned}\
          $$",
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": festonati, // done
        "name": "Festonati",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 100 \\\\[3ex] \
                v =& 0, \\ldots, 80 \\\\[3ex] \
                \\hline \\\\ \
                x =&  5\\cos\\left(\\frac{u}{50}\\pi\\right) + 0.5\\cos\\left(\\frac{u}{50}\\pi\\right)\\left(1 + \\sin\\left(\\frac{v}{100}\\pi\\right)\\right) + 0.5\\cos\\left(\\frac{u+25}{25}\\pi\\right)\\left(1+\\sin\\left(\\frac{v}{5}\\pi\\right)\\right) \\\\[3ex]  \
                y =& 5\\sin\\left(\\frac{u}{50}\\pi\\right) + 0.5\\sin\\left(\\frac{u}{50}\\pi\\right)\\left(1 + \\sin\\left(\\frac{v}{100}\\pi\\right)\\right) + 0.5\\sin\\left(\\frac{u}{25}\\pi\\right)\\left(1+\\sin\\left(\\frac{v}{5}\\pi\\right)\\right) \\\\[3ex] \
                z =& \\frac{v}{2} + 2\\sin\\left(\\frac{3u + 25}{50}\\pi\\right)  \
            \\end{aligned}\
         $$",
        "scale": 0.6,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": funghini, // done
        "name": "Funghini",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 300 \\\\[3ex] \
                v =& 0, \\ldots, 30 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& 5\\cos\\left (\\frac{u}{150}\\pi\\right) + 0.05\\cos\\left (\\frac{u}{3}\\pi\\right)\\sin^{2000}\\left (\\frac{v}{60}\\pi\\right) \\\\[3ex] \
                \\beta =& \\frac{v}{30}\\left [5\\sin\\left (\\frac{u}{150}\\pi\\right) + 0.05\\sin\\left (\\frac{u}{3}\\pi\\right)\\right] \\\\[3ex] \
                \\gamma =& \\frac{v}{10}\\left [2\\sin\\left (\\frac{u}{150}\\pi\\right) + 0.05\\sin\\left (\\frac{u}{3}\\pi\\right)\\right] \\\\[3ex] \
                \\eta =& \\begin{cases} \
                \\beta &; u \\leq 150 \\\\[3ex] \
                \\gamma &;  (u > 150) \\land (v \\leq 10) \\\\[3ex] \
                2\\sin\\left (\\frac{u}{150}\\pi\\right) + 0.05\\sin\\left (\\frac{u}{6}\\pi\\right) &; (u > 150) \\land (v > 10) \\\\[3ex] \
                \\end{cases} \\\\[3ex] \
                \\hline \\\\ \
                x =& 0.05\\cos\\left (\\frac{\\alpha}{5}\\pi\\right)+0.3\\cos\\left (\\frac{\\alpha}{5}\\pi\\right)\\sin^2\\left (\\frac{3 \\eta}{50}\\pi\\right) \\\\[3ex]  \
                y =& 0.01\\sin\\left (\\frac{\\alpha}{5}\\pi\\right)+0.3\\sin\\left (\\frac{\\alpha}{5}\\pi\\right)\\sin^2\\left (\\frac{3 \\eta}{50}\\pi\\right) \\\\[3ex] \
                z =& 0.25\\sin\\left (\\frac{\\eta + 3}{10}\\pi\\right)  \
            \\end{aligned}\
         $$",
        "scale": 1.0,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": fusili, // done
        "name": "Fusili",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 200 \\\\[3ex] \
                v =& 0, \\ldots, 25 \\\\[3ex] \
                \\hline \\\\ \
                x =&  6\\cos\\left(\\frac{3u+10}{100}\\pi\\right)\\cos\\left(\\frac{v}{25}\\pi\\right) \\\\[3ex]  \
                y =& 6\\sin\\left(\\frac{3u+10}{100}\\pi\\right)\\cos\\left(\\frac{v}{25}\\pi\\right) \\\\[3ex] \
                z =& \\frac{3u}{20} + 2.5\\cos\\left(\\frac{v+12.5}{25}\\pi\\right)  \
            \\end{aligned}\
         $$",
        "scale": 0.7,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": galletti, // done
        "name": "Galletti",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 140 \\\\[3ex] \
                v =& 0, \\ldots, 70 \\\\[3ex] \
                \\hline \\\\ \
                f\\left (x\\right ) =& \\left (\\frac{1+\\sin\\left (x  \\pi + 1.5\\pi\\right )}{2}\\right )^5 \\\\[3ex] \
                \\alpha =& 0.4\\sin^{1000}\\left (f\\left (\\frac{u}{140}\\right )\\pi + 0.5\\pi\\right )\\cos\\left (\\frac{v}{70}\\pi\\right ) \\\\[3ex] \
                \\beta =& 0.15\\sin^{1000}\\left (f\\left (\\frac{u}{140}\\right )\\pi + 0.5\\pi\\right )\\cos\\left (\\frac{v}{7}\\pi\\right ) \\\\[3ex] \
                \\gamma =& 0.4\\cos^{1000}\\left (f\\left (\\frac{u}{140}\\right )\\pi\\right )\\sin\\left (\\frac{v}{70}\\pi\\right ) \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\left [0.5 + 0.3\\cos\\left (f\\left (\\frac{u}{140}\\right )2\\pi\\right )\\right ]\\cos\\left (\\frac{v}{70}\\pi\\right ) + 0.15\\left (\\frac{v}{70}\\right )^{10}\\cos^3\\left (f\\left (\\frac{u}{140}\\right )2\\pi\\right ) + \\alpha \\\\[3ex]  \
                y =& 0.35\\sin\\left (f\\left (\\frac{u}{140}\\right )2\\pi\\right ) + \\frac{0.15v}{70}\\sin\\left (f\\left (\\frac{u}{140}\\right )2\\pi\\right ) + \\beta \\\\[3ex] \
                z =& \\left [0.4 + 0.3\\cos\\left (f\\left (\\frac{u}{140}\\right )2\\pi\\right )\\right ]\\sin\\left (\\frac{v}{70}\\pi\\right ) + \\gamma  \
            \\end{aligned}\
          $$",
        "scale": 0.85,
        "rot": [1.0, 1.0, 0.5],
    },
    {
        "func": gemelli, // done
        "name": "Gemelli",
        "eq": "$$\
            \\begin{aligned}\
                u =& 0, \\ldots, 100 \\\\[3ex] \
                v =& 0, \\ldots, 50 \\\\[3ex] \
                \\hline \\\\ \
                x =&  6\\cos\\left(\\frac{v}{50}1.9\\pi+0.55\\pi\\right)\\cos\\left(\\frac{3u}{25}\\right) \\\\[3ex]  \
                y =& 6\\cos\\left(\\frac{v}{50}1.9\\pi+0.55\\pi\\right)\\sin\\left(\\frac{3u}{25}\\right) \\\\[3ex] \
                z =& 8\\sin\\left(\\frac{v}{50}1.9\\pi+0.55\\pi\\right)+\\frac{3u}{4}  \
            \\end{aligned}\
         $$",
        "scale": 0.7,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": giglio_ondulato, // done
        "name": "Giglio Ondulato",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 150 \\\\[3ex] \
                v =& 0, \\ldots, 40 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& 0.6+0.03\\left(\\frac{40-v}{40}\\right)^{10} \\cos\\left(\\frac{4u+75}{15}\\pi\\right) - 0.5\\sin^{0.6}\\left(\\frac{v}{80}\\pi\\right) \\\\[3ex] \
                \\beta =& \\sin\\left(\\frac{2u}{75}\\pi\\right) + \\left(\\frac{u}{150}\\right)^{10} \\left(0.08\\sin\\left(\\frac{v}{40}\\pi\\right) + 0.03\\sin\\left(\\frac{v}{5}\\pi\\right)\\right) \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\alpha  \\cos\\left(\\frac{2u}{75}  \\pi\\right) +\\left(\\frac{u}{150}\\right)^{10} \\left[0.08\\sin\\left(\\frac{v}{40}\\pi\\right) + 0.03\\cos\\left(\\frac{v}{5}\\pi\\right)\\right] \\\\[3ex]  \
                y =& \\left[0.6 + 0.03\\left(\\frac{40-v}{40}\\right)^{10}\\sin\\left(\\frac{4u}{15}\\pi\\right) - 0.5\\sin^{0.6}\\left(\\frac{v}{80}\\pi\\right)\\right]\\beta \\\\[3ex] \
                z =& 1.1\\frac{v}{40}+0.7\\left[1-\\sin\\left(\\frac{150-u}{300}\\pi\\right)\\right]  \
            \\end{aligned}\
         $$",
        "scale": 1.0,
        "rot": [1.0, 0.0, 0.8],
    },
    {
        "func": gnocchetti_sardi, // done
        "name": "Gnocchetti Sardi",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 50 \\\\[3ex] \
                v =& 0, \\ldots, 150 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& 0.8 + 3 \\sin^{0.8}\\left(\\frac{v}{150}  \\pi\\right)\\\\[3ex] \
                \\beta =& \\left|\\cos\\left(\\frac{2v + 7.5}{15}\\pi\\right)\\right| \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\alpha  \\cos\\left(\\frac{u}{50}  \\pi\\right) + 0.2  \\cos\\left(\\frac{u}{50}\\pi\\right)\\sin\\left(\\frac{v}{150}\\pi\\right)\\beta \\\\[3ex]  \
                y =& \\alpha  \\sin\\left(\\frac{u}{50}  \\pi\\right) + 0.2  \\sin\\left(\\frac{u}{50}\\pi\\right)\\sin\\left(\\frac{v}{150}\\pi\\right)\\beta \\\\[3ex] \
                z =& 13  \\cos\\left(\\frac{v}{150}  \\pi\\right)  \
            \\end{aligned}\
         $$",
        "scale": 1.0,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": gnocchi, // done
        "name": "Gnocchi",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 40 \\\\[3ex] \
                v =& 0, \\ldots, 130 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =&\\frac{u}{40}  \\sin\\left(\\frac{v}{130}  \\pi\\right) \\\\[3ex] \
                \\beta =& \\left|\\cos\\left(\\frac{\\left(v + 13\\right)}{26}\\pi\\right)\\right| \\\\[3ex] \
                \\hline \\\\ \
                x =&  0.2  \\cos\\left(\\frac{u}{40}  1.3 \\pi\\right)  \\sin\\left(\\frac{v}{130}  \\pi\\right)  \\beta +  \\alpha  \\cos\\left(\\frac{u}{40}  1.3  \\pi\\right) \\\\[3ex]  \
                y =& 0.2  \\sin\\left(\\frac{u}{40}  1.3 \\pi\\right)  \\sin\\left(\\frac{v}{130}  \\pi\\right)  \\beta +  \\alpha  \\sin\\left(\\frac{u}{40}  1.3  \\pi\\right) \\\\[3ex] \
                z =& 1.5  \\cos\\left(\\frac{v}{130}  \\pi\\right)  \
            \\end{aligned}\
         $$",
        "scale": 0.8,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": lancette, // done
        "name": "Lancette",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 50 \\\\[3ex] \
                v =& 0, \\ldots, 90 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& 0.4 \\sin \\left(\\frac{5v}{9}  \\pi\\right) \\\\[3ex] \
                \\beta =& \\sin \\left(\\frac{v+45}{90}\\pi \\right) \\\\[3ex] \
                \\gamma =&  \\left(\\frac{3u-75}{5}\\right)\\sin \\left(\\frac{v}{90}\\pi\\right) -  \\left(1 - \\sin \\left(\\frac{u}{50}\\pi\\right)\\right)^{25}\\alpha\\beta \\\\[3ex] \
                \\eta =& \\begin{cases} \
                \\gamma && ; u \\leq 25 \\\\[3ex] \
                \\frac{30(u-25)}{50}\\sin \\left(\\frac{v}{90}\\pi\\right) + \\sin \\left(\\frac{u-25}{50}\\pi\\right)\\alpha\\beta && ; u > 25 \\\\[3ex] \
                \\end{cases} \\\\[3ex] \
                \\hline \\\\ \
                x =&  4\\cos \\left(\\frac{3\\eta}{50}\\pi\\right) \\\\[3ex]  \
                y =& 4\\sin \\left(\\frac{3\\eta}{50}\\pi\\right) \\left[0.3 +  \\left(1-\\sin \\left(\\frac{v}{90}\\pi\\right)\\right)^{0.6}\\right] \\\\[3ex] \
                z =& \\frac{v}{3}  \
            \\end{aligned}\
         $$",
        "scale": 0.7,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": lasagna, // done
        "name": "Lasagna Riccia",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 50 \\\\[3ex] \
                v =& 0, \\ldots, 150 \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\frac{7u}{18} \\\\[3ex]  \
                y =& \\frac{v}{3} \\\\[3ex] \
                z =& \\begin{cases}  \
                \\left (\\frac{10-u}{10} \\right)  \\cos\\left (\\frac{v+5}{12}\\pi \\right) & ; u < 10 \\\\[3ex] \
                0.1\\cos\\left (\\frac{u}{4}\\pi \\right) & ; 10 \\leq u \\leq 40 \\\\[3ex] \
                \\left (\\frac{u-40}{10} \\right)\\cos\\left (\\frac{v+15}{12}\\pi \\right)  & ; u > 40 \\\\[3ex] \
                \\end{cases} \
            \\end{aligned}\
          $$",
        "scale": 1.6,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": lumaconi_rigati, // done
        "name": "Lumaconi Rigati",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 240 \\\\[3ex] \
                v =& 0, \\ldots, 60 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& 0.45 + 0.01  \\cos\\left(\\frac{u}{3}\\pi\\right) + \\frac{v}{300}  \\left | \\cos\\left(\\frac{u}{240}\\pi\\right)\\right|  \\cos^{20}\\left(\\frac{u}{120}  \\pi\\right) \\\\[3ex] \
                \\beta =& \\frac{v}{300}  \\left|\\cos\\left(\\frac{u}{240}  \\pi\\right)\\right|\\sin\\left(\\frac{u}{120}  \\pi\\right) + 0.125  \\left(\\frac{v}{60}\\right)^6\\sin\\left(\\frac{u}{120}  \\pi\\right) \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\left[0.4\\cos\\left(\\frac{u}{120}\\pi\\right) + \\alpha\\right]\\cos\\left(\\frac{v}{60}\\pi\\right) + 0.48\\left(\\frac{v}{60}\\right)^6\\sin^3\\left(\\frac{u+60}{120}\\pi\\right) \\\\[3ex]  \
                y =& 0.5\\sin\\left(\\frac{u}{120}\\pi\\right)+0.01\\sin\\left(\\frac{u}{3}\\pi\\right)+\\beta \\\\[3ex] \
                z =& \\left[0.45+0.4\\cos\\left(\\frac{u}{120}\\pi\\right)\\right]\\sin\\left(\\frac{v}{60}\\pi\\right)  \
            \\end{aligned}\
          $$",
        "scale": 1.1,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": orecchiette, // done
        "name": "Orecchiette",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 150 \\\\[3ex] \
                v =& 0, \\ldots, 15 \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\frac{2v}{3} \\cos\\left(\\frac{u}{75}\\pi \\right) + 0.3 \\cos\\left(\\frac{2u}{15}\\pi \\right) \\\\[3ex]  \
                y =& 10\\sin\\left(\\frac{u}{75}\\pi \\right) \\\\[3ex] \
                z =& 0.1\\sin\\left(\\frac{u}{3}\\pi \\right) + 5\\left(0.5 + 0.5 \\cos\\left(\\frac{2u}{75}\\pi\\right) \\right)^4\\cos^2\\left(\\frac{v}{30}\\pi\\right) \\\\[3ex] \
                &+ 1.5\\left(0.5 + 0.5 \\cos\\left(\\frac{2u}{75}\\pi \\right) \\right)^4\\cos^5\\left(\\frac{v}{30}\\pi \\right)\\sin^{10}\\left(\\frac{v}{30}\\pi \\right)  \
            \\end{aligned}\
         $$",
        "scale": 1.3,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": penn_rigate, // done
        "name": "Penn Rigate",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 170 \\\\[3ex] \
                v =& 0, \\ldots, 45 \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\begin{cases} \
                4\\sin^2\\left (\\frac{u}{85}\\pi\\right ) + 0.1\\sin\\left (\\frac{6u}{17}\\pi\\right ) &; u < 85 \\\\[3ex] \
                -4\\sin^2\\left (\\frac{u-85}{85}\\pi\\right ) + 0.1\\sin\\left (\\frac{6\\left (u-85\\right )}{17}\\pi\\right ) &; u \\geq 85 \\\\[3ex] \
                \\end{cases}  \\\\[3ex]  \
                y =&  \\begin{cases} \
                4\\cos\\left (\\frac{u}{85}\\pi\\right ) + 0.1\\cos\\left (\\frac{6u}{17}\\pi\\right ) &; u < 85 \\\\[3ex] \
                -4\\cos\\left (\\frac{u-85}{85}\\pi\\right ) + 0.1\\cos\\left (\\frac{6\\left (u-85\\right )}{17}\\pi\\right ) &; u \\geq 85 \\\\[3ex] \
                \\end{cases} \\\\[3ex] \
                z =&  \\begin{cases} \
                7\\cos\\left (\\frac{u}{85}\\pi\\right ) + 15\\sin\\left (\\frac{v-20}{40}\\pi\\right ) &; u < 85 \\\\[3ex] \
                -7\\cos\\left (\\frac{u-85}{85}\\pi\\right ) + 15\\sin\\left (\\frac{v-20}{40}\\pi\\right) &; u \\geq 85 \\\\[3ex] \
                \\end{cases}  \
            \\end{aligned}\
          $$",
        "scale": 0.7,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": puntalette, // done
        "name": "Puntalette",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 80 \\\\[3ex] \
                v =& 0, \\ldots, 80 \\\\[3ex] \
                \\hline \\\\ \
                x =&  1.4\\sin^{1.2}\\left(\\frac{v}{80}\\pi\\right)\\sin\\left(\\frac{u}{40}\\pi\\right) \\\\[3ex]  \
                y =& 8\\cos\\left(\\frac{v}{80}\\pi\\right) \\\\[3ex] \
                z =& 1.4\\sin^{1.2}\\left(\\frac{v}{80}\\pi\\right)\\cos\\left(\\frac{u}{40}\\pi\\right)  \
            \\end{aligned}\
         $$",
        "scale": 0.7,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": quadrefiore, // done
        "name": "Quadrefiore",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 500 \\\\[3ex] \
                v =& 0, \\ldots, 50 \\\\[3ex] \
                \\hline \\\\ \
                x =&  2\\cos\\left(\\frac{u}{250}\\pi\\right)\\left|\\sin\\left(\\frac{3u}{250}\\pi\\right)\\right|^{20} + \\left[0.6 + 0.9\\sin\\left(\\frac{v}{50}\\pi\\right)\\right]\\cos\\left(\\frac{u}{250}\\pi\\right)+ 0.2\\cos\\left(\\frac{4v}{25}\\pi\\right) \\\\[3ex]  \
                y =& 2\\sin\\left(\\frac{u}{250}\\pi\\right)\\left|\\sin\\left(\\frac{3u}{250}\\pi\\right)\\right|^{20} + \\left[0.6 + 0.9\\sin\\left(\\frac{v}{50}\\pi\\right)\\right]\\sin\\left(\\frac{u}{250}\\pi\\right) + 1.5\\sin\\left(\\frac{4v}{50}\\pi\\right)\\\\[3ex] \
                z =& \\frac{3v}{10} \
            \\end{aligned}\
         $$",
        "scale": 0.75,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": riccioli, // done
        "name": "Riccioli",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots,60 \\\\[3ex] \
                v =& 0, \\ldots, 160 \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\left(2 + 8\\sin\\left(\\frac{u}{100}  \\pi \\right) + 9\\sin^2\\left(\\frac{11  v + 100}{400}  \\pi \\right) \\right)\\cos\\left(\\frac{4u}{125}  \\pi \\right) \\\\[3ex]  \
                y =& \\left(2 + 8\\sin\\left(\\frac{u}{100}  \\pi \\right) + 9\\sin^2\\left(\\frac{11 v + 100 }{400} \\pi \\right) \\right)\\sin\\left(\\frac{4u}{125} \\pi \\right) \\\\[3ex] \
                z =& \\frac{v}{4}  \
            \\end{aligned}\
         $$",
        "scale": 0.8,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": saccottini, // done
        "name": "Saccottini",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 150 \\\\[3ex] \
                v =& 0, \\ldots, 100 \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\cos\\left(\\frac{u}{75}\\pi\\right )\\left[\\sin\\left(\\frac{v}{50}\\pi\\right ) + 1.3\\sin\\left(\\frac{v}{200}\\pi\\right ) + \\frac{3v}{1000}\\cos\\left(\\frac{\\left(u+25\\right )}{25}\\pi\\right )\\right ] \\\\[3ex]  \
                y =& \\sin\\left(\\frac{u}{75}\\pi\\right )\\left[\\sin\\left(\\frac{v}{50}\\pi\\right ) + 1.3\\sin\\left(\\frac{v}{200}\\pi\\right ) + 0.7\\left(\\frac{v}{100}\\right )^2\\sin\\left(\\frac{u}{15}\\pi\\right )\\right ] \\\\[3ex] \
                z =& 2\\left[1 - \\left | \\cos\\left(\\frac{v}{200}\\pi\\right )\\right |^5 + \\left(\\frac{v}{100}\\right )^{4.5}\\right ]  \
            \\end{aligned}\
         $$",
        "scale": 1.0,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": spaccatelle, // done
        "name": "Spaccatelle",
        "eq": "$$\
            \\begin{split}\
                u =& 1, \\ldots, 30 \\\\[3ex] \
                v =& 0, \\ldots, 120 \\\\[3ex] \
                \\hline \\\\ \
                x =& \\left[0.5+5\\left(\\frac{v}{100}\\right )^3 + 0.5\\cos\\left(\\frac{u+37.5}{25}\\pi\\right )\\right ]\\cos\\left(\\frac{2v}{125}\\pi\\right ) \\\\[3ex]  \
                y =& 0.6\\sin\\left(\\frac{u+37.5}{25}\\pi\\right ) \\\\[3ex] \
                z =& \\left[0.5+5\\left(\\frac{v}{100}\\right )^3 + 0.5\\cos\\left(\\frac{u+37.5}{25}\\pi\\right )\\right ]\\sin\\left(\\frac{2v}{125}\\pi\\right ) \
            \\end{split}\
         $$",
        "scale": 0.2,
        "rot": [1.0, 1.0, 0.1],
    }, // too big 
    {
        "func": spirali, // done
        "name": "Spirali",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 100 \\\\[3ex] \
                v =& 0, \\ldots, 120 \\\\[3ex] \
                \\hline \\\\ \
                x =& \\left[2.5 + 2 \\cos\\left(\\frac{u}{50} \\pi\\right) + 0.1\\cos\\left(\\frac{u}{5} \\pi\\right)\\right]\\cos\\left(\\frac{v}{30} \\pi\\right) \\\\[3ex]  \
                y =& \\left[2.5 + 2 \\cos\\left(\\frac{u}{50} \\pi\\right) + 0.1\\cos\\left(\\frac{u}{5} \\pi\\right)\\right]\\sin\\left(\\frac{v}{30} \\pi\\right) \\\\[3ex] \
                z =& \\left[2.5 + 2 \\sin\\left(\\frac{u}{50} \\pi\\right) + 0.1\\sin\\left(\\frac{u}{5} \\pi\\right)\\right] + \\frac{v}{6}  \
            \\end{aligned}\
         $$",
        "scale": 0.85,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": tortellini, // done
        "name": "Tortellini",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 120 \\\\[3ex] \
                v =& 0, \\ldots, 60 \\\\[3ex] \
                \\hline \\\\ \
                \\\alpha =& 0.2 \\sin\\left(\\frac{u}{120} \\pi\\right ) + \\frac{v}{400} \\\\[3ex] \
                \\beta =& \\cos\\left(\\frac{v}{60} \\left(2.7 + 0.2 \\sin\\left(\\frac{u}{120} \\pi\\right )^{50}\\right )\\pi + 1.4 \\pi\\right ) \\\\[3ex] \
                \\gamma =& \\sin\\left(\\frac{v}{60} \\left(2.7 + 0.2 \\sin\\left(\\frac{u}{120} \\pi\\right )^{50}\\right )\\pi + 1.4  \\pi\\right ) \\\\[3ex] \
                \\hline \\\\ \
                x =&  0.5 ^ {\\left(1+0.5\\sin\\left(\\frac{u}{120}\\pi\\right )\\right )} \\cos\\left(\\frac{11u-60}{600}  \\pi\\right )\\left[1.35+\\left(3+\\sin\\left(\\frac{u}{120}\\pi\\right )\\right )\\alpha\\beta\\right ] \\\\[3ex]  \
                y =& 0.5\\sin\\left(\\frac{11u-60}{600} \\pi\\right )\\left[1.35+\\left(3+\\sin\\left(\\frac{u}{120}\\pi\\right )\\right )\\alpha\\beta\\right ] \\\\[3ex] \
                z =& 0.15 + \\frac{u}{1200} + 0.5\\left(0.8\\sin\\left(\\frac{u}{120}  \\pi\\right ) + \\frac{v}{400}\\right )\\sin\\left(\\frac{u}{120}\\pi\\right )\\gamma  \
            \\end{aligned}\
         $$",
        "scale": 1.0,
        "rot": [1.0, 1.0, 0.1],
    },
    {
        "func": trofie, // done
        "name": "Trofie",
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 150 \\\\[3ex] \
                v =& 0, \\ldots, 50 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& \\frac{3u}{5} + 10 \\cos\\left(\\frac{v}{25} \\pi\\right ) \\\\[3ex] \
                \\hline \\\\ \
                x =&  \\left[1 +  \\sin\\left(\\frac{u}{150}\\pi\\right ) + 2\\sin\\left(\\frac{u}{150}\\pi\\right )\\sin\\left(\\frac{v}{25}\\pi\\right )\\right ]\\sin\\left(\\frac{13u}{300}\\pi\\right ) \\\\[3ex]  \
                y =& \\left[1 +  \\sin\\left(\\frac{u}{150}\\pi\\right ) + 2\\sin\\left(\\frac{u}{150}\\pi\\right )\\sin\\left(\\frac{v}{25}\\pi\\right )\\right ]\\cos\\left(\\frac{13u}{300}\\pi\\right ) + 5\\sin\\left(\\frac{2a}{125}\\pi\\right ) \\\\[3ex] \
                z =& \\alpha  \
            \\end{aligned}\
         $$",
        "scale": 0.85,
        "rot": [0.6, 1.0, 1.0],
    },
    {
        "func": trottole, // done
        "name": "Trottole",
        "scale": 1.0,
        "eq": "$$\
            \\begin{aligned}\
                u =& 1, \\ldots, 160 \\\\[3ex] \
                v =& 0, \\ldots, 60 \\\\[3ex] \
                \\hline \\\\ \
                \\alpha =& 0.17-0.15\\sin\\left(\\frac{v}{120}\\pi\\right) + 0.25\\left(\\frac{60-v}{60}\\right)^{10}\\sin\\left(\\frac{v}{30}\\pi\\right) \\\\[3ex] \
                \\beta =& 0.17-0.15\\sin\\left(\\frac{v}{120}\\pi\\right) + 0.25\\left(\\frac{60-v}{60}\\right)^{10}\\sin\\left(\\frac{v}{30}\\pi\\right) \\\\[3ex] \
                \\gamma =& 0.25\\left(\\frac{60-v}{60}\\right)^5\\left[1 - \\sin\\left(\\frac{u-128}{160}\\pi\\right)\\right]\\cos\\left(\\frac{v}{30}\\pi\\right) \\\\[3ex] \
                \\eta =& \\frac{7u}{400} - \\frac{48}{25} + \\gamma + \\left(\\frac{v}{120}\\right)\\left[1 - \\sin\\left(\\frac{u-128}{64}\\pi\\right)\\right] \\\\[3ex] \
                \\hline \\\\ \
                x =& \\begin{cases} \
                \\alpha  \\left(1 - \\sin\\left(\\frac{u-128}{320}\\pi\\right)\\right)\\cos\\left(\\frac{7u}{160}\\pi\\right)  &; u \\geq 128 \\\\[3ex] \
                \\beta \\cos\\left(\\frac{7u}{160}\\pi\\right) &; u < 128 \\\\[3ex] \
                \\end{cases}  \\\\[3ex]  \
                y =& \\begin{cases} \
                \\alpha  \\left(1 - \\sin\\left(\\frac{u-128}{320}\\pi\\right)\\right)\\sin\\left(\\frac{7u}{160}\\pi\\right) &; u\\geq128 \\\\[3ex] \
                \\beta \\sin\\left(\\frac{7u}{160}\\pi\\right) &; u < 128 \\\\[3ex] \
                \\end{cases} \\\\[3ex] \
                z =& \\begin{cases} \
                \\eta &; u\\geq128 \\\\[3ex] \
                \\frac{u}{400} + \\frac{v}{100} + 0.25\\left(\\frac{60-v}{60}\\right)^5\\cos\\left(\\frac{v}{30}\\pi\\right) &; u < 128 \\\\[3ex] \
                \\end{cases}  \
            \\end{aligned}\
         $$",
        "rot": [0.8, 1.2, 1.4],
    },
];

var camera;

function onWindowResize() {
    camera.aspect = 1.0;
    camera.updateProjectionMatrix();

    renderer.setSize(Math.max(Math.min(window.innerWidth / 2,
        window.innerHeight / 2),
        350),
        Math.max(Math.min(window.innerWidth / 2,
            window.innerHeight / 2),
            350),);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}



function main(id) {
    //Scene
    scene = new THREE.Scene();
    scene.add(light1);
    scene.add(light2);
    scene.add(amblight);

    // Floor
    // var wireframeMaterial = new THREE.MeshBasicMaterial( { 
    //                                 color: 0x000088, 
    //                                 wireframe: true, 
    //                                 side:THREE.DoubleSide } ); 
    // var floorGeometry = new THREE.PlaneGeometry(100,100,10,10);
    // var floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
    // floor.position.z = -0.01;
    // rotate to lie in x-y plane
    // floor.rotation.x = pi / 2;
    // floor.scale.multiplyScalar(0.2);
    // scene.add(floor);

    var meshFunction,
        xMax, xMin = 0,
        yMax, yMin = 0,
        zMax, zMin = 0;

    meshFunction = function (u0, v0, target) {
        return pasta_shapes[id]["func"](u0, v0, target);
    };

    pasta_type.textContent = pasta_shapes[id]["name"];
    pasta_eq.innerHTML = pasta_shapes[id]["eq"];

    geometry = new ParametricGeometry(meshFunction, segments, segments);
    geometry.computeBoundingBox();
    xMin = geometry.boundingBox.min.x;
    xMax = geometry.boundingBox.max.x;
    yMin = geometry.boundingBox.min.y;
    yMax = geometry.boundingBox.max.y;
    zMin = geometry.boundingBox.min.z;
    zMax = geometry.boundingBox.max.z;


    camera.position.set(0 * xMax, 5 * yMax, 2 * zMax);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(scene.position);
    scene.add(camera);

    pasta = new THREE.Mesh(geometry, material);
    pasta.position.set(0, 0, 0);
    pasta.scale.multiplyScalar(pasta_shapes[id]["scale"]);

    scene.add(pasta);

    var box = new THREE.Box3().setFromObject(pasta);
    box.getCenter(pasta.position); // this re-sets the mesh position
    pasta.position.multiplyScalar(- 1);

    var pivot = new THREE.Group();
    scene.add(pivot);
    pivot.add(pasta);


    function render(time) {
        time *= 0.001;

        pivot.rotation.x = pasta_shapes[id]["rot"][0] * time;
        pivot.rotation.y = pasta_shapes[id]["rot"][1] * time;
        pivot.rotation.z = pasta_shapes[id]["rot"][2] * time;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    window.addEventListener("resize", onWindowResize, false);
    requestAnimationFrame(render);
    // renderer.render(scene, camera);
}

// default
var id = 0;
const pasta_type = document.querySelector("#pasta_type");
const pasta_eq = document.querySelector("#pasta_eq");
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas,
        alpha: true,
        antialias: true
    });

// Canvas & Renderer
renderer.setSize(sizes.width, sizes.width);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 0);

let scene, geometry, pasta, material;
// camera
const fov = 45;
const aspect = sizes.width / sizes.height;  // the canvas default
const near = 0.1;
const far = 20000;;
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


// Ad Lights
const color = 0xFFFFFF;
const intensity = 0.6;
const light1 = new THREE.DirectionalLight(color, intensity);
light1.position.set(-1, 2, 4);

const light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(1, -2, -4);

const amblight = new THREE.AmbientLight(0xFFFFFF, 0.6);


// Load Material
material = new THREE.MeshStandardMaterial({ color: 0xFED21A, map: texture_loader });
material.side = THREE.DoubleSide;
material.metalness = 0.0;
material.roughness = 1.0;
// material.bump = 1.2;

var segments = 150; // higher segments results in better resolution
main(id);

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;
    if (e.keyCode == '37' || e.keyCode == '72') {
        // left arrow
        id = ((id - 1) > -1) ? (id - 1) : pasta_shapes.length - 1;
    }
    else if (e.keyCode == '39' || e.keyCode == '76') {
        // right arrow
        id = ((id + 1) < pasta_shapes.length) ? (id + 1) : 0;
    }
    main(id);
    renderMathInElement(pasta_eq);
    document.documentElement.scrollTo(0, 0);
    // document.documentElement.scrollLeft=0;
}

// Touch controls
let touchstartX = 0;
let touchendX = 0;

function checkDirection() {
    let has_swiped = false;
    if (touchendX + 70 < touchstartX) {
        id = ((id + 1) < pasta_shapes.length) ? (id + 1) : 0;
        has_swiped = true;
    }
    if (touchendX > touchstartX + 70) {
        id = ((id - 1) > -1) ? (id - 1) : pasta_shapes.length - 1;
        has_swiped = true;
    }
    main(id);
    renderMathInElement(pasta_eq);
    if (has_swiped) {
        document.documentElement.scrollTo(0, 0);
        // document.documentElement.scrollLeft=0;
    }
}

function canvas_swipe() {
    canvas.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX
    },
        { passive: true },
    );

    canvas.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX
        checkDirection()
    },
        { passive: true },
    );
}

document.addEventListener("DOMContentLoaded", canvas_swipe);
