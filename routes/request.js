const express=require("express")
const router=express.Router()

const{sendRequest,getRequests,acceptRequest,deleteRequest}=require("../controllers/request")

router.post('/send',sendRequest)

router.get('/get/:userId',getRequests)

router.post('/accept',acceptRequest)

router.put("/delete",deleteRequest)



module.exports=router