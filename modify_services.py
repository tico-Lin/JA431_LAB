import json

with open('public/data/servicesData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Filter out HPLC, GCMS, NMR
items = [item for item in data['items'] if item['id'] not in ('chrom-hplc', 'chrom-gcms', 'spec-nmr-400')]

# Add instrumentModel to existing CV and EIS
for item in items:
    if item['id'] == 'ec-cv':
        item['instrumentModel'] = 'BioLogic SP-50e'
    elif item['id'] == 'ec-eis':
        item['instrumentModel'] = 'BioLogic SP-50e'
    elif item['id'] == 'aa-sem':
        item['instrumentModel'] = 'Hitachi SU8010'
    elif item['id'] == 'aa-xrd':
        item['instrumentModel'] = 'Rigaku SmartLab'

# Add NSTC versions
nstc_items = [
    {
        "id": "ec-cv-nstc",
        "category": "electrochemical",
        "name": "高階循環伏安法測試 (CV) - 國科會儀器",
        "localizedNames": {
            "en": "Advanced Cyclic Voltammetry (CV) - NSTC"
        },
        "instrumentModel": "Autolab PGSTAT302N",
        "basePrice": 1500,
        "unit": "樣品/條件",
        "turnaroundDays": 5,
        "description": "測量電極材料之氧化還原電位與可逆性。使用國科會等級高精度設備。",
        "localizedDescriptions": {
            "en": "Measure the redox potential and reversibility of electrode materials using NSTC high-precision equipment."
        },
        "requiresSampleType": ["electrode_sheet"],
        "minSamples": 1,
        "allowCustomParams": True
    },
    {
        "id": "ec-eis-nstc",
        "category": "electrochemical",
        "name": "高階電化學阻抗光譜 (EIS) - 國科會儀器",
        "localizedNames": {
            "en": "Advanced Electrochemical Impedance Spectroscopy (EIS) - NSTC"
        },
        "instrumentModel": "Autolab PGSTAT302N",
        "basePrice": 2000,
        "unit": "樣品/條件",
        "turnaroundDays": 5,
        "description": "分析電極與電解液介面之電荷轉移電阻與擴散行為。使用國科會等級高精度設備。",
        "localizedDescriptions": {
            "en": "Analyze the charge transfer resistance and diffusion behavior at the electrode-electrolyte interface using NSTC high-precision equipment."
        },
        "requiresSampleType": ["electrode_sheet"],
        "dependencies": ["ec-cv-nstc"],
        "minSamples": 1,
        "allowCustomParams": True
    },
    {
        "id": "aa-sem-nstc",
        "category": "advanced_analysis",
        "name": "超高解析度場發射掃描式電子顯微鏡 (FE-SEM) - 國科會儀器",
        "localizedNames": {
            "en": "Ultra-High Resolution FE-SEM - NSTC"
        },
        "instrumentModel": "JEOL JSM-7600F",
        "basePrice": 3500,
        "unit": "小時",
        "turnaroundDays": 7,
        "description": "觀察樣品表面超高解析度微觀形貌，可選配EDS進行元素分析。",
        "localizedDescriptions": {
            "en": "Observe ultra-high resolution surface micro-morphology of samples, optional EDS."
        },
        "requiresSampleType": ["powder", "electrode_sheet"],
        "minSamples": 1,
        "allowCustomParams": True
    }
]

# Add prep category and items
if not any(cat['id'] == 'sample_prep' for cat in data['categories']):
    data['categories'].append({
        "id": "sample_prep",
        "name": "樣品前處理與加工",
        "localizedNames": {
            "en": "Sample Preparation & Processing"
        }
    })

prep_items = [
    {
        "id": "prep-general",
        "category": "sample_prep",
        "name": "一般樣品前處理",
        "localizedNames": {
            "en": "General Sample Preparation"
        },
        "basePrice": 200,
        "unit": "樣品",
        "turnaroundDays": 1,
        "description": "包含基本的秤重、溶解、稀釋或過濾等。",
        "localizedDescriptions": {
            "en": "Includes basic weighing, dissolution, dilution, or filtration."
        },
        "requiresSampleType": ["powder", "liquid"],
        "minSamples": 1,
        "allowCustomParams": False
    },
    {
        "id": "prep-electrode",
        "category": "sample_prep",
        "name": "客製化電極塗佈 (Drop-casting/Coating)",
        "localizedNames": {
            "en": "Custom Electrode Coating"
        },
        "basePrice": 500,
        "unit": "片",
        "turnaroundDays": 2,
        "description": "將粉末樣品調配漿料並均勻塗佈於玻碳電極或碳布/銅箔上。",
        "localizedDescriptions": {
            "en": "Prepare slurry from powder samples and coat uniformly on GC or carbon cloth/Cu foil."
        },
        "requiresSampleType": ["powder"],
        "minSamples": 1,
        "allowCustomParams": True
    },
    {
        "id": "prep-sem-gold",
        "category": "sample_prep",
        "name": "SEM 樣品鍍金/鍍白金",
        "localizedNames": {
            "en": "SEM Sample Sputtering (Au/Pt)"
        },
        "basePrice": 300,
        "unit": "次",
        "turnaroundDays": 1,
        "description": "為非導電樣品進行表面濺鍍金或白金，以增加導電性，避免電荷累積。",
        "localizedDescriptions": {
            "en": "Sputter Au or Pt on non-conductive samples to increase conductivity for SEM."
        },
        "requiresSampleType": ["powder", "electrode_sheet"],
        "minSamples": 1,
        "allowCustomParams": False
    }
]

data['items'] = items + nstc_items + prep_items

with open('public/data/servicesData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated servicesData.json successfully.")
