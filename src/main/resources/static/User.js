$(document).ready(function() {
    fetch('/api/user')
        .then(response => response.json())
        .then(user => {
            $('#user-info').text(user.email + ' with roles: ' + user.roles.map(role => role.name).join(', '));
            $('#user-id').text(user.id);
            $('#user-first-name').text(user.firstName);
            $('#user-last-name').text(user.lastName);
            $('#user-age').text(user.age);
            $('#user-email').text(user.email);
            $('#user-roles').text(user.roles.map(role => role.name).join(', '));
        });
});