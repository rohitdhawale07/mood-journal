/**
 * Settings Page
 *
 * This page allows users to configure application settings and
 * export their journal data.
 *
 * @author Rohit Dhawale
 * @date April 2025
 */

"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download, Trash2, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// Components
import { Switch } from "@/components/ui/switch"
import ActionButton from "@/components/ui-components/action-button"

// Services and hooks
import { exportJournalEntries, getJournalEntries } from "@/services/journal-service"
import { useTheme } from "@/hooks/use-theme"
import { useToast } from "@/hooks/use-toast"

// Types
import type { ExportFormat } from "@/types/journal-types"

export default function SettingsPage() {
  // State management
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv")
  const [isExporting, setIsExporting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [entryCount, setEntryCount] = useState(0)

  // Hooks
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()

  // Load entry count on mount
  useEffect(() => {
    const loadEntryCount = async () => {
      try {
        const entries = await getJournalEntries()
        setEntryCount(entries.length)
      } catch (error) {
        console.error("Error loading entries:", error)
        toast({
          title: "Error loading entries",
          description: "Could not load your journal entries",
          variant: "destructive",
        })
      }
    }

    loadEntryCount()
  }, [toast])

  /**
   * Handle exporting journal data
   */
  const handleExport = async () => {
    try {
      setIsExporting(true)

      const entries = await getJournalEntries()

      if (entries.length === 0) {
        toast({
          title: "No entries to export",
          description: "Add some mood entries first",
          variant: "destructive",
        })
        setIsExporting(false)
        return
      }

      try {
        const fileName = exportJournalEntries(entries, exportFormat)

        toast({
          title: "Export successful",
          description: `Your journal has been exported as ${fileName}`,
        })
      } catch (error) {
        console.error("Export error:", error)
        toast({
          title: "Export failed",
          description: "There was an error exporting your data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Export process error:", error)
      toast({
        title: "Export failed",
        description: "There was an error processing your data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  /**
   * Handle clearing all journal data
   */
  const handleClearData = () => {
    if (showConfirmDelete) {
      // Perform the actual deletion
      try {
        localStorage.removeItem("moodJournalEntries")
        setEntryCount(0)
        setShowConfirmDelete(false)

        toast({
          title: "Data cleared",
          description: "All your journal entries have been deleted",
        })
      } catch (error) {
        console.error("Error clearing data:", error)
        toast({
          title: "Error",
          description: "Failed to clear your data",
          variant: "destructive",
        })
      }
    } else {
      // Show confirmation first
      setShowConfirmDelete(true)
    }
  }

  /**
   * Cancel the delete confirmation
   */
  const cancelDelete = () => {
    setShowConfirmDelete(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-orange-300 dark:from-slate-800 dark:to-slate-900 p-4 transition-colors duration-300">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="flex items-center mb-6">
          <Link href="/" className="text-white mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </header>

        {/* Settings card */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-6">
            {/* Theme toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium dark:text-white">Dark Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-orange-400"
                />
                <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>

            {/* Export section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-2 dark:text-white">Export Journal</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Download your mood journal data</p>

              <div className="flex space-x-2 mb-3">
                <button
                  onClick={() => setExportFormat("csv")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    exportFormat === "csv"
                      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  CSV
                </button>
                <button
                  onClick={() => setExportFormat("json")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    exportFormat === "json"
                      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  JSON
                </button>
              </div>

              <ActionButton onClick={handleExport} disabled={isExporting || entryCount === 0} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export Data"}
              </ActionButton>

              {entryCount === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  No entries to export. Add some mood entries first.
                </p>
              )}
            </div>

            {/* Clear data section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-2 dark:text-white">Clear Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Delete all your journal entries</p>

              {showConfirmDelete ? (
                <div className="space-y-2">
                  <p className="text-sm text-red-500 font-medium">Are you sure? This cannot be undone.</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleClearData}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Yes, Delete All
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleClearData}
                  disabled={entryCount === 0}
                  className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </button>
              )}
            </div>

            {/* App info */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">MoodMate v1.0.0</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your data is stored locally on your device</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
