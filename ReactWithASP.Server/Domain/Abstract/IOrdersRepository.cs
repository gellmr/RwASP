using Microsoft.AspNetCore.SignalR;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Domain.Abstract
{
  public interface IOrdersRepository
  {
    void SaveOrder(Order order);
  }
}
