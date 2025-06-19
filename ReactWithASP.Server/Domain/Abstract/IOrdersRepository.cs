namespace ReactWithASP.Server.Domain.Abstract
{
  public interface IOrdersRepository
  {
    void SaveOrder(Order order);
  }
}
