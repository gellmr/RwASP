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
          });

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

      // Step 5: Transform data using SQL. Parse and insert the data.
      string sql = @"
                -- Create a temporary table to hold parsed addresses before inserting them into the Addresses table.
                -- This allows us to handle both Billing and Shipping addresses in one pass.
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

                -- Insert parsed Shipping addresses into the temporary table.
                -- This logic parses from right to left, which is more reliable for addresses.
                INSERT INTO #ParsedAddresses (OrderID, IsShipping, Line1, Line2, Line3, City, State, Zip)
                SELECT
                    ID as OrderID,
                    1, -- This flag indicates a shipping address
                    -- Line1: This is the first segment of the address string.
                    CASE
                        -- Case where there are at least two address lines
                        WHEN CHARINDEX(',', ShippingAddress, CHARINDEX(',', ShippingAddress) + 1) > 0 THEN TRIM(SUBSTRING(ShippingAddress, 1, CHARINDEX(',', ShippingAddress) - 1))
                        -- Case where there is only one address line before the City/State/Zip
                        ELSE TRIM(SUBSTRING(ShippingAddress, 1, LEN(ShippingAddress) - CHARINDEX(',', REVERSE(ShippingAddress)) - CHARINDEX(' ', REVERSE(SUBSTRING(ShippingAddress, 1, LEN(ShippingAddress) - CHARINDEX(',', REVERSE(ShippingAddress)))))))
                    END,
                    -- Line2: The second segment of the address string.
                    CASE
                        WHEN CHARINDEX(',', ShippingAddress, CHARINDEX(',', ShippingAddress) + 1) > 0 THEN TRIM(SUBSTRING(ShippingAddress, CHARINDEX(',', ShippingAddress) + 1, CHARINDEX(',', ShippingAddress, CHARINDEX(',', ShippingAddress) + 1) - CHARINDEX(',', ShippingAddress) - 1))
                        ELSE NULL
                    END,
                    -- Line3: Combines the third and any subsequent segments.
                    CASE
                        WHEN CHARINDEX(',', ShippingAddress, CHARINDEX(',', ShippingAddress, CHARINDEX(',', ShippingAddress, CHARINDEX(',', ShippingAddress) + 1) + 1)) > 0 THEN TRIM(SUBSTRING(ShippingAddress, CHARINDEX(',', ShippingAddress, CHARINDEX(',', ShippingAddress) + 1) + 1, LEN(ShippingAddress) - CHARINDEX(',', REVERSE(ShippingAddress)) - (CHARINDEX(',', ShippingAddress, CHARINDEX(',', ShippingAddress) + 1) + 1)))
                        ELSE NULL
                    END,
                    -- City: The part before the State/Zip code.
                    TRIM(SUBSTRING(ShippingAddress, LEN(ShippingAddress) - CHARINDEX(' ', REVERSE(ShippingAddress), CHARINDEX(' ', REVERSE(ShippingAddress), LEN(ShippingAddress) - CHARINDEX(',', REVERSE(ShippingAddress)) - CHARINDEX(' ', REVERSE(SUBSTRING(ShippingAddress, 1, LEN(ShippingAddress) - CHARINDEX(',', REVERSE(ShippingAddress))))))) + 1, LEN(ShippingAddress) - CHARINDEX(' ', REVERSE(ShippingAddress)) - (LEN(ShippingAddress) - CHARINDEX(' ', REVERSE(ShippingAddress), CHARINDEX(' ', REVERSE(ShippingAddress), LEN(ShippingAddress) - CHARINDEX(',', REVERSE(ShippingAddress)) - CHARINDEX(' ', REVERSE(SUBSTRING(ShippingAddress, 1, LEN(ShippingAddress) - CHARINDEX(',', REVERSE(ShippingAddress))))))) + 1))),
                    -- State: The two-letter code before the Zip.
                    TRIM(SUBSTRING(ShippingAddress, LEN(ShippingAddress) - CHARINDEX(' ', REVERSE(ShippingAddress)) + 2, CHARINDEX(' ', REVERSE(ShippingAddress)) - 1)),
                    -- Zip: The last 4 digits after the last space.
                    TRIM(RIGHT(ShippingAddress, 4))
                FROM Orders
                WHERE ShippingAddress IS NOT NULL AND LEN(ShippingAddress) > 0;

                -- Insert parsed Billing addresses into the temporary table.
                -- This logic is identical to the shipping address parsing.
                INSERT INTO #ParsedAddresses (OrderID, IsShipping, Line1, Line2, Line3, City, State, Zip)
                SELECT
                    ID as OrderID,
                    0, -- This flag indicates a billing address
                    CASE
                        WHEN CHARINDEX(',', BillingAddress, CHARINDEX(',', BillingAddress) + 1) > 0 THEN TRIM(SUBSTRING(BillingAddress, 1, CHARINDEX(',', BillingAddress) - 1))
                        ELSE TRIM(SUBSTRING(BillingAddress, 1, LEN(BillingAddress) - CHARINDEX(',', REVERSE(BillingAddress)) - CHARINDEX(' ', REVERSE(SUBSTRING(BillingAddress, 1, LEN(BillingAddress) - CHARINDEX(',', REVERSE(BillingAddress)))))))
                    END,
                    CASE
                        WHEN CHARINDEX(',', BillingAddress, CHARINDEX(',', BillingAddress) + 1) > 0 THEN TRIM(SUBSTRING(BillingAddress, CHARINDEX(',', BillingAddress) + 1, CHARINDEX(',', BillingAddress, CHARINDEX(',', BillingAddress) + 1) - CHARINDEX(',', BillingAddress) - 1))
                        ELSE NULL
                    END,
                    CASE
                        WHEN CHARINDEX(',', BillingAddress, CHARINDEX(',', BillingAddress, CHARINDEX(',', BillingAddress, CHARINDEX(',', BillingAddress) + 1) + 1)) > 0 THEN TRIM(SUBSTRING(BillingAddress, CHARINDEX(',', BillingAddress, CHARINDEX(',', BillingAddress) + 1) + 1, LEN(BillingAddress) - CHARINDEX(',', REVERSE(BillingAddress)) - (CHARINDEX(',', BillingAddress, CHARINDEX(',', BillingAddress) + 1) + 1)))
                        ELSE NULL
                    END,
                    TRIM(SUBSTRING(BillingAddress, LEN(BillingAddress) - CHARINDEX(' ', REVERSE(BillingAddress), CHARINDEX(' ', REVERSE(BillingAddress), LEN(BillingAddress) - CHARINDEX(',', REVERSE(BillingAddress)) - CHARINDEX(' ', REVERSE(SUBSTRING(BillingAddress, 1, LEN(BillingAddress) - CHARINDEX(',', REVERSE(BillingAddress))))))) + 1, LEN(BillingAddress) - CHARINDEX(' ', REVERSE(BillingAddress)) - (LEN(BillingAddress) - CHARINDEX(' ', REVERSE(BillingAddress), CHARINDEX(' ', REVERSE(BillingAddress), LEN(BillingAddress) - CHARINDEX(',', REVERSE(BillingAddress)) - CHARINDEX(' ', REVERSE(SUBSTRING(BillingAddress, 1, LEN(BillingAddress) - CHARINDEX(',', REVERSE(BillingAddress))))))) + 1))),
                    TRIM(SUBSTRING(BillingAddress, LEN(BillingAddress) - CHARINDEX(' ', REVERSE(BillingAddress)) + 2, CHARINDEX(' ', REVERSE(BillingAddress)) - 1)),
                    TRIM(RIGHT(BillingAddress, 4))
                FROM Orders
                WHERE BillingAddress IS NOT NULL AND LEN(BillingAddress) > 0;

                -- Insert distinct addresses from the temporary table into the permanent Addresses table.
                -- We use a second temporary table to map the original OrderID to the new AddressID.
                CREATE TABLE #AddressIDMap (
                    OriginalOrderID INT,
                    IsShipping BIT,
                    NewAddressID INT
                );
                
                INSERT INTO Addresses (Line1, Line2, Line3, City, State, Country, Zip)
                OUTPUT T.OrderID, T.IsShipping, inserted.ID
                INTO #AddressIDMap
                SELECT DISTINCT
                    Line1, Line2, Line3, City, State, 'Australia', Zip
                FROM #ParsedAddresses AS T;

                -- Update the Orders table with the new foreign keys.
                -- We use the #AddressIDMap to ensure each Order is updated with its correct new address ID.
                UPDATE O
                SET
                    O.ShipAddressID = CASE WHEN M.IsShipping = 1 THEN M.NewAddressID ELSE O.ShipAddressID END,
                    O.BillAddressID = CASE WHEN M.IsShipping = 0 THEN M.NewAddressID ELSE O.BillAddressID END
                FROM Orders AS O
                JOIN #AddressIDMap AS M ON O.OrderID = M.OriginalOrderID;

                -- Clean up the temporary tables.
                DROP TABLE #ParsedAddresses;
                DROP TABLE #AddressIDMap;
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
