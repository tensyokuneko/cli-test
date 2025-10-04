"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Trash2 } from "lucide-react"
import { getAllLogs, deleteLog, clearAllLogs, type DailyLog } from "@/lib/log-storage"

export default function LogHistory() {
  const [logs, setLogs] = useState<DailyLog[]>([])

  useEffect(() => {
    setLogs(getAllLogs())
  }, [])

  const refreshLogs = () => {
    setLogs(getAllLogs())
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}時間${mins}分`
    }
    return `${mins}分`
  }

  const handleDeleteLog = (date: string) => {
    if (confirm(`${date}の記録を削除しますか?`)) {
      deleteLog(date)
      refreshLogs()
    }
  }

  const handleClearAll = () => {
    if (confirm("全ての記録を削除しますか?\nこの操作は取り消せません。")) {
      clearAllLogs()
      refreshLogs()
    }
  }

  if (logs.length === 0) {
    return (
      <Card className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <div className="text-center text-gray-500">
          <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm sm:text-base">まだ記録がありません</p>
          <p className="text-xs sm:text-sm mt-1">上のボタンから記録を始めましょう</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">記録履歴</h2>
        {logs.length > 0 && (
          <Button
            onClick={handleClearAll}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="text-xs sm:text-sm">全削除</span>
          </Button>
        )}
      </div>
      <div className="space-y-3 sm:space-y-4">
        {logs.map((log, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                <span className="text-sm sm:text-base font-semibold text-gray-900">{log.date}</span>
              </div>
              <Button
                onClick={() => handleDeleteLog(log.date)}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="grid gap-1.5 sm:gap-2 text-xs sm:text-sm">
              {log.wakeUpTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">起床:</span>
                  <span className="font-mono text-gray-900">{formatTime(log.wakeUpTime)}</span>
                  {log.prepTime !== undefined && (
                    <span className="ml-auto text-blue-600 font-semibold text-xs">
                      準備 {formatDuration(log.prepTime)}
                    </span>
                  )}
                </div>
              )}

              {log.studySessions && log.studySessions.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span>学習セッション ({log.studySessions.length}回)</span>
                    {log.totalStudyTime !== undefined && (
                      <span className="ml-auto text-purple-600 font-semibold">
                        合計 {formatDuration(log.totalStudyTime)}
                      </span>
                    )}
                  </div>
                  {log.studySessions.map((session, sessionIndex) => (
                    <div key={sessionIndex} className="flex items-center gap-2 pl-4 border-l-2 border-gray-200">
                      <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500 text-xs">#{sessionIndex + 1}</span>
                      <span className="font-mono text-gray-900">{formatTime(session.startTime)}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-mono text-gray-900">
                        {session.endTime ? formatTime(session.endTime) : "進行中"}
                      </span>
                      {session.duration !== undefined && (
                        <span className="ml-auto text-purple-600 font-semibold text-xs">
                          {formatDuration(session.duration)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
