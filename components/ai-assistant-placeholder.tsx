"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Zap } from "lucide-react"
import { useState } from "react"

interface Project {
  id: string
  name: string
  description: string
  tables: any[]
  relationships: any[]
}

interface AIAssistantProps {
  project: Project
}

export function AIAssistant({ project }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi there! I'm your AI schema assistant. I can help you design and optimize your database schema for "${project.name || "your new project"}". What would you like to do?`,
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: prompt }])

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (prompt.toLowerCase().includes("add table")) {
        response = "I can help you add a new table. What would you like to name it and what columns should it have?"
      } else if (prompt.toLowerCase().includes("relationship")) {
        response = "I can help you define relationships between tables. Which tables would you like to connect?"
      } else if (prompt.toLowerCase().includes("optimize")) {
        response =
          "Looking at your schema, I recommend adding indexes to frequently queried columns and ensuring proper normalization to avoid data redundancy."
      } else if (prompt.toLowerCase().includes("generate")) {
        response =
          "I've generated a schema for your project. You can view it in the diagram editor and make any necessary adjustments."
      } else {
        response =
          "I understand you want to work on your schema. Could you provide more specific details about what you'd like to do?"
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    }, 1000)

    setPrompt("")
  }

  return (
    <div className="flex flex-col h-full w-full p-4">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>AI Schema Assistant</CardTitle>
          <CardDescription>Ask questions or give commands to design your database schema</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "assistant" ? "bg-cryptic-block" : "bg-cryptic-accent text-black"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              placeholder="Ask a question or give a command..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-cryptic-background border-white/10"
            />
            <Button type="submit" className="gap-2 bg-cryptic-accent text-black">
              <Zap className="h-4 w-4" /> Ask AI
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
