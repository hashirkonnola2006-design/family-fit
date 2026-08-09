import * as React from "react"

const Card = React.forwardRef(({ className = "", style = {}, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-2xl border border-[#EAEFE5] bg-white text-slate-800 shadow-sm ${className}`}
    style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #EAEFE5',
      boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
      ...style,
    }}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className = "", style = {}, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    style={style}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className = "", style = {}, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-xl font-semibold leading-none tracking-tight ${className}`}
    style={style}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className = "", style = {}, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-slate-500 ${className}`}
    style={style}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className = "", style = {}, ...props }, ref) => (
  <div ref={ref} className={`p-4 ${className}`} style={style} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className = "", style = {}, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-4 pt-0 ${className}`}
    style={style}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
