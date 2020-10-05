// Class Employee ______________________________________________________________________________________________________________________________________________________________________________________________
class Employee {
    constructor(json) {
        Object.assign(this, json);
    }

    getFullName() {
        return this.firstName + " " + this.lastName;
    }


    static sortByLastThenFirstName(a, b) {
        if (a.lastName < b.lastName) return -1;
        if (a.lastName > b.lastName) return 1;

        if (a.lastName == b.lastName) {
            if (a.firstName < b.firstName) return -1;
            if (a.firstName > b.firstName) return -1;
        }
    }
}



// API-Methods _________________________________________________________________________________________________________________________________________________________________________________________________
function getAllEmployees() {
    return fetch('http://localhost/api/employee')
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                console.log(res.status + ":" + res.statusText);
            }
        })
        .then(data => {
            return data;
        })
        .catch(err => {
            console.warn(err);
        });
};

function getEmployeeByID(id) {

    return fetch('http://localhost/api/employee/' + id)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                console.log(res.status + ":" + res.statusText);
            }
        })
        .then(data => {
            return data;
        })
        .catch(err => {
            console.warn(err);
        });
}

function editEmployee(id, formdata) {
    return fetch('http://localhost/api/employee/' + id, {
            method: 'PATCH',
            body: formdata
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                console.warn(res.status + ":" + res.statusText);
            }
        })
        .then(data => {
            return data;
        })
        .catch(err => {
            console.warn(err);
        });
}

function createNewEmployee(formdata) {
    return fetch('http://localhost/api/employee/new', {
            method: 'POST',
            body: formdata
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                console.warn(res.status + ":" + res.statusText);
            }
        })
        .then(data => {
            return data;
        })
        .catch(err => {
            console.warn(err);
        });
}



// DOM Methods ______________________________________________________________________________________________________________________________________________________________________________________________

// setupOverview 
function setupOverview() {
    getAllEmployees()
        .then(response => {
            let allEmployees = response.sort(Employee.sortByLastThenFirstName);
            let employeeWrapper = document.getElementsByClassName("employee-wrapper")[0];

            while (employeeWrapper.firstChild) {
                employeeWrapper.removeChild(employeeWrapper.firstChild);
            }

            for (employee of allEmployees) {
                let employeeTMP = new Employee(employee);
                let employeeDivTMP = employeeDiv(employeeTMP);
                employeeWrapper.append(employeeDivTMP);

                let inputfields = document.getElementsByTagName("input");
                controlInput(inputfields, false);

                openDetail = document.getElementById("employee-" + employeeTMP.id).getElementsByClassName("openDetails")[0];
                openDetail.addEventListener("click", (event) => {
                    id = event.target.getAttribute("employee-id");
                    openDetails(id, false);
                });

                editDetail = document.getElementById("employee-" + employeeTMP.id).getElementsByClassName("editDetails")[0];
                editDetail.addEventListener("click", (event) => {
                    id = event.target.getAttribute("employee-id");
                    openDetails(id, true);
                });

                unfoldEmployee = document.getElementById("employee-" + employeeTMP.id).getElementsByClassName("unfoldEmployee")[0];
                unfoldEmployee.addEventListener("click", (event) => {
                    console.log("clicked unfold");
                });
            }
        })
        .catch(err => console.warn(err));
}

// Generate Div Element with data from Employee
function employeeDiv(employee) {
    let employeeTMP = new Employee(employee);
    htmlString = `
                            <div id='employee-${employeeTMP.id}' class='employee'>
                                <div class='employee-header'>
                                    <div><i employee-id='${employeeTMP.id}' class='fas fa-user-circle openDetails button'></i></div>
                                    <p class='bold fullName button'> ${employeeTMP.getFullName()}</p>
                                    <div class='tooltip'><i employee-id='${employeeTMP.id}' class='editDetails far fa-edit button'></i> | <i class='unfoldEmployee fas fa-chevron-down button'></i>
                                    </div>
                                </div>
                                <div class='employee-flex-wrapper'>
                                    <div class='employee-img roundimg button'> <img src='https://images.assetsdelivery.com/compings_v2/decade3d/decade3d1406/decade3d140600029.jpg' /></div>

                                    <div class='employee-data-wrapper'>
                                        <div class='employee-data'><label for='firstName'>Vorname</label><input name='firstName' value='${employeeTMP.firstName}'></input>
                                        </div>
                                        <div class='employee-data'><label for='lastName'>Nachname</label><input id='lastName-${employeeTMP.id}' name='lastName' value='${employeeTMP.lastName}'></input>
                                        </div>
                                        <div class='employee-data'><label for='function'>Funktion</label><input id='function-${employeeTMP.id}' name='function' value='${employeeTMP.function}'></input>
                                        </div>
                                    </div>

                                    <div class='employee-data-wrapper'>
                                        <div class='employee-data'><label for='location'>Standort</label><input id='location-${employeeTMP.id}' name='location' value='${employee.location}'></input>
                                        </div>
                                        <div class='employee-data'><label for='email'>e-Mail</label><input id='email-${employeeTMP.id}' name='email' value='${employeeTMP.email}'></input>
                                        </div>
                                        <div class='employee-data'><label for='phoneNumber'>Telefonnummer</label><input id='phoneNumber-${employeeTMP.id}' name='phoneNumber' value='${employeeTMP.phoneNumber}'></input>
                                        </div>
                                        <div class='employee-data'><label for='mobileNumber'>Mobil</label><input id='mobileNumber-${employeeTMP.id}' name='mobileNumber' value='${employeeTMP.mobileNumber}'></input>
                                        </div>
                                    </div>
                                </div>
                                <div class='employee-footer'>
                                    <div class='actions'><i class='fas fa-envelope-square button'></i> <i class='fas fa-phone-square-alt button'></i></div>
                                </div>
                            </div>
                        `;

    div = createElementFromHTML(htmlString);
    return div;
}

// Open Detailed View of Employee
function openDetails(id = null, editmode = true) {
    let employeeDetails = document.getElementById("employee-details");
    let employeeForm = document.getElementById("employee-details-form");
    let formFields = employeeForm.getElementsByTagName("input");
    controlInput(formFields, editmode);

    if (id == null) {
        employeeDetails.getElementsByClassName("fullName")[0].innerHTML = "Neuer Mitarbeiter";
        employeeForm.reset();
        Array.from(employeeForm.getElementsByTagName("Input")).forEach(item => item.defaultValue = "");
        employeeDetails.classList.add("active");
        employeeForm.setAttribute("editmode", editmode);
        document.getElementById("submitEmployee").setAttribute("editmode", editmode);
    } else {
        getEmployeeByID(id)
            .then(response => {
                let fieldsMap = new Map();
                Array.prototype.map.call(formFields, function(field) {
                    fieldsMap[field.getAttribute("Name")] = field;
                });

                employeeForm.reset();
                let employeeTMP = new Employee(response);
                employeeDetails.getElementsByClassName("fullName")[0].innerHTML = employeeTMP.getFullName();
                for (const [key, value] of Object.entries(employeeTMP)) {
                    const field = fieldsMap[key];
                    if (field) {
                        fieldsMap[key].defaultValue = value;
                    }
                }

                sessionStorage.setItem("DetailsCurrentEmployee", employeeTMP);
                sessionStorage.setItem("DetailsUserID", employeeTMP.id);

                employeeForm.reset();
                employeeDetails.classList.add("active");
                employeeForm.setAttribute("editmode", editmode);
                document.getElementById("submitEmployee").setAttribute("editmode", editmode);
            });
    }
    return true;
}



// General Methods ____________________________________________________________________________________________________________________________________________________________________________________________

// returns NodeElement from HTML-String
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

// 
function controlInput(inputfields, editmode) {
    for (field of inputfields) {
        if (editmode == true) {
            field.removeAttribute("readonly");
        } else {
            field.setAttribute("readonly", true);
        }
    }
}

// convert img to data:URL
function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function jumpTo(h) {
    var url = location.href; //Save down the URL without hash.
    location.href = "#" + h; //Go to the target element.
    history.replaceState(null, null, url); //Don't like hashes. Changing it back.
    console.log("jumping to " + h);
}

// Prepare Page _______________________________________________________________________________________________________________________________________________________________________________________________
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");

    setupOverview();

    document.getElementById("closeDetails").addEventListener("click", (event) => {
        event.preventDefault();
        closeDetails();
    });

    function closeDetails() {
        document.getElementById("employee-details").classList.remove("active");
        sessionStorage.removeItem("DetailsUserID");
        sessionStorage.removeItem("DetailsCurrentEmployee");
    }

    document.getElementById("button-create-new-employee").addEventListener("click", (event) => {
        event.preventDefault();
        sessionStorage.setItem("submitMode", "New");
        openDetails();
    });

    document.getElementById("submitEmployee").addEventListener("click", (event) => {
        event.preventDefault();
        let form = document.getElementById("employee-details-form");
        let formData = new FormData(form);

        if (sessionStorage.getItem("submitMode") == "New") {
            createNewEmployee(formData)
                .then(response => {
                    employee = new Employee(response);
                    sessionStorage.removeItem("submitMode");
                    closeDetails();
                    setupOverview()
                })
        } else {
            id = sessionStorage["DetailsUserID"];
            editEmployee(id, formData)
                .then(response => {
                    employee = new Employee(response);
                    original = document.getElementById("employee-" + response.id);
                    replace = employeeDiv(response);

                    originalData = original.getElementsByClassName("employee-flex-wrapper")[0];
                    originalHeader = original.getElementsByClassName("fullName")[0];

                    replaceData = replace.getElementsByClassName("employee-flex-wrapper")[0];

                    originalData.innerHTML = replaceData.innerHTML;
                    originalHeader.innerHTML = employee.firstName + employee.lastName
                });
        }
    });
});