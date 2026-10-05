// Help text shown under every tool: improves usability, SEO and ad-policy compliance.
// flash: tool has flashing/strobing visuals -> photosensitivity warning.
import { NEW_CONTENT, EXTRA_FAQ } from './toolContentNew.js'

const c = (how, uses, faq, extra = {}) => ({ how, uses, faq, ...extra })

const BASE = {
  'white-screen': c(
    ['Open the tool; the screen turns white.', 'Move the mouse or tap to reveal the brightness control.', 'Press F (or the expand button) for fullscreen; press Esc to exit.'],
    ['Soft fill light for video calls and photos', 'Checking a monitor for dirt, dust and uneven backlight', 'Emergency flashlight or reading light'],
    [['Does a white screen damage my display?', 'No. Showing white is normal use. For OLED screens, avoid leaving any static image on for many hours.'], ['Can I make it dimmer?', 'Yes, use the brightness slider. The screen\'s own brightness setting still applies on top of it.']]),
  'black-screen': c(
    ['Open the tool; the screen turns black.', 'Move the mouse to reveal controls.', 'Press F for fullscreen, Esc to leave.'],
    ['Resting an OLED screen without turning it off', 'Dark backdrop for projectors and presentations', 'Checking backlight bleed in a dark room'],
    [['Does black save power?', 'On OLED and AMOLED displays, yes. On regular LCD screens the backlight stays on, so savings are small.']]),
  'color-screen': c(
    ['Pick a color with the color picker.', 'Copy the hex code if you need it elsewhere.', 'Go fullscreen with F.'],
    ['Colored mood lighting', 'Checking color accuracy and tint on a display', 'Solid-color backgrounds for photos and video'],
    [['Can I copy the color?', 'Yes, the copy button puts the hex code on your clipboard.']]),
  'green-screen': c(
    ['Open the tool and go fullscreen with F.', 'Place it behind your subject.', 'Set your video software\'s chroma key to the green shown.'],
    ['Quick chroma-key backdrop for streaming', 'Testing keying settings', 'Small product-photo backgrounds'],
    [['Is this a good replacement for a real green screen?', 'It works for small subjects. For full-body shots, a fabric green screen is better.']]),
  'dead-pixel': c(
    ['Go fullscreen with F.', 'Cycle through solid colors with the arrow keys or controls.', 'Look closely for dots that stay a different color or stay black.'],
    ['Inspecting a new monitor, phone or laptop', 'Checking a used screen before buying', 'Gathering evidence for a warranty claim'],
    [['Can this fix dead pixels?', 'It only finds them. A stuck pixel may recover; a dead pixel usually does not.']],
    { flash: false }),
  'gray-balance': c(
    ['Open the tool and choose a gray level.', 'Look for any color tint or uneven patches.', 'Adjust your monitor\'s color settings if you see a tint.'],
    ['Checking for color tint', 'Checking panel uniformity', 'Basic calibration before editing photos'],
    [['Does this replace a hardware calibrator?', 'No. It is a quick visual check, not a measured calibration.']]),
  'brightness': c(
    ['Open the tool and go fullscreen.', 'Adjust your monitor until the darkest steps are just visible and the brightest steps are distinct.', 'Repeat in your usual room lighting.'],
    ['Setting monitor brightness and contrast', 'Checking black detail and highlight clipping', 'Matching two monitors'],
    [['Why do I see no difference between dark steps?', 'Your brightness is probably too low, or the room lighting is washing out the screen.']]),
  'ring-light': c(
    ['Choose Warm, Cool or RGB mode.', 'Set the brightness.', 'Go fullscreen and position the screen near your camera.'],
    ['Face lighting for video calls', 'Fill light for streaming and selfies', 'Previewing a ring light before buying one'],
    [['Is a screen as good as a real ring light?', 'It helps a lot in dim rooms, but a real ring light is brighter and has a more even output.'], ['Is RGB mode safe?', 'RGB mode cycles colors slowly. If you are sensitive to flashing light, use Warm or Cool.']],
    { flash: false }),
  'teleprompter': c(
    ['Paste your script into the text box.', 'Set the speed and font size.', 'Press Space to start or pause, and F for fullscreen.'],
    ['Recording videos and presentations', 'Speeches and livestreams', 'Practicing your delivery'],
    [['Is my script saved or uploaded?', 'No. It stays in your browser.']]),
  'pomodoro': c(
    ['Set the work and break lengths.', 'Press Space or the play button to start.', 'The screen stays awake while the tool is open, and you hear a beep when a session ends.'],
    ['Study and work sessions', 'Taking regular breaks from the screen', 'Time-boxing tasks'],
    [['What is the Pomodoro technique?', 'Work for 25 minutes, rest for 5, and take a longer break after four rounds.']]),
  'focus-mode': c(
    ['Choose a session length.', 'Start the session and keep the screen minimal.', 'Use fullscreen to hide other distractions.'],
    ['Deep work', 'Studying', 'Reducing screen clutter'],
    [['Does it block other sites?', 'No. A website cannot block other apps; it only gives you a calm, distraction-free screen.']]),
  'broken-screen': c(
    ['Open the tool and go fullscreen.', 'Click to add more cracks if the tool allows it.', 'Press Esc to exit.'],
    ['Harmless pranks on friends', 'Video and photo effects'],
    [['Is this really broken?', 'No. It is just an image. Reload the page or press Esc to remove it.']]),
  'crt-effect': c(
    ['Open the tool and go fullscreen.', 'Adjust the scanlines and glow if the controls are shown.', 'Press Esc to exit.'],
    ['Retro video backgrounds', 'Nostalgic ambience'],
    [['Will this flicker?', 'Not strongly, but if you are sensitive to flicker, skip fullscreen.']],
    { flash: true }),
  'matrix': c(
    ['Open the tool and go fullscreen.', 'Watch the code fall.', 'Press Esc to exit.'],
    ['Backgrounds for streams and talks', 'Desktop ambience'],
    [['Does this use a lot of battery?', 'It is an animation, so it uses more power than a static screen. Close it when you are done.']]),
  'neon': c(
    ['Type your text.', 'Pick a neon color.', 'Go fullscreen for a glowing sign.'],
    ['Backdrops for videos and photos', 'Party and room decoration'],
    [['Can I save it?', 'Take a screenshot or screen-record the fullscreen view.']]),
  'starfield': c(
    ['Open the tool and go fullscreen.', 'Relax and watch the stars.', 'Press Esc to exit.'],
    ['Calm background for music and streams', 'Screensaver'],
    [['Why does it look like it is moving fast?', 'It simulates flying through space. Close the tool if the motion bothers you.']]),
  'hacker': c(
    ['Click the page to focus.', 'Type any keys; code appears as you type.', 'Press Esc to stop.'],
    ['Fun demos and jokes', 'Video backgrounds'],
    [['Is this real hacking?', 'No. It prints pre-written code as you press keys.']]),
  'windows-update': c(
    ['Open the tool and press F for fullscreen.', 'Leave the update screen on.', 'Press R to reset or Esc to exit.'],
    ['Harmless pranks', 'Screen-lock look for demos'],
    [['Is this a real update?', 'No. It is a visual imitation for fun. Nothing on your computer is changed.']]),
  'sound-mixer': c(
    ['Press play on the sounds you want.', 'Set the volume of each one.', 'Mix them for focus or sleep.'],
    ['Study and work focus', 'Sleep and relaxation', 'Masking background noise'],
    [['Does it work offline?', 'The sounds are generated in your browser, so yes, once the page is loaded.']]),
  'forest': c(['Open the tool.', 'Turn the sound on if you want it.', 'Go fullscreen for a calming scene.'], ['Relaxation', 'Focus', 'Background for videos'], [['Will it keep playing in the background?', 'Only while the tab is open.']]),
  'ocean': c(['Open the tool.', 'Turn the sound on if you want it.', 'Go fullscreen for a calming scene.'], ['Relaxation', 'Focus', 'Sleep'], [['Is the sound loud?', 'Use the volume control; the default is gentle.']]),
  'fireplace': c(['Open the tool.', 'Turn the sound on if you want it.', 'Go fullscreen for a cozy scene.'], ['Cozy evenings', 'Focus', 'Background for gatherings'], [['Does the flame flicker?', 'It moves softly. Skip fullscreen if you are sensitive to flicker.']], { flash: true }),
  'northern-lights': c(['Open the tool.', 'Turn the sound on if you want it.', 'Go fullscreen for a slow aurora.'], ['Relaxation', 'Sleep', 'Background for streams'], [['Is it fast moving?', 'No. The motion is slow and smooth.']]),
  'format-optimizer': c(
    ['Drop an image or choose one.', 'Set the quality and, if you like, a maximum width.', 'Click a format to convert, then download the result.'],
    ['Making images smaller for websites', 'Converting to modern WebP or AVIF', 'Saving PNG as JPG'],
    [['Are my images uploaded?', 'No. Conversion happens in your browser.'], ['Why is AVIF not available?', 'Some browsers cannot create AVIF files. Try WebP instead, or use a recent Chrome or Edge.']]),
  'batch-processor': c(
    ['Add several images.', 'Choose a preset (web, social, thumbnails or lossless).', 'Process them, then download everything as one ZIP.'],
    ['Preparing a photo set for a website', 'Making thumbnails', 'Resizing for social media'],
    [['Is there a file limit?', 'Only your device\'s memory. Large batches of big photos may be slow.']]),
  'ai-enhance': c(
    ['Open an image.', 'Adjust the sliders and watch the preview.', 'Click Save PNG to download the full-resolution result.'],
    ['Quick photo touch-ups', 'Brightening dark photos', 'Black and white or sepia looks'],
    [['Does this use AI?', 'No. It uses standard image filters that run in your browser, with no uploads.']]),
}

export const TOOL_CONTENT = (() => {
  const all = { ...BASE, ...NEW_CONTENT }
  for (const [id, extra] of Object.entries(EXTRA_FAQ)) if (all[id]) all[id] = { ...all[id], faq: [...all[id].faq, ...extra] }
  return all
})()

export const getToolContent = (id) => TOOL_CONTENT[id]
