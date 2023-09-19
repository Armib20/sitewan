import kociemba

# get current cube state

# convert to notation for input
#cube = ""
# call to solve
solution = kociemba.solve("DRLUUBFBRBLURRLRUBLRDDFDLFUFUFFDBRDUBRUFLLFDDBFLUBLRBD").split(" ")
print(solution)
# ['D2', "R'", "D'", 'F2', 'B', 'D', 'R2', 'D2', "R'", 'F2', "D'", 'F2', "U'", 'B2', 'L2', 'U2', 'D', 'R2', 'U']
# parse the output and translate into movements of the cube
def transform(moves):
    transformed = []
    for m in moves:
            if "'" in m:
                transformed.append('2')
                transformed.append(m[0])
                transformed.append('1')
            elif "2" in m:
                transformed.extend([m[0], m[0]])
            else:
                transformed.append(m)
    return transformed

print(transform(solution))
