// Help text for the configurable screen pages, scenes and newer tools.
const c = (how, uses, faq, extra = {}) => ({ how, uses, faq, ...extra })
const STD = (extra) => ['Open the page; the whole screen fills with the color.', 'Move the mouse or tap to show the controls: brightness' + (extra || '') + ', size, PNG download, share link, grid and OLED protection.', 'Press F for fullscreen and Esc to leave.']

const colorPage = (name, uses, faq) => c(STD(), uses, [
  ...faq,
  ['Can I download this as an image?', `Yes. Choose a size and press PNG to save a solid ${name} image, up to 8K if your device allows it.`],
  ['Can I send someone this exact screen?', 'Press Share to copy a link that opens the page with your brightness setting.'],
])

export const NEW_CONTENT = {
  'white-screen': c(
    STD(), ['Soft fill light for video calls and photos', 'Spotting dust and smudges when cleaning a screen', 'Checking a monitor for dirt, stuck pixels and uneven backlight', 'A plain white backdrop for scanning and drawing'],
    [['Does a white screen damage my display?', 'No. Showing white is normal use. On OLED screens, avoid leaving any static image on for many hours; the OLED button shifts brightness slightly to help.'],
     ['How do I make it dimmer or warmer?', 'Use the brightness slider. For a warmer or cooler white, open the Zoom Lighting or Reading Light page, which have a warmth slider.'],
     ['How do I keep the screen from going to sleep?', 'The page asks your browser to keep the screen awake while it is open. If your device still sleeps, change its power settings.'],
     ['How do I use it as a light on a phone?', 'Open the page, tap once, press the fullscreen button and turn the phone brightness all the way up.'],
     ['Why can I see a line or edge in fullscreen?', 'Some browsers show a small bar for a moment. Move the mouse away or tap again. The picture itself is a single flat color.']]),
  'black-screen': c(
    STD(), ['Resting an OLED display without turning it off', 'A dark backdrop for projectors and presentations', 'Checking backlight bleed and glow in a dark room', 'Blacking out a screen while audio keeps playing'],
    [['Does black save power?', 'On OLED and AMOLED displays black pixels are switched off, so power use drops. On regular LCD screens the backlight stays on, so savings are small.'],
     ['How do I test for backlight bleed?', 'Go fullscreen in a dark room and look for bright patches at the edges and corners. Small amounts are normal.'],
     ['Will a black screen stop burn-in?', 'It does not repair burn-in, but it does not cause it. Varying what is on the screen over time is the best prevention.']]),
  'green-screen': c(
    ['Open the page and press F for fullscreen.', 'Put the screen behind your subject, lit evenly.', 'In your video software, set the chroma key to the green shown.'], ['Quick chroma-key backdrop for streaming', 'Testing keying settings in OBS or editing apps', 'Small product-photo backgrounds'],
    [['Which green does it use?', 'A standard chroma-key green (#00B140). You can change brightness if your camera sees it too hot.'],
     ['Is this a good replacement for a real green screen?', 'It works for small subjects. For full-body shots, a fabric green screen is better.'],
     ['Why does my key look noisy?', 'Uneven light and shiny clothing cause most problems. Light the subject separately from the screen.']]),
  'color-screen': c(
    ['Pick a color with the color picker or type a hex code (for example #1e90ff).', 'Adjust brightness, then press Share to copy a link to that exact color.', 'Press F for fullscreen.'],
    ['Colored mood lighting', 'Checking color accuracy and tint on a display', 'Solid-color backgrounds for photos and video', 'Making a quick solid-color image at any size'],
    [['Can I use a hex code?', 'Yes. Type it into the Hex field. Three-digit codes like #f80 also work.'], ['Can I copy my color for later?', 'Press Share. The link opens the page with the same color and brightness.'], ['What sizes can I download?', 'Your screen size, or 480p up to 8K. Very large sizes may not work on phones.']]),
  'red-screen': colorPage('red', ['Low-glare light at night with less blue than white', 'Checking the red channel for stuck or dead pixels', 'Photo and video backdrops, party and mood lighting'],
    [['Is red light better at night?', 'Red has much less blue light than white, so many people find it gentler in the dark. It is a comfort choice, not a medical treatment.'], ['Why are some pixels not red?', 'On a pure red screen, any dot that stays dark, white or another color is a stuck or dead pixel.']]),
  'blue-screen': colorPage('blue', ['Checking the blue channel for stuck or dead pixels', 'A calm blue backdrop for video, or a chroma-key alternative to green', 'Cool ambient lighting'],
    [['Is this the blue screen of death?', 'No. This is a plain blue color screen. For the crash-screen prank, use the Blue Screen Prank page.'], ['Should I use blue or green for chroma key?', 'Green is more common because cameras capture it well. Choose blue if your subject wears green.']]),
  'yellow-screen': colorPage('yellow', ['Checking red and green subpixels together (yellow is red plus green)', 'Warm, bright backdrops and decor', 'Attention-getting signal screens'],
    [['Why does yellow reveal pixel problems?', 'Yellow uses both the red and green subpixels, so a dead subpixel shows as a color shift.']]),
  'orange-screen': colorPage('orange', ['Warm ambience and sunset-style lighting', 'Checking color blending on a display', 'Party and photo backdrops'],
    [['Is orange screen light warmer than white?', 'Yes, it has no blue and little green. For a natural warm white, use the Reading Light page and adjust the warmth.']]),
  'pink-screen': colorPage('pink', ['Soft rosy fill light for photos and selfies', 'Decor and party backdrops', 'Testing color blending on a display'],
    [['Will pink light look good on camera?', 'It adds a warm tint to skin. For a neutral look, try Selfie Light instead and adjust the warmth.']]),
  'purple-screen': colorPage('purple', ['Gaming and room ambience', 'Backdrops for streams and photos', 'Checking blue and red mixing on a display'],
    [['Can I use this behind my monitor?', 'Yes. Put a phone or tablet behind your desk and show the page fullscreen for ambient color.']]),
  'cyan-screen': colorPage('cyan', ['Checking green and blue subpixels together', 'Cool ambient lighting', 'Sci-fi and tech-style backdrops'],
    [['What is cyan?', 'Cyan is green plus blue light, with no red. A red tint or a dark dot on this screen points to a panel problem.']]),
  'gray-screen': colorPage('gray', ['Checking screen uniformity and color tint', 'Resting your eyes from a bright white screen', 'A neutral background while checking colors'],
    [['Why use mid-gray to test a screen?', 'Gray makes uneven brightness and color tints easier to see than white or black do.'], ['Is this accurate calibration?', 'No. It is a quick visual check. A hardware calibrator measures colors properly.']]),
  'zoom-lighting': c(
    ['Open the page and put the screen close to your camera, in front of your face.', 'Set warmth and brightness until your face looks natural on camera.', 'Press F for fullscreen. A second device works best, so you can still see your call.'],
    ['Lighting your face for video calls', 'Evening calls when the room is dark', 'Recording videos without extra lamps'],
    [['What setting should I use?', 'Start near 5000K and 90% brightness, which looks neutral for most skin tones. Make it warmer if your face looks too pale.'], ['Will it light my face well?', 'It helps in dim rooms, especially on a large screen near your camera. A real lamp is stronger.'], ['Can I use my laptop screen?', 'You can, but then your call window is hidden in fullscreen. Using a phone or tablet is usually easier.'], ['Why does my face still look dark?', 'Light from behind you, such as a bright window, fools your camera. Face the light source instead.']]),
  'makeup-mirror': c(
    ['Open the page and hold your phone or laptop beside your mirror.', 'Choose a neutral warmth near 5500K and full brightness.', 'Press F for fullscreen.'],
    ['Evenly lit makeup application in a dim room', 'Close-up grooming and skincare', 'Checking foundation shade under neutral light'],
    [['Is screen light accurate for matching makeup?', 'It is close to neutral daylight at about 5500K, but check important color choices near a window too.'], ['Can I make it warmer?', 'Yes, lower the warmth slider for an evening look.']]),
  'selfie-light': c(
    ['Open the page on a second phone or tablet and hold it near your camera.', 'Adjust warmth and brightness to your skin tone.', 'Press F for fullscreen.'],
    ['Fill light for selfies and photos in the dark', 'Soft light for online profile pictures', 'Light for video notes'],
    [['Does this work with a phone camera?', 'Yes. Hold it close to your face or place it on a stand next to the camera.'], ['What if the screen is too bright?', 'Lower brightness. Too much light flattens your face and can wash out the photo.']]),
  'night-light': c(
    ['Open the page and lower the brightness until it is just enough.', 'Place the device where you need a faint light.', 'Press F for fullscreen.'],
    ['A dim light for moving around at night', 'Reading in the dark without a bright screen', 'Low-glare light for quiet rooms'],
    [['Why red?', 'Red light contains very little blue, so it is less harsh on your eyes in the dark. It is a comfort choice, not a medical treatment.'], ['Will it use much battery?', 'At low brightness on an OLED phone it uses little power. On an LCD screen the backlight is still on.']]),
  'reading-light': c(
    ['Open the page and adjust brightness until it is comfortable.', 'Lower the warmth slider for a softer evening look.', 'Press F for fullscreen.'],
    ['Soft warm light for reading and winding down', 'A dim lamp substitute', 'Warm backdrops for photos'],
    [['What temperature is best for reading?', 'Many people like about 3000K in the evening, which looks like a warm bulb. Pick what feels comfortable.'], ['Can I make it brighter?', 'Yes, raise the brightness slider, or switch to a cooler warmth for daytime use.']]),
  'clean-screen': c(
    ['If you can, turn the device off and unplug it first.', 'Open this page to see every speck of dust against a bright white screen.', 'Wipe gently with a dry microfiber cloth, in one direction.'],
    ['Finding smudges and dust on a monitor or laptop', 'Cleaning a phone or tablet screen', 'Checking that all marks are gone'],
    [['What should I clean a screen with?', 'A dry or very slightly damp microfiber cloth. Do not spray liquid on the screen.'], ['Why does a white screen help?', 'White light behind the glass makes fingerprints and dust stand out clearly.'], ['Can I use household cleaners?', 'No. Many cleaners damage coatings. Check your device maker\'s advice.']]),
  'countdown-timer': c(
    ['Choose a preset or type hours, minutes and seconds.', 'Press Start or Space. The tab title shows the time left.', 'An alarm sounds when time is up. Press F for a full-screen display.'],
    ['Cooking, workouts and study blocks', 'Meeting and presentation timing', 'Classroom and game countdowns', 'Sharing a timer link, for example /tools/countdown-timer?t=300'],
    [['Can I share a timer?', 'Yes. Add ?t=SECONDS to the page address, for example ?t=600 for ten minutes.'], ['Does it keep running in the background?', 'Yes. It uses the clock, not a frame counter, so it stays accurate when the tab is hidden. Browsers may limit sound in background tabs.'], ['Will the alarm be loud?', 'It is a short series of beeps. Check your device volume first.']]),
  'stopwatch': c(
    ['Press Start or Space to begin.', 'Press Lap or L to record a split.', 'Press Stop, or R to reset.'],
    ['Timing workouts, races and tasks', 'Comparing lap or split times', 'Classroom activities'],
    [['How precise is it?', 'It shows hundredths of a second. Accuracy depends on your device and browser.'], ['What do the colors in the lap list mean?', 'Green is your fastest lap and red your slowest, once you have three or more.']]),
  'flip-clock': c(
    ['Open the page and press F for a big full-screen clock.', 'Switch between 12 and 24 hour, and show or hide seconds and the date.', 'Your choices are remembered.'],
    ['A desk or bedside clock on a spare tablet', 'A big clock for classrooms and events', 'Streams and videos that need a visible time'],
    [['Does it use my local time?', 'Yes, it uses your device clock and time zone.'], ['Will the screen stay on?', 'The page asks your browser to keep the screen awake while it is open.'], ['Will it burn in an OLED screen?', 'A static clock on an OLED screen for many hours can cause image retention. Use it for short periods or with a dim screen.']]),
  'blue-screen-of-death': c(
    ['Open the page and press F for fullscreen.', 'The counter climbs as if the device is collecting error data.', 'Press Esc to leave.'],
    ['Harmless pranks on friends and family', 'Video and meme backgrounds'],
    [['Is this a real crash?', 'No. It is just a web page. Press Esc or reload to get your screen back.'], ['Will it harm my computer?', 'No. Nothing on your device is changed.']], { flash: false }),
  'bouncing-logo': c(
    ['Open the page and press F for fullscreen.', 'Type your own text and change the speed.', 'Watch the counter for perfect corner hits.'],
    ['A nostalgic screensaver for a spare screen', 'Waiting for the perfect corner hit', 'Idle displays at events'],
    [['Why do people wait for the corner?', 'On the classic DVD player screensaver, a logo hitting a corner exactly is rare and satisfying.'], ['Can I change the logo?', 'You can change the text. Your choices are remembered.']]),
  'white-noise': c(
    ['Press the play button or Space.', 'Set the volume and, if you like, a sleep timer.', 'Keep the tab open while it plays.'],
    ['Masking background noise at work', 'Sleep and naps', 'Focus while studying'],
    [['What is white noise?', 'Noise with equal energy across all frequencies, which sounds like a steady hiss.'], ['Does it work offline?', 'Yes. The sound is generated in your browser once the page has loaded.'], ['How loud should it be?', 'Keep it comfortably low. It should cover other sounds without being the main thing you hear.'], ['Will it keep playing if I lock my phone?', 'That depends on your browser and device. Many phones pause web audio when the screen locks.']]),
  'brown-noise': c(
    ['Press the play button or Space.', 'Set the volume and, if you like, a sleep timer.', 'Keep the tab open while it plays.'],
    ['Deep, soft background sound for focus', 'Relaxing or sleeping', 'Masking low rumbles and voices'],
    [['What is brown noise?', 'Noise with more energy in low frequencies, so it sounds deeper and rounder than white noise.'], ['How is it different from pink noise?', 'Pink noise is in between white and brown. Brown is the deepest and softest of the three.'], ['Will it work on headphones?', 'Yes. Small speakers may not reproduce the lowest frequencies well, so headphones or larger speakers help.']]),
  'pink-noise': c(
    ['Press the play button or Space.', 'Set the volume and, if you like, a sleep timer.', 'Keep the tab open while it plays.'],
    ['Steady background for sleep and focus', 'Sounds like gentle rainfall to many people', 'Masking background noise'],
    [['What is pink noise?', 'Noise whose energy falls as frequency rises, which sounds softer and more natural than white noise.'], ['Does it help sleep?', 'Some people find steady sound helps them relax and ignore other noises. Results vary and it is not a medical treatment.']]),
}

// Extra questions appended to existing tools.
export const EXTRA_FAQ = {
  'ring-light': [['How do I use it with my camera?', 'Place the screen right next to your camera or phone, facing you, then adjust brightness until your face looks even.'], ['What does Warm, Cool and RGB mean?', 'Warm is yellower, Cool is whiter and bluer, and RGB slowly cycles colors for effects.'], ['Why is my screen light not bright enough?', 'Raise your device\'s own brightness to maximum. A bigger screen gives more light.']],
  'dead-pixel': [['What is the difference between a dead and a stuck pixel?', 'A dead pixel stays black on every color. A stuck pixel stays on one color, such as red, while the rest change.'], ['How do I test properly?', 'Go fullscreen, step through all colors, and look closely at the whole screen in a dim room. Clean the screen first so dust is not mistaken for a pixel.'], ['Can I fix a stuck pixel?', 'Sometimes gentle pressure or time fixes a stuck pixel. Dead pixels usually need a repair or replacement. Check your warranty.']],
  'pomodoro': [['How long should breaks be?', 'The classic method uses 5-minute breaks and a longer 15-30 minute break after four work sessions.'], ['Will it alert me?', 'It beeps when a session ends and shows the time in the tab title.'], ['Are my settings saved?', 'Work and break lengths are saved in your browser.']],
  'teleprompter': [['How do I set the right speed?', 'Read your script aloud once and adjust the speed until it matches your natural pace.'], ['Can I mirror the text?', 'Use a camera or mirror setup that suits your rig. Increase the font size so it is readable from a distance.'], ['Is my script saved?', 'It stays in your browser on your device.']],
  'sound-mixer': [['What sounds are included?', 'Rain, white noise and cafe sounds. Each has its own volume.'], ['Are these recordings?', 'No. They are generated live in your browser, so they work offline and never loop obviously.']],
  'focus-mode': [['What does focus mode do?', 'It gives you a calm timed screen so you can work without visual clutter.']],
}
