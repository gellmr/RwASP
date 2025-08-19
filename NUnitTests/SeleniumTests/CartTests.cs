using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using SeleniumExtras.WaitHelpers;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  public class CartTests : PageTest
  {
    [Test]
    public void EmptyCartPage_LoadsSuccessfully()
    {
      driver.Navigate().GoToUrl(viteUrl + "/cart");
      string titleElement = ".shopLayoutTransparent.bgCartFullTransparent h2";
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(titleElement))); // Wait for element to be visible on page.
      }
      catch (WebDriverTimeoutException){
        Assert.Fail(pageOrElementMissing);
      }
      IWebElement element = driver.FindElement(By.CssSelector(titleElement));
      Assert.That(element.Text, Does.Contain("Cart is Empty"), "Cart page - title is incorrect.");
    }

    [Test]
    public void AddToCart_IncrementsQty()
    {
      driver.Navigate().GoToUrl(viteUrl);
      string plusCss = ".addToCartBtnGroup button i.bi-plus";
      string cartButtonCss = "a.mgNavLinkCartBtn";
      string cartHasOneItem = "Cart: 1 Items";
      IWebElement smallBtn = null;
      IWebElement medBtn = null;
      var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
      try
      {
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(plusCss)));
        IWebElement plusButton = driver.FindElement(By.CssSelector(plusCss));
        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(plusButton));
        clickableButton.Click();
        IReadOnlyCollection<IWebElement> cartButtons = driver.FindElements(By.CssSelector(cartButtonCss));
        List<IWebElement> btns = cartButtons.ToList(); // There are 2 sizes used at different bootstrap breakpoints
        smallBtn = btns[0];
        medBtn = btns[1];
      }
      catch (WebDriverTimeoutException){
        Assert.Fail(pageOrElementMissing);
      }
      if (smallBtn == null){ Assert.Fail("Cart (smallBtn) not found"); }
      if (medBtn == null)  { Assert.Fail("Cart (medBtn)   not found"); }
      // Here we only test for the updated text appearing in medBtn. TextToBePresentInElement fails if not visible on screen.
      try{
        wait.Until(ExpectedConditions.TextToBePresentInElement(medBtn,   cartHasOneItem));
        Assert.That(medBtn.Text,   Does.Contain(cartHasOneItem), "Cart (medBtn)   - updated text is incorrect.");
      }
      catch (WebDriverTimeoutException){
        Assert.Fail("Cart (smallBtn/medBtn) - \"Cart: 1 Items\" text did not appear");
      }
      Assert.That(medBtn.Text,   Does.Contain(cartHasOneItem), "Cart (medBtn)   - does not say 1 item.");
    }
  }
}
