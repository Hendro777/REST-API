using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using System.IO;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;
using System.Reflection;
using System.Collections.Specialized;
using System.Web;
using Microsoft.VisualBasic;
using Microsoft.AspNetCore.Mvc.TagHelpers.Cache;

namespace REST_API
{
    public class EmployeeDB
    {
        private string filepath;

        public string Filepath
        {
            get { return filepath; }
            set
            {
                filepath = General.checkDirPath(value);
            }
        }

        public EmployeeDB(string filepath)
        {
            this.Filepath = filepath;
        }


        public Employee GetEmployeeById(string id)
        {
            string employeePath = this.Filepath + id + ".json";
            if (File.Exists(employeePath) == false)
            {
                return null;
            }
            return (Employee)JsonConvert.DeserializeObject<Employee>(File.ReadAllText(employeePath, Encoding.UTF8));
        }


        public List<Employee> GetAllEmployes()
        {
            Console.WriteLine(this.Filepath);
            List<Employee> getAll = new List<Employee>();
            foreach (string employeePath in Directory.GetFiles(this.Filepath))
            {
                getAll.Add((Employee)JsonConvert.DeserializeObject<Employee>(File.ReadAllText(employeePath, Encoding.UTF8)));
            }
            return getAll;
        }


        public Employee CreateNewEmployee(Employee employee)
        {
            GenerateID(employee);
            string json = JsonConvert.SerializeObject(employee);
            File.WriteAllText(this.Filepath + employee.Id + ".json", json, Encoding.UTF8);
            Console.WriteLine(employee.ToString() + " successfully Added to Database");
            return employee;
        }

        public bool EditEmployee(String id, Employee employee)
        {
            Employee oldEmployee = this.GetEmployeeById(id);

            if(oldEmployee == null)
            {
                return false;
            }

            return true;
        }

        public bool Remove(string id)
        {
            Employee found = this.GetEmployeeById(id);
            if (found == null)
            {
                return false;
            }
            return this.Remove(found);
        }

        public bool Remove(Employee employee)
        {
            string employeePath = this.Filepath + employee.Id + ".json";
            if (File.Exists(employeePath) == false)
            {
                Console.Write("EmployeeDB.Remove(): Employee JSON wasn't found");
                return false;
            }
            else
            {
                File.Delete(employeePath);

                return true;
            }
        }

        private void GenerateID(Employee employee)
        {
            string id = KeyGenerator.GetUniqueKey(8);
            while (this.GetEmployeeById(id) != null)
            {
                id = KeyGenerator.GetUniqueKey(8);
            }
            employee.Id = id;
        }
    }
}
