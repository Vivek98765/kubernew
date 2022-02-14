const express = require('express')
const Trade = require('../models/trade')
const router = new express.Router()
const checkAuth = require("../middlewares/check-auth");



router.post("",
checkAuth,
    (req, res, next) => {
        //console.log(req.body);
        const trade = new Trade({
            stockName: req.body.stockName,
            price: req.body.price,
            quantity:req.body.quantity,
            //imagePath: url + "/images/" + req.file.filename,
            creator: req.userData.userId,
            tradeDate: new Date,
        })
        trade.save().
            then(trade => {
                if(trade){
                    res.status(201).json({
                        message: "trade added successfully",
                        trade: {
                            ...trade,
                            id: trade._id
                        }
                    })
                }
                else{
                    res.status(500).json({ message: "Error Adding trade" });
                }
                
            })
            .catch(e => {
            })
    })


   
router.put(
    "/:id",
    checkAuth,
    (req, res, next) => {

        const trade = new Trade({
            _id: req.body.id,
            stockName: req.body.stockName,
            price: req.body.price,
            quantity: req.body.quantity,
            creator: req.userData.userId
        });
        Trade.updateOne(
            { _id: req.params.id, creator: req.userData.userId },
            trade
          ).then(result => {
            if(result){
                res.status(200).json({ message: "Update successful!" });
            }
            
            else {
                res.status(500).json({ message: "Error Upating Trade" });
            }
        });
    }
);



router.get("/mytrade", 
checkAuth,
(req, res, next) => {
    Trade.find({creator: req.userData.userId}).then(post => {
      if (post) {
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: post
        });
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(e=>{
    });
  });
  

router.get("", (req, res, next) => {
    Trade.find().then(documents => {
        if(documents){
            res.status(200).json({
                message: "Posts fetched successfully!",
                posts: documents
            });
        }
        else{
            res.status(404).json({ message: "Post not found!" });
        }
       
    });
});
router.get("/:id", (req, res, next) => {
    Trade.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    });
  });
  
  router.delete("/:id", checkAuth, (req, res, next) => {
    Trade.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
      result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Deletion successful!" });
        } else {
            return res.status(401).json({ message: "Not authorized!!" });
        }
      }
    );
  });


  




module.exports = router