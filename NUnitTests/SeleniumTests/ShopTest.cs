using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using SeleniumExtras.WaitHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  public class ShopTest : PageTest
  {
    public IWebElement smallCartBtn = null;
    public IWebElement medCartBtn = null;

    public const string shopPlusCss = ".addToCartBtnGroup button i.bi-plus";
    public const string cartButtonCss = "a.mgNavLinkCartBtn";

    public const string cartHasOneItem = "Cart: 1 Items";
    public const string cartHasTwoItem = "Cart: 2 Items";

    public const decimal inCartItemOneUnitPrice = 20M;

    public void ClickAddToCart()
    {
      var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
      wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(shopPlusCss)));
      IWebElement plusButton = driver.FindElement(By.CssSelector(shopPlusCss));
      IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(plusButton));
      clickableButton.Click();
      IReadOnlyCollection<IWebElement> cartButtons = driver.FindElements(By.CssSelector(cartButtonCss));
      List<IWebElement> btns = cartButtons.ToList(); // There are 2 sizes used at different bootstrap breakpoints
      smallCartBtn = btns[0];
      medCartBtn = btns[1];
    }

    public void AddBottleToCart()
    {
    }
  }
}
