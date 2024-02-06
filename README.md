# Rubik's Cube

A Rubik's Cube model built with in-browser rendering 3D graphics library Three.js. Extension of a computer graphics course assignment.

## How to interact with the cube:
- use key bindings "R", "L", "M", "U", "D", "F", "B" which correspond to the [Rubik's Cube notation](https://ruwix.com/the-rubiks-cube/notation/)
- '1' for clockwise direction
- '2' for counterclockwise direction (i.e. in rubik notation this is R', L' etc.)
- 'ctrl + z' to undo the last move
- note: front face is always taken to be +z face (red)


## Currently in the works:
- cube solver
- face rotation key bindings relative to orientation wrt camera


## Highlight: Finding the Cube Definition String
The notation used by the Kociemba solver follows a different order than what can be naturally formed by my 3D array representation of the cube. Hence, some tricks are required to make the conversion.

The cube definition string comprises of 54 characters, one for each visible cubelet on a face. The character represents the face which a color belongs to in its solved permutation. The position of the character in the string follows a row by row order for each of the six faces (U, R, F, D, L, B).

Cube String Notation used by [kociemba](https://pypi.org/project/kociemba/):
```
            |************|
            | U1  U2  U3 |
            |            |
            | U4  U5  U6 |
            |            |
            | U7  U8  U9 |
************|************|************|************
 L1  L2  L3 | F1  F2  F3 | R1  R2  R3 | B1  B2  B3 
            |            |            |            
 L4  L5  L6 | F4  F5  F6 | R4  R5  R6 | B4  B5  B6 
            |            |            |            
 L7  L8  L9 | F7  F8  F9 | R7  R8  R9 | B7  B8  B9 
************|************|************|************
            | D1  D2  D3 |
            |            |
            | D4  D5  D6 |
            |            |
            | D7  D8  D9 |
            |************|
```
In contrast, the order of addition I used to create my Rubik's cube is based on the world position of the cubelets. This means that I have 27 objects that each have 6 faces upon which I have assigned some color. 

Order of addition by filling along the axes z, y, x:
```
            |************|
            | 07  16  25 |
            |     up     |
            | 08  17  26 |
            |   white    |
            | 09  18  27 |
************|************|************|************
 07  08  09 | 09  18  27 | 27  26  25 | 25  16  07 
    left    |   front    |   right    |    back    
 04  05  06 | 06  15  24 | 24  23  22 | 22  13  04 
    green   |    red     |    blue    |   orange   
 01  02  03 | 03  12  21 | 21  20  19 | 19  10  01 
************|************|************|************
            | 03  12  21 |
            |    down    |
            | 02  11  20 |
            |   yellow   |
            | 01  10  19 |
            |************|
```

I have a 3x3x3 array of cubelets (from now I will refer to as 'cube' or 'object'). Each object is assigned a list of materials (which include color info) for the six faces in the order +x, -x, +y, -y, +z, -z. The position of the cubes can be obtained using getWorldPosition.

To get the definition string, I need the color information for each visible face in the order used by the notation. This requires getting each cube to access the materials list attached to it. The problem is in the order. 

Since the position of the cubes change after some moves, my 3D array is no longer sorted by position, which means that there is no quick way for me to retrieve the cube object that currently occupies U1, for example.

Instead, these are some ideas:
- Maintain position in the 3D array as an invariant by implementing a 'rotation' of the cubes in the array for each face rotation. Then I can access the cubes in order. *This introduces an $O(n^2)$ operation, n is side length = 3, for every rotation.*
- Use raytracing to cast rays that will intersect with rows of 3 cubes at a time to get the color information in the order they are added to the definition string *Raytracing will accurately get the cubes without needing to deal with their data representation, but creating rays and getting intersections can be slow and there is duplicate work done.*
- Iterate over the list of cubes, get their world position which will map to 1 (center), 2 (edge) or 3 (corner) indices in the definition string. Based on the index, I know which face it represents and can retrieve the color for that face on the cube. Then the color code can be mapped to a character representing the face on which that color belongs.
`{whiteHex:'U', blueHex:'R', redHex:'F', yellowHex:'D', greenHex:'L', orangeHex:'B'}`. *This requires some extra memory for storing mappings.*

The third idea is what I implemented because it is most time efficient. Now I just need the mapping from world position to indices in the definition string.
U=[0,9), R=[9,18), F=[18,27), D=[27,36), L[36,45), B=[45,54)
x=1.1 R
x=-1.1 L
y=1.1 U
y=-1.1 D

- 0 zeros = corner
- 1 zero = edge 
- 2 zeros = center
- 3 zeros --> ignore




