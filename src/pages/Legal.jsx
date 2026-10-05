import { useEffect } from 'react'
import { Link } from 'wouter'
import { updatePageMetadata } from '../lib/seoOptimization'
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '../config'

const UPDATED = '3 October 2026'

const PAGES = {
  privacy: {
    title: 'Privacy Policy',
    body: () => (
      <>
        <p>This policy explains what {SITE_NAME} ({SITE_URL}) does with information when you use the site. Last updated {UPDATED}.</p>
        <h2>Your files and settings stay on your device</h2>
        <p>The tools run in your browser. Images you open in the image tools are processed locally and are never uploaded. Tool settings (for example brightness or timer length) are saved in your browser's local storage so they are there next time. You can clear them any time in your browser settings.</p>
        <h2>Advertising and cookies</h2>
        <p>The site is supported by Google AdSense. If you accept advertising cookies in the banner, Google and its partners may use cookies and similar technology to show and measure ads, including personalized ads where allowed. If you decline, no ads are loaded. You can change your choice any time using "Cookie settings" in the footer. See <a href="https://policies.google.com/technologies/ads" rel="noopener noreferrer" target="_blank">how Google uses data from sites that use its services</a> and <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">Google Ads Settings</a>.</p>
        <h2>What we do not collect</h2>
        <p>We do not require an account, and we do not ask for your name or email address to use the tools.</p>
        <h2>Hosting logs</h2>
        <p>Our hosting provider may keep standard server logs (such as IP address and browser type) for security and operations.</p>
        <h2>Your rights</h2>
        <p>Depending on where you live, you may have rights to access or delete personal data. Because we do not hold an account database, most requests can be handled by clearing your browser data and using Google's ad controls. For anything else, contact us.</p>
        <h2>Contact</h2>
        <p>Questions? <Link href="/contact">Contact us</Link>.</p>
      </>
    ),
  },
  terms: {
    title: 'Terms of Use',
    body: () => (
      <>
        <p>By using {SITE_NAME} you agree to these terms. Last updated {UPDATED}.</p>
        <h2>Use of the tools</h2>
        <p>The tools are provided free, "as is", without warranties. You are responsible for how you use them. Do not use the prank tools (such as Fake Windows Update, Broken Screen or Hacker Typer) to deceive, harass or cause harm, or in places where a fake system screen could cause alarm.</p>
        <h2>Health and safety</h2>
        <p>Some tools show bright, moving or flickering visuals. Do not use them if you have photosensitive epilepsy or are sensitive to flashing light. Take regular breaks from screens. The dead-pixel and calibration tools give a quick visual check only and are not a substitute for professional calibration.</p>
        <h2>Availability</h2>
        <p>We may change or remove tools at any time and do not guarantee uninterrupted service.</p>
        <h2>Liability</h2>
        <p>To the extent permitted by law, we are not liable for any loss arising from use of the site.</p>
      </>
    ),
  },
  about: {
    title: 'About',
    body: () => (
      <>
        <p>{SITE_NAME} is a free collection of screen utilities that run entirely in your browser: white, black and color screens, a ring light, a Pomodoro timer, a teleprompter, display test patterns, ambient scenes with sound, and simple image tools.</p>
        <p>There is no account to create and nothing to install. Your files never leave your device. The site is supported by advertising, which you can decline in the cookie banner.</p>
        <p>Have a tool idea or found a bug? <Link href="/contact">Get in touch</Link>.</p>
      </>
    ),
  },
  contact: {
    title: 'Contact',
    body: () => (
      <>
        <p>For feedback, bug reports, tool requests or privacy questions, email us:</p>
        <p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        <p>Please mention the tool name and your browser and device if you are reporting a problem.</p>
      </>
    ),
  },
}

export const LEGAL_SLUGS = Object.keys(PAGES)

export default function Legal({ slug }) {
  const page = PAGES[slug]
  useEffect(() => {
    if (page) updatePageMetadata({ title: `${page.title} - ${SITE_NAME}`, description: `${page.title} for ${SITE_NAME}.`, keywords: [page.title.toLowerCase()] })
  }, [page])
  if (!page) return null
  return (
    <article className="max-w-3xl mx-auto px-4 py-16 text-slate-200 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-4 [&_a]:text-blue-400 [&_a:hover]:underline">
      <h1 className="text-4xl font-bold text-white mb-6">{page.title}</h1>
      {page.body()}
    </article>
  )
}
