export default class DateInfo{
    constructor(dateText)
    {
      this.dateText = dateText;
      this.date = this.getDate(dateText);
      this.staggeredInfo = [];
    }
  
    getDate(dateText)
    {
      let data = new Date(dateText).getDay();
      switch(data)
      {
        case 0:
          return "Monday";
        case 1:
          return "Tuesday";
        case 2:
          return "Wednesday";
        case 3:
          return "Thrusday";
        case 4:
          return "Friday";
        case 5:
          return "Staturday";
        case 6:
          return "Sunday"
      }
    }
  
    get icon()
    {
      return 'http://openweathermap.org/img/w/' +this.staggeredInfo[0].weather[0].icon+ '.png';
    }
    get averageTemp()
    {
      let starter = 0;
      this.staggeredInfo.forEach(time => { starter += time.main.temp});
      let average = starter/this.staggeredInfo.length
      return average.toFixed(1);
    }
  
    get stats()
    {
      return this.staggeredInfo[0].wind;
    }
  
    get details()
    {
      return this.staggeredInfo[0].weather[0].description;
    }
  }