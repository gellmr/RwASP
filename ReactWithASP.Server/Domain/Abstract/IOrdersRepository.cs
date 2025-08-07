using ReactWithASP.Server.Domain.StoredProc;
using ReactWithASP.Server.DTO.MyOrders;

namespace ReactWithASP.Server.Domain.Abstract
{
  public interface IOrdersRepository
  {
    bool SaveOrder(Order order);
    Task<IEnumerable<AdminOrderRow>> GetOrdersWithUsersAsync(Int32 pageNum);
    public IEnumerable<Order>? GetUserOrders(string? idval, string? usertype);
    public IEnumerable<Order>? GetMyOrders(string? uid, string? gid);
  }
}
