import BackgroundScene from "./BackgroundScene"


interface MessagePreviewProps {
  recipientName: string
  message: string
  theme: string
}

export default function MessagePreview({ recipientName, message, theme }: MessagePreviewProps) {
  return (
    <div className="relative h-96 rounded-xl overflow-hidden">
      <BackgroundScene theme={theme} preview={true} />
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
          Good morning, {recipientName}
        </h3>
        <p className="text-white/90 drop-shadow-md">{message}</p>
      </div>
    </div>
  )
}