using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Controllers.Admin;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;
using ReactWithASP.Server.Domain.StoredProc;
using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace ReactWithASP.Server.Controllers.Admin
{
  public class AdminOrdersController : AdminBaseController
  {
    private IOrdersRepository orderRepo;

    public AdminOrdersController(IOrdersRepository oRepo, UserManager<AppUser> userManager, IGuestRepository gRepo) : base(userManager, gRepo){
      orderRepo = oRepo;
    }

    [HttpGet("admin-orders/{pageNum}")]    // GET "/api/admin-orders"
    public async Task<IActionResult> GetOrders(Int32 pageNum = 1)
    {
      try
      {
        IEnumerable<AdminOrderRow> rows = await orderRepo.GetOrdersWithUsersAsync(pageNum);
        if (rows == null || !rows.Any()){
          BadRequest(new { errMessage = "Something went wrong. Records not found." });
        }
        else
        {
          // Apply sorting here, according to what the user wants.
          List<OrderSlugDTO> sorted = rows
            .OrderBy(o => o.OrderPlaced).Reverse()
            .Select(order => order.OrderSlug)
            .ToList();
          bool success = true;
          if (success){
            return Ok(new { orders = sorted }); // Automatically cast object to JSON.
          }
        }
      }
      catch(Exception){
        // Handle exception
      }
      return BadRequest(new { errMessage="Something went wrong." });
    }
  }
}
