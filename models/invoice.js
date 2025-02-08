const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Invoice {
  constructor(invoiceno, quotationno, invoicedate, paymentstatus, paymentdate) {
    this.invoiceno = invoiceno;
    this.quotationno = quotationno;
    this.invoicedate = invoicedate;
    this.paymentstatus = paymentstatus;
    this.paymentdate = paymentdate;
  }

  static async getAllInvoices() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Invoices`;
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Invoice(
          row.invoiceno,
          row.quotationno,
          row.invoicedate,
          row.paymentstatus,
          row.paymentdate
        )
    ); // Convert rows to invoice objects
  }

  static async getInvoiceByInvoiceNo(invoiceno) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Invoices WHERE invoiceno = @invoiceno`; // Parameterized query

    const request = connection.request();
    request.input("invoiceno", invoiceno);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Invoice(
          result.recordset[0].invoiceno,
          result.recordset[0].quotationno,
          result.recordset[0].invoicedate,
          result.recordset[0].paymentstatus,
          result.recordset[0].paymentdate
        )
      : null; // Handle invoice not found
  }

  static async createQuotation(newInvoiceData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Invoices (quotationno, invoicedate, paymentstatus, paymentdate) VALUES (@quotationno, @invoicedate, @paymentstatus, @paymentdate); SELECT SCOPE_IDENTITY() AS invoiceno;`; // Retrieve invoiceno of inserted record

    const request = connection.request();
    request.input("quotationno", newInvoiceData.quotationno);
    request.input("invoicedate", newInvoiceData.invoicedate);
    request.input("paymentstatus", newInvoiceData.paymentstatus);
    request.input("paymentdate", newInvoiceData.paymentdate);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created invoice using its invoice id
    return this.getInvoiceByInvoiceNo(result.recordset[0].invoiceno);
  }

  static async updateInvoice(invoiceno, newInvoiceData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Invoices SET quotationno = @quotationno, invoicedate = @invoicedate, paymentstatus = @paymentstatus, paymentdate = @paymentdate WHERE invoiceno = @invoiceno`; // Parameterized query

    const request = connection.request();
    request.input("invoiceno", invoiceno);
    request.input("quotationno", newInvoiceData.quotationno || null); // Handle optional fields
    request.input("invoicedate", newInvoiceData.invoicedate || null);
    request.input("paymentstatus", newInvoiceData.paymentstatus || null);
    request.input("paymentdate", newInvoiceData.paymentdate || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getInvoiceByInvoiceNo(invoiceno); // returning the updated invoice data
  }

  static async deleteInvoice(invoiceno) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Invoices WHERE invoiceno = @invoiceno`; // Parameterized query

    const request = connection.request();
    request.input("invoiceno", invoiceno);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = Invoice;
