import { toast } from "sonner";

export async function enterFullscreen(): Promise<boolean> {
  try {
    const elem = document.documentElement as any;
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
      return true;
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen();
      return true;
    } else if (elem.mozRequestFullScreen) {
      await elem.mozRequestFullScreen();
      return true;
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen();
      return true;
    } else {
      toast.error("Fullscreen API not supported");
      return false;
    }
  } catch (err: any) {
    if (err.name === "NotAllowedError" || err.message?.includes("Disallowed")) {
      toast.warning("Fullscreen blocked by browser permissions policy");
      console.warn("Fullscreen blocked by permissions policy");
      return false;
    } else {
      console.error("Fullscreen error:", err);
      toast.error("Failed to enter fullscreen");
      return false;
    }
  }
}

export async function exitFullscreen(): Promise<boolean> {
  try {
    const doc = document as any;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return true;
    } else if (doc.webkitFullscreenElement) {
      await doc.webkitExitFullscreen();
      return true;
    } else if (doc.mozFullScreenElement) {
      await doc.mozCancelFullScreen();
      return true;
    } else if (doc.msFullscreenElement) {
      await doc.msExitFullscreen();
      return true;
    }
    return true;
  } catch (err) {
    console.error("Error exiting fullscreen:", err);
    return false;
  }
}

export async function toggleFullscreen(isCurrentlyFullscreen: boolean): Promise<boolean> {
  if (isCurrentlyFullscreen) {
    return await exitFullscreen();
  } else {
    return await enterFullscreen();
  }
}
