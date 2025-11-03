# Debugging Views Page

## How to Check the Views Page

1. **Navigate to the Views page**: Click on "Views" in the sidebar or go to `/views` in the URL

2. **Check the browser console**: Open DevTools (F12) and check for:
   - Console logs showing view counts and state
   - Any errors in the console

3. **Check localStorage**: In the browser console, run:
   ```javascript
   const views = localStorage.getItem("views");
   console.log("Views:", views ? JSON.parse(views) : "No views found");
   ```

4. **Create a test view manually** (in browser console):
   ```javascript
   const testView = [{
     id: "test-view-1",
     name: "High Priority Issues",
     description: "View all high priority issues",
     filters: {
       status: ["Todo", "In Progress"],
       priority: ["High", "Urgent"]
     },
     sortBy: "priority",
     groupBy: "status",
     isFavorite: false,
     createdAt: new Date().toISOString()
   }];
   localStorage.setItem("views", JSON.stringify(testView));
   location.reload(); // Refresh the page
   ```

5. **Or create a view using the UI**: 
   - Click "New view" button
   - Fill in the form and create a view

## What You Should See

- **If no views exist**: You'll see an empty state with an icon, title, description, and "Create new view" button
- **If views exist**: You'll see a list of view cards with their names, descriptions, and filters
- **When clicking a view**: It will show the filtered issues from JIRA

## Common Issues

1. **Nothing visible**: Check if the page has proper height/overflow styles
2. **Views not loading**: Check localStorage for the "views" key
3. **Issues not fetching**: Check if JIRA API is enabled in settings and project key is set

