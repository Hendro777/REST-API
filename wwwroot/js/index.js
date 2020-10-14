// setupOverview 
async function setupOverview() {
    if (localStorage.getItem("allEmployees") === null) {
        await getAllEmployees()
            .then(response => {
                console.log("allEmployees from Fetch");
                allEmployees = response;
                localStorage.setItem("allEmployees", JSON.stringify(allEmployees));
            })
            .catch(err => console.warn(err));
    } else {
        console.log("allEmployees from LocalStorage");
        allEmployees = JSON.parse(localStorage.getItem("allEmployees"));
    }

    // sortie nach Auswahl
    let sortCriteria = document.getElementById("sortSelect").value;
    let sortFeature;
    console.log(sortCriteria);
    switch (sortCriteria) {
        case "firstName":
            allEmployees.sort(Employee.sortByFirstThenLastName);
            sortFeature = function(employee) {
                return employee["firstName"].charAt(0).toUpperCase();
            }
            break;
        case "lastName":
        default:
            sortFeature = function(employee) {
                return employee["lastName"].charAt(0).toUpperCase();
            }
            allEmployees.sort(Employee.sortByLastThenFirstName);
    }

    // leere Wrapper mit allen employee-Divs
    let employeeWrapper = document.getElementsByClassName("employee-wrapper")[0];
    while (employeeWrapper.firstChild) {
        employeeWrapper.removeChild(employeeWrapper.firstChild);
    }

    // Erzeuge wrapper nach Sortierkriterium
    let currentSortFeature = null;
    let currentSortDiv = null;
    for (var i = 0; i < allEmployees.length; i++) {
        employee = allEmployees[i];

        let thisSortFeature = sortFeature(employee);

        if (currentSortFeature == null || thisSortFeature != currentSortFeature) {
            // set new sort feature
            currentSortFeature = thisSortFeature;

            // create new sort-div
            htmlStringDiv = `<div id="sort-Wrapper-${currentSortFeature}" class="sort-Wrapper">
                                <div class="sort-Header button"><span class="button">${currentSortFeature} <i class="fas fa-chevron-down"></i></span></div>
                        </div>`;

            currentSortDiv = createElementFromHTML(htmlStringDiv);
            employeeWrapper.appendChild(currentSortDiv);
        }

        let employeeTMP = new Employee(employee);
        let employeeDivTMP = employeeDiv(employeeTMP);
        currentSortDiv.append(employeeDivTMP);

        let inputfields = employeeDivTMP.getElementsByTagName("input");
        controlInput(inputfields, false);

        openDetail = employeeDivTMP.getElementsByClassName("openDetails");
        for (let j = 0; j < openDetail.length; j++) {
            openDetail[j].addEventListener("click", (event) => {
                id = event.target.getAttribute("employee-id");
                openDetails(id, false);
            });
        }

        editDetail = employeeDivTMP.getElementsByClassName("editDetails")[0];
        editDetail.addEventListener("click", (event) => {
            id = event.target.getAttribute("employee-id");
            openDetails(id, true);
        });

        unfoldEmployee = employeeDivTMP.getElementsByClassName("unfoldEmployee")[0];
        unfoldEmployee.addEventListener("click", (event) => {
            id = employeeTMP.id;
            employeeFlexWrapper = document.getElementById("employee-" + id).getElementsByClassName("employee-flex-wrapper")[0];
            employeeFlexWrapper.classList.toggle("hidden");
        });
    }

    Array.prototype.slice.call(document.getElementsByClassName("sort-Header"), 0).forEach((header) => {
        header.addEventListener("click", (event) => {
            sortWrapper = event.currentTarget.parentNode;
            sortWrapper.classList.toggle("open");
            sortWrapper.scrollIntoView();
        });
    });

    Array.prototype.slice.call(document.getElementsByClassName("sort-Wrapper"), 0).forEach((sortWrapper) => {
        empDivs = sortWrapper.getElementsByClassName("employee");
        empDivs[0].style.marginTop = "10px";
        empDivs[empDivs.length - 1].style.marginBottom = "10px";
    });
}



// Open Detailed View of Employee
function openDetails(id = null, editmode = true) {
    let employeeDetails = document.getElementById("employee-details");
    let employeeDetailsWrapper = document.getElementsByClassName("detail-wrapper")[0];
    let employeeForm = document.getElementById("employee-details-form");
    let formFields = employeeForm.getElementsByTagName("input");

    console.log(employeeDetailsWrapper.scrollTop);
    employeeDetailsWrapper.scrollTop = 0;
    console.log(employeeDetailsWrapper.scrollTop);
    controlInput(formFields, editmode);

    if (id == null) {
        employeeDetails.getElementsByClassName("fullName")[0].innerHTML = "Neuer Mitarbeiter";
        employeeForm.reset();
        Array.from(employeeForm.getElementsByTagName("Input")).forEach(item => item.defaultValue = "");
        document.getElementById("deleteEmployee").style.display = "none";
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

                document.getElementById("deleteEmployee").style.display = "initial";
                employeeDetails.classList.add("active");
                employeeForm.setAttribute("editmode", editmode);
                document.getElementById("submitEmployee").setAttribute("editmode", editmode);
            });
    }
    return true;
}



// Generate Div Element with data from Employee
function employeeDiv(employee) {
    let employeeTMP = new Employee(employee);
    htmlString = `
                            <div id='employee-${employeeTMP.id}' class='employee'>
                                <div class='employee-header'>
                                    <div><i employee-id='${employeeTMP.id}' class='fas fa-user-circle openDetails button'></i></div>
                                    <p class='bold fullName openDetails button ' employee-id='${employeeTMP.id}'> ${employeeTMP.getFullName()}</p>
                                    <div class='tooltip'><i employee-id='${employeeTMP.id}' class='editDetails far fa-edit button'></i> | <i class='unfoldEmployee fas fa-chevron-down button'></i>
                                    </div>
                                </div>
                                <div class='employee-flex-wrapper hidden'>
                                    <div class='employee-img openDetails roundimg button'> <img employee-id='${employeeTMP.id}' src='https://images.assetsdelivery.com/compings_v2/decade3d/decade3d1406/decade3d140600029.jpg' /></div>

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
                                    <div class="less-info">
                                        <div class='employee-data'><label for='function'>Funktion</label><input id='function-${employeeTMP.id}' name='function' value='${employeeTMP.function}'></input>
                                        </div>
                                        <div class='employee-data'><label for='email'>e-Mail</label><input id='email-${employeeTMP.id}' name='email' value='${employeeTMP.email}'></input></div>
                                        <div class='employee-data'><label for='phoneNumber'>Telefonnummer</label><input id='phoneNumber-${employeeTMP.id}' name='phoneNumber' value='${employeeTMP.phoneNumber}'></input></div>
                                    </div>
                                </div>
                                <div class='employee-footer'>
                                    <div class='actions'><a href="mailto:${employeeTMP.email}"><i class='fas fa-envelope-square button'></i></a> <a href="tel:${employeeTMP.phoneNumber.trim().replaceAll(" ", "")}"><i class='fas fa-phone-square-alt button'></i></a></div>
                                </div>
                            </div>
                        `;

    div = createElementFromHTML(htmlString);
    return div;
}



// Prepare Page _______________________________________________________________________________________________________________________________________________________________________________________________
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");

    setupOverview();

    setupInfoPopup();

    /*
    document.getElementById("sort-Wrapper-Prototyp").getElementsByClassName("sort-Header")[0].addEventListener("click", (event) => {
        sortWrapper = event.currentTarget.parentNode;
        employees = sortWrapper.getElementsByClassName("employee");

        employees[0].style.marginTop = "10px";
        employees[employees.length - 1].style.marginBottom = "10px";

        sortWrapper.classList.toggle("open");
        console.log("toggle");

        sortWrapper.scrollIntoView();
    });
    */

    document.getElementById("backToTop").addEventListener("click", (event) => {
        /*
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
        */
        scrollToTop();
    });

    document.getElementById("sortSelect").addEventListener("change", (event) => {
        setupOverview();
    })

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
        let employee = serializeForm(form);

        if (sessionStorage.getItem("submitMode") == "New") {
            createNewEmployee(employee)
                .then(response => {
                    sessionStorage.removeItem("submitMode");
                    let allEmployees = JSON.parse(localStorage.getItem("allEmployees"));
                    allEmployees.push(response);
                    localStorage.setItem("allEmployees", JSON.stringify(allEmployees));
                    closeDetails();
                    setupOverview()
                })
                .catch(err => {
                    if (err.status == 400) {
                        console.log("test");
                        err.response.json().then(errObj => {
                            console.log(errObj.title);
                            infoPopup(errObj.title, "error", 5);
                        });
                    } else {

                    }
                });
        } else {
            id = sessionStorage["DetailsUserID"];
            editEmployee(id, employee)
                .then(response => {
                    employee = new Employee(response);
                    original = document.getElementById("employee-" + response.id);
                    replace = employeeDiv(response);

                    originalData = original.getElementsByClassName("employee-flex-wrapper")[0];
                    originalHeader = original.getElementsByClassName("fullName")[0];

                    replaceData = replace.getElementsByClassName("employee-flex-wrapper")[0];

                    originalData.innerHTML = replaceData.innerHTML;
                    originalHeader.innerHTML = employee.firstName + employee.lastName

                    let allEmployees = JSON.parse(localStorage.getItem("allEmployees"));
                    allEmployees = allEmployees.filter((employee) => {
                        return employee.id != id;
                    });
                    allEmployees.push(response);
                    localStorage.setItem("allEmployees", JSON.stringify(allEmployees));
                    closeDetails();
                });
        }
    });

    document.getElementById("deleteEmployee").addEventListener("click", (event) => {
        event.preventDefault();
        let id = sessionStorage.getItem("DetailsUserID");
        if (confirm("Wollen sie den Mitarbeiter wirklich löschen?")) {
            deleteEmployee(id)
                .then(response => {
                    let allEmployees = JSON.parse(localStorage.getItem("allEmployees"));
                    allEmployees = allEmployees.filter((employee) => {
                        return employee.id != id;
                    });
                    localStorage.setItem("allEmployees", JSON.stringify(allEmployees));
                    empDiv = document.getElementById("employee-" + id);
                    empDiv.parentNode.removeChild(empDiv);
                    closeDetails();
                });
        }
    });

    window.onscroll = function() {
        let nav = document.getElementById("nav");
        let employeeDetails = document.getElementsByClassName("employee-details")[0];

        let viewportoffset = nav.getBoundingClientRect();
        let offsetTop = viewportoffset.top;
        employeeDetails.style.top = (nav.offsetHeight + offsetTop) + "px";

        sort = document.getElementById("sort-Criteria");
        backToTop = document.getElementById("backToTop");
        if ((sort.getBoundingClientRect().top - (nav.offsetHeight - sort.offsetHeight)) < 0) {
            if (!backToTop.classList.contains("show")) {
                backToTop.classList.add("show");
            }
        } else {
            if (backToTop.classList.contains("show")) {
                backToTop.classList.remove("show");
            }
        }
    };
});