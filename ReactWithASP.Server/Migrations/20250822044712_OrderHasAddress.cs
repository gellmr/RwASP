using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactWithASP.Server.Migrations
{
  /// <inheritdoc />
  public partial class OrderHasAddress : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      // Step 1
      // Add new columns, named "ShipAddressID" and "BillAddressID" to Orders table. Column type is nullable int.
      migrationBuilder.AddColumn<int>(name: "BillAddressID", table: "Orders", type: "int", nullable: true);
      migrationBuilder.AddColumn<int>(name: "ShipAddressID", table: "Orders", type: "int", nullable: true);

      // Step 2
      // Create a new table named "Addresses"
      migrationBuilder.CreateTable(
        name: "Addresses",
        columns: table => new
        {
          ID = table.Column<int>(type: "int", nullable: false)
            .Annotation("SqlServer:Identity", "111, 1"),
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

      // Step 3
      // Create an index, on the ShipAddressID and BillAddressID columns of Orders table. Makes foreign key lookups faster.
      migrationBuilder.CreateIndex(name: "IX_Orders_BillAddressID", table: "Orders", column: "BillAddressID");
      migrationBuilder.CreateIndex(name: "IX_Orders_ShipAddressID", table: "Orders", column: "ShipAddressID");

      // Step 4
      // ----------------------------------------------------------------
      // Create Orders.ShipAddressID column, which refers to Addresses.ID
      // Create Orders.BillAddressID column, which refers to Addresses.ID
      // ----------------------------------------------------------------
      // Here we create a foreign key, which by default establishes *---1 relationship.
      // This constraint enforces that if a value exists in Orders.XxxxAddressID column, it must exist also in the Addresses.ID column.
      // This constraint enforces Orders *---1 Address (but does not create or enforce Address 1---* Order)
      // ...to do that we must code EF Core model in our context class with fluent api.

      migrationBuilder.AddForeignKey(
        name: "FK_Orders_Addresses_BillAddressID", // Orders.BillAddressID *---1 Addresses.ID
        table: "Orders",           // Dependent table. This will have the foreign key column.
        column: "BillAddressID",   // This is the name of the foreign key column we are creating in Orders table.
        principalTable: "Addresses",  // Principal table, which the foreign key column refers to.
        principalColumn: "ID");       // Primary key which the foreign key column refers to.

      migrationBuilder.AddForeignKey(
        name: "FK_Orders_Addresses_ShipAddressID", // Orders.ShipAddressID *---1 Addresses.ID
        table: "Orders",           // Dependent table. This will have the foreign key column.
        column: "ShipAddressID",   // This is the name of the foreign key column we are creating in Orders table.
        principalTable: "Addresses",  // Principal table, which the foreign key column refers to.
        principalColumn: "ID");       // Primary key which the foreign key column refers to.
    }

    /// <inheritdoc />

    // ------------------------------------------------------------------------------------
    // Performs the following actions in *** reverse order of the Up method's creation...
    // ------------------------------------------------------------------------------------
    //  *** Down is performed in reverse order of dependency, not in strict reverse order.
    //    Delete the foreign key constraint from Step 4.
    //    Delete the entire Addresses table from Step 2.
    //    Remove the index from Step 3.
    //    Delete the XxxxAddressID column from the Orders table from Step 1.
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      // Delete the foreign key constraint that we created in Step 4.
      migrationBuilder.DropForeignKey(name: "FK_Orders_Addresses_BillAddressID", table: "Orders");
      migrationBuilder.DropForeignKey(name: "FK_Orders_Addresses_ShipAddressID", table: "Orders");

      // With the foreign key constraint gone, the Addresses table is not 
      // being referenced by anything and we can safely drop the table.
      // We COULD drop the IX_Orders_XxxxAddressID index of Orders first if we wanted to.
      // Drop the table "Addresses" that we created in Step 2
      migrationBuilder.DropTable(name: "Addresses");

      // The index is an optimisation of Orders.XxxxAddressID. So we will drop it first.
      // You CAN sometimes drop the column and then its index, but dropping the index first
      // is common practice.
      // Remove the index on the XxxxAddressID column of Orders table that we created in Step 3
      migrationBuilder.DropIndex(name: "IX_Orders_BillAddressID", table: "Orders");
      migrationBuilder.DropIndex(name: "IX_Orders_ShipAddressID", table: "Orders");

      // Now we will drop the column itself.
      // Remove the XxxxAddressID column that we added in Step 1
      migrationBuilder.DropColumn(name: "BillAddressID", table: "Orders");
      migrationBuilder.DropColumn(name: "ShipAddressID", table: "Orders");
    }
  }
}
