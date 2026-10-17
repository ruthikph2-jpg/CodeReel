import { ExecutionResult } from '@/types'

// Generates a rich multi-step demo trace showing ALL data structures animating

export const mockExecuteCode = async (code: string): Promise<ExecutionResult> => {
  await new Promise(r => setTimeout(r, 800))

  // Detect what the code is about
  const hasStack = code.toLowerCase().includes('stack')
  const hasQueue = code.toLowerCase().includes('queue')
  const hasLinkedList = code.toLowerCase().includes('linked') || code.toLowerCase().includes('node')
  const isSort = code.includes('bubbleSort') || code.includes('selectionSort') || code.includes('arr[j]')

  if (hasStack) return generateStackTrace(code)
  if (hasQueue) return generateQueueTrace(code)
  if (hasLinkedList) return generateLinkedListTrace(code)
  return generateSortTrace(code) // default: sorting array demo
}

// ─── Stack demo trace ─────────────────────────────────────────────────────────
function generateStackTrace(code: string): ExecutionResult {
  const lines = code.split('\n')
  const steps: any[] = []
  const stackEl: number[] = []
  const ops = [
    { op: 'push', val: 10, line: 4, desc: 'push(10) → Place 10 on top of the stack' },
    { op: 'push', val: 20, line: 5, desc: 'push(20) → Place 20 on top of the stack' },
    { op: 'push', val: 30, line: 6, desc: 'push(30) → Place 30 on top of the stack' },
    { op: 'push', val: 40, line: 7, desc: 'push(40) → Place 40 on top of the stack' },
    { op: 'peek', val: null, line: 8, desc: 'peek() → Look at top element without removing' },
    { op: 'pop',  val: null, line: 9, desc: 'pop() → Remove top element (40) from stack' },
    { op: 'pop',  val: null, line: 10, desc: 'pop() → Remove top element (30) from stack' },
    { op: 'push', val: 99, line: 11, desc: 'push(99) → Place 99 on top of the stack' },
    { op: 'pop',  val: null, line: 12, desc: 'pop() → Remove top element (99) from stack' },
  ]

  ops.forEach((op, i) => {
    if (op.op === 'push' && op.val !== null) stackEl.push(op.val)
    else if (op.op === 'pop') stackEl.pop()

    const topVal = stackEl.length > 0 ? stackEl[stackEl.length - 1] : null
    steps.push({
      stepIndex: i,
      lineNumber: op.line,
      sourceCode: lines[Math.min(op.line - 1, lines.length - 1)] ?? '',
      variables: [
        { name: 'size', type: 'int', value: stackEl.length, changed: true },
        { name: 'top', type: 'int', value: topVal, changed: op.op === 'push' || op.op === 'pop' },
        ...(op.val !== null ? [{ name: 'pushed', type: 'int', value: op.val, changed: true }] : []),
      ],
      callStack: [
        { methodName: op.op, className: 'Stack', lineNumber: op.line, variables: [] },
        { methodName: 'main', className: 'Main', lineNumber: 3, variables: [] },
      ],
      consoleOutput: op.op === 'peek' ? `Top: ${topVal}` : op.op === 'pop' ? `Popped: ${topVal ?? '?'}` : '',
      heapObjects: [],
      dataStructures: {
        arrays: [],
        stacks: [{ name: 'stack', elements: [...stackEl] }],
        queues: [],
        linkedLists: [],
      },
      event: 'line',
      description: op.desc,
    })
  })

  return buildResult(code, steps)
}

// ─── Queue demo trace ─────────────────────────────────────────────────────────
function generateQueueTrace(code: string): ExecutionResult {
  const lines = code.split('\n')
  const steps: any[] = []
  const queueEl: number[] = []
  const ops = [
    { op: 'enqueue', val: 5,  line: 4, desc: 'enqueue(5) → Person 5 joins the back of the line' },
    { op: 'enqueue', val: 12, line: 5, desc: 'enqueue(12) → Person 12 joins the back of the line' },
    { op: 'enqueue', val: 7,  line: 6, desc: 'enqueue(7) → Person 7 joins the back of the line' },
    { op: 'enqueue', val: 3,  line: 7, desc: 'enqueue(3) → Person 3 joins the back of the line' },
    { op: 'dequeue', val: null, line: 8, desc: 'dequeue() → Person at FRONT (5) leaves the queue' },
    { op: 'enqueue', val: 99, line: 9, desc: 'enqueue(99) → Person 99 joins the back of the line' },
    { op: 'dequeue', val: null, line: 10, desc: 'dequeue() → Person at FRONT (12) leaves the queue' },
    { op: 'dequeue', val: null, line: 11, desc: 'dequeue() → Person at FRONT (7) leaves the queue' },
  ]

  ops.forEach((op, i) => {
    if (op.op === 'enqueue' && op.val !== null) queueEl.push(op.val)
    else if (op.op === 'dequeue') queueEl.shift()

    steps.push({
      stepIndex: i,
      lineNumber: op.line,
      sourceCode: lines[Math.min(op.line - 1, lines.length - 1)] ?? '',
      variables: [
        { name: 'size', type: 'int', value: queueEl.length, changed: true },
        { name: 'front', type: 'int', value: queueEl[0] ?? null, changed: true },
        { name: 'rear', type: 'int', value: queueEl[queueEl.length - 1] ?? null, changed: true },
      ],
      callStack: [
        { methodName: op.op, className: 'Queue', lineNumber: op.line, variables: [] },
        { methodName: 'main', className: 'Main', lineNumber: 3, variables: [] },
      ],
      consoleOutput: op.op === 'dequeue' ? `Served: ${queueEl[0] ?? '?'}` : '',
      heapObjects: [],
      dataStructures: {
        arrays: [],
        stacks: [],
        queues: [{ name: 'queue', elements: [...queueEl] }],
        linkedLists: [],
      },
      event: 'line',
      description: op.desc,
    })
  })

  return buildResult(code, steps)
}

// ─── Linked list demo trace ───────────────────────────────────────────────────
function generateLinkedListTrace(code: string): ExecutionResult {
  const lines = code.split('\n')
  const steps: any[] = []
  const nodes: any[] = []

  const ops = [
    { op: 'addFirst', val: 30, desc: 'addFirst(30) → Insert node 30 at HEAD' },
    { op: 'addFirst', val: 20, desc: 'addFirst(20) → Insert node 20 before 30' },
    { op: 'addFirst', val: 10, desc: 'addFirst(10) → Insert node 10 at HEAD' },
    { op: 'addLast',  val: 40, desc: 'addLast(40) → Append node 40 at TAIL' },
    { op: 'addLast',  val: 50, desc: 'addLast(50) → Append node 50 at TAIL' },
    { op: 'removeFirst', val: null, desc: 'removeFirst() → Remove HEAD node (10)' },
    { op: 'addFirst', val: 99, desc: 'addFirst(99) → Insert node 99 at HEAD' },
  ]

  ops.forEach((op, i) => {
    if (op.op === 'addFirst' && op.val !== null) {
      nodes.unshift({ id: `n-${op.val}-${i}`, value: op.val, next: nodes.length > 0 ? nodes[0].id : null })
    } else if (op.op === 'addLast' && op.val !== null) {
      const newNode = { id: `n-${op.val}-${i}`, value: op.val, next: null }
      if (nodes.length > 0) nodes[nodes.length - 1].next = newNode.id
      nodes.push(newNode)
    } else if (op.op === 'removeFirst') {
      nodes.shift()
      if (nodes.length > 0) nodes[0].next = nodes.length > 1 ? nodes[1].id : null
    }

    const lineNum = Math.min(i + 4, lines.length)
    steps.push({
      stepIndex: i,
      lineNumber: lineNum,
      sourceCode: lines[Math.min(lineNum - 1, lines.length - 1)] ?? '',
      variables: [
        { name: 'size', type: 'int', value: nodes.length, changed: true },
        { name: 'head', type: 'Node', value: nodes[0]?.value ?? null, changed: true },
        { name: 'tail', type: 'Node', value: nodes[nodes.length - 1]?.value ?? null, changed: true },
      ],
      callStack: [
        { methodName: op.op, className: 'LinkedList', lineNumber: lineNum, variables: [] },
        { methodName: 'main', className: 'Main', lineNumber: 3, variables: [] },
      ],
      consoleOutput: '',
      heapObjects: [],
      dataStructures: {
        arrays: [],
        stacks: [],
        queues: [],
        linkedLists: [{
          name: 'list',
          nodes: nodes.map(n => ({ id: n.id, value: n.value, next: n.next })),
          headId: nodes[0]?.id ?? null,
        }],
      },
      event: 'line',
      description: op.desc,
    })
  })

  return buildResult(code, steps)
}

// ─── Sorting array demo (default) ─────────────────────────────────────────────
function generateSortTrace(code: string): ExecutionResult {
  const lines = code.split('\n')
  const steps: any[] = []
  const arr = [64, 34, 25, 12, 22, 11, 90]
  let consoleOutput = ''

  const arrCopy = [...arr]
  let stepIdx = 0

  for (let i = 0; i < arrCopy.length - 1; i++) {
    for (let j = 0; j < arrCopy.length - i - 1; j++) {
      const comparing = `Comparing arr[${j}]=${arrCopy[j]} and arr[${j+1}]=${arrCopy[j+1]}`
      steps.push({
        stepIndex: stepIdx++,
        lineNumber: 9,
        sourceCode: `if (arr[j] > arr[j + 1])`,
        variables: [
          { name: 'i', type: 'int', value: i, changed: false },
          { name: 'j', type: 'int', value: j, changed: true },
          { name: 'arr[j]', type: 'int', value: arrCopy[j], changed: false },
          { name: 'arr[j+1]', type: 'int', value: arrCopy[j + 1], changed: false },
        ],
        callStack: [
          { methodName: 'bubbleSort', className: 'Main', lineNumber: 9, variables: [] },
          { methodName: 'main', className: 'Main', lineNumber: 5, variables: [] },
        ],
        consoleOutput,
        heapObjects: [],
        dataStructures: {
          arrays: [{ name: 'arr', elements: [...arrCopy], highlightIndex: j }],
          stacks: [], queues: [], linkedLists: [],
        },
        event: 'line',
        description: comparing,
      })

      if (arrCopy[j] > arrCopy[j + 1]) {
        const tmp = arrCopy[j]; arrCopy[j] = arrCopy[j + 1]; arrCopy[j + 1] = tmp
        steps.push({
          stepIndex: stepIdx++,
          lineNumber: 11,
          sourceCode: `int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;`,
          variables: [
            { name: 'i', type: 'int', value: i, changed: false },
            { name: 'j', type: 'int', value: j, changed: false },
            { name: 'temp', type: 'int', value: arrCopy[j + 1], changed: true },
          ],
          callStack: [
            { methodName: 'bubbleSort', className: 'Main', lineNumber: 11, variables: [] },
            { methodName: 'main', className: 'Main', lineNumber: 5, variables: [] },
          ],
          consoleOutput,
          heapObjects: [],
          dataStructures: {
            arrays: [{ name: 'arr', elements: [...arrCopy], highlightIndex: j }],
            stacks: [], queues: [], linkedLists: [],
          },
          event: 'line',
          description: `⚡ Swapped! arr[${j}] ↔ arr[${j+1}]`,
        })
      }
    }
  }

  consoleOutput = `[${arrCopy.join(', ')}]`
  steps.push({
    stepIndex: stepIdx,
    lineNumber: 5,
    sourceCode: `System.out.println(Arrays.toString(arr));`,
    variables: [{ name: 'arr', type: 'int[]', value: consoleOutput, changed: true }],
    callStack: [{ methodName: 'main', className: 'Main', lineNumber: 5, variables: [] }],
    consoleOutput,
    heapObjects: [],
    dataStructures: {
      arrays: [{ name: 'arr', elements: [...arrCopy] }],
      stacks: [], queues: [], linkedLists: [],
    },
    event: 'stdout',
    description: `✅ Sort complete! Result: ${consoleOutput}`,
  })

  return buildResult(code, steps)
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildResult(code: string, steps: any[]): ExecutionResult {
  return {
    trace: {
      id: crypto.randomUUID(),
      sourceCode: code,
      steps,
      totalSteps: steps.length,
      hasError: false,
      executionTimeMs: Math.floor(Math.random() * 50) + 20,
    },
    output: steps[steps.length - 1]?.consoleOutput ?? '',
  }
}
