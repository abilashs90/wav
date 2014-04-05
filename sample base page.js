// app.defineComponent({
//   name: 'basePage',
//   requires: ['activityIndicator']
//   api: {
//     _constructor: function() {
//       'use strict';
//
//       var self = this,
//           activityIndicator = self.component('activityIndicator');
//
//       self.on('render', function() {
//         if(_.isFunction(self.primaryCollection)) {
//           var collection = self.primaryCollection;
//
//           collection.read();
//           collection.on('fetchStart', function() {
//             activityIndicator.ask('activityStart');
//           });
//
//           collection.on('fetchEnd', function() {
//             activityIndicator.ask('activityEnd');
//           })
//         }
//       });
//     }
//   }
// });
