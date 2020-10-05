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
        private List<Employee> list;

        public List<Employee> List
        {
            get { return list; }
            set { list = value; }
        }

        private string filepath;

        public string Filepath
        {
            get { return filepath; }
            set
            {
                if (Directory.Exists(value) == false)
                {
                    throw new ArgumentException("EmployeeDB.Filepath: Filedirectory doesn't exist");
                }
                else
                {
                    if ((value[^1].Equals("/")) == false && (value[^1].Equals(@"\") == false))
                    {
                        value += "/";
                    }
                    this.filepath = value;
                }
            }
        }

        public EmployeeDB(string filepath)
        {
            this.Filepath = filepath;
            this.List = new List<Employee>();

            foreach (string jsonPath in Directory.GetFiles(this.Filepath, "*.json"))
            {
                Employee employee = JsonConvert.DeserializeObject<Employee>(System.IO.File.ReadAllText(jsonPath, Encoding.UTF8));
                this.List.Add(employee);
            }
        }

        public bool Add(Employee employee)
        {
            string id = KeyGenerator.GetUniqueKey(8);
            while (this.GetEmployeeById(id) != null)
            {
                id = KeyGenerator.GetUniqueKey(8);
            }
            employee.Id = id;
            string json = JsonConvert.SerializeObject(employee);
            File.WriteAllText(this.Filepath + employee.Id + ".json", json, Encoding.UTF8);
            this.list.Add(employee);
            Console.WriteLine(employee.ToString() + " successfully added to EmployeeDB");
            return true;
        }

        public bool New(string firstname, string lastname, string birthdate)
        {
            Employee employee = new Employee(firstname, lastname, birthdate);
            return this.Add(employee);
        }

        public bool Remove(string id)
        {
            Employee found = this.GetEmployeeById(id);
            if (found == null)
            {
                Console.WriteLine("Can't be removed - No Employee with the ID {0} was found.", id);
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
            } else
            {
                File.Delete(employeePath);
                this.list.Remove(employee);
                Console.WriteLine(employee.ToString() + " successfully removed from EmployeeDB");
                return true;
            }
        }

        public bool EditEmployee(Employee employee,  IFormCollection form)
        {

            // Suche Queryparameter passend zu den Objektattributen & verändere Wert
            PropertyInfo[] properties = typeof(Employee).GetProperties();
            NameValueCollection nvc = new NameValueCollection();
            JArray jobj = JsonConvert.DeserializeObject<JArray>(JsonConvert.SerializeObject(form));

            foreach (var item in jobj)
            {
                nvc.Add(item["Key"].ToString(), item["Value"].First().ToString());
            }

            foreach (PropertyInfo propertyInfo in properties)
            {
                var items = nvc.AllKeys.SelectMany(nvc.GetValues, (k, v) => new { key = k, value = v });
                foreach (var it in items)
                
                    if ((it.key.First().ToString().ToUpper() + it.key.Substring(1)).Equals(propertyInfo.Name))
                    {
                        propertyInfo.SetValue(employee, it.value);
                    }
                
            }
            string json = JsonConvert.SerializeObject(employee);
            File.WriteAllText(this.Filepath + employee.Id + ".json", json, Encoding.UTF8);
            return true;
        }


        public Employee GetEmployeeById(string id)
        {
            string employeePath = this.Filepath + id + ".json";
            if (File.Exists(employeePath) == false)
            {
                Console.WriteLine("EmployeeDB.GetEmployeeById(): No Employee JSON with the ID {0} was found.", id);
                return null;
            }

            return (Employee)JsonConvert.DeserializeObject<Employee>(File.ReadAllText(employeePath, Encoding.UTF8));
        }

        public List<Employee> GetAllEmployes()
        {
            return this.List;
        }
    }
}
