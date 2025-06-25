using System.ComponentModel.DataAnnotations;

namespace ReactWithASP.Server.Controllers
{
  public class CartResponseDTO { public Guid? guestID { get; set; } }

  public class CartUpdateDTO : CartResponseDTO
  {
    public Int32? cartLineID { get; set; }
    public Int32 qty { get; set; }
    public IspDTO? isp { get; set; }
  }

  public class IspDTO
  {
    public Int32 id { get; set; }

    [RegularExpression(@"^[A-Za-z0-9\s\-\.\,\(\)\+\?\:]{1,50}$", ErrorMessage = "Please use alphanumeric, spaces, dashes, period, comma, plus symbol, question mark, colon, parentheses, 1-50 characters")]
    public string title { get; set; }

    [RegularExpression(@"^[A-Za-z0-9\s\-\.\,\(\)\+\?\:]{1,130}$", ErrorMessage = "Please use alphanumeric, spaces, dashes, period, comma, plus symbol, question mark, colon, parentheses, 1-130 characters")]
    public string description { get; set; }

    public decimal price { get; set; }
    public Int32 category { get; set; }
  }
}
