Meteor.methods({
  getUserId: function() {
    return this.userId;
  },

  getUser: function() {
    return Meteor.user();
  }
});
