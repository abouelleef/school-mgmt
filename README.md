# School Management System API

This API manages data for schools, classrooms, and students. Two types of system users exist: school admins and super admins.

### Super Admin Privileges:

- **School Management**: Super admins possess the capability to both create new schools within the system and access information regarding any existing school.

- **User Management**: They have full control over user management, including the ability to create, read, and delete all users. This includes both super admins and school admins.

- **User Creation**: Upon creating a new user, whether it be a super admin or school admin, the API issues a long-lived token as part of the response. This token serves as a crucial component in generating short-lived access tokens essential for regular API usage.

- **Limited User Creation**: Exclusive to super admins is the privilege of creating new users. This authority is not extended to school admins.

### School Admin Privileges:

- **Classroom Management**: Within their designated school, school admins possess comprehensive control over classroom management. This includes the creation, access, updating, and deletion of classrooms.

- **Student Management**: Similarly, school admins hold authority over student management within their assigned school. They can create, access, update, and delete student records.

#### Note:

- **School Affiliation**: School admins are required to be affiliated with a specific school during their creation within the system.

- **Short-lived Access Tokens:** These tokens, crucial for API interaction, are generated using the long-lived token issued upon user creation.

- **Restriction on School Admins:** It's important to note that school admins are confined to managing only the school they are affiliated with. They do not have the authority to oversee other schools or manage classrooms and students outside their assigned school.

#### Documentation & Samples:

For convenience, Postman collections and environments are included in the postman folder within this repository. Additionally, sample login credentials for both Super Admin and School Admin accounts are provided below:

```json
{
  "email": "admin@admin.com",
  "password": "admin"
}
```

```json
{
  "email": "school@admin.com",
  "password": "school"
}
```

### Environment variables

add a .env file in the root directory and set the missing ### environment parameters

```
LONG_TOKEN_SECRET   =###
SHORT_TOKEN_SECRET  =###
NACL_SECRET         =###
MONGO_URI           =###
```
