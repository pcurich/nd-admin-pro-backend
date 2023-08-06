const { interceptor, R200, R500, R400 } = require("../helpers/response");
const { response } = require("express");
const shortid = require("shortid");
const path = require("path");
const fs = require("fs");

const upload = async (req, res = response) => {
  const { table, id } = req.params;
  console.log("PCURICH", req.params);
  const pathValid = ["hospital", "doctor", "user"];

  // Validar tipo
  if (!pathValid.includes(table)) {
    return interceptor(res, {}).json(
      R500(500, "PATH", "Nombre de la tabla incorrecta")
    );
  }

  // Validar que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return interceptor(res, {}).json(R400(400, "PATH", "No hay imagen"));
  }

  // Procesar la imagen...
  const file = req.files.imagen;

  // Validar extension
  const extension = file.name.split(".").reverse()[0];
  const extensions = ["png", "jpg", "jpeg", "gif"];
  if (!extensions.includes(extension)) {
    return interceptor(res, {}).json(
      R400(400, "PATH", "Extension no permitida")
    );
  }

  // Generar el nombre del archivo
  const fileName = `${shortid.generate()}.${extension}`;

  // Path para guardar la imagen
  const path = `./uploads/${table}/${fileName}`;
  console.log("PCURICH", path);

  // Mover la imagen
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return interceptor(res, {}).json(
        R500(500, "PATH", "Error al mover la imagen")
      );
    }

    // Actualizar base de datos
    //actualizarImagen(table, id, fileName);

    return interceptor(res, { data: fileName, code: 200 }).json(
      R200({ data: fileName, code: 200 }, "OK")
    );
  });
};

module.exports.upload = upload;
