namespace ReactWithASP.Server
{
  public enum Cat
  {
    none,
    soccer,
    chess,
    waterSport
  }

  public class ProductCategory
  {
    public Int32 ID { get; set; }
    public string Title { get; set; }
    public string Segment { get; set; }

    public static Cat ParseCat(string str)
    {
      Cat myCat;
      Cat cat = Cat.none;
      try
      {
        if (Enum.TryParse(str, out myCat))
        {
          switch (myCat)
          {
            case Cat.none: cat = Cat.none; break;
            case Cat.soccer: cat = Cat.soccer; break;
            case Cat.chess: cat = Cat.chess; break;
            case Cat.waterSport: cat = Cat.waterSport; break;
          }
          return cat;
        }
        throw new Exception("could not parse string as Cat enum");
      }
      catch (Exception e)
      {
        throw e;
      }
    }

    public static string ParseCat(Cat cat)
    {
      string myCat = "";
      switch (cat)
      {
        case Cat.none: myCat = "None"; break;
        case Cat.soccer: myCat = "Soccer"; break;
        case Cat.chess: myCat = "Chess"; break;
        case Cat.waterSport: myCat = "WaterSport"; break;
      }
      return myCat;
    }
  }
}
