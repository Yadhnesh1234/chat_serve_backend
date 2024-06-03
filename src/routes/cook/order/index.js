const express=require('express')
const { 
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
}=require('../../../controller/cook/orders')

const router=express.Router();

router.get("/get-orders",getAllOrders)
router.post('/calculate-bill-total', calculateBillTotal);
router.post('/update-order-status', updateOrderStatus);
router.get('/orders-status', getOrdersByStatus);
router.get('/tables', getTables);
router.post('/table-orders', getTableOrders);
router.get('/cooks', getAllCooks);
router.get('/products', getAllProducts);
router.put('/update-table-status',updateTableStatus);
router.post('/total-bill', calculateTotalBill);


module.exports=router