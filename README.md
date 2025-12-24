# Expense Tracker

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS. Track your personal finances with an intuitive interface and powerful features.

## Features

### Core Functionality
- **Add Expenses**: Create new expenses with amount, date, category, and description
- **Edit & Delete**: Modify or remove existing expenses with a single click
- **Smart Filtering**: Filter expenses by category, date range, or search by description
- **Data Persistence**: All data is stored in localStorage for seamless experience

### Dashboard & Analytics
- **Summary Cards**: View total expenses, monthly spending, top category, and average transaction amount
- **Visual Charts**: Interactive category-based spending visualization with percentages
- **Real-time Updates**: All statistics update instantly as you add or modify expenses

### Categories
- Food 🍽️
- Transportation 🚗
- Entertainment 🎬
- Shopping 🛍️
- Bills 📄
- Other 📌

### Additional Features
- **Export to CSV**: Download your expense data for external analysis
- **Form Validation**: Ensures all required fields are filled correctly
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth transitions and visual feedback

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Data Storage**: Browser localStorage
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

1. Navigate to the project directory:
```bash
cd expense-tracker-ai
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## How to Use

### Adding an Expense

1. Fill in the expense form at the top of the page:
   - **Amount**: Enter the expense amount (must be greater than 0)
   - **Date**: Select the expense date (defaults to today)
   - **Category**: Choose from the dropdown (Food, Transportation, etc.)
   - **Description**: Describe what you spent money on

2. Click "Add Expense" button

3. Your expense will appear in the list below and all statistics will update

### Editing an Expense

1. Find the expense you want to edit in the expense list
2. Click the edit icon (pencil) on the right side
3. The form will populate with the expense data
4. Make your changes and click "Update Expense"
5. Or click "Cancel" to discard changes

### Deleting an Expense

1. Find the expense you want to delete
2. Click the delete icon (trash can)
3. Confirm the deletion in the popup dialog

### Filtering Expenses

Use the Filters panel on the right side:
- **Search**: Type keywords to search by description or category
- **Category**: Select a specific category or "All" to see everything
- **Date Range**: Set start and/or end dates to filter by time period
- **Reset**: Click "Reset" to clear all filters

### Exporting Data

1. Click the "Export to CSV" button in the header
2. A CSV file will download with all your expenses
3. Open in Excel, Google Sheets, or any spreadsheet application

## Project Structure

```
expense-tracker-ai/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Global styles
├── components/
│   ├── Dashboard.tsx         # Summary cards component
│   ├── ExpenseForm.tsx       # Add/Edit expense form
│   ├── ExpenseList.tsx       # Expense list with edit/delete
│   ├── ExpenseFilters.tsx    # Filter controls
│   ├── CategoryChart.tsx     # Spending visualization
│   └── ExportButton.tsx      # CSV export button
├── lib/
│   └── ExpenseContext.tsx    # Global state management
├── types/
│   └── expense.ts            # TypeScript type definitions
├── utils/
│   ├── localStorage.ts       # localStorage utilities
│   ├── formatters.ts         # Currency and date formatters
│   └── exportUtils.ts        # CSV export functionality
└── package.json
```

## Testing the Application

### Test Scenario 1: Adding Expenses

1. Add an expense for lunch: Amount $15.50, Category: Food, Description: "Lunch at cafe"
2. Add transportation expense: Amount $45.00, Category: Transportation, Description: "Gas"
3. Add entertainment: Amount $12.99, Category: Entertainment, Description: "Movie ticket"
4. Verify all three appear in the expense list
5. Check that the dashboard cards update correctly

### Test Scenario 2: Editing

1. Click edit on the lunch expense
2. Change amount to $18.50
3. Update the description to "Lunch at restaurant"
4. Click "Update Expense"
5. Verify changes appear in the list and dashboard

### Test Scenario 3: Filtering

1. Use the search box to search for "lunch"
2. Select "Food" from the category filter
3. Set a date range for the current month
4. Verify only matching expenses appear
5. Click "Reset" to clear filters

### Test Scenario 4: Export

1. Add several expenses across different categories
2. Click "Export to CSV"
3. Open the downloaded file
4. Verify all expense data is present and formatted correctly

### Test Scenario 5: Mobile Responsiveness

1. Open developer tools and toggle device toolbar
2. Test on mobile view (375px width)
3. Verify all components are readable and functional
4. Test form submission, editing, and filtering on mobile

### Test Scenario 6: Data Persistence

1. Add several expenses
2. Refresh the browser page
3. Verify all expenses are still present
4. Close and reopen the browser tab
5. Confirm data persists across sessions

## Features Checklist

- ✅ Add expenses with validation
- ✅ View expenses in organized list
- ✅ Filter by date range and category
- ✅ Dashboard with spending summaries
- ✅ Basic analytics and charts
- ✅ Six expense categories
- ✅ localStorage persistence
- ✅ TypeScript type safety
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ Form validation
- ✅ Date picker
- ✅ Currency formatting
- ✅ Search functionality
- ✅ Visual spending patterns
- ✅ CSV export
- ✅ Edit expenses
- ✅ Delete expenses
- ✅ Loading states
- ✅ Error handling
- ✅ Modern UI

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires JavaScript and localStorage support.

## License

ISC

## Support

For issues or questions, please create an issue in the project repository.
