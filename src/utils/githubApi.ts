export interface GitHubCommitOptions {
  owner: string;
  repo: string;
  path: string;
  content: string; // JSON 字串
  message: string;
  token: string;
}

/**
 * 支援 Unicode 的 Base64 編碼
 * 解決 btoa() 無法處理中文字元的問題
 */
export function encodeBase64Unicode(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binaryString = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binaryString += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binaryString);
}

/**
 * 取得 GitHub 檔案的最新 SHA 值
 */
export const getFileSha = async (
  owner: string,
  repo: string,
  path: string,
  token: string,
): Promise<string | null> => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) return null; // 檔案不存在
    throw new Error(
      `[${response.status}] Failed to fetch file info: ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.sha;
};

/**
 * 更新 GitHub 上的檔案內容 (PUT)
 */
export const updateFile = async ({
  owner,
  repo,
  path,
  content,
  message,
  token,
}: GitHubCommitOptions) => {
  const sha = await getFileSha(owner, repo, path, token);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const encodedContent = encodeBase64Unicode(content);

  const body: Record<string, any> = {
    message,
    content: encodedContent,
  };

  // 如果檔案已存在，必須附上原本的 sha 才能覆寫
  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      `[${response.status}] Failed to update file: ${response.statusText}`,
    );
  }

  return response.json();
};
