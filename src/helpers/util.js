const fixDate = async (search, hour, min, sec) => {
  var dateClient = search.split("-");
  var year = parseInt(dateClient[0]);
  var month = parseInt(dateClient[1] - 1);
  var day = parseInt(dateClient[2]);

  var newDate = new Date(year, month, day, hour, min, sec); //.toLocaleString('en-US', { timeZone: 'America/Lima' });
  newDate.setHours(newDate.getHours() + parseInt(process.env.DT_OFFSET));
  return newDate;
};

module.exports.fixDate = fixDate;
