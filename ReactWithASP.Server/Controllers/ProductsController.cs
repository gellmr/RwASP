using Microsoft.AspNetCore.Mvc;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class ProductsController : ControllerBase
  {
    private static readonly string[] Products = new[]{
        "AAA", "BBB", "CCC",    "D", "E", "F", "G", "H", "I",    "JJJ"
    };

    [HttpGet(Name = "GetProducts")]
    public IEnumerable<string> Get(){
      return Products.ToArray();
    }
  }
}
