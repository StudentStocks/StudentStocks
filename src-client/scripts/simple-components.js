const React = require('react')
const ACTIONS = require("./actions.js")
const STORE = require('./store.js')
const numeral = require('numeral')

const LoginModal = React.createClass({

   _handleSubmit: function(evt){
      evt.preventDefault()
      let loginInfo = {
         username: this.refs.userField.value,
         password: this.refs.passField.value
      }
      if(this.props.userType === "Investor"){

         ACTIONS.handleInvestorLogin(loginInfo)
      }else{
         ACTIONS.handleStudentLogin(loginInfo)
      }

   },
   _exitLogin: function(){
      STORE.setStore('userType', "")
   },



   render: function(){

      return(
         <div className="gen-modal login-modal">

            <a className="close-modal" href="#" onClick={this._exitLogin}>X</a>
            <div>
               <h3>{this.props.userType} login</h3>

               <form action="">
                  <p>Username</p>
                  <input className="input-group" type="text" className="username" ref="userField"/>
                  <p>Password</p>
                  <input className="input-group" type="password" className="password" ref="passField"/>
                  <button onClick={this._handleSubmit} className="btn btn-primary">Login</button>
               </form>
            </div>
         </div>

      )
   }
})

const StudFormModal = React.createClass({

   getInitialState: function(){


      return {
         pageView: 0,
         studentForm: {}
      }
   },
   _handlePageTwo: function(evt){
      let newForm = this.state.studentForm;
      newForm["school"] = this.refs.school.value
      newForm["level"] = this.refs.level.value
      ACTIONS.submitStudentForm(newForm)

         this.setState({pageView: 2, studentForm: {}})

   },

   _handleFormSubmit: function(evt){
      evt.preventDefault()
      let newForm = this.state.studentForm
      newForm["gracePeriod"] = this.refs.gracePeriod.value
      newForm["loanLength"] = this.refs.loanLength.value


      ACTIONS.submitLoanForm(newForm)

   },
   // _nextChanges: function(evt){
   //    let updateForm = this.state.studentForm
   //    // updateform[]
   //
   //
   //
   //
   // },
   _handlePageOne: function(evt){
      evt.preventDefault()
      let newForm = this.state.studentForm;
         newForm["bio"] = this.refs.bio.value



      this.setState({pageView: 1, studentForm: newForm})



   },
   handleChange: function(data, name) {
      let newState = this.state.studentForm

      newState[name] = data;

      this.setState({studentForm: newState})
   },

   _exitLogin: function(){
      STORE.setStore("userType", "")
   },


   render: function(){
      let createOptions = function(strt, lgth, intr){
         let newArr = []
         for(var i = strt; i <= lgth; i+= intr){
            var numStr = i.toString()
            var year
            if(i === 1){
               var year = " Year"

            }else{year = " Years"}

            newArr.push({value: numStr, text: numStr + year })
         }
         return newArr
      }



      if(this.props.userType === "StudentSignup" && this.state.pageView === 0){
         return(
            <div className="gen-modal signup-modal text-center">
               <a className="close-modal" href="#" onClick={this._exitLogin}>X</a>
               <div>
                  <h1>Personal Info</h1>
                  <div className="form-cont">
                     <form action="" className="form-horizontal">
                        {/* username */}
                        <SimpInput key={0} title="Email" name="username" handleChange={this.handleChange} />
                        {/* password */}
                        <SimpInput key={1} textType="password" title="Password" name="password" handleChange={this.handleChange} />
                        {/* firstName */}
                        <SimpInput key={2} title="First Name" name="firstName" handleChange={this.handleChange} />
                        {/* lastName */}
                        <SimpInput key={3} title="Last Name" name="lastName" handleChange={this.handleChange} />
                     </form>
                     {/* bio */}
                     <label htmlFor="bio">Tell us a little about yourself...</label>
                     <textarea className="form-control" rows="1" id="textArea" ref="bio"></textarea>
                     {/* ssn */}
                     <SimpInput title="SSN" name="ssn" handleChange={this.handleChange} />
                     <div className="row">
                        <div className="col-xs-6">
                           {/* <button className="btn btn-primary" type="back" onClick={this._changePage}>back</button> */}
                        </div>
                        <div className="col-xs-6">
                           <button className="btn btn-primary" onClick={this._handlePageOne}>next</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

               )
      }else if(this.props.userType === "StudentSignup" && this.state.pageView === 1){
         return(
            <div className="gen-modal signup-modal">
               <a className="close-modal" href="#" onClick={this._exitLogin}>X</a>

               <div>
                  <h1>Education Info</h1>
                  <div className="form-cont">
                     <form action="" className="form-horizontal">
                        {/* highSchool */}
                        <SimpInput key={4} title="High School" name="highSchool" handleChange={this.handleChange} />
                        {/* gpa */}
                        <SimpInput key={5} title="G.P.A" name="gpa" handleChange={this.handleChange} />
                        {/* school */}
                        <label htmlFor="">School Attending</label>
                        <select className="form-control" id="select" ref="school" >
                           {this.props.schoolData.map((obj,i)=>{
                              return <SchoolOption schoolName={obj.get('name')} key={i}/>
                           })}
                        </select>
                        {/* level */}
                        <label htmlFor="level">Graduate or Undergrad?</label>
                        <select className="form-control" id="select" ref="level">
                           <option>UNDERGRADUATE</option>
                           <option>GRADUATE</option>
                        </select>
                        {/* major */}
                        <SimpInput key={6} title="Major" name="major" handleChange={this.handleChange} />
                        {/* minor */}
                        <SimpInput key={7} title="Minor" name="minor" handleChange={this.handleChange} />
                     </form>

                  </div>

                  <div className="row">
                     <div className="col-xs-6">
                     </div>
                     <div className="col-xs-6">
                        <button className="btn btn-primary" type="next" onClick={this._handlePageTwo}>next</button>
                     </div>
                  </div>
               </div>
            </div>
         )
         }else{
            return(
            <div className="gen-modal signup-modal">
               <a className="close-modal" href="#" onClick={this._exitLogin}>X</a>

               <div>
                  <h1>Loan Info</h1>
                  <div className="form-cont">
                     <form action="" className="form-horizontal">
                        {/* loanGoal; */}
                        <SimpInput key={8} title="Amount Requested" name="loanGoal" handleChange={this.handleChange} />
                        {/* loanLength; */}
                        <label htmlFor="" className="input-label">Loan Length</label>
                        <select name="" id="select" className="form-control" ref="loanLength">
                           {createOptions(2, 15, .5).map(function(obj, i){
                              return(
                                 <option key={i} value={obj.value}>{obj.text}</option>
                              )
                           })}
                        </select>
                        {/* gracePeriod; */}
                        <label htmlFor="" className="input-label">Grace Period</label>
                        <select className="form-control" id="select" ref="gracePeriod" >
                           {createOptions(.5, 4, .5).map(function(obj, i){
                              return(
                                 <option key={i} value={obj.value}>{obj.text}</option>
                              )
                           })}
                        </select>
                        <span className="note-tag">Note: Interest will accrud during grace period</span>

                     </form>

                  </div>

                  <div className="row">
                     <div className="col-xs-6">
                     </div>
                     <div className="col-xs-6">
                        <button className="btn btn-primary" type="next" onClick={this._handleFormSubmit}>Submit Info</button>
                     </div>
                  </div>
               </div>
            </div>
         )

         }

                  }
})

const InvstFormModal = React.createClass({
   _handleClick: function(evt){
      evt.preventDefault()

      let newForm = this.state;
      newForm["school"] = this.refs.school.value

      ACTIONS.submitInvestorForm(newForm)


   },
   handleChange: function(data, name) {
      let newState = {};

      newState[name] = data;

      this.setState(newState, () => {
      });
   },
   _exitLogin: function(){
      STORE.setStore("userType", "")

   },

   render: function(){
      return(
         <div className="gen-modal signup-modal">
            <a className="close-modal" href="#" onClick={this._exitLogin}>X</a>
            <h3>Investor Signup</h3>
            <div className="form-cont">
               <form action="" className="form-horizontal">
                  {/* username */}
                  <SimpInput title="Email" name="username" handleChange={this.handleChange} />
                  {/* password */}
                  <SimpInput textType="password" title="Password" name="password" handleChange={this.handleChange} />
                  {/* firstName */}
                  <SimpInput title="First Name" name="firstName" handleChange={this.handleChange} />
                  {/* lastName */}
                  <SimpInput title="Last Name" name="lastName" handleChange={this.handleChange} />
                  {/* ssn */}
                  <SimpInput title="SSN" name="ssn" handleChange={this.handleChange} />
                  {/* school */}
                  <label htmlFor="">School Attended</label>
                  <select className="form-control" id="select" ref="school">
                     {this.props.schoolData.map((obj,i)=>{
                        return <SchoolOption schoolName={obj.get('name')} key={i}/>
                     })}
                  </select>
                  <button className="btn button-primary" onClick={this._handleClick}>Submit Form</button>

               </form>
            </div>
         </div>

      )
   }
})

const StudModal = React.createClass({
   handleChange: function(data, name) {
      let newState = {};

      newState[name] = data;

      this.setState(newState, () => {
      });
   },

   _exitLogin: function(){
      STORE.setStore('selectedStudent', {})
   },
   _handleInvestment: function(evt){
      evt.preventDefault()
      let invstForm = this.state
      invstForm["loanId"] = this.props.loanData.id.toString()
      ACTIONS.handleInvestment(invstForm)
   },




   render: function(){
      let amountInvested = parseInt(this.props.modData.loan.principalBalance)
      let loanAmount = parseInt(this.props.modData.loan.loanGoal)
      let amountDiff = (loanAmount - amountInvested);
      return(
         <div className="gen-modal stud-modal text-center">
            <a className="close-modal" href="#/dash/investors" onClick={this._exitLogin}>X</a>
            <div>
               <h3>Make An Investment</h3>
               <h4>{this.props.modData.firstName} {this.props.modData.lastName}</h4>
               <p>{this.props.modData.school}</p>
               {/* <div className="progress progress-striped active">
                  <div className="progress-bar progess-bar-info" style={style}></div>
               </div> */}
               <p>Loan Amount Remaining</p>
               <h3>{numeral(amountDiff).format('$0,0')}</h3>
               <div className="">
                  <form action="" className="form-horizontal">
                     <SimpInput title="Amount to invest" name="amount" handleChange={this.handleChange} />
                     <button className="btn btn-primary" onClick={this._handleInvestment}>invest</button>

                  </form>

               </div>
            </div>
         </div>


               )
               }
               })


               const SimpInput = React.createClass({

                  changeHandler: function(event) {
                     const {
                        value: value,
                        name: name,
                     } = event.currentTarget;

                     this.props.handleChange(value, name);
                  },

                  render: function(){
                     let textType
                     if(this.props.textType != undefined){
                        textType = this.props.textType
                     }else{textType = "text"}

                     return(
                        <div className="input-group simp-input">
                           <label htmlFor={this.props.title} className="input-label">{this.props.title}</label>
                           <input type={textType} className="form-control" name={this.props.name} placeholder={this.props.title} onChange={this.changeHandler} />
                        </div>


      )
   }
})
const SchoolOption = React.createClass({





   render: function(){
      return (
         <option value={this.props.schoolName}>
            {this.props.schoolName}
         </option>
      )
   }
})
const ProgressBar = React.createClass({

   render: function(){
      return(
         <div className="progress vertical">
            <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 20%;">
            </div>
         </div>
      )
   }
})

// const PaymentModal:



                  module.exports = {LoginModal, StudModal, StudFormModal, InvstFormModal}
