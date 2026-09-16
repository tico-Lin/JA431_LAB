with open('src/components/PRGenerator/ServicesAdmin.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if ".join('\n" in line:
        line = line.replace(".join('\n", ".join('\\n'")
    elif "') || ''\n" in line:
        continue # this was from the broken newline
    elif ".split('\n" in line:
        line = line.replace(".split('\n", ".split('\\n'")
    elif "').filter(" in line:
        continue # this was from the broken newline
    new_lines.append(line)

with open('src/components/PRGenerator/ServicesAdmin.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
