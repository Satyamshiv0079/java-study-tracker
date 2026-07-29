// === SYLLABUS DATA ===
export const challengeSyllabus = [
  {
    day: 1, week: 1, title: "Java Basics & JVM Memory Layout", category: "Java Core",
    topics: ["JDK vs JRE vs JVM", "Primitive Data Types", "Variables & Constants", "Stack vs Heap memory basics"],
    theory: "The Java Development Kit (JDK) contains tools to compile and run Java programs. The Java Runtime Environment (JRE) provides the libraries and the JVM. The Java Virtual Machine (JVM) is responsible for executing bytecode. Variables are stored in memory: primitives go onto the Stack (fast allocation, block scoped), while objects reside on the Heap (dynamically allocated, managed by Garbage Collector).",
    youtubeId: "grEKMHGYyns", // freeCodeCamp Java Basics
    dsa: { title: "Reverse an Array", difficulty: "Easy", platform: "LeetCode / GFG", description: "Write a function to reverse a given array in-place. Optimal approach uses a two-pointer technique.", starterCode: "public class Solution {\n    public void reverseArray(int[] arr) {\n        // Write your optimal two-pointer code here\n        \n    }\n}" },
    viva: [
      { q: "What is the primary difference between JDK and JRE?", a: "JDK is for development (contains compiler javac, debugger, etc.), whereas JRE is only for execution (contains JVM and libraries)." },
      { q: "Where are primitive variables and objects stored in memory?", a: "Primitives reside on the Stack; object instances reside on the Heap, while their references live on the Stack." }
    ]
  },
  {
    day: 2, week: 1, title: "Operators, Control Flow & Loops", category: "Java Core",
    topics: ["Arithmetic/Logical Operators", "If-Else & Switch Expression", "For, While, Do-While", "Break & Continue"],
    theory: "Control flow determines execution paths. Switch expressions in modern Java can return values directly. While loops are pre-tested; do-while loops are post-tested, guaranteeing at least one execution. The 'break' statement terminates the nearest enclosing loop, while 'continue' skips to the next iteration.",
    youtubeId: "eIrMbAQSU34", // Mosh Control Flow
    dsa: { title: "Find Maximum & Minimum in Array", difficulty: "Easy", platform: "GeeksforGeeks", description: "Find the minimum and maximum elements in an array using the minimum number of comparisons.", starterCode: "public class Solution {\n    public int[] findMinMax(int[] arr) {\n        // Your code here\n        return new int[]{0, 0};\n    }\n}" },
    viva: [
      { q: "Does Java support 'goto' statements?", a: "No, Java has reserved 'goto' as a keyword but does not implement it. Labels can be used with break and continue instead." },
      { q: "What is the difference between prefix and postfix increment operators?", a: "Prefix (++x) increments the value first and then uses it; postfix (x++) uses the current value first and then increments it." }
    ]
  },
  {
    day: 3, week: 1, title: "Arrays & String Manipulation", category: "Java Core",
    topics: ["1D & 2D Arrays", "String Pool & Immutability", "StringBuilder vs StringBuffer", "String Methods"],
    theory: "Strings in Java are immutable objects stored in the String Constant Pool (SCP) to save memory. When you alter a String, a new object is created. StringBuilder is non-thread-safe but faster for single-threaded concatenation, whereas StringBuffer is synchronized (thread-safe) but carries performance overhead.",
    youtubeId: "N63JCXwdd14", // Edureka Strings
    dsa: { title: "Valid Anagram", difficulty: "Easy", platform: "LeetCode 242", description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.", starterCode: "public class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Use a frequency counter array or hashing\n        return false;\n    }\n}" },
    viva: [
      { q: "Why are String objects immutable in Java?", a: "For security, caching in the String Pool, thread safety, and to ensure HashCodes remain consistent for collection keys." },
      { q: "Difference between equals() and == for Strings?", a: "== checks if references point to the same memory location, while equals() compares the actual character contents." }
    ]
  },
  {
    day: 4, week: 1, title: "OOPs 1: Classes, Objects & Constructors", category: "OOPs",
    topics: ["Class vs Object", "Types of Constructors", "Constructor Chaining", "this and super Keywords"],
    theory: "A Class is a blueprint; an Object is an instance. Constructors initialize state and have no return type. Constructor chaining is calling one constructor from another using this() or super(). The 'this' keyword refers to the current class instance, while 'super' refers to the immediate parent class.",
    youtubeId: "bSrm9RXwBaI", // Apna College OOP One Shot
    dsa: { title: "Two Sum", difficulty: "Easy", platform: "LeetCode 1", description: "Find two numbers in an array that add up to a specific target. Aim for O(N) using a HashMap.", starterCode: "import java.util.HashMap;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Implement with O(N) time complexity\n        return new int[]{};\n    }\n}" },
    viva: [
      { q: "What happens if you don't define a constructor in a class?", a: "The Java compiler automatically inserts a default, no-argument constructor. If you define any custom constructor, the default is lost." },
      { q: "Can a constructor call both super() and this() in its first line?", a: "No. Both must be the first statement of a constructor, hence they are mutually exclusive." }
    ]
  },
  {
    day: 5, week: 1, title: "OOPs 2: Inheritance & Polymorphism", category: "OOPs",
    topics: ["Types of Inheritance", "Method Overloading vs Overriding", "Dynamic Method Dispatch", "Covariant Return Types"],
    theory: "Java supports Single, Multilevel, and Hierarchical inheritance (Multiple inheritance of classes is banned to avoid the Diamond Problem). Overloading is Compile-Time Polymorphism. Overriding is Run-Time Polymorphism. Dynamic Method Dispatch resolves overridden methods at runtime based on the actual object type, not the reference type.",
    youtubeId: "CGHL1zuD5fY", // Inheritance
    dsa: { title: "Contains Duplicate", difficulty: "Easy", platform: "LeetCode 217", description: "Return true if any value appears at least twice in the array. Solve with a Set.", starterCode: "import java.util.HashSet;\n\npublic class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        return false;\n    }\n}" },
    viva: [
      { q: "What is Covariant Return Type?", a: "It allows an overriding method to define a narrower return type than the overridden parent method, starting from Java 5." },
      { q: "Why is multiple inheritance not supported in Java via classes?", a: "To prevent ambiguity or 'Diamond Problem' conflicts when two parents implement the same method." }
    ]
  },
  {
    day: 6, week: 1, title: "OOPs 3: Abstraction & Encapsulation", category: "OOPs",
    topics: ["Abstract Classes vs Interfaces", "Java 8 Default/Static Methods", "Access Modifiers", "Encapsulation Benefits"],
    theory: "Abstraction hides complex implementation details, exposing only interfaces. Abstract classes can hold instance state and constructors, whereas interfaces (prior to Java 8) only held abstract methods. Since Java 8, interfaces support default and static methods. Encapsulation binds state variables and actions, restricting direct access via private keywords.",
    youtubeId: "PpxzFint1IA", // Interfaces
    dsa: { title: "Move Zeroes to End", difficulty: "Easy", platform: "LeetCode 283", description: "Move all 0s in an array to the end while maintaining the relative order of non-zero elements.", starterCode: "public class Solution {\n    public void moveZeroes(int[] nums) {\n        // Optimal solution operates in O(N) time and O(1) space\n    }\n}" },
    viva: [
      { q: "Can we instantiate an Abstract Class?", a: "No, abstract classes cannot be directly instantiated using 'new'. They must be extended by a concrete class." },
      { q: "What are default methods in Java 8 interfaces?", a: "They are methods with full implementations inside interfaces, allowing backward compatibility for old libraries without breaking implementing classes." }
    ]
  },
  {
    day: 7, week: 1, title: "OOPs Practice & Design Patterns", category: "OOPs",
    topics: ["Singleton Pattern", "Factory Pattern", "Solid Principles Basics", "Composition vs Inheritance"],
    theory: "Design patterns are proven solutions to common software design problems. The Singleton pattern ensures a class has only one instance and provides a global point of access to it. The Factory pattern provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created. SOLID principles are guidelines for writing maintainable and scalable code.",
    youtubeId: "IZu5rZTN7PI", // Master Exceptions
    dsa: { title: "Design a Singleton Class", difficulty: "Medium", platform: "Custom", description: "Implement a thread-safe Singleton class in Java using double-checked locking.", starterCode: "public class Singleton {\n    // Implement double-checked locking singleton here\n    \n}" },
    viva: [
      { q: "What is the primary benefit of Composition over Inheritance?", a: "Composition provides greater flexibility and loose coupling. You can change behavior at runtime by composing with different objects, whereas inheritance establishes a rigid compile-time relationship." },
      { q: "How do you make a Singleton class thread-safe in Java?", a: "Use the 'volatile' keyword for the instance variable and synchronized block (double-checked locking) during instantiation, or simply use an Enum singleton." }
    ]
  },
  {
    day: 8, week: 2, title: "Exception Handling Deep Dive", category: "Java Advanced",
    topics: ["Throwable Hierarchy", "Checked vs Unchecked Exceptions", "Custom Exceptions", "Try-With-Resources"],
    theory: "All exception classes descend from 'Throwable'. 'Error' is fatal. 'Exception' divides into Checked (compile-time, e.g., IOException) and Unchecked (runtime, e.g., NullPointerException). Try-with-resources handles auto-closeable resources safely without needing verbose explicit finally blocks.",
    youtubeId: "VphowcSkBX4", // Apna College Collections
    dsa: { title: "Merge Sorted Array", difficulty: "Easy", platform: "LeetCode 88", description: "Merge two sorted integer arrays into one sorted array in-place, filling up trailing zeros.", starterCode: "public class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        // Solve by iterating backwards to avoid shifting elements\n    }\n}" },
    viva: [
      { q: "What is the difference between throw and throws?", a: "throw is used to explicitly instantiate and trigger an exception; throws is declared in a method signature to signal caller methods that exceptions might occur." },
      { q: "How does Try-With-Resources guarantee resources close?", a: "By implementing the 'AutoCloseable' interface, the JVM automatically invokes close() on resources declared in the try parameter list." }
    ]
  },
  {
    day: 9, week: 2, title: "Collections 1: Lists & Iterators", category: "Java Advanced",
    topics: ["ArrayList vs LinkedList Internals", "Vector and Stack legacy", "Iterator & ListIterator", "Fail-Fast vs Fail-Safe"],
    theory: "ArrayList utilizes a dynamic array that grows by 50% once capacity is filled. LinkedList utilizes double-ended nodes. Fail-fast iterators throw ConcurrentModificationException if the collection changes during iteration.",
    youtubeId: "8MmMm2-kJV8", // Data Structures
    dsa: { title: "Remove Duplicates from Sorted Array", difficulty: "Easy", platform: "LeetCode 26", description: "Modify a sorted array in-place so unique elements appear only once, returning the new length.", starterCode: "public class Solution {\n    public int removeDuplicates(int[] nums) {\n        // Two-pointer write/read indexes\n        return 0;\n    }\n}" },
    viva: [
      { q: "What is the default capacity of an ArrayList and how does it grow?", a: "Default initial capacity is 10. When it is exceeded, it grows to 1.5x of the previous size." },
      { q: "What makes an iterator fail-safe?", a: "Fail-safe iterators work on a clone of the collection (e.g., CopyOnWriteArrayList) and do not throw modification exceptions during iteration." }
    ]
  },
  {
    day: 10, week: 2, title: "Collections 2: Sets, Maps & Hashing", category: "Java Advanced",
    topics: ["HashMap Internals (Hashing, Buckets)", "HashSet vs TreeSet vs LinkedHashSet", "Handling HashMap Collisions", "TreeSet vs TreeMap Red-Black Trees"],
    theory: "HashMap leverages the hashCode() of keys to determine bucket indexes. From Java 8, if collision chains exceed a threshold of 8 and total table size >= 64, buckets transition from a Linked List structure to a self-balancing Red-Black Tree.",
    youtubeId: "c3RVW3KGIIE", // Defog Tech HashMap
    dsa: { title: "Group Anagrams", difficulty: "Medium", platform: "LeetCode 49", description: "Group a list of strings into buckets of anagrams using a HashMap with sorted keys.", starterCode: "import java.util.*;\n\npublic class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        return new ArrayList<>();\n    }\n}" },
    viva: [
      { q: "How is a hash collision resolved in Java's HashMap?", a: "Via separate chaining using a Linked List. If chains exceed 8 nodes and array capacity is >= 64, it transforms into a balanced Red-Black Tree." },
      { q: "What guarantees custom objects work correctly as keys in a HashMap?", a: "You must consistently override both hashCode() and equals() to prevent duplicate key entries and ensure valid lookups." }
    ]
  },
  {
    day: 11, week: 2, title: "Java 8 Streams & Functional Interfaces", category: "Java Advanced",
    topics: ["Lambda Expressions", "Functional Interfaces (@FunctionalInterface)", "Stream API Operations (Filter, Map, Reduce)", "Optional Class to avoid Nulls"],
    theory: "Lambda expressions provide inline implementations for functional interfaces. Stream API promotes declarative processing of data with intermediate (lazy) and terminal (triggering) operations. Optional represents a container that is either holding a non-null object or empty.",
    youtubeId: "TCd8QIS-2KI", // Defog Tech Multithreading
    dsa: { title: "First Unique Character in a String", difficulty: "Easy", platform: "LeetCode 387", description: "Find the index of the first non-repeating character in a string. Solve in linear time.", starterCode: "public class Solution {\n    public int firstUniqChar(String s) {\n        // Use frequency count\n        return -1;\n    }\n}" },
    viva: [
      { q: "What is the difference between intermediate and terminal operations on Streams?", a: "Intermediate operations (e.g., filter, map) return a new stream and execute lazily. Terminal operations (e.g., collect, count, forEach) trigger stream evaluation." },
      { q: "What are some popular built-in functional interfaces in Java?", a: "Predicate (takes T, returns boolean), Function (takes T, returns R), Consumer (takes T, returns void), Supplier (takes nothing, returns T)." }
    ]
  },
  {
    day: 12, week: 2, title: "Collections Practice & Sorting", category: "Java Advanced",
    topics: ["Comparable vs Comparator", "Sorting Algorithms", "PriorityQueue Internals", "Collections utility class"],
    theory: "Sorting objects in Java is typically done by implementing the Comparable interface for natural ordering or providing a Comparator for custom sorting. A PriorityQueue is based on a priority heap and sorts its elements based on their natural ordering or a Comparator.",
    youtubeId: "t1-YZ6bF-g0", // Amigoscode Streams
    dsa: { title: "Merge k Sorted Lists", difficulty: "Hard", platform: "LeetCode 23", description: "Merge k sorted linked lists and return it as one sorted list. Use a Min-Heap (PriorityQueue).", starterCode: "import java.util.PriorityQueue;\n\npublic class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // PriorityQueue implementation\n        return null;\n    }\n}" },
    viva: [
      { q: "Difference between Comparable and Comparator?", a: "Comparable is implemented by the class itself to define its natural ordering (compareTo method). Comparator is an external strategy to define custom ordering (compare method)." },
      { q: "What is the time complexity of adding an element to a PriorityQueue?", a: "O(log N), where N is the number of elements, as it needs to maintain the heap property." }
    ]
  },
  {
    day: 29, week: 5, title: "Spring IoC Container & Dependency Injection", category: "Spring Boot",
    topics: ["Inversion of Control (IoC) Concept", "Dependency Injection (DI) Types", "@Component, @Service, @Repository", "@Autowired annotation"],
    theory: "Inversion of Control transfers object lifecycle management to the Spring Framework. The Container instantiates, configures, and manages beans. Constructor injection is the most recommended approach as it supports final variables and aids in unit testing.",
    youtubeId: "9SGDpanrc8U", // Amigoscode Spring Boot
    dsa: { title: "Subarray Sum Equals K", difficulty: "Medium", platform: "LeetCode 560", description: "Find the total number of continuous subarrays whose sum equals a target value k. Optimize to O(N) using cumulative sums.", starterCode: "import java.util.HashMap;\n\npublic class Solution {\n    public int subarraySum(int[] nums, int k) {\n        return 0;\n    }\n}" },
    viva: [
      { q: "What is the default scope of a Spring Bean?", a: "Singleton. The container creates exactly one instance of that bean per application context." },
      { q: "Why is Constructor Injection preferred over Field Injection?", a: "It allows dependencies to be immutable (final), prevents circular dependency issues at startup, and doesn't require reflection for unit tests." }
    ]
  },
  {
    day: 30, week: 5, title: "Spring Boot & REST Controllers", category: "Spring Boot",
    topics: ["@SpringBootApplication", "@RestController vs @Controller", "Mapping HTTP methods (@GetMapping, etc.)", "PathVariables and RequestParams"],
    theory: "Spring Boot is an opinionated framework that minimizes configuration boilerplate. `@RestController` combines `@Controller` and `@ResponseBody`, ensuring all method return values are automatically marshaled into JSON output.",
    youtubeId: "XszpXoII9Sg", // Spring Data JPA
    dsa: { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", platform: "LeetCode 3", description: "Find the length of the longest substring without repeating characters using a sliding window.", starterCode: "import java.util.HashSet;\n\npublic class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}" },
    viva: [
      { q: "What does the @SpringBootApplication annotation encapsulate?", a: "It combines @SpringBootConfiguration, @EnableAutoConfiguration, and @ComponentScan with default arguments." },
      { q: "What is the difference between @PathVariable and @RequestParam?", a: "PathVariable extracts variables directly nested inside the URL path (/users/5), whereas RequestParam reads traditional query parameters (/users?id=5)." }
    ]
  },
  {
    day: 33, week: 5, title: "Spring Security & JWT Authentication", category: "Spring Boot",
    topics: ["Spring Security Filter Chain", "Stateless Authentication", "JWT Generation & Verification", "AuthenticationManager & SecurityContext"],
    theory: "For stateless microservices, session creation is set to Stateless and JSON Web Tokens (JWT) are used instead. Client logins generate a token; subsequent requests pass this token in the Authorization header, and a filter validates the signature and populates the SecurityContextHolder.",
    youtubeId: "KxqlJblhzfI", // Amigoscode JWT
    dsa: { title: "Kth Largest Element in an Array", difficulty: "Medium", platform: "LeetCode 215", description: "Find the Kth largest element using a Min-Heap (PriorityQueue) in O(N log K) time.", starterCode: "import java.util.PriorityQueue;\n\npublic class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        return 0;\n    }\n}" },
    viva: [
      { q: "What are the three parts of a JWT token?", a: "Header (defines type and algorithm), Payload (holds custom and system claims), and Signature (verifies integrity using a secret key)." },
      { q: "Where does Spring Security store authenticated user details for the active thread?", a: "Inside the SecurityContextHolder, which holds the current SecurityContext." }
    ]
  },
  {
    "day": 15,
    "week": 3,
    "title": "Relational Database & SQL Basics",
    "category": "Database & SQL",
    "topics": [
      "RDBMS Concepts",
      "Tables, Rows, Columns",
      "Primary & Foreign Keys",
      "Basic CRUD (SELECT, INSERT, UPDATE, DELETE)"
    ],
    "theory": "A Relational Database Management System (RDBMS) stores data in tables. A Primary Key uniquely identifies a record, while a Foreign Key creates relationships between tables. SQL (Structured Query Language) is used to manipulate this data.",
    "youtubeId": "zsjvFFKOm3c",
    "dsa": {
      "title": "Merge Two Sorted Lists",
      "difficulty": "Easy",
      "platform": "LeetCode 21",
      "description": "Merge two sorted linked lists and return it as a sorted list.",
      "starterCode": "public class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        return null;\n    }\n}"
    },
    "viva": [
      {
        "q": "What is the difference between DDL and DML?",
        "a": "DDL (Data Definition Language) defines the schema (CREATE, ALTER, DROP). DML (Data Manipulation Language) modifies data (INSERT, UPDATE, DELETE)."
      },
      {
        "q": "What is a Foreign Key?",
        "a": "A column or group of columns in a relational database table that provides a link between data in two tables."
      }
    ]
  },
  {
    "day": 16,
    "week": 3,
    "title": "Filtering, Sorting & Functions",
    "category": "Database & SQL",
    "topics": [
      "WHERE, AND, OR, IN",
      "ORDER BY, LIMIT",
      "Aggregate Functions (COUNT, SUM, AVG)",
      "String & Date Functions"
    ],
    "theory": "SQL allows powerful filtering using the WHERE clause. Aggregate functions compute a single result from a set of input values, commonly used for reporting and data analysis.",
    "youtubeId": "7Vtl2WggqOg",
    "dsa": {
      "title": "Remove Nth Node From End of List",
      "difficulty": "Medium",
      "platform": "LeetCode 19",
      "description": "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
      "starterCode": "public class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        return null;\n    }\n}"
    },
    "viva": [
      {
        "q": "What is the difference between WHERE and HAVING?",
        "a": "WHERE filters rows before aggregation. HAVING filters groups after aggregation is performed."
      }
    ]
  },
  {
    "day": 17,
    "week": 3,
    "title": "SQL Joins (Inner, Left, Right, Full)",
    "category": "Database & SQL",
    "topics": [
      "INNER JOIN",
      "LEFT JOIN",
      "RIGHT JOIN",
      "FULL OUTER JOIN"
    ],
    "theory": "Joins combine columns from one or more tables based on the values of the common columns between them. INNER JOIN returns only matching rows. LEFT JOIN returns all rows from the left table and matched rows from the right.",
    "youtubeId": "9yeOJ0ZMUYw",
    "dsa": {
      "title": "Linked List Cycle",
      "difficulty": "Easy",
      "platform": "LeetCode 141",
      "description": "Given head, the head of a linked list, determine if the linked list has a cycle in it using Floyd's Tortoise and Hare.",
      "starterCode": "public class Solution {\n    public boolean hasCycle(ListNode head) {\n        return false;\n    }\n}"
    },
    "viva": [
      {
        "q": "What happens if a LEFT JOIN finds no match in the right table?",
        "a": "The result row will contain NULL for all columns from the right table."
      }
    ]
  },
  {
    "day": 18,
    "week": 3,
    "title": "Grouping Data & Subqueries",
    "category": "Database & SQL",
    "topics": [
      "GROUP BY Clause",
      "HAVING Clause",
      "Correlated Subqueries",
      "Nested Queries"
    ],
    "theory": "The GROUP BY statement groups rows that have the same values into summary rows. Subqueries allow you to execute a query within another query, passing the result up to the outer query.",
    "youtubeId": "kUAdkP9E42k",
    "dsa": {
      "title": "Intersection of Two Linked Lists",
      "difficulty": "Easy",
      "platform": "LeetCode 160",
      "description": "Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect.",
      "starterCode": "public class Solution {\n    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {\n        return null;\n    }\n}"
    },
    "viva": [
      {
        "q": "What is a Correlated Subquery?",
        "a": "A subquery that uses values from the outer query. It is evaluated once for each row processed by the outer query."
      }
    ]
  },
  {
    "day": 19,
    "week": 3,
    "title": "Database Normalization (1NF, 2NF, 3NF)",
    "category": "Database & SQL",
    "topics": [
      "Data Redundancy & Anomalies",
      "1NF (Atomic values)",
      "2NF (Partial Dependency)",
      "3NF (Transitive Dependency)"
    ],
    "theory": "Normalization is the process of organizing data to minimize redundancy and prevent insert/update/delete anomalies. 1NF ensures atomic values. 2NF removes partial dependencies. 3NF removes transitive dependencies.",
    "youtubeId": "GFQaEYEc8_8",
    "dsa": {
      "title": "Middle of the Linked List",
      "difficulty": "Easy",
      "platform": "LeetCode 876",
      "description": "Given the head of a singly linked list, return the middle node of the linked list.",
      "starterCode": "public class Solution {\n    public ListNode middleNode(ListNode head) {\n        return null;\n    }\n}"
    },
    "viva": [
      {
        "q": "What is a Transitive Dependency?",
        "a": "When a non-prime attribute depends on another non-prime attribute, rather than depending directly on the primary key."
      }
    ]
  },
  {
    "day": 20,
    "week": 3,
    "title": "Transactions & ACID Properties",
    "category": "Database & SQL",
    "topics": [
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability"
    ],
    "theory": "A transaction is a single unit of work. ACID guarantees data reliability. Atomicity ensures all-or-nothing. Consistency ensures valid states. Isolation ensures concurrent transactions don't interfere. Durability ensures committed changes survive failures.",
    "youtubeId": "tGqH8iUAn34",
    "dsa": {
      "title": "Reverse Linked List II",
      "difficulty": "Medium",
      "platform": "LeetCode 92",
      "description": "Reverse the nodes of the list from position left to position right, and return the reversed list.",
      "starterCode": "public class Solution {\n    public ListNode reverseBetween(ListNode head, int left, int right) {\n        return null;\n    }\n}"
    },
    "viva": [
      {
        "q": "What is the Dirty Read problem in Isolation?",
        "a": "When a transaction reads data written by another uncommitted transaction that later rolls back, leading to invalid data usage."
      }
    ]
  },
  {
    "day": 21,
    "week": 3,
    "title": "Indexes & Query Optimization",
    "category": "Database & SQL",
    "topics": [
      "B-Tree Indexes",
      "Clustered vs Non-Clustered Indexes",
      "Query Execution Plans",
      "EXPLAIN statement"
    ],
    "theory": "Indexes speed up data retrieval at the cost of slower writes and extra storage. A Clustered Index dictates the physical sorting of the table (only one per table). Non-clustered indexes hold pointers to the actual data.",
    "youtubeId": "fsG1XaZEa78",
    "dsa": {
      "title": "LRU Cache",
      "difficulty": "Medium",
      "platform": "LeetCode 146",
      "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache using a Hash Map and Doubly Linked List.",
      "starterCode": "class LRUCache {\n    public LRUCache(int capacity) {\n        \n    }\n    \n    public int get(int key) {\n        return -1;\n    }\n    \n    public void put(int key, int value) {\n        \n    }\n}"
    },
    "viva": [
      {
        "q": "Why shouldn't you index every column in a table?",
        "a": "Every index requires extra disk space and slows down INSERT, UPDATE, and DELETE operations because the index must also be updated."
      }
    ]
  },
  {
    "day": 22,
    "week": 4,
    "title": "HTML5 & Semantic Web",
    "category": "Frontend Web",
    "topics": [
      "Document Structure",
      "Semantic Tags (header, nav, article)",
      "Forms & Inputs",
      "Accessibility (a11y) basics"
    ],
    "theory": "HTML structures the web. Semantic tags give meaning to the structure (e.g., using <nav> for navigation instead of just <div>), which helps Search Engine Optimization (SEO) and screen readers.",
    "youtubeId": "mU6anWqZJcc",
    "dsa": {
      "title": "Valid Parentheses",
      "difficulty": "Easy",
      "platform": "LeetCode 20",
      "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      "starterCode": "import java.util.Stack;\n\npublic class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}"
    },
    "viva": [
      {
        "q": "Why use semantic HTML?",
        "a": "It improves SEO, makes code easier to read for developers, and ensures the page is accessible to users with screen readers."
      }
    ]
  },
  {
    "day": 23,
    "week": 4,
    "title": "CSS3 Fundamentals & Flexbox",
    "category": "Frontend Web",
    "topics": [
      "Box Model (Margin, Border, Padding)",
      "Selectors & Specificity",
      "Flexbox Layout",
      "Responsive Media Queries"
    ],
    "theory": "CSS styles the web. The Box Model dictates how elements take up space. Flexbox is a 1-dimensional layout model that automatically aligns items in rows or columns, adjusting to available space.",
    "youtubeId": "fYq5PXgSsbE",
    "dsa": {
      "title": "Min Stack",
      "difficulty": "Medium",
      "platform": "LeetCode 155",
      "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
      "starterCode": "class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}"
    },
    "viva": [
      {
        "q": "What is the difference between margin and padding?",
        "a": "Margin is the space OUTSIDE the element's border. Padding is the space INSIDE the element's border, between the border and the content."
      }
    ]
  },
  {
    "day": 24,
    "week": 4,
    "title": "Modern JavaScript (ES6+)",
    "category": "Frontend Web",
    "topics": [
      "let vs const vs var",
      "Arrow Functions",
      "Destructuring & Spread Operator",
      "Promises & Async/Await"
    ],
    "theory": "ES6 revolutionized JavaScript. 'let' and 'const' provide block scoping. Arrow functions provide a concise syntax and lexical 'this' binding. Async/Await makes asynchronous code look synchronous.",
    "youtubeId": "W6NZfCO5SIk",
    "dsa": {
      "title": "Evaluate Reverse Polish Notation",
      "difficulty": "Medium",
      "platform": "LeetCode 150",
      "description": "Evaluate the value of an arithmetic expression in Reverse Polish Notation using a Stack.",
      "starterCode": "public class Solution {\n    public int evalRPN(String[] tokens) {\n        return 0;\n    }\n}"
    },
    "viva": [
      {
        "q": "What is a Promise in JavaScript?",
        "a": "An object representing the eventual completion (or failure) of an asynchronous operation and its resulting value."
      }
    ]
  },
  {
    "day": 25,
    "week": 4,
    "title": "React Fundamentals: JSX & Components",
    "category": "Frontend Web",
    "topics": [
      "Virtual DOM",
      "JSX Syntax",
      "Functional Components",
      "Props vs State"
    ],
    "theory": "React uses a Virtual DOM to optimize updates to the real browser DOM. JSX allows writing HTML-like syntax inside JavaScript. Components are reusable UI building blocks. Props pass data down; State holds local dynamic data.",
    "youtubeId": "bMknfKXIFA8",
    "dsa": {
      "title": "Binary Tree Inorder Traversal",
      "difficulty": "Easy",
      "platform": "LeetCode 94",
      "description": "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      "starterCode": "public class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        return new ArrayList<>();\n    }\n}"
    },
    "viva": [
      {
        "q": "What is the Virtual DOM?",
        "a": "A lightweight JavaScript representation of the actual DOM. React compares it with the previous Virtual DOM (diffing) to batch real DOM updates efficiently."
      }
    ]
  },
  {
    "day": 26,
    "week": 4,
    "title": "React Hooks: useState & useEffect",
    "category": "Frontend Web",
    "topics": [
      "useState Hook",
      "useEffect Hook & Dependency Array",
      "Component Lifecycle (Mount, Update, Unmount)"
    ],
    "theory": "useState lets you add React state to functional components. useEffect lets you perform side effects (data fetching, subscriptions). The dependency array dictates when the effect re-runs.",
    "youtubeId": "O6P86uwfdR0",
    "dsa": {
      "title": "Maximum Depth of Binary Tree",
      "difficulty": "Easy",
      "platform": "LeetCode 104",
      "description": "Given the root of a binary tree, return its maximum depth.",
      "starterCode": "public class Solution {\n    public int maxDepth(TreeNode root) {\n        return 0;\n    }\n}"
    },
    "viva": [
      {
        "q": "What happens if you omit the dependency array in useEffect?",
        "a": "The effect runs after EVERY render of the component, which can lead to infinite loops if the effect updates state."
      }
    ]
  },
  {
    "day": 27,
    "week": 4,
    "title": "Frontend Routing & State Management",
    "category": "Frontend Web",
    "topics": [
      "React Router (BrowserRouter, Routes, Route)",
      "Context API",
      "Prop Drilling problem"
    ],
    "theory": "React Router enables client-side routing, making the app feel like a seamless Single Page Application (SPA). Context API solves Prop Drilling by allowing deep nested components to read global state directly.",
    "youtubeId": "59IXY5IDrBA",
    "dsa": {
      "title": "Invert Binary Tree",
      "difficulty": "Easy",
      "platform": "LeetCode 226",
      "description": "Given the root of a binary tree, invert the tree, and return its root.",
      "starterCode": "public class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        return null;\n    }\n}"
    },
    "viva": [
      {
        "q": "What is Prop Drilling?",
        "a": "Passing data (props) through multiple layers of components that don't need the data, just to reach a deeply nested component that does."
      }
    ]
  },
  {
    "day": 28,
    "week": 4,
    "title": "Connecting Frontend to Spring Backend",
    "category": "Frontend Web",
    "topics": [
      "Fetch API / Axios",
      "CORS (Cross-Origin Resource Sharing)",
      "Handling JWT Tokens on Client",
      "Environment Variables"
    ],
    "theory": "The frontend talks to the backend via HTTP requests. CORS is a browser security feature that blocks requests to different domains unless the backend explicitly allows it. JWT tokens are typically stored in localStorage or secure cookies.",
    "youtubeId": "v0t42xBIYIs",
    "dsa": {
      "title": "Binary Tree Level Order Traversal",
      "difficulty": "Medium",
      "platform": "LeetCode 102",
      "description": "Given the root of a binary tree, return the level order traversal of its nodes' values (using a Queue/BFS).",
      "starterCode": "public class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        return new ArrayList<>();\n    }\n}"
    },
    "viva": [
      {
        "q": "How do you send a JWT token to a Spring Boot backend?",
        "a": "By adding it to the 'Authorization' HTTP header in the format: 'Bearer <token>'."
      }
    ]
  },
  {
    "day": 36,
    "week": 6,
    "title": "Cloud Computing & AWS Basics",
    "category": "Cloud Integration",
    "topics": [
      "IaaS, PaaS, SaaS",
      "AWS EC2 & S3",
      "IAM (Identity and Access Management)",
      "Regions & Availability Zones"
    ],
    "theory": "Cloud computing provides on-demand access to computing resources over the internet. AWS is the dominant provider. IaaS gives you raw hardware (EC2), PaaS gives you a platform (Heroku), and SaaS gives you software (Gmail).",
    "youtubeId": "k1RI5locZE4",
    "dsa": {
      "title": "Merge k Sorted Lists",
      "difficulty": "Hard",
      "platform": "LeetCode 23",
      "description": "Merge k sorted linked lists and return it as one sorted list. Use a PriorityQueue.",
      "starterCode": "public class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        return null;\n    }\n}"
    },
    "viva": [
      {
        "q": "What is the difference between an AWS Region and an Availability Zone?",
        "a": "A Region is a geographic area containing multiple distinct locations called Availability Zones (AZs). AZs are independent fault domains."
      }
    ]
  },
  {
    "day": 37,
    "week": 6,
    "title": "Containerization with Docker",
    "category": "Cloud Integration",
    "topics": [
      "Virtual Machines vs Containers",
      "Docker Images & Containers",
      "Dockerfile Instructions (FROM, RUN, CMD)",
      "Docker Hub"
    ],
    "theory": "Containers package software into standardized units for development, shipment, and deployment. Unlike VMs, they share the host OS kernel, making them lightweight and fast to start.",
    "youtubeId": "Gjnup-PuquQ",
    "dsa": {
      "title": "Sliding Window Maximum",
      "difficulty": "Hard",
      "platform": "LeetCode 239",
      "description": "Return the max sliding window array. Optimal solution uses a Deque (O(N)).",
      "starterCode": "public class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        return new int[]{};\n    }\n}"
    },
    "viva": [
      {
        "q": "What is the difference between an Image and a Container in Docker?",
        "a": "An image is a read-only template with instructions. A container is a runnable, mutable instance of that image."
      }
    ]
  },
  {
    "day": 38,
    "week": 6,
    "title": "Multi-Container Apps (Docker Compose)",
    "category": "Cloud Integration",
    "topics": [
      "docker-compose.yml",
      "Services, Networks, Volumes",
      "Environment Variables in Compose",
      "Linking Frontend and Backend"
    ],
    "theory": "Docker Compose is a tool for defining and running multi-container Docker applications. You configure your application's services using a YAML file, enabling you to start everything with one command.",
    "youtubeId": "fqMOX6JJhGo",
    "dsa": {
      "title": "Trapping Rain Water",
      "difficulty": "Hard",
      "platform": "LeetCode 42",
      "description": "Compute how much water it can trap after raining. Use two pointers.",
      "starterCode": "public class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}"
    },
    "viva": [
      {
        "q": "What is a Docker Volume?",
        "a": "A mechanism to persist data generated by and used by Docker containers, preventing data loss when a container shuts down."
      }
    ]
  },
  {
    "day": 39,
    "week": 6,
    "title": "CI/CD Pipelines",
    "category": "Cloud Integration",
    "topics": [
      "Continuous Integration (CI)",
      "Continuous Deployment/Delivery (CD)",
      "Automated Testing in Pipelines",
      "Deployment Strategies"
    ],
    "theory": "CI/CD automates the building, testing, and deployment of applications. CI ensures new code integrates cleanly (often running tests). CD automates the release of that validated code to staging or production.",
    "youtubeId": "OPw4AUi53-k",
    "dsa": {
      "title": "Median of Two Sorted Arrays",
      "difficulty": "Hard",
      "platform": "LeetCode 4",
      "description": "Find the median of two sorted arrays in O(log (m+n)) using binary search.",
      "starterCode": "public class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}"
    },
    "viva": [
      {
        "q": "What is Blue-Green Deployment?",
        "a": "A strategy where two identical environments exist (Blue and Green). Traffic is routed to one while the other is updated and tested, enabling zero-downtime releases."
      }
    ]
  },
  {
    "day": 40,
    "week": 6,
    "title": "GitHub Actions",
    "category": "Cloud Integration",
    "topics": [
      "Workflows & YAML",
      "Triggers (push, pull_request)",
      "Jobs & Steps",
      "GitHub Secrets"
    ],
    "theory": "GitHub Actions makes it easy to automate all your software workflows directly inside GitHub. A workflow runs one or more jobs, which consist of steps (scripts or actions) executed on a runner (VM).",
    "youtubeId": "R8_veQiYBjI",
    "dsa": {
      "title": "Minimum Window Substring",
      "difficulty": "Hard",
      "platform": "LeetCode 76",
      "description": "Find the minimum window substring of s such that every character in t is included.",
      "starterCode": "public class Solution {\n    public String minWindow(String s, String t) {\n        return \"\";\n    }\n}"
    },
    "viva": [
      {
        "q": "How do you securely pass passwords or API keys to a GitHub Action?",
        "a": "By storing them as encrypted GitHub Secrets and referencing them in the workflow YAML using ${{ secrets.SECRET_NAME }}."
      }
    ]
  },
  {
    "day": 41,
    "week": 7,
    "title": "Monolith vs Microservices",
    "category": "System Design",
    "topics": [
      "Monolithic Architecture",
      "Microservices Architecture",
      "Inter-service Communication (REST/gRPC)",
      "Service Discovery"
    ],
    "theory": "A monolith builds the entire application into a single executable. Microservices break the application into independent, loosely coupled services. Microservices allow independent scaling and tech stacks but introduce distributed system complexity.",
    "youtubeId": "CpbHcpo2k0s",
    "dsa": {
      "title": "Word Search II",
      "difficulty": "Hard",
      "platform": "LeetCode 212",
      "description": "Find all words in the board using a Trie and Backtracking.",
      "starterCode": "public class Solution {\n    public List<String> findWords(char[][] board, String[] words) {\n        return new ArrayList<>();\n    }\n}"
    },
    "viva": [
      {
        "q": "What is an API Gateway in a microservices architecture?",
        "a": "A server that acts as an entry point into the system, routing requests, aggregating results, and handling cross-cutting concerns like authentication and rate limiting."
      }
    ]
  },
  {
    "day": 42,
    "week": 7,
    "title": "Caching & Redis",
    "category": "System Design",
    "topics": [
      "Cache Layers (CDN, DB, App)",
      "Redis In-Memory Data Store",
      "Cache Invalidation Strategies",
      "Cache Stampede / Thundering Herd"
    ],
    "theory": "Caching temporarily stores frequently accessed data in fast memory to reduce latency and database load. Redis is a popular open-source, in-memory key-value store used for caching and message brokering.",
    "youtubeId": "dGAgxozNWFE",
    "dsa": {
      "title": "Alien Dictionary",
      "difficulty": "Hard",
      "platform": "LeetCode 269",
      "description": "Derive the alphabetical order of an alien language using Topological Sort.",
      "starterCode": "public class Solution {\n    public String alienOrder(String[] words) {\n        return \"\";\n    }\n}"
    },
    "viva": [
      {
        "q": "What is a Cache Miss?",
        "a": "When the requested data is not found in the cache, forcing the application to fetch it from the primary database (and usually then write it to the cache)."
      }
    ]
  },
  {
    "day": 43,
    "week": 7,
    "title": "Message Queues & Event-Driven Architecture",
    "category": "System Design",
    "topics": [
      "Synchronous vs Asynchronous",
      "Message Queues (RabbitMQ/SQS)",
      "Event Streaming (Apache Kafka)",
      "Pub/Sub Pattern"
    ],
    "theory": "Message queues decouple services by allowing them to communicate asynchronously. A producer sends a message to a queue, and a consumer processes it later, smoothing out traffic spikes and ensuring reliability.",
    "youtubeId": "8aGhZQkoFbQ",
    "dsa": {
      "title": "Design Twitter",
      "difficulty": "Medium",
      "platform": "LeetCode 355",
      "description": "Design a simplified version of Twitter using OOP and Priority Queues.",
      "starterCode": "class Twitter {\n    public Twitter() {}\n    public void postTweet(int userId, int tweetId) {}\n    public List<Integer> getNewsFeed(int userId) { return new ArrayList<>(); }\n    public void follow(int followerId, int followeeId) {}\n    public void unfollow(int followerId, int followeeId) {}\n}"
    },
    "viva": [
      {
        "q": "What is the difference between a Queue and a Pub/Sub Topic?",
        "a": "A Queue typically delivers a message to a single consumer (point-to-point). A Topic broadcasts a message to all subscribed consumers."
      }
    ]
  },
  {
    "day": 44,
    "week": 7,
    "title": "Load Balancing & Horizontal Scaling",
    "category": "System Design",
    "topics": [
      "Vertical vs Horizontal Scaling",
      "Load Balancers (L4 vs L7)",
      "Consistent Hashing",
      "Round Robin vs Least Connections"
    ],
    "theory": "Vertical scaling adds more power (CPU/RAM) to one machine. Horizontal scaling adds more machines. A Load Balancer distributes incoming network traffic across multiple servers to ensure no single server bears too much demand.",
    "youtubeId": "K0Ta65OqQkY",
    "dsa": {
      "title": "Serialize and Deserialize Binary Tree",
      "difficulty": "Hard",
      "platform": "LeetCode 297",
      "description": "Design an algorithm to serialize and deserialize a binary tree.",
      "starterCode": "public class Codec {\n    public String serialize(TreeNode root) { return \"\"; }\n    public TreeNode deserialize(String data) { return null; }\n}"
    },
    "viva": [
      {
        "q": "What is Layer 7 (L7) Load Balancing?",
        "a": "Load balancing at the application layer (HTTP/HTTPS). It can route traffic based on URL paths, cookies, or headers, unlike L4 which only uses IP and port."
      }
    ]
  },
  {
    "day": 45,
    "week": 7,
    "title": "CAP Theorem & Database Scaling",
    "category": "System Design",
    "topics": [
      "CAP Theorem (Consistency, Availability, Partition Tolerance)",
      "Database Sharding & Partitioning",
      "Replication (Master-Slave/Multi-Master)",
      "SQL vs NoSQL scaling"
    ],
    "theory": "The CAP Theorem states a distributed system can only provide two of three guarantees simultaneously: Consistency, Availability, and Partition Tolerance. Because network partitions (P) are unavoidable, systems must choose between CP and AP.",
    "youtubeId": "wRZYK3E1m4c",
    "dsa": {
      "title": "N-Queens",
      "difficulty": "Hard",
      "platform": "LeetCode 51",
      "description": "Place n queens on an n x n chessboard such that no two queens attack each other (Backtracking).",
      "starterCode": "public class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        return new ArrayList<>();\n    }\n}"
    },
    "viva": [
      {
        "q": "What does Eventual Consistency mean?",
        "a": "In an AP system, replicas might be temporarily out of sync after a write, but they will eventually converge to the same state over time."
      }
    ]
  }
];

export const CURATED_DAYS = new Set(challengeSyllabus.map(d => d.day));

export const getDaySyllabus = (dayNum) => {
  const existing = challengeSyllabus.find(s => s.day === dayNum);
  if (existing) return { ...existing, isTemplate: false };

  let week = Math.ceil(dayNum / 7);
  let category = "Core CS & SQL";
  let title = `Day ${dayNum}: Specialized Concept Exploration`;
  if (week === 3) { category = "Database & SQL"; title = `Day ${dayNum}: Advanced Databases & Queries`; }
  else if (week === 4) { category = "Frontend Web Development"; title = `Day ${dayNum}: Modern UI Architecture`; }
  else if (week === 6) { category = "Cloud Integration"; title = `Day ${dayNum}: Systems & CI/CD Pipelines`; }
  else if (week === 7) { category = "Mock Placement"; title = `Day ${dayNum}: Career Readiness & Design`; }

  return {
    day: dayNum, week, title, category,
    topics: [`Not yet written for this day`, `Use the AI Mentor tab to ask for real material on this topic`, `Or replace this placeholder with your own notes`],
    theory: `No hand-written lesson exists for Day ${dayNum} yet. This is a placeholder, not real content. Use the AI Mentor tab and ask it to teach you this specific topic in depth, or add your own notes in the Notebook panel.`,
    youtubeId: null,
    dsa: {
      title: `Pick your own problem for Day ${dayNum}`,
      difficulty: dayNum % 3 === 0 ? "Hard" : dayNum % 3 === 1 ? "Easy" : "Medium",
      platform: "LeetCode / GeeksforGeeks",
      description: `No specific problem is assigned for this day yet. Pick one matching today's difficulty target from LeetCode, or ask the AI Mentor for a recommendation.`,
      starterCode: "public class Solution {\n    public void solveChallenge() {\n        // Your code here\n    }\n}"
    },
    viva: [
      { q: "(No curated flashcard for this day yet)", a: "Ask the AI Mentor to quiz you on this day's actual topic - this placeholder card has no real content." }
    ],
    isTemplate: true
  };
};

export const getCategoryColor = (cat) => {
  switch (cat) {
    case "Java Core": return "bg-indigo-900/40 text-indigo-300 border-indigo-700/50";
    case "Java Advanced": return "bg-purple-900/40 text-purple-300 border-purple-700/50";
    case "OOPs": return "bg-teal-900/40 text-teal-300 border-teal-700/50";
    case "Spring Boot": return "bg-emerald-900/40 text-emerald-300 border-emerald-700/50";
    case "Database & SQL": return "bg-amber-900/40 text-amber-300 border-amber-700/50";
    case "Frontend Web": return "bg-blue-900/40 text-blue-300 border-blue-700/50";
    case "Cloud Integration": return "bg-sky-900/40 text-sky-300 border-sky-700/50";
    case "System Design": return "bg-rose-900/40 text-rose-300 border-rose-700/50";
    default: return "bg-slate-800 text-slate-300 border-slate-700";
  }
};
