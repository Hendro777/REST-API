using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace REST_API
{
    public class Person
    {
        private string firstName;
        public string FirstName
        {
            get { return firstName; }
            set { firstName = value; }
        }
        private string lastName;
        public string LastName
        {
            get { return lastName; }
            set { lastName = value; }
        }


        private string birthDate;
        public string BirthDate
        {
            get { return birthDate; }
            set { birthDate = value; }
        }


        public Person()
        {

        }

        public Person(string firstname, string lastname, string birthdate)
        {
            this.FirstName = firstname;
            this.LastName = lastname;
            this.BirthDate = birthdate;
        }
    }
}
