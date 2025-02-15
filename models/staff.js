const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Staff {
  constructor(staffid, staffname, email, role, hashedPassword) {
    this.staffid = staffid;
    this.staffname = staffname;
    this.email = email;
    this.role = role;
    this.hashedPassword = hashedPassword;
  }

  static async getAllStaffs() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Staffs`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Staff(row.staffid, row.staffname, row.email, row.role)
    ); // Convert rows to Staff
  }

  static async getStaffByStaffId(staffid) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Staffs WHERE staffid = @staffid`; // Parameterized query

    const request = connection.request();
    request.input("staffid", staffid);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Staff(
          result.recordset[0].staffid,
          result.recordset[0].staffname,
          result.recordset[0].email,
          result.recordset[0].role
        )
      : null; // Handle Staff not found
  }

  static async createStaff(newStaffData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Staffs (staffid, staffname,email,role, hashedPassword) VALUES (@staffid, @staffname,@email, @role, @hashedPassword); `;

    const request = connection.request();
    request.input("staffid", newStaffData.staffid);
    request.input("staffname", newStaffData.staffname);
    request.input("email", newStaffData.email);
    request.input("role", newStaffData.role);
    request.input("hashedPassword", newStaffData.hashedPassword);

    await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created Staff using its staff id
    return this.getStaffByStaffId(newStaffData.staffid);
  }

  static async updateStaff(staffid, newStaffData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Staffs SET staffname = @staffname, email = @email, role =@role, @hashedPassword WHERE staffid = @staffid`; // Parameterized query

    const request = connection.request();
    request.input("staffid", staffid);
    request.input("staffname", newStaffData.staffname || null); // Handle optional fields
    request.input("email", newStaffData.email || null);
    request.input("role", newStaffData.role || null);
    request.input("hashedPassword", newStaffData.hashedPassword || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getStaffByStaffId(staffid); // returning the updated staff data
  }

  static async deleteStaff(staffid) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Staffs WHERE staffid = @staffid`; // Parameterized query

    const request = connection.request();
    request.input("staffid", staffid);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }

  static async getStaffByStaffname(staffname) {
    const connection = await sql.connect(dbConfig);

    try {
      const sqlQuery = `SELECT * FROM Staffs WHERE staffname = @staffname`;
      const request = connection.request();
      request.input("staffname", staffname);
      const result = await request.query(sqlQuery);

      return result.recordset[0];
    } catch (error) {
      throw new Error("Error searching staffs"); // Or handle error differently
    } finally {
      await connection.close(); // Close connection even on errors
    }
  }
}

module.exports = Staff;
