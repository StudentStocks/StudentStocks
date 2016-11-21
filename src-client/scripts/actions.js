const {InvestorAppModel, InvestorAppColl, InvestorLoginModel} = require('./investor-model.js')
const {AllStudentsColl, StudentAppModel, StudentAppColl,StudentLoginModel} = require("./student-model.js")
const {SchoolColl, SchoolModel} = require("./schools-model.js")
const STORE = require('./store.js')





const ACTIONS = {

   fetchALlStudents: function(){
      let allStudents = new AllStudentsColl()

      allStudents.fetch().then(function(){
         STORE.setStore('allStudents', allStudents.models)
      })
   },


   fetchSchoolData: function(){
      let schoolInst = new SchoolColl()

      schoolInst.fetch().then(function(){
         STORE.setStore('schools', schoolInst.models)
      })
   },

   submitStudentForm: function(formInfo){
      let formInst = new StudentAppModel

      formInst.set(formInfo)

      formInst.save().then(function(serverRes){
         console.log('this is serverresponse ', serverRes)
         STORE.setStore('currentUser', serverRes)
      })
   },

   submitInvestorForm: function(formInfo){
      let formInvstForm = new InvestorAppModel

      formInvstForm.set(formInfo)

      formInvstForm.save().then(function(serverRes){
         console.log(serverRes)
         STORE.setStore('currentUser', serverRes)
      })
   },
//
   handleInvestorLogin: function(usrInfo){
      let InvstLogin = new InvestorLoginModel()

      InvstLogin.set(usrInfo)

      InvstLogin.save().then(function(serverRes){

         console.log(serverRes)
         STORE.setStore('currentUser', serverRes)
         localStorage.setItem("user_id", serverRes.id);
         console.log(localStorage.getItem("user_id"))

      })



   },
   handleStudentLogin: function(usrInfo){
      let stdntLogin = new StudentLoginModel()

      stdntLogin.set(usrInfo)

      stdntLogin.save().then(function(serverRes){

         console.log(serverRes)
         STORE.setStore('currentUser', serverRes)
         localStorage.setItem("user_id", serverRes.id);
         console.log(localStorage.getItem("user_id"))

      })



   },

// // EXECUTE TO GRAB RANDOM ASSETS
//    getObstacles: function(){
//       let obst = new ObstacleCollection()
//       //
//       // obst.fetch().then(function(){
//       //
//       //    STORE.setStore('obstacles', obst.models)
//       //
//       // })
//    },
//
//    createNewUser: function(modlVals){
//       let newUser = new SignUpModel()
//
//       newUser.set(modlVals)
//
//       newUser.save().then(function(serverRes){
//          STORE.setStore('currentUser', serverRes)
//
//       })
//
//    },
//
//    fetchCharData: function(){
//       let charCollInst = new CharCollection()
//
//       return charCollInst.fetch().then(function(){
//          STORE.setStore('characters', charCollInst)
//       })
//
//
//    },

   changeView: function(viewInput){

      STORE.setStore('currentView', viewInput)

   }

}




module.exports = ACTIONS
