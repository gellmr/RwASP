﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;

namespace ReactWithASP.Server.Controllers.Admin
{
  [Authorize]
  [ApiController]
  [Route("api")]
  public class AdminProductsController : AdminBaseController
  {
    private IInStockRepository prodRepo;

    public AdminProductsController(IInStockRepository pRepo) : base(){
      prodRepo = pRepo;
    }

    [HttpGet("admin-products")]
    public ActionResult GetProducts()
    {
      try
      {
        IEnumerable<InStockProduct> prods = prodRepo.InStockProducts.ToList();
        return Ok(prods);
      }
      catch (Exception ex){
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }
  }
}
