import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'STRIVO — Your fitness journey',description:'A calmer way to track your weight, workouts, and personal progress. Private and offline-ready.',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,statusBarStyle:'default',title:'STRIVO'},icons:{icon:'/icon-192.png',apple:'/apple-touch-icon.png'}};
export const viewport: Viewport = {themeColor:'#19291F',width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
