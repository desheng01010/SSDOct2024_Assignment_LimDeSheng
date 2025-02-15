const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Building {
  constructor(buildingcode, buildingname, address) {
    this.buildingcode = buildingcode;
    this.buildingname = buildingname;
    this.address = address;
  }

  static async getAllBuildings() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Buildings`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Building(row.buildingcode, row.buildingname, row.address)
    ); // Convert rows to Building objects
  }

  static async getBuildingByBuildingCode(buildingcode) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Buildings WHERE buildingcode = @buildingcode`; // Parameterized query

    const request = connection.request();
    request.input("buildingcode", buildingcode);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Building(
          result.recordset[0].buildingcode,
          result.recordset[0].buildingname,
          result.recordset[0].address
        )
      : null; // Handle Building not found
  }

  static async createBuilding(newBuildingData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Buildings (buildingcode, buildingname, address) VALUES (@buildingcode,@buildingname, @address);`;

    const request = connection.request();
    request.input("buildingcode", newBuildingData.buildingcode);
    request.input("buildingname", newBuildingData.buildingname);
    request.input("address", newBuildingData.address);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created building using its building code
    return this.getBuildingByBuildingCode(newBuildingData.buildingcode);
  }

  static async updateBuilding(buildingcode, newBuildingData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Buildings SET buildingname = @buildingname, address = @address WHERE buildingcode = @buildingcode`; // Parameterized query

    const request = connection.request();
    request.input("buildingcode", buildingcode);
    request.input("buildingname", newBuildingData.buildingname || null); // Handle optional fields
    request.input("address", newBuildingData.address || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getBuildingByBuildingCode(buildingcode); // returning the updated building data
  }

  static async deleteBuilding(buildingcode) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Buildings WHERE buildingcode = @buildingcode`; // Parameterized query

    const request = connection.request();
    request.input("buildingcode", buildingcode);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = Building;
