using Microsoft.AspNetCore.Mvc;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class CategoriesController: ControllerBase
  {

    private static readonly IEnumerable<ProductCategory> Cats = new List<ProductCategory>
    {
      new ProductCategory { ID=1, Title="Soccer" },
      new ProductCategory { ID=2, Title="Chess" },
      new ProductCategory { ID=3, Title="Water Sport" }
    };

    [HttpGet(Name = "GetCategories")]
    public IEnumerable<ProductCategory> Get()
    {
      return Cats.ToArray();
    }
  }
}