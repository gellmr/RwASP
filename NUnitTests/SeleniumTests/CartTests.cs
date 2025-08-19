using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using SeleniumExtras.WaitHelpers;
using NUnitTests.Helpers;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  public class CartTests : PageTest
  {
    public string plusCss = ".addToCartBtnGroup button i.bi-plus";
    public string cartButtonCss = "a.mgNavLinkCartBtn";
    public string cartHasOneItem = "Cart: 1 Items";
    public string cartHasTwoItem = "Cart: 2 Items";
    IWebElement smallBtn = null;
    IWebElement medBtn = null;

    IWebElement itemOneTitle = null;
    public string cartPageItemOneTitleCss = ".inCartProd .inCartItemText h6";
    public const string cartPageItemOneSuccessText = "Drink Bottle $20";

    public string inCartRows = ".inCartProd";
    public decimal itemOneUnitPrice = 20M;

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

    private void ClickAddToCart()
    {
      var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
      wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(plusCss)));
      IWebElement plusButton = driver.FindElement(By.CssSelector(plusCss));
      IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(plusButton));
      clickableButton.Click();
      IReadOnlyCollection<IWebElement> cartButtons = driver.FindElements(By.CssSelector(cartButtonCss));
      List<IWebElement> btns = cartButtons.ToList(); // There are 2 sizes used at different bootstrap breakpoints
      smallBtn = btns[0];
      medBtn = btns[1];
    }

    [Test]
    public void AddToCart_IncrementsQty()
    {
      driver.Navigate().GoToUrl(viteUrl);
      var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
      try { ClickAddToCart(); }
      catch (WebDriverTimeoutException) { Assert.Fail(pageOrElementMissing); }
      if (smallBtn == null) { Assert.Fail("Cart (smallBtn) not found"); }
      if (medBtn == null) { Assert.Fail("Cart (medBtn) not found"); }
      // Here we only test for the updated text appearing in medBtn. TextToBePresentInElement fails if not visible on screen.
      try{
        wait.Until(ExpectedConditions.TextToBePresentInElement(medBtn,   cartHasOneItem));
        Assert.That(medBtn.Text,   Does.Contain(cartHasOneItem), "Cart (medBtn) - updated text is incorrect.");
      }
      catch (WebDriverTimeoutException){
        Assert.Fail("Cart (smallBtn/medBtn) - \"Cart: 1 Items\" text did not appear");
      }
      Assert.That(medBtn.Text,   Does.Contain(cartHasOneItem), "Cart (medBtn) - does not say 1 item.");
    }

    private void ClickAddThenGoToCart()
    {
      driver.Navigate().GoToUrl(viteUrl);
      var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
      try { ClickAddToCart(); }
      catch (WebDriverTimeoutException) { Assert.Fail(pageOrElementMissing); }
      if (smallBtn == null) { Assert.Fail("Cart (smallBtn) not found"); }
      if (medBtn == null) { Assert.Fail("Cart (medBtn)   not found"); }
      try
      {
        wait.Until(ExpectedConditions.TextToBePresentInElement(medBtn, cartHasOneItem));
        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(medBtn));
        clickableButton.Click();
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(cartPageItemOneTitleCss)));
        itemOneTitle = driver.FindElement(By.CssSelector(cartPageItemOneTitleCss));
      }
      catch (WebDriverTimeoutException ex)
      {
        Assert.Fail("(ClickAddThenGoToCart) WebDriverTimeoutException: " + ex.Message);
      }
    }

    [Test]
    public void AddToCart_ItemAppearsCartPage()
    {
      ClickAddThenGoToCart();
      if (itemOneTitle == null){
        Assert.Fail("Cart Page - Item One - not found"); return;
      }
      Assert.That(itemOneTitle.Text, Does.Contain(cartPageItemOneSuccessText), "Cart Page - Item One - text incorrect.");
    }

    

    [Test]
    public void IncrementInCart_QtyAndPriceUpdates()
    {
      var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
      ClickAddThenGoToCart();
      if (itemOneTitle == null){ Assert.Fail("Cart Page - Item One - not found"); return; }
      IWebElement summaryRow = null;
      IWebElement row1 = null;
      try
      {
        IReadOnlyCollection<IWebElement> cartRows = driver.FindElements(By.CssSelector(inCartRows));
        List<IWebElement> rows = cartRows.ToList();
        row1 = rows[0];
        summaryRow = rows[rows.Count - 1];
        IWebElement addBtn = row1.FindElement(By.CssSelector(".inCartItemRemove i.bi-plus"));
        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(addBtn));
        clickableButton.Click(); // Add a second item
        wait.Until(ExpectedConditions.TextToBePresentInElement(medBtn, cartHasTwoItem));
      }
      catch (WebDriverTimeoutException){
        Assert.Fail("Failed within Cart during IncrementInCart_QtyAndPriceUpdates test.");
      }
      if (medBtn == null) {     Assert.Fail("Cart (medBtn)     not found"); return; }
      if (row1 == null) {       Assert.Fail("Cart (row1)       not found"); return; }
      if (summaryRow == null) { Assert.Fail("Cart (summaryRow) not found"); return; }
      string? row1Text    = TestHelpers.TrimAndFlattenString(row1.Text);
      string? summaryText = TestHelpers.TrimAndFlattenString(summaryRow.Text);
      string priceTot = (2 * itemOneUnitPrice).ToString("G29");
      Assert.That(medBtn.Text,     Does.Contain(cartHasTwoItem),                    "Cart (medBtn)     - Updated text is incorrect.");
      Assert.That(row1Text,        Does.Contain("Quantity: 2 Price: $" + priceTot), "Cart (row1)       - Qty text is incorrect.");
      Assert.That(summaryText,     Does.Contain("Total: 2 Items $ " + priceTot),    "Cart (summaryRow) - Qty text is incorrect.");
      Assert.That(summaryRow.Text, Does.Contain("$ " + priceTot),                   "Cart (summaryRow) - Price text is incorrect.");
    }
  }
}
