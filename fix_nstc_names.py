import json

with open('public/data/servicesData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data['items']:
    if '-nstc' in item['id']:
        item['name'] = item['name'].replace('國科會儀器', '他校貴儀')
        item['description'] = item['description'].replace('國科會', '他校貴儀')
        if 'localizedNames' in item and 'en' in item['localizedNames']:
            item['localizedNames']['en'] = item['localizedNames']['en'].replace('NSTC', 'External')
        if 'localizedDescriptions' in item and 'en' in item['localizedDescriptions']:
            item['localizedDescriptions']['en'] = item['localizedDescriptions']['en'].replace('NSTC', 'External')

with open('public/data/servicesData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Fixed NSTC names to '他校貴儀'.")
