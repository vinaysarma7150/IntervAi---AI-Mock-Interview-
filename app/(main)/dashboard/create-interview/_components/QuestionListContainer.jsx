import React from 'react'

function QuestionListContainer({ questionList }) {
  return (
    <div className="space-y-3">
      {questionList.map((item, index) => (
        <div
          key={index}
          className="flex gap-4 rounded-2xl border border-border bg-muted/40 p-4 dark:border-white/8 dark:bg-[#11203a]/82"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {index + 1}
          </div>

          <div className="space-y-2">
            <p className="text-sm leading-6 text-card-foreground">{item.question}</p>
            {Array.isArray(item.type) && item.type.length > 0 && (
              <p className="text-xs font-medium text-blue-600 dark:text-blue-300">
                {item.type.join(', ')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuestionListContainer
