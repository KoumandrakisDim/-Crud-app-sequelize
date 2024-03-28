class PersonController {
    addPerson(data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: `/persons`,
                method: 'POST',
                data: data,
                success: function (response) {
                    resolve(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(jqXHR.responseJSON.errors[0].msg);
                }
            });
        });
    }

    // Function to fetch and display list of persons for a specific page
    fetchPersons(page) {
        let searchFirstName;
        let searchLastName;
        let searchEmail;

        if ($('#searchFirstName').val()) {
            searchFirstName = $('#searchFirstName').val().trim();
        }
        if ($('#searchLastName').val()) {
            searchLastName = $('#searchLastName').val().trim();
        }
        if ($('#searchEmail').val()) {
            searchEmail = $('#searchEmail').val().trim();
        }

        $.ajax({
            url: '/persons',
            method: 'GET',
            data: {
                page: page,
                limit: recordsPerPage,
                searchFirstName: searchFirstName,
                searchLastName: searchLastName,
                searchEmail: searchEmail
            },
            success: function (persons) {
                var $personsList = $('#personsList');
                $personsList.empty();
                console.log(persons);
                let i = (page - 1) * 10 + 1; // Calculate index based on page
                persons.persons.forEach(function (person) {
                    $personsList.append(`<tr id=person_${person.id}>` +
                        '<td>' + i + '</td>' + // Display the index
                        '<td>' + person.firstName + '</td>' +
                        '<td>' + person.lastName + '</td>' +
                        '<td>' + person.email + '</td>' +
                        '<td><i class="bi bi-pencil text-secondary editButton gridButton" onclick="editPerson(' + person.id + ')"></i>' +
                        '<i class="bi bi-trash text-danger gridButton" onclick="personController.deletePerson(' + person.id + ')"></i></td>' +
                        '</tr>');
                    i++;
                });
            },
            error: function (error) {
                console.error('Error fetching persons:', error.responseJSON);
            }
        });
    }

    deletePerson(id) {
        $.ajax({
            url: `/persons/${id}`,
            method: 'DELETE',
            success: function (persons) {
                document.getElementById('person_' + id).remove();
            },
            error: function (error) {
                console.error('Error fetching persons:', error.responseJSON);
            }
        });
    }
    getPerson(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: `/persons/${id}`,
                method: 'GET',
                success: function (response) {
                    resolve(response)
                },
                error: function (error) {
                    console.error('Error fetching persons:', error.responseJSON);
                }
            });
        })
    }

    editPersonAjax(id, data) {
        $.ajax({
            url: `/persons/edit/${id}`,
            method: 'POST',
            data: data,
            success: function (persons) {
                document.getElementById('person_' + id).children[1].innerText = data.firstName;
                document.getElementById('person_' + id).children[2].innerText = data.lastName;
                document.getElementById('person_' + id).children[3].innerText = data.email;
                $('#newPersonModal').modal('hide');
    
            },
            error: function (error) {
                console.error('Error fetching persons:', error.responseJSON);
            }
        });
    }
}