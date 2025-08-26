const { app } = require('../langgraph/graph');
const { getLogById } = require('../services/logService');

const suggestionReport = async (id, owner, repo, branch = 'main') => {
    const log = await getLogById(id);

    const input = {
        sentry_log: log,
        owner: owner,
        repo: repo,
        branch: branch,
    };

    const result = await app.invoke(input);

    return result.report
    
}

const getReportByLog = async (logId) => {
    const query = { logId }; 

    const suggestion = await Suggestion.find(query)
        .populate("logId");

    return {
        data: suggestion.map(c => ({
            id: c._id,
            report: c.report,
            log: c.logId,
            create_at: c.create_at
        }))
    };
}

module.exports = { suggestionReport, getReportByLog }