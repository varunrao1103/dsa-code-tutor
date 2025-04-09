import streamlit as st
from streamlit_ace import st_ace
import subprocess
from llm import get_full_feedback_with_hints, extract_hints, get_optimal_solution

st.set_page_config(page_title="DSA Code Tutor", layout="wide")
st.title("👨‍💻 DSA Code Tutor with AI")

# STEP 1: Problem Selection
st.header("1. Enter or Select a DSA Problem")

with st.expander("🕵️ Sample Problems"):
    problems = {
        "Maximum Product Subarray": '''Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product...''',
        "Longest Palindromic Substring": '''Given a string s, return the longest palindromic substring in s...''',
        "Largest Rectangle in Histogram": '''Given an array of integers heights representing the histogram's bar height...''',
        "Sliding Window Maximum": '''You are given an array of integers nums, and a sliding window size k...''',
        "Binary Tree Maximum Path Sum": '''Given a non-empty binary tree, find the maximum path sum...''',
        "Word Ladder II": '''Given two words, beginWord and endWord, and a dictionary wordList...''',
        "Edit Distance": '''Given two strings word1 and word2, return the minimum number of operations...''',
        "Jump Game II": '''Given an array of non-negative integers nums...''',
        "N-Queens": '''The n-queens puzzle is the problem of placing n queens on an n×n chessboard...'''
    }

    options = ["Select from the list"] + list(problems.keys())
    selected = st.selectbox("Choose a problem", options)

    if selected != "Select from the list":
        st.session_state['problem'] = problems[selected]

# STEP 2: Code Editor
problem = st.text_area("✍️ Write Your Own Problem or Use a Sample", value=st.session_state.get('problem', ''), height=150)
st.header("2. Write Your Code")
theme = st.selectbox("Editor Theme", ["monokai", "github", "solarized_dark", "dracula"], index=0)
font_size = st.slider("Font Size", 12, 24, 14)
show_gutter = st.checkbox("Show Line Numbers", value=True)
code = st_ace(language="python", theme=theme, font_size=font_size, show_gutter=show_gutter, key="editor")

# STEP 3: Run Code
st.subheader("🔁 Run Your Code")
if st.button("Run Code"):
    if not code:
        st.warning("Please write some code first!")
    else:
        try:
            with open("temp_code.py", "w") as f:
                f.write(code)
            result = subprocess.run(["python", "temp_code.py"], capture_output=True, text=True)
            st.text_area("📄 Output", value=result.stdout if result.stdout else "(No output)", height=200)
            if result.stderr:
                st.error(result.stderr)
        except Exception as e:
            st.error(f"Execution Error: {e}")

# STEP 4: AI Tutor Feedback
st.header("3. Get AI Feedback & Hints")

# Initialize session state variables
if "show_level_2" not in st.session_state:
    st.session_state["show_level_2"] = False
if "show_level_3" not in st.session_state:
    st.session_state["show_level_3"] = False
if "hints" not in st.session_state:
    st.session_state["hints"] = []

if st.button("🔍 Analyze Code with AI Tutor"):
    if not problem.strip() or not code.strip():
        st.warning("Please provide both a problem and code.")
    else:
        with st.spinner("Analyzing your code..."):
            feedback = get_full_feedback_with_hints(problem, code)
            hints = extract_hints(feedback)
            st.session_state["hints"] = hints
            st.session_state["show_level_2"] = False
            st.session_state["show_level_3"] = False

# Show feedback only if analyzed
if "analyzed" in st.session_state and st.session_state["analyzed"]:
    hints = st.session_state.get("hints", [])
    if hints:
        st.markdown("### 📋 Tutor Feedback")
        st.markdown(f"**Level 1 Hint:**\n{hints[0]}")

        if len(hints) > 1:
            if st.button("Show Level 2 Hint"):
                st.session_state["show_level_2"] = True
            if st.session_state["show_level_2"]:
                st.markdown(f"**Level 2 Hint:**\n{hints[1]}")

        if len(hints) > 2:
            if st.button("Show Level 3 Hint"):
                st.session_state["show_level_3"] = True
            if st.session_state["show_level_3"]:
                st.markdown(f"**Level 3 Hint:**\n{hints[2]}")
    else:
        st.success("✅ Looks good! No hints required.")


# STEP 5: Optional Solution
st.header("4. See Optimal Solution")
if st.button("📘 Show Optimal Solution"):
    if not problem.strip():
        st.warning("Please provide a problem description.")
    else:
        with st.spinner("Generating optimal solution..."):
            solution = get_optimal_solution(problem)
        st.text_area("Optimal Solution", value=solution, height=300)
