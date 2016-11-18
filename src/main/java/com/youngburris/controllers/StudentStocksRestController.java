package com.youngburris.controllers;

import com.youngburris.entities.Investor;
import com.youngburris.entities.Loan;
import com.youngburris.entities.Portion;
import com.youngburris.entities.Student;
import com.youngburris.services.InvestorRepository;
import com.youngburris.services.LoanRepository;
import com.youngburris.services.PortionRepository;
import com.youngburris.services.StudentRepository;
import com.youngburris.utilities.PasswordStorage;
import org.h2.tools.Server;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.servlet.http.HttpSession;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;

/**
 * Created by stevenburris on 11/15/16.
 */
@RestController
public class StudentStocksRestController {




    @Autowired
    StudentRepository students;

    @Autowired
    public InvestorRepository investors;

    @Autowired
    LoanRepository loans;

    @Autowired
    PortionRepository portions;

    Server h2;

//    initiate the server and add a default student && default investor if they aren't already in the db
    @PostConstruct
    public void init() throws PasswordStorage.CannotPerformOperationException, SQLException {
        h2 = Server.createWebServer().start();
        Investor defaultInvestor = new Investor("stevenburris@gmail.com", PasswordStorage.createHash("hunter2"),
                "Steven", "Burris", "219089-4322-32",
                "College of Charleston");
        if (investors.findFirstByUsername(defaultInvestor.getUsername()) == null) {
            investors.save(defaultInvestor);
        }
        Student student = new Student("stevenburris@gmail.com", "hunter2", "Steven", "Burris",
                "College of Charleston", Student.Level.GRADUATE, "This is filler info. I have no idea what to type here, so I'll stop.",
                "Porter-Gaud", "url to transcript", "4", "Accounting", "French", "123456-1234-12", "1000000");
        if (students.findFirstByUsername(student.getUsername()) == null) {
            students.save(student);
        }

    }

    @PreDestroy
    public void destroy() {
        h2.stop();
    }


//    Student login route
    @RequestMapping(path = "/studentlogin", method = RequestMethod.POST)
    public ResponseEntity<Student> studentLogin(HttpSession session, @RequestBody Student student)
            throws PasswordStorage.InvalidHashException, PasswordStorage.CannotPerformOperationException {

//        check the database for the student's username
        Student studentFromH2 = students.findFirstByUsername(student.getUsername());

//        if username is not found, throw a forbidden status
        if (studentFromH2 == null) {
            return new ResponseEntity<Student>(HttpStatus.FORBIDDEN);
        }

//        if password hash doesn't match the stored hash, throw a forbidden status
        else if (!PasswordStorage.verifyPassword(student.getPassword(), studentFromH2.getPassword())) {
            return new ResponseEntity<Student>(HttpStatus.FORBIDDEN);
        }

//        if password matches, set attribute and return 200
        session.setAttribute("username", student.getUsername());
        session.setAttribute("isInvestor", false);
        session.setAttribute("time", LocalDate.now());
        return new ResponseEntity<Student>(studentFromH2, HttpStatus.OK);
    }

//    Investor login route
    @RequestMapping(path = "/investorlogin", method = RequestMethod.POST)
    public ResponseEntity<Investor> investorLogin(HttpSession session, @RequestBody Investor investor)
            throws PasswordStorage.InvalidHashException, PasswordStorage.CannotPerformOperationException {

//        check the database for the investor's username
        Investor investorFromH2 = investors.findFirstByUsername(investor.getUsername());

//        if username is not found, throw a forbidden status
        if (investorFromH2 == null) {
            return new ResponseEntity<Investor>(HttpStatus.FORBIDDEN);
        }

//        if password doesn't match, throw a forbidden status
        else if (!PasswordStorage.verifyPassword(investor.getPassword(), investorFromH2.getPassword())) {
            return new ResponseEntity<Investor>(HttpStatus.FORBIDDEN);
        }

//        if password matches, set attribute and return a 200
        session.setAttribute("username", investor.getUsername());
        session.setAttribute("isInvestor", true);
        session.setAttribute("time", LocalDate.now());
        return new ResponseEntity<Investor>(investorFromH2, HttpStatus.OK);
    }

//    logout route for students and investors
    @RequestMapping(path = "/logout", method = RequestMethod.POST)
    public ResponseEntity logout(HttpSession session) {
        session.invalidate();
        return new ResponseEntity(HttpStatus.OK);
    }

//    create student user route
    @RequestMapping(path = "/student", method = RequestMethod.POST)
    public ResponseEntity<Student> createStudent(HttpSession session, @RequestBody Student student)
            throws PasswordStorage.CannotPerformOperationException {

//        check the database for the student's username
        Student studentFromDB = students.findFirstByUsername(student.getUsername());
        if (studentFromDB == null) {
            student.setPassword(PasswordStorage.createHash(student.getPassword()));
            student.setUsername(student.getUsername());
            student.setBalance(0);
            student.isFunded(false);
            students.save(student);
        }
//        if the username already exists in the database, throw an error
        else {
            return new ResponseEntity<Student>(HttpStatus.IM_USED);
        }

//        set attributes and send 200
        session.setAttribute("username", student.getUsername());
        session.setAttribute("isInvestor", false);
        session.setAttribute("time", LocalDate.now());
        return new ResponseEntity<Student>(student, HttpStatus.OK);
    }


//    create investor user route
    @RequestMapping(path = "/investor", method = RequestMethod.POST)
    public ResponseEntity<Investor> createInvestor(HttpSession session, @RequestBody Investor investor)
            throws PasswordStorage.CannotPerformOperationException {

//        check the database for the investor's username
        Investor investorFromDB = investors.findFirstByUsername(investor.getUsername());
        if (investorFromDB == null) {
            investor.setPassword(PasswordStorage.createHash(investor.getPassword()));
            investor.setUsername(investor.getUsername());
            investor.setBalance(0);
            investors.save(investor);
        }
//        if the username already exists in the database, throw an error
        else {
            return new ResponseEntity<Investor>(HttpStatus.IM_USED);
        }

//        set attributes and send 200
        session.setAttribute("username", investor.getUsername());
        session.setAttribute("isInvestor", true);
        session.setAttribute("time", LocalDate.now());
        return new ResponseEntity<Investor>(investor, HttpStatus.OK);
    }


    @RequestMapping(path = "/investors", method = RequestMethod.GET)
    public ResponseEntity<ArrayList<Investor>> getInvestors() {
        ArrayList<Investor> investorArrayList = (ArrayList<Investor>) investors.findAll();
        return new ResponseEntity<ArrayList<Investor>>(investorArrayList, HttpStatus.OK);
    }

    @RequestMapping(path = "/students", method = RequestMethod.GET)
    public ResponseEntity<ArrayList<Student>> getStudents() {
        ArrayList<Student> studentArrayList = (ArrayList<Student>) students.findAll();
        return new ResponseEntity<ArrayList<Student>>(studentArrayList, HttpStatus.OK);
    }

    @RequestMapping(path = "/loans", method = RequestMethod.GET)
    public ResponseEntity<ArrayList<Loan>> getLoans() {
        ArrayList<Loan> loanArrayList = (ArrayList<Loan>) loans.findAll();
        return new ResponseEntity<ArrayList<Loan>>(loanArrayList, HttpStatus.OK);
    }

    @RequestMapping(path = "/portions", method = RequestMethod.GET)
    public ResponseEntity<ArrayList<Portion>> getPortions() {
        ArrayList<Portion> portionArrayList = (ArrayList<Portion>) portions.findAll();
        return new ResponseEntity<ArrayList<Portion>>(portionArrayList, HttpStatus.OK);
    }



}
