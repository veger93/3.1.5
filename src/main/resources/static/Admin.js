document.addEventListener('DOMContentLoaded', () => {
    let editingUserId = null;

    fetch('/api/admin')
        .then(response => response.json())
        .then(user => {
            $('#user-info').text(user.email + ' with roles: ' + user.roles.map(role => role.name).join(', '));
        });
    // Отображение всех пользователей
    fetch('/api/admin/users')
        .then(response => response.json())
        .then(users => {
            const usersTbody = document.getElementById('users-tbody');
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.age}</td>
                    <td>${user.roles.map(role => role.name).join(', ')}</td>
                    <td>
                        <button class="btn btn-primary edit-btn" data-id="${user.id}">Edit</button>
                    </td>
                    <td>
                        <button class="btn btn-danger delete-btn" data-id="${user.id}">Delete</button>
                    </td>
                `;
                usersTbody.appendChild(row);
            });
        });

    // Работа с ролями
    fetch('/api/admin/roles')
        .then(response => response.json())
        .then(roles => {
            const rolesSelect = document.getElementById('roles');
            roles.forEach(role => { // для нового
                const option = document.createElement('option');
                option.value = role.id;
                option.text = role.name;
                rolesSelect.appendChild(option);
            });

            const editRolesSelect = document.getElementById('editRoles');
            roles.forEach(role => { // для редактирования
                const option = document.createElement('option');
                option.value = role.id;
                option.text = role.name;
                editRolesSelect.appendChild(option);
            });
        });

    // Обработка формы нового пользователя
    document.getElementById('user-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedRoles = Array.from(document.getElementById('roles').selectedOptions).map(option => ({
            id: option.value,
            name: option.text
        }));

        const user = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: document.getElementById('age').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            roles: selectedRoles
        };

        fetch('/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(response => response.json())
            .then(savedUser => {
                const usersTbody = document.getElementById('users-tbody');
                const row = document.createElement('tr');
                row.innerHTML = `
                        <td>${savedUser.id}</td>
                        <td>${savedUser.firstName}</td>
                        <td>${savedUser.lastName}</td>
                        <td>${savedUser.email}</td>
                        <td>${savedUser.age}</td>
                        <td>${savedUser.roles.map(role => role.name).join(', ')}</td>
                        <td>
                            <button class="btn btn-primary edit-btn" data-id="${savedUser.id}">Edit</button>
                        </td>
                        <td>
                            <button class="btn btn-danger delete-btn" data-id="${savedUser.id}">Delete</button>
                        </td>
                    `;
                usersTbody.appendChild(row);

                document.getElementById('user-form').reset();
            });
    });

    // Удаление
    document.getElementById('users-tbody').addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const userId = event.target.dataset.id;
            fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            }).then(() => {
                event.target.closest('tr').remove();
            });
        }
    });

    // вывод полей на Редактирование
    document.getElementById('users-tbody').addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-btn')) {
            const userId = event.target.dataset.id;
            fetch(`/api/admin/users/${userId}`)
                .then(response => response.json())
                .then(user => {
                    document.getElementById('edit-user-id').value = user.id;
                    document.getElementById('editFirstName').value = user.firstName;
                    document.getElementById('editLastName').value = user.lastName;
                    document.getElementById('editAge').value = user.age;
                    document.getElementById('editEmail').value = user.email;
                    document.getElementById('editPassword').value = '';

                    const editRolesSelect = document.getElementById('editRoles');
                    Array.from(editRolesSelect.options).forEach(option => {
                        option.selected = user.roles.some(role => role.id == option.value);
                    });

                    $('#editUserModal').modal('show');
                });
        }
    });

    // отправка формы редактирования
    document.getElementById('edit-user-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const userId = document.getElementById('edit-user-id').value;
        const selectedRoles = Array.from(document.getElementById('editRoles').selectedOptions).map(option => ({
            id: option.value,
            name: option.text
        }));

        const user = {
            id: userId,
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            age: document.getElementById('editAge').value,
            email: document.getElementById('editEmail').value,
            password: document.getElementById('editPassword').value,
            roles: selectedRoles
        };

        fetch(`/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(response => response.json())
            .then(savedUser => {
                const row = document.querySelector(`button[data-id="${savedUser.id}"]`).closest('tr');
                row.innerHTML = `
                        <td>${savedUser.id}</td>
                        <td>${savedUser.firstName}</td>
                        <td>${savedUser.lastName}</td>
                        <td>${savedUser.email}</td>
                        <td>${savedUser.age}</td>
                        <td>${savedUser.roles.map(role => role.name).join(', ')}</td>
                        <td>
                            <button class="btn btn-primary edit-btn" data-id="${savedUser.id}">Edit</button>
                        </td>
                        <td>
                            <button class="btn btn-danger delete-btn" data-id="${savedUser.id}">Delete</button>
                        </td>
                    `;

                $('#editUserModal').modal('hide');
            });
    });
});