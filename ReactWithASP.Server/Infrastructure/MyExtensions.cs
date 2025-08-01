using ReactWithASP.Server.Domain;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using PCRE;

namespace ReactWithASP.Server.Infrastructure
{
  public static class OkUrls
  {
    // allow alphanumeric, right slash, space, dash, percent sign, 1-80 characters
    public static string ReturnUrl{ get { return
      "^[A-Za-z0-9\\/\\s\\-\\%]{1,80}$"
    ;}}

    public static string StorePage{ get { return
      //"^\\/$"
      "^\\/(page[\\d]{1,3})?$"
    ;}}
    public static string ChessCat{ get { return
      //"^\\/Chess$"
      "^\\/Chess(\\/page[\\d]{1,3})?$"
    ;}}
    public static string SoccerCat{ get { return
      //"^\\/Soccer$"
      "^\\/Soccer(\\/page[\\d]{1,3})?$"
    ;}}
    public static string WaterSportsCat{ get { return
      //"^\\/Water\\%20Sports$"
      "^\\/Water\\%20Sports(\\/page[\\d]{1,3})?$"
    ;}}
    public static string WaterSportsCat2{ get { return
      //"^\\/Water\\sSports$"
      "^\\/Water\\sSports(\\/page[\\d]{1,3})?$"
    ;}}
    public static string CartCheckout{ get { return
      //"^\\/Cart\\/Checkout$"
      "^\\/Cart\\/Checkout(\\/page[\\d]{1,3})?$"
    ;}}
  }
    
  public static class OkInputs
  {
    // This email regex uses PCRE format. Adapted from a php site I built.
    public const string EmailErr = "Please provide a valid email address";
    public const string Email = @"^[a-zA-Z0-9\.\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?){0,4}$";
    //                              ^              ^ ^                                                ^ dot is part of the final capture group, which can occur 0-4 times.
    //                              Mike22.aAA-ZZ  @ My123         My123-             My123           . My123         My123-             My123
    //                              something      @ something     dashes allowed in middle something . something dashes allowed in middle somthing (can have 4 x .com.com.com.com)

    public const string CheckoutName50 = @"^[A-Za-z0-9\s\-\.\,\(\)]{1,50}$";
    public const string CheckoutName50Err = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, 1-50 characters.";
    
    public const string CheckoutShip100 = @"^[A-Za-z0-9\s\-\.\,\(\)\:\/]{1,100}$";
    public const string CheckoutShip100Err = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, colon, forward slash, 1-100 characters.";

    public const string CheckoutDetail50 = @"^[A-Za-z0-9\s\-\.\,\(\)]{1,50}$";
    public const string CheckoutDetail50Err = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, 1-50 characters.";

    public const string CheckoutZip = @"^[0-9]{4}$";
    public const string CheckoutZipErr = "Please provide a 4 digit number.";
  }

  public static class MyExtensions
  {
    public static string SessionGuestID = "SessionGuestID";
    public static string GuestCookieName = "ReactMikeGellDemo.GuestCookie";
    public static string IdentityCookieName = "ReactMikeGellDemo.IdentityCookie"; // The authentication cookie. Contains the serialized claims principal object.

    public static CookieOptions CookieOptions = new CookieOptions {
      HttpOnly = true,
      Secure = true,
      Expires = DateTimeOffset.Now.AddDays(3)
    };

    // Extend string for our convenience. Eg Guid? a = mystring.ToNullableGuid()
    // See
    // https://stackoverflow.com/questions/45030/how-to-parse-a-string-into-a-nullable-int
    public static Nullable<Guid> ToNullableGuid(this string s)
    {
      Guid g;
      if (Guid.TryParse(s, out g)) return g;
      return null;
    }

    public static Guid ToGuid(this string s)
    {
      Guid g;
      if (Guid.TryParse(s, out g)) return g;
      throw new ArgumentException("Could not parse to Guid");
    }

    // https://stackoverflow.com/questions/2776673/how-do-i-truncate-a-net-string
    public static string Truncate(this string value, int maxLength){
      if (string.IsNullOrEmpty(value)) return value;
      int substrLen = maxLength - 3;
      return value.Length <= maxLength ? value : value.Substring(0, substrLen) + "...";
    }
  }
}