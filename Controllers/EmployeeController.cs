﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Web;
using System.Windows.Markup;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Constraints;
using System.Text;
using System.Text.Json;
using System.Text.Unicode;
using Microsoft.AspNetCore.Server.IIS.Core;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json; 

namespace REST_API
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private const string pathDB = @"C:/REST-API/Data\";
        private EmployeeDB empDB = new EmployeeDB(pathDB);

        public EmployeeDB EmpDB
        {
            get { return empDB; }
            set { empDB = value; }
        }

        [HttpGet]
        // [Route("")]
        /* Returns ALL Employees even if there are zero 
        Return Types:
        200 - OK + [Employees as a List] */
        public IActionResult GetAllEmployees()
        {
            Console.WriteLine("Get All Employees Request");
            return Ok(EmpDB.GetAllEmployes());
        }

        /* Returns the Employee with the given ID if the File exists 
        example: "http://localhost/api/employee/xxxx.json"
        Return Types: 
        200 - OK + employee object
        404 - if the file doesnt exist */

        [HttpGet]
        [Route("{id}")]
        public IActionResult GetEmployeeByID(string id)
        {
            Console.WriteLine("Get for Employee with ID: "+id);

            Employee employee = empDB.GetEmployeeById(id);
            if (employee == null)
            {
                return NotFound("No Employee found with given ID: " + id);
            }
            return Ok(employee);
        }

        /* Creates the Employee with the given ID and the belonging JSON
        example: "http://localhost/api/employee/new"
        Return Types: 
        200 - Added successfully + JSON
        500 - something went wrong */

        [HttpPost]
        [Route("new")]
        public IActionResult PostNewEmployee()
        {
            Console.WriteLine("Post new Employee Request");
            string firstname, lastname, birthdate;
            firstname = Request.Query["FirstName"];
            lastname = Request.Query["LastName"];
            birthdate = Request.Query["BirthDate"];

            if (string.IsNullOrEmpty(firstname) || string.IsNullOrEmpty(lastname) || string.IsNullOrEmpty(birthdate))
            {
                return BadRequest("Mandatory fields missing");
            }

            Employee employee = new Employee(firstname, lastname, birthdate);
            empDB.Add(employee);

            return Ok(empDB);
        }

        /* */
        [HttpPatch]
        [Route("{id}")]
        public IActionResult Patch(string id)
        {
            Console.WriteLine("PATCH for Employee with ID: " + id);
            Employee employee = empDB.GetEmployeeById(id);

            if (employee == null)
            {
                Console.WriteLine("Employee not found");
                return NotFound();
            }

            Console.WriteLine("Received FormData: "+ JsonConvert.SerializeObject(Request.Form));
            bool result = empDB.EditEmployee(employee, Request.Form);
            
            if (result == false)
            {
                return BadRequest();
            }
            return Ok(employee);
        }

        /* Deletes the Employee with the given ID if the File exists
        example: "http://localhost/api/employee/xxxx.json"
        Return Types: 
        204 - Removed successfully
        404 - File doesnt exist
        500 - something went wrong */
        [HttpDelete]
        [Route("{id}")]
        public IActionResult DeleteEmployee(string id)
        {
            Employee employee = empDB.GetEmployeeById(id);
            if (employee == null)
            {
                return NotFound("No Employee found with given ID:+id");
            }

            bool result = empDB.Remove(employee);
            if (result == false)
            {
                return BadRequest(result);
            }
            return NoContent();
        }

        /*
        [HttpGet]
        [Route("returnvalues")]
        public IActionResult ReturnValues()
        {
            return Ok();
        }

        [HttpGet]
        [Route("redirect")]
        public IActionResult Redirect()
        {
            return Redirect("http:\\www.google.de");
        }
        */
    }
}

