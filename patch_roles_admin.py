with open('src/components/PRGenerator/RolesAdmin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import rolesUrl
content = content.replace(
    "import { GitHubTokenModal } from './GitHubTokenModal';",
    "import { GitHubTokenModal } from './GitHubTokenModal';\nimport rolesUrl from '../../data/roles.json?url';"
)

# Update fetch
content = content.replace(
    "`${import.meta.env.BASE_URL}data/roles.json`,",
    "rolesUrl,"
)

# Update save path
content = content.replace(
    "'public/data/roles.json',",
    "'src/data/roles.json',"
)

with open('src/components/PRGenerator/RolesAdmin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched RolesAdmin.tsx")
