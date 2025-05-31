using Microsoft.AspNetCore.Mvc;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class ProductsController : ControllerBase
  {
    private static readonly IEnumerable<InStockProduct> Prods = new List<InStockProduct>
    {
      new InStockProduct { ID=1, Title="Soccer Ball",          Price=35.00M, Description="FIFA approved size and weight." },
      new InStockProduct { ID=2, Title="Corner Flags",         Price=25.00M, Description="Give some flourish to your playing field with these coloured corner flags." },
      new InStockProduct { ID=3, Title="Referee Whistle",      Price=12.00M, Description="For serious games, call it with this chrome Referee Whistle." },
      new InStockProduct { ID=4, Title="Red and Yellow Cards", Price=10.00M, Description="Official size and colour, waterproof high visibility retroflective coating." },

      new InStockProduct { ID=5, Title="Double Paddle",        Price=50.00M, Description="Double-ended paddle for kayaking or canoeing." },
      new InStockProduct { ID=6, Title="Camping Towel",        Price=15.00M, Description="Deluxe El Capitan All-Weather Towel... For drying off after water activities." },
      new InStockProduct { ID=7, Title="Sunscreen SPF 50+",    Price=25.00M, Description="Extreme Sports Edition fast drying activewear sunblock." }
    };

    [HttpGet(Name = "GetProducts")]
    public IEnumerable<InStockProduct> Get(){
      return Prods.ToArray();
    }
  }
}
