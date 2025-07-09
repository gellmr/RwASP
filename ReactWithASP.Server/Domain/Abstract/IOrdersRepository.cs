namespace ReactWithASP.Server.Domain.Abstract
{
  public interface IOrdersRepository
  {
    bool SaveOrder(Order order);
    IEnumerable<Order> Orders { get; }
  }
}
