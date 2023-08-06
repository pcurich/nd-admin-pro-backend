const { response } = require("express");

const Hospital = require("../models/hospital");

const getHospitals = async (req, res = response) => {
  const hospitals = await Hospital.find().populate("user", "name img");
  res.json({ hospitals });
};

const newHospital = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({ user: uid, ...req.body });

  try {
    const hospitalBD = await hospital.save();

    res.json({ hospital: hospitalBD });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hable con el administrador" });
  }
};

const updHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: "actualizarHospital",
  });
};

const delHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: "borrarHospital",
  });
};

module.exports = {
  getHospitals,
  newHospital,
  updHospital,
  delHospital,
};
