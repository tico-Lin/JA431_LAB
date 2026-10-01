import json

with open('public/data/servicesData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

disclaimer = "⚠️ 【規費分離說明】此報價為專業數據解析與樣品製備顧問費。為求最高解析度，本項目規劃於外部國家級貴儀中心進行測試。儀器上機規費將依該中心官方之業界標準，由委託方另行繳納或實報實銷。"
en_disclaimer = "⚠️ [Fee Separation] This quote covers professional data interpretation and sample prep consulting. Testing will be conducted at a national-level facility. Instrument usage fees will be billed separately based on the facility's official industry rates."

for item in data['items']:
    # Internal equipment tagging
    if not item['id'].startswith('nstc-') and not item['id'].startswith('prep-'):
        item['institution'] = "本實驗室 / 系所自有設備"
        item['serviceType'] = "內部業界標準測試"

    # NSTC advanced consulting items modification
    if item['id'] == 'nstc-esca':
        item['name'] = "高階表面化學態深度解析與峰值擬合"
        item['unit'] = "樣品 (解析與前處理費)"
        item['description'] = item.get('description', '') + "\n\n" + disclaimer
        if 'localizedNames' in item and 'en' in item['localizedNames']:
            item['localizedNames']['en'] = "Advanced XPS Surface Analysis & Peak Fitting"
        if 'localizedDescriptions' in item and 'en' in item['localizedDescriptions']:
            item['localizedDescriptions']['en'] = item['localizedDescriptions']['en'] + "\n\n" + en_disclaimer
            
    elif item['id'] == 'nstc-sem':
        item['name'] = "奈米級表面微觀結構解析與成相顧問"
        item['unit'] = "樣品 (解析與前處理費)"
        item['description'] = item.get('description', '') + "\n\n" + disclaimer
        if 'localizedNames' in item and 'en' in item['localizedNames']:
            item['localizedNames']['en'] = "Advanced FE-SEM Structural Analysis Consulting"
        if 'localizedDescriptions' in item and 'en' in item['localizedDescriptions']:
            item['localizedDescriptions']['en'] = item['localizedDescriptions']['en'] + "\n\n" + en_disclaimer

    elif item['id'] == 'nstc-tem':
        item['name'] = "原子級晶格解析與微區元素定性顧問"
        item['unit'] = "樣品 (解析與前處理費)"
        item['description'] = item.get('description', '') + "\n\n" + disclaimer
        if 'localizedNames' in item and 'en' in item['localizedNames']:
            item['localizedNames']['en'] = "Advanced FE-TEM & EDS Analysis Consulting"
        if 'localizedDescriptions' in item and 'en' in item['localizedDescriptions']:
            item['localizedDescriptions']['en'] = item['localizedDescriptions']['en'] + "\n\n" + en_disclaimer

    elif item['id'] == 'nstc-xrd':
        item['name'] = "進階晶體結構精算與薄膜繞射解析"
        item['unit'] = "樣品 (解析與前處理費)"
        item['description'] = item.get('description', '') + "\n\n" + disclaimer
        if 'localizedNames' in item and 'en' in item['localizedNames']:
            item['localizedNames']['en'] = "Advanced XRD Crystallographic Analysis Consulting"
        if 'localizedDescriptions' in item and 'en' in item['localizedDescriptions']:
            item['localizedDescriptions']['en'] = item['localizedDescriptions']['en'] + "\n\n" + en_disclaimer

with open('public/data/servicesData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated servicesData.json successfully.")
