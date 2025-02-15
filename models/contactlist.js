const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Contactlist {
  constructor(landlordid, buildingcode, landlordname, contactno, email) {
    this.landlordid = landlordid;
    this.buildingcode = buildingcode;
    this.landlordname = landlordname;
    this.contactno = contactno;
    this.email = email;
  }

  static async getAllContactlists() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM ContactLists`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Contactlist(
          row.landlordid,
          row.buildingcode,
          row.landlordname,
          row.conntactno,
          row.email
        )
    ); // Convert rows to Contact objects
  }

  static async getContactByLandlordId(landlordid) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM ContactLists WHERE landlordid = @landlordid`; // Parameterized query

    const request = connection.request();
    request.input("landlordid", landlordid);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Contactlist(
          result.recordset[0].landlordid,
          result.recordset[0].buildingcode,
          result.recordset[0].landlordname,
          result.recordset[0].contactno,
          result.recordset[0].email
        )
      : null; // Handle Contact not found
  }

  static async createContactlist(newContactlistData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO ContactLists (landlordid,buildingcode, landlordname, contactno, email) VALUES (@landlordid,@buildingcode, @landlordname, @contactno, @email);`;

    const request = connection.request();
    request.input("landlordid", newContactlistData.landlordid);
    request.input("buildingcode", newContactlistData.buildingcode);
    request.input("landlordname", newContactlistData.landlordname);
    request.input("contactno", newContactlistData.conntactno);
    request.input("email", newContactlistData.email);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getContactByLandlordId(newContactlistData.landlordid);
  }

  static async updateContactlist(landlordid, newContactlistData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE ContactLists SET buildingcode = @buildingcode, landlordname = @landlordname, contactno = @contactno, email = @email WHERE landlordid = @landlordid`; // Parameterized query

    const request = connection.request();
    request.input("landlordid", landlordid);
    request.input("buildingcode", newContactlistData.buildingcode || null); // Handle optional fields
    request.input("lanlordname", newContactlistData.landlordname || null);
    request.input("contactno", newContactlistData.contactno || null);
    request.input("email", newContactlistData.email || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getContactByLandlordId(landlordid); // returning the updated contact data
  }

  static async deleteContactlist(landlordid) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM ContactLists WHERE landlordid = @landlordid`; // Parameterized query

    const request = connection.request();
    request.input("landlordid", landlordid);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = Contactlist;
