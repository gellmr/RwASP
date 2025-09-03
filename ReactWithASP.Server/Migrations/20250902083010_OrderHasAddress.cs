using Microsoft.EntityFrameworkCore.Migrations;
#nullable disable
namespace ReactWithASP.Server.Migrations
{
  public partial class OrderHasAddress : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      // Perform migration step 3 using SQL. This includes Parse existing address string data and insert to Address table.

      string sql = @"
        -- This was created with 'script-migration' and then needed some adjustments with the help of Gemini.
        -- This will migrate us to AFTER Migration Step 3 'OrderHasAddress'

        USE [RwaspDatabase]
        GO

        BEGIN TRANSACTION;

        -- Create the User-Defined Function to parse addresses
        IF OBJECT_ID('dbo.ParseAddress') IS NOT NULL
        DROP FUNCTION dbo.ParseAddress;
        GO

        CREATE FUNCTION dbo.ParseAddress (@AddressString NVARCHAR(MAX))
        RETURNS @ParsedAddress TABLE (
            Line1 NVARCHAR(MAX),
            Line2 NVARCHAR(MAX),
            Line3 NVARCHAR(MAX),
            City NVARCHAR(MAX),
            State NVARCHAR(MAX),
            Zip NVARCHAR(MAX)
        )
        AS
        BEGIN
            INSERT INTO @ParsedAddress (Line1, Line2, Line3, City, State, Zip)
            SELECT
                -- Line1
                CASE
                    WHEN CHARINDEX(',', @AddressString, CHARINDEX(',', @AddressString) + 1) > 0 THEN TRIM(SUBSTRING(@AddressString, 1, CHARINDEX(',', @AddressString) - 1))
                    ELSE TRIM(SUBSTRING(@AddressString, 1,
                        CASE
                            WHEN (LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString))) < 1
                            THEN 0
                            ELSE LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString))
                        END
                    ))
                END,
                -- Line2
                CASE
                    WHEN CHARINDEX(',', @AddressString, CHARINDEX(',', @AddressString) + 1) > 0 THEN TRIM(SUBSTRING(@AddressString, CHARINDEX(',', @AddressString) + 1, CHARINDEX(',', @AddressString, CHARINDEX(',', @AddressString) + 1) - CHARINDEX(',', @AddressString) - 1))
                    ELSE NULL
                END,
                -- Line3
                CASE
                    WHEN CHARINDEX(',', @AddressString, CHARINDEX(',', @AddressString, CHARINDEX(',', @AddressString, CHARINDEX(',', @AddressString) + 1) + 1)) > 0 THEN TRIM(SUBSTRING(@AddressString, CHARINDEX(',', @AddressString, CHARINDEX(',', @AddressString) + 1) + 1,
                        CASE
                            WHEN (LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString)) - (CHARINDEX(',', @AddressString, CHARINDEX(',', @AddressString) + 1) + 1)) < 1
                            THEN 0
                            ELSE LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString)) - (CHARINDEX(',', @AddressString, CHARINDEX(',', @AddressString) + 1) + 1)
                        END
                    ))
                    ELSE NULL
                END,
                -- City
                TRIM(SUBSTRING(@AddressString,
                    CASE WHEN LEN(@AddressString) - CHARINDEX(' ', REVERSE(@AddressString), CHARINDEX(' ', REVERSE(@AddressString), LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString)) - CHARINDEX(' ', REVERSE(SUBSTRING(@AddressString, 1, LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString))))))) + 1 < 1
                    THEN 1
                    ELSE LEN(@AddressString) - CHARINDEX(' ', REVERSE(@AddressString), CHARINDEX(' ', REVERSE(@AddressString), LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString)) - CHARINDEX(' ', REVERSE(SUBSTRING(@AddressString, 1, LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString))))))) + 1
                    END,
                    CASE WHEN (LEN(@AddressString) - CHARINDEX(' ', REVERSE(@AddressString)) - (LEN(@AddressString) - CHARINDEX(' ', REVERSE(@AddressString), CHARINDEX(' ', REVERSE(@AddressString), LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString)) - CHARINDEX(' ', REVERSE(SUBSTRING(@AddressString, 1, LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString))))))) + 1)) < 1
                    THEN 0
                    ELSE LEN(@AddressString) - CHARINDEX(' ', REVERSE(@AddressString)) - (LEN(@AddressString) - CHARINDEX(' ', REVERSE(@AddressString), CHARINDEX(' ', REVERSE(@AddressString), LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString)) - CHARINDEX(' ', REVERSE(SUBSTRING(@AddressString, 1, LEN(@AddressString) - CHARINDEX(',', REVERSE(@AddressString))))))) + 1)
                    END
                )),
                -- State
                TRIM(SUBSTRING(@AddressString,
                    CASE WHEN LEN(@AddressString) - CHARINDEX(' ', REVERSE(@AddressString)) + 2 < 1 THEN 1 ELSE LEN(@AddressString) - CHARINDEX(' ', REVERSE(@AddressString)) + 2 END,
                    CASE WHEN CHARINDEX(' ', REVERSE(@AddressString)) - 1 < 1 THEN 0 ELSE CHARINDEX(' ', REVERSE( @AddressString)) - 1 END
                )),
                -- Zip
                CASE WHEN LEN(@AddressString) < 4 THEN NULL ELSE TRIM(RIGHT(@AddressString, 4)) END;

            RETURN;
        END;
        GO

        ALTER TABLE [Orders] ADD [BillAddressID] int NULL;

        ALTER TABLE [Orders] ADD [ShipAddressID] int NULL;

        CREATE TABLE [Addresses] (
            [ID] int NOT NULL IDENTITY(111, 1),
            [Line1] nvarchar(max) NOT NULL,
            [Line2] nvarchar(max) NULL,
            [Line3] nvarchar(max) NULL,
            [City] nvarchar(max) NOT NULL,
            [State] nvarchar(max) NOT NULL,
            [Country] nvarchar(max) NOT NULL,
            [Zip] nvarchar(max) NOT NULL,
            CONSTRAINT [PK_Addresses] PRIMARY KEY ([ID])
        );

        CREATE INDEX [IX_Orders_BillAddressID] ON [Orders] ([BillAddressID]);

        CREATE INDEX [IX_Orders_ShipAddressID] ON [Orders] ([ShipAddressID]);

        ALTER TABLE [Orders] ADD CONSTRAINT [FK_Orders_Addresses_BillAddressID] FOREIGN KEY ([BillAddressID]) REFERENCES [Addresses] ([ID]);

        ALTER TABLE [Orders] ADD CONSTRAINT [FK_Orders_Addresses_ShipAddressID] FOREIGN KEY ([ShipAddressID]) REFERENCES [Addresses] ([ID]);

        -- Create a temporary table to hold parsed addresses before inserting them into the Addresses table.
        CREATE TABLE #ParsedAddresses (
            OrderID INT,
            IsShipping BIT,
            Line1 NVARCHAR(MAX),
            Line2 NVARCHAR(MAX),
            Line3 NVARCHAR(MAX),
            City NVARCHAR(MAX),
            State NVARCHAR(MAX),
            Zip NVARCHAR(MAX)
        );

        -- Use the UDF with CROSS APPLY to parse shipping and billing addresses
        INSERT INTO #ParsedAddresses (OrderID, IsShipping, Line1, Line2, Line3, City, State, Zip)
        SELECT
            O.ID as OrderID,
            1 AS IsShipping,
            PA.Line1,
            PA.Line2,
            PA.Line3,
            PA.City,
            PA.State,
            PA.Zip
        FROM Orders AS O
        CROSS APPLY dbo.ParseAddress(O.ShippingAddress) AS PA
        WHERE O.ShippingAddress IS NOT NULL AND LEN(O.ShippingAddress) > 0;

        INSERT INTO #ParsedAddresses (OrderID, IsShipping, Line1, Line2, Line3, City, State, Zip)
        SELECT
            O.ID as OrderID,
            0 AS IsShipping,
            PA.Line1,
            PA.Line2,
            PA.Line3,
            PA.City,
            PA.State,
            PA.Zip
        FROM Orders AS O
        CROSS APPLY dbo.ParseAddress(O.BillingAddress) AS PA
        WHERE O.BillingAddress IS NOT NULL AND LEN(O.BillingAddress) > 0;


        -- 1. Insert distinct addresses into the permanent Addresses table.
        CREATE TABLE #NewAddresses (
            NewAddressID INT,
            Line1 NVARCHAR(MAX),
            Line2 NVARCHAR(MAX),
            Line3 NVARCHAR(MAX),
            City NVARCHAR(MAX),
            State NVARCHAR(MAX),
            Country NVARCHAR(MAX),
            Zip NVARCHAR(MAX)
        );

        INSERT INTO Addresses (Line1, Line2, Line3, City, State, Country, Zip)
        OUTPUT inserted.ID, inserted.Line1, inserted.Line2, inserted.Line3, inserted.City, inserted.State, inserted.Country, inserted.Zip
        INTO #NewAddresses
        SELECT DISTINCT Line1, Line2, Line3, City, State, 'Australia', Zip
        FROM #ParsedAddresses;

        -- 2. Create the mapping table by joining the temporary tables.
        CREATE TABLE #AddressIDMap (
            OriginalOrderID INT,
            IsShipping BIT,
            NewAddressID INT
        );

        INSERT INTO #AddressIDMap (OriginalOrderID, IsShipping, NewAddressID)
        SELECT
            pa.OrderID,
            pa.IsShipping,
            na.NewAddressID
        FROM #ParsedAddresses AS pa
        JOIN #NewAddresses AS na ON
            pa.Line1 = na.Line1 AND
            ISNULL(pa.Line2, '') = ISNULL(na.Line2, '') AND
            ISNULL(pa.Line3, '') = ISNULL(na.Line3, '') AND
            pa.City = na.City AND
            pa.State = na.State AND
            pa.Zip = na.Zip;

        -- 3. Update the Orders table with the new foreign keys.
        UPDATE O
        SET
            O.ShipAddressID = CASE WHEN M.IsShipping = 1 THEN M.NewAddressID ELSE O.ShipAddressID END,
            O.BillAddressID = CASE WHEN M.IsShipping = 0 THEN M.NewAddressID ELSE O.BillAddressID END
        FROM Orders AS O
        JOIN #AddressIDMap AS M ON O.ID = M.OriginalOrderID;

        -- 4. Clean up the temporary tables.
        DROP TABLE #ParsedAddresses;
        DROP TABLE #AddressIDMap;
        DROP TABLE #NewAddresses;


        DECLARE @var sysname;
        SELECT @var = [d].[name]
        FROM [sys].[default_constraints] [d]
        INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
        WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Orders]') AND [c].[name] = N'BillingAddress');
        IF @var IS NOT NULL EXEC(N'ALTER TABLE [Orders] DROP CONSTRAINT [' + @var + '];');
        ALTER TABLE [Orders] DROP COLUMN [BillingAddress];

        DECLARE @var1 sysname;
        SELECT @var1 = [d].[name]
        FROM [sys].[default_constraints] [d]
        INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
        WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Orders]') AND [c].[name] = N'ShippingAddress');
        IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Orders] DROP CONSTRAINT [' + @var1 + '];');
        ALTER TABLE [Orders] DROP COLUMN [ShippingAddress];

        -- DONT DO THIS. It is done automatically by EF Core.
        --INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
        --VALUES (N'20250902083010_OrderHasAddress', N'9.0.6');

        IF @@ERROR <> 0
        BEGIN
            ROLLBACK TRANSACTION;
        END
        ELSE
        BEGIN
            COMMIT TRANSACTION;
        END
            ";
      migrationBuilder.Sql(sql);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      // Step 6: Restore the old string columns to Orders table.
      migrationBuilder.AddColumn<string>(name: "BillingAddress", table: "Orders", type: "nvarchar(max)", nullable: true);
      migrationBuilder.AddColumn<string>(name: "ShippingAddress", table: "Orders", type: "nvarchar(max)", nullable: true);

      // Step 5: Reconstruct the original address strings using SQL.
      string sql = @"
                -- Reconstruct the ShippingAddress and BillingAddress strings.
                -- We use a LEFT JOIN to ensure the query works even if an Order has no associated address.
                UPDATE O
                SET
                    -- CONCAT_WS is used for a cleaner join with a separator, ignoring nulls.
                    -- This ensures that if a line is null, it won't add an extra comma.
                    O.ShippingAddress = CONCAT_WS(', ', A_Ship.Line1, A_Ship.Line2, A_Ship.Line3, A_Ship.City, A_Ship.State, A_Ship.Zip),
                    O.BillingAddress = CONCAT_WS(', ', A_Bill.Line1, A_Bill.Line2, A_Bill.Line3, A_Bill.City, A_Bill.State, A_Bill.Zip)
                FROM Orders AS O
                LEFT JOIN Addresses AS A_Ship ON O.ShipAddressID = A_Ship.ID
                LEFT JOIN Addresses AS A_Bill ON O.BillAddressID = A_Bill.ID;
            ";
      migrationBuilder.Sql(sql);

      // Step 4: Delete the foreign key constraint that we created in Step 4.
      migrationBuilder.DropForeignKey(name: "FK_Orders_Addresses_BillAddressID", table: "Orders");
      migrationBuilder.DropForeignKey(name: "FK_Orders_Addresses_ShipAddressID", table: "Orders");

      // Step 2: Drop the table "Addresses" that we created in Step 2.
      migrationBuilder.DropTable(name: "Addresses");

      // Step 3: Drop the index on the XxxxAddressID column of Orders table that we created in Step 3
      migrationBuilder.DropIndex(name: "IX_Orders_BillAddressID", table: "Orders");
      migrationBuilder.DropIndex(name: "IX_Orders_ShipAddressID", table: "Orders");

      // Step 1: Remove the XxxxAddressID column that we added in Step 1
      migrationBuilder.DropColumn(name: "BillAddressID", table: "Orders");
      migrationBuilder.DropColumn(name: "ShipAddressID", table: "Orders");
    }
  }
}
