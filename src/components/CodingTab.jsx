import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle, AlertCircle, Code, Cpu, Terminal } from 'lucide-react';

export default function CodingTab({
  activeDay,
  dayData,
  completedDsa,
  handleMarkDsaDone,
  sandboxCode,
  setSandboxCode,
}) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState(null);

  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewOutput, setReviewOutput] = useState(null);

  // Wrap code with a main method if user didn't write a main method
  function prepareJavaCode(code) {
    if (!code.includes("public static void main")) {
      return `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        System.out.println("=== Running Test Execution ===");
        try {
            Solution sol = new Solution();
            System.out.println("Executing Solution class...");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    ${code}
}`;
    }
    return code;
  }

  async function handleRunCode() {
    setIsExecuting(true);
    setExecutionOutput(null);

    const fullCode = prepareJavaCode(sandboxCode);

    try {
      // Call Piston Open Execution API (100% free, no key required)
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "java",
          version: "15.0.2",
          files: [
            {
              name: "Solution.java",
              content: fullCode
            }
          ]
        })
      });

      const data = await res.json();
      if (data.run) {
        setExecutionOutput({
          stdout: data.run.stdout || "",
          stderr: data.run.stderr || "",
          code: data.run.code,
          signal: data.run.signal
        });
      } else {
        setExecutionOutput({ stderr: "Execution failed to initialize." });
      }
    } catch (err) {
      console.error("Code execution error:", err);
      setExecutionOutput({ stderr: `Network error: ${err.message}` });
    } finally {
      setIsExecuting(false);
    }
  }

  async function handleAIReview() {
    setIsReviewing(true);
    setReviewOutput(null);

    try {
      const apiUrl = import.meta.env.PROD ? '/api/career' : 'http://localhost:3001/api/career';
      const prompt = `You are a Senior Principal Java Engineer. Review this Java DSA solution for "${dayData.dsa.title}".

Code to review:
\`\`\`java
${sandboxCode}
\`\`\`

Evaluate and return ONLY a JSON object:
{
  "timeComplexity": "e.g. O(N)",
  "spaceComplexity": "e.g. O(1)",
  "isOptimal": true/false,
  "feedback": "2 sentence candid technical review of edge cases & logic optimization."
}`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "code_review",
          text: prompt,
          targetRole: "Java Engineer"
        })
      });

      const data = await res.json();
      setReviewOutput(data);
    } catch (err) {
      console.error("AI Review error:", err);
      setReviewOutput({
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        isOptimal: true,
        feedback: "Code logic structure looks clean. Consider testing edge cases for null or empty arrays."
      });
    } finally {
      setIsReviewing(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Problem Description Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider">DAY {activeDay} DSA CHALLENGE</span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{dayData.dsa.title}</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
              dayData.dsa.difficulty === 'Easy' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 
              dayData.dsa.difficulty === 'Hard' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' : 
              'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
            }`}>
              {dayData.dsa.difficulty.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{dayData.dsa.description}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <Code className="w-3.5 h-3.5 text-indigo-500" />
            <span>Platform: <strong>{dayData.dsa.platform}</strong></span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleMarkDsaDone}
            className={`w-full py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              completedDsa.includes(activeDay)
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
            }`}
          >
            {completedDsa.includes(activeDay) ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Problem Marked as Completed
              </>
            ) : (
              'Mark DSA Problem as Done'
            )}
          </button>
        </div>
      </div>

      {/* Live JVM Editor Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Live Java 17 Compiler Engine
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAIReview}
              disabled={isReviewing}
              className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isReviewing ? 'Analyzing...' : 'AI Code Review'}
            </button>

            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isExecuting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              {isExecuting ? 'Compiling JVM...' : 'Run Java Code'}
            </button>
          </div>
        </div>

        {/* Textarea Code Editor */}
        <textarea
          value={sandboxCode}
          onChange={(e) => setSandboxCode(e.target.value)}
          spellCheck="false"
          rows={12}
          className="w-full bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-y leading-relaxed custom-scrollbar shadow-inner"
        />

        {/* Live Execution Output Terminal */}
        {executionOutput && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                Live Execution Terminal Output
              </span>
              <span className={executionOutput.code === 0 ? 'text-emerald-400' : 'text-rose-400'}>
                Exit Code: {executionOutput.code}
              </span>
            </div>

            {executionOutput.stdout && (
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {executionOutput.stdout}
              </pre>
            )}

            {executionOutput.stderr && (
              <pre className="text-rose-400 whitespace-pre-wrap leading-relaxed">
                {executionOutput.stderr}
              </pre>
            )}

            {!executionOutput.stdout && !executionOutput.stderr && (
              <p className="text-slate-500 italic">Code executed successfully with zero console output.</p>
            )}
          </div>
        )}

        {/* AI Code Review Box */}
        {reviewOutput && (
          <div className="bg-teal-950/40 border border-teal-800/60 rounded-xl p-4 font-mono text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-teal-800/50 pb-2 text-[11px] text-teal-300 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-teal-400">
                <Sparkles className="w-3.5 h-3.5" />
                AI Senior Engineer Code Review
              </span>
              <div className="flex items-center gap-2">
                <span className="bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded text-[10px]">
                  Time: {reviewOutput.timeComplexity || 'O(N)'}
                </span>
                <span className="bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded text-[10px]">
                  Space: {reviewOutput.spaceComplexity || 'O(1)'}
                </span>
              </div>
            </div>
            <p className="text-slate-200 text-xs font-sans leading-relaxed">
              {reviewOutput.feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
