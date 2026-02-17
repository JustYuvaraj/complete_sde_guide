// Module 5 Part 2: LLD Practice Problems 6-15
const PROBLEMS_PART2_TOPICS = [
    {
        title: "6. BookMyShow ★★★★★",
        content: `
<h3>🎬 Design BookMyShow (Movie Ticket Booking)</h3>
<div class="callout important"><div class="callout-title">Top 5 Asked — Amazon, Flipkart, Paytm, BookMyShow</div></div>

<h4>Requirements</h4>
<ul><li>Search movies by city</li><li>View shows (theatre, timing, available seats)</li><li>Book seats (with seat selection)</li><li>Concurrency: two users can't book same seat</li><li>Payment processing</li></ul>

<pre><code><span class="kw">enum</span> <span class="tp">SeatType</span>     { REGULAR, PREMIUM, VIP }
<span class="kw">enum</span> <span class="tp">BookingStatus</span> { CONFIRMED, CANCELLED, PENDING }
<span class="kw">enum</span> <span class="tp">SeatStatus</span>    { AVAILABLE, BOOKED, LOCKED }

<span class="kw">class</span> <span class="tp">Movie</span> {
    <span class="kw">private</span> String id, title, genre;
    <span class="kw">private int</span> durationMinutes;
    <span class="cm">// constructor + getters</span>
}

<span class="kw">class</span> <span class="tp">Seat</span> {
    <span class="kw">private</span> String seatId;
    <span class="kw">private int</span> row, col;
    <span class="kw">private</span> SeatType type;
    <span class="kw">private</span> SeatStatus status;
    <span class="kw">private double</span> price;

    <span class="kw">public synchronized boolean</span> <span class="fn">lock</span>() {
        <span class="kw">if</span> (status == SeatStatus.AVAILABLE) {
            status = SeatStatus.LOCKED;
            <span class="kw">return true</span>;
        }
        <span class="kw">return false</span>;
    }

    <span class="kw">public void</span> <span class="fn">book</span>()    { status = SeatStatus.BOOKED; }
    <span class="kw">public void</span> <span class="fn">release</span>() { status = SeatStatus.AVAILABLE; }
}

<span class="kw">class</span> <span class="tp">Show</span> {
    <span class="kw">private</span> Movie movie;
    <span class="kw">private</span> String theatreId;
    <span class="kw">private</span> LocalDateTime startTime;
    <span class="kw">private</span> List&lt;Seat&gt; seats;

    <span class="kw">public</span> List&lt;Seat&gt; <span class="fn">getAvailableSeats</span>() {
        <span class="kw">return</span> seats.stream()
            .filter(s -> s.getStatus() == SeatStatus.AVAILABLE)
            .collect(Collectors.toList());
    }
}

<span class="kw">class</span> <span class="tp">Booking</span> {
    <span class="kw">private</span> String bookingId;
    <span class="kw">private</span> Show show;
    <span class="kw">private</span> List&lt;Seat&gt; seats;
    <span class="kw">private</span> String userId;
    <span class="kw">private double</span> totalAmount;
    <span class="kw">private</span> BookingStatus status;

    <span class="tp">Booking</span>(Show show, List&lt;Seat&gt; seats, String userId) {
        <span class="kw">this</span>.bookingId = UUID.randomUUID().toString();
        <span class="kw">this</span>.show = show;
        <span class="kw">this</span>.seats = seats;
        <span class="kw">this</span>.userId = userId;
        <span class="kw">this</span>.totalAmount = seats.stream().mapToDouble(Seat::getPrice).sum();
        <span class="kw">this</span>.status = BookingStatus.PENDING;
    }

    <span class="kw">public void</span> <span class="fn">confirm</span>() {
        seats.forEach(Seat::book);
        status = BookingStatus.CONFIRMED;
    }

    <span class="kw">public void</span> <span class="fn">cancel</span>() {
        seats.forEach(Seat::release);
        status = BookingStatus.CANCELLED;
    }
}

<span class="cm">// ===== BOOKING SERVICE =====</span>
<span class="kw">class</span> <span class="tp">BookingService</span> {
    <span class="kw">public</span> Booking <span class="fn">bookSeats</span>(Show show, List&lt;Seat&gt; seats, String userId) {
        <span class="cm">// Step 1: Lock all requested seats</span>
        List&lt;Seat&gt; locked = <span class="kw">new</span> ArrayList&lt;&gt;();
        <span class="kw">for</span> (Seat seat : seats) {
            <span class="kw">if</span> (seat.<span class="fn">lock</span>()) {
                locked.add(seat);
            } <span class="kw">else</span> {
                <span class="cm">// Release already locked seats</span>
                locked.forEach(Seat::release);
                <span class="kw">throw new</span> RuntimeException(<span class="st">"Seat "</span> + seat.getSeatId() + <span class="st">" not available"</span>);
            }
        }
        <span class="cm">// Step 2: Create booking</span>
        Booking booking = <span class="kw">new</span> Booking(show, locked, userId);
        <span class="cm">// Step 3: Process payment (simplified)</span>
        booking.<span class="fn">confirm</span>();
        <span class="kw">return</span> booking;
    }
}</code></pre>

<div class="callout interview"><div class="callout-title">🎯 Key Design Points</div>
<p>• <strong>synchronized lock()</strong> on Seat handles concurrency<br>
• Lock → Pay → Book pattern prevents double booking<br>
• If payment fails, release locked seats<br>
• Patterns: <strong>Builder</strong> for Booking, <strong>Strategy</strong> for Payment</p></div>
`
    },
    {
        title: "7. Splitwise ★★★★",
        content: `
<h3>💰 Design Splitwise (Expense Sharing)</h3>

<pre><code><span class="kw">enum</span> <span class="tp">SplitType</span> { EQUAL, EXACT, PERCENTAGE }

<span class="kw">class</span> <span class="tp">User</span> {
    <span class="kw">private</span> String id, name, email;
    <span class="kw">private</span> Map&lt;String, Double&gt; balances; <span class="cm">// userId → amount owed</span>

    <span class="tp">User</span>(String id, String name) {
        <span class="kw">this</span>.id = id; <span class="kw">this</span>.name = name;
        <span class="kw">this</span>.balances = <span class="kw">new</span> HashMap&lt;&gt;();
    }

    <span class="kw">public void</span> <span class="fn">updateBalance</span>(String userId, <span class="kw">double</span> amount) {
        balances.merge(userId, amount, Double::sum);
    }
}

<span class="cm">// ===== SPLIT STRATEGIES (Strategy Pattern) =====</span>
<span class="kw">interface</span> <span class="tp">SplitStrategy</span> {
    Map&lt;User, Double&gt; <span class="fn">split</span>(<span class="kw">double</span> amount, List&lt;User&gt; users, List&lt;Double&gt; values);
}

<span class="kw">class</span> <span class="tp">EqualSplit</span> <span class="kw">implements</span> <span class="tp">SplitStrategy</span> {
    <span class="kw">public</span> Map&lt;User, Double&gt; <span class="fn">split</span>(<span class="kw">double</span> amount, List&lt;User&gt; users, List&lt;Double&gt; v) {
        Map&lt;User, Double&gt; shares = <span class="kw">new</span> HashMap&lt;&gt;();
        <span class="kw">double</span> each = amount / users.size();
        users.forEach(u -> shares.put(u, each));
        <span class="kw">return</span> shares;
    }
}

<span class="kw">class</span> <span class="tp">ExactSplit</span> <span class="kw">implements</span> <span class="tp">SplitStrategy</span> {
    <span class="kw">public</span> Map&lt;User, Double&gt; <span class="fn">split</span>(<span class="kw">double</span> amount, List&lt;User&gt; users, List&lt;Double&gt; vals) {
        Map&lt;User, Double&gt; shares = <span class="kw">new</span> HashMap&lt;&gt;();
        <span class="kw">for</span> (<span class="kw">int</span> i = <span class="nu">0</span>; i < users.size(); i++) shares.put(users.get(i), vals.get(i));
        <span class="kw">return</span> shares;
    }
}

<span class="cm">// ===== EXPENSE =====</span>
<span class="kw">class</span> <span class="tp">Expense</span> {
    <span class="kw">private</span> String id;
    <span class="kw">private double</span> amount;
    <span class="kw">private</span> User paidBy;
    <span class="kw">private</span> List&lt;User&gt; splitAmong;
    <span class="kw">private</span> SplitStrategy strategy;

    <span class="tp">Expense</span>(User paidBy, <span class="kw">double</span> amount, List&lt;User&gt; users, SplitStrategy strategy) {
        <span class="kw">this</span>.id = UUID.randomUUID().toString();
        <span class="kw">this</span>.paidBy = paidBy;
        <span class="kw">this</span>.amount = amount;
        <span class="kw">this</span>.splitAmong = users;
        <span class="kw">this</span>.strategy = strategy;
    }

    <span class="kw">public void</span> <span class="fn">settle</span>() {
        Map&lt;User, Double&gt; shares = strategy.<span class="fn">split</span>(amount, splitAmong, <span class="kw">null</span>);
        <span class="kw">for</span> (Map.Entry&lt;User, Double&gt; e : shares.entrySet()) {
            User user = e.getKey();
            <span class="kw">double</span> owed = e.getValue();
            <span class="kw">if</span> (user != paidBy) {
                user.<span class="fn">updateBalance</span>(paidBy.getId(), owed);     <span class="cm">// user owes paidBy</span>
                paidBy.<span class="fn">updateBalance</span>(user.getId(), -owed);   <span class="cm">// paidBy is owed</span>
            }
        }
    }
}

<span class="cm">// ===== EXPENSE MANAGER =====</span>
<span class="kw">class</span> <span class="tp">ExpenseManager</span> {
    <span class="kw">private</span> Map&lt;String, User&gt; users = <span class="kw">new</span> HashMap&lt;&gt;();
    <span class="kw">private</span> List&lt;Expense&gt; expenses = <span class="kw">new</span> ArrayList&lt;&gt;();

    <span class="kw">public void</span> <span class="fn">addExpense</span>(Expense expense) {
        expenses.add(expense);
        expense.<span class="fn">settle</span>();
    }

    <span class="kw">public void</span> <span class="fn">showBalances</span>(User user) {
        user.getBalances().forEach((uid, amount) -> {
            <span class="kw">if</span> (amount > <span class="nu">0</span>) System.out.println(user.getName() + <span class="st">" owes "</span> + uid + <span class="st">": "</span> + amount);
            <span class="kw">else if</span> (amount < <span class="nu">0</span>) System.out.println(uid + <span class="st">" owes "</span> + user.getName() + <span class="st">": "</span> + (-amount));
        });
    }
}</code></pre>
`
    },
    {
        title: "8. Library Management ★★★★",
        content: `
<h3>📚 Design a Library Management System</h3>

<pre><code><span class="kw">enum</span> <span class="tp">BookStatus</span> { AVAILABLE, BORROWED, RESERVED, LOST }

<span class="kw">class</span> <span class="tp">Book</span> {
    <span class="kw">private</span> String isbn, title, author;
    <span class="kw">private</span> BookStatus status;

    <span class="tp">Book</span>(String isbn, String title, String author) {
        <span class="kw">this</span>.isbn = isbn; <span class="kw">this</span>.title = title; <span class="kw">this</span>.author = author;
        <span class="kw">this</span>.status = BookStatus.AVAILABLE;
    }
    <span class="cm">// getters + setters</span>
}

<span class="kw">class</span> <span class="tp">Member</span> {
    <span class="kw">private</span> String id, name;
    <span class="kw">private</span> List&lt;BookLoan&gt; activeLoans;
    <span class="kw">private static final int</span> MAX_BOOKS = <span class="nu">5</span>;

    <span class="kw">public boolean</span> <span class="fn">canBorrow</span>() { <span class="kw">return</span> activeLoans.size() < MAX_BOOKS; }
}

<span class="kw">class</span> <span class="tp">BookLoan</span> {
    <span class="kw">private</span> Book book;
    <span class="kw">private</span> Member member;
    <span class="kw">private</span> LocalDate borrowDate, dueDate, returnDate;
    <span class="kw">private double</span> fine;

    <span class="tp">BookLoan</span>(Book book, Member member) {
        <span class="kw">this</span>.book = book;
        <span class="kw">this</span>.member = member;
        <span class="kw">this</span>.borrowDate = LocalDate.now();
        <span class="kw">this</span>.dueDate = borrowDate.plusDays(<span class="nu">14</span>);
    }

    <span class="kw">public double</span> <span class="fn">calculateFine</span>() {
        <span class="kw">if</span> (returnDate != <span class="kw">null</span> && returnDate.isAfter(dueDate)) {
            <span class="kw">long</span> daysLate = ChronoUnit.DAYS.between(dueDate, returnDate);
            <span class="kw">return</span> daysLate * <span class="nu">2.0</span>; <span class="cm">// $2 per day late</span>
        }
        <span class="kw">return</span> <span class="nu">0</span>;
    }
}

<span class="cm">// ===== LIBRARY SERVICE =====</span>
<span class="kw">class</span> <span class="tp">LibraryService</span> {
    <span class="kw">private</span> Map&lt;String, Book&gt; catalog = <span class="kw">new</span> HashMap&lt;&gt;();
    <span class="kw">private</span> List&lt;BookLoan&gt; loans = <span class="kw">new</span> ArrayList&lt;&gt;();

    <span class="kw">public</span> BookLoan <span class="fn">borrowBook</span>(String isbn, Member member) {
        Book book = catalog.get(isbn);
        <span class="kw">if</span> (book == <span class="kw">null</span> || book.getStatus() != BookStatus.AVAILABLE) {
            <span class="kw">throw new</span> RuntimeException(<span class="st">"Book not available"</span>);
        }
        <span class="kw">if</span> (!member.<span class="fn">canBorrow</span>()) {
            <span class="kw">throw new</span> RuntimeException(<span class="st">"Borrow limit reached"</span>);
        }
        book.setStatus(BookStatus.BORROWED);
        BookLoan loan = <span class="kw">new</span> BookLoan(book, member);
        loans.add(loan);
        <span class="kw">return</span> loan;
    }

    <span class="kw">public double</span> <span class="fn">returnBook</span>(BookLoan loan) {
        loan.setReturnDate(LocalDate.now());
        loan.getBook().setStatus(BookStatus.AVAILABLE);
        <span class="kw">return</span> loan.<span class="fn">calculateFine</span>();
    }

    <span class="kw">public</span> List&lt;Book&gt; <span class="fn">searchByTitle</span>(String keyword) {
        <span class="kw">return</span> catalog.values().stream()
            .filter(b -> b.getTitle().toLowerCase().contains(keyword.toLowerCase()))
            .collect(Collectors.toList());
    }
}</code></pre>
`
    },
    {
        title: "9. ATM System ★★★",
        content: `
<h3>🏧 Design an ATM System</h3>

<pre><code><span class="kw">enum</span> <span class="tp">TransactionType</span> { WITHDRAWAL, DEPOSIT, BALANCE_CHECK }

<span class="kw">class</span> <span class="tp">Account</span> {
    <span class="kw">private</span> String accountId;
    <span class="kw">private double</span> balance;
    <span class="kw">private</span> String pin;

    <span class="kw">public boolean</span> <span class="fn">validatePin</span>(String inputPin) { <span class="kw">return</span> pin.equals(inputPin); }

    <span class="kw">public synchronized boolean</span> <span class="fn">withdraw</span>(<span class="kw">double</span> amount) {
        <span class="kw">if</span> (amount > <span class="nu">0</span> && amount <= balance) {
            balance -= amount;
            <span class="kw">return true</span>;
        }
        <span class="kw">return false</span>;
    }

    <span class="kw">public synchronized void</span> <span class="fn">deposit</span>(<span class="kw">double</span> amount) {
        <span class="kw">if</span> (amount > <span class="nu">0</span>) balance += amount;
    }
}

<span class="cm">// ===== CASH DISPENSER (Chain of Responsibility) =====</span>
<span class="kw">abstract class</span> <span class="tp">CashDispenser</span> {
    <span class="kw">protected int</span> denomination;
    <span class="kw">protected int</span> count;
    <span class="kw">protected</span> CashDispenser next;

    <span class="kw">public void</span> <span class="fn">setNext</span>(CashDispenser next) { <span class="kw">this</span>.next = next; }

    <span class="kw">public void</span> <span class="fn">dispense</span>(<span class="kw">int</span> amount) {
        <span class="kw">int</span> notes = Math.min(amount / denomination, count);
        <span class="kw">int</span> remaining = amount - notes * denomination;
        <span class="kw">if</span> (notes > <span class="nu">0</span>) {
            count -= notes;
            System.out.println(notes + <span class="st">" x $"</span> + denomination);
        }
        <span class="kw">if</span> (remaining > <span class="nu">0</span> && next != <span class="kw">null</span>) next.<span class="fn">dispense</span>(remaining);
    }
}

<span class="kw">class</span> <span class="tp">Hundred</span> <span class="kw">extends</span> <span class="tp">CashDispenser</span> { <span class="tp">Hundred</span>(<span class="kw">int</span> c) { denomination=<span class="nu">100</span>; count=c; } }
<span class="kw">class</span> <span class="tp">Fifty</span> <span class="kw">extends</span> <span class="tp">CashDispenser</span>   { <span class="tp">Fifty</span>(<span class="kw">int</span> c)   { denomination=<span class="nu">50</span>;  count=c; } }
<span class="kw">class</span> <span class="tp">Twenty</span> <span class="kw">extends</span> <span class="tp">CashDispenser</span>  { <span class="tp">Twenty</span>(<span class="kw">int</span> c)  { denomination=<span class="nu">20</span>;  count=c; } }

<span class="cm">// ===== ATM =====</span>
<span class="kw">class</span> <span class="tp">ATM</span> {
    <span class="kw">private</span> CashDispenser dispenserChain;
    <span class="kw">private</span> Map&lt;String, Account&gt; accounts;
    <span class="kw">private</span> Account currentAccount;

    <span class="tp">ATM</span>() {
        <span class="cm">// Build chain: $100 → $50 → $20</span>
        Hundred h = <span class="kw">new</span> Hundred(<span class="nu">100</span>);
        Fifty f = <span class="kw">new</span> Fifty(<span class="nu">100</span>);
        Twenty t = <span class="kw">new</span> Twenty(<span class="nu">100</span>);
        h.<span class="fn">setNext</span>(f); f.<span class="fn">setNext</span>(t);
        dispenserChain = h;
    }

    <span class="kw">public boolean</span> <span class="fn">authenticate</span>(String cardId, String pin) {
        Account acc = accounts.get(cardId);
        <span class="kw">if</span> (acc != <span class="kw">null</span> && acc.<span class="fn">validatePin</span>(pin)) {
            currentAccount = acc;
            <span class="kw">return true</span>;
        }
        <span class="kw">return false</span>;
    }

    <span class="kw">public boolean</span> <span class="fn">withdraw</span>(<span class="kw">double</span> amount) {
        <span class="kw">if</span> (currentAccount.<span class="fn">withdraw</span>(amount)) {
            dispenserChain.<span class="fn">dispense</span>((<span class="kw">int</span>) amount);
            <span class="kw">return true</span>;
        }
        <span class="kw">return false</span>;
    }
}</code></pre>

<div class="callout tip"><div class="callout-title">Bonus Pattern: Chain of Responsibility</div>
<p>The cash dispenser uses Chain of Responsibility — $100 bills first, then $50, then $20. Each handler tries to process as much as it can, then passes the remainder.</p></div>
`
    },
    {
        title: "10. Chess Game ★★★★",
        content: `
<h3>♟️ Design a Chess Game</h3>

<pre><code><span class="kw">enum</span> <span class="tp">Color</span>     { WHITE, BLACK }
<span class="kw">enum</span> <span class="tp">GameState</span> { ACTIVE, CHECK, CHECKMATE, STALEMATE }

<span class="kw">class</span> <span class="tp">Position</span> {
    <span class="kw">int</span> row, col;
    <span class="tp">Position</span>(<span class="kw">int</span> r, <span class="kw">int</span> c) { <span class="kw">this</span>.row = r; <span class="kw">this</span>.col = c; }
}

<span class="cm">// ===== PIECE (Abstract with Polymorphism) =====</span>
<span class="kw">abstract class</span> <span class="tp">Piece</span> {
    <span class="kw">protected</span> Color color;
    <span class="kw">protected</span> Position position;

    <span class="tp">Piece</span>(Color c, Position p) { <span class="kw">this</span>.color = c; <span class="kw">this</span>.position = p; }

    <span class="kw">abstract</span> List&lt;Position&gt; <span class="fn">getValidMoves</span>(Board board);
    <span class="kw">abstract</span> String <span class="fn">getSymbol</span>();
}

<span class="kw">class</span> <span class="tp">Pawn</span> <span class="kw">extends</span> <span class="tp">Piece</span> {
    <span class="tp">Pawn</span>(Color c, Position p) { <span class="kw">super</span>(c, p); }
    <span class="kw">public</span> String <span class="fn">getSymbol</span>() { <span class="kw">return</span> color == Color.WHITE ? <span class="st">"♙"</span> : <span class="st">"♟"</span>; }
    <span class="kw">public</span> List&lt;Position&gt; <span class="fn">getValidMoves</span>(Board board) {
        List&lt;Position&gt; moves = <span class="kw">new</span> ArrayList&lt;&gt;();
        <span class="kw">int</span> dir = color == Color.WHITE ? -<span class="nu">1</span> : <span class="nu">1</span>;
        <span class="cm">// Forward move</span>
        Position fwd = <span class="kw">new</span> Position(position.row + dir, position.col);
        <span class="kw">if</span> (board.<span class="fn">isValid</span>(fwd) && board.<span class="fn">isEmpty</span>(fwd)) moves.add(fwd);
        <span class="cm">// Diagonal captures</span>
        <span class="kw">for</span> (<span class="kw">int</span> dc : <span class="kw">new int</span>[]{-<span class="nu">1</span>, <span class="nu">1</span>}) {
            Position diag = <span class="kw">new</span> Position(position.row + dir, position.col + dc);
            <span class="kw">if</span> (board.<span class="fn">isValid</span>(diag) && board.<span class="fn">hasEnemy</span>(diag, color)) moves.add(diag);
        }
        <span class="kw">return</span> moves;
    }
}

<span class="kw">class</span> <span class="tp">Rook</span> <span class="kw">extends</span> <span class="tp">Piece</span> {
    <span class="tp">Rook</span>(Color c, Position p) { <span class="kw">super</span>(c, p); }
    <span class="kw">public</span> String <span class="fn">getSymbol</span>() { <span class="kw">return</span> color == Color.WHITE ? <span class="st">"♖"</span> : <span class="st">"♜"</span>; }
    <span class="kw">public</span> List&lt;Position&gt; <span class="fn">getValidMoves</span>(Board board) {
        <span class="cm">// Move in straight lines: up, down, left, right</span>
        <span class="kw">return</span> board.<span class="fn">getLineMoves</span>(position, <span class="kw">new int</span>[][]{{<span class="nu">1</span>,<span class="nu">0</span>},{-<span class="nu">1</span>,<span class="nu">0</span>},{<span class="nu">0</span>,<span class="nu">1</span>},{<span class="nu">0</span>,-<span class="nu">1</span>}}, color);
    }
}
<span class="cm">// Knight, Bishop, Queen, King follow same pattern...</span>

<span class="cm">// ===== BOARD =====</span>
<span class="kw">class</span> <span class="tp">Board</span> {
    <span class="kw">private</span> Piece[][] grid = <span class="kw">new</span> Piece[<span class="nu">8</span>][<span class="nu">8</span>];

    <span class="kw">public boolean</span> <span class="fn">movePiece</span>(Position from, Position to) {
        Piece piece = grid[from.row][from.col];
        List&lt;Position&gt; valid = piece.<span class="fn">getValidMoves</span>(<span class="kw">this</span>);
        <span class="cm">// Check if 'to' is in valid moves</span>
        <span class="cm">// Execute move, handle captures</span>
        grid[to.row][to.col] = piece;
        grid[from.row][from.col] = <span class="kw">null</span>;
        piece.position = to;
        <span class="kw">return true</span>;
    }
}

<span class="cm">// ===== GAME =====</span>
<span class="kw">class</span> <span class="tp">ChessGame</span> {
    <span class="kw">private</span> Board board;
    <span class="kw">private</span> Player whitePlayer, blackPlayer;
    <span class="kw">private</span> Color currentTurn;
    <span class="kw">private</span> GameState state;
    <span class="kw">private</span> List&lt;Move&gt; moveHistory;

    <span class="kw">public</span> GameState <span class="fn">makeMove</span>(Position from, Position to) {
        Piece piece = board.getPiece(from);
        <span class="kw">if</span> (piece.color != currentTurn) <span class="kw">throw new</span> IllegalArgumentException(<span class="st">"Not your turn!"</span>);
        board.<span class="fn">movePiece</span>(from, to);
        currentTurn = (currentTurn == Color.WHITE) ? Color.BLACK : Color.WHITE;
        <span class="cm">// Check for check/checkmate</span>
        <span class="kw">return</span> state;
    }
}</code></pre>

<div class="callout interview"><div class="callout-title">🎯 Key Pattern: Polymorphism</div><p>Each Piece type overrides <code>getValidMoves()</code>. The Board doesn't need to know if it's a Rook or Knight — it just calls the method. This is polymorphism in action!</p></div>
`
    },
    {
        title: "11. Hotel Booking ★★★",
        content: `
<h3>🏨 Design Hotel Booking System</h3>

<pre><code><span class="kw">enum</span> <span class="tp">RoomType</span>      { SINGLE, DOUBLE, SUITE }
<span class="kw">enum</span> <span class="tp">RoomStatus</span>    { AVAILABLE, BOOKED, MAINTENANCE }
<span class="kw">enum</span> <span class="tp">ReservationStatus</span> { CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED }

<span class="kw">class</span> <span class="tp">Room</span> {
    <span class="kw">private</span> String roomNumber;
    <span class="kw">private</span> RoomType type;
    <span class="kw">private double</span> pricePerNight;
    <span class="kw">private</span> RoomStatus status;

    <span class="kw">public boolean</span> <span class="fn">isAvailable</span>() { <span class="kw">return</span> status == RoomStatus.AVAILABLE; }
}

<span class="kw">class</span> <span class="tp">Reservation</span> {
    <span class="kw">private</span> String id;
    <span class="kw">private</span> Guest guest;
    <span class="kw">private</span> Room room;
    <span class="kw">private</span> LocalDate checkIn, checkOut;
    <span class="kw">private</span> ReservationStatus status;
    <span class="kw">private double</span> totalCost;

    <span class="tp">Reservation</span>(Guest g, Room r, LocalDate in, LocalDate out) {
        <span class="kw">this</span>.id = UUID.randomUUID().toString();
        <span class="kw">this</span>.guest = g; <span class="kw">this</span>.room = r;
        <span class="kw">this</span>.checkIn = in; <span class="kw">this</span>.checkOut = out;
        <span class="kw">long</span> nights = ChronoUnit.DAYS.between(in, out);
        <span class="kw">this</span>.totalCost = nights * r.getPricePerNight();
        <span class="kw">this</span>.status = ReservationStatus.CONFIRMED;
        r.setStatus(RoomStatus.BOOKED);
    }
}

<span class="kw">class</span> <span class="tp">Hotel</span> {
    <span class="kw">private</span> String name;
    <span class="kw">private</span> List&lt;Room&gt; rooms;
    <span class="kw">private</span> List&lt;Reservation&gt; reservations;

    <span class="kw">public</span> List&lt;Room&gt; <span class="fn">searchAvailable</span>(RoomType type, LocalDate in, LocalDate out) {
        <span class="kw">return</span> rooms.stream()
            .filter(r -> r.getType() == type && r.<span class="fn">isAvailable</span>())
            .collect(Collectors.toList());
    }

    <span class="kw">public</span> Reservation <span class="fn">bookRoom</span>(Guest g, Room r, LocalDate in, LocalDate out) {
        <span class="kw">if</span> (!r.<span class="fn">isAvailable</span>()) <span class="kw">throw new</span> RuntimeException(<span class="st">"Room not available"</span>);
        Reservation res = <span class="kw">new</span> Reservation(g, r, in, out);
        reservations.add(res);
        <span class="kw">return</span> res;
    }
}</code></pre>
`
    },
    {
        title: "12. Amazon Locker ★★★",
        content: `
<h3>📦 Design Amazon Locker System</h3>

<pre><code><span class="kw">enum</span> <span class="tp">LockerSize</span>   { SMALL, MEDIUM, LARGE }
<span class="kw">enum</span> <span class="tp">LockerStatus</span> { AVAILABLE, OCCUPIED }

<span class="kw">class</span> <span class="tp">Locker</span> {
    <span class="kw">private</span> String id;
    <span class="kw">private</span> LockerSize size;
    <span class="kw">private</span> LockerStatus status;
    <span class="kw">private</span> Package currentPackage;

    <span class="kw">public boolean</span> <span class="fn">canFit</span>(Package pkg) {
        <span class="kw">return</span> status == LockerStatus.AVAILABLE && size.ordinal() >= pkg.getSize().ordinal();
    }

    <span class="kw">public</span> String <span class="fn">storePackage</span>(Package pkg) {
        <span class="kw">this</span>.currentPackage = pkg;
        <span class="kw">this</span>.status = LockerStatus.OCCUPIED;
        String code = generateCode();
        <span class="kw">return</span> code;
    }

    <span class="kw">public</span> Package <span class="fn">retrievePackage</span>(String code) {
        <span class="cm">// Validate code and return package</span>
        Package pkg = currentPackage;
        currentPackage = <span class="kw">null</span>;
        status = LockerStatus.AVAILABLE;
        <span class="kw">return</span> pkg;
    }

    <span class="kw">private</span> String <span class="fn">generateCode</span>() {
        <span class="kw">return</span> String.valueOf((<span class="kw">int</span>)(Math.random() * <span class="nu">900000</span>) + <span class="nu">100000</span>);
    }
}

<span class="kw">class</span> <span class="tp">LockerLocation</span> {
    <span class="kw">private</span> String address;
    <span class="kw">private</span> List&lt;Locker&gt; lockers;

    <span class="kw">public</span> Locker <span class="fn">findAvailableLocker</span>(Package pkg) {
        <span class="kw">return</span> lockers.stream()
            .filter(l -> l.<span class="fn">canFit</span>(pkg))
            .findFirst()
            .orElse(<span class="kw">null</span>);
    }
}

<span class="kw">class</span> <span class="tp">LockerService</span> {
    <span class="kw">private</span> List&lt;LockerLocation&gt; locations;
    <span class="kw">private</span> Map&lt;String, Locker&gt; codeToLocker = <span class="kw">new</span> HashMap&lt;&gt;();

    <span class="kw">public</span> String <span class="fn">assignLocker</span>(Package pkg, String locationId) {
        LockerLocation loc = <span class="fn">findLocation</span>(locationId);
        Locker locker = loc.<span class="fn">findAvailableLocker</span>(pkg);
        <span class="kw">if</span> (locker == <span class="kw">null</span>) <span class="kw">throw new</span> RuntimeException(<span class="st">"No locker available"</span>);
        String code = locker.<span class="fn">storePackage</span>(pkg);
        codeToLocker.put(code, locker);
        <span class="cm">// Send code to customer via email/SMS</span>
        <span class="kw">return</span> code;
    }

    <span class="kw">public</span> Package <span class="fn">pickupPackage</span>(String code) {
        Locker locker = codeToLocker.get(code);
        <span class="kw">if</span> (locker == <span class="kw">null</span>) <span class="kw">throw new</span> RuntimeException(<span class="st">"Invalid code"</span>);
        codeToLocker.remove(code);
        <span class="kw">return</span> locker.<span class="fn">retrievePackage</span>(code);
    }
}</code></pre>
`
    },
    {
        title: "13. Online Shopping ★★★★",
        content: `
<h3>🛒 Design Online Shopping System (Amazon)</h3>

<pre><code><span class="kw">enum</span> <span class="tp">OrderStatus</span> { PLACED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED }

<span class="kw">class</span> <span class="tp">Product</span> {
    <span class="kw">private</span> String id, name, description;
    <span class="kw">private double</span> price;
    <span class="kw">private int</span> stockCount;

    <span class="kw">public synchronized boolean</span> <span class="fn">reduceStock</span>(<span class="kw">int</span> qty) {
        <span class="kw">if</span> (stockCount >= qty) { stockCount -= qty; <span class="kw">return true</span>; }
        <span class="kw">return false</span>;
    }
}

<span class="kw">class</span> <span class="tp">CartItem</span> {
    <span class="kw">private</span> Product product;
    <span class="kw">private int</span> quantity;
    <span class="kw">public double</span> <span class="fn">getSubtotal</span>() { <span class="kw">return</span> product.getPrice() * quantity; }
}

<span class="kw">class</span> <span class="tp">ShoppingCart</span> {
    <span class="kw">private</span> List&lt;CartItem&gt; items = <span class="kw">new</span> ArrayList&lt;&gt;();

    <span class="kw">public void</span> <span class="fn">addItem</span>(Product p, <span class="kw">int</span> qty) {
        items.add(<span class="kw">new</span> CartItem(p, qty));
    }
    <span class="kw">public void</span> <span class="fn">removeItem</span>(Product p) {
        items.removeIf(i -> i.getProduct().equals(p));
    }
    <span class="kw">public double</span> <span class="fn">getTotal</span>() {
        <span class="kw">return</span> items.stream().mapToDouble(CartItem::getSubtotal).sum();
    }
    <span class="kw">public void</span> <span class="fn">clear</span>() { items.clear(); }
}

<span class="kw">class</span> <span class="tp">Order</span> {
    <span class="kw">private</span> String orderId;
    <span class="kw">private</span> User user;
    <span class="kw">private</span> List&lt;CartItem&gt; items;
    <span class="kw">private double</span> totalAmount;
    <span class="kw">private</span> OrderStatus status;
    <span class="kw">private</span> Address shippingAddress;

    <span class="tp">Order</span>(User u, List&lt;CartItem&gt; items, Address addr) {
        <span class="kw">this</span>.orderId = UUID.randomUUID().toString();
        <span class="kw">this</span>.user = u;
        <span class="kw">this</span>.items = <span class="kw">new</span> ArrayList&lt;&gt;(items);
        <span class="kw">this</span>.totalAmount = items.stream().mapToDouble(CartItem::getSubtotal).sum();
        <span class="kw">this</span>.shippingAddress = addr;
        <span class="kw">this</span>.status = OrderStatus.PLACED;
    }
}

<span class="cm">// ===== ORDER SERVICE =====</span>
<span class="kw">class</span> <span class="tp">OrderService</span> {
    <span class="kw">private</span> PaymentMethod paymentMethod; <span class="cm">// Strategy pattern</span>

    <span class="kw">public</span> Order <span class="fn">placeOrder</span>(User user, ShoppingCart cart, Address addr) {
        <span class="cm">// 1. Validate stock</span>
        <span class="kw">for</span> (CartItem item : cart.getItems()) {
            <span class="kw">if</span> (!item.getProduct().<span class="fn">reduceStock</span>(item.getQuantity())) {
                <span class="kw">throw new</span> RuntimeException(item.getProduct().getName() + <span class="st">" out of stock"</span>);
            }
        }
        <span class="cm">// 2. Process payment</span>
        paymentMethod.<span class="fn">pay</span>(cart.<span class="fn">getTotal</span>());
        <span class="cm">// 3. Create order</span>
        Order order = <span class="kw">new</span> Order(user, cart.getItems(), addr);
        cart.<span class="fn">clear</span>();
        <span class="kw">return</span> order;
    }
}</code></pre>
`
    },
    {
        title: "14. Ride Sharing (Uber) ★★★★",
        content: `
<h3>🚗 Design Ride Sharing (Uber/Ola)</h3>

<pre><code><span class="kw">enum</span> <span class="tp">RideStatus</span>  { REQUESTED, MATCHED, IN_PROGRESS, COMPLETED, CANCELLED }
<span class="kw">enum</span> <span class="tp">DriverStatus</span>{ AVAILABLE, ON_RIDE, OFFLINE }

<span class="kw">class</span> <span class="tp">Location</span> {
    <span class="kw">private double</span> lat, lng;
    <span class="kw">public double</span> <span class="fn">distanceTo</span>(Location other) {
        <span class="kw">return</span> Math.sqrt(Math.pow(lat - other.lat, <span class="nu">2</span>) + Math.pow(lng - other.lng, <span class="nu">2</span>));
    }
}

<span class="kw">class</span> <span class="tp">Rider</span> {
    <span class="kw">private</span> String id, name;
    <span class="kw">private</span> Location currentLocation;
}

<span class="kw">class</span> <span class="tp">Driver</span> {
    <span class="kw">private</span> String id, name;
    <span class="kw">private</span> Location currentLocation;
    <span class="kw">private</span> DriverStatus status;
    <span class="kw">private double</span> rating;

    <span class="kw">public boolean</span> <span class="fn">isAvailable</span>() { <span class="kw">return</span> status == DriverStatus.AVAILABLE; }
}

<span class="kw">class</span> <span class="tp">Ride</span> {
    <span class="kw">private</span> String rideId;
    <span class="kw">private</span> Rider rider;
    <span class="kw">private</span> Driver driver;
    <span class="kw">private</span> Location pickup, dropoff;
    <span class="kw">private</span> RideStatus status;
    <span class="kw">private double</span> fare;

    <span class="kw">public void</span> <span class="fn">start</span>() { status = RideStatus.IN_PROGRESS; }
    <span class="kw">public void</span> <span class="fn">complete</span>(<span class="kw">double</span> fare) {
        <span class="kw">this</span>.fare = fare;
        status = RideStatus.COMPLETED;
        driver.setStatus(DriverStatus.AVAILABLE);
    }
}

<span class="cm">// ===== MATCHING STRATEGY (Strategy Pattern) =====</span>
<span class="kw">interface</span> <span class="tp">DriverMatchingStrategy</span> {
    Driver <span class="fn">findDriver</span>(Location pickup, List&lt;Driver&gt; drivers);
}

<span class="kw">class</span> <span class="tp">NearestDriverStrategy</span> <span class="kw">implements</span> <span class="tp">DriverMatchingStrategy</span> {
    <span class="kw">public</span> Driver <span class="fn">findDriver</span>(Location pickup, List&lt;Driver&gt; drivers) {
        <span class="kw">return</span> drivers.stream()
            .filter(Driver::isAvailable)
            .min(Comparator.comparingDouble(d -> d.getCurrentLocation().<span class="fn">distanceTo</span>(pickup)))
            .orElse(<span class="kw">null</span>);
    }
}

<span class="cm">// ===== PRICING STRATEGY =====</span>
<span class="kw">interface</span> <span class="tp">PricingStrategy</span> {
    <span class="kw">double</span> <span class="fn">calculateFare</span>(Location from, Location to);
}

<span class="kw">class</span> <span class="tp">StandardPricing</span> <span class="kw">implements</span> <span class="tp">PricingStrategy</span> {
    <span class="kw">private double</span> baseFare = <span class="nu">50</span>;
    <span class="kw">private double</span> perKmRate = <span class="nu">12</span>;
    <span class="kw">public double</span> <span class="fn">calculateFare</span>(Location from, Location to) {
        <span class="kw">return</span> baseFare + from.<span class="fn">distanceTo</span>(to) * perKmRate;
    }
}

<span class="cm">// ===== RIDE SERVICE =====</span>
<span class="kw">class</span> <span class="tp">RideService</span> {
    <span class="kw">private</span> List&lt;Driver&gt; drivers;
    <span class="kw">private</span> DriverMatchingStrategy matchingStrategy;
    <span class="kw">private</span> PricingStrategy pricingStrategy;

    <span class="kw">public</span> Ride <span class="fn">requestRide</span>(Rider rider, Location pickup, Location dropoff) {
        Driver driver = matchingStrategy.<span class="fn">findDriver</span>(pickup, drivers);
        <span class="kw">if</span> (driver == <span class="kw">null</span>) <span class="kw">throw new</span> RuntimeException(<span class="st">"No drivers available"</span>);

        driver.setStatus(DriverStatus.ON_RIDE);
        Ride ride = <span class="kw">new</span> Ride(rider, driver, pickup, dropoff);
        <span class="cm">// Notify driver (Observer pattern)</span>
        <span class="kw">return</span> ride;
    }

    <span class="kw">public void</span> <span class="fn">completeRide</span>(Ride ride) {
        <span class="kw">double</span> fare = pricingStrategy.<span class="fn">calculateFare</span>(ride.getPickup(), ride.getDropoff());
        ride.<span class="fn">complete</span>(fare);
    }
}</code></pre>
`
    },
    {
        title: "15. Food Ordering (Zomato) ★★★",
        content: `
<h3>🍔 Design Food Ordering System (Zomato/Swiggy)</h3>

<pre><code><span class="kw">enum</span> <span class="tp">OrderStatus</span> { PLACED, ACCEPTED, PREPARING, READY, PICKED_UP, DELIVERED }

<span class="kw">class</span> <span class="tp">MenuItem</span> {
    <span class="kw">private</span> String id, name, description;
    <span class="kw">private double</span> price;
    <span class="kw">private boolean</span> isAvailable;
}

<span class="kw">class</span> <span class="tp">Restaurant</span> {
    <span class="kw">private</span> String id, name;
    <span class="kw">private</span> Location location;
    <span class="kw">private</span> List&lt;MenuItem&gt; menu;
    <span class="kw">private boolean</span> isOpen;

    <span class="kw">public</span> List&lt;MenuItem&gt; <span class="fn">getAvailableItems</span>() {
        <span class="kw">return</span> menu.stream().filter(MenuItem::isAvailable).collect(Collectors.toList());
    }
}

<span class="kw">class</span> <span class="tp">OrderItem</span> {
    <span class="kw">private</span> MenuItem item;
    <span class="kw">private int</span> quantity;
    <span class="kw">public double</span> <span class="fn">getSubtotal</span>() { <span class="kw">return</span> item.getPrice() * quantity; }
}

<span class="kw">class</span> <span class="tp">FoodOrder</span> {
    <span class="kw">private</span> String orderId;
    <span class="kw">private</span> Customer customer;
    <span class="kw">private</span> Restaurant restaurant;
    <span class="kw">private</span> List&lt;OrderItem&gt; items;
    <span class="kw">private</span> DeliveryAgent agent;
    <span class="kw">private</span> OrderStatus status;
    <span class="kw">private double</span> total;

    <span class="tp">FoodOrder</span>(Customer c, Restaurant r, List&lt;OrderItem&gt; items) {
        <span class="kw">this</span>.orderId = UUID.randomUUID().toString();
        <span class="kw">this</span>.customer = c;
        <span class="kw">this</span>.restaurant = r;
        <span class="kw">this</span>.items = items;
        <span class="kw">this</span>.total = items.stream().mapToDouble(OrderItem::getSubtotal).sum();
        <span class="kw">this</span>.status = OrderStatus.PLACED;
    }

    <span class="kw">public void</span> <span class="fn">updateStatus</span>(OrderStatus s) { <span class="kw">this</span>.status = s; }
    <span class="kw">public void</span> <span class="fn">assignAgent</span>(DeliveryAgent a) { <span class="kw">this</span>.agent = a; }
}

<span class="kw">class</span> <span class="tp">DeliveryAgent</span> {
    <span class="kw">private</span> String id, name;
    <span class="kw">private</span> Location currentLocation;
    <span class="kw">private boolean</span> isAvailable;
}

<span class="cm">// ===== ORDER SERVICE =====</span>
<span class="kw">class</span> <span class="tp">FoodOrderService</span> {
    <span class="kw">private</span> List&lt;DeliveryAgent&gt; agents;
    <span class="kw">private</span> PaymentMethod paymentMethod;

    <span class="kw">public</span> FoodOrder <span class="fn">placeOrder</span>(Customer c, Restaurant r, List&lt;OrderItem&gt; items) {
        <span class="kw">if</span> (!r.isOpen()) <span class="kw">throw new</span> RuntimeException(<span class="st">"Restaurant closed"</span>);
        FoodOrder order = <span class="kw">new</span> FoodOrder(c, r, items);
        paymentMethod.<span class="fn">pay</span>(order.getTotal());
        order.<span class="fn">updateStatus</span>(OrderStatus.ACCEPTED);
        <span class="cm">// Notify restaurant (Observer pattern)</span>
        <span class="kw">return</span> order;
    }

    <span class="kw">public void</span> <span class="fn">assignDelivery</span>(FoodOrder order) {
        DeliveryAgent agent = <span class="fn">findNearestAgent</span>(order.getRestaurant().getLocation());
        order.<span class="fn">assignAgent</span>(agent);
        agent.setAvailable(<span class="kw">false</span>);
    }

    <span class="kw">private</span> DeliveryAgent <span class="fn">findNearestAgent</span>(Location loc) {
        <span class="kw">return</span> agents.stream()
            .filter(DeliveryAgent::isAvailable)
            .min(Comparator.comparingDouble(a -> a.getCurrentLocation().<span class="fn">distanceTo</span>(loc)))
            .orElseThrow(() -> <span class="kw">new</span> RuntimeException(<span class="st">"No agents available"</span>));
    }
}</code></pre>

<div class="section-divider"></div>
<h3>🎉 Course Complete!</h3>
<p>You've learned everything needed to crack LLD interviews at FAANG:</p>
<ul>
<li>✅ Java from absolute zero</li>
<li>✅ OOP & SOLID principles</li>
<li>✅ 12+ Design Patterns</li>
<li>✅ UML Class Diagrams</li>
<li>✅ 45-minute interview framework</li>
<li>✅ 15 most-asked LLD problems with full solutions</li>
</ul>
<div class="callout interview"><div class="callout-title">🎯 Study Plan</div>
<p><strong>Week 1:</strong> Module 1 (Java) + Module 2 (SOLID)<br>
<strong>Week 2:</strong> Module 3 (Patterns) + Module 4 (UML/Framework)<br>
<strong>Week 3-4:</strong> Solve all 15 problems without looking at solutions<br>
<strong>Daily:</strong> Pick 1 problem, set a 45-min timer, solve it on paper first!</p></div>
`
    }
];
if (typeof module !== 'undefined') module.exports = PROBLEMS_PART2_TOPICS;
