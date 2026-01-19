# EduNexus Backend

Express + MongoDB backend with role-based authentication and course management.

## Setup

```bash
cd backend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Student Routes
- `GET /api/student/courses` - View all courses
- `POST /api/student/courses/:courseId/enroll` - Enroll in course
- `GET /api/student/my-courses` - Get enrolled courses
- `POST /api/student/courses/:courseId/unenroll` - Unenroll from course

### Admin Routes
- `POST /api/admin/courses` - Create course
- `GET /api/admin/courses` - Get all courses
- `PUT /api/admin/courses/:courseId` - Update course
- `DELETE /api/admin/courses/:courseId` - Delete course
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:userId` - Delete user

## Authentication

Send token in Authorization header:
```
Authorization: Bearer <token>
```

## Roles
- `student` - Can view courses and enroll/unenroll
- `admin` - Can create, update, delete courses and manage users

## MongoDB

Connected to: `mongodb+srv://suto:babai@sutomongo.znpql9n.mongodb.net/?appName=sutomongo`
