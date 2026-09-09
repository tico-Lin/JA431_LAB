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
  environment: '環境與代理',
  robots: '機器人',
  caregiver: '照護者',
  'care-recipient': '被照護者',
};

const CATEGORY_DESC_ZH: Record<string, string> = {
  environment: '任務規劃、模擬與環境互動',
  robots: '機器人硬體、控制與感知系統',
  caregiver: '照護情境中的人機互動',
  'care-recipient': '理解並支援被照護者需求',
};

const SKILL_NAME_ZH: Record<string, string> = {
  'task-planning': '任務規劃',
  simulation: '模擬',
  'env-modeling': '環境建模',
  'multi-agent': '多代理系統',
  'robot-control': '機器人控制',
  'robot-slam': '機器人 SLAM',
  perception: '感知',
  hardware: '硬體整合',
  manipulation: '操作能力',
  hri: '人機互動',
  'care-protocols': '照護流程',
  monitoring: '健康監測',
  communication: '溝通能力',
  'user-modeling': '使用者建模',
  'needs-assessment': '需求評估',
  personalization: '個人化',
  safety: '安全系統',
  'test-skill': '測試技能',
};

const SKILL_DESC_ZH: Record<string, string> = {
  'task-planning': '高階任務分解與規劃',
  simulation: '機器人與環境模擬',
  'env-modeling': '空間與語意環境理解',
  'multi-agent': '多代理間協調與通訊',
  'robot-control': '運動控制與軌跡規劃',
  'robot-slam': '同步定位與地圖建構',
  perception: '電腦視覺與感測融合',
  hardware: '機械與電子系統整合',
  manipulation: '抓取與物件操作',
  hri: '與人類自然互動',
  'care-protocols': '標準照護流程與作業',
  monitoring: '生命徵象與活動監測',
  communication: '語音與手勢辨識',
  'user-modeling': '理解使用者偏好與需求',
  'needs-assessment': '評估照護需求',
  personalization: '依個體調整機器人行為',
  safety: '確保使用者安全與舒適',
  'test-skill': '用於測試 PR 流程的技能',
};

const ROLE_ZH: Record<string, string> = {
  Professor: '教授',
  Postdoc: '博士後研究員',
  'PhD Student': '博士生',
  'Master Student': '碩士生',
  'Undergraduate Student': '大學生',
  'Research Assistant': '研究助理',
  'Visiting Scholar': '訪問學者',
  Alumni: '校友',
};

function localizeSkillsData(data: SkillsData, language: 'en' | 'zh-TW') {
  if (language !== 'zh-TW') {
    return data;
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
