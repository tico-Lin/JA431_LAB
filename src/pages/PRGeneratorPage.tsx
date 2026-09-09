import React, { useState, useEffect } from 'react';
import { Form, message, Spin, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSkillsData, getSkillById } from '../hooks/useSkillsData';
import type { LabMember, MemberSkill } from '../types/types';
import { PROFICIENCY_LABEL_KEYS } from '../types/types';
import { useLocale } from '../hooks/useLocale';
import {
  MemberList,
  MemberForm,
  PRPreviewModal,
  SkillCategoryAdmin,
} from '../components/PRGenerator';

const COMMON_ROLES = [
  'Professor',
  'Postdoc',
  'PhD Student',
  'Master Student',
  'Undergraduate Student',
  'Research Assistant',
  'Visiting Scholar',
  'Alumni',
];

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
  role: string;
  email?: string;
  github?: string;
}

export const PRGeneratorPage: React.FC = () => {
  const { t } = useTranslation();
  const { resolvedLanguage } = useLocale();
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
        setTargetRepo({ owner: 'whats2000', repo: 'RoboSkills' });
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
              role: form.getFieldValue('role'),
              email: form.getFieldValue('email'),
              github: form.getFieldValue('github'),
              skills: skills,
            };
            updatedContent.members.push(newMember);
          } else if (editMode === 'edit' && selectedMember) {
            // Updating member
            const updatedMember = {
              ...selectedMember,
              name: form.getFieldValue('name'),
              role: form.getFieldValue('role'),
              email: form.getFieldValue('email'),
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
          prTitle = `Batch Update: ${batchChanges.length} changes`;
        } else if (prType === 'delete-member' && selectedMember) {
          prTitle = `Remove Member: ${selectedMember.name}`;
        } else {
          prTitle = `Update: ${form.getFieldValue('name')}`;
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

    const localizedCommonRoles = COMMON_ROLES.map((role) =>
      resolvedLanguage === 'zh-TW' ? (ROLE_ZH[role] ?? role) : role,
    );

    const existingRoles = new Set(data.members.map((m) => m.role));
    const allRoles = new Set([...localizedCommonRoles, ...existingRoles]);

    return Array.from(allRoles)
      .sort()
      .map((role) => ({
        value: role,
        label: role,
      }));
  }, [data, resolvedLanguage]);

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
    const roleChanged = currentFormValues.role !== selectedMember.role;
    const emailChanged =
      (currentFormValues.email || '') !== (selectedMember.email || '');
    const githubChanged =
      (currentFormValues.github || '') !== (selectedMember.github || '');

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
      roleChanged ||
      emailChanged ||
      githubChanged ||
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

    const newMember = {
      id: memberId,
      name: formData.name,
      role: formData.role,
      email: formData.email,
      github: formData.github,
      skills: skills,
    };

    const action = editMode === 'new' ? t('pr.addNew') : t('pr.update');
    const description =
      editMode === 'new'
        ? t('pr.templateAddsProfile', {
            name: formData.name,
            role: formData.role,
          })
        : t('pr.templateUpdatesProfile', {
            name: formData.name,
            role: formData.role,
          });
    const memberEntryHint =
      editMode === 'new'
        ? t('pr.templateAddMemberEntry')
        : t('pr.templateReplaceMemberEntry');

    const content = `## ${action} ${t('pr.templateMemberTitle')}: ${formData.name}

### ${t('pr.templateDescriptionHeading')}
${description}

### ${t('pr.templateChangesHeading')}

${memberEntryHint}

\`\`\`json
${JSON.stringify(newMember, null, 2)}
\`\`\`

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
    form.setFieldsValue({
      name: member.name,
      role: member.role,
      email: member.email,
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
${changes.map((c) => `- **${c.type.replace('-', ' ').toUpperCase()}**: ${c.description}`).join('\n')}

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

  return (
    <div className='space-y-8'>
      {contextHolder}
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4'>
          {t('pr.title')}
        </h1>
        <p
          className='max-w-2xl mx-auto'
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t('pr.subtitle')}
        </p>
      </div>

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

      <SkillCategoryAdmin
        categories={data.categories}
        skills={data.skills}
        members={data.members}
        onGenerateBatchPR={handleBatchPR}
      />

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
