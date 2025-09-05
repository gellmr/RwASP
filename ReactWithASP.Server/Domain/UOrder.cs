namespace ReactWithASP.Server.Domain
{
  public class UOrder : OrderBase
  {
    public UOrder()
    {
      GuestID = null;
      UserID = null;
      ID = null;
      OrderedProducts = new List<OrderedProduct>();
    }

    public UOrder(int orderID, string userID, Nullable<Guid> guestID)
    {
      GuestID = guestID;
      UserID = userID;
      ID = orderID;
      OrderedProducts = new List<OrderedProduct>();
    }
  }
}
