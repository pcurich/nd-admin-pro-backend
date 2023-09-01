const fixDate = async (search, hour, min, sec) => {
  let dateClient = search.split("-");
  let year = parseInt(dateClient[0]);
  let month = parseInt(dateClient[1] - 1);
  let day = parseInt(dateClient[2]);

  let newDate = new Date(year, month, day, hour, min, sec); //.toLocaleString('en-US', { timeZone: 'America/Lima' });
  newDate.setHours(newDate.getHours() + parseInt(process.env.DT_OFFSET));
  return newDate;
};

module.exports.fixDate = fixDate;
