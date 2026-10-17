import { ExecutionResult } from '@/types'

// ─── Mock trace generator ─────────────────────────────────────────────────────
// Used when backend is unavailable — generates a realistic demo trace
// from the provided source code so the UI is fully functional locally.

function generateMockTrace(code: string): ExecutionResult {
  const lines = code.split('\n')
  const steps: any[] = []
  let stepIdx = 0
  let consoleOutput = ''

  // Detect if it's a bubble sort
  const isBubbleSort = code.includes('bubbleSort') || (code.includes('arr[j]') && code.includes('arr[j+1]'))
  const arr = isBubbleSort ? [64, 34, 25, 12, 22, 11, 90] : [5, 3, 8, 1, 9, 2]

  // Simulate sorting steps
  const arrCopy = [...arr]
  const sortSteps: { arr: number[]; i: number; j: number; swapped: boolean; line: number }[] = []

  for (let i = 0; i < arrCopy.length - 1; i++) {
    for (let j = 0; j < arrCopy.length - i - 1; j++) {
      const swapped = arrCopy[j] > arrCopy[j + 1]
      sortSteps.push({ arr: [...arrCopy], i, j, swapped, line: 0 })
      if (swapped) {
        const tmp = arrCopy[j]; arrCopy[j] = arrCopy[j + 1]; arrCopy[j + 1] = tmp
      }
    }
  }
  sortSteps.push({ arr: [...arrCopy], i: arrCopy.length, j: -1, swapped: false, line: 0 })
  consoleOutput = JSON.stringify(arrCopy).replace(/,/g, ', ')

  // Map sort steps to trace steps
  const relevantLines = lines
    .map((l, i) => ({ line: l.trim(), lineNum: i + 1 }))
    .filter(({ line }) =>
      line && !line.startsWith('//') && !line.startsWith('import') &&
      !line.startsWith('public class') && line !== '{' && line !== '}'
    )

  sortSteps.forEach((sortStep, si) => {
    const lineEntry = relevantLines[si % relevantLines.length]
    const lineNum = lineEntry?.lineNum ?? 1
    const lineCode = lineEntry?.line ?? ''

    const isCompare = lineCode.includes('arr[j]')
    const isSwap = lineCode.includes('temp') || lineCode.includes('arr[j] =')
    const isPrint = lineCode.includes('System.out')

    steps.push({
      stepIndex: stepIdx++,
      lineNumber: lineNum,
      sourceCode: lineCode,
      variables: [
        { name: 'i', type: 'int', value: sortStep.i, changed: si === 0 || sortSteps[si - 1]?.i !== sortStep.i },
        { name: 'j', type: 'int', value: Math.max(0, sortStep.j), changed: true },
        ...(isSwap ? [{ name: 'temp', type: 'int', value: sortStep.arr[sortStep.j] ?? 0, changed: true }] : []),
      ],
      callStack: [
        { methodName: 'bubbleSort', className: 'Main', lineNumber: lineNum, variables: [] },
        { methodName: 'main', className: 'Main', lineNumber: 6, variables: [] },
      ],
      consoleOutput: isPrint ? consoleOutput : '',
      heapObjects: [],
      dataStructures: {
        arrays: [{
          name: 'arr',
          elements: sortStep.arr,
          highlightIndex: sortStep.j >= 0 ? sortStep.j : undefined,
        }],
        stacks: [],
        queues: [],
        linkedLists: [],
      },
      event: isPrint ? 'stdout' : isSwap ? 'line' : 'line',
      description: isPrint
        ? `Printing result: [${sortStep.arr.join(', ')}]`
        : isCompare && sortStep.swapped
        ? `arr[${sortStep.j}]=${sortStep.arr[sortStep.j]} > arr[${sortStep.j + 1}]=${sortStep.arr[sortStep.j + 1]} → swapping`
        : isCompare
        ? `Comparing arr[${sortStep.j}] and arr[${sortStep.j + 1}] — no swap needed`
        : `Loop iteration: i=${sortStep.i}, j=${Math.max(0, sortStep.j)}`,
    })
  })

  const trace = {
    id: crypto.randomUUID(),
    sourceCode: code,
    steps,
    totalSteps: steps.length,
    hasError: false,
    executionTimeMs: 42,
  }

  return { trace, output: consoleOutput }
}

export const mockExecuteCode = async (code: string): Promise<ExecutionResult> => {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 800))
  return generateMockTrace(code)
}
