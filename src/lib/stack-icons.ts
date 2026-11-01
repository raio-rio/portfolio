// Devicon (v2.16.0) brand glyphs for the homepage stack section, rendered in
// their original colors via the `colored` class. Phosphor stand-ins below
// have no brand color and inherit ink. Tools with neither render as text.
const devicons: Record<string, string> = {
  JavaScript: 'devicon-javascript-plain',
  TypeScript: 'devicon-typescript-plain',
  React: 'devicon-react-original',
  'Next.js': 'devicon-nextjs-plain',
  'Framer Motion': 'devicon-framermotion-original',
  'Tailwind CSS': 'devicon-tailwindcss-original',
  'Vue.js': 'devicon-vuejs-plain',
  Vite: 'devicon-vite-original',
  ESLint: 'devicon-eslint-plain',
  Webpack: 'devicon-webpack-plain',
  SCSS: 'devicon-sass-original',
  'Node.js': 'devicon-nodejs-plain',
  Python: 'devicon-python-plain',
  PostgreSQL: 'devicon-postgresql-plain',
  MySQL: 'devicon-mysql-original',
  MongoDB: 'devicon-mongodb-plain',
  'Express.js': 'devicon-express-original',
  GraphQL: 'devicon-graphql-plain',
  Java: 'devicon-java-plain',
  PHP: 'devicon-php-plain',
  NestJS: 'devicon-nestjs-original',
  FastAPI: 'devicon-fastapi-plain',
  DynamoDB: 'devicon-dynamodb-plain',
  OAuth: 'devicon-oauth-plain',
  Docker: 'devicon-docker-plain',
  'GitHub Actions': 'devicon-githubactions-plain',
  Kubernetes: 'devicon-kubernetes-plain',
  Azure: 'devicon-azure-plain',
  GCP: 'devicon-googlecloud-plain',
  Jupyter: 'devicon-jupyter-plain',
  PyTorch: 'devicon-pytorch-original',
  TensorFlow: 'devicon-tensorflow-original',
  WordPress: 'devicon-wordpress-plain',
  Webflow: 'devicon-webflow-original',
};

export function stackIcon(tool: string): string | null {
  const dev = devicons[tool];
  if (dev) return `${dev} colored`;
  return phosphor[tool] ?? null;
}

// Phosphor (bold) stand-ins for tools with no Devicon brand glyph. All class
// names verified against @phosphor-icons/core 2.1.1.
const phosphor: Record<string, string> = {
  GSAP: 'ph-bold ph-film-reel',
  Prettier: 'ph-bold ph-paint-brush',
  'Styled Components': 'ph-bold ph-brackets-curly',
  REST: 'ph-bold ph-webhooks-logo',
  JWT: 'ph-bold ph-key',
  OAuth: 'ph-bold ph-lock-key',
  AWS: 'ph-bold ph-cloud',
  GCP: 'ph-bold ph-google-logo',
  Datadog: 'ph-bold ph-dog',
  OpenAI: 'ph-bold ph-open-ai-logo',
  LangChain: 'ph-bold ph-link',
  'Hugging Face': 'ph-bold ph-smiley-wink',
  Anthropic: 'ph-bold ph-sparkle',
  Transformers: 'ph-bold ph-shuffle',
  LlamaIndex: 'ph-bold ph-article',
  Mistral: 'ph-bold ph-wind',
  'Claude Code': 'ph-bold ph-terminal',
  Codex: 'ph-bold ph-code',
  AutoGPT: 'ph-bold ph-robot',
  'AWS IAM': 'ph-bold ph-fingerprint',
  'Azure AD': 'ph-bold ph-users',
  Auth0: 'ph-bold ph-shield-check',
  n8n: 'ph-bold ph-flow-arrow',
  Bubble: 'ph-bold ph-chats-circle',
  'Microsoft Power Platform': 'ph-bold ph-layout',
};
