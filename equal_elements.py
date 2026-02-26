import sys

def solve():
    # Fast I/O: Read all input at once
    try:
        data = sys.stdin.read().split()
    except EOFError:
        return
    
    if not data:
        return
    
    T = int(data[0])
    ptr = 1
    
    output = []
    for _ in range(T):
        if ptr >= len(data):
            break
        N = int(data[ptr])
        ptr += 1
        A = data[ptr : ptr + N]
        ptr += N
        
        ans = 0
        # wait[x] stores the max length of a good subsequence 
        # that can precede a pair of value x.
        wait = {}
        
        for x in A:
            prev_ans = ans
            if x in wait:
                # Option 1: Complete a pair using the start stored in wait[x]
                val = wait[x]
                if val + 2 > ans:
                    ans = val + 2
                
                # Option 2: This x could also start a NEW pair.
                # It can follow any good subsequence completed so far.
                # However, it must follow one that ended BEFORE this index.
                if prev_ans > val:
                    wait[x] = prev_ans
            else:
                # Start waiting with the best length available before this x
                wait[x] = prev_ans
                
        output.append(str(ans))
    
    sys.stdout.write('\n'.join(output) + '\n')

if __name__ == "__main__":
    solve()
