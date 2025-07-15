using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactWithASP.Server.Migrations
{
  public partial class CreateSPGetAdminOrders : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.Sql(@"
        CREATE PROCEDURE GetAdminOrders
        AS
        BEGIN
          SELECT ord.ID as 'OrderID',
            CASE WHEN usr.UserName IS NOT NULL THEN (usr.UserName) ELSE (guest.FirstName + ' ' + guest.LastName) END AS 'Username',
            CASE WHEN guest.ID IS NOT NULL THEN convert(nvarchar(50), guest.ID) ELSE (usr.Id) END AS 'UserID',
            CASE WHEN guest.ID IS NOT NULL THEN 'Guest' ELSE 'User' END AS AccountType,
            CASE WHEN guest.ID IS NOT NULL THEN (guest.Email) ELSE (usr.Email) END AS 'Email',
            ord.[OrderPlacedDate] as 'OrderPlaced',
            ordWPay.PaymentReceived, (rpay.InvoiceTot - ordWPay.PaymentReceived) as 'Outstanding', ordWPay.ItemsOrdered,
            ispTitles.Items as Items,
            ord.OrderStatus
          FROM [RwaspDatabase].[dbo].Orders as ord
          INNER JOIN (
            SELECT ord.ID as 'ord#', SUM(isp.Price * op.Quantity) as 'InvoiceTot'--
            FROM [RwaspDatabase].[dbo].Orders ord
            LEFT JOIN [RwaspDatabase].[dbo].OrderedProducts op on ord.ID = op.OrderID
            LEFT JOIN [RwaspDatabase].[dbo].InStockProducts isp on isp.ID = op.InStockProductID
            GROUP BY ord.ID
          ) as rpay on ord.ID = rpay.[ord#]
          LEFT JOIN (
            SELECT mto.ID as 'OrderID', SUM(sub.[pay.Amount]) as 'PaymentReceived', sub.ItemsOrdered
            FROM [RwaspDatabase].[dbo].Orders as mto
            INNER JOIN (
              SELECT ord.ID as 'OrderID', pay.ID AS 'pay.ID', pay.Amount as 'pay.Amount', SUM(op.Quantity) AS 'ItemsOrdered'
              FROM [RwaspDatabase].[dbo].[OrderPayments] as pay
              LEFT JOIN [RwaspDatabase].[dbo].Orders ord on pay.OrderID = ord.ID
              LEFT JOIN [RwaspDatabase].[dbo].OrderedProducts op on ord.ID = op.OrderID
              LEFT JOIN [RwaspDatabase].[dbo].InStockProducts isp on isp.ID = op.InStockProductID
              GROUP BY ord.ID, pay.ID,  pay.Amount
            )
            as sub ON mto.ID = sub.OrderID
            GROUP BY mto.ID, sub.ItemsOrdered
          ) AS ordWPay ON ord.ID = ordWPay.OrderID
          LEFT JOIN [RwaspDatabase].[dbo].[AspNetUsers] AS usr ON ord.UserID = usr.Id
          LEFT JOIN [RwaspDatabase].[dbo].[Guests] AS guest ON ord.GuestID = guest.ID
          LEFT JOIN(
            SELECT ord.ID as 'ord#', STRING_AGG ( isp.Title, ', ' ) as 'Items' FROM [RwaspDatabase].[dbo].Orders ord
            LEFT JOIN [RwaspDatabase].[dbo].OrderedProducts op on ord.ID = op.OrderID LEFT JOIN [RwaspDatabase].[dbo].InStockProducts isp on isp.ID = op.InStockProductID
            GROUP BY ord.ID
          ) As ispTitles ON ispTitles.[ord#] = ord.ID
          ORDER BY ord.OrderPlacedDate DESC;
        END;
      ");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.Sql(@"
        DROP PROCEDURE IF EXISTS GetAdminOrders;
      ");
    }
  }
}
