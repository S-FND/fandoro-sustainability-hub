
# Fandoro Code Organization

This codebase is organized by user types to make it easier to maintain and extend. Each user type has its own dedicated folder structure.

## Directory Structure

- `src/features/` - Contains feature modules organized by user type
  - `admin/` - Admin-specific components, pages, and logic
  - `enterprise/` - Enterprise user-specific components, pages, and logic
  - `employee/` - Employee user-specific components, pages, and logic
  - `partner/` - Partner user-specific components, pages, and logic
  - `vendor/` - Vendor/Supplier user-specific components, pages, and logic
  - `shared/` - Components, hooks, and utilities shared across user types

- `src/components/` - Contains general UI components that can be used across the application
- `src/contexts/` - Contains global context providers
- `src/pages/` - Contains legacy pages that will be migrated to the feature structure

## Guidelines for Adding New Code

When adding new functionality:

1. Determine which user type the functionality belongs to
2. Add the code to the appropriate folder within `src/features/`
3. For components or utilities that will be used across multiple user types, add them to `src/features/shared/`
4. Follow the structure within each feature folder:
   - `pages/` - For route-level components
   - `components/` - For UI components specific to this user type
   - `hooks/` - For custom hooks specific to this user type
   - `utils/` - For utility functions specific to this user type

## Example

Adding a new dashboard for enterprise users:
```
src/features/enterprise/pages/EnterpriseReportDashboard.tsx
src/features/enterprise/components/ReportCard.tsx
```

Adding a shared component used by multiple user types:
```
src/features/shared/components/DataTable.tsx
```
