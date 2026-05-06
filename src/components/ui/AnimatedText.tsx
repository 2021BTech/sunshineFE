import { motion, type Variants } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  once?: boolean
  type?: 'words' | 'chars' | 'gradient'
}

export default function AnimatedText({ text, className = '', delay = 0, once = true, type = 'words' }: AnimatedTextProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: type === 'chars' ? 0.03 : 0.08, delayChildren: delay },
    },
  }

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  }

  if (type === 'gradient') {
    return (
      <motion.div
        className={`bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-300% animate-gradient ${className}`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        {text}
      </motion.div>
    )
  }

  const items = type === 'chars' ? text.split('') : text.split(' ')

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
      viewport={{ once }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ 
            display: 'inline-block', 
            marginRight: type === 'chars' ? '0' : '0.25em',
            marginBottom: type === 'chars' ? '0' : '0'
          }}
        >
          {item}
        </motion.span>
      ))}
    </motion.div>
  )
}