module.exports = {
  getMondayOfWeek: function (d) {
    d = new Date(d)
    var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1)
    return new Date(d.setDate(diff))
  },
  yyyymmddToDate: function (yyyymmdd) {
    return new Date(
      yyyymmdd.substr(0,4), 
      yyyymmdd.substr(4,2)-1, 
      yyyymmdd.substr(6,2), 0, 0,0
    )
  }
}