const express=require('express')
const { 
signup
}=require('../../../controller/manager/auth')

const router=express.Router();

router.post("/owner-signup",signup)

module.exports=router