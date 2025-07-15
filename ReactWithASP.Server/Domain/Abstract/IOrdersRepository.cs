using ReactWithASP.Server.Domain.StoredProc;

namespace ReactWithASP.Server.Domain.Abstract
{
  public interface IOrdersRepository
  {
    bool SaveOrder(Order order);
    Task<IEnumerable<AdminOrderRow>> GetOrdersWithUsersAsync(Int32 pageNum);
  }
}
