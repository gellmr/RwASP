using ReactWithASP.Server.Infrastructure;
using System.ComponentModel.DataAnnotations;

namespace ReactWithASP.Server.DTO
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

  public class CartSubmitLineDTO { public Int32? cartLineID { get; set; } public Int32 qty { get; set; } public IspDTO? isp { get; set; } }

  public class CheckoutSubmitDTO
  {
    [RegularExpression(OkInputs.CheckoutName50, ErrorMessage = OkInputs.CheckoutName50Err)]
    public string? FirstName { get; set; }

    [RegularExpression(OkInputs.CheckoutName50, ErrorMessage = OkInputs.CheckoutName50Err)]
    public string? LastName { get; set; }

    [RegularExpression(OkInputs.CheckoutShip100, ErrorMessage = OkInputs.CheckoutShip100Err)]
    public string? ShipLine1 { get; set; }

    public string? ShipLine2 { get; set; }

    public string? ShipLine3 { get; set; }

    [RegularExpression(OkInputs.CheckoutDetail50, ErrorMessage = OkInputs.CheckoutDetail50Err)]
    public string? ShipCity { get; set; }

    [RegularExpression(OkInputs.CheckoutDetail50, ErrorMessage = OkInputs.CheckoutDetail50Err)]
    public string? ShipState { get; set; }

    [RegularExpression(OkInputs.CheckoutDetail50, ErrorMessage = OkInputs.CheckoutDetail50Err)]
    public string? ShipCountry { get; set; }

    [RegularExpression(OkInputs.CheckoutZip, ErrorMessage = OkInputs.CheckoutZipErr)]
    public string? ShipZip { get; set; }

    [RegularExpression(OkInputs.Email, ErrorMessage = OkInputs.EmailErr)]
    public string? ShipEmail { get; set; }

    public Guid? guestID { get; set; }
    public List<CartSubmitLineDTO> cart { get; set; }
  }
}
