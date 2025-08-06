using ReactWithASP.Server.Domain.StoredProc;
using ReactWithASP.Server.DTO.MyOrders;

namespace ReactWithASP.Server.Domain.Abstract
{
  public interface IOrdersRepository
  {
    bool SaveOrder(Order order);
    Task<IEnumerable<AdminOrderRow>> GetOrdersWithUsersAsync(Int32 pageNum);
    public IEnumerable<Order>? GetMyOrders(UserIdDTO userInfo);
  }
}
