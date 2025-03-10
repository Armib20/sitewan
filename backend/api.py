from fastapi import APIRouter, Request, HTTPException
from kociemba import solve
import utils


router = APIRouter()

# Initial solved state in kociemba notation
cube_state = utils.create_solved_cube_state()
solved_str = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"


@router.post("/move")
async def apply_move(request: Request):
    body = await request.json()
    move = body.get("move")
    global cube_state
    cube_state = utils.update_cube_state(cube_state, move)
    return {"move": move, "cube_string": "".join(cube_state.flatten())}


@router.get("/solve")
async def solve_cube():
    cube_string = "".join(cube_state.flatten())
    if cube_string == solved_str:
        return {"solutionString": "", "parsedMoves": []}
    else:
        try:
            solution = solve(cube_string)
            moves = utils.parse_moves(solution)
            return {"solutionString": solution, "parsedMoves": moves}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/reset-cube")
async def reset_cube():
    global cube_state
    cube_state = utils.create_solved_cube_state()
    return {}
