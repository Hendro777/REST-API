// Class Employee ______________________________________________________________________________________________________________________________________________________________________________________________
class Employee {
    constructor(json) {
        Object.assign(this, json);
    }

    getFullName() {
        return this.firstName + " " + this.lastName;
    }


    static sortByLastThenFirstName(a, b) {
        var lastNameA = a.lastName.toLowerCase(),
            lastNameB = b.lastName.toLowerCase();

        if (lastNameA < lastNameB)
            return -1;
        if (lastNameA > lastNameB)
            return 1;
        return 0;
    }

    static sortByFirstThenLastName(a, b) {
        var firstNameA = a.firstName.toLowerCase(),
            firstNameB = b.firstName.toLowerCase();
        if (firstNameA < firstNameB)
            return -1;
        if (firstNameA > firstNameB)
            return 1;
        return 0;
    }

    static sortById(a, b) {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
    }
}



// API-Methods _________________________________________________________________________________________________________________________________________________________________________________________________
async function getAllEmployees() {
    const response = await fetch(window.location.protocol + "//" + window.location.hostname + '/api/employee');

    if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        return jsonResponse;
    } else {
        throw new HttpException("Couldn't get all Employees: " + response.status + " - " + response.statusText, response);
    }
};

async function getEmployeeByID(id) {

    const response = await fetch(window.location.protocol + "//" + window.location.hostname + '/api/employee/' + id);

    if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        return jsonResponse;
    } else {
        throw new HttpException("Couldn't get Employee by ID: " + response.status + " - " + response.statusText, response);
    }
}

async function editEmployee(id, employee) {
    const response = await fetch(window.location.protocol + "//" + window.location.hostname + '/api/employee/' + id, {
        method: 'PATCH',
        body: JSON.stringify(employee),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        return jsonResponse;
    } else {
        throw new HttpException("Couldn't edit Employee: " + response.status + " - " + response.statusText, response);
    }
}

async function deleteEmployee(id) {
    const response = await fetch(window.location.protocol + "//" + window.location.hostname + '/api/employee/' + id, {
        method: 'DELETE',
    });

    if (response.status >= 200 && response.status <= 299) {
        console.log("Successfully deleted employee");
    } else {
        throw new HttpException("Employee couldn't be deleted: " + response.status + " - " + response.statusText, response);
    }
}

async function createNewEmployee(employee) {
    const response = await fetch(window.location.protocol + "//" + window.location.hostname + '/api/employee/new', {
        method: 'POST',
        body: JSON.stringify(employee),
        headers: {
            'Content-Type': 'application/json'
        }
    });


    if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        return jsonResponse;
    } else {
        throw new HttpException("Employee couldn't be created: " + response.status + " - " + response.statusText, response);
    }
}



// custom HTTP Exception to make handling better from calling functions
function HttpException(message, errorResponse) {
    const error = new Error(message);
    error.response = errorResponse;
    error.status = errorResponse.status;
    error.statusText = errorResponse.statusText;
    console.warn("HTTP Error - " + message);
    return error;
}