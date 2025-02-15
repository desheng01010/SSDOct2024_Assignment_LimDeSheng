const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Quotation {
  constructor(
    quotationno,
    legendcode,
    buildingcode,
    jobdescription,
    quotationdate,
    amount
  ) {
    this.quotationno = quotationno;
    this.legendcode = legendcode;
    this.buildingcode = buildingcode;
    this.jobdescription = jobdescription;
    this.quotationdate = quotationdate;
    this.amount = amount;
  }

  static async getAllQuotations() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Quotations`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Quotation(
          row.quotationno,
          row.legendcode,
          row.buildingcode,
          row.jobdescription,
          row.quotationdate,
          row.amount
        )
    ); // Convert rows to quotation objects
  }

  static async getQuotationByQuotationNo(quotationno) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Quotations WHERE quotationno = @quotationno`; // Parameterized query

    const request = connection.request();
    request.input("quotationno", quotationno);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Quotation(
          result.recordset[0].quotationno,
          result.recordset[0].legendcode,
          result.recordset[0].buildingcode,
          result.recordset[0].jobdescription,
          result.recordset[0].quotationdate,
          result.recordset[0].amount
        )
      : null; // Handle Contact not found
  }

  static async createQuotation(newQuotationData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Quotations (quotationno,legendcode, buildingcode, jobdescription, quotationdate, amount) VALUES (@quotationno, @legendcode, @buildingcode, @jobdescription, @quotationdate, @amount);`;

    const request = connection.request();
    request.input("quotationno", newQuotationData.quotationno);
    request.input("legendcode", newQuotationData.legendcode);
    request.input("buildingcode", newQuotationData.buildingcode);
    request.input("jobdescription", newQuotationData.jobdescription);
    request.input("quotationdate", newQuotationData.quotationdate);
    request.input("amount", newQuotationData.amount);

    await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created quotation using its quotation id
    return this.getQuotationByQuotationNo(newQuotationData.quotationno);
  }

  static async updateQuotation(quotationno, newQuotationData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Quotations SET legendcode = @legendcode, buildingcode = @buildingcode, jobdescription = @jobdescription, quotationdate = @quotationdate, amount = @amount WHERE quotationno = @quotationno`; // Parameterized query

    const request = connection.request();
    request.input("quotationno", quotationno);
    request.input("legendcode", newQuotationData.legendcode || null); // Handle optional fields
    request.input("buildingcode", newQuotationData.buildingcode || null);
    request.input("jobdescription", newQuotationData.jobdescription || null);
    request.input("quotationdate", newQuotationData.quotationdate || null);
    request.input("amount", newQuotationData.amount || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getQuotationByQuotationNo(quotationno); // returning the updated quotation data
  }

  static async deleteQuotation(quotationno) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Quotations WHERE quotationno = @quotationno`; // Parameterized query

    const request = connection.request();
    request.input("quotationno", quotationno);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = Quotation;
