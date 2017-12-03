let mongoose = require("mongoose");
let Collection = mongoose.model("Collection");
let User = mongoose.model("User");


let ctrlCollections = {
  addCollection(req, res){
    if(!req.payload){
      res.status(401).json({message: "Must be signed in to make a collection"});
    }else{
      let name = req.body.name;
      let description = req.body.description;
      let visibility = req.body.visibility;
      if(!name){
        res.status(400).json({message:"Missing name"});
      }else if(!description){
        res.status(400).json({message:"Missing description"});
      }else if(visibility == null || visibility==undefined){
        res.status(400).json({message:"Missing visibility"});
      }else{
        let collection = new Collection();
        collection.name = name;
        collection.description = description;
        collection.public = visibility=="public";
        collection.user_id = req.payload._id;
        collection.rating = 0;

        collection.save(function(err){
          if(err){
            res.status(500).json(err);
          }else{
            res.status(200).json({message:"Collection created"});
          }
        });
      }
    }
  },
  getCollections(req, res){
    Collection.find({public:true}).sort({rating:-1}).exec(function(err, collections){
      if(err){
        res.status(500).json(err);
      }else{
        res.status(200).json(collections);
      }
    });
  },
  getCollection(req, res){
    let id = req.params.id;
    Collection.findById(id, function(err, collection){
      if(err){
        res.status(400).json(err);
      }
      else{
        if(collection.public){
          //collection is public so we return it
          res.status(200).json(collection);
        }else{
          //collection is private so we only return it if the owner requests it
          if(!req.payload){
            //not signed in
            res.status(401).json({message:"Sign in to view"});
          }else if(req.payload._id != collection.user_id){
            res.status(401).json({message:"Private collection"});
          }else{
            res.status(200).json(collection);
          }
        }
      }
    })
  },
  updateCollection(req, res){
    //can only update a collection if signed in as the owner. visibility is irrelevant.
    if(!req.payload){
      //not signed in
      res.status(401).json({message:"Must sign in to update collections"});
    }else{
      let id = req.params.id;
      Collection.findById(id, function(err, collection){
        if(err){
          //probably not found
          res.status(400).json(err);
        }else if(collection.user_id != req.payload._id){
          //someone besides the owner is trying to update
          res.status(401).json({message:"Only owner can update collection"});
        }else{
          //valid request
          let name = req.params.name;
          let description = req.params.description;
          let visibility = req.params.visibility;
          //not allowed to change rating
          //adding/removing images happens somewhere else

          //update the fields if they are included in the request
          if(name){
            collection.name = name;
          }if(description){
            collection.description = description;
          }if(visibility){
            collection.visibility = visibility;
          }

          collection.save(function(err){
            if(err){
              res.status(500).json(err);
            }else{
              res.status(200).json({message:"Updated successfully"});
            }
          });
        }
      });
    }
  },
  deleteCollection(req, res){
    //only the owner can remove collections, regardless of visibility
    if(!req.payload){
      res.status(401).json({message:"Must sign in to delete collections"});
    }else{
      let id = req.params.id;
      Collection.findById(id, function(err, collection){
        if(err){
          res.status(400).json(err);
        }else if(collection.user_id != req.payload._id){
          //user does not own collection so cannot delete
          res.status(401).json({message:"Only owner can delete collection"});
        }else{
          //valid request
          Collection.remove({_id:collection._id}, function(err, d_collection){
            if(err){
              res.status(500).json(err);
            }else{
              res.status(200).json({message:"Delete successfully"});
            }
          });
        }
      });
    }
  },
  upvoteCollection(req, res){
    //upvate a collection must not be owner, colection must be public and user must be authenticated
    if(!req.payload){
      //not authenticated
      res.status(401).json({message:"Must sign in to upvote collections"});
    }else{
      let id = req.params.id;
      Collection.findById(id, function(err, collection){
        if(err){
          //collection not found, etc.
          res.status(400).json(err);
        }else if(!collection.public){
          //collection is private so nobody can upvote it
          res.status(400).json({message:"Private collections cannot be upvoted"});
        }else if(collection.user_id == res.payload._id){
          //user must not be owner
          res.status(400).json({message:"Owner cannot upvote their own collection"});
        }else if(collection.upvoters.includes(req.payload._id)){
          //public collection, signed in, not owner but the user has already upvoted
          res.status(400).json({message:"Only allowed to upvote once"});
        }else{
          //public collection, signed in, not owner, has not upvoted yet. Valid request

          collection.upvoters.push(req.payload._id);//add the upvoter to the list
          collection.rating += 1;//increment the upvot

          collection.save(function(err){
            if(err){
              res.status(500).json(err);
            }else{
              res.status(200).json({message:"Upvote successful"});
            }
          });
        }
      });
    }
  },
  getUserCollections(req, res){
    if(!req.payload){
      //not signed in
      res.status(401).json({message:"Must sign in to view collection"});
    }else{
      let id = req.params.id;//user id

      Collection.find({user_id:req.payload._id}, function(err, collections){
        if(err){
          res.status(400).json(err);
        }else{
          res.status(200).json(collections);
        }
      }).sort({rating: -1})
    }
  },
  addImageToCollection(req, res){
    if(!req.payload){
      //not signed in
      res.status(401).json({message:"Must sign in to add images to collection"});
    }else{
      let collection_id = req.params.id;

      Collection.findById(collection_id, function(err, collection){
        if(err){
          //not found, probably
          res.status(400).json(err);
        }else if(collection.user_id != req.payload._id){
          //user is signed in but not the owner of the collection
          res.status(401).json({message:"Must be owner to add images to collection"});
        }else if(!req.body.image_id){
          //the owner made a request to add an image without supplying an image_id
          res.status(400).json({message:"No image id supplied"});
        }else{
          collection.image_id.push(req.body.image_id);
          collection.save(function(err){
            if(err){
              res.status(500).json(err);
            }else{
              res.status(200).json({message:"Successfully added image to collection"});
            }
          });
        }
      });
    }
  }
}

module.exports = ctrlCollections;
