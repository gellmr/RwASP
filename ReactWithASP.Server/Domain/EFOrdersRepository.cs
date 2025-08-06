using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Domain.StoredProc;
using ReactWithASP.Server.DTO.MyOrders;
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

    // Return true if saved successfully.
    bool IOrdersRepository.SaveOrder(Order order)
    {
      bool exists = (order.ID != null) && context.Orders.Any(o => o.ID == order.ID);
      if (exists)
      {
        // Update
        Order dbOrder = context.Orders.First(o => o.ID == order.ID);
        // TODO - save the order
        // TODO - save the order
        // TODO - save the order
        context.SaveChanges();
        return true;
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
        if (order.Guest != null){
          context.Entry(order.Guest).State = EntityState.Unchanged; // Dont create the guest.
        }
        context.SaveChanges();
        return true;
      }
      return false;
    }

    public async Task<IEnumerable<AdminOrderRow>> GetOrdersWithUsersAsync(Int32 pageNum)
    {
      IEnumerable<AdminOrderRow> rows = await context.AdminOrderRows
        .FromSqlInterpolated($"EXEC GetAdminOrders {pageNum}, {12}")
        .ToListAsync();
      return rows;
      //// Eagerly load the associated records for this Order...
      //IEnumerable<Order> orders = context.Orders
      //  .Include(o => o.AppUser)
      //  .Include(o => o.Guest)
      //  .Include(o => o.OrderPayments)
      //  .Include(o => o.OrderedProducts).ThenInclude(op => op.InStockProduct);
      //return orders;
    }

    public IEnumerable<Order>? GetMyOrders(string? uid, string? gid)
    {
      uid = uid.ToLower();
      gid = gid.ToLower();
      if (uid != null && gid != null){
        IEnumerable<Order> rowsBoth = context.Orders.Where(o =>
          o.UserID.ToLower().Equals(uid) ||
          o.GuestID.ToString().ToLower().Equals(gid)
        );
        return LoadOrderedProducts(rowsBoth);
      }
      else if(uid != null)
      {
        IEnumerable<Order> rowsUser = context.Orders.Where(o => o.UserID.ToLower().Equals(uid));
        return LoadOrderedProducts(rowsUser);
      }
      IEnumerable<Order> rowsGuest = context.Orders.Where(o => o.GuestID.ToString().ToLower().Equals(gid));
      return LoadOrderedProducts(rowsGuest);
    }

    protected IEnumerable<Order> LoadOrderedProducts(IEnumerable<Order> rows)
    {
      foreach (Order order in rows)
      {
        order.OrderedProducts = context.OrderedProducts.Where(op => op.OrderID == order.ID).
          Select(op => new OrderedProduct
          {
            // Load everything that we might need for display on the My Orders page...
            ID = op.ID,
            Quantity = op.Quantity,
            Order = null,   // Avoid cycle of loading objects. We already have the Order.
            OrderID = null,
            InStockProduct = op.InStockProduct,
            InStockProductID = op.InStockProductID,
          })
          .ToList();
      }
      return rows;
    }
  }
}
