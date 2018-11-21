/**
 * Card.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
     token: {
      type: "string",
      required: true,
      unique: true
    },
    description: {
      type: "string",
    },
    customerId: {
      model: 'customer'
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },


  
  createCards: async function (cardsList) {
    return await Card.createEach(cardsList).fetch();
  },

  updateCards: async function(cardsList, existsCards) {
    var promises = [];
    var updates = [];
    existsCards.map(function(cardObj) {
      return updates.push(Card.updateOne({id: cardObj.id}).set(cardsList[cardObj.token]))
    })
    
    Promise.all(updates)
      .then(function(data) {
        return data.map(function(entry) {
            return entry;
        });
      })
  }


};

