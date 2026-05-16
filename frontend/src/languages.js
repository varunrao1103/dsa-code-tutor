// Each entry: { id, label, monaco, defaultCode }
// monaco → Monaco Editor language id

export const LANGUAGES = [
  {
    id: 'python',
    label: 'Python',
    monaco: 'python',
    defaultCode: `def solution():
    # write your solution here
    pass

solution()
`,
  },
  {
    id: 'java',
    label: 'Java',
    monaco: 'java',
    defaultCode: `public class Main {
    public static void solution() {
        // write your solution here
    }

    public static void main(String[] args) {
        solution();
    }
}
`,
  },
]

export const DEFAULT_LANGUAGE = LANGUAGES[0]
