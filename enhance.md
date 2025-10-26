**Description:**
Hello, the Sudoku application is nearly complete, but we need to implement two crucial bug fixes to enhance the core gameplay loop. Both require adding real-time validation and state updates.

---

### **Bug 1: Auto-Updating Pencil Notes (Real-Time Pruning)**

**Problem:**
The "Notes" a user adds to a cell are currently static. They do not automatically update or get removed when a conflicting number is placed in the same row, column, or 3x3 box. This forces the user to manually clean up their own notes, which is not ideal.

**Expected Behavior:**
When a user successfully places a final number (e.g., a "7") in a cell, the application should immediately and automatically scan all "peer" cells (cells in the same row, same column, and same 3x3 box) and remove the note "7" from any of them.

**Implementation Guide:**

1.  **Trigger the Logic:** This logic should be triggered *after* a user places a definitive number into a cell (not when they are adding notes).
2.  **Create a Helper Function:** It's best to create a function like `updatePeerNotes(grid, updatedRow, updatedCol, placedNumber)`.
3.  **Function Logic:**
    *   Iterate through all 9 cells of the `updatedRow` and remove `placedNumber` from their notes array.
    *   Iterate through all 9 cells of the `updatedCol` and remove `placedNumber` from their notes array.
    *   Iterate through all 9 cells of the corresponding 3x3 box and remove `placedNumber` from their notes array.
4.  **Update State:** This function should modify the main grid state, which will cause the affected cells to re-render with the updated, cleaner notes.

---

### **Bug 2: Instant Error Validation on Number Input**

**Problem:**
The game is generated with a single, correct solution, but the application currently accepts any number the user inputs without providing immediate feedback. The user can fill the whole board with incorrect numbers and only find out at the end.

**Expected Behavior:**
When a user inputs a number into a cell that does not match the correct, pre-generated solution for that specific cell, the number should be immediately and visually marked as an error. A common way to do this is to change the number's color to red.

**Implementation Guide:**

1.  **Prerequisite (State Management):** The application's state must contain two separate grids:
    *   `solutionGrid`: The complete, correct solution for the current puzzle.
    *   `userGrid`: The grid that the user is currently filling, which includes their input numbers and notes.

2.  **Modify the Input Handler:** The function that processes a user's input (e.g., `handleNumberInput(row, col, number)`) needs to be modified.
3.  **Add Validation Logic:** Inside this function, after placing the number in the `userGrid`, add this check:
    ```javascript
    const isError = number !== solutionGrid[row][col];
    ```
4.  **Update Cell State:** The state for the cell in `userGrid` should be updated to include this error status. For example:
    `userGrid[row][col].value = number;`
    `userGrid[row][col].isError = isError;`
5.  **Conditional Styling (CSS/UI):** The `Cell` component must be updated to reflect this `isError` state. It should conditionally apply an "error" class if `cell.isError` is true.
    ```css
    .cell.error .number {
      color: red;
    }
    ```
6.  **Clearing the Error:** Ensure that when a user erases a number from a cell, the `isError` flag is also reset to `false`.