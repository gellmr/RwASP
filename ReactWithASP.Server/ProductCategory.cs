namespace ReactWithASP.Server
{
  public enum Cat
  {
    None,
    Soccer,
    Chess,
    WaterSport
  }

  public class ProductCategory
  {
    public Int32 ID { get; set; }
    public string Title { get; set; }
    public string Segment { get; set; }

    public static Cat ParseCat(string str)
    {
      Cat myCat;
      Cat cat = Cat.None;
      try
      {
        if (Enum.TryParse(str, out myCat))
        {
          switch (myCat)
          {
            case Cat.None: cat = Cat.None; break;
            case Cat.Soccer: cat = Cat.Soccer; break;
            case Cat.Chess: cat = Cat.Chess; break;
            case Cat.WaterSport: cat = Cat.WaterSport; break;
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
        case Cat.None: myCat = "None"; break;
        case Cat.Soccer: myCat = "Soccer"; break;
        case Cat.Chess: myCat = "Chess"; break;
        case Cat.WaterSport: myCat = "WaterSport"; break;
      }
      return myCat;
    }
  }
}
