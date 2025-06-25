using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Domain
{
  public class EFOrdersRepository: IOrdersRepository
  {
    private readonly IConfiguration _config;
    private StoreContext context;

    public EFOrdersRepository(IConfiguration c){
      _config = c;
      context = new StoreContext(_config);
    }

    void IOrdersRepository.SaveOrder(Order order)
    {
      bool exists = context.Orders.Any(o => o.ID == order.ID);
      if (exists)
      {
        context.SaveChanges();
      }
      else
      {
        // Create new record
        context.Orders.Add(order);
        foreach (OrderedProduct op in order.OrderedProducts){
          InStockProduct ip = op.InStockProduct;
          context.Entry(ip).State = EntityState.Unchanged; // Dont create the product. It already exists in database.
          context.OrderedProducts.Add(op);
        }
        context.SaveChanges();
      }
    }
  }
}
