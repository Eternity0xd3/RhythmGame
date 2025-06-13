import json

# format:[[line,timing,type,other args], [line,timing,type,other args], ...]

with open ("tracks\Armageddom\modified.txt", encoding="utf-8") as f:
    ctx = f.readlines()

output = []
for eachline in ctx:
    args = eachline.split(",")

    line_arg = args[0]
    line_result = -1
    match line_arg:
        case '64':
            line_result = 0
        case '192':
            line_result = 1
        case '320':
            line_result = 2
        case '448':
            line_result = 3
    
    timing_result = int(args[2])
    type_arg = args[3]
    other_arg = args[5]
    first_arg = other_arg.split(":")[0]
    type_result = 0
    last_time = 0
    match type_arg:
        case '1':
            type_result = "note"
        case '128':
            type_result = "hold"
            end = int(first_arg)
            last_time = end-timing_result
    
    new_eachline = [line_result,timing_result,type_result,last_time]
    output.append(new_eachline)

print(output)

with open("tracks\Armageddom\data.json", "w") as file:
    json.dump(output, file)