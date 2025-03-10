# Rubik's Cube

A Rubik's Cube model built with in-browser rendering 3D graphics library Three.js. Extension of a computer graphics course assignment.

## How to interact with the cube:
- use key bindings "R", "L", "M", "U", "D", "F", "B" which correspond to the [Rubik's Cube notation](https://ruwix.com/the-rubiks-cube/notation/)
- '1' for clockwise direction
- '2' for counterclockwise direction (i.e. in rubik notation this is R', L' etc.)
- 'ctrl + z' to undo the last move
- note: front face is always taken to be +z face (red)

## Backend
Using FastAPI. To run,
```
python backend/main.py
```

Global variable `cube_state` tracks the stickers for the faces of the cube in a 6x3x3 numpy array. The faces are the first axis, in the order (U, R, F, D, L, B). Each face is a 3x3 array labeled 1 through 9, representing the locations described [below](#highlight-finding-the-cube-definition-string).

### API Endpoints:

`POST /move`: Applies a move to the cube and returns the updated cube state as a string.

Request body:
```
{
   "move": "F" // Rotate front face
}
```
Response
```
{
   "move": "F",
   "cube_string": "UUUUUULLLURRURRURRFFFFFFFFFRRRDDDDDDLLDLLDLLDBBBBBBBBB"
}
```

`GET /solve`: Solves the current cube state using the Kociemba solver and returns the solution.

Reponse:
```
{
    "solutionString": "F' U' R2",
    "parsedMoves": ["F'", "U'", ["R", "R"]]
}
```
Errors:
- **400 Bad Request**: If the cube state is invalid (the Kociema solver doesn't recognize it)
- **500 Internal Server Error**: Something unexpected happens.

`POST /reset_cube`: Resets the cube to the solved state.

Response:
```
{}
```



## Currently in the works:
- debugging cube solver
- testing to find edge cases and handle errors gracefully
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
- (Implemented) Introduce a representation of the cube in the backend that updates with every rotation. This representation can be easily transformed into a string format recognized by the Kociemba solver. *The main challenge is ensuring that the animated cube on the frontend and the backend representation are synchronized at all times.* The `/move` API endpoint is called for every move, whether made by the user or the automatic solver. In a future refactoring, I plan to use this backend representation as a single source of truth so that the cube state and animation are updated atomically.
