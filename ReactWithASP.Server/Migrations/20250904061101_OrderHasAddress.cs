using Microsoft.EntityFrameworkCore.Migrations;
#nullable disable
namespace ReactWithASP.Server.Migrations
{
  public partial class OrderHasAddress : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      // Step 1: Add new columns, named "ShipAddressID" and "BillAddressID" to Orders table. Column type is nullable int.
      migrationBuilder.AddColumn<int>(name: "BillAddressID", table: "Orders", type: "int", nullable: true);
      migrationBuilder.AddColumn<int>(name: "ShipAddressID", table: "Orders", type: "int", nullable: true);

      // Step 2: Create a new table named "Addresses"
      migrationBuilder.CreateTable(
        name: "Addresses",
        columns: table => new
        {
          ID = table.Column<int>(type: "int", nullable: false).Annotation("SqlServer:Identity", "111, 1"),
          Line1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
          Line2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
          Line3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
          City = table.Column<string>(type: "nvarchar(max)", nullable: false),
          State = table.Column<string>(type: "nvarchar(max)", nullable: false),
          Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
          Zip = table.Column<string>(type: "nvarchar(max)", nullable: false)
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Addresses", x => x.ID); // Use ID column as primary key for this table.
        }
      );

      // Step 3: Create an index, on the ShipAddressID and BillAddressID columns of Orders table.
      migrationBuilder.CreateIndex(name: "IX_Orders_BillAddressID", table: "Orders", column: "BillAddressID");
      migrationBuilder.CreateIndex(name: "IX_Orders_ShipAddressID", table: "Orders", column: "ShipAddressID");

      // Step 4: Create foreign key constraints.
      migrationBuilder.AddForeignKey(
          name: "FK_Orders_Addresses_BillAddressID", // Orders.BillAddressID *---1 Addresses.ID
          table: "Orders",                // Dependent table. This will have the foreign key column.
          column: "BillAddressID",        // This is the name of the foreign key column we are creating in Orders table.
          principalTable: "Addresses",    // Principal table, which the foreign key column refers to.
          principalColumn: "ID");         // Primary key which the foreign key column refers to.
      migrationBuilder.AddForeignKey(
          name: "FK_Orders_Addresses_ShipAddressID", // Orders.ShipAddressID *---1 Addresses.ID
          table: "Orders",                // Dependent table. This will have the foreign key column.
          column: "ShipAddressID",        // This is the name of the foreign key column we are creating in Orders table.
          principalTable: "Addresses",    // Principal table, which the foreign key column refers to.
          principalColumn: "ID");         // Primary key which the foreign key column refers to.

      /*
      These manual steps must be performed before you try to execute this migration (OrderHasAddress).
      
      (Manual steps)

      fn_ParseAddressLine1 etc below are compiled UDF functions from a separate class library project that is compiled to a dll and registered with SQL Server.

      You need to place the AddressParser.dll in a location that can be read by SQL Server.
      For example, C:\db-backups
      
      You need to tell SQL Server to trust the dll. First get the hash value of the dll using this Powershell command:
      (Get-FileHash -Path "./AddressParser.dll" -Algorithm SHA512).Hash | Out-File "OutputFile.txt"

      This results in a hash value in "OutputFile.txt" eg E4754563...5E3B24F3

      Now go into SQL Server and run the following SQL statement. This tells SQL Server to trust the dll.
      Note you must add 0x to the start of the hash.

      -- EXEC sp_add_trusted_assembly
      --   @hash = 0xE4754563...5E3B24F3,
      --   @description = N'AddressParser';

      Note - you must also have CLR integration enabled on your database. This only needs to be done once. Execute the following SQL:
      -- EXEC sp_configure 'clr enabled', 1;
      -- RECONFIGURE;

      (End of manual steps)

      Now you should be able to execute this migration which includes the SQL statements below.
      These call the UDF functions we have enabled.
       */

      // Step 5: Transform data using SQL. Parse and insert the data.
      string sql = @"
        -- SQL to create the UDFs.

        -- Drop existing functions and assembly if they exist
        IF OBJECT_ID('dbo.fn_ParseAddressZip') IS NOT NULL DROP FUNCTION dbo.fn_ParseAddressZip;
        IF OBJECT_ID('dbo.fn_ParseAddressState') IS NOT NULL DROP FUNCTION dbo.fn_ParseAddressState;
        IF OBJECT_ID('dbo.fn_ParseAddressCity') IS NOT NULL DROP FUNCTION dbo.fn_ParseAddressCity;
        IF OBJECT_ID('dbo.fn_ParseAddressLine3') IS NOT NULL DROP FUNCTION dbo.fn_ParseAddressLine3;
        IF OBJECT_ID('dbo.fn_ParseAddressLine2') IS NOT NULL DROP FUNCTION dbo.fn_ParseAddressLine2;
        IF OBJECT_ID('dbo.fn_ParseAddressLine1') IS NOT NULL DROP FUNCTION dbo.fn_ParseAddressLine1;
        IF EXISTS(SELECT 1 FROM sys.assemblies WHERE name = 'AddressParser') DROP ASSEMBLY AddressParser;
        GO

        -- Create the new assembly from the compiled C# DLL. Note, the DLL must be compiled in release mode.
        CREATE ASSEMBLY AddressParser
        FROM 'C:\db-backups\AddressParser.dll'
        WITH PERMISSION_SET = SAFE;
        GO

        -- Create the SQL User-Defined Functions for each C# method
        CREATE FUNCTION dbo.fn_ParseAddressLine1(@address NVARCHAR(MAX))
        RETURNS NVARCHAR(MAX)
        AS EXTERNAL NAME AddressParser.AddressParser.ParseLine1;
        GO

        CREATE FUNCTION dbo.fn_ParseAddressLine2(@address NVARCHAR(MAX))
        RETURNS NVARCHAR(MAX)
        AS EXTERNAL NAME AddressParser.AddressParser.ParseLine2;
        GO

        CREATE FUNCTION dbo.fn_ParseAddressLine3(@address NVARCHAR(MAX))
        RETURNS NVARCHAR(MAX)
        AS EXTERNAL NAME AddressParser.AddressParser.ParseLine3;
        GO

        CREATE FUNCTION dbo.fn_ParseAddressCity(@address NVARCHAR(MAX))
        RETURNS NVARCHAR(MAX)
        AS EXTERNAL NAME AddressParser.AddressParser.ParseCity;
        GO

        CREATE FUNCTION dbo.fn_ParseAddressState(@address NVARCHAR(MAX))
        RETURNS NVARCHAR(MAX)
        AS EXTERNAL NAME AddressParser.AddressParser.ParseState;
        GO

        CREATE FUNCTION dbo.fn_ParseAddressZip(@address NVARCHAR(MAX))
        RETURNS NVARCHAR(MAX)
        AS EXTERNAL NAME AddressParser.AddressParser.ParseZip;
        GO

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

        -- Insert parsed Shipping addresses into the temporary table using the CLR functions.
        -- We use the scalar UDFs to call the C# regex logic for each address component.
        INSERT INTO #ParsedAddresses (OrderID, IsShipping, Line1, Line2, Line3, City, State, Zip)
        SELECT
            O.ID as OrderID,
            1 AS IsShipping,
            dbo.fn_ParseAddressLine1(O.ShippingAddress),
            dbo.fn_ParseAddressLine2(O.ShippingAddress),
            dbo.fn_ParseAddressLine3(O.ShippingAddress),
            dbo.fn_ParseAddressCity(O.ShippingAddress),
            dbo.fn_ParseAddressState(O.ShippingAddress),
            dbo.fn_ParseAddressZip(O.ShippingAddress)
        FROM Orders AS O
        WHERE dbo.fn_ParseAddressLine1(O.ShippingAddress) IS NOT NULL;

        -- Insert parsed Billing addresses into the temporary table using the CLR functions.
        INSERT INTO #ParsedAddresses (OrderID, IsShipping, Line1, Line2, Line3, City, State, Zip)
        SELECT
            O.ID as OrderID,
            0 AS IsShipping,
            dbo.fn_ParseAddressLine1(O.BillingAddress),
            dbo.fn_ParseAddressLine2(O.BillingAddress),
            dbo.fn_ParseAddressLine3(O.BillingAddress),
            dbo.fn_ParseAddressCity(O.BillingAddress),
            dbo.fn_ParseAddressState(O.BillingAddress),
            dbo.fn_ParseAddressZip(O.BillingAddress)
        FROM Orders AS O
        WHERE dbo.fn_ParseAddressLine1(O.BillingAddress) IS NOT NULL;

        -- Insert distinct addresses into the permanent Addresses table and get the new IDs.
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

        -- Create the mapping table by joining the temporary tables.
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

        -- Update the Orders table with the new foreign keys.
        UPDATE O
        SET
            O.ShipAddressID = CASE WHEN M.IsShipping = 1 THEN M.NewAddressID ELSE O.ShipAddressID END,
            O.BillAddressID = CASE WHEN M.IsShipping = 0 THEN M.NewAddressID ELSE O.BillAddressID END
        FROM Orders AS O
        JOIN #AddressIDMap AS M ON O.ID = M.OriginalOrderID;

        -- Update the discriminator column for all successfully migrated orders.
        UPDATE O
        SET O.OrderType = 'OrderV2'
        FROM Orders AS O
        WHERE O.ShipAddressID IS NOT NULL OR O.BillAddressID IS NOT NULL;

        -- Clean up the temporary tables.
        DROP TABLE #ParsedAddresses;
        DROP TABLE #AddressIDMap;
        DROP TABLE #NewAddresses;
        ";
      migrationBuilder.Sql(sql);

      // Step 6: Drop the old string columns from Orders table.
      migrationBuilder.DropColumn(name: "BillingAddress", table: "Orders");
      migrationBuilder.DropColumn(name: "ShippingAddress", table: "Orders");
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
                    O.BillingAddress = CONCAT_WS(', ', A_Bill.Line1, A_Bill.Line2, A_Bill.Line3, A_Bill.City, A_Bill.State, A_Bill.Zip),
                    O.OrderType = 'OrderV1'
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
