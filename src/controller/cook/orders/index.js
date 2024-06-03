const {connect_db} = require('../../../db')

const getAllOrders = (req, res) => {
    const connection=connect_db()
    const sql = `
    SELECT 
      o.*,
      p.product_name,
      p.price,
      p.image,
      p.res_id,
      p.time_to_prepare
    FROM 
      \`order\` o
    JOIN 
      product p ON o.product_id = p.product_id
    WHERE
      o.status = 0;
  `;
  
  connection.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
};

const calculateBillTotal = (req, res) => {
    const connection=connect_db()
    const { table_id } = req.body;

    const sql = 'SELECT * FROM `order` WHERE table_id = ?';
    
    connection.query(sql, [table_id], (err, orders) => {
      if (err) {
        throw err;
      }
  
      let totalAmount = 0;
      for (const order of orders) {
        totalAmount += order.total;
      }
  
      // Create bill object with total amount
      const bill = {
        total_amount: totalAmount,
        table_id: table_id
      };
  
      res.json(bill);
    });
  };

  const updateOrderStatus = (req, res) => {
    const connection = connect_db();
    const { order_id } = req.body;
  
    // Query to get the current status of the order
    const getStatusSql = 'SELECT status FROM `order` WHERE order_id = ?';
  
    connection.query(getStatusSql, [order_id], (err, rows) => {
      if (err) {
        throw err;
      }
  
      // Check if the order exists
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Toggle the status
      const currentStatus = rows[0].status;
      const newStatus = currentStatus === 0 ? 1 : 0;
  
      // Query to update order status
      const updateSql = 'UPDATE `order` SET status = ? WHERE order_id = ?';
  
      connection.query(updateSql, [newStatus, order_id], (err, result) => {
        if (err) {
          throw err;
        }
  
        // Check if the order was updated successfully
        if (result.affectedRows > 0) {
          res.json({ message: 'Order status updated successfully', newStatus: newStatus });
        } else {
          res.status(500).json({ error: 'Failed to update order status' });
        }
      });
    });
};

// controllers/orderController.js

// Function to get orders by status
const getOrdersByStatus =async (req, res) => {
  const connection = connect_db();
  // Query to count total orders
  const totalOrdersQuery = 'SELECT COUNT(*) AS total_orders FROM `order`';

  // Query to count served orders
  const servedOrdersQuery = 'SELECT COUNT(*) AS served_orders FROM `order` WHERE status = 1';

  // Query to count pending orders
  const pendingOrdersQuery = 'SELECT COUNT(*) AS pending_orders FROM `order` WHERE status = 0';

  const sql = 'SELECT SUM(total) AS total_income FROM `order` WHERE status = 1';


  connection.query(totalOrdersQuery, (err, totalResult) => {
    if (err) {
      throw err;
    }
    const totalOrders = totalResult[0].total_orders;

    connection.query(servedOrdersQuery, (err, servedResult) => {
      if (err) {
        throw err;
      }
      const servedOrders = servedResult[0].served_orders;

      connection.query(pendingOrdersQuery, (err, pendingResult) => {
        if (err) {
          throw err;
        }
        const pendingOrders = pendingResult[0].pending_orders;

      connection.query(sql, (err, result) => {
        if (err) {
         throw err;
      }
       const total_income= result[0].total_income;
  
        res.json({
          total_orders: totalOrders,
          served_orders: servedOrders,
          pending_orders: pendingOrders,
          total_income :total_income
        });
      });
    });
  });
});
};

const getTables = (req, res) => {
  const connection = connect_db();
  const sql = 'SELECT * FROM `table_details`';

  connection.query(sql, (err, tables) => {
    if (err) {
      throw err;
    }

    // Separate reserved and unreserved tables based on their status
    const reservedTables = tables.filter(table => table.status === 1);
    const unreservedTables = tables.filter(table => table.status === 0);

    res.json({ reserved_tables: reservedTables, unreserved_tables: unreservedTables });
  });
};

// controllers/orderController.js

const getTableOrders = (req, res) => {
  const connection = connect_db();
  const { table_id } = req.body;

  // Query to select orders for the given table
  const sql = 'SELECT o.*, p.product_name, p.price FROM `order` o INNER JOIN `product` p ON o.product_id = p.product_id WHERE o.table_id = ?';

  connection.query(sql, [table_id], (err, orders) => {
    if (err) {
      throw err;
    }

    // Separate waiting and served orders based on their status
    const waitingOrders = orders.filter(order => order.status === 0);
    const servedOrders = orders.filter(order => order.status === 1);

    // Calculate total bill
    const totalBill = orders.reduce((total, order) => total + order.total, 0);

    res.json({ waiting_orders: waitingOrders, served_orders: servedOrders, total_bill: totalBill });
  });
};

const getAllCooks = (req, res) => {
  const connection = connect_db();

  // Query to select all cooks
  const sql = 'SELECT * FROM `cook`';

  connection.query(sql, (err, cooks) => {
    if (err) {
      throw err;
    }
    res.json(cooks);
  });
};

const getAllProducts = (req, res) => {
  const connection = connect_db();

  // Query to select all products
  const sql = 'SELECT * FROM `product`';

  connection.query(sql, (err, products) => {
    if (err) {
      throw err;
    }
    res.json(products);
  });
};
const updateTableStatus = (req, res) => {
  const connection = connect_db();
  const { table_id } = req.body;

  // Query to select the current status of the table
  const selectSql = 'SELECT status FROM `table_details` WHERE table_id = ?';

  connection.query(selectSql, [table_id], (err, rows) => {
    if (err) {
      console.error('Error fetching table status:', err);
      return res.status(500).json({ error: 'Error fetching table status' });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    // Extract current status
    const currentStatus = rows[0].status;

    // Determine new status
    const newStatus = currentStatus === 0 ? 1 : 0;

    // Query to update the status
    const updateSql = 'UPDATE `table_details` SET status = ? WHERE table_id = ?';

    connection.query(updateSql, [newStatus, table_id], (err, result) => {
      if (err) {
        console.error('Error updating table status:', err);
        return res.status(500).json({ error: 'Error updating table status' });
      }
      // Check if the status was updated successfully
      if (result.affectedRows > 0) {
        res.json({ message: 'Table status updated successfully' });
      } else {
        res.status(404).json({ error: 'Table not found' });
      }
    });
  });
};

const calculateTotalBill = (req, res) => {
  const connection = connect_db();


    // Query to get the latest order
    const getLastOrderQuery = 'SELECT order_id FROM `order` ORDER BY order_id DESC LIMIT 1';

    connection.query(getLastOrderQuery, (error, results) => {
      if (error) {
        console.error('Error fetching the last order: ' + error.stack);
        res.status(500).send('Error fetching the last order');
        connection.end();
        return;
      }

      if (results.length === 0) {
        res.status(404).send('No orders found');
        connection.end();
        return;
      }

      const latestOrderId = results[0].order_id;

      // Query to calculate the total bill for the latest order and fetch product details
      const calculateTotalQuery = `
      SELECT o.order_id, SUM(o.total) AS total_bill, o.quantity, p.product_id, p.product_name, p.price, p.image
      FROM \`order\` o
      JOIN product p ON o.product_id = p.product_id
      WHERE o.order_id = ?
      GROUP BY o.order_id, o.quantity, p.product_id
    `;

    connection.query(calculateTotalQuery, [latestOrderId], (error, results) => {
      if (error) {
        console.error('Error calculating the total bill: ' + error.stack);
        res.status(500).send('Error calculating the total bill');
        connection.end();
        return;
      }

      if (results.length === 0) {
        res.status(404).send('No products found for the latest order');
        connection.end();
        return;
      }

      const totalBill = results[0].total_bill;
      const products = results.map(row => ({
        product_id: row.product_id,
        product_name: row.product_name,
        price: row.price,
        image: row.image,
        quantity: row.quantity
      }));

      res.json({ order_id: latestOrderId, total_bill: totalBill, products: products });

      connection.end();
    });
    });
};

module.exports={
    getAllOrders,
    calculateBillTotal,
    updateOrderStatus,
    getOrdersByStatus,
    getTables,
    getTableOrders,
    getAllCooks,
    getAllProducts,
    updateTableStatus,
    calculateTotalBill
}