// Module 3: Design Patterns + Module 4: UML & Interview Framework
const COURSE_DATA_PART2 = [
    // ============================================================
    // MODULE 3: DESIGN PATTERNS
    // ============================================================
    {
        title: "Design Patterns",
        topics: [
            {
                title: "What are Design Patterns?",
                content: `
<h3>Design Patterns — Proven Solutions</h3>
<p>A <strong>design pattern</strong> is a <em>reusable solution to a common problem</em>. Think of them as recipes. You don't invent a new way to bake bread every time — you use a recipe. Same with code.</p>

<div class="callout important"><div class="callout-title">3 Categories</div>
<p><strong>Creational</strong> — How to CREATE objects (Singleton, Factory, Builder)<br>
<strong>Structural</strong> — How to STRUCTURE/organize classes (Adapter, Decorator, Facade)<br>
<strong>Behavioral</strong> — How objects COMMUNICATE (Strategy, Observer, State, Command)</p></div>

<p>You do NOT need to memorize all 23 GoF patterns. For FAANG LLD interviews, you need <strong>~12 patterns</strong>. We'll cover each one with real LLD examples.</p>
`
            },
            {
                title: "Singleton Pattern",
                content: `
<h3>Singleton — Only ONE Instance</h3>
<p><strong>Problem:</strong> Some classes should have exactly ONE object in the entire system. Examples: Database connection, Logger, Configuration manager.</p>

<pre><code><span class="kw">class</span> <span class="tp">ParkingLotManager</span> {
    <span class="cm">// 1. Private static instance</span>
    <span class="kw">private static</span> ParkingLotManager instance;

    <span class="cm">// 2. Private constructor — nobody can do 'new ParkingLotManager()'</span>
    <span class="kw">private</span> <span class="tp">ParkingLotManager</span>() { }

    <span class="cm">// 3. Public static method to get the ONE instance</span>
    <span class="kw">public static</span> ParkingLotManager <span class="fn">getInstance</span>() {
        <span class="kw">if</span> (instance == <span class="kw">null</span>) {
            instance = <span class="kw">new</span> ParkingLotManager();
        }
        <span class="kw">return</span> instance;
    }

    <span class="kw">public void</span> <span class="fn">manage</span>() {
        System.out.println(<span class="st">"Managing the parking lot..."</span>);
    }
}

<span class="cm">// Usage</span>
ParkingLotManager mgr1 = ParkingLotManager.<span class="fn">getInstance</span>();
ParkingLotManager mgr2 = ParkingLotManager.<span class="fn">getInstance</span>();
<span class="cm">// mgr1 == mgr2 → true! Same object</span></code></pre>

<div class="callout tip"><div class="callout-title">Thread-Safe Singleton</div>
<pre><code><span class="kw">class</span> <span class="tp">Singleton</span> {
    <span class="kw">private static volatile</span> Singleton instance;
    <span class="kw">private</span> <span class="tp">Singleton</span>() {}

    <span class="kw">public static</span> Singleton <span class="fn">getInstance</span>() {
        <span class="kw">if</span> (instance == <span class="kw">null</span>) {
            <span class="kw">synchronized</span> (Singleton.<span class="kw">class</span>) {
                <span class="kw">if</span> (instance == <span class="kw">null</span>) {
                    instance = <span class="kw">new</span> Singleton();
                }
            }
        }
        <span class="kw">return</span> instance;
    }
}</code></pre></div>

<div class="callout interview"><div class="callout-title">🎯 When interviewers see Singleton</div><p>Use Singleton for: ParkingLot, ElevatorController, ATMService, VendingMachine. It signals you understand there should be only one controller instance.</p></div>
`
            },
            {
                title: "Factory Pattern",
                content: `
<h3>Factory — Let a Factory Create Objects For You</h3>
<p><strong>Problem:</strong> You need to create different types of objects based on some input, without exposing creation logic.</p>

<pre><code><span class="cm">// Step 1: Common interface</span>
<span class="kw">interface</span> <span class="tp">Notification</span> {
    <span class="kw">void</span> <span class="fn">send</span>(String message);
}

<span class="cm">// Step 2: Concrete implementations</span>
<span class="kw">class</span> <span class="tp">EmailNotification</span> <span class="kw">implements</span> <span class="tp">Notification</span> {
    <span class="kw">public void</span> <span class="fn">send</span>(String msg) { System.out.println(<span class="st">"Email: "</span> + msg); }
}
<span class="kw">class</span> <span class="tp">SMSNotification</span> <span class="kw">implements</span> <span class="tp">Notification</span> {
    <span class="kw">public void</span> <span class="fn">send</span>(String msg) { System.out.println(<span class="st">"SMS: "</span> + msg); }
}
<span class="kw">class</span> <span class="tp">PushNotification</span> <span class="kw">implements</span> <span class="tp">Notification</span> {
    <span class="kw">public void</span> <span class="fn">send</span>(String msg) { System.out.println(<span class="st">"Push: "</span> + msg); }
}

<span class="cm">// Step 3: The Factory</span>
<span class="kw">class</span> <span class="tp">NotificationFactory</span> {
    <span class="kw">public static</span> Notification <span class="fn">create</span>(String type) {
        <span class="kw">switch</span> (type) {
            <span class="kw">case</span> <span class="st">"email"</span>: <span class="kw">return new</span> EmailNotification();
            <span class="kw">case</span> <span class="st">"sms"</span>:   <span class="kw">return new</span> SMSNotification();
            <span class="kw">case</span> <span class="st">"push"</span>:  <span class="kw">return new</span> PushNotification();
            <span class="kw">default</span>:     <span class="kw">throw new</span> IllegalArgumentException(<span class="st">"Unknown type"</span>);
        }
    }
}

<span class="cm">// Usage — client doesn't know about concrete classes</span>
Notification n = NotificationFactory.<span class="fn">create</span>(<span class="st">"email"</span>);
n.<span class="fn">send</span>(<span class="st">"Your order is confirmed!"</span>);</code></pre>

<div class="callout interview"><div class="callout-title">🎯 LLD Usage</div><p>Use Factory for: creating different Vehicle types in Parking Lot, different Piece types in Chess, different Notification channels in any system.</p></div>
`
            },
            {
                title: "Builder Pattern",
                content: `
<h3>Builder — Build Complex Objects Step by Step</h3>
<p><strong>Problem:</strong> Object has many optional fields. Constructor with 10 parameters is unreadable.</p>

<pre><code><span class="cm">// ❌ Telescope constructor anti-pattern</span>
<span class="cm">// new User("Alice", 25, "alice@mail.com", "NYC", "F", true, false, "premium")</span>
<span class="cm">// What does 'true' mean? What does 'false' mean? Unreadable!</span>

<span class="cm">// ✅ Builder pattern</span>
<span class="kw">class</span> <span class="tp">User</span> {
    <span class="kw">private</span> String name;
    <span class="kw">private int</span> age;
    <span class="kw">private</span> String email;
    <span class="kw">private</span> String city;
    <span class="kw">private</span> String membershipType;

    <span class="kw">private</span> <span class="tp">User</span>(Builder builder) {
        <span class="kw">this</span>.name = builder.name;
        <span class="kw">this</span>.age = builder.age;
        <span class="kw">this</span>.email = builder.email;
        <span class="kw">this</span>.city = builder.city;
        <span class="kw">this</span>.membershipType = builder.membershipType;
    }

    <span class="kw">static class</span> <span class="tp">Builder</span> {
        <span class="kw">private</span> String name;   <span class="cm">// required</span>
        <span class="kw">private int</span> age;       <span class="cm">// required</span>
        <span class="kw">private</span> String email;
        <span class="kw">private</span> String city;
        <span class="kw">private</span> String membershipType;

        <span class="tp">Builder</span>(String name, <span class="kw">int</span> age) {
            <span class="kw">this</span>.name = name;
            <span class="kw">this</span>.age = age;
        }

        Builder <span class="fn">email</span>(String e) { <span class="kw">this</span>.email = e; <span class="kw">return this</span>; }
        Builder <span class="fn">city</span>(String c)  { <span class="kw">this</span>.city = c; <span class="kw">return this</span>; }
        Builder <span class="fn">membership</span>(String m) { <span class="kw">this</span>.membershipType = m; <span class="kw">return this</span>; }

        User <span class="fn">build</span>() { <span class="kw">return new</span> User(<span class="kw">this</span>); }
    }
}

<span class="cm">// Crystal clear!</span>
User user = <span class="kw">new</span> User.Builder(<span class="st">"Alice"</span>, <span class="nu">25</span>)
    .<span class="fn">email</span>(<span class="st">"alice@mail.com"</span>)
    .<span class="fn">city</span>(<span class="st">"NYC"</span>)
    .<span class="fn">membership</span>(<span class="st">"premium"</span>)
    .<span class="fn">build</span>();</code></pre>
`
            },
            {
                title: "Strategy Pattern",
                content: `
<h3>Strategy — Swap Algorithms at Runtime</h3>
<p><strong>Problem:</strong> You need different behaviors (algorithms) that can be swapped dynamically. This is THE most important behavioral pattern for LLD.</p>

<pre><code><span class="cm">// Step 1: Strategy interface</span>
<span class="kw">interface</span> <span class="tp">PricingStrategy</span> {
    <span class="kw">double</span> <span class="fn">calculatePrice</span>(<span class="kw">double</span> basePrice);
}

<span class="cm">// Step 2: Concrete strategies</span>
<span class="kw">class</span> <span class="tp">RegularPricing</span> <span class="kw">implements</span> <span class="tp">PricingStrategy</span> {
    <span class="kw">public double</span> <span class="fn">calculatePrice</span>(<span class="kw">double</span> base) { <span class="kw">return</span> base; }
}

<span class="kw">class</span> <span class="tp">HappyHourPricing</span> <span class="kw">implements</span> <span class="tp">PricingStrategy</span> {
    <span class="kw">public double</span> <span class="fn">calculatePrice</span>(<span class="kw">double</span> base) { <span class="kw">return</span> base * <span class="nu">0.5</span>; }
}

<span class="kw">class</span> <span class="tp">WeekendPricing</span> <span class="kw">implements</span> <span class="tp">PricingStrategy</span> {
    <span class="kw">public double</span> <span class="fn">calculatePrice</span>(<span class="kw">double</span> base) { <span class="kw">return</span> base * <span class="nu">1.5</span>; }
}

<span class="cm">// Step 3: Context class uses strategy</span>
<span class="kw">class</span> <span class="tp">ParkingLot</span> {
    <span class="kw">private</span> PricingStrategy strategy;

    <span class="kw">void</span> <span class="fn">setPricingStrategy</span>(PricingStrategy s) { <span class="kw">this</span>.strategy = s; }

    <span class="kw">double</span> <span class="fn">getPrice</span>(<span class="kw">double</span> hours) {
        <span class="kw">return</span> strategy.<span class="fn">calculatePrice</span>(hours * <span class="nu">10</span>);
    }
}

<span class="cm">// Can swap at runtime!</span>
ParkingLot lot = <span class="kw">new</span> ParkingLot();
lot.<span class="fn">setPricingStrategy</span>(<span class="kw">new</span> RegularPricing());    <span class="cm">// normal day</span>
lot.<span class="fn">setPricingStrategy</span>(<span class="kw">new</span> HappyHourPricing());  <span class="cm">// happy hour</span></code></pre>

<div class="callout interview"><div class="callout-title">🎯 Use Strategy For</div><p>Payment methods, pricing algorithms, sorting strategies, validation rules, notification channels. Any time you have multiple interchangeable behaviors → Strategy pattern.</p></div>
`
            },
            {
                title: "Observer Pattern",
                content: `
<h3>Observer — Notify When Something Changes</h3>
<p><strong>Problem:</strong> When one object changes state, other objects need to be notified automatically. Like subscribing to YouTube — you get notified when a new video is uploaded.</p>

<pre><code><span class="kw">interface</span> <span class="tp">Observer</span> {
    <span class="kw">void</span> <span class="fn">update</span>(String message);
}

<span class="kw">interface</span> <span class="tp">Subject</span> {
    <span class="kw">void</span> <span class="fn">subscribe</span>(Observer o);
    <span class="kw">void</span> <span class="fn">unsubscribe</span>(Observer o);
    <span class="kw">void</span> <span class="fn">notifyAll</span>(String message);
}

<span class="kw">class</span> <span class="tp">OrderService</span> <span class="kw">implements</span> <span class="tp">Subject</span> {
    <span class="kw">private</span> List&lt;Observer&gt; observers = <span class="kw">new</span> ArrayList&lt;&gt;();

    <span class="kw">public void</span> <span class="fn">subscribe</span>(Observer o) { observers.add(o); }
    <span class="kw">public void</span> <span class="fn">unsubscribe</span>(Observer o) { observers.remove(o); }
    <span class="kw">public void</span> <span class="fn">notifyAll</span>(String msg) {
        <span class="kw">for</span> (Observer o : observers) o.<span class="fn">update</span>(msg);
    }

    <span class="kw">public void</span> <span class="fn">placeOrder</span>(String order) {
        System.out.println(<span class="st">"Order placed: "</span> + order);
        <span class="fn">notifyAll</span>(<span class="st">"New order: "</span> + order);
    }
}

<span class="kw">class</span> <span class="tp">EmailService</span> <span class="kw">implements</span> <span class="tp">Observer</span> {
    <span class="kw">public void</span> <span class="fn">update</span>(String msg) { System.out.println(<span class="st">"📧 Email: "</span> + msg); }
}

<span class="kw">class</span> <span class="tp">InventoryService</span> <span class="kw">implements</span> <span class="tp">Observer</span> {
    <span class="kw">public void</span> <span class="fn">update</span>(String msg) { System.out.println(<span class="st">"📦 Inventory updated"</span>); }
}

<span class="cm">// Usage</span>
OrderService orders = <span class="kw">new</span> OrderService();
orders.<span class="fn">subscribe</span>(<span class="kw">new</span> EmailService());
orders.<span class="fn">subscribe</span>(<span class="kw">new</span> InventoryService());
orders.<span class="fn">placeOrder</span>(<span class="st">"iPhone 15"</span>);
<span class="cm">// Both get notified automatically!</span></code></pre>
`
            },
            {
                title: "State Pattern",
                content: `
<h3>State — Change Behavior Based on State</h3>
<p><strong>Problem:</strong> An object behaves differently depending on its current state. Instead of messy if-else chains, each state becomes its own class.</p>

<pre><code><span class="cm">// State interface</span>
<span class="kw">interface</span> <span class="tp">VendingMachineState</span> {
    <span class="kw">void</span> <span class="fn">insertCoin</span>(VendingMachine vm);
    <span class="kw">void</span> <span class="fn">selectProduct</span>(VendingMachine vm);
    <span class="kw">void</span> <span class="fn">dispense</span>(VendingMachine vm);
}

<span class="kw">class</span> <span class="tp">IdleState</span> <span class="kw">implements</span> <span class="tp">VendingMachineState</span> {
    <span class="kw">public void</span> <span class="fn">insertCoin</span>(VendingMachine vm) {
        System.out.println(<span class="st">"Coin inserted"</span>);
        vm.<span class="fn">setState</span>(<span class="kw">new</span> HasCoinState());
    }
    <span class="kw">public void</span> <span class="fn">selectProduct</span>(VendingMachine vm) {
        System.out.println(<span class="st">"Insert coin first!"</span>);
    }
    <span class="kw">public void</span> <span class="fn">dispense</span>(VendingMachine vm) {
        System.out.println(<span class="st">"Insert coin first!"</span>);
    }
}

<span class="kw">class</span> <span class="tp">HasCoinState</span> <span class="kw">implements</span> <span class="tp">VendingMachineState</span> {
    <span class="kw">public void</span> <span class="fn">insertCoin</span>(VendingMachine vm) {
        System.out.println(<span class="st">"Coin already inserted"</span>);
    }
    <span class="kw">public void</span> <span class="fn">selectProduct</span>(VendingMachine vm) {
        System.out.println(<span class="st">"Product selected"</span>);
        vm.<span class="fn">setState</span>(<span class="kw">new</span> DispensingState());
    }
    <span class="kw">public void</span> <span class="fn">dispense</span>(VendingMachine vm) {
        System.out.println(<span class="st">"Select product first!"</span>);
    }
}

<span class="kw">class</span> <span class="tp">VendingMachine</span> {
    <span class="kw">private</span> VendingMachineState state;

    <span class="tp">VendingMachine</span>() { <span class="kw">this</span>.state = <span class="kw">new</span> IdleState(); }

    <span class="kw">void</span> <span class="fn">setState</span>(VendingMachineState s) { <span class="kw">this</span>.state = s; }
    <span class="kw">void</span> <span class="fn">insertCoin</span>()     { state.<span class="fn">insertCoin</span>(<span class="kw">this</span>); }
    <span class="kw">void</span> <span class="fn">selectProduct</span>()  { state.<span class="fn">selectProduct</span>(<span class="kw">this</span>); }
    <span class="kw">void</span> <span class="fn">dispense</span>()       { state.<span class="fn">dispense</span>(<span class="kw">this</span>); }
}</code></pre>

<div class="callout interview"><div class="callout-title">🎯 Common LLD Use Cases</div><p><strong>Vending Machine</strong> (Idle→HasCoin→Dispensing), <strong>Elevator</strong> (Idle→Moving→DoorOpen), <strong>Order</strong> (Placed→Confirmed→Shipped→Delivered). State pattern is asked in 5+ LLD problems!</p></div>
`
            },
            {
                title: "Decorator & Adapter",
                content: `
<h3>Decorator — Add Features Dynamically</h3>
<p><strong>Problem:</strong> Add responsibilities to objects without modifying their class. Like adding toppings to a pizza — you wrap the base with extras.</p>

<pre><code><span class="kw">interface</span> <span class="tp">Coffee</span> {
    <span class="kw">double</span> <span class="fn">cost</span>();
    String <span class="fn">description</span>();
}

<span class="kw">class</span> <span class="tp">BasicCoffee</span> <span class="kw">implements</span> <span class="tp">Coffee</span> {
    <span class="kw">public double</span> <span class="fn">cost</span>() { <span class="kw">return</span> <span class="nu">50</span>; }
    <span class="kw">public</span> String <span class="fn">description</span>() { <span class="kw">return</span> <span class="st">"Coffee"</span>; }
}

<span class="cm">// Decorators wrap the original</span>
<span class="kw">class</span> <span class="tp">MilkDecorator</span> <span class="kw">implements</span> <span class="tp">Coffee</span> {
    <span class="kw">private</span> Coffee coffee;
    <span class="tp">MilkDecorator</span>(Coffee c) { <span class="kw">this</span>.coffee = c; }
    <span class="kw">public double</span> <span class="fn">cost</span>() { <span class="kw">return</span> coffee.<span class="fn">cost</span>() + <span class="nu">20</span>; }
    <span class="kw">public</span> String <span class="fn">description</span>() { <span class="kw">return</span> coffee.<span class="fn">description</span>() + <span class="st">" + Milk"</span>; }
}

<span class="kw">class</span> <span class="tp">SugarDecorator</span> <span class="kw">implements</span> <span class="tp">Coffee</span> {
    <span class="kw">private</span> Coffee coffee;
    <span class="tp">SugarDecorator</span>(Coffee c) { <span class="kw">this</span>.coffee = c; }
    <span class="kw">public double</span> <span class="fn">cost</span>() { <span class="kw">return</span> coffee.<span class="fn">cost</span>() + <span class="nu">10</span>; }
    <span class="kw">public</span> String <span class="fn">description</span>() { <span class="kw">return</span> coffee.<span class="fn">description</span>() + <span class="st">" + Sugar"</span>; }
}

<span class="cm">// Stack decorators!</span>
Coffee order = <span class="kw">new</span> SugarDecorator(<span class="kw">new</span> MilkDecorator(<span class="kw">new</span> BasicCoffee()));
<span class="cm">// cost() → 80, description() → "Coffee + Milk + Sugar"</span></code></pre>

<div class="section-divider"></div>

<h3>Adapter — Make Incompatible Things Work Together</h3>
<pre><code><span class="cm">// Old payment system</span>
<span class="kw">class</span> <span class="tp">OldPaymentGateway</span> {
    <span class="kw">void</span> <span class="fn">makePayment</span>(<span class="kw">double</span> amount) { <span class="cm">/* old API */</span> }
}

<span class="cm">// New interface your system expects</span>
<span class="kw">interface</span> <span class="tp">PaymentProcessor</span> {
    <span class="kw">void</span> <span class="fn">pay</span>(<span class="kw">double</span> amount, String currency);
}

<span class="cm">// Adapter bridges old and new</span>
<span class="kw">class</span> <span class="tp">PaymentAdapter</span> <span class="kw">implements</span> <span class="tp">PaymentProcessor</span> {
    <span class="kw">private</span> OldPaymentGateway gateway;

    <span class="tp">PaymentAdapter</span>(OldPaymentGateway gw) { <span class="kw">this</span>.gateway = gw; }

    <span class="kw">public void</span> <span class="fn">pay</span>(<span class="kw">double</span> amount, String currency) {
        <span class="cm">// adapt the interface</span>
        gateway.<span class="fn">makePayment</span>(amount);
    }
}</code></pre>
`
            },
            {
                title: "Command & Template Method",
                content: `
<h3>Command — Encapsulate Requests as Objects</h3>
<p><strong>Problem:</strong> You want to queue, log, or undo operations. Each operation becomes an object.</p>

<pre><code><span class="kw">interface</span> <span class="tp">Command</span> {
    <span class="kw">void</span> <span class="fn">execute</span>();
    <span class="kw">void</span> <span class="fn">undo</span>();
}

<span class="kw">class</span> <span class="tp">LightOnCommand</span> <span class="kw">implements</span> <span class="tp">Command</span> {
    <span class="kw">private</span> Light light;
    <span class="tp">LightOnCommand</span>(Light l) { <span class="kw">this</span>.light = l; }
    <span class="kw">public void</span> <span class="fn">execute</span>() { light.turnOn(); }
    <span class="kw">public void</span> <span class="fn">undo</span>()    { light.turnOff(); }
}

<span class="kw">class</span> <span class="tp">RemoteControl</span> {
    <span class="kw">private</span> List&lt;Command&gt; history = <span class="kw">new</span> ArrayList&lt;&gt;();

    <span class="kw">void</span> <span class="fn">pressButton</span>(Command cmd) {
        cmd.<span class="fn">execute</span>();
        history.add(cmd);
    }

    <span class="kw">void</span> <span class="fn">undoLast</span>() {
        <span class="kw">if</span> (!history.isEmpty()) {
            history.remove(history.size()-<span class="nu">1</span>).<span class="fn">undo</span>();
        }
    }
}</code></pre>

<div class="section-divider"></div>

<h3>Template Method — Define Algorithm Skeleton</h3>
<pre><code><span class="kw">abstract class</span> <span class="tp">OrderProcessor</span> {
    <span class="cm">// Template method — defines the steps</span>
    <span class="kw">public final void</span> <span class="fn">processOrder</span>() {
        <span class="fn">validateOrder</span>();
        <span class="fn">calculateTotal</span>();
        <span class="fn">processPayment</span>();   <span class="cm">// subclass implements this</span>
        <span class="fn">sendConfirmation</span>();
    }

    <span class="kw">void</span> <span class="fn">validateOrder</span>() { System.out.println(<span class="st">"Validating..."</span>); }
    <span class="kw">void</span> <span class="fn">calculateTotal</span>() { System.out.println(<span class="st">"Calculating..."</span>); }
    <span class="kw">void</span> <span class="fn">sendConfirmation</span>() { System.out.println(<span class="st">"Confirmed!"</span>); }

    <span class="cm">// Each subclass provides its own implementation</span>
    <span class="kw">abstract void</span> <span class="fn">processPayment</span>();
}

<span class="kw">class</span> <span class="tp">CreditCardOrder</span> <span class="kw">extends</span> <span class="tp">OrderProcessor</span> {
    <span class="kw">void</span> <span class="fn">processPayment</span>() { System.out.println(<span class="st">"Credit card charged"</span>); }
}
<span class="kw">class</span> <span class="tp">CODOrder</span> <span class="kw">extends</span> <span class="tp">OrderProcessor</span> {
    <span class="kw">void</span> <span class="fn">processPayment</span>() { System.out.println(<span class="st">"Cash on delivery"</span>); }
}</code></pre>
`
            }
        ]
    },
    // ============================================================
    // MODULE 4: UML DIAGRAMS & LLD INTERVIEW FRAMEWORK
    // ============================================================
    {
        title: "UML & Interview Framework",
        topics: [
            {
                title: "Class Diagrams — The Visual Language",
                content: `
<h3>What is a Class Diagram?</h3>
<p>A <strong>class diagram</strong> is a visual drawing that shows: what classes exist, what they contain, and how they relate. It's the <em>blueprint</em> interviewers expect you to draw on the whiteboard.</p>

<h4>How to Draw a Class</h4>
<div class="uml-box">
  <div class="uml-title">Car</div>
  <div class="uml-section">
    - brand: String<br>
    - speed: int<br>
    - color: String
  </div>
  <div class="uml-section">
    + accelerate(): void<br>
    + brake(): void<br>
    + getSpeed(): int
  </div>
</div>

<p>Each class box has <strong>3 sections</strong>:</p>
<table>
<tr><th>Section</th><th>Contains</th><th>Example</th></tr>
<tr><td>Top</td><td>Class name</td><td>Car</td></tr>
<tr><td>Middle</td><td>Attributes (fields)</td><td>- brand: String</td></tr>
<tr><td>Bottom</td><td>Methods</td><td>+ accelerate(): void</td></tr>
</table>

<h4>Access Modifier Symbols</h4>
<table>
<tr><th>Symbol</th><th>Modifier</th><th>Meaning</th></tr>
<tr><td><code>+</code></td><td>public</td><td>Anyone can access</td></tr>
<tr><td><code>-</code></td><td>private</td><td>Only this class</td></tr>
<tr><td><code>#</code></td><td>protected</td><td>This class + children</td></tr>
</table>

<h3>Relationships Between Classes</h3>

<h4>1. Association (uses / knows about)</h4>
<p>One class uses another. Drawn as a simple line.</p>
<pre><code><span class="cm">// Driver USES a Car (association)</span>
<span class="kw">class</span> <span class="tp">Driver</span> {
    <span class="kw">private</span> Car car;  <span class="cm">// Driver knows about Car</span>
}
<span class="cm">// UML: Driver ———— Car</span></code></pre>

<h4>2. Inheritance / Generalization (IS-A)</h4>
<p>Child class extends parent. Drawn as line with hollow triangle arrow.</p>
<pre><code><span class="cm">// SportsCar IS-A Car</span>
<span class="kw">class</span> <span class="tp">SportsCar</span> <span class="kw">extends</span> <span class="tp">Car</span> { }
<span class="cm">// UML: SportsCar ——▷ Car</span></code></pre>

<h4>3. Implementation (implements interface)</h4>
<p>Class implements interface. Drawn as dashed line with hollow triangle.</p>
<pre><code><span class="cm">// Dog implements Walkable</span>
<span class="kw">class</span> <span class="tp">Dog</span> <span class="kw">implements</span> <span class="tp">Walkable</span> { }
<span class="cm">// UML: Dog ----▷ Walkable</span></code></pre>

<h4>4. Composition (HAS-A, strong — part dies with whole)</h4>
<p>Drawn as line with filled diamond. If the Car is destroyed, its Engine is too.</p>
<pre><code><span class="cm">// Car HAS-A Engine (composition — engine dies with car)</span>
<span class="kw">class</span> <span class="tp">Car</span> {
    <span class="kw">private</span> Engine engine = <span class="kw">new</span> Engine();
}
<span class="cm">// UML: Car ◆———— Engine</span></code></pre>

<h4>5. Aggregation (HAS-A, weak — part can live independently)</h4>
<p>Drawn as line with hollow diamond. A Team has Players, but players exist without the team.</p>
<pre><code><span class="cm">// Team HAS Players (aggregation — players exist independently)</span>
<span class="kw">class</span> <span class="tp">Team</span> {
    <span class="kw">private</span> List&lt;Player&gt; players;
}
<span class="cm">// UML: Team ◇———— Player</span></code></pre>

<h4>Quick Reference Cheat Sheet</h4>
<table>
<tr><th>Relationship</th><th>Symbol</th><th>Java Keyword</th><th>Example</th></tr>
<tr><td>Inheritance</td><td>——▷</td><td><code>extends</code></td><td>Dog extends Animal</td></tr>
<tr><td>Interface</td><td>----▷</td><td><code>implements</code></td><td>Dog implements Walkable</td></tr>
<tr><td>Composition</td><td>◆————</td><td>field created internally</td><td>Car has Engine</td></tr>
<tr><td>Aggregation</td><td>◇————</td><td>field passed in</td><td>Team has Players</td></tr>
<tr><td>Association</td><td>————</td><td>field reference</td><td>Driver uses Car</td></tr>
</table>

<div class="callout interview"><div class="callout-title">🎯 Interview Tip</div><p>In the interview, spend 5-7 minutes drawing the class diagram on the whiteboard BEFORE writing code. It shows you think before you code — interviewers LOVE this.</p></div>
`
            },
            {
                title: "The 45-Minute LLD Interview Framework",
                content: `
<h3>The 5-Step Framework</h3>
<p>Every FAANG LLD interview is ~45 minutes. Here's exactly how to spend your time:</p>

<table>
<tr><th>Step</th><th>Time</th><th>What to Do</th></tr>
<tr><td><strong>1. Clarify Requirements</strong></td><td>5 min</td><td>Ask questions, list features, define scope</td></tr>
<tr><td><strong>2. Identify Classes</strong></td><td>5 min</td><td>List all entities (nouns = classes)</td></tr>
<tr><td><strong>3. Draw Class Diagram</strong></td><td>7 min</td><td>Show relationships, key attributes, methods</td></tr>
<tr><td><strong>4. Write Core Code</strong></td><td>20 min</td><td>Implement the main classes and logic</td></tr>
<tr><td><strong>5. Discuss & Extend</strong></td><td>8 min</td><td>Talk about edge cases, scalability, patterns used</td></tr>
</table>

<h3>Step 1: Clarify Requirements</h3>
<p>ALWAYS ask questions before coding. This shows maturity.</p>
<pre><code><span class="cm">Example: "Design a Parking Lot"</span>

<span class="cm">Questions to ask:</span>
<span class="st">• How many floors/levels?</span>
<span class="st">• What types of vehicles? (car, bike, truck)</span>
<span class="st">• Is it paid parking? How is pricing done?</span>
<span class="st">• Do we need entry/exit gates?</span>
<span class="st">• Do we need a ticket system?</span>
<span class="st">• What about handicapped spots?</span>
<span class="st">• Is there a display board showing available spots?</span></code></pre>

<h3>Step 2: Identify Classes (Noun Extraction)</h3>
<p>Read the requirements and <strong>circle all nouns</strong> — they become your classes!</p>
<pre><code><span class="cm">"A PARKING LOT has multiple FLOORS. Each FLOOR has</span>
<span class="cm"> PARKING SPOTS of different sizes. A VEHICLE enters</span>
<span class="cm"> through a GATE and gets a TICKET. The TICKET is used</span>
<span class="cm"> for PAYMENT when the vehicle exits."</span>

<span class="cm">Classes identified:</span>
<span class="st">ParkingLot, Floor, ParkingSpot, Vehicle, Gate, Ticket, Payment</span></code></pre>

<h3>Step 3: Define Relationships</h3>
<pre><code><span class="cm">ParkingLot HAS-A List&lt;Floor&gt;           (composition)</span>
<span class="cm">Floor HAS-A List&lt;ParkingSpot&gt;          (composition)</span>
<span class="cm">ParkingSpot HAS-A Vehicle              (association)</span>
<span class="cm">Ticket HAS-A Vehicle, ParkingSpot      (association)</span>
<span class="cm">Vehicle IS-A: Car, Bike, Truck         (inheritance)</span>
<span class="cm">ParkingSpot IS-A: Small, Medium, Large (inheritance/enum)</span></code></pre>

<h3>Step 4: Code Core Classes</h3>
<p>Start with enums → models → services. Always write clean, SOLID code.</p>

<h3>Step 5: Discuss Extensions</h3>
<div class="callout tip"><div class="callout-title">Things interviewers love to hear</div>
<p>• "I used Strategy pattern for pricing so new pricing rules can be added without changing core code"<br>
• "I used Observer pattern to notify the display board when spots change"<br>
• "I kept Vehicle abstract so new vehicle types can be added (Open/Closed)"<br>
• "ParkingSpot assignment is a separate class for Single Responsibility"</p></div>
`
            },
            {
                title: "What Interviewers Actually Look For",
                content: `
<h3>The LLD Evaluation Rubric</h3>
<p>Having interviewed 100+ candidates, here's what gets a <strong>Strong Hire</strong> vs <strong>Reject</strong>:</p>

<table>
<tr><th>Criteria</th><th>❌ Reject</th><th>✅ Strong Hire</th></tr>
<tr><td><strong>Requirements</strong></td><td>Jumps to code immediately</td><td>Asks 5+ clarifying questions first</td></tr>
<tr><td><strong>Classes</strong></td><td>God class with everything</td><td>Small, focused classes (SRP)</td></tr>
<tr><td><strong>Relationships</strong></td><td>No class diagram</td><td>Clear diagram before coding</td></tr>
<tr><td><strong>Extensibility</strong></td><td>Hardcoded types, if-else chains</td><td>Interfaces + Strategy pattern</td></tr>
<tr><td><strong>Enums</strong></td><td>Uses strings for types/status</td><td>Proper enums everywhere</td></tr>
<tr><td><strong>Encapsulation</strong></td><td>All public fields</td><td>Private fields + getters/setters</td></tr>
<tr><td><strong>Naming</strong></td><td>a, b, x</td><td>Descriptive names: parkVehicle(), calculateFee()</td></tr>
<tr><td><strong>Patterns</strong></td><td>No patterns mentioned</td><td>Names and justifies 2-3 patterns</td></tr>
</table>

<div class="callout interview"><div class="callout-title">🎯 Golden Rules</div>
<p>1. <strong>Ask questions first</strong> — show you think before coding<br>
2. <strong>Draw before you code</strong> — class diagram = thinking tool<br>
3. <strong>Use enums, not strings</strong> — for types, status, roles<br>
4. <strong>Make fields private</strong> — always encapsulate<br>
5. <strong>Use interfaces</strong> — for behaviors that can vary<br>
6. <strong>Name patterns</strong> — "I'm using Strategy here because..."<br>
7. <strong>Think about extensibility</strong> — "If we want to add X later, we just..."</p></div>
`
            }
        ]
    },
];

if (typeof module !== 'undefined') module.exports = COURSE_DATA_PART2;
