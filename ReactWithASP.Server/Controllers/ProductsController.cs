using Microsoft.AspNetCore.Mvc;

namespace ReactWithASP.Server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ProductsController : ControllerBase
  {
    private static readonly IEnumerable<InStockProduct> Prods = new List<InStockProduct>
    {
      new InStockProduct { Category = Cat.WaterSport, ID=1, Title="Polycarbon Injection Molded River Kayak", Price=350.00M, Description="Tame the wilderness this one person kayak." },
      new InStockProduct { Category = Cat.WaterSport, ID=2, Title="Life Jacket", Price=100.00M, Description="Coastmaster TM Duratex All Weather Sea Life Jacket. For Tactical sea advantage." },
      new InStockProduct { Category = Cat.WaterSport, ID=3, Title="White Water Rafting Helmet", Price=90.00M, Description="Waterproof and Durable, this helmet comes in 12 colors." },
      new InStockProduct { Category = Cat.WaterSport, ID=4, Title="Single Paddle", Price=40.00M, Description="Right or Left handed paddle, for kayaking or canoeing." },

      new InStockProduct { Category = Cat.WaterSport, ID=5, Title="Double Paddle",        Price=50.00M, Description="Double-ended paddle for kayaking or canoeing." },
      new InStockProduct { Category = Cat.WaterSport, ID=6, Title="Camping Towel",        Price=15.00M, Description="Deluxe El Capitan All-Weather Towel... For drying off after water activities." },
      new InStockProduct { Category = Cat.WaterSport, ID=7, Title="Sunscreen SPF 50+",    Price=25.00M, Description="Extreme Sports Edition fast drying activewear sunblock." },
      new InStockProduct { Category = Cat.WaterSport, ID=8, Title="Waterproof Equipment Bag", Price=80.00M, Description="Carry your gear in this tough and compact waterproof bag." },

      new InStockProduct { Category = Cat.WaterSport, ID=9,  Title="Drink Bottle", Price=20.00M, Description="Dont forget to drink water, while your out doing water sports." },
      new InStockProduct { Category = Cat.WaterSport, ID=10, Title="Hydralite",    Price=7.00M,  Description="Rehydrate yourself after an event, with these effervescent tablets." },
      new InStockProduct { Category = Cat.Soccer, ID=11, Title="Soccer Ball",  Price=35.00M, Description="FIFA approved size and weight." },
      new InStockProduct { Category = Cat.Soccer, ID=12, Title="Corner Flags", Price=25.00M, Description="Give some flourish to your playing field with these coloured corner flags." },

      new InStockProduct { Category = Cat.Soccer, ID=13, Title="Referee Whistle",  Price=12.00M, Description="It even works under water." },
      new InStockProduct { Category = Cat.Soccer, ID=14, Title="Red and Yellow Cards",  Price=10.00M, Description="Official size and colour, waterproof high visibility retroflective coating." },
      new InStockProduct { Category = Cat.Soccer, ID=15, Title="Soccer Stadium",  Price=80000.00M, Description="Flat packed 30,000 seat stadium." },
      new InStockProduct { Category = Cat.Soccer, ID=16, Title="Soccer Goals",  Price=1000.00M, Description="One lightweight aluminium standard size impact foam coated soccer goal with netting." },

      new InStockProduct { Category = Cat.Soccer, ID=17, Title="Line Marking Spray",  Price=15.00M, Description="Fluorescent white spray-on line marking paint. Comes with a roll of guide string." },
      new InStockProduct { Category = Cat.Soccer, ID=18, Title="Aviator Glasses",  Price=500.00M, Description="Football celebrities gotta go shopping sometimes." },
      new InStockProduct { Category = Cat.Soccer, ID=19, Title="First Aid Kit",  Price=120.00M, Description="Sometimes those injuries are real..." },
      new InStockProduct { Category = Cat.Soccer, ID=20, Title="White T-Shirt",  Price=20.00M, Description="Sometimes you need a white T Shirt." },

      new InStockProduct { Category = Cat.Chess, ID=21, Title="Thinking Cap",  Price=15.00M, Description="Improve your concentration by 4%" },
      new InStockProduct { Category = Cat.Chess, ID=22, Title="Chess Board",  Price=25.00M, Description="Non-reflective and slip resistant." },
      new InStockProduct { Category = Cat.Chess, ID=23, Title="Speed Chess Timer",  Price=50.00M, Description="Has a digital timer display on both sides, and supercollider toggle button on top. Silent and durable. Batteries not included." },
      new InStockProduct { Category = Cat.Chess, ID=24, Title="Chess Pieces - Full Set",  Price=90.00M, Description="Full set of chess pieces. Charcoal Black / Frost White." },

      new InStockProduct { Category = Cat.Chess, ID=25, Title="Individual Chess Piece",  Price=10.00M, Description="Single chess pieces available. Charcoal Black / Frost White." },
      new InStockProduct { Category = Cat.Chess, ID=26, Title="Unsteady Chair",  Price=45.00M, Description="Secretly give your opponent a disadvantage." },
      new InStockProduct { Category = Cat.Chess, ID=27, Title="Holo Chess",  Price=22000.00M, Description="As seen in Star Wars: A New Hope." },
    };

    [HttpGet("category/{category:alpha}")] //  GET api/products/category/{category}
    public IEnumerable<InStockProduct> Get(string category = "")
    {
      Cat paramCat = ProductCategory.ParseCat(category); // case sensitive
      if (String.IsNullOrEmpty(category))
      {
        return Prods.ToArray();
      }
      else
      {
        return Prods.Where(
          p => p.Category.Equals(paramCat)
        ).ToList();
      }
    }
  }
}
