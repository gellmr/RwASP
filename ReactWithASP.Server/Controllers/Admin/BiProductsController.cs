using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ReactWithASP.Server.Controllers.Admin
{
  public class BiProductsController : AdminBaseController
  {
    private IInStockRepository prodRepo;
    private StoreContext _context; // Assuming you have your EF DbContext accessible or injected

    public BiProductsController(
      IInStockRepository pRepo,
      UserManager<AppUser> userManager,
      IGuestRepository gRepo,
      StoreContext context
    ) : base(userManager, gRepo){
      prodRepo = pRepo;
      _context = context;
    }

    [HttpGet("admin-sales-bi")]
    public async Task<ActionResult> GetSalesBiData([FromQuery] int? months = 12)
    {
      try
      {
        int lookbackMonths = (months.HasValue && months.Value > 0) ? months.Value : 12;
        var xMonthsAgo = DateTimeOffset.UtcNow.AddMonths(-lookbackMonths);
        var salesData = await _context.Set<OrderedProduct>()
        .Include(op => op.InStockProduct)
        .Include(op => op.Order)
        .Where(op => op.Order != null && op.Order.OrderPlacedDate >= xMonthsAgo)
        .GroupBy(op => op.InStockProduct.Title)
        .Select(g => new
        {
          productTitle = g.Key,
          quantitySold = g.Sum(op => op.Quantity),
          totalRevenue = g.Sum(op => op.Quantity * op.InStockProduct.Price)
        })
        .OrderByDescending(x => x.totalRevenue)
        .ToListAsync();
       return Ok(salesData);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }
  }
}
