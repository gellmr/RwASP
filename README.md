# Online Store built with React and .NET Core

This is Single Page Application built with React, Redux, Axiox, .NET Core, Entity Framework and SQL Server.

The site can be viewed at [https://react.mikegelldemo.live](https://react.mikegelldemo.live)

(Please allow a few seconds for the site to load.)

The application allows you to browse and search for products, add to cart and proceed to checkout.

Completed orders appear within the user's My Orders page.

There is also an Admin login, where you can view customer orders, customer accounts, and the product catalogue.

To generate the orders backlog, I used a [stored procedure](https://github.com/gellmr/RwASP/blob/bec2014eccb80ac90f6b25a4145a8dbf960adaee/ReactWithASP.Server/Migrations/20250724052400_CreateSPGetAdminOrders.cs) to join several tables and aggregate data.

The user profile images are thanks to Keith Armstrong's excellent API [RandomUserMe](https://randomuser.me/)

For the login page, I have used [standard Identity tables](https://github.com/gellmr/RwASP/blob/bec2014eccb80ac90f6b25a4145a8dbf960adaee/ReactWithASP.Server/Migrations/20250724052040_InitialCreate.cs) with [traditional HttpOnly cookie authentication](https://github.com/gellmr/RwASP/blob/9db2021f5cec23099cdd57c9967fe1652ac7993c/ReactWithASP.Server/Program.cs). Logins are [performed using the standard UserManager and SignInManager](https://github.com/gellmr/RwASP/blob/613bd91adb91c18ddf15209575635b8aea4bc8f6/ReactWithASP.Server/Controllers/AdminLoginController.cs). I have also [incorporated Google Sign In](https://github.com/gellmr/RwASP/blob/613bd91adb91c18ddf15209575635b8aea4bc8f6/ReactWithASP.Server/Controllers/GoogleTokenValidateController.cs) for easy click-through access.
