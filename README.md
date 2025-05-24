# Schedule Platform

## Description

Schedule Platform is a comprehensive scheduling application designed for educational institutions. It allows users to view, filter, and manage schedule entries based on days, departments, groups, and teachers.

## Features

- **Role-based Access Control**: Different views and permissions for students, teachers, and administrators
- **Schedule Visualization**: Interactive table showing schedule for all departments and groups
- **Filtering Options**: Filter schedule by day, teacher, and department
- **Group-specific View**: Dedicated view for specific group schedules
- **Schedule Management**: Add, edit, and delete schedule entries (for administrators)
- **Data Persistence**: Local storage for user-specific schedule data
- **Resource Management**: Validation for teacher and room availability
- **Color Coding**: Visual distinction between different types of lessons and events

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_URL>
   ```
2. Navigate to the project directory:
   ```bash
   cd schedule-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm run dev
   ```

## Usage Guide

### Authentication

The application uses email-based authentication to determine user roles:

- Enter your email to log in
- The system automatically assigns a role (student, teacher, or admin) based on the email

### Main Interface

- **Main Schedule Table**: Displays all departments, groups, and their scheduled classes
- **Day Selection**: Use the dropdown at the top to select different days
- **Department Filter**: Use the department dropdown to filter specific departments
- **Teacher Filter**: (Available for teachers and admins) Filter to see a specific teacher's schedule

### Group View

- Click on any group to view its detailed weekly schedule
- In group view, you can see all lessons for the selected group across all days
- Use the "Back" button to return to the main schedule view

### Adding Lessons (Admin only)

1. Click on an empty cell in the schedule grid
2. Choose between adding a lesson or an event
3. For lessons:
   - Search for existing lessons or create a new one
   - Select a teacher from the dropdown (with availability validation)
   - Select a building block and room (with availability validation)
   - Set the duration of the lesson
4. For events:
   - Search for existing events or create a new one
   - Optionally assign a teacher and room
   - Set the duration of the event
5. Click "Save" to add the entry to the schedule

### Editing Lessons (Admin only)

1. Click on an existing lesson or event
2. Modify any details as needed (teacher, room, duration, etc.)
3. Click "Save" to update the schedule

### Deleting Lessons (Admin only)

- Click the "x" in the top-right corner of any lesson card to delete it

## Project Structure

- `src/components`: Contains all application components
  - `Header`: Application header with user info and logout button
  - `AuthForm`: Login form component
  - `MainTable`: Main schedule visualization component
  - `LessonCard`: Individual lesson display component
  - `AddLessonForm`: Form for adding new lessons/events
  - `EditLessonForm`: Form for editing existing lessons/events
- `src/store`: Zustand stores for state management
  - `useScheduleStore`: Manages schedule entries
  - `useLessonsStore`: Manages lesson definitions
  - `useEventsStore`: Manages event definitions
  - `useTeacherStore`: Manages teacher data
  - `useRoomsStore`: Manages room availability
- `src/hooks`: Custom React hooks
  - `useLocalStorage`: Hook for persistent storage with user context
  - `useTableData`: Data management for the schedule table
  - `useScheduleValidation`: Validation logic for schedule entries

## Technical Details

- Built with React and TypeScript
- Uses Zustand for state management
- Implements localStorage for data persistence with user-specific namespacing
- CSS modules for component styling

## License

MIT License
