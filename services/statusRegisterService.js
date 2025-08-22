const StatusRegister = require("../models/status register");
const Log = require("../models/log");
const mongoose = require("mongoose");


const getStatusRegisterById = async (id) => {
  const statusRegister = await StatusRegister.findById(id)
    .populate("userId", "username email")
    .select("-password");

  if (!statusRegister) return null;

  return {
    id: statusRegister._id,
    status: statusRegister.status,
    created_at: statusRegister.created_at
  };
};

const createStatusRegister = async ({ logId, userId, status }) => {
  if (!mongoose.Types.ObjectId.isValid(logId)) {
    throw new Error("Invalid logId");
  }

  const log = await Log.findByIdAndUpdate(
    logId,
    { status },
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
  return { log, statusRegister: newStatusRegister };
};


module.exports = {
  createStatusRegister
};
