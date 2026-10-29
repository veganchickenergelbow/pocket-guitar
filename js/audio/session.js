// iOS audio session routing (Safari 16.4+ navigator.audioSession). No-op where unsupported.
let mics = 0;

function setType(type) {
  try {
    if (typeof navigator !== 'undefined' && navigator.audioSession) navigator.audioSession.type = type;
  } catch (e) { /* ignore */ }
}

/** Route audio as playback (plays through the ring/silent switch) unless a mic is active. */
export function setPlayback() {
  if (mics === 0) setType('playback');
}

/** A mic is opening: switch to play-and-record. Pair with setPlaybackAfterMic(). */
export function setPlayRecord() {
  mics += 1;
  setType('play-and-record');
}

/** A mic closed: revert to playback once the last one is gone. */
export function setPlaybackAfterMic() {
  mics = Math.max(0, mics - 1);
  if (mics === 0) setType('playback');
}

/** @returns {boolean} */
export function isMicActive() {
  return mics > 0;
}
