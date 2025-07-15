using Microsoft.IdentityModel.Tokens;
using ReactWithASP.Server.DTO;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactWithASP.Server.Domain.StoredProc
{
  [NotMapped]
  public class AdminOrderRow
  {
    private static Int32 maxLenItemsDisplay = 30;

    public Int32 OrderID { get; set; }
    public string? Username { get; set; }
    public string UserID { get; set; }
    public string AccountType { get; set; }
    public string? Email { get; set; }
    public DateTimeOffset OrderPlaced { get; set; }
    public decimal? PaymentReceived { get; set; }
    public decimal? Outstanding { get; set; }
    public Int32? ItemsOrdered { get; set; }
    public string? Items { get; set; }
    public string OrderStatus { get; set; }

    public OrderSlugDTO OrderSlug {
      get{
        string itemDisplay = Items.IsNullOrEmpty() ? string.Empty : ((Items.Length > maxLenItemsDisplay) ? Items.Substring(0, maxLenItemsDisplay - 3) + "..." : Items);
        string UserIDshort = (UserID.Length < 12) ? UserID : (UserID.Substring(0, 8) + "...");
        return new OrderSlugDTO{
          ID = OrderID.ToString(),
          Username = Username ?? string.Empty,
          UserID = UserID,
          UserIDshort = UserIDshort,
          AccountType = AccountType,
          Email = Email ?? string.Empty,
          OrderPlacedDate = OrderPlaced.ToString(),
          PaymentReceivedAmount = PaymentReceived.ToString() ?? string.Empty,
          Outstanding = Outstanding.ToString() ?? string.Empty,
          ItemsOrdered = ItemsOrdered.ToString() ?? string.Empty,
          Items = itemDisplay,
          OrderStatus = OrderStatus,
        };
      }
    }
  }
}
