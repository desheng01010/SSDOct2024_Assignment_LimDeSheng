const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Legend {
  constructor(legendcode, description) {
    this.legendcode = legendcode;
    this.description = description;
  }

  static async getAllLegends() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Legends`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Legend(row.legendcode, row.description)
    ); // Convert rows to Legend objects
  }

  static async getLegendByLegendCode(legendcode) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Legends WHERE legendcode = @legendcode`; // Parameterized query

    const request = connection.request();
    request.input("legendcode", legendcode);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Legend(
          result.recordset[0].legendcode,
          result.recordset[0].description
        )
      : null; // Handle Legend not found
  }

  static async createLegend(newLegendData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Legends (description) VALUES (@description); SELECT SCOPE_IDENTITY() AS legendcode;`; // Retrieve legendcode of inserted record

    const request = connection.request();
    request.input("description", newLegendData.description);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created legend using its legend code
    return this.getLegendByLegendCode(result.recordset[0].legendcode);
  }

  static async updateLegend(legendcode, newLegendData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Legends SET description = @description WHERE legendcode = @legendcode`; // Parameterized query

    const request = connection.request();
    request.input("legendcode", legendcode);
    request.input("description", newLegendData.description || null); // Handle optional fields

    await request.query(sqlQuery);

    connection.close();

    return this.getLegendByLegendCode(legendcode); // returning the updated legend data
  }

  static async deleteLegend(legendcode) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Legends WHERE legendcode = @legendcode`; // Parameterized query

    const request = connection.request();
    request.input("legendcode", legendcode);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = Legend;
