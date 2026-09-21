# 📱 MASTER AI PROMPT: Native Android App for ExpenseManager

> **System Goal**: Build a modern, feature-complete, high-performance native Android application for **ExpenseManager** with Jetpack Compose (or Flutter/React Native), matching 100% of the web application's features, backend API integrations, and delivering a clean, premium Material 3 UI/UX experience.

---

## 🎯 1. App Overview & Architecture

- **App Name**: ExpenseManager Mobile
- **Target OS**: Android (API level 26+ / Android 8.0+)
- **Primary Tech Stack**: 
  - **Language**: Kotlin 1.9+
  - **UI Toolkit**: Jetpack Compose with Material Design 3 (MD3)
  - **Architecture**: MVVM / MVI + Clean Architecture (Repository Pattern, UseCases, StateFlow)
  - **Async/Concurrency**: Kotlin Coroutines & Flow
  - **Dependency Injection**: Hilt / Koin
  - **Networking**: Retrofit 2 + OkHttp3 + Moshi / Kotlinx Serialization
  - **Local Persistence / Offline Caching**: Room DB + EncryptedSharedPreferences (Datastore)
  - **Charts & Visualization**: Vico Chart Library / MPAndroidChart / Compose Canvas Charts
  - **Navigation**: Navigation Compose with Type-Safe Destinations

---

## 🔐 2. Authentication & Session Management

### Features
1. **User Authentication Flow**:
   - Register Screen (Username, Email, Password, Terms Checkbox).
   - Login Screen (Email/Password & Google OAuth 2.0 Sign-In button).
   - JWT Auth Interceptor with automatic token refresh on HTTP 401 (`POST api/auth/token/refresh/`).
   - Cookie / Token Persistence in Encrypted DataStore.
   - Protected Screen Router (Auto-redirect to Login if unauthorized).
2. **User Profile**:
   - Display User Avatar (Initial letter), Username, Email, and Pro Status badge.
   - Profile quick links: User Guide, Terms of Service, Privacy Policy.
   - Secure Logout clearing cached sessions & local data.

### API Endpoints
- `POST api/auth/user/register/` -> `{ username, email, password }`
- `POST api/auth/user/login/` -> `{ email, password }`
- `POST api/auth/token/refresh/` -> Refresh access token
- `POST api/auth/user/logout/` -> Clear server session
- `GET api/auth/isauthenticated/` -> Verify active session
- `GET api/profile` -> Retrieve current user profile object

---

## 💳 3. Personal Expense & Income Management

### Features
1. **Dashboard / Home Screen**:
   - **Greeting Banner**: Time-aware greeting ("Good Morning", "Good Afternoon", "Good Evening"), displaying user name & today's date.
   - **Action Buttons**: Quick action floating buttons for "Add Expense" and "Import Statement (AI)".
   - **KPI Stat Cards**:
     - **Total Spent (Debits)**: Sum of all expenses out (Rose red styling).
     - **Total Income (Credits)**: Sum of all income/salary additions (Emerald green styling).
     - **Net Cash Balance**: Net calculation (Credits - Debits) with dynamic positive/negative styling.
2. **Transaction Management (Add / Edit / Delete)**:
   - Bottom Sheet Drawer for adding transaction.
   - **Toggle Transaction Type**: `DEBIT` (Expense) vs `CREDIT` (Income).
   - **Quick Amount Presets**: Chips for `+100`, `+500`, `+1000` to quickly adjust values.
   - **Fields**: Amount (₹), Category (Food, Transport, Shopping, Utilities, Entertainment, Health, Education, Salary, Investment, Bills, etc.), Description/Reason, Date Picker, Payment Mode (UPI, Credit Card, Debit Card, Net Banking, Cash).
   - Swipe-to-delete or tap-to-delete with modal confirmation dialog.
3. **Advanced Filter & Search Bar**:
   - **Quick Text Search**: Live search across descriptions, categories, payment modes, and amounts.
   - **Multi-Category Selection**: Select multiple category chips simultaneously.
   - **Transaction Type Filter**: All, Debits Only, Credits Only.
   - **Month Period Filter**: Filter by historical months.
   - **Payment Mode Filter**: Filter by specific payment modes.
   - **Sort Order**: Newest First, Oldest First, Amount (High to Low), Amount (Low to High).
   - **Active Filter Badges**: Displays count of active filters with a one-tap "Reset All" button.

### API Endpoints
- `GET api/get/expenses/` -> Fetch list of all expenses
- `POST api/add/expense/` -> `{ amount, category, description, date, paymentType, transaction_type }`
- `POST api/add/expenses/bulk/` -> `{ expenses: [ {...}, {...} ] }`
- `DELETE api/delete/expense/{id}/` -> Delete expense record

---

## 🤖 4. AI Bank & UPI Statement Parser

### Features
1. **Document Upload**:
   - Upload PDF, CSV, or Excel (.xlsx, .xls) bank and UPI statements from phone storage.
   - Multi-part file upload with loading indicator.
2. **Interactive AI Verification Queue**:
   - **1-by-1 Queue Review**: Step through extracted transactions sequentially with smooth card transitions.
   - **Pre-populated Field Verification**: Auto-extracted Debit/Credit type, Amount, Date, Merchant description, and AI-suggested category.
   - **Interactive Editing**: Modify missing or inaccurate fields, pick category via visual emoji picker, or discard individual items.
   - **Batch List View Mode**: Toggle between 1-by-1 queue and a condensed table list view.
   - **Confirm & Batch Save**: Save all verified transactions to backend database via bulk insertion API.

### API Endpoints
- `POST api/parse-statement/` (Multipart `file`) -> Response: `{ count: N, data: [ { amount, date, description, category, transaction_type, paymentType } ] }`
- `POST api/add/expenses/bulk/` -> Bulk commit verified statement entries.

---

## 📊 5. Visual Expense & Cashflow Analytics

### Features
1. **Timeframe Toggle**: Monthly View vs Daily View.
2. **Dynamic Chart Visualizations**:
   - **Category Distribution (Donut / Pie Chart)**: Interactive segments with legends and breakdown values.
   - **Expenditure Volume (Bar Chart)**: Daily / Monthly spending bars.
   - **Spending Trajectory / Cashflow (Line Chart)**: Smooth curved line graph showing spending trends over time.
3. **Interactive Filter Controls**: Filter analytical charts by specific month, category, payment mode, or transaction type.
4. **Insight Summary**: Highlight highest expenditure category and percentage of total spend.

---

## 👥 6. Group Expense Sharing & Split Bills

### Features
1. **Groups Overview**:
   - List created/joined groups (e.g., Roommates, Vacation, Trips, Office Lunch).
   - Group Card displaying member count, total group spend, and personal balance status.
2. **Create & Manage Groups**:
   - Modal/Screen to create new group (Name, Category, Avatar icon).
   - Add members to group via email input.
   - Delete/Leave group option.
3. **Group Detail View**:
   - View group members & total group spending.
   - **Add Group Expense**: Select who paid and split details (Equal split / Custom shares).
   - **Member Balances Summary**: Clear breakdown showing "Who owes whom" and net individual balances.
   - **Settle Up Modal**: Register settlements between group members to clear pending dues.

### API Endpoints
- `GET api/getGroups/` -> List user's groups
- `POST api/createGroup/` -> `{ name, description }`
- `POST api/addGroupMember/` -> `{ email, group_id }`
- `POST api/addGroupExpense/` -> `{ group_id, amount, description, paid_by, splits }`
- `DELETE api/deleteGroup/{id}/` -> Remove group

---

## 🎨 7. UI / UX Design Specifications

1. **Material Design 3 (MD3) Guidelines**:
   - Dynamic Colors (Material You) adapting to system wallpaper & dark/light mode toggle.
   - Modern rounded corners (`rounded-3xl` equivalent: 24dp/28dp shape corners).
   - Elevation & subtle backdrop blurs (Glassmorphism card effects).
2. **Bottom Navigation Bar**:
   - 4 Primary Tabs:
     - 🏠 **Home** (Dashboard & Transactions List)
     - 📊 **Analytics** (Visual Charts & Insights)
     - 👥 **Groups** (Shared Expenses & Split Bills)
     - 👤 **Account** (Profile & Settings)
   - Central Floating Action Button (FAB) for quick transaction creation.
3. **Micro-Interactions & Polish**:
   - Smooth Jetpack Compose animations (AnimatedVisibility, Crossfade, Shared Element Transitions).
   - Haptic feedback on button clicks and swipe actions.
   - Skeleton screen loaders while fetching network data.
   - Sonner-style custom Toast/Snackbar notifications (Success, Error, Warning).

---

## 📋 8. Developer Prompt for AI Builders (Cursor / Claude / Copilot)

> **Copy & paste the following prompt into your AI coding assistant to generate the Android project**:

```text
You are an expert Senior Android Engineer specializing in Kotlin, Jetpack Compose, and Material Design 3.
Build a production-grade native Android application called "ExpenseManager Mobile" for the existing backend API.

Follow these strict specifications:

1. ARCHITECTURE & STRUCTURE:
   - Use MVVM + Clean Architecture with Repository Pattern and Hilt for Dependency Injection.
   - Structure packages: data/ (remote, local, model, repository), domain/ (usecases, models), ui/ (screens, components, theme, navigation).
   - Use Retrofit2 with OkHttp interceptor to handle Auth JWT tokens and automatic token refresh on HTTP 401.

2. CORE FEATURES TO IMPLEMENT:
   a. AUTHENTICATION:
      - Login & Register screens with email/password and Google OAuth.
      - Persistent token storage in EncryptedSharedPreferences / Datastore.
      - Profile screen displaying user info, app policies, and Logout.
   b. HOME & TRANSACTIONS DASHBOARD:
      - Time-based greeting banner (Good Morning/Afternoon/Evening).
      - KPI Stat Cards: Total Spent (Debits), Total Income (Credits), Net Cash Balance.
      - Transactions list with swipe-to-delete, search bar, multi-category chips filter, transaction type filter (Debit/Credit), month period selector, and sorting.
      - Add Expense BottomSheet drawer with quick amount buttons (+100, +500, +1000).
   c. AI STATEMENT PARSER:
      - File picker for PDF/CSV/Excel bank statements.
      - 1-by-1 Queue Verification screen pre-populating parsed data (Amount, Date, Merchant, Category, Debit/Credit toggle).
      - Batch save verified transactions to backend.
   d. EXPENSE & CASHFLOW ANALYTICS:
      - Monthly/Daily view toggle.
      - Pie chart for category distribution, Bar chart for expenditure volume, Line chart for spending trajectory.
      - Interactive filter bar.
   e. GROUP EXPENSES & SPLIT BILLS:
      - Group listing & creation.
      - Add members by email.
      - Add shared group expense with split calculation.
      - Member balance summary ("Who owes whom") and Settle Up dialog.

3. UI & STYLING:
   - Jetpack Compose with Material Design 3 (MD3), dynamic color theme, smooth screen transitions, and dark/light mode support.
   - Bottom Navigation Bar with 4 main tabs (Home, Analytics, Groups, Account) + FAB for quick add.
   - Skeleton loading states and Sonner-style Toast/Snackbar feedback.

API Base URL Configurable via BuildConfig.
Write clean, modular, fully commented Kotlin code with zero placeholder logic.
```
