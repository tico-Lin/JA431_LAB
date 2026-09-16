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

function localizeSkillsData(
  data: SkillsData,
  language: 'en' | 'zh-TW',
  t: any,
) {
  const resolveMemberName = (member: LabMember) => {
    if (language === 'zh-TW') return member.name;
    return member.localizedNames?.en || member.name;
  };

  const resolveItemName = (item: any, type: 'categories' | 'skills') => {
    if (language === 'en') {
      return item.localizedNames?.en || item.name;
    }
    return t(`skillsData.${type}.${item.id}.name`, item.name);
  };

  const resolveItemDesc = (item: any, type: 'categories' | 'skills') => {
    if (language === 'en') {
      return item.localizedDescriptions?.en || item.description;
    }
    return t(`skillsData.${type}.${item.id}.description`, item.description);
  };

  return {
    ...data,
    categories: data.categories.map((category) => ({
      ...category,
      name: resolveItemName(category, 'categories'),
      description: resolveItemDesc(category, 'categories'),
    })),
    skills: data.skills.map((skill) => ({
      ...skill,
      name: resolveItemName(skill, 'skills'),
      description: resolveItemDesc(skill, 'skills'),
    })),
    members: data.members.map((member) => ({
      ...member,
      name: resolveMemberName(member),
      role: t(`skillsData.roles.${member.role}`, member.role),
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
    () => (rawData ? localizeSkillsData(rawData, resolvedLanguage, t) : null),
    [rawData, resolvedLanguage, t],
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
