namespace ReactWithASP.Server.Domain
{
  public class OrderV1 : UOrder
  {
    public OrderV1() : base() { }

    public string BillingAddress { get; set; }
    public string ShippingAddress { get; set; }
  }
}
