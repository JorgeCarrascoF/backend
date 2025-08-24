const StatusRegister = require("../models/status register");
const Log = require("../models/log");
const mongoose = require("mongoose");
const suggestedUserService = require("./suggestedUserService");

class StatusRegisterService {

  createStatusRegister = async ({ logId, userId, status }) => {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
      throw new Error("Invalid logId");
    }

    const log = await Log.findByIdAndUpdate(
      logId,
      { status, assigned_to: userId },
      { new: true, runValidators: true }
    );

    if (!log) throw new Error("Log not found");
    const newStatusRegister = new StatusRegister({
      logId,
      userId,
      status,
      created_at: new Date(),
    });

    await newStatusRegister.save();
    await suggestedUserService.trackResolution(logId);
    
    return { log, statusRegister: newStatusRegister };
  };

  getAllStatusRegisters = async (pagination) => {
    const { limit, skip } = pagination;
    const query = {};
    const statusRegisters = await StatusRegister.find(query)
      .populate("userId", "fullName email")
      .populate('logId')
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const totalStatusRegisters = await StatusRegister.countDocuments(query);

    return {
      data: statusRegisters.map((statusRegister) => ({
        id: statusRegister._id,
        status: statusRegister.status,
        userId: statusRegister.userId,
        logId: statusRegister.logId,
        created_at: statusRegister.created_at
      })),
      total: totalStatusRegisters,
    };

  };

  async getStatusRegisterById(id) {
    const statusRegister = await StatusRegister.findById(id)
      .populate('userId', 'fullName email')
      .populate('logId');
    if (!statusRegister) {
      throw boom.notFound('Status Register no encontrado');
    }
    return statusRegister;
  }

}

module.exports = new StatusRegisterService();
