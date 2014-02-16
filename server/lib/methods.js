Meteor.methods({
  getUserId: function() {
    return this.userId;
  },

  getUser: function() {
    console.log('returning user as ', Meteor.user());
    return Meteor.user();
  }
});