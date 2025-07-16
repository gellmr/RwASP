﻿using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ReactWithASP.Server.Domain
{
  public class InStockProduct
  {
    [Key]
    [HiddenInput(DisplayValue = false)]
    public int ID { get; set; }

    [Required(ErrorMessage = "Please enter a product name")]
    public string Title { get; set; }

    [DataType(DataType.MultilineText)]
    [Required(ErrorMessage = "Please enter a description")]
    public string Description { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Please enter a positive price")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Please specify a category")]
    public Cat Category { get; set; }

    public string? Image {get; set; }
  }
}
