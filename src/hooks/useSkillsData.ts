import { useState, useEffect, useMemo } from 'react';
import type {
  SkillsData,
  SkillCategory,
  LabMember,
  SkillGap,
  Subcategory,
} from '../types/types';
import { useTranslation } from 'react-i18next';
import { useLocale } from './useLocale';

const DATA_URL = `${import.meta.env.BASE_URL}data/skillsData.json`;

const CATEGORY_NAME_ZH: Record<string, string> = {
  'research-focus': '研究主軸',
  synthesis: '合成方法',
  'thermal-treatment': '修飾與熱處理',
  characterization: '表徵分析',
  electrochemistry: '電化學分析',
  'instrument-experience': '儀器經驗',
};

const CATEGORY_DESC_ZH: Record<string, string> = {
  'research-focus': '高熵儲能材料與農廢綠色化學',
  synthesis: '水熱法、電鍍法與共沉澱法',
  'thermal-treatment': '高溫鍛燒與退火修飾',
  characterization:
    'X 射線繞射（XRD）、掃描式電子顯微鏡與能量散佈光譜（SEM-EDS）、傅立葉轉換紅外光譜（FT-IR）與拉曼光譜（Raman）',
  electrochemistry:
    '循環伏安法（CV）、線性掃描伏安法（LSV）、恆電流充放電（GCD）、電化學阻抗頻譜（EIS）',
  'instrument-experience': 'SP-50e',
};

const SKILL_NAME_ZH: Record<string, string> = {
  'high-entropy-doping': '高熵材料與摻雜',
  'agri-waste-green-chemistry': '農廢綠色化學',
  hydrothermal: '水熱法',
  electrodeposition: '電鍍法',
  coprecipitation: '共沉澱法',
  'calcination-annealing': '高溫鍛燒退火',
  xrd: 'X 射線繞射（XRD）',
  'sem-eds': '掃描式電子顯微鏡與能量散佈光譜（SEM-EDS）',
  ftir: '傅立葉轉換紅外光譜（FT-IR）',
  raman: '拉曼光譜（Raman）',
  cv: '循環伏安法（CV）',
  lsv: '線性掃描伏安法（LSV）',
  gcd: '恆電流充放電（GCD）',
  eis: '電化學阻抗頻譜（EIS）',
  'sp-50e': 'SP-50e',
};

const SKILL_DESC_ZH: Record<string, string> = {
  'high-entropy-doping': '多元素共同調控以提升材料穩定性與性能',
  'agri-waste-green-chemistry': '農業廢棄物升級再利用與綠色轉化',
  hydrothermal: '以水熱條件合成奈米／層狀材料',
  electrodeposition: '以電化學沉積建構功能性薄膜與複材',
  coprecipitation: '以共沉澱控制成分均勻性與前驅物形貌',
  'calcination-annealing': '利用高溫鍛燒與退火調控晶相與缺陷',
  xrd: '相鑑定、結晶性與晶格分析',
  'sem-eds': '形貌、粒徑與元素分布分析',
  ftir: '官能基與化學鍵分析',
  raman: '振動模態與結構缺陷分析',
  cv: '循環伏安分析',
  lsv: '線性掃描伏安分析',
  gcd: '恆電流充放電分析',
  eis: '電化學阻抗分析',
  'sp-50e': 'SP-50e 電化學分析平台',
};

const ROLE_ZH: Record<string, string> = {
  Professor: '教授',
  'Assistant Professor': '助理教授',
  Postdoc: '博士後研究員',
  'PhD Student': '博士生',
  'Master Student': '碩士生',
  'Undergraduate Student': '大學生',
  'Research Assistant': '研究助理',
  'Visiting Scholar': '訪問學者',
  Alumni: '校友',
};

function localizeSkillsData(data: SkillsData, language: 'en' | 'zh-TW') {
  const resolveName = (member: LabMember) => {
    if (language === 'zh-TW') return member.name;
    return member.localizedNames?.en || member.name;
  };

  if (language !== 'zh-TW') {
    return {
      ...data,
      members: data.members.map((member) => ({
        ...member,
        name: resolveName(member),
      })),
    };
  }

  return {
    ...data,
    categories: data.categories.map((category) => ({
      ...category,
      name: CATEGORY_NAME_ZH[category.id] ?? category.name,
      description: CATEGORY_DESC_ZH[category.id] ?? category.description,
    })),
    skills: data.skills.map((skill) => ({
      ...skill,
      name: SKILL_NAME_ZH[skill.id] ?? skill.name,
      description: SKILL_DESC_ZH[skill.id] ?? skill.description,
    })),
    members: data.members.map((member) => ({
      ...member,
      name: resolveName(member),
      role: ROLE_ZH[member.role] ?? member.role,
    })),
  };
}

export function useSkillsData() {
  const { resolvedLanguage } = useLocale();
  const { t } = useTranslation();
  const [rawData, setRawData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error(t('common.failedToLoad'));
        return res.json();
      })
      .then((json: SkillsData) => {
        setRawData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [t]);

  const data = useMemo(
    () => (rawData ? localizeSkillsData(rawData, resolvedLanguage) : null),
    [rawData, resolvedLanguage],
  );

  return { data, loading, error, setData: setRawData };
}

export function getSkillById(
  skills: Subcategory[],
  id: string,
): Subcategory | undefined {
  return skills.find((s) => s.id === id);
}

export function getCategoryById(
  categories: SkillCategory[],
  id: string,
): SkillCategory | undefined {
  return categories.find((c) => c.id === id);
}

export function getSkillCategories(
  skill: Subcategory,
  categories: SkillCategory[],
): SkillCategory[] {
  return skill.belongsTo
    .map((catId) => getCategoryById(categories, catId))
    .filter((c): c is SkillCategory => c !== undefined);
}

export function getMembersWithSkill(
  members: LabMember[],
  skillId: string,
): LabMember[] {
  return members.filter((m) => m.skills.some((s) => s.skillId === skillId));
}

export function getMemberCategoryWeights(
  member: LabMember,
  data: SkillsData,
): Record<string, number> {
  const weights: Record<string, number> = {};

  for (const memberSkill of member.skills) {
    const skill = getSkillById(data.skills, memberSkill.skillId);
    if (!skill) continue;

    // Proficiency weight: expert=4, advanced=3, intermediate=2, beginner=1
    const profWeight = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }[
      memberSkill.proficiency
    ];

    for (const catId of skill.belongsTo) {
      weights[catId] = (weights[catId] || 0) + profWeight;
    }
  }

  return weights;
}

// Get a blended color for a member based on their category weights
export function getMemberBlendedColor(
  weights: Record<string, number>,
  categories: SkillCategory[],
): string {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return '#6366f1';

  let r = 0,
    g = 0,
    b = 0;

  for (const [catId, weight] of Object.entries(weights)) {
    const category = getCategoryById(categories, catId);
    if (!category) continue;

    const ratio = weight / totalWeight;
    const hex = category.color.replace('#', '');
    r += parseInt(hex.substr(0, 2), 16) * ratio;
    g += parseInt(hex.substr(2, 2), 16) * ratio;
    b += parseInt(hex.substr(4, 2), 16) * ratio;
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export function calculateSkillGaps(data: SkillsData): SkillGap[] {
  const gaps: SkillGap[] = [];

  for (const skill of data.skills) {
    const membersWithSkill = getMembersWithSkill(data.members, skill.id);
    const expertCount = membersWithSkill.filter((m) =>
      m.skills.some(
        (s) => s.skillId === skill.id && s.proficiency === 'expert',
      ),
    ).length;

    const categories = getSkillCategories(skill, data.categories);

    let recommendationKey: 'noCoverage' | 'noExpert' | 'singlePoint' | null =
      null;
    if (membersWithSkill.length === 0) {
      recommendationKey = 'noCoverage';
    } else if (expertCount === 0) {
      recommendationKey = 'noExpert';
    } else if (membersWithSkill.length < 2) {
      recommendationKey = 'singlePoint';
    }

    gaps.push({
      skill,
      categories,
      currentCoverage: membersWithSkill.length,
      expertCount,
      recommendationKey,
    });
  }

  return gaps.sort((a, b) => a.currentCoverage - b.currentCoverage);
}
