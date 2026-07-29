import fs from 'fs';

const newDays = [
  // WEEK 3: SQL
  {
    day: 15, week: 3, title: "Relational Database & SQL Basics", category: "Database & SQL",
    topics: ["RDBMS Concepts", "Tables, Rows, Columns", "Primary & Foreign Keys", "Basic CRUD (SELECT, INSERT, UPDATE, DELETE)"],
    theory: "A Relational Database Management System (RDBMS) stores data in tables. A Primary Key uniquely identifies a record, while a Foreign Key creates relationships between tables. SQL (Structured Query Language) is used to manipulate this data.",
    youtubeId: "HXV3zeJZ1EQ", // SQL Basics
    dsa: { title: "Merge Two Sorted Lists", difficulty: "Easy", platform: "LeetCode 21", description: "Merge two sorted linked lists and return it as a sorted list.", starterCode: "public class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        return null;\n    }\n}" },
    viva: [
      { q: "What is the difference between DDL and DML?", a: "DDL (Data Definition Language) defines the schema (CREATE, ALTER, DROP). DML (Data Manipulation Language) modifies data (INSERT, UPDATE, DELETE)." },
      { q: "What is a Foreign Key?", a: "A column or group of columns in a relational database table that provides a link between data in two tables." }
    ]
  },
  {
    day: 16, week: 3, title: "Filtering, Sorting & Functions", category: "Database & SQL",
    topics: ["WHERE, AND, OR, IN", "ORDER BY, LIMIT", "Aggregate Functions (COUNT, SUM, AVG)", "String & Date Functions"],
    theory: "SQL allows powerful filtering using the WHERE clause. Aggregate functions compute a single result from a set of input values, commonly used for reporting and data analysis.",
    youtubeId: "2bW3HuaAwcg", // SQL WHERE
    dsa: { title: "Remove Nth Node From End of List", difficulty: "Medium", platform: "LeetCode 19", description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.", starterCode: "public class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        return null;\n    }\n}" },
    viva: [
      { q: "What is the difference between WHERE and HAVING?", a: "WHERE filters rows before aggregation. HAVING filters groups after aggregation is performed." }
    ]
  },
  {
    day: 17, week: 3, title: "SQL Joins (Inner, Left, Right, Full)", category: "Database & SQL",
    topics: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
    theory: "Joins combine columns from one or more tables based on the values of the common columns between them. INNER JOIN returns only matching rows. LEFT JOIN returns all rows from the left table and matched rows from the right.",
    youtubeId: "9yeOJ0ZMUYw", // SQL Joins
    dsa: { title: "Linked List Cycle", difficulty: "Easy", platform: "LeetCode 141", description: "Given head, the head of a linked list, determine if the linked list has a cycle in it using Floyd's Tortoise and Hare.", starterCode: "public class Solution {\n    public boolean hasCycle(ListNode head) {\n        return false;\n    }\n}" },
    viva: [
      { q: "What happens if a LEFT JOIN finds no match in the right table?", a: "The result row will contain NULL for all columns from the right table." }
    ]
  },
  {
    day: 18, week: 3, title: "Grouping Data & Subqueries", category: "Database & SQL",
    topics: ["GROUP BY Clause", "HAVING Clause", "Correlated Subqueries", "Nested Queries"],
    theory: "The GROUP BY statement groups rows that have the same values into summary rows. Subqueries allow you to execute a query within another query, passing the result up to the outer query.",
    youtubeId: "Ww71qlQlNx8", // SQL Group By
    dsa: { title: "Intersection of Two Linked Lists", difficulty: "Easy", platform: "LeetCode 160", description: "Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect.", starterCode: "public class Solution {\n    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {\n        return null;\n    }\n}" },
    viva: [
      { q: "What is a Correlated Subquery?", a: "A subquery that uses values from the outer query. It is evaluated once for each row processed by the outer query." }
    ]
  },
  {
    day: 19, week: 3, title: "Database Normalization (1NF, 2NF, 3NF)", category: "Database & SQL",
    topics: ["Data Redundancy & Anomalies", "1NF (Atomic values)", "2NF (Partial Dependency)", "3NF (Transitive Dependency)"],
    theory: "Normalization is the process of organizing data to minimize redundancy and prevent insert/update/delete anomalies. 1NF ensures atomic values. 2NF removes partial dependencies. 3NF removes transitive dependencies.",
    youtubeId: "GFQaEYEc8_8", // Normalization
    dsa: { title: "Middle of the Linked List", difficulty: "Easy", platform: "LeetCode 876", description: "Given the head of a singly linked list, return the middle node of the linked list.", starterCode: "public class Solution {\n    public ListNode middleNode(ListNode head) {\n        return null;\n    }\n}" },
    viva: [
      { q: "What is a Transitive Dependency?", a: "When a non-prime attribute depends on another non-prime attribute, rather than depending directly on the primary key." }
    ]
  },
  {
    day: 20, week: 3, title: "Transactions & ACID Properties", category: "Database & SQL",
    topics: ["Atomicity", "Consistency", "Isolation", "Durability"],
    theory: "A transaction is a single unit of work. ACID guarantees data reliability. Atomicity ensures all-or-nothing. Consistency ensures valid states. Isolation ensures concurrent transactions don't interfere. Durability ensures committed changes survive failures.",
    youtubeId: "8470mXh39aU", // ACID Properties
    dsa: { title: "Reverse Linked List II", difficulty: "Medium", platform: "LeetCode 92", description: "Reverse the nodes of the list from position left to position right, and return the reversed list.", starterCode: "public class Solution {\n    public ListNode reverseBetween(ListNode head, int left, int right) {\n        return null;\n    }\n}" },
    viva: [
      { q: "What is the Dirty Read problem in Isolation?", a: "When a transaction reads data written by another uncommitted transaction that later rolls back, leading to invalid data usage." }
    ]
  },
  {
    day: 21, week: 3, title: "Indexes & Query Optimization", category: "Database & SQL",
    topics: ["B-Tree Indexes", "Clustered vs Non-Clustered Indexes", "Query Execution Plans", "EXPLAIN statement"],
    theory: "Indexes speed up data retrieval at the cost of slower writes and extra storage. A Clustered Index dictates the physical sorting of the table (only one per table). Non-clustered indexes hold pointers to the actual data.",
    youtubeId: "fsG1XaZEa78", // Indexes
    dsa: { title: "LRU Cache", difficulty: "Medium", platform: "LeetCode 146", description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache using a Hash Map and Doubly Linked List.", starterCode: "class LRUCache {\n    public LRUCache(int capacity) {\n        \n    }\n    \n    public int get(int key) {\n        return -1;\n    }\n    \n    public void put(int key, int value) {\n        \n    }\n}" },
    viva: [
      { q: "Why shouldn't you index every column in a table?", a: "Every index requires extra disk space and slows down INSERT, UPDATE, and DELETE operations because the index must also be updated." }
    ]
  },
  // WEEK 4: Frontend
  {
    day: 22, week: 4, title: "HTML5 & Semantic Web", category: "Frontend Web",
    topics: ["Document Structure", "Semantic Tags (header, nav, article)", "Forms & Inputs", "Accessibility (a11y) basics"],
    theory: "HTML structures the web. Semantic tags give meaning to the structure (e.g., using <nav> for navigation instead of just <div>), which helps Search Engine Optimization (SEO) and screen readers.",
    youtubeId: "mU6anWqZJcc", // HTML Crash Course
    dsa: { title: "Valid Parentheses", difficulty: "Easy", platform: "LeetCode 20", description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", starterCode: "import java.util.Stack;\n\npublic class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}" },
    viva: [
      { q: "Why use semantic HTML?", a: "It improves SEO, makes code easier to read for developers, and ensures the page is accessible to users with screen readers." }
    ]
  },
  {
    day: 23, week: 4, title: "CSS3 Fundamentals & Flexbox", category: "Frontend Web",
    topics: ["Box Model (Margin, Border, Padding)", "Selectors & Specificity", "Flexbox Layout", "Responsive Media Queries"],
    theory: "CSS styles the web. The Box Model dictates how elements take up space. Flexbox is a 1-dimensional layout model that automatically aligns items in rows or columns, adjusting to available space.",
    youtubeId: "yU7jY3NIZTs", // CSS Crash Course
    dsa: { title: "Min Stack", difficulty: "Medium", platform: "LeetCode 155", description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.", starterCode: "class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}" },
    viva: [
      { q: "What is the difference between margin and padding?", a: "Margin is the space OUTSIDE the element's border. Padding is the space INSIDE the element's border, between the border and the content." }
    ]
  },
  {
    day: 24, week: 4, title: "Modern JavaScript (ES6+)", category: "Frontend Web",
    topics: ["let vs const vs var", "Arrow Functions", "Destructuring & Spread Operator", "Promises & Async/Await"],
    theory: "ES6 revolutionized JavaScript. 'let' and 'const' provide block scoping. Arrow functions provide a concise syntax and lexical 'this' binding. Async/Await makes asynchronous code look synchronous.",
    youtubeId: "W6NZfCO5SIk", // JavaScript Crash Course
    dsa: { title: "Evaluate Reverse Polish Notation", difficulty: "Medium", platform: "LeetCode 150", description: "Evaluate the value of an arithmetic expression in Reverse Polish Notation using a Stack.", starterCode: "public class Solution {\n    public int evalRPN(String[] tokens) {\n        return 0;\n    }\n}" },
    viva: [
      { q: "What is a Promise in JavaScript?", a: "An object representing the eventual completion (or failure) of an asynchronous operation and its resulting value." }
    ]
  },
  {
    day: 25, week: 4, title: "React Fundamentals: JSX & Components", category: "Frontend Web",
    topics: ["Virtual DOM", "JSX Syntax", "Functional Components", "Props vs State"],
    theory: "React uses a Virtual DOM to optimize updates to the real browser DOM. JSX allows writing HTML-like syntax inside JavaScript. Components are reusable UI building blocks. Props pass data down; State holds local dynamic data.",
    youtubeId: "bMknfKXIFA8", // React Crash Course
    dsa: { title: "Binary Tree Inorder Traversal", difficulty: "Easy", platform: "LeetCode 94", description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.", starterCode: "public class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        return new ArrayList<>();\n    }\n}" },
    viva: [
      { q: "What is the Virtual DOM?", a: "A lightweight JavaScript representation of the actual DOM. React compares it with the previous Virtual DOM (diffing) to batch real DOM updates efficiently." }
    ]
  },
  {
    day: 26, week: 4, title: "React Hooks: useState & useEffect", category: "Frontend Web",
    topics: ["useState Hook", "useEffect Hook & Dependency Array", "Component Lifecycle (Mount, Update, Unmount)"],
    theory: "useState lets you add React state to functional components. useEffect lets you perform side effects (data fetching, subscriptions). The dependency array dictates when the effect re-runs.",
    youtubeId: "O6P86uwfdR0", // React Hooks
    dsa: { title: "Maximum Depth of Binary Tree", difficulty: "Easy", platform: "LeetCode 104", description: "Given the root of a binary tree, return its maximum depth.", starterCode: "public class Solution {\n    public int maxDepth(TreeNode root) {\n        return 0;\n    }\n}" },
    viva: [
      { q: "What happens if you omit the dependency array in useEffect?", a: "The effect runs after EVERY render of the component, which can lead to infinite loops if the effect updates state." }
    ]
  },
  {
    day: 27, week: 4, title: "Frontend Routing & State Management", category: "Frontend Web",
    topics: ["React Router (BrowserRouter, Routes, Route)", "Context API", "Prop Drilling problem"],
    theory: "React Router enables client-side routing, making the app feel like a seamless Single Page Application (SPA). Context API solves Prop Drilling by allowing deep nested components to read global state directly.",
    youtubeId: "59IXY5IDrBA", // React Router
    dsa: { title: "Invert Binary Tree", difficulty: "Easy", platform: "LeetCode 226", description: "Given the root of a binary tree, invert the tree, and return its root.", starterCode: "public class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        return null;\n    }\n}" },
    viva: [
      { q: "What is Prop Drilling?", a: "Passing data (props) through multiple layers of components that don't need the data, just to reach a deeply nested component that does." }
    ]
  },
  {
    day: 28, week: 4, title: "Connecting Frontend to Spring Backend", category: "Frontend Web",
    topics: ["Fetch API / Axios", "CORS (Cross-Origin Resource Sharing)", "Handling JWT Tokens on Client", "Environment Variables"],
    theory: "The frontend talks to the backend via HTTP requests. CORS is a browser security feature that blocks requests to different domains unless the backend explicitly allows it. JWT tokens are typically stored in localStorage or secure cookies.",
    youtubeId: "v0t42xBIYIs", // Fetch API
    dsa: { title: "Binary Tree Level Order Traversal", difficulty: "Medium", platform: "LeetCode 102", description: "Given the root of a binary tree, return the level order traversal of its nodes' values (using a Queue/BFS).", starterCode: "public class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        return new ArrayList<>();\n    }\n}" },
    viva: [
      { q: "How do you send a JWT token to a Spring Boot backend?", a: "By adding it to the 'Authorization' HTTP header in the format: 'Bearer <token>'." }
    ]
  }
];

let content = fs.readFileSync('src/data/syllabus.js', 'utf8');

// Find the last object before `];`
const insertionPoint = content.lastIndexOf('  }\n];');

if (insertionPoint !== -1) {
  const newContentStr = newDays.map(d => ',\n  ' + JSON.stringify(d, null, 2).replace(/\n/g, '\n  ')).join('');
  content = content.slice(0, insertionPoint + 3) + newContentStr + content.slice(insertionPoint + 3);
  
  // also add "Frontend Web" to getCategoryColor
  content = content.replace(
    'case "Database & SQL": return "bg-amber-900/40 text-amber-300 border-amber-700/50";',
    'case "Database & SQL": return "bg-amber-900/40 text-amber-300 border-amber-700/50";\n    case "Frontend Web": return "bg-blue-900/40 text-blue-300 border-blue-700/50";'
  );
  
  fs.writeFileSync('src/data/syllabus.js', content, 'utf8');
  console.log("Injected Week 3 and Week 4 successfully.");
} else {
  console.log("Could not find insertion point.");
}
