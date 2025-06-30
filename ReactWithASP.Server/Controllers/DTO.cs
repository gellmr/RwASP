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
    [Required(ErrorMessage = "access_token is required")]
    public string access_token { get; set; } // eg about 224 characters long "32clD5vhgx900BPLAg1BiN4RKA0177..."
    
    [Required(ErrorMessage = "authuser is required")]
    public string authuser { get; set; }     // eg "0"
    
    [Required(ErrorMessage = "expires_in is required")]
    public Int32 expires_in { get; set; }    // eg 3599
    
    [Required(ErrorMessage = "prompt is required")]
    public string prompt { get; set; }       // eg "none"
    
    [Required(ErrorMessage = "scope is required")]
    public string scope { get; set; }        // eg "email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
    
    [Required(ErrorMessage = "token_type is required")]
    public string token_type { get; set; }   // eg "Bearer"

  }
}
