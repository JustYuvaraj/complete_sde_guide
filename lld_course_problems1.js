// Module 5: Part 1 — LLD Practice Problems 1-5
const PROBLEMS_PART1 = [
    {
        title: "LLD Practice Problems",
        topics: [
            {
                title: "1. Parking Lot System ★★★★★",
                content: `
<h3>🅿️ Design a Parking Lot System</h3>
<div class="callout important"><div class="callout-title">Most Asked LLD Problem — Asked at Google, Amazon, Microsoft, Uber</div><p>If you solve only ONE problem, solve this. It covers 80% of LLD concepts.</p></div>

<h4>Requirements</h4>
<ul>
<li>Multi-floor parking lot with different spot sizes (Small, Medium, Large)</li>
<li>Vehicles: Car, Bike, Truck — each needs appropriate spot size</li>
<li>Entry/Exit gates with ticket system</li>
<li>Pricing: hourly rates based on vehicle type</li>
<li>Display board showing available spots per floor</li>
</ul>

<h4>Class Diagram</h4>
<div class="uml-box"><div class="uml-title">ParkingLot (Singleton)</div>
<div class="uml-section">- floors: List&lt;Floor&gt;<br>- gates: List&lt;Gate&gt;</div>
<div class="uml-section">+ parkVehicle(Vehicle): Ticket<br>+ unparkVehicle(Ticket): Payment</div></div>

<div class="uml-box"><div class="uml-title">Floor</div>
<div class="uml-section">- floorNumber: int<br>- spots: List&lt;ParkingSpot&gt;</div>
<div class="uml-section">+ getAvailableSpot(VehicleType): ParkingSpot</div></div>

<div class="uml-box"><div class="uml-title">ParkingSpot</div>
<div class="uml-section">- spotId: String<br>- size: SpotSize<br>- vehicle: Vehicle<br>- isAvailable: boolean</div>
<div class="uml-section">+ park(Vehicle): void<br>+ removeVehicle(): Vehicle</div></div>

<h4>Complete Code</h4>
<pre><code><span class="cm">// ===== ENUMS =====</span>
<span class="kw">enum</span> <span class="tp">VehicleType</span>  { BIKE, CAR, TRUCK }
<span class="kw">enum</span> <span class="tp">SpotSize</span>     { SMALL, MEDIUM, LARGE }
<span class="kw">enum</span> <span class="tp">TicketStatus</span> { ACTIVE, PAID }

<span class="cm">// ===== VEHICLE (Abstract) =====</span>
<span class="kw">abstract class</span> <span class="tp">Vehicle</span> {
    <span class="kw">private</span> String licensePlate;
    <span class="kw">private</span> VehicleType type;

    <span class="tp">Vehicle</span>(String plate, VehicleType type) {
        <span class="kw">this</span>.licensePlate = plate;
        <span class="kw">this</span>.type = type;
    }
    <span class="kw">public</span> VehicleType <span class="fn">getType</span>() { <span class="kw">return</span> type; }
    <span class="kw">public</span> String <span class="fn">getPlate</span>() { <span class="kw">return</span> licensePlate; }
}

<span class="kw">class</span> <span class="tp">Car</span> <span class="kw">extends</span> <span class="tp">Vehicle</span>   { <span class="tp">Car</span>(String p)   { <span class="kw">super</span>(p, VehicleType.CAR); } }
<span class="kw">class</span> <span class="tp">Bike</span> <span class="kw">extends</span> <span class="tp">Vehicle</span>  { <span class="tp">Bike</span>(String p)  { <span class="kw">super</span>(p, VehicleType.BIKE); } }
<span class="kw">class</span> <span class="tp">Truck</span> <span class="kw">extends</span> <span class="tp">Vehicle</span> { <span class="tp">Truck</span>(String p) { <span class="kw">super</span>(p, VehicleType.TRUCK); } }

<span class="cm">// ===== PARKING SPOT =====</span>
<span class="kw">class</span> <span class="tp">ParkingSpot</span> {
    <span class="kw">private</span> String spotId;
    <span class="kw">private</span> SpotSize size;
    <span class="kw">private</span> Vehicle vehicle;

    <span class="tp">ParkingSpot</span>(String id, SpotSize size) {
        <span class="kw">this</span>.spotId = id;
        <span class="kw">this</span>.size = size;
    }

    <span class="kw">public boolean</span> <span class="fn">isAvailable</span>() { <span class="kw">return</span> vehicle == <span class="kw">null</span>; }

    <span class="kw">public boolean</span> <span class="fn">canFit</span>(VehicleType vType) {
        <span class="kw">if</span> (vType == VehicleType.BIKE)  <span class="kw">return</span> size == SpotSize.SMALL;
        <span class="kw">if</span> (vType == VehicleType.CAR)   <span class="kw">return</span> size == SpotSize.MEDIUM;
        <span class="kw">if</span> (vType == VehicleType.TRUCK) <span class="kw">return</span> size == SpotSize.LARGE;
        <span class="kw">return false</span>;
    }

    <span class="kw">public void</span> <span class="fn">park</span>(Vehicle v) { <span class="kw">this</span>.vehicle = v; }
    <span class="kw">public</span> Vehicle <span class="fn">removeVehicle</span>() {
        Vehicle v = <span class="kw">this</span>.vehicle;
        <span class="kw">this</span>.vehicle = <span class="kw">null</span>;
        <span class="kw">return</span> v;
    }

    <span class="kw">public</span> String <span class="fn">getSpotId</span>() { <span class="kw">return</span> spotId; }
    <span class="kw">public</span> SpotSize <span class="fn">getSize</span>() { <span class="kw">return</span> size; }
}

<span class="cm">// ===== TICKET =====</span>
<span class="kw">class</span> <span class="tp">Ticket</span> {
    <span class="kw">private</span> String ticketId;
    <span class="kw">private</span> Vehicle vehicle;
    <span class="kw">private</span> ParkingSpot spot;
    <span class="kw">private long</span> entryTime;
    <span class="kw">private</span> TicketStatus status;

    <span class="tp">Ticket</span>(Vehicle v, ParkingSpot spot) {
        <span class="kw">this</span>.ticketId = UUID.randomUUID().toString();
        <span class="kw">this</span>.vehicle = v;
        <span class="kw">this</span>.spot = spot;
        <span class="kw">this</span>.entryTime = System.currentTimeMillis();
        <span class="kw">this</span>.status = TicketStatus.ACTIVE;
    }

    <span class="kw">public long</span> <span class="fn">getParkedHours</span>() {
        <span class="kw">return</span> (System.currentTimeMillis() - entryTime) / <span class="nu">3600000</span> + <span class="nu">1</span>;
    }
    <span class="kw">public void</span> <span class="fn">markPaid</span>() { status = TicketStatus.PAID; }
    <span class="cm">// getters...</span>
}

<span class="cm">// ===== PRICING STRATEGY (Strategy Pattern) =====</span>
<span class="kw">interface</span> <span class="tp">PricingStrategy</span> {
    <span class="kw">double</span> <span class="fn">calculate</span>(Ticket ticket);
}

<span class="kw">class</span> <span class="tp">HourlyPricing</span> <span class="kw">implements</span> <span class="tp">PricingStrategy</span> {
    <span class="kw">private</span> Map&lt;VehicleType, Double&gt; rates = <span class="kw">new</span> HashMap&lt;&gt;();

    <span class="tp">HourlyPricing</span>() {
        rates.put(VehicleType.BIKE,  <span class="nu">10.0</span>);
        rates.put(VehicleType.CAR,   <span class="nu">20.0</span>);
        rates.put(VehicleType.TRUCK, <span class="nu">30.0</span>);
    }

    <span class="kw">public double</span> <span class="fn">calculate</span>(Ticket t) {
        <span class="kw">return</span> t.<span class="fn">getParkedHours</span>() * rates.get(t.getVehicle().getType());
    }
}

<span class="cm">// ===== FLOOR =====</span>
<span class="kw">class</span> <span class="tp">Floor</span> {
    <span class="kw">private int</span> floorNumber;
    <span class="kw">private</span> List&lt;ParkingSpot&gt; spots;

    <span class="tp">Floor</span>(<span class="kw">int</span> num, List&lt;ParkingSpot&gt; spots) {
        <span class="kw">this</span>.floorNumber = num;
        <span class="kw">this</span>.spots = spots;
    }

    <span class="kw">public</span> ParkingSpot <span class="fn">findAvailableSpot</span>(VehicleType type) {
        <span class="kw">for</span> (ParkingSpot spot : spots) {
            <span class="kw">if</span> (spot.<span class="fn">isAvailable</span>() && spot.<span class="fn">canFit</span>(type)) {
                <span class="kw">return</span> spot;
            }
        }
        <span class="kw">return null</span>;
    }
}

<span class="cm">// ===== PARKING LOT (Singleton) =====</span>
<span class="kw">class</span> <span class="tp">ParkingLot</span> {
    <span class="kw">private static</span> ParkingLot instance;
    <span class="kw">private</span> List&lt;Floor&gt; floors;
    <span class="kw">private</span> PricingStrategy pricing;

    <span class="kw">private</span> <span class="tp">ParkingLot</span>(List&lt;Floor&gt; floors) {
        <span class="kw">this</span>.floors = floors;
        <span class="kw">this</span>.pricing = <span class="kw">new</span> HourlyPricing();
    }

    <span class="kw">public</span> Ticket <span class="fn">parkVehicle</span>(Vehicle vehicle) {
        <span class="kw">for</span> (Floor floor : floors) {
            ParkingSpot spot = floor.<span class="fn">findAvailableSpot</span>(vehicle.<span class="fn">getType</span>());
            <span class="kw">if</span> (spot != <span class="kw">null</span>) {
                spot.<span class="fn">park</span>(vehicle);
                <span class="kw">return new</span> Ticket(vehicle, spot);
            }
        }
        <span class="kw">throw new</span> RuntimeException(<span class="st">"No spot available!"</span>);
    }

    <span class="kw">public double</span> <span class="fn">unparkVehicle</span>(Ticket ticket) {
        ticket.getSpot().<span class="fn">removeVehicle</span>();
        <span class="kw">double</span> fee = pricing.<span class="fn">calculate</span>(ticket);
        ticket.<span class="fn">markPaid</span>();
        <span class="kw">return</span> fee;
    }
}</code></pre>

<div class="callout interview"><div class="callout-title">🎯 Patterns Used</div>
<p>✅ <strong>Singleton</strong> — ParkingLot (only one instance)<br>
✅ <strong>Strategy</strong> — PricingStrategy (swappable pricing logic)<br>
✅ <strong>Factory</strong> — Can add VehicleFactory for creating vehicles<br>
✅ <strong>SOLID</strong> — Each class has single responsibility</p></div>
`
            },
            {
                title: "2. Elevator System ★★★★★",
                content: `
<h3>🛗 Design an Elevator System</h3>
<div class="callout important"><div class="callout-title">Top 3 Most Asked — Amazon, Google, Flipkart</div><p>Tests State pattern, multi-threading concepts, and scheduling algorithms.</p></div>

<h4>Requirements</h4>
<ul>
<li>Building with N floors and M elevators</li>
<li>Users can request elevator from any floor (up/down buttons)</li>
<li>Users inside elevator select destination floor</li>
<li>Elevator moves efficiently (doesn't skip floors with requests)</li>
<li>Door open/close mechanism</li>
</ul>

<pre><code><span class="cm">// ===== ENUMS =====</span>
<span class="kw">enum</span> <span class="tp">Direction</span>     { UP, DOWN, IDLE }
<span class="kw">enum</span> <span class="tp">DoorState</span>     { OPEN, CLOSED }
<span class="kw">enum</span> <span class="tp">ElevatorState</span> { MOVING, STOPPED, IDLE }

<span class="cm">// ===== REQUEST =====</span>
<span class="kw">class</span> <span class="tp">Request</span> {
    <span class="kw">private int</span> floor;
    <span class="kw">private</span> Direction direction;

    <span class="tp">Request</span>(<span class="kw">int</span> floor, Direction dir) {
        <span class="kw">this</span>.floor = floor;
        <span class="kw">this</span>.direction = dir;
    }
    <span class="kw">public int</span> <span class="fn">getFloor</span>() { <span class="kw">return</span> floor; }
}

<span class="cm">// ===== ELEVATOR =====</span>
<span class="kw">class</span> <span class="tp">Elevator</span> {
    <span class="kw">private int</span> id;
    <span class="kw">private int</span> currentFloor;
    <span class="kw">private</span> Direction direction;
    <span class="kw">private</span> ElevatorState state;
    <span class="kw">private</span> DoorState door;
    <span class="kw">private</span> Set&lt;Integer&gt; destinationFloors;

    <span class="tp">Elevator</span>(<span class="kw">int</span> id) {
        <span class="kw">this</span>.id = id;
        <span class="kw">this</span>.currentFloor = <span class="nu">0</span>;
        <span class="kw">this</span>.direction = Direction.IDLE;
        <span class="kw">this</span>.state = ElevatorState.IDLE;
        <span class="kw">this</span>.door = DoorState.CLOSED;
        <span class="kw">this</span>.destinationFloors = <span class="kw">new</span> TreeSet&lt;&gt;();
    }

    <span class="kw">public void</span> <span class="fn">addDestination</span>(<span class="kw">int</span> floor) {
        destinationFloors.add(floor);
        <span class="kw">if</span> (state == ElevatorState.IDLE) {
            direction = floor > currentFloor ? Direction.UP : Direction.DOWN;
            state = ElevatorState.MOVING;
        }
    }

    <span class="kw">public void</span> <span class="fn">move</span>() {
        <span class="kw">if</span> (destinationFloors.isEmpty()) {
            state = ElevatorState.IDLE;
            direction = Direction.IDLE;
            <span class="kw">return</span>;
        }

        <span class="kw">if</span> (direction == Direction.UP) currentFloor++;
        <span class="kw">else if</span> (direction == Direction.DOWN) currentFloor--;

        <span class="kw">if</span> (destinationFloors.contains(currentFloor)) {
            <span class="fn">stop</span>();
            destinationFloors.remove(currentFloor);
        }
    }

    <span class="kw">private void</span> <span class="fn">stop</span>() {
        state = ElevatorState.STOPPED;
        door = DoorState.OPEN;
        System.out.println(<span class="st">"Elevator "</span> + id + <span class="st">" stopped at floor "</span> + currentFloor);
        <span class="cm">// simulate door timer</span>
        door = DoorState.CLOSED;
        state = ElevatorState.MOVING;
    }

    <span class="kw">public int</span> <span class="fn">getCurrentFloor</span>() { <span class="kw">return</span> currentFloor; }
    <span class="kw">public</span> Direction <span class="fn">getDirection</span>() { <span class="kw">return</span> direction; }
    <span class="kw">public boolean</span> <span class="fn">isIdle</span>() { <span class="kw">return</span> state == ElevatorState.IDLE; }
}

<span class="cm">// ===== ELEVATOR CONTROLLER (Singleton) =====</span>
<span class="kw">class</span> <span class="tp">ElevatorController</span> {
    <span class="kw">private</span> List&lt;Elevator&gt; elevators;

    <span class="tp">ElevatorController</span>(<span class="kw">int</span> numElevators) {
        elevators = <span class="kw">new</span> ArrayList&lt;&gt;();
        <span class="kw">for</span> (<span class="kw">int</span> i = <span class="nu">0</span>; i < numElevators; i++) {
            elevators.add(<span class="kw">new</span> Elevator(i));
        }
    }

    <span class="kw">public</span> Elevator <span class="fn">requestElevator</span>(<span class="kw">int</span> floor, Direction dir) {
        Elevator best = <span class="kw">null</span>;
        <span class="kw">int</span> minDist = Integer.MAX_VALUE;

        <span class="kw">for</span> (Elevator e : elevators) {
            <span class="kw">int</span> dist = Math.abs(e.<span class="fn">getCurrentFloor</span>() - floor);
            <span class="kw">if</span> (e.<span class="fn">isIdle</span>() && dist < minDist) {
                best = e;
                minDist = dist;
            }
        }
        <span class="kw">if</span> (best != <span class="kw">null</span>) {
            best.<span class="fn">addDestination</span>(floor);
        }
        <span class="kw">return</span> best;
    }
}</code></pre>

<div class="callout tip"><div class="callout-title">Key Design Decisions</div>
<p>• <strong>State pattern</strong> for elevator states (IDLE, MOVING, STOPPED)<br>
• <strong>Strategy pattern</strong> for elevator scheduling algorithm<br>
• <strong>TreeSet</strong> for ordered destination floors<br>
• <strong>Singleton</strong> for ElevatorController</p></div>
`
            },
            {
                title: "3. Tic Tac Toe ★★★★",
                content: `
<h3>❌⭕ Design Tic Tac Toe</h3>
<div class="callout important"><div class="callout-title">Great Starter Problem — Amazon, Microsoft, Meta</div><p>Simple enough to code in 30 min. Tests OOP modeling and game logic separation.</p></div>

<pre><code><span class="cm">// ===== ENUMS =====</span>
<span class="kw">enum</span> <span class="tp">PieceType</span>   { X, O }
<span class="kw">enum</span> <span class="tp">GameStatus</span>  { IN_PROGRESS, X_WINS, O_WINS, DRAW }

<span class="cm">// ===== PLAYER =====</span>
<span class="kw">class</span> <span class="tp">Player</span> {
    <span class="kw">private</span> String name;
    <span class="kw">private</span> PieceType piece;

    <span class="tp">Player</span>(String name, PieceType piece) {
        <span class="kw">this</span>.name = name;
        <span class="kw">this</span>.piece = piece;
    }
    <span class="kw">public</span> PieceType <span class="fn">getPiece</span>() { <span class="kw">return</span> piece; }
    <span class="kw">public</span> String <span class="fn">getName</span>() { <span class="kw">return</span> name; }
}

<span class="cm">// ===== BOARD =====</span>
<span class="kw">class</span> <span class="tp">Board</span> {
    <span class="kw">private</span> PieceType[][] grid;
    <span class="kw">private int</span> size;
    <span class="kw">private int</span> movesCount;

    <span class="tp">Board</span>(<span class="kw">int</span> size) {
        <span class="kw">this</span>.size = size;
        <span class="kw">this</span>.grid = <span class="kw">new</span> PieceType[size][size];
        <span class="kw">this</span>.movesCount = <span class="nu">0</span>;
    }

    <span class="kw">public boolean</span> <span class="fn">placePiece</span>(<span class="kw">int</span> row, <span class="kw">int</span> col, PieceType piece) {
        <span class="kw">if</span> (row < <span class="nu">0</span> || row >= size || col < <span class="nu">0</span> || col >= size || grid[row][col] != <span class="kw">null</span>) {
            <span class="kw">return false</span>;
        }
        grid[row][col] = piece;
        movesCount++;
        <span class="kw">return true</span>;
    }

    <span class="kw">public boolean</span> <span class="fn">checkWin</span>(PieceType piece) {
        <span class="cm">// Check rows, columns, diagonals</span>
        <span class="kw">for</span> (<span class="kw">int</span> i = <span class="nu">0</span>; i < size; i++) {
            <span class="kw">if</span> (<span class="fn">checkLine</span>(piece, i, <span class="nu">0</span>, <span class="nu">0</span>, <span class="nu">1</span>)) <span class="kw">return true</span>; <span class="cm">// row</span>
            <span class="kw">if</span> (<span class="fn">checkLine</span>(piece, <span class="nu">0</span>, i, <span class="nu">1</span>, <span class="nu">0</span>)) <span class="kw">return true</span>; <span class="cm">// col</span>
        }
        <span class="kw">if</span> (<span class="fn">checkLine</span>(piece, <span class="nu">0</span>, <span class="nu">0</span>, <span class="nu">1</span>, <span class="nu">1</span>)) <span class="kw">return true</span>; <span class="cm">// diagonal</span>
        <span class="kw">if</span> (<span class="fn">checkLine</span>(piece, <span class="nu">0</span>, size-<span class="nu">1</span>, <span class="nu">1</span>, -<span class="nu">1</span>)) <span class="kw">return true</span>; <span class="cm">// anti-diag</span>
        <span class="kw">return false</span>;
    }

    <span class="kw">private boolean</span> <span class="fn">checkLine</span>(PieceType p, <span class="kw">int</span> r, <span class="kw">int</span> c, <span class="kw">int</span> dr, <span class="kw">int</span> dc) {
        <span class="kw">for</span> (<span class="kw">int</span> i = <span class="nu">0</span>; i < size; i++) {
            <span class="kw">if</span> (grid[r + i*dr][c + i*dc] != p) <span class="kw">return false</span>;
        }
        <span class="kw">return true</span>;
    }

    <span class="kw">public boolean</span> <span class="fn">isFull</span>() { <span class="kw">return</span> movesCount == size * size; }
}

<span class="cm">// ===== GAME =====</span>
<span class="kw">class</span> <span class="tp">TicTacToeGame</span> {
    <span class="kw">private</span> Board board;
    <span class="kw">private</span> Player[] players;
    <span class="kw">private int</span> currentPlayerIdx;
    <span class="kw">private</span> GameStatus status;

    <span class="tp">TicTacToeGame</span>(Player p1, Player p2, <span class="kw">int</span> boardSize) {
        <span class="kw">this</span>.board = <span class="kw">new</span> Board(boardSize);
        <span class="kw">this</span>.players = <span class="kw">new</span> Player[]{p1, p2};
        <span class="kw">this</span>.currentPlayerIdx = <span class="nu">0</span>;
        <span class="kw">this</span>.status = GameStatus.IN_PROGRESS;
    }

    <span class="kw">public</span> GameStatus <span class="fn">makeMove</span>(<span class="kw">int</span> row, <span class="kw">int</span> col) {
        Player current = players[currentPlayerIdx];

        <span class="kw">if</span> (!board.<span class="fn">placePiece</span>(row, col, current.<span class="fn">getPiece</span>())) {
            <span class="kw">throw new</span> IllegalArgumentException(<span class="st">"Invalid move!"</span>);
        }

        <span class="kw">if</span> (board.<span class="fn">checkWin</span>(current.<span class="fn">getPiece</span>())) {
            status = current.<span class="fn">getPiece</span>() == PieceType.X ? GameStatus.X_WINS : GameStatus.O_WINS;
        } <span class="kw">else if</span> (board.<span class="fn">isFull</span>()) {
            status = GameStatus.DRAW;
        } <span class="kw">else</span> {
            currentPlayerIdx = <span class="nu">1</span> - currentPlayerIdx; <span class="cm">// switch player</span>
        }
        <span class="kw">return</span> status;
    }
}</code></pre>
`
            },
            {
                title: "4. Snake and Ladder ★★★★",
                content: `
<h3>🐍🪜 Design Snake and Ladder</h3>

<pre><code><span class="cm">// ===== CORE CLASSES =====</span>
<span class="kw">class</span> <span class="tp">Jump</span> {
    <span class="kw">int</span> start, end;
    <span class="tp">Jump</span>(<span class="kw">int</span> s, <span class="kw">int</span> e) { <span class="kw">this</span>.start = s; <span class="kw">this</span>.end = e; }
}

<span class="kw">class</span> <span class="tp">Player</span> {
    <span class="kw">private</span> String name;
    <span class="kw">private int</span> position;

    <span class="tp">Player</span>(String name) { <span class="kw">this</span>.name = name; <span class="kw">this</span>.position = <span class="nu">0</span>; }
    <span class="kw">public int</span> <span class="fn">getPosition</span>() { <span class="kw">return</span> position; }
    <span class="kw">public void</span> <span class="fn">setPosition</span>(<span class="kw">int</span> p) { <span class="kw">this</span>.position = p; }
    <span class="kw">public</span> String <span class="fn">getName</span>() { <span class="kw">return</span> name; }
}

<span class="kw">class</span> <span class="tp">Dice</span> {
    <span class="kw">private int</span> numDice;
    <span class="kw">private</span> Random random = <span class="kw">new</span> Random();

    <span class="tp">Dice</span>(<span class="kw">int</span> numDice) { <span class="kw">this</span>.numDice = numDice; }

    <span class="kw">public int</span> <span class="fn">roll</span>() {
        <span class="kw">int</span> total = <span class="nu">0</span>;
        <span class="kw">for</span> (<span class="kw">int</span> i = <span class="nu">0</span>; i < numDice; i++) {
            total += random.nextInt(<span class="nu">6</span>) + <span class="nu">1</span>;
        }
        <span class="kw">return</span> total;
    }
}

<span class="kw">class</span> <span class="tp">Board</span> {
    <span class="kw">private int</span> size;
    <span class="kw">private</span> Map&lt;Integer, Jump&gt; snakesAndLadders;

    <span class="tp">Board</span>(<span class="kw">int</span> size, List&lt;Jump&gt; snakes, List&lt;Jump&gt; ladders) {
        <span class="kw">this</span>.size = size;
        <span class="kw">this</span>.snakesAndLadders = <span class="kw">new</span> HashMap&lt;&gt;();
        <span class="kw">for</span> (Jump s : snakes)  snakesAndLadders.put(s.start, s);
        <span class="kw">for</span> (Jump l : ladders) snakesAndLadders.put(l.start, l);
    }

    <span class="kw">public int</span> <span class="fn">getFinalPosition</span>(<span class="kw">int</span> pos) {
        <span class="kw">if</span> (snakesAndLadders.containsKey(pos)) {
            Jump j = snakesAndLadders.get(pos);
            System.out.println((j.end > j.start ? <span class="st">"🪜 Ladder!"</span> : <span class="st">"🐍 Snake!"</span>)
                + <span class="st">" "</span> + j.start + <span class="st">" → "</span> + j.end);
            <span class="kw">return</span> j.end;
        }
        <span class="kw">return</span> pos;
    }

    <span class="kw">public int</span> <span class="fn">getSize</span>() { <span class="kw">return</span> size; }
}

<span class="cm">// ===== GAME =====</span>
<span class="kw">class</span> <span class="tp">SnakeAndLadderGame</span> {
    <span class="kw">private</span> Board board;
    <span class="kw">private</span> Dice dice;
    <span class="kw">private</span> Queue&lt;Player&gt; players;

    <span class="tp">SnakeAndLadderGame</span>(Board board, Dice dice, List&lt;Player&gt; playerList) {
        <span class="kw">this</span>.board = board;
        <span class="kw">this</span>.dice = dice;
        <span class="kw">this</span>.players = <span class="kw">new</span> LinkedList&lt;&gt;(playerList);
    }

    <span class="kw">public</span> Player <span class="fn">play</span>() {
        <span class="kw">while</span> (<span class="kw">true</span>) {
            Player current = players.poll();
            <span class="kw">int</span> roll = dice.<span class="fn">roll</span>();
            <span class="kw">int</span> newPos = current.<span class="fn">getPosition</span>() + roll;

            <span class="kw">if</span> (newPos > board.<span class="fn">getSize</span>()) {
                players.add(current); <span class="cm">// skip turn</span>
                <span class="kw">continue</span>;
            }

            newPos = board.<span class="fn">getFinalPosition</span>(newPos);
            current.<span class="fn">setPosition</span>(newPos);

            System.out.println(current.<span class="fn">getName</span>() + <span class="st">" rolled "</span> + roll
                + <span class="st">" → position "</span> + newPos);

            <span class="kw">if</span> (newPos == board.<span class="fn">getSize</span>()) {
                System.out.println(current.<span class="fn">getName</span>() + <span class="st">" WINS! 🎉"</span>);
                <span class="kw">return</span> current;
            }
            players.add(current);
        }
    }
}</code></pre>
`
            },
            {
                title: "5. Vending Machine ★★★★",
                content: `
<h3>🥤 Design a Vending Machine</h3>
<div class="callout important"><div class="callout-title">Classic State Pattern Problem — Amazon, Oracle</div></div>

<pre><code><span class="cm">// ===== ENUMS =====</span>
<span class="kw">enum</span> <span class="tp">Coin</span> { PENNY(<span class="nu">1</span>), NICKEL(<span class="nu">5</span>), DIME(<span class="nu">10</span>), QUARTER(<span class="nu">25</span>);
    <span class="kw">int</span> value; <span class="tp">Coin</span>(<span class="kw">int</span> v) { <span class="kw">this</span>.value = v; }
}

<span class="kw">class</span> <span class="tp">Product</span> {
    <span class="kw">private</span> String name;
    <span class="kw">private int</span> price;
    <span class="tp">Product</span>(String n, <span class="kw">int</span> p) { <span class="kw">this</span>.name = n; <span class="kw">this</span>.price = p; }
    <span class="kw">public</span> String <span class="fn">getName</span>() { <span class="kw">return</span> name; }
    <span class="kw">public int</span> <span class="fn">getPrice</span>() { <span class="kw">return</span> price; }
}

<span class="cm">// ===== STATE INTERFACE =====</span>
<span class="kw">interface</span> <span class="tp">VendingState</span> {
    <span class="kw">void</span> <span class="fn">insertCoin</span>(VendingMachine vm, Coin coin);
    <span class="kw">void</span> <span class="fn">selectProduct</span>(VendingMachine vm, String code);
    <span class="kw">void</span> <span class="fn">dispense</span>(VendingMachine vm);
    <span class="kw">void</span> <span class="fn">cancel</span>(VendingMachine vm);
}

<span class="cm">// ===== IDLE STATE =====</span>
<span class="kw">class</span> <span class="tp">IdleState</span> <span class="kw">implements</span> <span class="tp">VendingState</span> {
    <span class="kw">public void</span> <span class="fn">insertCoin</span>(VendingMachine vm, Coin coin) {
        vm.addBalance(coin.value);
        System.out.println(<span class="st">"Inserted: "</span> + coin + <span class="st">". Balance: "</span> + vm.getBalance());
        vm.<span class="fn">setState</span>(<span class="kw">new</span> HasMoneyState());
    }
    <span class="kw">public void</span> <span class="fn">selectProduct</span>(VendingMachine vm, String code) {
        System.out.println(<span class="st">"Insert coin first!"</span>);
    }
    <span class="kw">public void</span> <span class="fn">dispense</span>(VendingMachine vm) { System.out.println(<span class="st">"Insert coin first!"</span>); }
    <span class="kw">public void</span> <span class="fn">cancel</span>(VendingMachine vm)   { System.out.println(<span class="st">"Nothing to cancel"</span>); }
}

<span class="cm">// ===== HAS MONEY STATE =====</span>
<span class="kw">class</span> <span class="tp">HasMoneyState</span> <span class="kw">implements</span> <span class="tp">VendingState</span> {
    <span class="kw">public void</span> <span class="fn">insertCoin</span>(VendingMachine vm, Coin coin) {
        vm.addBalance(coin.value);
        System.out.println(<span class="st">"Balance: "</span> + vm.getBalance());
    }
    <span class="kw">public void</span> <span class="fn">selectProduct</span>(VendingMachine vm, String code) {
        Product p = vm.getProduct(code);
        <span class="kw">if</span> (p == <span class="kw">null</span>) { System.out.println(<span class="st">"Invalid product!"</span>); <span class="kw">return</span>; }
        <span class="kw">if</span> (vm.getBalance() < p.<span class="fn">getPrice</span>()) {
            System.out.println(<span class="st">"Need "</span> + (p.<span class="fn">getPrice</span>() - vm.getBalance()) + <span class="st">" more"</span>);
            <span class="kw">return</span>;
        }
        vm.setSelectedProduct(p);
        vm.<span class="fn">setState</span>(<span class="kw">new</span> DispensingState());
        vm.getState().<span class="fn">dispense</span>(vm);
    }
    <span class="kw">public void</span> <span class="fn">dispense</span>(VendingMachine vm) { System.out.println(<span class="st">"Select product first"</span>); }
    <span class="kw">public void</span> <span class="fn">cancel</span>(VendingMachine vm) {
        System.out.println(<span class="st">"Returning: "</span> + vm.getBalance());
        vm.resetBalance();
        vm.<span class="fn">setState</span>(<span class="kw">new</span> IdleState());
    }
}

<span class="cm">// ===== DISPENSING STATE =====</span>
<span class="kw">class</span> <span class="tp">DispensingState</span> <span class="kw">implements</span> <span class="tp">VendingState</span> {
    <span class="kw">public void</span> <span class="fn">insertCoin</span>(VendingMachine vm, Coin c) { System.out.println(<span class="st">"Wait..."</span>); }
    <span class="kw">public void</span> <span class="fn">selectProduct</span>(VendingMachine vm, String c) { System.out.println(<span class="st">"Wait..."</span>); }
    <span class="kw">public void</span> <span class="fn">dispense</span>(VendingMachine vm) {
        Product p = vm.getSelectedProduct();
        <span class="kw">int</span> change = vm.getBalance() - p.<span class="fn">getPrice</span>();
        System.out.println(<span class="st">"Dispensing: "</span> + p.<span class="fn">getName</span>());
        <span class="kw">if</span> (change > <span class="nu">0</span>) System.out.println(<span class="st">"Change: "</span> + change);
        vm.resetBalance();
        vm.setSelectedProduct(<span class="kw">null</span>);
        vm.<span class="fn">setState</span>(<span class="kw">new</span> IdleState());
    }
    <span class="kw">public void</span> <span class="fn">cancel</span>(VendingMachine vm) { System.out.println(<span class="st">"Already dispensing!"</span>); }
}

<span class="cm">// ===== VENDING MACHINE =====</span>
<span class="kw">class</span> <span class="tp">VendingMachine</span> {
    <span class="kw">private</span> VendingState state;
    <span class="kw">private int</span> balance;
    <span class="kw">private</span> Map&lt;String, Product&gt; inventory;
    <span class="kw">private</span> Product selectedProduct;

    <span class="tp">VendingMachine</span>() {
        <span class="kw">this</span>.state = <span class="kw">new</span> IdleState();
        <span class="kw">this</span>.balance = <span class="nu">0</span>;
        <span class="kw">this</span>.inventory = <span class="kw">new</span> HashMap&lt;&gt;();
    }

    <span class="kw">public void</span> <span class="fn">addProduct</span>(String code, Product p) { inventory.put(code, p); }
    <span class="kw">public void</span> <span class="fn">setState</span>(VendingState s) { <span class="kw">this</span>.state = s; }
    <span class="kw">public</span> VendingState <span class="fn">getState</span>() { <span class="kw">return</span> state; }
    <span class="kw">public void</span> <span class="fn">addBalance</span>(<span class="kw">int</span> amount) { balance += amount; }
    <span class="kw">public int</span> <span class="fn">getBalance</span>() { <span class="kw">return</span> balance; }
    <span class="kw">public void</span> <span class="fn">resetBalance</span>() { balance = <span class="nu">0</span>; }
    <span class="kw">public</span> Product <span class="fn">getProduct</span>(String code) { <span class="kw">return</span> inventory.get(code); }
    <span class="kw">public void</span> <span class="fn">setSelectedProduct</span>(Product p) { selectedProduct = p; }
    <span class="kw">public</span> Product <span class="fn">getSelectedProduct</span>() { <span class="kw">return</span> selectedProduct; }

    <span class="cm">// Delegate to current state</span>
    <span class="kw">public void</span> <span class="fn">insertCoin</span>(Coin c)      { state.<span class="fn">insertCoin</span>(<span class="kw">this</span>, c); }
    <span class="kw">public void</span> <span class="fn">selectProduct</span>(String c) { state.<span class="fn">selectProduct</span>(<span class="kw">this</span>, c); }
    <span class="kw">public void</span> <span class="fn">cancel</span>()               { state.<span class="fn">cancel</span>(<span class="kw">this</span>); }
}</code></pre>
`
            }
        ]
    }
];
if (typeof module !== 'undefined') module.exports = PROBLEMS_PART1;
