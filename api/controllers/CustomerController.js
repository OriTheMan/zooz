/**
 * CustomerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  addCustomer: function(req, res) {
    var params = req.allParams()
  	var cardsList = req.param("cards");
    delete params.cards;
    
  	Customer.createCustomer(params).then(function(customerObj) {
      customerObj.cards = [];  
      if(cardsList != undefined && cardsList.length != 0) {
          cardsList = cardsList.map(function(el) {
            var o = Object.assign({}, el);
            o.customerId = customerObj.id;
            return o;
          })

          Card.createCards(cardsList).then(function(cardsObj) {
            customerObj.cards = cardsObj;
            return res.status(200).json(customerObj)
          }).catch(function (err) {
          return res.badRequest(err);
        });
      } else {
        return res.status(200).json(customerObj)
      }
    }).catch(function (err) {
      return res.badRequest(err);
    });
  	 
  },

  deleteCustomer: function(req, res) {
    var params = req.allParams()
    Card.destroy({customerId: params.id}).fetch().then(function(removeCards) {
        Customer.destroyOne({id: params.id}).then(function(removedUser) {
          removedUser.cards = removeCards
          return res.status(200).json(removedUser)
        }).catch(function(err) {
          return res.badRequest(err);
        })
      }).catch(function(err) {
        return res.badRequest(err);
      })
  },

  updateCustomer: async function (req, res) {
    var params = req.allParams();
    var cardsList = params.cards;
    var userData = {};

    userData = Customer.filterFields(params)
    if(Object.keys(userData).length != 0) {
      var updatedUser = await Customer.updateOne({id: params.id}).set(userData).catch(function(err) {
        return res.badRequest().json(err)
      })  
    }
    
 
    if(cardsList != undefined) {
      //get all tokens
      var tokens = Object.keys(cardsList)
      //checking which cards exist and need to update
     
      var existsCards = await Card.find({token: tokens, customerId: params.id}).catch(function(err) {
          return res.badRequest(err)
        })
      

      var existsTokens = existsCards.map(function(cardObj) {
        return cardObj.token;
      })

      var create_tokens = tokens.filter(function(token) {
        return existsTokens.indexOf(token) == -1;
      })
      
      //if have records to update
      if(existsCards.length != 0) {
        var updatesData = [];
        existsCards.map(function(cardObj) {
          return updatesData.push(Card.updateOne({id: cardObj.id}).set(cardsList[cardObj.token]))
        })
        
        var updatedCards = await Promise.all(updatesData).catch(function(err) {
          return res.badRequest(err)
        })
      }

      //if have records to create
      if(create_tokens.length != 0) {
        var createList = create_tokens.map(function(token) {
          var additional_data = {token: token, customerId: params.id}
          return Object.assign({}, cardsList[token], additional_data);
        })

        var newCards = await Card.createEach(createList).fetch().catch(function(err) {
          return res.badRequest(err)
        })
      }
    }
    //delete cards from list
    if(params.delete_cards != undefined && params.delete_cards.length != 0) {
      
      var destroyedCards = await Card.destroy({token: {in: params.delete_cards}, customerId: params.id}).fetch().then().catch(function(err) {
        return res.badRequest(err)
      })
    }

    Customer.getFullCustomer(params.id).then(function(fullCustomer) {
      return res.status(200).json(fullCustomer) 
    }).catch(function(err) {
      if(err) {
        return res.badRequest(err)
      }
    })
  }

};

