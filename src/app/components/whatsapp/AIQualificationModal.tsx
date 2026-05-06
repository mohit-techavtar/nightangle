import React, { useState } from "react";
import { X, Bot, CheckCircle, ChevronRight } from "lucide-react";
import { AIQualificationQuestion } from "../../hooks/useLeads";

interface AIQualificationModalProps {
  questions: AIQualificationQuestion[];
  onSubmit: (answers: Record<string, string>) => void;
  onClose: () => void;
}

export function AIQualificationModal({
  questions,
  onSubmit,
  onClose
}: AIQualificationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
  const currentQuestion = sortedQuestions[currentStep];
  const isLastQuestion = currentStep === sortedQuestions.length - 1;
  const canProceed = answers[currentQuestion?.field] || !currentQuestion?.required;

  const handleAnswer = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit(answers);
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (!currentQuestion.required) {
      if (isLastQuestion) {
        onSubmit(answers);
        onClose();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0F1B2D]">AI Lead Qualification</h3>
              <p className="text-xs text-[#64748B]">
                Question {currentStep + 1} of {sortedQuestions.length}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#25D366] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / sortedQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-[#0F1B2D] mb-2">
              {currentQuestion.question}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </h4>
          </div>

          {/* Answer Input */}
          <div className="space-y-3">
            {currentQuestion.type === "choice" && currentQuestion.options ? (
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion.field, option)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      answers[currentQuestion.field] === option
                        ? "border-[#25D366] bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#0F1B2D]">{option}</span>
                      {answers[currentQuestion.field] === option && (
                        <CheckCircle size={20} className="text-[#25D366]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : currentQuestion.type === "text" ? (
              <textarea
                value={answers[currentQuestion.field] || ""}
                onChange={(e) => handleAnswer(currentQuestion.field, e.target.value)}
                placeholder="Type your answer here..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent resize-none"
              />
            ) : currentQuestion.type === "number" ? (
              <input
                type="number"
                value={answers[currentQuestion.field] || ""}
                onChange={(e) => handleAnswer(currentQuestion.field, e.target.value)}
                placeholder="Enter a number"
                className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
              />
            ) : currentQuestion.type === "boolean" ? (
              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswer(currentQuestion.field, "yes")}
                  className={`flex-1 h-11 rounded-lg border-2 text-sm font-medium transition-all ${
                    answers[currentQuestion.field] === "yes"
                      ? "border-[#25D366] bg-green-50 text-[#25D366]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(currentQuestion.field, "no")}
                  className={`flex-1 h-11 rounded-lg border-2 text-sm font-medium transition-all ${
                    answers[currentQuestion.field] === "no"
                      ? "border-[#25D366] bg-green-50 text-[#25D366]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  No
                </button>
              </div>
            ) : null}
          </div>

          {/* Answered Questions Summary */}
          {Object.keys(answers).length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-[#64748B] mb-2">Your Answers:</p>
              <div className="space-y-1">
                {sortedQuestions.slice(0, currentStep + 1).map((q) => {
                  if (!answers[q.field]) return null;
                  return (
                    <div key={q.id} className="text-xs text-[#0F1B2D]">
                      <span className="font-medium">{q.question}</span>
                      <span className="text-[#64748B]"> → {answers[q.field]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-4 h-10 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            {!currentQuestion.required && (
              <button
                onClick={handleSkip}
                className="px-4 h-10 rounded-lg text-sm font-medium text-[#64748B] hover:text-[#0F1B2D] transition-colors"
              >
                Skip
              </button>
            )}
          </div>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 h-10 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLastQuestion ? "Complete Qualification" : "Next"}
            {!isLastQuestion && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
