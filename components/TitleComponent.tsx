import type React from "react"

interface TitleComponentProps {
  version: string
}

const TitleComponent: React.FC<TitleComponentProps> = ({ version }) => {
  return (
    <h1 className="text-4xl font-bold mb-8 text-center gradient-text animate-float">
      Planet Mado Combat System (Beta Build v1.0.24-Cursor)
    </h1>
  )
}

export default TitleComponent

