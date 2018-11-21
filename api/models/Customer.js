/**
 * Users.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
        type: 'string',
        required: true
    },
     address: {
      type: "string",
      required: true
    },
    
    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true
    },
    cards: {
      collection: 'card',
      via: 'customerId'
    }
    
  },

  attrFields: ['name', 'email', 'address'],

  createCustomer: async function (opts) {
    return await Customer.create(opts).fetch();
  },

  getFullCustomer: async function(customerId) {
    return await Customer.findOne({id: customerId}).populate('cards')
  },

  destroyCustomer: async function(opts) {
    return await Customer.destroyOne({id: opts.id});
  },

  filterFields: function(fields) {
    var userData = {};

    Customer.attrFields.map(function(attr) {
      if(fields[attr] != undefined) {
        userData[attr] = fields[attr];
        return true;
      }
    })

      return userData;
  }






};

