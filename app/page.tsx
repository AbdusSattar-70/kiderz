"use client";

import { FC, JSX, useEffect, useRef, useState, useMemo } from "react";
import { Nunito, Poppins } from "next/font/google";
import { Chart } from "chart.js/auto";
import {
  FaFlask,
  FaRocket,
  FaHistory,
  FaGlobe,
  FaBook,
  FaPaintBrush,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaGooglePlay,
  FaApple,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaRedo,
  FaHome,
} from "react-icons/fa";
import { MdClose, MdMenu } from "react-icons/md";
import { categories } from "@/lib/mock-data";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Define category
const categoryBgClasses = {
  science: "bg-[#68A063]/10",
  technology: "bg-[#61DAFB]/10",
  history: "bg-[#E34F26]/10",
  geography: "bg-[#DD0031]/10",
  literature: "bg-[#264DE4]/10",
  arts: "bg-[#F7DF1E]/10",
} as const;

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuizResult = {
  category: string;
  score: number;
  totalQuestions: number;
};

const getCategoryDisplayName = (cat: string) => {
  switch (cat) {
    case "science":
      return "Science";
    case "technology":
      return "Technology";
    case "history":
      return "History";
    case "geography":
      return "Geography";
    case "literature":
      return "Literature";
    case "arts":
      return "Arts";
    default:
      return cat.charAt(0).toUpperCase() + cat.slice(1);
  }
};

// Navbar Component
const Navbar: FC<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-md border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all duration-300">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Toggle sidebar</span>
              {isSidebarOpen ? (
                <MdClose className="h-6 w-6" />
              ) : (
                <MdMenu className="h-6 w-6" />
              )}
            </button>
            <a href="#" className="flex ms-2 md:me-24 items-center">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center mr-3 shadow-lg">
                <FaBook className="text-white text-xl" />
              </div>
              <div>
                <span
                  className={`self-center text-xl font-bold sm:text-2xl whitespace-nowrap dark:text-white ${poppins.className}`}
                >
                  Kid<span className="text-purple-600">erZ</span>
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Fun Learning for Kids
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Sidebar Component
const Sidebar: FC<{
  category: string;
  setCategory: (cat: string) => void;
  isSidebarOpen: boolean;
  getCategoryIcon: (cat: string) => JSX.Element | null;
  totalQuizzes: number;
  avgScore: number;
  bestCategory: string;
}> = ({
  category,
  setCategory,
  isSidebarOpen,
  getCategoryIcon,
  totalQuizzes,
  avgScore,
  bestCategory,
}) => {
  return (
    <>
      <aside
        id="logo-sidebar"
        className={`${
          nunito.className
        } fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 scrollable backdrop-blur-2xl bg-white dark:bg-gray-900">
          <div className="pt-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center shadow-lg">
                <FaBook className="text-white text-xl" />
              </div>
            </div>
            <div className="flex flex-col items-center mt-4">
              <h3
                className={`font-bold text-lg dark:text-white ${poppins.className}`}
              >
                Kid<span className="text-purple-600">erZ</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fun Learning for Kids
              </p>
            </div>
          </div>
          <div className="py-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
              Categories
            </h3>
            <ul className="space-y-2">
              {[
                "science",
                "technology",
                "history",
                "geography",
                "literature",
                "arts",
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 relative overflow-hidden cursor-pointer
                    ${
                      category === cat
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {category === cat && (
                      <span className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-sm" />
                    )}
                    <div className="ml-4 flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      {getCategoryIcon(cat)}
                      <div className="flex flex-col text-left">
                        <span className="font-medium">
                          {getCategoryDisplayName(cat)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          5 questions
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
              Your Stats
            </h3>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Quizzes
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {totalQuizzes}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Score
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {avgScore}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Best Category
                </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {bestCategory === "N/A"
                    ? "N/A"
                    : getCategoryDisplayName(bestCategory)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// QuizQuestion Component
const QuizQuestion: FC<{
  question: Question;
  selectedAnswer: string | null;
  handleAnswerSelect: (answer: string) => void;
  timeLeft: number;
  score: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  category: string;
  getCategoryIcon: (cat: string) => JSX.Element | null;
}> = ({
  question,
  selectedAnswer,
  handleAnswerSelect,
  timeLeft,
  score,
  currentQuestionIndex,
  totalQuestions,
  category,
  getCategoryIcon,
}) => {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 mb-2 relative overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-thin text-gray-700 dark:text-gray-300">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-xs font-thin text-gray-700 dark:text-gray-300">
              {Math.round((currentQuestionIndex / totalQuestions) * 100)}%
              Complete
            </span>
          </div>
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-1 bg-gradient-to-r from-red-600 to-red-800"
              style={{
                width: `${(currentQuestionIndex / totalQuestions) * 100}%`,
                transition: "width 0.5s",
              }}
            ></div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <FaClock className="mr-2" />
            {timeLeft}s
          </div>

          <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {getCategoryIcon(category)}
            Score
            <span className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
              {score}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 mb-2 relative overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="absolute top-0 right-0 h-10 w-10 flex items-center justify-center rounded-bl-2xl bg-[#FFECEC]">
            {getCategoryIcon(category)}
          </div>
          <h2
            className={`text-lg font-semibold mb-2 text-gray-800 dark:text-white pr-4 ${poppins.className}`}
          >
            {question.question}
          </h2>
        </div>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
              className={`w-full text-left cursor-pointer p-2 rounded-lg transition-all duration-200 flex items-center ${
                selectedAnswer === option
                  ? option === question.correctAnswer
                    ? "bg-green-100 border-2 border-green-500 text-green-700"
                    : "bg-red-100 border-2 border-red-500 text-red-700"
                  : "bg-gray-100 border-2 border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              }`}
              style={{ transform: "scale(1)", transition: "transform 0.2s" }}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 font-bold ${
                      selectedAnswer === option
                        ? option === question.correctAnswer
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </div>
              {selectedAnswer === option && (
                <div className="ml-2">
                  {option === question.correctAnswer ? (
                    <FaCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-xl" />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
        {selectedAnswer && (
          <div className="mt-6 p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <div className="flex items-center">
              {selectedAnswer === question.correctAnswer ? (
                <FaCheckCircle className="text-2xl mr-3 text-green-500" />
              ) : (
                <FaTimesCircle className="text-2xl mr-3 text-red-500" />
              )}
              <div>
                <p className="font-bold">
                  {selectedAnswer === question.correctAnswer
                    ? "Correct!"
                    : "Not quite!"}
                </p>
                {selectedAnswer !== question.correctAnswer && (
                  <p>The correct answer is "{question.correctAnswer}".</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// QuizEnded Component
const QuizEnded: FC<{
  score: number;
  totalQuestions: number;
  category: string;
  getCategoryIcon: (cat: string) => JSX.Element | null;
  onTryAgain: () => void;
  onGoHome: () => void;
}> = ({ score, totalQuestions, onTryAgain, onGoHome }) => {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = document.getElementById("scoreChart") as HTMLCanvasElement;
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Correct", "Incorrect"],
          datasets: [
            {
              data: [score, totalQuestions - score],
              backgroundColor: ["#4CAF50", "#F44336"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [score, totalQuestions]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-2 px-2 md:p-2 rounded-xl shadow-md mt-2">
      <div className="max-w-3xl mx-auto">
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
          style={{ animation: "fadeIn 0.5s ease-in-out" }}
        >
          <div className="text-center mb-2">
            <h2
              className="text-3xl font-bold text-gray-800 dark:text-white"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Quiz Completed!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Great job! Keep learning and having fun!
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Score Section */}
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Your Score
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-300">
                    Correct Answers:
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {score}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-300">
                    Incorrect Answers:
                  </span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {totalQuestions - score}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-300">
                    Total Questions:
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {totalQuestions}
                  </span>
                </div>
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                  <div
                    className="h-1 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{
                      width: `${(score / totalQuestions) * 100}%`,
                      transition: "width 1s ease-in-out",
                    }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-800 dark:text-white">
                    {Math.round((score / totalQuestions) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            {/* Performance Section */}
            <div className="md:w-1/2 md:pl-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 h-full flex flex-col">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Performance
                </h3>
                <div className="flex-1 flex items-center justify-center">
                  <canvas
                    id="scoreChart"
                    width="320"
                    height="320"
                    style={{
                      display: "block",
                      boxSizing: "border-box",
                      height: "320px",
                      width: "320px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <button
              onClick={onTryAgain}
              className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 bg-purple-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-purple-700 transition-all duration-200"
            >
              <FaRedo className="text-sm" />
              Try Again
            </button>
            <button
              onClick={onGoHome}
              className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold text-sm rounded-lg shadow-md hover:bg-gray-300 transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <FaHome className="text-sm" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer: FC = () => {
  return (
    <footer className="w-full mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-6 md:mb-0">
          <h3
            className={`text-2xl font-bold mb-2 text-gray-800 dark:text-white ${poppins.className}`}
          >
            Kid<span className="text-purple-600">erZ</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-md">
            Explore and learn with our fun quizzes designed for kids!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="#"
            className="flex items-center bg-black text-white p-3 rounded-xl hover:bg-gray-900 transition-colors duration-200"
          >
            <FaGooglePlay className="mr-3 text-xl" />
            <div>
              <p className="text-xs text-gray-400">Download on</p>
              <p className="font-semibold">Google Play</p>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center bg-black text-white p-3 rounded-xl hover:bg-gray-900 transition-colors duration-200"
          >
            <FaApple className="mr-3 text-xl" />
            <div>
              <p className="text-xs text-gray-400">Download on</p>
              <p className="font-semibold">App Store</p>
            </div>
          </a>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex flex-wrap space-x-6 mb-4 md:mb-0">
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Terms
            </a>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <FaTwitter className="text-xl" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <FaGithub className="text-xl" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <FaLinkedin className="text-xl" />
            </a>
          </div>
        </div>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
          © Kid<span className="text-purple-600">erZ</span>, 2025. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

// App Component
const App: FC = () => {
  const [category, setCategory] = useState<string>("science");
  const [questions, setQuestions] = useState<Question[]>(categories["science"]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [quizEnded, setQuizEnded] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  // Compute stats
  const totalQuizzes = quizResults.length;

  const avgScore = useMemo(() => {
    if (quizResults.length === 0) return 0;
    const totalPercentage = quizResults.reduce(
      (sum, result) => sum + (result.score / result.totalQuestions) * 100,
      0
    );
    return Math.round(totalPercentage / quizResults.length);
  }, [quizResults]);

  const bestCategory = useMemo(() => {
    if (quizResults.length === 0) return "N/A";
    const categoryStats = quizResults.reduce((map, result) => {
      const percentage = (result.score / result.totalQuestions) * 100;
      if (!map.has(result.category)) {
        map.set(result.category, { sum: percentage, count: 1 });
      } else {
        const current = map.get(result.category)!;
        map.set(result.category, {
          sum: current.sum + percentage,
          count: current.count + 1,
        });
      }
      return map;
    }, new Map<string, { sum: number; count: number }>());
    let bestCat = "N/A";
    let maxAvg = -1;
    categoryStats.forEach((stats, cat) => {
      const avg = stats.sum / stats.count;
      if (avg > maxAvg) {
        maxAvg = avg;
        bestCat = cat;
      }
    });
    return bestCat;
  }, [quizResults]);

  // Update questions when category changes
  useEffect(() => {
    setQuestions(categories[category as keyof typeof categories]);
    setCurrentQuestion(0);
    setScore(0);
    setQuizEnded(false);
    setTimeLeft(30);
    setSelectedAnswer(null);
  }, [category]);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !quizEnded && !selectedAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, quizEnded, selectedAnswer]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      setQuizEnded(true);
      setQuizResults((prev) => [
        ...prev,
        { category, score, totalQuestions: questions.length },
      ]);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizEnded(false);
    setTimeLeft(30);
    setSelectedAnswer(null);
  };

  const handleGoHome = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizEnded(false);
    setTimeLeft(30);
    setSelectedAnswer(null);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "science":
        return (
          <FaFlask className="w-4 h-4 mr-2 text-center text-lg text-[#68A063]" />
        );
      case "technology":
        return (
          <FaRocket className="w-4 h-4 mr-2 text-center text-lg text-[#61DAFB]" />
        );
      case "history":
        return (
          <FaHistory className="w-4 h-4 mr-2 text-center text-lg text-[#E34F26]" />
        );
      case "geography":
        return (
          <FaGlobe className="w-4 h-4 mr-2 text-center text-lg text-[#DD0031]" />
        );
      case "literature":
        return (
          <FaBook className="w-4 h-4 mr-2 text-center text-lg text-[#264DE4]" />
        );
      case "arts":
        return (
          <FaPaintBrush className="w-4 h-4 mr-2 text-center text-lg text-[#F7DF1E]" />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <main
        className={`${nunito.className} h-screen pt-18 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800`}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Sidebar
          category={category}
          setCategory={setCategory}
          isSidebarOpen={isSidebarOpen}
          getCategoryIcon={getCategoryIcon}
          totalQuizzes={totalQuizzes}
          avgScore={avgScore}
          bestCategory={bestCategory}
        />
        {/* main content area */}
        <div className="h-full p-3 scrollable sm:ml-64 transition-all duration-300">
          <div className="max-w-3xl mx-auto">
            {!quizEnded ? (
              <QuizQuestion
                question={questions[currentQuestion]}
                selectedAnswer={selectedAnswer}
                handleAnswerSelect={handleAnswerSelect}
                timeLeft={timeLeft}
                score={score}
                currentQuestionIndex={currentQuestion}
                totalQuestions={questions.length}
                category={category}
                getCategoryIcon={getCategoryIcon}
              />
            ) : (
              <QuizEnded
                score={score}
                totalQuestions={questions.length}
                category={category}
                getCategoryIcon={getCategoryIcon}
                onTryAgain={handleTryAgain}
                onGoHome={handleGoHome}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
