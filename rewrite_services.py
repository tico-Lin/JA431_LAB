import json

with open('public/data/servicesData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

sow_text = """
【服務內容涵蓋 Scope of Work】
1. 樣品進樣前化學相容性與表面前處理評估
2. 實驗參數優化設定建議與貴儀行政代辦協助 (可協助企業完成註冊與預約)
3. 數據回傳後之高階去卷積 (Deconvolution) 擬合與圖譜解析

* 附註：外部核心設施之上機規費由客戶依官方業界費率自行結算或實報實銷，本報價僅含技術顧問、樣品製備與解析報告費。"""

deliverable_internal = "【交付成果】原始數據 (Raw Data) + 基本標定圖檔 (Origin/CSV/PNG)。"
deliverable_advanced = "【交付成果】含各元素化學態能級歸屬 (Binding Energy) 與定量分析之「技術分析總結報告書 (PDF)」。"

for item in data['items']:
    # Clean up old disclaimer
    if '⚠️' in item.get('description', ''):
        item['description'] = item['description'].split('⚠️')[0].strip()

    # Apply deliverables and SOW based on item type
    if item['id'].startswith('nstc-'):
        item['institution'] = "國家級共用核心設施"
        item['serviceType'] = "客製化前處理與數據解析報告"
        if 'location' in item: del item['location']
        if 'instrumentCode' in item: del item['instrumentCode']
        
        if item['id'] == 'nstc-esca':
            item['instrumentModel'] = "高階單色化 X 射線光電子能譜 (Monochromatic XPS)"
            item['description'] = "分析材料表面的元素組成與化學鍵結狀態，可進行表面化學態分析與深度剖析。\n" + deliverable_advanced + "\n" + sow_text
        elif item['id'] == 'nstc-sem':
            item['instrumentModel'] = "超高解析度場發射掃描式電子顯微鏡 (UHR FE-SEM)"
            item['description'] = "高解析度表面微觀形貌觀察，提供奈米材料、半導體元件等表面結構之專業解析。\n" + deliverable_advanced.replace("各元素化學態能級歸屬 (Binding Energy) 與定量分析", "奈米微觀形貌特徵與粒徑分佈量測") + "\n" + sow_text
        elif item['id'] == 'nstc-tem':
            item['instrumentModel'] = "場發射穿透式電子顯微鏡 (FE-TEM + EDS)"
            item['description'] = "原子級晶格解析、電子繞射分析(SAED)，與奈米級微區元素定性/定量分析顧問。\n" + deliverable_advanced.replace("各元素化學態能級歸屬 (Binding Energy)", "原子級晶格與繞射晶相判定") + "\n" + sow_text
        elif item['id'] == 'nstc-xrd':
            item['instrumentModel'] = "高解析 X 光繞射儀 (HR-XRD)"
            item['description'] = "材料結晶相鑑定、晶粒大小計算、晶格常數精算、薄膜掠角繞射(GIXRD)等進階解析。\n" + deliverable_advanced.replace("各元素化學態能級歸屬 (Binding Energy) 與定量分析", "精修晶格參數與結晶相鑑定") + "\n" + sow_text
    
    elif not item['id'].startswith('prep-'):
        # Internal equipment
        item['description'] = item.get('description', '').replace(deliverable_internal, '').strip() + "\n\n" + deliverable_internal
        if '⚠️' in item.get('description', ''):
             item['description'] = item['description'].split('⚠️')[0].strip()

with open('public/data/servicesData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated servicesData.json based on consulting strategy.")
