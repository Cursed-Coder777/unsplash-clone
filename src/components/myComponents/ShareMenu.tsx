'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, Facebook, X, Mail, Link as LinkIcon } from 'lucide-react'
import { RiPinterestFill } from 'react-icons/ri'

interface ShareMenuProps {
  shareUrl: string
  shareText?: string
}

export default function ShareMenu({ shareUrl, shareText = 'Check out this photo!' }: ShareMenuProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const getShareLink = (provider: 'facebook' | 'pinterest' | 'twitter' | 'email') => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareText)
    switch (provider) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
      case 'pinterest':
        return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
      case 'email':
        return `mailto:?subject=${encodedText}&body=${encodedUrl}`
      default:
        return '#'
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:border-black hover:text-black transition"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Share dropdown"
      >
        <Share2 size={16} />
        <span>Share</span>
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-52 rounded-lg border border-gray-200 bg-white shadow-lg z-50 p-2">
          <a
            href={getShareLink('facebook')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
            onClick={() => setOpen(false)}
          >
            <svg className="facebookIcon-qkSKjN" width="24" height="24" viewBox="0 0 24 24" version="1.1" aria-hidden="false" style={{flexShrink:0}}><desc lang="en-US">Facebook icon</desc><path d="M22 12c0-5.563-4.5-10-10-10S2 6.5 2 12c0 5 3.688 9.125 8.438 9.875v-6.938H7.874V12h2.563V9.812c0-2.5 1.5-3.874 3.75-3.874 1.124 0 2.25.187 2.25.187v2.438h-1.25c-1.25 0-1.626.75-1.626 1.562V12h2.75l-.437 2.875h-2.313v7C18.313 21.187 22 17 22 12Z" fill='#1877f2'></path></svg> Facebook
          </a>
          <a
            href={getShareLink('pinterest')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
            onClick={() => setOpen(false)}
          >
           <svg className="pinterestIcon-lM2VeG" width="24" height="24" viewBox="0 0 24 24" version="1.1" aria-hidden="false" style={{flexShrink:0}}><desc lang="en-US">Pinterest icon</desc><path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.9 6.4 9.3-.1-.8-.2-2 0-2.9.2-.8 1.2-5 1.2-5s-.3-.5-.3-1.4c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.8 0-4.5 2.1-4.5 4.3 0 .9.3 1.8.7 2.3.1.1.1.2.1.3-.1.3-.2 1-.3 1.1 0 .2-.1.2-.3.1-1.2-.6-2-2.4-2-3.9 0-3.2 2.3-6.1 6.6-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.4-2.2 6.2-5.2 6.2-1 0-2-.5-2.3-1.1 0 0-.5 1.9-.6 2.4-.2.9-.8 2-1.2 2.6.8.4 1.8.6 2.8.6 5.5 0 10-4.5 10-10S17.5 2 12 2Z" fill='#e60023'></path></svg> Pintrest
          </a>
          <a
            href={getShareLink('twitter')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
            onClick={() => setOpen(false)}
          >
           <svg className="twitterIcon-xdPtOq" width="24" height="24" viewBox="0 0 24 24" version="1.1" aria-hidden="false" style={{flexShrink:0}}><desc lang="en-US">X (formerly Twitter) icon</desc><path d="M13.69 10.622 20.25 3h-1.555l-5.693 6.618L8.454 3H3.21l6.876 10.007L3.21 21h1.554l6.012-6.99L15.578 21h5.245L13.69 10.622Zm-2.126 2.474-.697-.996-5.543-7.93H7.71l4.474 6.399.697.997 5.815 8.317h-2.387l-4.745-6.787Z"></path></svg> Twitter
          </a>
          <a
            href={getShareLink('email')}
            className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
            onClick={() => setOpen(false)}
          >
            <Mail size={16} /> Email
          </a>

          <button
            type="button"
            onClick={onCopy}
            className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded text-left text-sm text-gray-700"
          >
            <LinkIcon size={16} /> {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      )}
    </div>
  )
}
