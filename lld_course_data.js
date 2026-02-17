// LLD Mastery Course — Complete Course Data
// This file is used to build lld_course.html

const COURSE_DATA = [
// ============================================================
// MODULE 1: JAVA FROM ABSOLUTE ZERO
// ============================================================
{
  title: "Java from Zero",
  topics: [
    {
      title: "What is Java & Hello World",
      content: `
<h3>What is Java?</h3>
<p>Java is a <strong>programming language</strong> — a way to give instructions to a computer. Think of it as learning a new language (like English), but instead of talking to humans, you're talking to a machine.</p>

<div class="callout important"><div class="callout-title">Why Java for LLD?</div><p>Almost every FAANG LLD interview accepts (and prefers) Java. Its strong OOP support makes designs clean and readable. All LLD resources, books, and examples use Java.</p></div>

<h4>Your First Java Program</h4>
<pre><code><span class="cm">// Every Java program starts with a class</span>
<span class="kw">public class</span> <span class="tp">HelloWorld</span> {

    <span class="cm">// main() is where the program starts running</span>
    <span class="kw">public static void</span> <span class="fn">main</span>(String[] args) {
        System.out.println(<span class="st">"Hello, World!"</span>);  <span class="cm">// prints to screen</span>
    }
}</code></pre>

<h4>Breaking it Down — Line by Line</h4>
<table>
<tr><th>Code</th><th>What it means</th></tr>
<tr><td><code>public class HelloWorld</code></td><td>Creates a "blueprint" called HelloWorld. Every Java file needs at least one class.</td></tr>
<tr><td><code>public static void main(...)</code></td><td>The starting point. Java always looks for this exact method to begin.</td></tr>
<tr><td><code>System.out.println(...)</code></td><td>Prints text to the screen. Like <code>console.log</code> in JS or <code>print</code> in Python.</td></tr>
<tr><td><code>{ }</code></td><td>Curly braces define where a block of code begins and ends.</td></tr>
<tr><td><code>;</code></td><td>Every statement ends with a semicolon. Java is strict about this!</td></tr>
</table>

<h3>Variables — Storing Data</h3>
<p>A <strong>variable</strong> is a labeled box that stores a value. In Java, you must say <em>what type</em> of data the box holds.</p>

<pre><code><span class="kw">int</span> age = <span class="nu">25</span>;              <span class="cm">// whole number</span>
<span class="kw">double</span> salary = <span class="nu">75000.50</span>;   <span class="cm">// decimal number</span>
<span class="kw">boolean</span> isHired = <span class="kw">true</span>;     <span class="cm">// true or false</span>
String name = <span class="st">"Alice"</span>;      <span class="cm">// text (note: capital S)</span>
<span class="kw">char</span> grade = <span class="st">'A'</span>;           <span class="cm">// single character</span></code></pre>

<div class="callout tip"><div class="callout-title">Key Rule</div><p>Java is <strong>statically typed</strong> — once you say <code>int age</code>, you can ONLY put whole numbers into <code>age</code>. You can't suddenly put "hello" into it. This catches bugs early!</p></div>

<h3>If-Else — Making Decisions</h3>
<pre><code><span class="kw">int</span> marks = <span class="nu">85</span>;

<span class="kw">if</span> (marks >= <span class="nu">90</span>) {
    System.out.println(<span class="st">"Grade A"</span>);
} <span class="kw">else if</span> (marks >= <span class="nu">70</span>) {
    System.out.println(<span class="st">"Grade B"</span>);   <span class="cm">// ← This prints</span>
} <span class="kw">else</span> {
    System.out.println(<span class="st">"Grade C"</span>);
}</code></pre>

<h3>Loops — Repeating Things</h3>
<pre><code><span class="cm">// For loop: repeat 5 times</span>
<span class="kw">for</span> (<span class="kw">int</span> i = <span class="nu">0</span>; i < <span class="nu">5</span>; i++) {
    System.out.println(<span class="st">"Count: "</span> + i);
}

<span class="cm">// While loop: repeat while condition is true</span>
<span class="kw">int</span> count = <span class="nu">0</span>;
<span class="kw">while</span> (count < <span class="nu">3</span>) {
    System.out.println(<span class="st">"Hello!"</span>);
    count++;
}</code></pre>

<h3>Arrays — Storing Multiple Values</h3>
<pre><code><span class="cm">// Array = fixed-size list of same type</span>
<span class="kw">int</span>[] numbers = {<span class="nu">10</span>, <span class="nu">20</span>, <span class="nu">30</span>, <span class="nu">40</span>};
System.out.println(numbers[<span class="nu">0</span>]);  <span class="cm">// prints 10 (index starts at 0)</span>
System.out.println(numbers.length); <span class="cm">// prints 4</span>

<span class="cm">// Loop through array</span>
<span class="kw">for</span> (<span class="kw">int</span> num : numbers) {
    System.out.println(num);
}</code></pre>
`
    },
    {
      title: "Methods (Functions)",
      content: `
<h3>What is a Method?</h3>
<p>A <strong>method</strong> is a reusable block of code that performs a specific task. Think of it as a recipe — you write it once, and use it whenever you need it.</p>

<pre><code><span class="cm">// Defining a method</span>
<span class="kw">public static int</span> <span class="fn">add</span>(<span class="kw">int</span> a, <span class="kw">int</span> b) {
    <span class="kw">return</span> a + b;
}

<span class="cm">// Using (calling) the method</span>
<span class="kw">int</span> result = <span class="fn">add</span>(<span class="nu">5</span>, <span class="nu">3</span>);  <span class="cm">// result = 8</span></code></pre>

<h4>Anatomy of a Method</h4>
<pre><code><span class="cm">//  access    return-type   name     parameters</span>
<span class="cm">//    ↓          ↓          ↓          ↓</span>
    <span class="kw">public</span>      <span class="kw">int</span>        <span class="fn">add</span>    (<span class="kw">int</span> a, <span class="kw">int</span> b) {
        <span class="kw">return</span> a + b;  <span class="cm">// what the method gives back</span>
    }</code></pre>

<table>
<tr><th>Part</th><th>What it means</th></tr>
<tr><td><code>public</code></td><td>Anyone can use this method</td></tr>
<tr><td><code>int</code></td><td>This method returns a whole number</td></tr>
<tr><td><code>void</code></td><td>This method returns NOTHING (just does an action)</td></tr>
<tr><td><code>Parameters</code></td><td>Inputs the method needs to work</td></tr>
<tr><td><code>return</code></td><td>Sends a value back to whoever called the method</td></tr>
</table>

<h4>void Methods — No Return Value</h4>
<pre><code><span class="kw">public static void</span> <span class="fn">greet</span>(String name) {
    System.out.println(<span class="st">"Hello, "</span> + name + <span class="st">"!"</span>);
    <span class="cm">// no return statement needed</span>
}

<span class="fn">greet</span>(<span class="st">"Alice"</span>);  <span class="cm">// prints: Hello, Alice!</span></code></pre>

<div class="callout interview"><div class="callout-title">🎯 Why This Matters for LLD</div><p>In LLD, every class has methods. You'll design methods like <code>parkCar()</code>, <code>bookTicket()</code>, <code>processPayment()</code>. Understanding parameters, return types, and access modifiers is CRITICAL.</p></div>
`
    },
    {
      title: "Classes & Objects — The Foundation",
      content: `
<h3>The Most Important Concept</h3>
<p><strong>LLD is ALL about classes and objects.</strong> If you understand this one topic deeply, you're 50% done. Everything in LLD — every design pattern, every system design — is about how classes talk to each other.</p>

<h4>Real-World Analogy</h4>
<p>Think of a <strong>Class</strong> as a <em>blueprint</em> of a house. Think of an <strong>Object</strong> as an <em>actual house</em> built from that blueprint. One blueprint → many houses.</p>

<pre><code><span class="cm">// CLASS = Blueprint</span>
<span class="kw">class</span> <span class="tp">Car</span> {
    <span class="cm">// Properties (what the car HAS)</span>
    String brand;
    String color;
    <span class="kw">int</span> speed;

    <span class="cm">// Behavior (what the car DOES)</span>
    <span class="kw">void</span> <span class="fn">accelerate</span>() {
        speed += <span class="nu">10</span>;
        System.out.println(brand + <span class="st">" speed: "</span> + speed);
    }

    <span class="kw">void</span> <span class="fn">brake</span>() {
        speed -= <span class="nu">10</span>;
        System.out.println(brand + <span class="st">" speed: "</span> + speed);
    }
}

<span class="cm">// OBJECT = Actual car built from the blueprint</span>
<span class="kw">public class</span> <span class="tp">Main</span> {
    <span class="kw">public static void</span> <span class="fn">main</span>(String[] args) {
        Car myCar = <span class="kw">new</span> Car();     <span class="cm">// Create object</span>
        myCar.brand = <span class="st">"Tesla"</span>;      <span class="cm">// Set properties</span>
        myCar.color = <span class="st">"Red"</span>;
        myCar.speed = <span class="nu">0</span>;

        myCar.<span class="fn">accelerate</span>();  <span class="cm">// Tesla speed: 10</span>
        myCar.<span class="fn">accelerate</span>();  <span class="cm">// Tesla speed: 20</span>
        myCar.<span class="fn">brake</span>();       <span class="cm">// Tesla speed: 10</span>
    }
}</code></pre>

<h3>Constructors — Building Objects Properly</h3>
<p>A <strong>constructor</strong> is a special method that runs automatically when you create an object. It sets up the initial state.</p>

<pre><code><span class="kw">class</span> <span class="tp">Car</span> {
    String brand;
    String color;
    <span class="kw">int</span> speed;

    <span class="cm">// Constructor — same name as class, no return type</span>
    <span class="tp">Car</span>(String brand, String color) {
        <span class="kw">this</span>.brand = brand;   <span class="cm">// 'this' = this object being created</span>
        <span class="kw">this</span>.color = color;
        <span class="kw">this</span>.speed = <span class="nu">0</span>;       <span class="cm">// default speed</span>
    }
}

<span class="cm">// Now creating objects is clean:</span>
Car tesla = <span class="kw">new</span> Car(<span class="st">"Tesla"</span>, <span class="st">"Red"</span>);
Car bmw = <span class="kw">new</span> Car(<span class="st">"BMW"</span>, <span class="st">"Black"</span>);</code></pre>

<div class="callout important"><div class="callout-title">The 'this' keyword</div><p><code>this</code> refers to the current object. When parameter name and field name are same (both called <code>brand</code>), use <code>this.brand</code> to mean "the object's brand" and just <code>brand</code> for "the parameter".</p></div>

<h3>Static vs Non-Static</h3>
<table>
<tr><th>Non-Static (Instance)</th><th>Static (Class-level)</th></tr>
<tr><td>Belongs to each object</td><td>Belongs to the class itself</td></tr>
<tr><td>Different for every object</td><td>Same for ALL objects</td></tr>
<tr><td><code>myCar.speed</code></td><td><code>Car.totalCars</code></td></tr>
</table>

<pre><code><span class="kw">class</span> <span class="tp">Car</span> {
    String brand;              <span class="cm">// instance: each car has own brand</span>
    <span class="kw">static int</span> totalCars = <span class="nu">0</span>;  <span class="cm">// static: shared across ALL cars</span>

    <span class="tp">Car</span>(String brand) {
        <span class="kw">this</span>.brand = brand;
        totalCars++;           <span class="cm">// every new car increments the count</span>
    }
}
<span class="cm">// Car.totalCars → keeps track of how many cars exist</span></code></pre>
`
    },
    {
      title: "The 4 Pillars of OOP",
      content: `
<h3>The 4 Pillars — The DNA of LLD</h3>
<p>Every LLD interview tests your understanding of these 4 concepts. They are the foundation of everything.</p>

<h3>Pillar 1: Encapsulation</h3>
<p><strong>Meaning:</strong> Hide internal details, expose only what's necessary. Like a TV remote — you press buttons (public interface) but don't see the circuit board (private internals).</p>

<pre><code><span class="kw">class</span> <span class="tp">BankAccount</span> {
    <span class="kw">private double</span> balance;  <span class="cm">// PRIVATE: nobody can touch this directly</span>

    <span class="kw">public</span> <span class="tp">BankAccount</span>(<span class="kw">double</span> initialBalance) {
        <span class="kw">this</span>.balance = initialBalance;
    }

    <span class="cm">// Public methods = controlled access</span>
    <span class="kw">public void</span> <span class="fn">deposit</span>(<span class="kw">double</span> amount) {
        <span class="kw">if</span> (amount > <span class="nu">0</span>) {
            balance += amount;  <span class="cm">// validation before modifying</span>
        }
    }

    <span class="kw">public boolean</span> <span class="fn">withdraw</span>(<span class="kw">double</span> amount) {
        <span class="kw">if</span> (amount > <span class="nu">0</span> && amount <= balance) {
            balance -= amount;
            <span class="kw">return true</span>;
        }
        <span class="kw">return false</span>;  <span class="cm">// insufficient funds</span>
    }

    <span class="kw">public double</span> <span class="fn">getBalance</span>() { <span class="kw">return</span> balance; }
}</code></pre>

<div class="callout tip"><div class="callout-title">Access Modifiers</div>
<p><code>private</code> — Only this class can access<br>
<code>public</code> — Anyone can access<br>
<code>protected</code> — This class + child classes<br>
<em>default</em> (no keyword) — Same package only</p></div>

<h3>Pillar 2: Inheritance</h3>
<p><strong>Meaning:</strong> A child class gets everything from a parent class, plus can add its own stuff. Like how a <em>SportsCar</em> IS A <em>Car</em>, but with extra features.</p>

<pre><code><span class="cm">// Parent class</span>
<span class="kw">class</span> <span class="tp">Vehicle</span> {
    String brand;
    <span class="kw">int</span> speed;

    <span class="kw">void</span> <span class="fn">start</span>() {
        System.out.println(brand + <span class="st">" started"</span>);
    }
}

<span class="cm">// Child class INHERITS from Vehicle</span>
<span class="kw">class</span> <span class="tp">Car</span> <span class="kw">extends</span> <span class="tp">Vehicle</span> {
    <span class="kw">int</span> numDoors;

    <span class="kw">void</span> <span class="fn">honk</span>() {
        System.out.println(<span class="st">"Beep beep!"</span>);
    }
}

<span class="cm">// Car has: brand, speed, start(), numDoors, honk()</span>
Car car = <span class="kw">new</span> Car();
car.brand = <span class="st">"Honda"</span>;  <span class="cm">// inherited from Vehicle</span>
car.<span class="fn">start</span>();           <span class="cm">// inherited from Vehicle</span>
car.<span class="fn">honk</span>();            <span class="cm">// its own method</span></code></pre>

<h3>Pillar 3: Polymorphism</h3>
<p><strong>Meaning:</strong> "Many forms" — same method name, different behavior. This is the SECRET WEAPON of LLD design.</p>

<pre><code><span class="kw">class</span> <span class="tp">Animal</span> {
    <span class="kw">void</span> <span class="fn">makeSound</span>() {
        System.out.println(<span class="st">"Some sound"</span>);
    }
}

<span class="kw">class</span> <span class="tp">Dog</span> <span class="kw">extends</span> <span class="tp">Animal</span> {
    <span class="an">@Override</span>
    <span class="kw">void</span> <span class="fn">makeSound</span>() {        <span class="cm">// OVERRIDES parent method</span>
        System.out.println(<span class="st">"Woof!"</span>);
    }
}

<span class="kw">class</span> <span class="tp">Cat</span> <span class="kw">extends</span> <span class="tp">Animal</span> {
    <span class="an">@Override</span>
    <span class="kw">void</span> <span class="fn">makeSound</span>() {
        System.out.println(<span class="st">"Meow!"</span>);
    }
}

<span class="cm">// THE MAGIC: Use parent type, get child behavior</span>
Animal myPet = <span class="kw">new</span> Dog();
myPet.<span class="fn">makeSound</span>();  <span class="cm">// prints "Woof!" (not "Some sound")</span>

Animal[] pets = { <span class="kw">new</span> Dog(), <span class="kw">new</span> Cat(), <span class="kw">new</span> Dog() };
<span class="kw">for</span> (Animal pet : pets) {
    pet.<span class="fn">makeSound</span>();  <span class="cm">// Each calls its OWN version!</span>
}</code></pre>

<div class="callout interview"><div class="callout-title">🎯 LLD Interview Gold</div><p>Polymorphism lets you write code that works with <em>any</em> type without knowing the specific type. Example: a PaymentProcessor that handles CreditCard, UPI, Cash — all through one <code>processPayment()</code> method.</p></div>

<h3>Pillar 4: Abstraction</h3>
<p><strong>Meaning:</strong> Show only WHAT something does, hide HOW it does it. Like driving a car — you know the steering wheel turns the car, but you don't need to know the mechanics.</p>

<pre><code><span class="cm">// Abstract class = incomplete blueprint</span>
<span class="kw">abstract class</span> <span class="tp">Shape</span> {
    String color;

    <span class="cm">// Abstract method = MUST be implemented by children</span>
    <span class="kw">abstract double</span> <span class="fn">area</span>();

    <span class="cm">// Normal method = optional to override</span>
    <span class="kw">void</span> <span class="fn">display</span>() {
        System.out.println(color + <span class="st">" shape, area = "</span> + <span class="fn">area</span>());
    }
}

<span class="kw">class</span> <span class="tp">Circle</span> <span class="kw">extends</span> <span class="tp">Shape</span> {
    <span class="kw">double</span> radius;

    <span class="tp">Circle</span>(<span class="kw">double</span> radius) { <span class="kw">this</span>.radius = radius; }

    <span class="an">@Override</span>
    <span class="kw">double</span> <span class="fn">area</span>() { <span class="kw">return</span> Math.PI * radius * radius; }
}

<span class="kw">class</span> <span class="tp">Rectangle</span> <span class="kw">extends</span> <span class="tp">Shape</span> {
    <span class="kw">double</span> w, h;

    <span class="tp">Rectangle</span>(<span class="kw">double</span> w, <span class="kw">double</span> h) { <span class="kw">this</span>.w = w; <span class="kw">this</span>.h = h; }

    <span class="an">@Override</span>
    <span class="kw">double</span> <span class="fn">area</span>() { <span class="kw">return</span> w * h; }
}</code></pre>
`
    },
    {
      title: "Interfaces — The Contract",
      content: `
<h3>What is an Interface?</h3>
<p>An <strong>interface</strong> is a <em>contract</em>. It says "if you sign this contract, you PROMISE to implement these methods." It defines WHAT to do, but not HOW.</p>

<pre><code><span class="cm">// Interface = pure contract</span>
<span class="kw">interface</span> <span class="tp">Flyable</span> {
    <span class="kw">void</span> <span class="fn">fly</span>();          <span class="cm">// no body — just the promise</span>
    <span class="kw">void</span> <span class="fn">land</span>();
}

<span class="kw">interface</span> <span class="tp">Swimmable</span> {
    <span class="kw">void</span> <span class="fn">swim</span>();
}

<span class="cm">// A class can implement MULTIPLE interfaces</span>
<span class="kw">class</span> <span class="tp">Duck</span> <span class="kw">implements</span> <span class="tp">Flyable</span>, <span class="tp">Swimmable</span> {
    <span class="an">@Override</span>
    <span class="kw">public void</span> <span class="fn">fly</span>()  { System.out.println(<span class="st">"Duck flying"</span>); }

    <span class="an">@Override</span>
    <span class="kw">public void</span> <span class="fn">land</span>() { System.out.println(<span class="st">"Duck landing"</span>); }

    <span class="an">@Override</span>
    <span class="kw">public void</span> <span class="fn">swim</span>() { System.out.println(<span class="st">"Duck swimming"</span>); }
}</code></pre>

<h4>Abstract Class vs Interface — When to Use What?</h4>
<table>
<tr><th>Feature</th><th>Abstract Class</th><th>Interface</th></tr>
<tr><td>Can have fields?</td><td>✅ Yes</td><td>❌ Only constants</td></tr>
<tr><td>Can have constructors?</td><td>✅ Yes</td><td>❌ No</td></tr>
<tr><td>Can have method bodies?</td><td>✅ Yes</td><td>✅ default methods</td></tr>
<tr><td>Multiple inheritance?</td><td>❌ Only one parent</td><td>✅ Many interfaces</td></tr>
<tr><td>Use when…</td><td>IS-A relationship with shared code</td><td>CAN-DO capability / contract</td></tr>
</table>

<div class="callout interview"><div class="callout-title">🎯 LLD Golden Rule</div><p>In LLD interviews, <strong>always prefer interfaces</strong> to define behaviors. Use abstract classes when you need shared code among related classes. Example: <code>PaymentMethod</code> interface with <code>CreditCard</code>, <code>UPI</code>, <code>Wallet</code> implementations.</p></div>
`
    },
    {
      title: "Enums — Fixed Set of Values",
      content: `
<h3>What are Enums?</h3>
<p>An <strong>enum</strong> (enumeration) represents a <em>fixed set of constants</em>. Instead of using strings like "SMALL", "MEDIUM", "LARGE" (which can be typo'd), use enums!</p>

<pre><code><span class="kw">enum</span> <span class="tp">VehicleType</span> {
    CAR, BIKE, TRUCK, BUS
}

<span class="kw">enum</span> <span class="tp">ParkingSpotSize</span> {
    SMALL, MEDIUM, LARGE
}

<span class="kw">enum</span> <span class="tp">TicketStatus</span> {
    ACTIVE, PAID, LOST
}

<span class="cm">// Using enums</span>
VehicleType type = VehicleType.CAR;

<span class="kw">if</span> (type == VehicleType.CAR) {
    System.out.println(<span class="st">"It's a car!"</span>);
}

<span class="cm">// Switch with enums — very common in LLD</span>
<span class="kw">switch</span> (type) {
    <span class="kw">case</span> CAR:   System.out.println(<span class="st">"Assign small spot"</span>); <span class="kw">break</span>;
    <span class="kw">case</span> TRUCK: System.out.println(<span class="st">"Assign large spot"</span>); <span class="kw">break</span>;
    <span class="kw">case</span> BIKE:  System.out.println(<span class="st">"Assign small spot"</span>); <span class="kw">break</span>;
}</code></pre>

<div class="callout important"><div class="callout-title">Why Enums in LLD?</div><p>Every LLD problem uses enums for: status codes (<code>OrderStatus</code>), types (<code>VehicleType</code>), roles (<code>UserRole</code>), states (<code>ElevatorState</code>). They prevent bugs from typos and make code self-documenting.</p></div>
`
    },
    {
      title: "Collections — List, Map, Set",
      content: `
<h3>Why Collections?</h3>
<p>Arrays have a fixed size. In LLD, you need lists that grow/shrink (parking spots, orders, users). Java <strong>Collections</strong> are dynamic data structures.</p>

<h4>1. List — Ordered collection (allows duplicates)</h4>
<pre><code><span class="kw">import</span> java.util.*;

List&lt;String&gt; names = <span class="kw">new</span> ArrayList&lt;&gt;();
names.add(<span class="st">"Alice"</span>);
names.add(<span class="st">"Bob"</span>);
names.add(<span class="st">"Alice"</span>);       <span class="cm">// duplicates OK</span>
System.out.println(names);  <span class="cm">// [Alice, Bob, Alice]</span>
System.out.println(names.get(<span class="nu">0</span>)); <span class="cm">// Alice</span>
names.remove(<span class="st">"Bob"</span>);
System.out.println(names.size());  <span class="cm">// 2</span></code></pre>

<h4>2. Map — Key-Value pairs (like a dictionary)</h4>
<pre><code>Map&lt;String, Integer&gt; ages = <span class="kw">new</span> HashMap&lt;&gt;();
ages.put(<span class="st">"Alice"</span>, <span class="nu">25</span>);
ages.put(<span class="st">"Bob"</span>, <span class="nu">30</span>);

System.out.println(ages.get(<span class="st">"Alice"</span>));     <span class="cm">// 25</span>
System.out.println(ages.containsKey(<span class="st">"Bob"</span>)); <span class="cm">// true</span>

<span class="cm">// Loop through map</span>
<span class="kw">for</span> (Map.Entry&lt;String, Integer&gt; entry : ages.entrySet()) {
    System.out.println(entry.getKey() + <span class="st">" is "</span> + entry.getValue());
}</code></pre>

<h4>3. Set — No duplicates, unordered</h4>
<pre><code>Set&lt;String&gt; uniqueNames = <span class="kw">new</span> HashSet&lt;&gt;();
uniqueNames.add(<span class="st">"Alice"</span>);
uniqueNames.add(<span class="st">"Bob"</span>);
uniqueNames.add(<span class="st">"Alice"</span>);  <span class="cm">// ignored — already exists</span>
System.out.println(uniqueNames);  <span class="cm">// [Alice, Bob]</span></code></pre>

<h4>4. Queue — First-In-First-Out</h4>
<pre><code>Queue&lt;String&gt; queue = <span class="kw">new</span> LinkedList&lt;&gt;();
queue.add(<span class="st">"Customer1"</span>);
queue.add(<span class="st">"Customer2"</span>);
queue.add(<span class="st">"Customer3"</span>);

System.out.println(queue.poll());  <span class="cm">// Customer1 (removed)</span>
System.out.println(queue.peek());  <span class="cm">// Customer2 (NOT removed)</span></code></pre>

<div class="callout tip"><div class="callout-title">LLD Usage Cheat Sheet</div>
<p><strong>List</strong> → Ordered items: parking spots, orders, movie seats<br>
<strong>Map</strong> → Lookup by key: userId→User, spotId→ParkingSpot<br>
<strong>Set</strong> → Unique items: available spots, registered users<br>
<strong>Queue</strong> → FIFO processing: elevator requests, order queue</p></div>
`
    },
    {
      title: "Exception Handling & Generics",
      content: `
<h3>Exception Handling</h3>
<p>When something goes wrong (withdraw more than balance, invalid input), Java uses <strong>exceptions</strong> to handle errors gracefully instead of crashing.</p>

<pre><code><span class="cm">// Creating a custom exception</span>
<span class="kw">class</span> <span class="tp">InsufficientFundsException</span> <span class="kw">extends</span> <span class="tp">Exception</span> {
    <span class="kw">public</span> <span class="tp">InsufficientFundsException</span>(String msg) {
        <span class="kw">super</span>(msg);
    }
}

<span class="cm">// Using it</span>
<span class="kw">class</span> <span class="tp">BankAccount</span> {
    <span class="kw">private double</span> balance;

    <span class="kw">public void</span> <span class="fn">withdraw</span>(<span class="kw">double</span> amount) <span class="kw">throws</span> InsufficientFundsException {
        <span class="kw">if</span> (amount > balance) {
            <span class="kw">throw new</span> InsufficientFundsException(
                <span class="st">"Need "</span> + amount + <span class="st">" but have "</span> + balance
            );
        }
        balance -= amount;
    }
}

<span class="cm">// Handling exceptions</span>
<span class="kw">try</span> {
    account.<span class="fn">withdraw</span>(<span class="nu">1000</span>);
} <span class="kw">catch</span> (InsufficientFundsException e) {
    System.out.println(<span class="st">"Error: "</span> + e.getMessage());
}</code></pre>

<h3>Generics — Type Safety</h3>
<p><strong>Generics</strong> let you write classes/methods that work with any type, while keeping type safety.</p>

<pre><code><span class="cm">// Without generics: no type safety</span>
List list = <span class="kw">new</span> ArrayList();
list.add(<span class="st">"Hello"</span>);
list.add(<span class="nu">42</span>);  <span class="cm">// mixed types — bugs waiting to happen!</span>

<span class="cm">// With generics: type-safe</span>
List&lt;String&gt; names = <span class="kw">new</span> ArrayList&lt;&gt;();
names.add(<span class="st">"Hello"</span>);
<span class="cm">// names.add(42);  // COMPILE ERROR! Can only add Strings</span></code></pre>

<div class="callout interview"><div class="callout-title">🎯 In LLD Interviews</div><p>Custom exceptions show you handle edge cases properly. Generics show you write reusable code. Both are signals of a senior engineer's design sensibility.</p></div>

<div class="section-divider"></div>
<h3>✅ Module 1 Complete!</h3>
<p>You now know enough Java to design any system! The key concepts: <strong>classes, objects, constructors, 4 OOP pillars (encapsulation, inheritance, polymorphism, abstraction), interfaces, enums, collections, and exceptions</strong>. Move on to Module 2 to learn the DESIGN PRINCIPLES.</p>
`
    }
  ]
},
// ============================================================
// MODULE 2: OOP DESIGN PRINCIPLES & SOLID
// ============================================================
{
  title: "OOP & SOLID Principles",
  topics: [
    {
      title: "S — Single Responsibility",
      content: `
<h3>Single Responsibility Principle (SRP)</h3>
<p><strong>Rule:</strong> A class should have <em>only ONE reason to change</em>. Each class does ONE thing, and does it well.</p>

<h4>❌ BAD: One class doing everything</h4>
<pre><code><span class="kw">class</span> <span class="tp">Invoice</span> {
    <span class="kw">void</span> <span class="fn">calculateTotal</span>()    { <span class="cm">/* math logic */</span> }
    <span class="kw">void</span> <span class="fn">printInvoice</span>()      { <span class="cm">/* printing logic */</span> }
    <span class="kw">void</span> <span class="fn">saveToDatabase</span>()    { <span class="cm">/* database logic */</span> }
    <span class="kw">void</span> <span class="fn">sendEmail</span>()         { <span class="cm">/* email logic */</span> }
}
<span class="cm">// Problem: If printing changes, you modify Invoice class</span>
<span class="cm">// If email template changes, you modify Invoice class</span>
<span class="cm">// Too many reasons to change!</span></code></pre>

<h4>✅ GOOD: Each class = one responsibility</h4>
<pre><code><span class="kw">class</span> <span class="tp">Invoice</span> {
    <span class="kw">void</span> <span class="fn">calculateTotal</span>() { <span class="cm">/* only math */</span> }
}

<span class="kw">class</span> <span class="tp">InvoicePrinter</span> {
    <span class="kw">void</span> <span class="fn">print</span>(Invoice invoice) { <span class="cm">/* only printing */</span> }
}

<span class="kw">class</span> <span class="tp">InvoiceRepository</span> {
    <span class="kw">void</span> <span class="fn">save</span>(Invoice invoice) { <span class="cm">/* only database */</span> }
}

<span class="kw">class</span> <span class="tp">InvoiceMailer</span> {
    <span class="kw">void</span> <span class="fn">send</span>(Invoice invoice) { <span class="cm">/* only email */</span> }
}</code></pre>

<div class="callout interview"><div class="callout-title">🎯 Interview Signal</div><p>When designing a Parking Lot: <code>ParkingLot</code> manages spots, <code>TicketService</code> handles tickets, <code>PaymentService</code> handles payments. Don't dump everything into one God class!</p></div>
`
    },
    {
      title: "O — Open/Closed Principle",
      content: `
<h3>Open/Closed Principle (OCP)</h3>
<p><strong>Rule:</strong> Classes should be <em>open for extension</em> but <em>closed for modification</em>. Add new features by ADDING code, not changing existing code.</p>

<h4>❌ BAD: Modifying existing code for every new type</h4>
<pre><code><span class="kw">class</span> <span class="tp">PaymentProcessor</span> {
    <span class="kw">void</span> <span class="fn">pay</span>(String type, <span class="kw">double</span> amount) {
        <span class="kw">if</span> (type.equals(<span class="st">"creditcard"</span>)) {
            <span class="cm">// credit card logic</span>
        } <span class="kw">else if</span> (type.equals(<span class="st">"upi"</span>)) {
            <span class="cm">// UPI logic</span>
        } <span class="kw">else if</span> (type.equals(<span class="st">"crypto"</span>)) {
            <span class="cm">// Every new payment = modify this class!</span>
        }
    }
}</code></pre>

<h4>✅ GOOD: Extend without modifying</h4>
<pre><code><span class="kw">interface</span> <span class="tp">PaymentMethod</span> {
    <span class="kw">void</span> <span class="fn">pay</span>(<span class="kw">double</span> amount);
}

<span class="kw">class</span> <span class="tp">CreditCardPayment</span> <span class="kw">implements</span> <span class="tp">PaymentMethod</span> {
    <span class="kw">public void</span> <span class="fn">pay</span>(<span class="kw">double</span> amount) { <span class="cm">/* credit card logic */</span> }
}

<span class="kw">class</span> <span class="tp">UPIPayment</span> <span class="kw">implements</span> <span class="tp">PaymentMethod</span> {
    <span class="kw">public void</span> <span class="fn">pay</span>(<span class="kw">double</span> amount) { <span class="cm">/* UPI logic */</span> }
}

<span class="cm">// Adding crypto? Just add a NEW class. ZERO changes to existing code!</span>
<span class="kw">class</span> <span class="tp">CryptoPayment</span> <span class="kw">implements</span> <span class="tp">PaymentMethod</span> {
    <span class="kw">public void</span> <span class="fn">pay</span>(<span class="kw">double</span> amount) { <span class="cm">/* crypto logic */</span> }
}

<span class="cm">// Processor doesn't care about type — just calls pay()</span>
<span class="kw">class</span> <span class="tp">PaymentProcessor</span> {
    <span class="kw">void</span> <span class="fn">process</span>(PaymentMethod method, <span class="kw">double</span> amount) {
        method.<span class="fn">pay</span>(amount);
    }
}</code></pre>
`
    },
    {
      title: "L — Liskov Substitution",
      content: `
<h3>Liskov Substitution Principle (LSP)</h3>
<p><strong>Rule:</strong> If <code>B extends A</code>, you should be able to use <code>B</code> everywhere you use <code>A</code> without breaking anything.</p>

<h4>❌ BAD: Subclass breaks parent's behavior</h4>
<pre><code><span class="kw">class</span> <span class="tp">Bird</span> {
    <span class="kw">void</span> <span class="fn">fly</span>() { System.out.println(<span class="st">"Flying..."</span>); }
}

<span class="kw">class</span> <span class="tp">Penguin</span> <span class="kw">extends</span> <span class="tp">Bird</span> {
    <span class="an">@Override</span>
    <span class="kw">void</span> <span class="fn">fly</span>() {
        <span class="kw">throw new</span> UnsupportedOperationException(<span class="st">"Penguins can't fly!"</span>);
    }
}
<span class="cm">// PROBLEM: Code that expects a Bird will crash with Penguin!</span>
<span class="cm">// Bird b = new Penguin(); b.fly(); → EXCEPTION!</span></code></pre>

<h4>✅ GOOD: Separate the capabilities</h4>
<pre><code><span class="kw">interface</span> <span class="tp">Flyable</span> {
    <span class="kw">void</span> <span class="fn">fly</span>();
}

<span class="kw">interface</span> <span class="tp">Walkable</span> {
    <span class="kw">void</span> <span class="fn">walk</span>();
}

<span class="kw">class</span> <span class="tp">Sparrow</span> <span class="kw">implements</span> <span class="tp">Flyable</span>, <span class="tp">Walkable</span> {
    <span class="kw">public void</span> <span class="fn">fly</span>()  { System.out.println(<span class="st">"Sparrow flying"</span>); }
    <span class="kw">public void</span> <span class="fn">walk</span>() { System.out.println(<span class="st">"Sparrow walking"</span>); }
}

<span class="kw">class</span> <span class="tp">Penguin</span> <span class="kw">implements</span> <span class="tp">Walkable</span> {
    <span class="kw">public void</span> <span class="fn">walk</span>() { System.out.println(<span class="st">"Penguin walking"</span>); }
    <span class="cm">// No fly() — because penguins don't fly!</span>
}</code></pre>

<div class="callout tip"><div class="callout-title">Simple Test</div><p>Ask yourself: "Can I replace the parent with this child and nothing breaks?" If yes → good. If no → violation.</p></div>
`
    },
    {
      title: "I — Interface Segregation",
      content: `
<h3>Interface Segregation Principle (ISP)</h3>
<p><strong>Rule:</strong> Don't force classes to implement methods they don't need. Split fat interfaces into smaller, focused ones.</p>

<h4>❌ BAD: One fat interface</h4>
<pre><code><span class="kw">interface</span> <span class="tp">Worker</span> {
    <span class="kw">void</span> <span class="fn">code</span>();
    <span class="kw">void</span> <span class="fn">test</span>();
    <span class="kw">void</span> <span class="fn">design</span>();
    <span class="kw">void</span> <span class="fn">managePeople</span>();
}

<span class="cm">// Junior dev is FORCED to implement managePeople() — makes no sense!</span>
<span class="kw">class</span> <span class="tp">JuniorDev</span> <span class="kw">implements</span> <span class="tp">Worker</span> {
    <span class="kw">public void</span> <span class="fn">code</span>()         { <span class="cm">/* yes */</span> }
    <span class="kw">public void</span> <span class="fn">test</span>()         { <span class="cm">/* yes */</span> }
    <span class="kw">public void</span> <span class="fn">design</span>()       { <span class="cm">/* maybe */</span> }
    <span class="kw">public void</span> <span class="fn">managePeople</span>() { <span class="cm">/* NOT MY JOB! */</span> }
}</code></pre>

<h4>✅ GOOD: Split into focused interfaces</h4>
<pre><code><span class="kw">interface</span> <span class="tp">Coder</span>    { <span class="kw">void</span> <span class="fn">code</span>(); }
<span class="kw">interface</span> <span class="tp">Tester</span>   { <span class="kw">void</span> <span class="fn">test</span>(); }
<span class="kw">interface</span> <span class="tp">Designer</span> { <span class="kw">void</span> <span class="fn">design</span>(); }
<span class="kw">interface</span> <span class="tp">Manager</span>  { <span class="kw">void</span> <span class="fn">managePeople</span>(); }

<span class="kw">class</span> <span class="tp">JuniorDev</span> <span class="kw">implements</span> <span class="tp">Coder</span>, <span class="tp">Tester</span> {
    <span class="kw">public void</span> <span class="fn">code</span>() { <span class="cm">/* yes */</span> }
    <span class="kw">public void</span> <span class="fn">test</span>() { <span class="cm">/* yes */</span> }
}

<span class="kw">class</span> <span class="tp">TechLead</span> <span class="kw">implements</span> <span class="tp">Coder</span>, <span class="tp">Designer</span>, <span class="tp">Manager</span> {
    <span class="kw">public void</span> <span class="fn">code</span>()         { <span class="cm">/* yes */</span> }
    <span class="kw">public void</span> <span class="fn">design</span>()       { <span class="cm">/* yes */</span> }
    <span class="kw">public void</span> <span class="fn">managePeople</span>() { <span class="cm">/* yes */</span> }
}</code></pre>
`
    },
    {
      title: "D — Dependency Inversion",
      content: `
<h3>Dependency Inversion Principle (DIP)</h3>
<p><strong>Rule:</strong> High-level modules should NOT depend on low-level modules. Both should depend on <em>abstractions</em> (interfaces).</p>

<h4>❌ BAD: Directly depending on concrete class</h4>
<pre><code><span class="kw">class</span> <span class="tp">MySQLDatabase</span> {
    <span class="kw">void</span> <span class="fn">save</span>(String data) { <span class="cm">/* MySQL specific */</span> }
}

<span class="kw">class</span> <span class="tp">UserService</span> {
    <span class="kw">private</span> MySQLDatabase db = <span class="kw">new</span> MySQLDatabase();
    <span class="cm">// PROBLEM: Can't switch to PostgreSQL without changing UserService!</span>

    <span class="kw">void</span> <span class="fn">saveUser</span>(String user) {
        db.<span class="fn">save</span>(user);
    }
}</code></pre>

<h4>✅ GOOD: Depend on abstraction</h4>
<pre><code><span class="cm">// Abstraction (interface)</span>
<span class="kw">interface</span> <span class="tp">Database</span> {
    <span class="kw">void</span> <span class="fn">save</span>(String data);
}

<span class="cm">// Low-level modules implement the interface</span>
<span class="kw">class</span> <span class="tp">MySQLDatabase</span> <span class="kw">implements</span> <span class="tp">Database</span> {
    <span class="kw">public void</span> <span class="fn">save</span>(String data) { <span class="cm">/* MySQL */</span> }
}

<span class="kw">class</span> <span class="tp">PostgresDatabase</span> <span class="kw">implements</span> <span class="tp">Database</span> {
    <span class="kw">public void</span> <span class="fn">save</span>(String data) { <span class="cm">/* Postgres */</span> }
}

<span class="cm">// High-level module depends on INTERFACE, not concrete class</span>
<span class="kw">class</span> <span class="tp">UserService</span> {
    <span class="kw">private</span> Database db;  <span class="cm">// interface type!</span>

    <span class="tp">UserService</span>(Database db) {
        <span class="kw">this</span>.db = db;  <span class="cm">// injected from outside</span>
    }

    <span class="kw">void</span> <span class="fn">saveUser</span>(String user) {
        db.<span class="fn">save</span>(user);  <span class="cm">// works with ANY database!</span>
    }
}

<span class="cm">// Usage — easy to switch!</span>
UserService service1 = <span class="kw">new</span> UserService(<span class="kw">new</span> MySQLDatabase());
UserService service2 = <span class="kw">new</span> UserService(<span class="kw">new</span> PostgresDatabase());</code></pre>

<div class="callout interview"><div class="callout-title">🎯 This is Dependency Injection</div><p>Passing dependencies through the constructor (instead of creating them inside) is called <strong>Dependency Injection</strong>. It's THE most important pattern in professional software and LLD interviews.</p></div>

<div class="section-divider"></div>
<h3>✅ Module 2 Complete!</h3>
<p>You now understand SOLID — the foundation of clean design. Every LLD solution you write should follow these principles. Next: Design Patterns!</p>
`
    },
    {
      title: "Composition vs Inheritance",
      content: `
<h3>The Golden Rule: Favor Composition over Inheritance</h3>
<p><strong>Inheritance</strong> = "IS-A" relationship (Dog IS AN Animal).<br>
<strong>Composition</strong> = "HAS-A" relationship (Car HAS AN Engine).</p>

<h4>❌ Inheritance can become rigid</h4>
<pre><code><span class="kw">class</span> <span class="tp">Robot</span> <span class="kw">extends</span> <span class="tp">Worker</span> {
    <span class="cm">// Inherits eat(), sleep() — robots don't eat or sleep!</span>
}</code></pre>

<h4>✅ Composition is flexible</h4>
<pre><code><span class="kw">interface</span> <span class="tp">Engine</span> {
    <span class="kw">void</span> <span class="fn">start</span>();
}

<span class="kw">class</span> <span class="tp">ElectricEngine</span> <span class="kw">implements</span> <span class="tp">Engine</span> {
    <span class="kw">public void</span> <span class="fn">start</span>() { System.out.println(<span class="st">"Electric hum..."</span>); }
}

<span class="kw">class</span> <span class="tp">PetrolEngine</span> <span class="kw">implements</span> <span class="tp">Engine</span> {
    <span class="kw">public void</span> <span class="fn">start</span>() { System.out.println(<span class="st">"Vroom!"</span>); }
}

<span class="kw">class</span> <span class="tp">Car</span> {
    <span class="kw">private</span> Engine engine;  <span class="cm">// HAS-A engine (composition)</span>

    <span class="tp">Car</span>(Engine engine) {
        <span class="kw">this</span>.engine = engine;
    }

    <span class="kw">void</span> <span class="fn">start</span>() {
        engine.<span class="fn">start</span>();  <span class="cm">// delegates to engine</span>
    }
}

<span class="cm">// Can swap engines easily!</span>
Car tesla = <span class="kw">new</span> Car(<span class="kw">new</span> ElectricEngine());
Car bmw = <span class="kw">new</span> Car(<span class="kw">new</span> PetrolEngine());</code></pre>

<div class="callout interview"><div class="callout-title">🎯 LLD Interview Rule</div><p>In 90% of cases, <strong>composition is better</strong> than inheritance. It's more flexible, testable, and follows SOLID. Use inheritance ONLY for true IS-A relationships.</p></div>
`
    }
  ]
},
];

if (typeof module !== 'undefined') module.exports = COURSE_DATA;
