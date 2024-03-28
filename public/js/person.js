var personController = new PersonController();
let currentPage = 1;
let recordsPerPage = 10;
personEventListeners();
personController.fetchPersons(currentPage);

function personEventListeners() {
    $('#prevPage').click(function () {
        if (currentPage > 1) {
            currentPage--;
            personController.fetchPersons(currentPage);
        }
    });
    $('#nextPage').click(function () {
        currentPage++;
        personController.fetchPersons(currentPage);
    });
    $('#recordsPerPage').change(function () {
        recordsPerPage = parseInt($(this).val());
        currentPage = 1;
        personController.fetchPersons(currentPage);
    });
    $('#recordsPerPage').change(function () {
        recordsPerPage = parseInt($(this).val());
        currentPage = 1;
        personController.fetchPersons(currentPage);
    });
    window.changePage = function (page) {
        currentPage = page;
        personController.fetchPersons(currentPage);
    }
    $('#addPersonButton').on('click', addPersonClicked);
}
function generatePagination(totalPages) {
    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${i})">${i}</a></li>`;
    }
    $('#prevPage').after(paginationHTML);
}

function searchOnEnter(event) {
    if (event.keyCode === 13) { // Check if Enter key is pressed
        personController.fetchPersons(currentPage);
    }
}
/**
 * 
 * @param {*} id 
 */
async function editPerson(id) {
    try {
        const data = await personController.getPerson(id);
        setModalFields(data);
        $('#newPersonModal').modal('show');
    } catch (error) {
        showAlert('modalAlert', error)
    }

}

function setModalFields(data) {
    document.getElementById('newPersonModal').personId = data.id;
    $('#firstName').val(data.firstName);
    $('#lastName').val(data.lastName);
    $('#email').val(data.email);
}

function clearFields() {
    $('#firstName').val('');
    $('#lastName').val('');
    $('#email').val('');
    document.getElementById('email').removeEventListener('input', checkEmailValidity);
    document.getElementById('email').classList.remove('is-invalid');
}

function addPersonClicked() {
    document.getElementById('newPersonModal').personId = '';
    clearFields();
    $('#newPersonModal').modal('show');
}
/**
 * 
 * @param {*} email 
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function checkEmailValidity() {
    if (!isValidEmail($('#email').val())) {
        document.getElementById('email').classList.add('is-invalid');
    } else {
        document.getElementById('email').classList.remove('is-invalid');
    }
}

async function addPersonView() {
    if (!isValidEmail($('#email').val())) {
        document.getElementById('email').classList.add('is-invalid');
        document.getElementById('email').addEventListener('input', checkEmailValidity);
        return;
    }
    if (document.getElementById('addPersonForm').checkValidity()) {
        let id = document.getElementById('newPersonModal').personId;
        const data = { firstName: $('#firstName').val(), lastName: $('#lastName').val(), email: $('#email').val() }

        if (id) {
            personController.editPersonAjax(id, data);
            return;
        }
        try {
            await personController.addPerson(data);
            window.location.href = "/";

        } catch (error) {
            console.log(error)
            showAlert('modalAlert', error);
        }
    } else {
        document.getElementById('addPersonForm').classList.add('was-validated')
    }
}

/**
 * 
 * @param {*} alertId 
 * @param {*} alertText 
 */
function showAlert(alertId, alertText) {
    let alert = document.getElementById(alertId);
    alert.innerText = alertText;
    alert.style.opacity = 1;
    alert.style.zIndex = 1000;

    setTimeout(() => {
        alert.style.opacity = 0;
        setTimeout(() => {
            alert.style.zIndex = 0;

        }, "500");
    }, "2000");
}