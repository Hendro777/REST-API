using System;
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
        EmployeeDB empDB = new EmployeeDB(pathDB);


        [HttpGet]
        // [Route("")]
        /* Returns ALL Employees even if there are zero 
        Return Types:
        200 - OK + [Employees as a List] */
        public IActionResult GetAllEmployees()
        {
            return Ok(empDB.GetAllEmployes());
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
            Employee employee = empDB.GetEmployeeById(id);
            if (employee == null) {
                return NotFound();
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
        public IActionResult PostNewEmployee(Employee employee)
        {
            Console.WriteLine(JsonConvert.SerializeObject(employee));

            Employee newEmployee = empDB.CreateNewEmployee(employee);

            if (newEmployee == null)
            {
                return BadRequest();
            }
            return Ok(newEmployee);
        }


        /* */
        [HttpPatch]
        [Route("{id}")]
        public IActionResult EditEmployee(String id, Employee employee)
        {
            Console.WriteLine("PATCH for Employee with ID: " + id);
            String json = JsonConvert.SerializeObject(employee);
            Console.WriteLine("GOT THIS: "+json);

            /*
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
            */

            return Ok();
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

