const { Octokit } = require("@octokit/rest");
const { AzureChatOpenAI } = require("@langchain/openai");
require("dotenv").config();

const model = new AzureChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, 
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME, 
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION, 
  });


const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });


function parseCulprit(culprit) {
  const regex = /\((.*?)\)/; 
  const match = culprit.match(regex);

  if (!match) throw new Error("Formato de culprit inválido");
  return match[1]; 
}

async function getFileFromCulprit(owner, repo, culprit, branch = "main") {
  const basePath = parseCulprit(culprit);

  const refData = await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
  const commitSha = refData.data.object.sha;

  const commitData = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: commitSha,
  });

  const treeData = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: commitData.data.tree.sha,
    recursive: "true",
  });

  // 4️⃣ Buscar archivos que hagan match con basePath
  const candidates = treeData.data.tree.filter(
    (item) => item.type === "blob" && item.path.startsWith(basePath)
  );

  if (candidates.length === 0) {
    throw new Error(`No se encontró archivo para ${basePath}`);
  }

  // 5️⃣ Si hay varios, tomamos el primero
  const file = candidates[0];
  return { path: file.path };

}


module.exports = { 
  model,
  octokit,
  getFileFromCulprit
};