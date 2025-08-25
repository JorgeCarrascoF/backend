const { StateGraph, END } = require("@langchain/langgraph");
const { state } = require('./state');
const { model, octokit, getFileFromCulprit } = require('./utils');

  
  async function parseCulpritNode(state) {
    const file_detected = await getFileFromCulprit(
      state.owner,
      state.repo,
      state.sentry_log.culprit,
      state.branch
    );
    console.log("📂 Archivo detectado:", file_detected.path);
  
    return { ...state, file_detected };
  }
  
  async function getCommitsNode(state) {
    const res = await octokit.repos.listCommits({
      owner: state.owner,
      repo: state.repo,
      sha: state.branch,
      path: state.file_detected.path,
      per_page: 3,
      until: state.sentry_log.$date || undefined, // 👈 commits hasta esa fecha
    });
  
    console.log("🔍 Commits encontrados:");
    res.data.forEach(c =>
      console.log(`${c.sha} - ${c.commit.author.date} - ${c.commit.message}`)
    );
  
    return { ...state, commits: res.data };
  }
  
  async function getCommitFilesNode(state) {
    const commitSha = state.commits?.[0]?.sha;
    if (!commitSha) return { ...state, commit_files: [] };
  
    const res = await octokit.repos.getCommit({
      owner: state.owner,
      repo: state.repo,
      ref: commitSha,
    });
  
    const files = res.data.files.map(file => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch || "(sin diff disponible)",
    }));
  
    console.log(`📌 Último commit que tocó ${state.file_detected.path}: ${commitSha}`);
    files.forEach(f => {
      console.log(`\n📄 ${f.filename} (${f.status})`);
      console.log(f.patch);
    });
  
    return { ...state, commit_files: files };
  }
  
  async function getCodeOwnersNode(state) {
    try {
      const res = await octokit.repos.getContent({
        owner: state.owner,
        repo: state.repo,
        path: "CODEOWNERS",
        ref: state.branch,
      });
  
      const content = Buffer.from(res.data.content, "base64").toString("utf8");
  
      const lines = content.split("\n");
      const match = lines.find(line =>
        line &&
        !line.startsWith("#") &&
        state.file_detected.path.startsWith(line.split(" ")[0])
      );
  
      return { ...state, responsible: match || "No encontrado en CODEOWNERS" };
    } catch (err) {
      return { ...state, responsible: "No se encontró archivo CODEOWNERS" };
    }
  }
  
  async function generateReportNode(state) {
    const prompt = `
  Genera un reporte del error en base a los datos:
  
  - Archivo detectado: ${state.file_detected?.path}
  - Commits recientes (hasta fecha): ${JSON.stringify(state.commits || [], null, 2)}
  - Último commit que modificó el archivo (con diffs): 
  ${state.commit_files.map(f => `Archivo: ${f.filename}\nPatch:\n${f.patch}`).join("\n\n")}
  - Responsable según CODEOWNERS: ${JSON.stringify(state.responsible)}
  
  El reporte debe explicar:
  1. En qué archivo ocurrió el error.
  2. Qué fragmento del código está relacionado (según el patch).
  `;
  
    const res = await model.invoke(prompt);
    return { ...state, report: res.content };
  }
  
  /* ------------------ Grafo ------------------ */
  const graph = new StateGraph(state)
    .addNode("parseCulprit", parseCulpritNode)
    .addNode("getCommits", getCommitsNode)
    .addNode("getCommitFiles", getCommitFilesNode)
    .addNode("generateReport", generateReportNode)
    .addEdge("parseCulprit", "getCommits")
    .addEdge("getCommits", "getCommitFiles")
    .addEdge("getCommitFiles", "generateReport")
    .addEdge("generateReport", END)
    .setEntryPoint("parseCulprit");
  
  const app = graph.compile();
  
  /* ------------------ Ejecución ------------------ */
  async function main() {
    const sentryLog = require("./sentry_3.json"); 
  
    console.log("✅ Sentry log cargado:", sentryLog.culprit);
  
    const input = {
      sentry_log: sentryLog,
      owner: "JorgeCarrascoF",
      repo: "frontend",
      branch: "main",
    };
  
    const result = await app.invoke(input);
    console.log("\n📌 Reporte generado:\n", result.report);
  }
  
  main();