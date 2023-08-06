const { response } = require("express");

const Doctor = require("../models/doctor");

const getDoctors = async (req, res = response) => {
  const doctors = await Doctor.find()
    .populate("user", "name img")
    .populate("hospital", "name img");
  res.json({ doctors });
};

const searchDoctor = async (req, res = response) => {
  const search = req.params.search;
  const regex = new RegExp(search, "i");
  const doctors = await Doctor.find({ name: regex })
    .populate("user", "name img")
    .populate("hospital", "name img");
  res.json({ doctors });
};

const getDoctorById = (req, res = response) => {
  res.json({ msg: "getDoctorById" });
};

const newDoctor = async (req, res = response) => {
  const uid = req.uid;
  const doctor = new Doctor({ user: uid, ...req.body });

  try {
    const doctorDB = await doctor.save();
    res.json({ doctor: doctorDB });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hable con el administrador" });
  }
};

const updDoctor = (req, res = response) => {
  res.json({ msg: "actualizarMedico" });
};

const delDoctor = (req, res = response) => {
  res.json({ msg: "borrarMedico" });
};

module.exports = {
  getDoctors,
  searchDoctor,
  newDoctor,
  updDoctor,
  delDoctor,
  getDoctorById,
};
