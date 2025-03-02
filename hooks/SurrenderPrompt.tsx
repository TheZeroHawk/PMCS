import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SurrenderPromptProps {
  enemyName: string
  onAccept: () => void
  onDecline: () => void
}

export const SurrenderPrompt: React.FC<SurrenderPromptProps> = ({ enemyName, onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 bg-gray-800 border-2 border-purple-500">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Enemy Surrender</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white">{enemyName} is offering to surrender. Do you accept?</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onAccept} className="bg-green-500 hover:bg-green-600">
            Accept Surrender
          </Button>
          <Button onClick={onDecline} className="bg-red-500 hover:bg-red-600">
            Decline Surrender
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

