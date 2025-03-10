import numpy as np


def create_solved_cube_state():
    return np.array(
        [
            [["U"] * 3 for _ in range(3)],  # white
            [["R"] * 3 for _ in range(3)],  # blue
            [["F"] * 3 for _ in range(3)],  # red
            [["D"] * 3 for _ in range(3)],  # yellow
            [["L"] * 3 for _ in range(3)],  # green
            [["B"] * 3 for _ in range(3)],  # orange
        ]
    )


def rotate_face_clockwise(face):
    return np.rot90(face, -1)


def rotate_face_counterclockwise(face):
    return np.rot90(face, 1)


# rotation direction wrt to looking at the face
def rotate_cube_face(cube_state: np.array, face_idx: int, clockwise=True):
    if clockwise:
        cube_state[face_idx] = rotate_face_clockwise(cube_state[face_idx])
    else:
        cube_state[face_idx] = rotate_face_counterclockwise(cube_state[face_idx])


# Rotate F clockwise
def rotate_front_clockwise(cube_state):
    rotate_cube_face(cube_state, 2, clockwise=True)
    temp = cube_state[0][2, :].copy()  # U789
    cube_state[0][2, :] = cube_state[4][:, 2][::-1]  # L963 -> U[2]
    cube_state[4][:, 2] = cube_state[3][0, :]  # D123 -> L369
    cube_state[3][0, :] = cube_state[1][:, 0][::-1]  # R741 -> D123
    cube_state[1][:, 0] = temp  # U789 -> R147


# Rotate F counterclockwise
def rotate_front_counterclockwise(cube_state):
    rotate_cube_face(cube_state, 2, clockwise=False)
    temp = cube_state[0][2, :].copy()  # U789
    cube_state[0][2, :] = cube_state[1][:, 0]  # R147 -> U[2]
    cube_state[1][:, 0] = cube_state[3][0, :][::-1]  # D321 -> R147
    cube_state[3][0, :] = cube_state[4][:, 2]  # L369 -> D123
    cube_state[4][:, 2] = temp[::-1]  # U987 -> L369


# Rotate R clockwise
def rotate_right_clockwise(cube_state):
    rotate_cube_face(cube_state, 1, clockwise=True)
    temp = cube_state[0][:, 2][::-1].copy()  # U963 -> temp
    cube_state[0][:, 2] = cube_state[2][:, 2]  # F369 -> U
    cube_state[2][:, 2] = cube_state[3][:, 2]  # D369 -> F
    cube_state[3][:, 2] = cube_state[5][:, 0][::-1]  # B741 -> D
    cube_state[5][:, 0] = temp  # U963 -> B


# Rotate R counterclockwise
def rotate_right_counterclockwise(cube_state):
    rotate_cube_face(cube_state, 1, clockwise=False)
    temp = cube_state[0][:, 2].copy()  # U -> temp
    cube_state[0][:, 2] = cube_state[5][:, 0]  # B147 -> U
    cube_state[5][:, 0] = cube_state[3][:, 2][::-1]  # D963 -> B
    cube_state[3][:, 2] = cube_state[2][:, 2]  # F369 -> D369
    cube_state[2][:, 2] = temp  # temp -> F


# Rotate L clockwise
def rotate_left_clockwise(cube_state):
    rotate_cube_face(cube_state, 4, clockwise=True)
    temp = cube_state[0][:, 0].copy()  # U147
    cube_state[0][:, 0] = cube_state[5][:, 2][::-1]  # B963 -> U147
    cube_state[5][:, 2] = cube_state[3][:, 0][::-1]  # D741 -> B369
    cube_state[3][:, 0] = cube_state[2][:, 0]  # F147 -> D147
    cube_state[2][:, 0] = temp  # U147 -> F147


# Rotate L counterclockwise
def rotate_left_counterclockwise(cube_state):
    rotate_cube_face(cube_state, 4, clockwise=False)
    temp = cube_state[0][:, 0][::-1].copy()  # U741
    cube_state[0][:, 0] = cube_state[2][:, 0]  # F147 -> U147
    cube_state[2][:, 0] = cube_state[3][:, 0]  # D147 -> F147
    cube_state[3][:, 0] = cube_state[5][:, 2][::-1]  # B963 -> D147
    cube_state[5][:, 2] = temp  # U741 -> B369


# Rotate U clockwise
def rotate_up_clockwise(cube_state):
    rotate_cube_face(cube_state, 0, clockwise=True)
    temp = cube_state[4][0, :].copy()  # L[0]
    cube_state[4][0, :] = cube_state[2][0, :]  # F -> L
    cube_state[2][0, :] = cube_state[1][0, :]  # R -> F
    cube_state[1][0, :] = cube_state[5][0, :]  # B -> R
    cube_state[5][0, :] = temp  # L -> B


# Rotate U counterclockwise
def rotate_up_counterclockwise(cube_state):
    rotate_cube_face(cube_state, 0, clockwise=False)
    temp = cube_state[4][0, :].copy()  # L[0]
    cube_state[4][0, :] = cube_state[5][0, :]  # B -> L
    cube_state[5][0, :] = cube_state[1][0, :]  # R -> B
    cube_state[1][0, :] = cube_state[2][0, :]  # F -> R
    cube_state[2][0, :] = temp  # L -> F


# Rotate D counterclockwise
def rotate_down_counterclockwise(cube_state):
    rotate_cube_face(cube_state, 3, clockwise=False)
    temp = cube_state[4][2, :].copy()  # L[2]
    cube_state[4][2, :] = cube_state[2][2, :]  # F -> L
    cube_state[2][2, :] = cube_state[1][2, :]  # R -> F
    cube_state[1][2, :] = cube_state[5][2, :]  # B -> R
    cube_state[5][2, :] = temp  # L -> B


# Rotate D clockwise
def rotate_down_clockwise(cube_state):
    rotate_cube_face(cube_state, 3, clockwise=True)
    temp = cube_state[4][2, :].copy()  # L[2]
    cube_state[4][2, :] = cube_state[5][2, :]  # B -> L
    cube_state[5][2, :] = cube_state[1][2, :]  # R -> B
    cube_state[1][2, :] = cube_state[2][2, :]  # F -> R
    cube_state[2][2, :] = temp  # L -> F


# Rotate B clockwise
def rotate_back_clockwise(cube_state):
    rotate_cube_face(cube_state, 5, clockwise=True)
    temp = cube_state[0][0, :][::-1].copy()  # U321
    cube_state[0][0, :] = cube_state[1][:, 2]  # R369 -> U123
    cube_state[1][:, 2] = cube_state[3][2, :][::-1]  # D987 -> R369
    cube_state[3][2, :] = cube_state[4][:, 0]  # L147 -> D789
    cube_state[4][:, 0] = temp  # U321 -> L147


# Rotate B counterclockwise
def rotate_back_counterclockwise(cube_state):
    rotate_cube_face(cube_state, 5, clockwise=False)
    temp = cube_state[0][0, :].copy()  # U123
    cube_state[0][0, :] = cube_state[4][:, 0][::-1]  # L741 -> U[0]
    cube_state[4][:, 0] = cube_state[3][2, :]  # D789 -> L147
    cube_state[3][2, :] = cube_state[1][:, 2][::-1]  # R963 -> D[2]
    cube_state[1][:, 2] = temp  # U[0] -> R369


# orient whole cube on R counterclockwise
def x_down(cube_state):
    temp = cube_state[0].copy()
    cube_state[0] = np.flipud(cube_state[5])  # B (flipped) -> U
    cube_state[5] = np.flipud(cube_state[3])  # D (flipped) -> B
    cube_state[3] = cube_state[2]  # F -> D
    cube_state[2] = temp  # U -> F
    rotate_cube_face(cube_state, 1, clockwise=False)
    rotate_cube_face(cube_state, 4, clockwise=True)


# orient whole cube on R clockwise
def x_up(cube_state):
    temp = cube_state[0].copy()
    cube_state[0] = cube_state[2]  # F -> U
    cube_state[2] = cube_state[3]  # D -> F
    cube_state[3] = np.flipud(cube_state[5])  # B (flipped) -> D
    cube_state[5] = np.flipud(temp)  # U (flipped) -> B
    rotate_cube_face(cube_state, 1, clockwise=True)
    rotate_cube_face(cube_state, 4, clockwise=False)


def update_cube_state(cube_state, move):
    match move:
        case "R":
            rotate_right_clockwise(cube_state)
        case "R'":
            rotate_right_counterclockwise(cube_state)
        case "L":
            rotate_left_clockwise(cube_state)
        case "L'":
            rotate_left_counterclockwise(cube_state)
        case "U":
            rotate_up_clockwise(cube_state)
        case "U'":
            rotate_up_counterclockwise(cube_state)
        case "D":
            rotate_down_clockwise(cube_state)
        case "D'":
            rotate_down_counterclockwise(cube_state)
        case "F":
            rotate_front_clockwise(cube_state)
        case "F'":
            rotate_front_counterclockwise(cube_state)
        case "B":
            rotate_back_clockwise(cube_state)
        case "B'":
            rotate_back_counterclockwise(cube_state)
        case "M":
            rotate_right_counterclockwise(cube_state)
            rotate_left_clockwise(cube_state)
            x_up(cube_state)
        case "M'":
            rotate_right_clockwise(cube_state)
            rotate_left_counterclockwise(cube_state)
            x_down(cube_state)
        case _:
            raise ValueError("Invalid move", move)
    print_cube_state(get_color_str(cube_state.copy()))
    return cube_state


# eg. solution: "R' D2 R' U2 R F2 D B2 U' R F' U R2 D L2 D' B2 R2 B2 U' B2"
# parse the output of the solver (solution string) and translates it into a list of cube moves
# Each move is either a string (e.g., "R", "R'") or a list of two moves
# for double turns (e.g., "D2" → ["D", "D"])
def parse_moves(solution):
    moves = []
    for m in solution.split():
        if "2" in m:
            moves.append([m[0], m[0]])
        else:
            moves.append(m)
    return moves


# functions for debugging
def get_color_str(cube_state):
    map = {"U": "W", "R": "B", "F": "R", "D": "Y", "L": "G", "B": "O"}
    for (i, j, k), value in np.ndenumerate(cube_state):
        cube_state[i][j][k] = map[value]
    return cube_state


def print_cube_state(cube_state):
    # Printing the U face
    for i in range(3):
        print(" " * 17 + "|" + f" {str(cube_state[0][i])} " + "|")
    print(" " * 17 + "-" * 17)
    # Print L,F,R,B
    for i in range(3):
        row = " |"
        for j in [4, 2, 1, 5]:
            row += f" {str(cube_state[j][i])} " + "|"
        print(row)
    print(" " * 17 + "-" * 17)
    # Printing the D face
    for i in range(3):
        print(" " * 17 + "|" + f" {str(cube_state[3][i])} " + "|")
