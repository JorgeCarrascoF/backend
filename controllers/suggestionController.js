const Suggestion = require('../models/suggestion');
const suggestionService = require('../services/suggestionService');
const logService = require('../services/logService');


const getReportById = async (req, res) => {
  try {
    const { idLog, owner, repo, branch } = req.body;    
      const log = await logService.getLogById(idLog);

      if (!log) {
          return res.status(404).json({ msg: 'Log not found.' });
      }

      const report = await suggestionService.suggestionReport(
        idLog,
        owner,
        repo,
        branch
      )

      const suggestion = new Suggestion({
        report,
        'idLog': '68ac242faaa9b891be62e35b',
        'hola':'hola'
        });

      console.log(suggestion)
      await suggestion.save();


      res.status(200).json({
        'message': 'Suggestion created successfully',
        idLog,
        report,
  });
  } catch (err) {
      res.status(500).json({ msg: 'Error general report', error: err.message });
  }
};

const getReportByLog = async (req, res, next) => {
  try {
    const { logId } = req.params;
    
    const result = await logService.getReportByLog(logId);

    res.status(200).json({
      success: true,
      result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReportById, getReportByLog };