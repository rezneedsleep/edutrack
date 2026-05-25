with open('components/dashboard/teacher-tugas-client.tsx', 'rb') as f:
    lines = f.readlines()
    line_742 = lines[741] # 0-indexed
    print(f"Line 742 raw: {line_742}")
    print(f"Line 742 hex: {line_742.hex()}")
    for i, char in enumerate(line_742):
        print(f"Pos {i}: {char} ({hex(char)})")
