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
    [Required(ErrorMessage = "Please enter your First Name")]
    [RegularExpression(OkInputs.CheckoutName50, ErrorMessage = OkInputs.CheckoutName50Err)]
    public string? FirstName { get; set; }

    [Required(ErrorMessage = "Please enter your Last Name")]
    [RegularExpression(OkInputs.CheckoutName50, ErrorMessage = OkInputs.CheckoutName50Err)]
    public string? LastName { get; set; }

    [Required(ErrorMessage = "Please enter the first address line")]
    [RegularExpression(OkInputs.CheckoutShip100, ErrorMessage = OkInputs.CheckoutShip100Err)]
    public string? ShipLine1 { get; set; }

    [RegularExpression(OkInputs.CheckoutShip100, ErrorMessage = OkInputs.CheckoutShip100Err)]
    public string? ShipLine2 { get; set; }

    [RegularExpression(OkInputs.CheckoutShip100, ErrorMessage = OkInputs.CheckoutShip100Err)]
    public string? ShipLine3 { get; set; }

    [Required(ErrorMessage = "Please enter a city name")]
    [RegularExpression(OkInputs.CheckoutDetail50, ErrorMessage = OkInputs.CheckoutDetail50Err)]
    public string? ShipCity { get; set; }

    [Required(ErrorMessage = "Please enter a state name")]
    [RegularExpression(OkInputs.CheckoutDetail50, ErrorMessage = OkInputs.CheckoutDetail50Err)]
    public string? ShipState { get; set; }

    [Required(ErrorMessage = "Please enter a country name")]
    [RegularExpression(OkInputs.CheckoutDetail50, ErrorMessage = OkInputs.CheckoutDetail50Err)]
    public string? ShipCountry { get; set; }

    [Required(ErrorMessage = "Please enter your postcode")]
    [RegularExpression(OkInputs.CheckoutZip, ErrorMessage = OkInputs.CheckoutZipErr)]
    public string? ShipZip { get; set; }

    [Required(ErrorMessage = "Email address is required")]
    [RegularExpression(OkInputs.Email, ErrorMessage = OkInputs.EmailErr)]
    public string? ShipEmail { get; set; }

    public Guid? guestID { get; set; }
    public List<CartSubmitLineDTO> cart { get; set; }
  }

  public class ConfirmGoogleAuthDTO
  {
    [Required(ErrorMessage = "clientId is required")]
    public string clientId { get; set; } // eg about 72 characters long "08mvd3ih...a3m7c6t.apps.googleusercontent.com"

    [Required(ErrorMessage = "credential is required")]
    public string credential { get; set; } // eg about 998 characters long. Has 3 sections separated by period (.) Eg, "eyJhbGciOiJSUzI1NiIs.ImtpZCI6Ijg4MjUwM2E1.ZmQ1NmU5ZjczNGRmYmE1Y"

    [Required(ErrorMessage = "select_by is required")]
    public string select_by { get; set; } // eg about 3 characters long "btn"
  }
}
