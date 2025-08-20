using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using SeleniumExtras.WaitHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnitTests.Helpers;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  public class ShopTest : PageTest
  {
    public IWebElement smallCartBtn = null;
    public IWebElement medCartBtn = null;
    public IWebElement? myOrdNavBtn = null;
    public const string shopPlusCss = ".addToCartBtnGroup button i.bi-plus";
    public const string cartButtonCss = "a.mgNavLinkCartBtn";
    public const string cartHasOneItem = "Cart: 1 Items";
    public const string cartHasTwoItem = "Cart: 2 Items";
    public const decimal inCartItemOneUnitPrice = 20M;
    public const string myOrdCssBtn = ".mgNavLinkBtn[href=\"/myorders\"]";
    public const string myOrdPageTitleCss = ".shopLayoutTransparent h2";
    public const string myOrdPageHeadInfoCss = ".myOrdersHeadInfo.myOrdersHeadInfo";
    public const string myOrdPageBodyInfoCss = ".myOrdersRect";
    public const string joeAddress = "123 River Gum Way, Unit 10/150, Third Floor, The Tall Apartment Building (Inc), SpringField, WA, Australia, 6525";
    public const string myOrdPageViewDetailCss = ".myOrdersRect a.btn.myOrdViewDetBtn";

    public void AddBottleToCart()
    {
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        IWebElement plusButton = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(shopPlusCss)));
        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(plusButton));
        clickableButton.Click();
        IReadOnlyCollection<IWebElement> cartButtons = driver.FindElements(By.CssSelector(cartButtonCss));
        List<IWebElement> btns = cartButtons.ToList(); // There are 2 sizes used at different bootstrap breakpoints
        smallCartBtn = btns[0];
        medCartBtn = btns[1];
      }
      catch (WebDriverTimeoutException ex)
      {
        Assert.Fail("Timeout during AddBottleToCart");
      }
      if (smallCartBtn == null) { Assert.Fail("Cart (smallCartBtn) not found"); }
      if (medCartBtn == null) {   Assert.Fail("Cart (medCartBtn) not found"); }
    }

    public void GoToMyOrders()
    {
      IWebElement myOrdPageTitle = null;
      string? headInfoText = null;
      string? bodyInfoText = null;
      IWebElement viewDetailsBtn = null;
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        myOrdNavBtn = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdCssBtn)));
        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(myOrdNavBtn));
        clickableButton.Click();

        // Should see My Orders page
        myOrdPageTitle = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdPageTitleCss)));
        Assert.That(myOrdPageTitle.Text, Does.Contain("My Orders"), "GoToMyOrders - page title - incorrect.");

        IWebElement myOrdPageHeadInfo = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdPageHeadInfoCss)));
        headInfoText = TestHelpers.TrimAndFlattenString(myOrdPageHeadInfo.Text);

        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdPageBodyInfoCss)));
        IReadOnlyCollection<IWebElement> items = driver.FindElements(By.CssSelector(myOrdPageBodyInfoCss));
        IWebElement myOrdPageBodyInfo = items.ToList()[1];
        bodyInfoText = TestHelpers.TrimAndFlattenString(myOrdPageBodyInfo.Text);

        viewDetailsBtn = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdPageViewDetailCss)));
      }
      catch (WebDriverTimeoutException ex)
      {
        Assert.Fail("Timeout during GoToMyOrders");
      }
      
      Assert.That(headInfoText, Does.Contain("Account Type: Guest"),     "GoToMyOrders - headInfoText - incorrect.");
      Assert.That(headInfoText, Does.Contain("Guest ID:"),               "GoToMyOrders - headInfoText - incorrect.");
      Assert.That(headInfoText, Does.Contain("Full Name: John Doe"),     "GoToMyOrders - headInfoText - incorrect.");
      Assert.That(headInfoText, Does.Contain("Email: john@example.com"), "GoToMyOrders - headInfoText - incorrect.");

      Assert.That(bodyInfoText, Does.Contain("Order Number"),            "GoToMyOrders - bodyInfoText - incorrect.");
      Assert.That(bodyInfoText, Does.Contain("Status OrderPlaced"),      "GoToMyOrders - bodyInfoText - incorrect.");
      Assert.That(bodyInfoText, Does.Contain("Placed Date"),             "GoToMyOrders - bodyInfoText - incorrect.");
      Assert.That(bodyInfoText, Does.Contain("Items Drink Bottle (x1)"), "GoToMyOrders - bodyInfoText - incorrect.");
      Assert.That(bodyInfoText, Does.Contain("Total Items 1"),           "GoToMyOrders - bodyInfoText - incorrect.");

      Assert.That(bodyInfoText, Does.Contain("Price Total $ 20"),        "GoToMyOrders - bodyInfoText - incorrect.");
      Assert.That(bodyInfoText, Does.Contain("Ship To: " + joeAddress),   "GoToMyOrders - bodyInfoText - incorrect.");

      Assert.That(viewDetailsBtn.Text, Does.Contain("View Details"),      "GoToMyOrders - viewDetailsBtn - incorrect.");
    }
  }
}
