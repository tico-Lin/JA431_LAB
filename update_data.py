import json
import os

# 1. Update servicesData.json
services_path = '/workspaces/JA431_LAB/public/data/servicesData.json'
with open(services_path, 'r', encoding='utf-8') as f:
    services = json.load(f)

# Add Chromatography category
if not any(c['id'] == 'chromatography' for c in services['categories']):
    services['categories'].append({
        "id": "chromatography",
        "name": "層析與質譜分析",
        "localizedNames": {
            "en": "Chromatography & Mass Spectrometry"
        }
    })

# Add Services
new_services = [
    {
        "id": "spec-nmr-400",
        "category": "spectroscopy",
        "name": "核磁共振分析 (NMR-400)",
        "localizedNames": {
            "en": "Nuclear Magnetic Resonance (NMR-400)"
        },
        "basePrice": 500,
        "unit": "樣品",
        "turnaroundDays": 5,
        "description": "分析有機分子與材料之分子結構及純度。",
        "localizedDescriptions": {
            "en": "Analyze molecular structure and purity of organic molecules and materials."
        },
        "requiresSampleType": ["liquid", "powder"],
        "minSamples": 1,
        "allowCustomParams": True
    },
    {
        "id": "aa-sem",
        "category": "advanced_analysis",
        "name": "掃描式電子顯微鏡 (SEM)",
        "localizedNames": {
            "en": "Scanning Electron Microscopy (SEM)"
        },
        "basePrice": 1500,
        "unit": "小時",
        "turnaroundDays": 7,
        "description": "觀察樣品表面微觀形貌，可選配EDS進行元素分析。",
        "localizedDescriptions": {
            "en": "Observe surface micro-morphology of samples, optional EDS for elemental analysis."
        },
        "requiresSampleType": ["powder", "electrode_sheet"],
        "minSamples": 1,
        "allowCustomParams": True
    },
    {
        "id": "aa-xrd",
        "category": "advanced_analysis",
        "name": "X光繞射光譜分析 (XRD)",
        "localizedNames": {
            "en": "X-ray Diffraction (XRD)"
        },
        "basePrice": 600,
        "unit": "樣品",
        "turnaroundDays": 5,
        "description": "分析材料結晶相、晶格常數及結晶度。",
        "localizedDescriptions": {
            "en": "Analyze crystalline phase, lattice parameters, and crystallinity of materials."
        },
        "requiresSampleType": ["powder", "electrode_sheet"],
        "minSamples": 1,
        "allowCustomParams": True
    },
    {
        "id": "chrom-gcms",
        "category": "chromatography",
        "name": "氣相層析質譜分析 (GC/MS)",
        "localizedNames": {
            "en": "Gas Chromatography-Mass Spectrometry (GC/MS)"
        },
        "basePrice": 2000,
        "unit": "樣品",
        "turnaroundDays": 7,
        "description": "揮發性及半揮發性有機化合物之定性與定量分析。",
        "localizedDescriptions": {
            "en": "Qualitative and quantitative analysis of volatile and semi-volatile organic compounds."
        },
        "requiresSampleType": ["liquid"],
        "minSamples": 1,
        "allowCustomParams": True
    },
    {
        "id": "chrom-hplc",
        "category": "chromatography",
        "name": "高效能液相層析分析 (HPLC)",
        "localizedNames": {
            "en": "High-Performance Liquid Chromatography (HPLC)"
        },
        "basePrice": 1500,
        "unit": "樣品",
        "turnaroundDays": 5,
        "description": "不易揮發或熱不安定之有機化合物定性與定量分析。",
        "localizedDescriptions": {
            "en": "Qualitative and quantitative analysis of non-volatile or thermally unstable organic compounds."
        },
        "requiresSampleType": ["liquid"],
        "minSamples": 1,
        "allowCustomParams": True
    },
    {
        "id": "spec-ftir",
        "category": "spectroscopy",
        "name": "傅利葉轉換紅外線光譜 (FTIR)",
        "localizedNames": {
            "en": "Fourier-Transform Infrared Spectroscopy (FTIR)"
        },
        "basePrice": 800,
        "unit": "樣品",
        "turnaroundDays": 3,
        "description": "檢測樣品之化學鍵結與官能基特徵。",
        "localizedDescriptions": {
            "en": "Detect chemical bonds and functional groups of samples."
        },
        "requiresSampleType": ["powder", "liquid", "electrode_sheet"],
        "minSamples": 1,
        "allowCustomParams": False
    }
]

for ns in new_services:
    if not any(s['id'] == ns['id'] for s in services['items']):
        services['items'].append(ns)

with open(services_path, 'w', encoding='utf-8') as f:
    json.dump(services, f, ensure_ascii=False, indent=2)


# 2. Update skillsData.json
skills_path = '/workspaces/JA431_LAB/public/data/skillsData.json'
with open(skills_path, 'r', encoding='utf-8') as f:
    skills = json.load(f)

# Add new category
if not any(c['id'] == 'chromatography' for c in skills['categories']):
    skills['categories'].append({
        "id": "chromatography",
        "name": "層析與質譜分析",
        "localizedNames": { "en": "Chromatography & Mass Spec" },
        "color": "#ec4899",
        "description": "氣相與液相層析及質譜技術",
        "localizedDescriptions": { "en": "Gas/Liquid Chromatography and Mass Spectrometry techniques" }
    })

# Add missing localized names for existing categories to make them perfect
cat_localized = {
    "research-focus": {"zh-TW": "研究領域", "desc_zh": "高熵能源材料與農業廢棄物綠色化學"},
    "synthesis": {"zh-TW": "合成方法", "desc_zh": "水熱法、電化學沉積與共沉澱法"},
    "thermal-treatment": {"zh-TW": "熱處理", "desc_zh": "鍛燒與退火以調整相態與表面結構"},
    "characterization": {"zh-TW": "材料分析", "desc_zh": "X光繞射、電子顯微鏡、紅外線及拉曼光譜分析"},
    "electrochemistry": {"zh-TW": "電化學", "desc_zh": "循環伏安、線性掃描、充放電與阻抗分析"},
    "instrument-experience": {"zh-TW": "儀器操作經驗", "desc_zh": "實驗室核心分析儀器"}
}

for cat in skills['categories']:
    if cat['id'] in cat_localized:
        # Move English to localizedNames
        if 'localizedNames' not in cat:
            cat['localizedNames'] = {"en": cat['name']}
            cat['name'] = cat_localized[cat['id']]['zh-TW']
        if 'localizedDescriptions' not in cat:
            cat['localizedDescriptions'] = {"en": cat.get('description', '')}
            cat['description'] = cat_localized[cat['id']]['desc_zh']

# Add new skills
new_skills = [
    {
        "id": "nmr",
        "name": "核磁共振光譜 (NMR)",
        "localizedNames": { "en": "Nuclear Magnetic Resonance (NMR)" },
        "description": "分子結構鑑定與純度分析",
        "localizedDescriptions": { "en": "Molecular structure elucidation and purity analysis" },
        "belongsTo": ["characterization"]
    },
    {
        "id": "gc-ms",
        "name": "氣相層析質譜 (GC-MS)",
        "localizedNames": { "en": "Gas Chromatography-Mass Spec (GC-MS)" },
        "description": "揮發性有機物定性與定量分析",
        "localizedDescriptions": { "en": "Qualitative and quantitative analysis of VOCs" },
        "belongsTo": ["chromatography", "characterization"]
    },
    {
        "id": "hplc",
        "name": "高效能液相層析 (HPLC)",
        "localizedNames": { "en": "High-Performance Liquid Chromatography (HPLC)" },
        "description": "混合物分離與溶液中成分定量",
        "localizedDescriptions": { "en": "Separation of mixtures and quantification of components in solution" },
        "belongsTo": ["chromatography", "characterization"]
    },
    {
        "id": "aas",
        "name": "原子吸收光譜 (AAS)",
        "localizedNames": { "en": "Atomic Absorption Spectroscopy (AAS)" },
        "description": "金屬微量元素濃度分析",
        "localizedDescriptions": { "en": "Trace metal concentration analysis" },
        "belongsTo": ["characterization"]
    }
]

# also localize existing skills
skill_localized = {
    "high-entropy-doping": {"zh-TW": "高熵摻雜", "desc_zh": "機能性與能源材料之多元素置換"},
    "agri-waste-green-chemistry": {"zh-TW": "農廢綠色化學", "desc_zh": "將農業廢棄物升級再造為綠色機能材料"},
    "hydrothermal": {"zh-TW": "水熱合成", "desc_zh": "在密閉系統中進行溶液基奈米結構材料生長"},
    "electrodeposition": {"zh-TW": "電化學沉積", "desc_zh": "薄膜與複合電極之電化學沉積技術"},
    "coprecipitation": {"zh-TW": "共沉澱法", "desc_zh": "控制成分組成之均勻前驅物製備"},
    "calcination-annealing": {"zh-TW": "鍛燒與退火", "desc_zh": "調整相態、缺陷與結晶度之熱處理"},
    "xrd": {"zh-TW": "X光繞射 (XRD)", "desc_zh": "相鑑定、結晶度及晶格分析"},
    "sem-eds": {"zh-TW": "掃描式電子顯微鏡與能譜儀 (SEM-EDS)", "desc_zh": "形貌、顆粒分佈與元素映射分析"},
    "ftir": {"zh-TW": "傅立葉轉換紅外線光譜 (FT-IR)", "desc_zh": "官能基與化學鍵結分析"},
    "raman": {"zh-TW": "拉曼光譜 (Raman)", "desc_zh": "振動模式與缺陷敏感結構分析"},
    "cv": {"zh-TW": "循環伏安法 (CV)", "desc_zh": "電化學氧化還原行為與可逆性分析"},
    "lsv": {"zh-TW": "線性掃描伏安法 (LSV)", "desc_zh": "線性電位掃描下之電流響應分析"},
    "gcd": {"zh-TW": "恆電流充放電 (GCD)", "desc_zh": "電容量、庫倫效率與循環穩定性評估"},
    "eis": {"zh-TW": "電化學阻抗光譜 (EIS)", "desc_zh": "電荷轉移與介面阻抗分析"},
    "sp-50e": {"zh-TW": "SP-50e 電化學工作站", "desc_zh": "實驗室核心電化學工作站操作"}
}

for s in skills['skills']:
    if s['id'] in skill_localized:
        if 'localizedNames' not in s:
            s['localizedNames'] = {"en": s['name']}
            s['name'] = skill_localized[s['id']]['zh-TW']
        if 'localizedDescriptions' not in s:
            s['localizedDescriptions'] = {"en": s.get('description', '')}
            s['description'] = skill_localized[s['id']]['desc_zh']

for ns in new_skills:
    if not any(s['id'] == ns['id'] for s in skills['skills']):
        skills['skills'].append(ns)

with open(skills_path, 'w', encoding='utf-8') as f:
    json.dump(skills, f, ensure_ascii=False, indent=2)

print("Data updated successfully.")
