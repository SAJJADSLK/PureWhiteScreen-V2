// Page titles/descriptions shared by the runtime (App) and the build-time prerenderer.
export const SITE_NAME = 'Pure White Screen'
export const SITE_URL = 'https://www.purewhitescreen.online'

export const HOME_META = {
  title: `${SITE_NAME} - Free Online Screen Tools`,
  description: 'Free online white screen, black screen, color screen, ring light, Pomodoro timer, teleprompter, dead pixel test, ambient sounds and image tools. No signup.',
}

export const toolMeta = (tool) => ({
  title: `${tool.name} - Free Online Tool | ${SITE_NAME}`,
  description: `${tool.desc} Free online ${tool.name.toLowerCase()}: works in your browser, no signup or install.`,
})
