using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Reflection.Metadata;
using System.Media;
using System.ComponentModel.DataAnnotations;

namespace REST_API
{
    public class Employee : Person
    {

        private string id;
        public string Id
        {
            get { return id; }
            set { id = value; }
        }

        private string function;
        [Required]
        public string Function
        {
            get { return function; }
            set { function = value; }
        }

        private string location;
        public string Location
        {
            get { return location; }
            set { location = value; }
        }

        private string email;

        public string Email
        {
            get { return email; }
            set { email = value; }
        }

        private string phoneNumber;

        public string PhoneNumber
        {
            get { return phoneNumber; }
            set { phoneNumber = value; }
        }

        private string mobileNumber;

        public string MobileNumber
        {
            get { return mobileNumber; }
            set { mobileNumber = value; }
        }

        public Employee()
        {

        }

        public Employee(string firstname, string lastname, string birthdate) : base(firstname, lastname, birthdate)
        {
            this.Location = "Home Office";
            this.Email = this.FirstName + "-" + this.LastName + "@restbank.de";
            Random rnd = new Random();
            this.PhoneNumber = "0641 7005 " + rnd.Next(10000000, 99999999);
            this.MobileNumber = "0171 63 " + rnd.Next(10000000, 99999999);
            this.Function = "Mitarbeiter";
        }

        override
        public string ToString()
        {
            return String.Format("{0}[ID={1} FirstName={2} LastName={3} BirthDate={4}]", typeof(Employee), this.Id, this.FirstName, this.LastName, this.BirthDate);

        }
    }
}