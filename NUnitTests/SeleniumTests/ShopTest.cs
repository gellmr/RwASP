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
    public IWebElement viewDetailsBtn = null;
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
    public const string myOrdDetPageTitleCss = "#myOrdDetailPage h4.adminTitleBar";

    public const string myOrdDetPageHeadInfoCss = ".myOrdDetailImageHead";
    public const string myOrdDetPageBodyInfoCss = ".myOrdDetailImageBody";

    public string? ordHeadInfoTextResult = null; // Not const. Gets set later
    public string? ordBodyInfoTextResult = null; // Not const. Gets set later
    public string? detailHeadInfoTextResult = null; // Not const. Gets set later
    public string? detailBodyInfoTextResult = null; // Not const. Gets set later

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
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        myOrdNavBtn = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdCssBtn)));
        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(myOrdNavBtn));
        clickableButton.Click();

        // Should see My Orders page
        myOrdPageTitle = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdPageTitleCss)));
        Assert.That(myOrdPageTitle.Text, Does.Contain("My Orders"), "GoToMyOrders - page title - incorrect.");

        // Get Order head info
        IWebElement myOrdPageHeadInfo = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdPageHeadInfoCss)));
        ordHeadInfoTextResult = TestHelpers.TrimAndFlattenString(myOrdPageHeadInfo.Text);

        // Get Order body details
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdPageBodyInfoCss)));
        IReadOnlyCollection<IWebElement> items = driver.FindElements(By.CssSelector(myOrdPageBodyInfoCss));
        IWebElement myOrdPageBodyInfo = items.ToList()[1];
        ordBodyInfoTextResult = TestHelpers.TrimAndFlattenString(myOrdPageBodyInfo.Text);

        // Get View Details button
        viewDetailsBtn = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdPageViewDetailCss)));
      }
      catch (WebDriverTimeoutException ex)
      {
        Assert.Fail("Timeout during GoToMyOrders");
      }
      Assert.That(viewDetailsBtn.Text, Does.Contain("View Details"),      "GoToMyOrders - viewDetailsBtn - incorrect.");
    }

    public void GoToMyOrderDetail()
    {
      string? pageTitle = null;
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        viewDetailsBtn = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdPageViewDetailCss)));
        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(viewDetailsBtn));
        clickableButton.Click();

        // Should see My Order Details page
        IWebElement titleElement = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdDetPageTitleCss)));
        pageTitle = titleElement.Text;

        // Get head
        IWebElement headInfo = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdDetPageHeadInfoCss)));
        detailHeadInfoTextResult = TestHelpers.TrimAndFlattenString(headInfo.Text);

        // Get body
        IWebElement bodyInfo = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrdDetPageBodyInfoCss)));
        detailBodyInfoTextResult = TestHelpers.TrimAndFlattenString(bodyInfo.Text);
      }
      catch (WebDriverTimeoutException ex)
      {
        Assert.Fail("Timeout during GoToMyOrderDetail");
      }
      Assert.That(pageTitle, Does.Contain("Order #"), "GoToMyOrderDetail - page title - incorrect.");
    }

    public void ShouldSee_JohnDoe_BottleOrder()
    {
      Assert.That(ordHeadInfoTextResult, Does.Contain("Account Type: Guest"),     "JohnDoe_BottleOrder - headInfoText - incorrect.");
      Assert.That(ordHeadInfoTextResult, Does.Contain("Guest ID:"),               "JohnDoe_BottleOrder - headInfoText - incorrect.");
      Assert.That(ordHeadInfoTextResult, Does.Contain("Full Name: John Doe"),     "JohnDoe_BottleOrder - headInfoText - incorrect.");
      Assert.That(ordHeadInfoTextResult, Does.Contain("Email: john@example.com"), "JohnDoe_BottleOrder - headInfoText - incorrect.");

      Assert.That(ordBodyInfoTextResult, Does.Contain("Order Number"),            "JohnDoe_BottleOrder - bodyInfoText - incorrect.");
      Assert.That(ordBodyInfoTextResult, Does.Contain("Status OrderPlaced"),      "JohnDoe_BottleOrder - bodyInfoText - incorrect.");
      Assert.That(ordBodyInfoTextResult, Does.Contain("Placed Date"),             "JohnDoe_BottleOrder - bodyInfoText - incorrect.");
      Assert.That(ordBodyInfoTextResult, Does.Contain("Items Drink Bottle (x1)"), "JohnDoe_BottleOrder - bodyInfoText - incorrect.");
      Assert.That(ordBodyInfoTextResult, Does.Contain("Total Items 1"),           "JohnDoe_BottleOrder - bodyInfoText - incorrect.");

      Assert.That(ordBodyInfoTextResult, Does.Contain("Price Total $ 20"),        "JohnDoe_BottleOrder - bodyInfoText - incorrect.");
      Assert.That(ordBodyInfoTextResult, Does.Contain("Ship To: " + joeAddress),  "JohnDoe_BottleOrder - bodyInfoText - incorrect.");
    }

    public void ShouldSee_JohnDoe_BottleOrdDetails()
    {
      Assert.That(detailHeadInfoTextResult, Does.Contain("Order Number"),           "JohnDoe_BottleOrdDetails - headInfo - incorrect.");
      Assert.That(detailHeadInfoTextResult, Does.Contain("Status OrderPlaced"),     "JohnDoe_BottleOrdDetails - headInfo - incorrect.");
      Assert.That(detailHeadInfoTextResult, Does.Contain("Placed Date"),            "JohnDoe_BottleOrdDetails - headInfo - incorrect.");
      Assert.That(detailHeadInfoTextResult, Does.Contain("Price Total $ 20"),       "JohnDoe_BottleOrdDetails - headInfo - incorrect.");
      Assert.That(detailHeadInfoTextResult, Does.Contain("Total Items 1"),          "JohnDoe_BottleOrdDetails - headInfo - incorrect.");
      Assert.That(detailHeadInfoTextResult, Does.Contain("Ship to: " + joeAddress), "JohnDoe_BottleOrdDetails - headInfo - incorrect.");

      Assert.That(detailBodyInfoTextResult, Does.Contain("Price Item Qty Total"),   "JohnDoe_BottleOrdDetails - bodyInfo - incorrect.");
      Assert.That(detailBodyInfoTextResult, Does.Contain("$20 Drink Bottle 1 $20 1 $20"), "JohnDoe_BottleOrdDetails - bodyInfo - incorrect.");
    }
  }
}
