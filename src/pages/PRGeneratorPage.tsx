import React, { useState, useEffect } from 'react';
import { Form, message, Spin, Empty, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSkillsData, getSkillById } from '../hooks/useSkillsData';
import type { LabMember, MemberSkill } from '../types/types';
import { PROFICIENCY_LABEL_KEYS } from '../types/types';
import {
  MemberList,
  MemberForm,
  PRPreviewModal,
  SkillCategoryAdmin,
  HomeConfigAdmin,
  ServicesAdmin,
  RolesAdmin,
  PiConfigAdmin,
} from '../components/PRGenerator';

// Unicode-safe base64 encoding for GitHub API
// GitHub's API expects base64-encoded content
const encodeBase64 = (str: string): string => {
  // Convert to UTF-8 byte array
  const encoder = new TextEncoder();
  const utf8Array = encoder.encode(str);

  // Convert byte array to binary string, handling each byte properly
  let binary = '';
  const len = utf8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(utf8Array[i]);
  }

  // Encode to base64
  return btoa(binary);
};

// Unicode-safe base64 decoding
const decodeBase64 = (base64: string): string => {
  // Decode from base64 to binary string
  const binary = atob(base64);

  // Convert binary string to UTF-8 byte array
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  // Decode UTF-8 bytes to string
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
};

interface MemberFormData {
  name: string;
  localizedNamesList?: { lang: string; value: string }[];
  role: string;
  email: string;
  phoneData?: { country: string; number: string };
  landlineData?: { area: string; main: string; ext: string };
  github?: string;
}

const resolveLocalizedName = (
  member: { name: string; localizedNames?: Record<string, string> },
  language: 'en' | 'zh-TW',
) => {
  if (language === 'en' && member.localizedNames?.en) {
    return member.localizedNames.en;
  }
  // Default: always show Chinese name
  return member.name;
};

/** Convert form phoneData to stored format */
const buildPhoneString = (phoneData?: {
  country: string;
  number: string;
}): string | undefined => {
  if (!phoneData?.number) return undefined;
  const country = phoneData.country || '+886';
  return `${country}-9-${phoneData.number}`;
};

/** Convert form landlineData to stored format */
const buildLandlineString = (landlineData?: {
  area: string;
  main: string;
  ext: string;
}): string | undefined => {
  if (!landlineData?.main) return undefined;
  const area = landlineData.area || '04';
  const ext = landlineData.ext ? `#${landlineData.ext}` : '';
  return `${area}-${landlineData.main}${ext}`;
};

/** Convert localizedNamesList array to Record */
const buildLocalizedNames = (
  list?: { lang: string; value: string }[],
): Record<string, string> | undefined => {
  if (!list || list.length === 0) return undefined;
  const result: Record<string, string> = {};
  for (const item of list) {
    if (item.lang && item.value) {
      result[item.lang] = item.value;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
};

export const PRGeneratorPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const resolvedLanguage: 'en' | 'zh-TW' = i18n.resolvedLanguage?.startsWith(
    'zh',
  )
    ? 'zh-TW'
    : 'en';
  const { data, loading, error } = useSkillsData();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [skills, setSkills] = useState<MemberSkill[]>([]);
  const [prContent, setPrContent] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<'new' | 'edit'>('new');
  const [selectedMember, setSelectedMember] = useState<LabMember | null>(null);

  const [githubToken, setGithubToken] = useState('');
  const [creatingPR, setCreatingPR] = useState(false);
  const [prType, setPrType] = useState<
    'member' | 'delete-member' | 'batch' | null
  >(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [batchChanges, setBatchChanges] = useState<any[]>([]);
  const [targetRepo, setTargetRepo] = useState({
    owner: '',
    repo: '',
  });

  const changeTypeLabelMap: Record<string, string> = {
    'add-skill': t('pr.changeTypeAddSkill'),
    'update-skill': t('pr.changeTypeUpdateSkill'),
    'delete-skill': t('pr.changeTypeDeleteSkill'),
    'add-category': t('pr.changeTypeAddCategory'),
    'update-category': t('pr.changeTypeUpdateCategory'),
    'delete-category': t('pr.changeTypeDeleteCategory'),
  };

  // Auto-detect repository from GitHub Pages URL
  useEffect(() => {
    const detectRepo = () => {
      const url = window.location.href;
      // GitHub Pages patterns:
      // https://username.github.io/repo-name/
      // https://username.github.io/ (user/org page)
      const match = url.match(/https:\/\/([^.]+)\.github\.io\/([^/]+)/);

      if (match) {
        const [, owner, repo] = match;
        setTargetRepo({ owner, repo });
      } else {
        // Fallback for local development or custom domains
        setTargetRepo({ owner: 'tico-Lin', repo: 'JA431_LAB' });
      }
    };

    detectRepo();
  }, []);

  const createPR = async () => {
    const sanitizedToken = githubToken.trim();
    if (!sanitizedToken) {
      void messageApi.error(t('pr.enterValidToken'));
      return;
    }

    setCreatingPR(true);
    try {
      const { Octokit } = await import('octokit');
      const octokit = new Octokit({ auth: sanitizedToken });

      const REPO_OWNER = targetRepo.owner;
      const REPO_NAME = targetRepo.repo;
      const FILE_PATH = 'public/data/skillsData.json';
      const BRANCH_NAME = `content-update-${Date.now()}`;

      // All operations happen on the detected repository
      const branchOwner = REPO_OWNER;
      const branchRepo = REPO_NAME;

      // Check if fork exists/user has access
      try {
        await octokit.request('GET /repos/{owner}/{repo}', {
          owner: branchOwner,
          repo: branchRepo,
        });
      } catch {
        throw new Error(
          t('pr.repoNotFound', { owner: branchOwner, repo: branchRepo }),
        );
      }

      // 1. Get current Main SHA from the user's own repository
      await octokit.request('GET /repos/{owner}/{repo}/git/ref/heads/main', {
        owner: branchOwner,
        repo: branchRepo,
      });

      // 2. Create new branch on user's repository
      // We will base the new branch on the main branch of the user's repo.
      try {
        // Get Main SHA from user's repository to ensure existence
        const { data: originRef } = await octokit.request(
          'GET /repos/{owner}/{repo}/git/ref/heads/main',
          {
            owner: branchOwner,
            repo: branchRepo,
          },
        );
        const originSha = originRef.object.sha;

        await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
          owner: branchOwner,
          repo: branchRepo,
          ref: `refs/heads/${BRANCH_NAME}`,
          sha: originSha,
        });
      } catch (e: any) {
        console.error('Failed to create branch on repository', e);
        throw new Error(
          t('pr.branchCreateFailedRepo', {
            owner: branchOwner,
            repo: branchRepo,
          }),
        );
      }

      // 3. Get current file content from user's repository (to edit latest version)
      const { data: fileData } = await octokit.request(
        'GET /repos/{owner}/{repo}/contents/{path}',
        {
          owner: branchOwner,
          repo: branchRepo,
          path: FILE_PATH,
        },
      );

      if (!Array.isArray(fileData) && fileData.type === 'file') {
        const decodedContent = decodeBase64(
          fileData.content.replace(/\n/g, ''),
        );
        const currentContent = JSON.parse(decodedContent);

        // Update content locally
        const updatedContent = { ...currentContent };

        if (prType === 'member') {
          if (editMode === 'new' && !selectedMember) {
            // Adding a new member
            const memberId = `member-${Date.now()}`;
            const newMember = {
              id: memberId,
              name: form.getFieldValue('name'),
              localizedNames: buildLocalizedNames(
                form.getFieldValue('localizedNamesList'),
              ),
              role: form.getFieldValue('role'),
              email: form.getFieldValue('email'),
              phone: buildPhoneString(form.getFieldValue('phoneData')),
              landline: buildLandlineString(form.getFieldValue('landlineData')),
              github: form.getFieldValue('github'),
              skills: skills,
            };
            updatedContent.members.push(newMember);
          } else if (editMode === 'edit' && selectedMember) {
            // Updating member
            const updatedMember = {
              ...selectedMember,
              name: form.getFieldValue('name'),
              localizedNames: buildLocalizedNames(
                form.getFieldValue('localizedNamesList'),
              ),
              role: form.getFieldValue('role'),
              email: form.getFieldValue('email'),
              phone: buildPhoneString(form.getFieldValue('phoneData')),
              landline: buildLandlineString(form.getFieldValue('landlineData')),
              github: form.getFieldValue('github'),
              skills: skills,
            };
            updatedContent.members = updatedContent.members.map((m: any) =>
              m.id === selectedMember.id ? updatedMember : m,
            );
          }
        } else if (prType === 'delete-member' && selectedMember) {
          updatedContent.members = updatedContent.members.filter(
            (m: any) => m.id !== selectedMember.id,
          );
        } else if (prType === 'batch' && batchChanges.length > 0) {
          // Apply all batch changes
          for (const change of batchChanges) {
            if (change.type === 'add-skill') {
              updatedContent.skills.push(change.data);
            } else if (change.type === 'update-skill') {
              updatedContent.skills = updatedContent.skills.map((s: any) =>
                s.id === change.data.id ? change.data : s,
              );
            } else if (change.type === 'delete-skill') {
              updatedContent.skills = updatedContent.skills.filter(
                (s: any) => s.id !== change.data.id,
              );
            } else if (change.type === 'add-category') {
              updatedContent.categories.push(change.data);
            } else if (change.type === 'update-category') {
              updatedContent.categories = updatedContent.categories.map(
                (c: any) => (c.id === change.data.id ? change.data : c),
              );
            } else if (change.type === 'delete-category') {
              updatedContent.categories = updatedContent.categories.filter(
                (c: any) => c.id !== change.data.id,
              );
            }
          }
        }

        // 4. Commit file update to user's repository
        // Get file SHA from the branch we just created on user's repository

        const { data: branchFileData } = await octokit.request(
          'GET /repos/{owner}/{repo}/contents/{path}',
          {
            owner: branchOwner,
            repo: branchRepo,
            path: FILE_PATH,
            ref: BRANCH_NAME,
          },
        );

        if (Array.isArray(branchFileData) || branchFileData.type !== 'file') {
          throw new Error(t('pr.unexpectedFileType'));
        }

        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: branchOwner,
          repo: branchRepo,
          path: FILE_PATH,
          message: `chore: ${(() => {
            if (prType === 'delete-member' && selectedMember) {
              return `remove member ${selectedMember.name}`;
            }
            if (prType === 'batch')
              return `batch update: ${batchChanges.length} changes`;
            return `update data for ${form.getFieldValue('name')}`;
          })()}`,
          content: encodeBase64(JSON.stringify(updatedContent, null, 2)),
          branch: BRANCH_NAME,
          sha: branchFileData.sha,
        });

        // 5. Create PR on user's repository (from branch to main)
        const headRef = BRANCH_NAME;

        let prTitle = '';
        if (prType === 'batch') {
          prTitle = t('pr.batchTitle', { count: batchChanges.length });
        } else if (prType === 'delete-member' && selectedMember) {
          prTitle = t('pr.removeMemberTitle', { name: selectedMember.name });
        } else {
          prTitle = t('pr.formEditMember', {
            name: form.getFieldValue('name') || '',
          });
        }

        const { data: prData } = await octokit.request(
          'POST /repos/{owner}/{repo}/pulls',
          {
            owner: branchOwner,
            repo: branchRepo,
            title: prTitle,
            body: prContent,
            head: headRef,
            base: 'main',
          },
        );

        void messageApi.success(t('pr.createPrSuccess'));
        window.open(prData.html_url, '_blank');
        setModalOpen(false);
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.message.includes('refs')
        ? t('pr.branchCreateFailureHint')
        : error.message;
      void messageApi.error(t('pr.createPrFailed', { message: msg }));
    } finally {
      setCreatingPR(false);
    }
  };

  // Calculate role options mixing common roles and existing roles
  const roleOptions = React.useMemo(() => {
    if (!data) return [];

    const roleKeys = t('pr.roleKeys', { returnObjects: true }) as string[];
    const localizedCommonRoles = roleKeys.map((roleKey) =>
      t(`pr.roles.${roleKey}`),
    );

    const existingRoles = new Set(data.members.map((m) => m.role));
    const allRoles = new Set([...localizedCommonRoles, ...existingRoles]);

    return Array.from(allRoles)
      .sort()
      .map((role) => ({
        value: role,
        label: role,
      }));
  }, [data, t]);

  // --- Change Detection Logic ---
  const checkForChanges = (
    currentFormValues: MemberFormData,
    currentSkills: MemberSkill[],
  ) => {
    if (editMode === 'new') {
      // For new profile, enable if name and role are present
      return !!currentFormValues.name && !!currentFormValues.role;
    }

    if (!selectedMember) return false;

    const nameChanged = currentFormValues.name !== selectedMember.name;
    const localizedNamesChanged =
      JSON.stringify(
        buildLocalizedNames(currentFormValues.localizedNamesList) || {},
      ) !== JSON.stringify(selectedMember.localizedNames || {});
    const roleChanged = currentFormValues.role !== selectedMember.role;
    const emailChanged =
      (currentFormValues.email || '') !== (selectedMember.email || '');
    const githubChanged =
      (currentFormValues.github || '') !== (selectedMember.github || '');
    const phoneChanged =
      buildPhoneString(currentFormValues.phoneData) !==
      (selectedMember.phone || undefined);
    const landlineChanged =
      buildLandlineString(currentFormValues.landlineData) !==
      (selectedMember.landline || undefined);

    // Compare skills
    if (currentSkills.length !== selectedMember.skills.length) return true;

    const sortedCurrent = [...currentSkills].sort((a, b) =>
      a.skillId.localeCompare(b.skillId),
    );
    const sortedOriginal = [...selectedMember.skills].sort((a, b) =>
      a.skillId.localeCompare(b.skillId),
    );
    const skillsChanged =
      JSON.stringify(sortedCurrent) !== JSON.stringify(sortedOriginal);

    return (
      nameChanged ||
      localizedNamesChanged ||
      roleChanged ||
      emailChanged ||
      githubChanged ||
      phoneChanged ||
      landlineChanged ||
      skillsChanged
    );
  };

  // Trigger check when skills change
  React.useEffect(() => {
    const values = form.getFieldsValue();
    setHasChanges(checkForChanges(values, skills));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills, editMode, selectedMember]);

  const onFormValuesChange = (_: any, allValues: MemberFormData) => {
    setHasChanges(checkForChanges(allValues, skills));
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Spin size='large' tip={t('pr.loading')} fullscreen={true} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Empty description={error || t('common.noDataAvailable')} />
      </div>
    );
  }

  const generatePRContent = (formData: MemberFormData) => {
    const memberId =
      editMode === 'edit' && selectedMember
        ? selectedMember.id
        : `member-${Date.now()}`;

    const localizedNames = buildLocalizedNames(formData.localizedNamesList);
    const phone = buildPhoneString(formData.phoneData);
    const landline = buildLandlineString(formData.landlineData);

    const newMember: any = {
      id: memberId,
      name: formData.name,
      ...(localizedNames && { localizedNames }),
      role: formData.role,
      email: formData.email,
      ...(phone && { phone }),
      ...(landline && { landline }),
      ...(formData.github && { github: formData.github }),
      skills: skills,
    };

    const action = editMode === 'new' ? t('pr.addNew') : t('pr.update');
    const displayName = resolveLocalizedName(
      { name: formData.name, localizedNames },
      resolvedLanguage,
    );
    const description =
      editMode === 'new'
        ? t('pr.templateAddsProfile', {
            name: displayName,
            role: formData.role,
          })
        : t('pr.templateUpdatesProfile', {
            name: displayName,
            role: formData.role,
          });
    const memberEntryHint =
      editMode === 'new'
        ? t('pr.templateAddMemberEntry')
        : t('pr.templateReplaceMemberEntry');

    const localizedNamesDisplay = localizedNames
      ? Object.entries(localizedNames)
          .map(([lang, val]) => `- ${lang}: ${val}`)
          .join('\n')
      : t('common.emptyValue');

    const content = `## ${action} ${t('pr.templateMemberTitle')}: ${displayName}

### ${t('pr.templateDescriptionHeading')}
${description}

### ${t('pr.templateChangesHeading')}

${memberEntryHint}

\`\`\`json
${JSON.stringify(newMember, null, 2)}
\`\`\`

### ${t('pr.localizedNamesHeading')}
- ${t('pr.nameLabel')}：${formData.name}
${localizedNamesDisplay}

### ${t('pr.templateSkillsSummaryHeading')}
${skills
  .map((s) => {
    const skill = getSkillById(data.skills, s.skillId);
    const categories = skill?.belongsTo
      .map((id) => data.categories.find((c) => c.id === id)?.name)
      .join(', ');
    return `- **${skill?.name}** (${t(PROFICIENCY_LABEL_KEYS[s.proficiency])}) - ${t('pr.templateSpans')}: ${categories}`;
  })
  .join('\n')}

### ${t('pr.templateCategoryDistributionHeading')}
${(() => {
  const weights: Record<string, number> = {};
  for (const s of skills) {
    const skill = data.skills.find((sk) => sk.id === s.skillId);
    if (!skill) continue;
    for (const catId of skill.belongsTo) {
      weights[catId] = (weights[catId] || 0) + 1;
    }
  }
  return Object.entries(weights)
    .map(([catId, count]) => {
      const cat = data.categories.find((c) => c.id === catId);
      return `- ${t('pr.templateCategorySkills', {
        category: cat?.name ?? catId,
        count,
      })}`;
    })
    .join('\n');
})()}

### ${t('pr.templateChecklistHeading')}
- [ ] ${t('pr.templateChecklistMemberInfo')}
- [ ] ${t('pr.templateChecklistSkillsAssigned')}
- [ ] ${t('pr.templateChecklistProficiency')}
`;

    setPrContent(content);
    setPrType('member');
    setModalOpen(true);
  };

  const generateRemoveMemberPR = () => {
    if (!selectedMember) return;

    const content = `## ${t('pr.templateRemoveMemberTitle', { name: selectedMember.name })}

### ${t('pr.templateDescriptionHeading')}
${t('pr.templateRemoveDescription', {
  name: selectedMember.name,
  role: selectedMember.role,
})}

### ${t('pr.templateChangesHeading')}

${t('pr.templateRemoveEntry', { id: selectedMember.id })}

### ${t('pr.templateChecklistHeading')}
- [ ] ${t('pr.templateChecklistDeparture')}
`;

    setPrContent(content);
    setPrType('delete-member');
    setModalOpen(true);
  };

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(prContent);
    void messageApi.success(t('pr.copySuccess'));
  };

  const handleEditMember = (member: LabMember) => {
    setEditMode('edit');
    setSelectedMember(member);
    setSkills(member.skills);

    // Parse phone string back to form data
    const phoneData = { country: '+886', number: '' };
    if (member.phone) {
      const phoneMatch = member.phone.match(/^(\+\d+)-9-(\d{8})$/);
      if (phoneMatch) {
        phoneData.country = phoneMatch[1];
        phoneData.number = phoneMatch[2];
      }
    }

    // Parse landline string back to form data
    const landlineData = { area: '04', main: '26328001', ext: '15231' };
    if (member.landline) {
      const landlineMatch = member.landline.match(/^(\d{2})-(\d+)(?:#(\S*))?$/);
      if (landlineMatch) {
        landlineData.area = landlineMatch[1];
        landlineData.main = landlineMatch[2];
        landlineData.ext = landlineMatch[3] || '';
      } else {
        const legacyMatch = member.landline.match(
          /^\+886-(\d{2})-(\d{4})-(\d{4})(?: ext\.\s*(\S+))?$/i,
        );
        if (legacyMatch) {
          landlineData.area = legacyMatch[1];
          landlineData.main = `${legacyMatch[2]}${legacyMatch[3]}`;
          landlineData.ext = legacyMatch[4] || '';
        }
      }
    }

    // Convert localizedNames record to list
    const localizedNamesList = member.localizedNames
      ? Object.entries(member.localizedNames).map(([lang, value]) => ({
          lang,
          value,
        }))
      : [];

    form.setFieldsValue({
      name: member.name,
      localizedNamesList,
      role: member.role,
      email: member.email,
      phoneData,
      landlineData,
      github: member.github,
    });
    setHasChanges(false);
  };

  const handleNewMember = () => {
    setEditMode('new');
    setSelectedMember(null);
    setSkills([]);
    form.resetFields();
    setHasChanges(false);
  };

  const handleBatchPR = (changes: any[]) => {
    setBatchChanges(changes);
    setPrType('batch');

    const content = `## ${t('pr.templateBatchTitle')}

  ### ${t('pr.templateDescriptionHeading')}
  ${t('pr.templateBatchDescription', { count: changes.length })}

  ### ${t('pr.templateBatchSummaryHeading')}
  ${changes.map((c) => `- **${changeTypeLabelMap[c.type] ?? c.type}**: ${c.description}`).join('\n')}

  ### ${t('pr.templateBatchDetailsHeading')}
\`\`\`json
${JSON.stringify(
  changes.map((c) => ({ type: c.type, data: c.data })),
  null,
  2,
)}
\`\`\`

### ${t('pr.templateChecklistHeading')}
- [ ] ${t('pr.templateChecklistAppropriate')}
- [ ] ${t('pr.templateChecklistNoBreak')}
`;

    setPrContent(content);
    setModalOpen(true);
  };

  const tabItems = [
    {
      key: 'home',
      label: t('admin.tabHomeConfig'),
      children: <HomeConfigAdmin />,
    },
    {
      key: 'pi',
      label: t('admin.tabPiConfig'),
      children: <PiConfigAdmin />,
    },
    {
      key: 'services',
      label: t('admin.tabServices'),
      children: <ServicesAdmin />,
    },
    {
      key: 'members',
      label: t('admin.tabMembers'),
      children: (
        <div className='space-y-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <MemberList
              members={data.members}
              selectedMemberId={selectedMember?.id ?? null}
              onSelectMember={handleEditMember}
              onNewMember={handleNewMember}
            />

            <MemberForm
              form={form}
              editMode={editMode}
              selectedMember={selectedMember}
              skills={skills}
              allSkills={data.skills}
              categories={data.categories}
              roleOptions={roleOptions}
              hasChanges={hasChanges}
              onSkillsChange={setSkills}
              onFormValuesChange={onFormValuesChange}
              onGeneratePR={generatePRContent}
              onRemoveMember={generateRemoveMemberPR}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'skills',
      label: t('admin.tabSkills'),
      children: (
        <SkillCategoryAdmin
          categories={data.categories}
          skills={data.skills}
          members={data.members}
          onGenerateBatchPR={handleBatchPR}
        />
      ),
    },
    {
      key: 'roles',
      label: t('admin.tabRoles'),
      children: <RolesAdmin />,
    },
  ];

  return (
    <div className='space-y-8'>
      {contextHolder}
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4'>
          {t('admin.title')}
        </h1>
        <p
          className='max-w-2xl mx-auto'
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t('admin.subtitle')}
        </p>
      </div>

      <Tabs defaultActiveKey='home' items={tabItems} />

      <PRPreviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        prContent={prContent}
        githubToken={githubToken}
        onGithubTokenChange={setGithubToken}
        onCreatePR={createPR}
        onCopyToClipboard={copyToClipboard}
        creatingPR={creatingPR}
        targetRepo={targetRepo}
        onTargetRepoChange={setTargetRepo}
      />
    </div>
  );
};

export default PRGeneratorPage;
